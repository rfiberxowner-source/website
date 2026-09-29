import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cron from 'node-cron';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SPREADSHEET_ID = '110f013_8ZR7Uy_lLnRKER6oK8jxrPwZmJGkudESjObo';
const KEYFILEPATH = path.join(__dirname, 'audioanalysisdb-4ad5f47fd484.json');

let sheetsAPI = null;
let db = null;

export async function initSheetsSync(firestoreDb) {
    db = firestoreDb;
    try {
        let authOpts = { scopes: ['https://www.googleapis.com/auth/spreadsheets'] };
        if (process.env.GOOGLE_CREDENTIALS) {
            const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
            authOpts.credentials = credentials;
        } else {
            authOpts.keyFile = KEYFILEPATH;
        }
        const auth = new google.auth.GoogleAuth(authOpts);
        sheetsAPI = google.sheets({ version: 'v4', auth });
        console.log("🚀 Google Sheets Auto-Sync Initialized");

        // Start listening to payments collection
        listenForPayments();
        
        // Start listening for new users to append to sheets
        listenForNewUsers();

        // Schedule Monthly Rollover (Runs exactly at midnight on the 1st of every month)
        cron.schedule('0 0 1 * *', async () => {
            console.log("📅 Monthly rollover triggered! Creating new Google Sheet...");
            await createNewMonthSheet();
        });

    } catch (err) {
        console.error("❌ Failed to initialize Google Sheets Sync:", err);
    }
}

async function getLatestSheetName() {
    const res = await sheetsAPI.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
    const sheets = res.data.sheets;
    // Assume the last sheet in the array is the most recent month
    return sheets[sheets.length - 1].properties.title;
}

async function getSheetIdByName(sheetName) {
    const res = await sheetsAPI.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
    const sheet = res.data.sheets.find(s => s.properties.title === sheetName);
    return sheet ? sheet.properties.sheetId : null;
}

// Map Column index to letter (0 -> A, 1 -> B)
function colToLetter(colIndex) {
    let letter = '';
    while (colIndex >= 0) {
        letter = String.fromCharCode((colIndex % 26) + 65) + letter;
        colIndex = Math.floor(colIndex / 26) - 1;
    }
    return letter;
}

function listenForPayments() {
    console.log("👀 Listening for new payments and deletions to sync to Google Sheets...");
    
    // We listen to ALL payments so we can catch deletions of older payments.
    // To avoid spamming the Sheets API with old payments on server restart,
    // we only sync "added/modified" payments if they are from the last 24 hours.
    
    db.collection('payments').onSnapshot(async (snapshot) => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        for (const change of snapshot.docChanges()) {
            const payment = change.doc.data();
            
            if (change.type === 'added' || change.type === 'modified') {
                const paymentDate = payment.timestamp ? payment.timestamp.toDate() : (payment.datePaid ? new Date(payment.datePaid) : new Date(0));
                
                if (paymentDate > yesterday) {
                    await syncPaymentToSheet(payment);
                }
            } else if (change.type === 'removed') {
                console.log(`🗑️ Payment deleted for ${payment.customerName || payment.accountNumber}. Reverting in Google Sheets...`);
                await revertPaymentInSheet(payment);
            }
        }
    });
}

function colIndexToLetter(index) {
    let temp, letter = '';
    while (index >= 0) {
        temp = index % 26;
        letter = String.fromCharCode(temp + 65) + letter;
        index = (index - temp - 1) / 26;
    }
    return letter;
}

export async function syncPaymentToSheet(payment) {
    if (!sheetsAPI) return;
    try {
        let sheetName = payment.billingMonth || payment.month;
        if (!sheetName) {
            sheetName = await getLatestSheetName();
        }
        const res = await sheetsAPI.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: `${sheetName}!A:Z`, // Fetch up to Column Z just in case
        });

        const rows = res.data.values;
        if (!rows) return;

        // 1. Identify Columns Dynamically from Headers (Search first 5 rows)
        let colDatePaid = 5; // default F (index 5)
        let colStatus = 6;   // default G
        let colRef = 8;      // default I
        let colPlan = 9;     // default J
        let colAmt = 10;     // default K
        let headerRow = 1;   // default row 2 (index 1)

        for(let r = 0; r < Math.min(rows.length, 5); r++) {
            const h = rows[r].map(c => (c || '').toLowerCase().trim());
            if (h.includes('payment status') || h.includes('status')) {
                headerRow = r;
                let cDP = h.findIndex(x => x.includes('date of payment') || x.includes('date paid') || (x.includes('date') && !x.includes('due')));
                if (cDP !== -1) colDatePaid = cDP;
                let cS = h.findIndex(x => x === 'payment status' || x === 'status');
                if (cS !== -1) colStatus = cS;
                let cR = h.findIndex(x => x.includes('ref. no.') || x.includes('ref no') || x.includes('reference'));
                if (cR !== -1) colRef = cR;
                let cP = h.findIndex(x => x.includes('plan'));
                if (cP !== -1) colPlan = cP;
                let cA = h.findIndex(x => x.includes('amount'));
                if (cA !== -1) colAmt = cA;
                break;
            }
        }

        // 2. Find the user's row
        let rowIndex = -1;
        const targetName = (payment.customerName || '').toLowerCase().trim();
        const targetAccount = (payment.accountNumber || '').toLowerCase().trim();
        
        const stripStr = (str) => str.replace(/[^a-z0-9]/g, '');
        const strippedTargetName = stripStr(targetName);
        
        for (let i = headerRow + 1; i < rows.length; i++) {
            const rowData = rows[i];
            
            // Search ENTIRE row for Account Number
            let foundByAccount = false;
            if (targetAccount !== '') {
                for (let col = 0; col < rowData.length; col++) {
                    if ((rowData[col] || '').toLowerCase().trim() === targetAccount) {
                        foundByAccount = true;
                        break;
                    }
                }
            }

            if (foundByAccount) {
                rowIndex = i + 1;
                break;
            }

            // Fallback: Name Match (Check Column A and B)
            const rowNameA = (rowData[0] || '').toLowerCase().trim();
            const rowNameB = (rowData[1] || '').toLowerCase().trim();
            const strippedA = stripStr(rowNameA);
            const strippedB = stripStr(rowNameB);

            if (targetName !== '' && (rowNameA === targetName || rowNameB === targetName)) {
                rowIndex = i + 1;
                break;
            } else if (strippedTargetName !== '' && (strippedA === strippedTargetName || strippedB === strippedTargetName)) {
                rowIndex = i + 1;
                break;
            }
        }

        if (rowIndex !== -1) {
            const rowStatus = (rows[rowIndex - 1][colStatus] || '').trim().toUpperCase();
            if (rowStatus === 'PAID') {
                console.log(`Row ${rowIndex} is already PAID. Skipping overwrite.`);
                return;
            }
        }

        if (rowIndex === -1) {
            console.warn(`Could not find row for ${targetName} / ${targetAccount} in sheet ${sheetName}`);
            return;
        }

        // 3. Prepare Updates
        let datePaidStr = '';
        if (payment.datePaid) {
            datePaidStr = new Date(payment.datePaid).toLocaleDateString('en-US', { year: '2-digit', month: '2-digit', day: '2-digit' });
        } else if (payment.timestamp && payment.timestamp.toDate) {
            datePaidStr = new Date(payment.timestamp.toDate()).toLocaleDateString('en-US', { year: '2-digit', month: '2-digit', day: '2-digit' });
        }

        const refNo = payment.referenceNumber || payment.refNo || payment.transactionId || '';
        
        let updates = [
            { range: `${sheetName}!${colIndexToLetter(colDatePaid)}${rowIndex}`, values: [[datePaidStr]] },
            { range: `${sheetName}!${colIndexToLetter(colStatus)}${rowIndex}`, values: [['PAID']] },
        ];

        // Only update Ref No if the column exists in their sheet
        if (colRef !== -1 && refNo !== '') {
            updates.push({ range: `${sheetName}!${colIndexToLetter(colRef)}${rowIndex}`, values: [[refNo]] });
        }

        if (payment.plan && colPlan !== -1) {
            updates.push({ range: `${sheetName}!${colIndexToLetter(colPlan)}${rowIndex}`, values: [[payment.plan]] });
        }
        
        if ((payment.amount || payment.totalAmount) && colAmt !== -1) {
            updates.push({ range: `${sheetName}!${colIndexToLetter(colAmt)}${rowIndex}`, values: [[payment.amount || payment.totalAmount]] });
        }

        await sheetsAPI.spreadsheets.values.batchUpdate({
            spreadsheetId: SPREADSHEET_ID,
            requestBody: {
                valueInputOption: 'USER_ENTERED',
                data: updates
            }
        });

        console.log(`✅ Synced payment for ${targetAccount} to Google Sheets!`);
    } catch (err) {
        console.error("❌ Error syncing payment to sheets:", err);
    }
}

export async function createNewMonthSheet(targetDate = new Date()) {
    const now = targetDate;
    if (!sheetsAPI) return;
    try {
        const date = targetDate;
        const currentMonth = date.toLocaleString('en-US', { month: 'long' });
        const currentYear = date.getFullYear();
        const newSheetName = `${currentMonth} ${currentYear}`;
        
        // 0. Check if sheet already exists
        const existingId = await getSheetIdByName(newSheetName);
        if (existingId) {
            console.log(`⚠️ Sheet ${newSheetName} already exists! Skipping creation.`);
            return;
        }

        // 1. Duplicate the previous month sheet
        const oldSheetName = await getLatestSheetName();
        const oldSheetId = await getSheetIdByName(oldSheetName);
        
        const duplicateRes = await sheetsAPI.spreadsheets.batchUpdate({
            spreadsheetId: SPREADSHEET_ID,
            requestBody: {
                requests: [{
                    duplicateSheet: {
                        sourceSheetId: oldSheetId,
                        insertSheetIndex: 99,
                        newSheetName: newSheetName
                    }
                }]
            }
        });
        
        const newSheetId = duplicateRes.data.replies[0].duplicateSheet.properties.sheetId;

        // 2. Fetch all current users from database
        const usersSnap = await db.collection('users').get();
        let allUsers = [];
        usersSnap.forEach(doc => {
            const u = doc.data();
            u.id = doc.id;
            allUsers.push(u);
        });
        
        allUsers.sort((a, b) => (a.fullName || a.name || '').localeCompare(b.fullName || b.name || ''));

        // 3. Prepare the new data payload
        // Title cell (A1)
        let updates = [
            { range: `${newSheetName}!A1`, values: [[currentMonth]] }
        ];

        // Format Date string: "September 7, 2026"
        const dueDateString = `${currentMonth} 7, ${currentYear}`;
        
        // Prepare row data (starting row 3)
        let rowData = [];
        allUsers.forEach(u => {
            const rawName = u.fullName || u.name || '';
            const accountName = rawName.toLowerCase().replace(/\\s+/g, '.');
            let status = u.status === 'DELETED' ? 'DELETED' : 'UNPAID';

            rowData.push([
                rawName,                          // A: Name
                accountName,                      // B: Account
                u.clientType || 'Old Client',     // C: Type
                'Monthly',                        // D: Payment
                dueDateString,                    // E: Due Date
                '',                               // F: Date of Payment (CLEAR IT)
                status,                           // G: Payment Status (UNPAID)
                u.status || u.connectionStatus || 'CONNECTED', // H: Connection Status
                '',                               // I: Ref No. (CLEAR IT)
                u.plan || u.Plan || '',           // J: Plan
                '',                               // K: Amount (CLEAR IT)
                u.facebook || u.fb || '',         // L: Contact (FB)
                u.phone || u.contactNumber || '', // M: Phone
                u.email || '',                    // N: Email
                u.address || '',                  // O: Address
                u.Location || u.location || '',   // P: Location
                u.accountNumber || u.account || '' // Q: Account Number
            ]);
        });

        // 4. Overwrite the main data block
        updates.push({
            range: `${newSheetName}!A3:Q${rowData.length + 2}`,
            values: rowData
        });

        // 5. Clear any extra rows left over from last month if previous month had more users
        const clearRange = `${newSheetName}!A${rowData.length + 3}:Q10000`;

        await sheetsAPI.spreadsheets.values.batchUpdate({
            spreadsheetId: SPREADSHEET_ID,
            requestBody: {
                valueInputOption: 'USER_ENTERED',
                data: updates
            }
        });

        await sheetsAPI.spreadsheets.values.clear({
            spreadsheetId: SPREADSHEET_ID,
            range: clearRange
        });

        console.log(`✅ Successfully created new Auto-Rollover sheet for ${newSheetName}`);

    } catch (err) {
        console.error("❌ Error creating new month sheet:", err);
    }
}

async function revertPaymentInSheet(payment) {
    if (!sheetsAPI) return;
    try {
        const sheetName = 'Billing Report'; // Hardcode exactly to the sheet the user uses
        const res = await sheetsAPI.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: `${sheetName}!A:Q`, // Fetch up to Column Q
        });

        const rows = res.data.values;
        if (!rows) return;

        // Find the user's row
        let rowIndex = -1;
        const targetName = (payment.customerName || '').toLowerCase().trim();
        const targetAccount = (payment.accountNumber || '').toLowerCase().trim();
        
        for (let i = 0; i < rows.length; i++) {
            const rowName = (rows[i][0] || '').toLowerCase().trim();
            const rowAccNum = (rows[i][16] || '').toLowerCase().trim(); // Column Q
            
            if ((targetAccount && rowAccNum === targetAccount) || 
                (targetName && rowName === targetName)) {
                rowIndex = i + 1;
                break;
            }
        }

        if (rowIndex === -1) {
            console.warn(`Could not find row for deleted payment ${targetName} / ${targetAccount}`);
            return;
        }

        // Revert Date of Payment (F), Status (G), and Ref No (I)
        let updates = [
            { range: `${sheetName}!F${rowIndex}`, values: [['']] },
            { range: `${sheetName}!G${rowIndex}`, values: [['UNPAID']] },
            { range: `${sheetName}!I${rowIndex}`, values: [['']] }
        ];

        await sheetsAPI.spreadsheets.values.batchUpdate({
            spreadsheetId: SPREADSHEET_ID,
            requestBody: {
                valueInputOption: 'USER_ENTERED',
                data: updates
            }
        });

        console.log(`✅ Reverted payment for ${targetAccount || targetName} to UNPAID in Google Sheets!`);
    } catch (err) {
        console.error("❌ Error reverting payment in Google Sheets:", err);
    }
}


async function appendUserToSheet(sheetName, user) {
    if (!sheetsAPI) return;
    try {
        // Check if sheet exists
        const res = await sheetsAPI.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
        const exists = res.data.sheets.find(s => s.properties.title === sheetName);
        if (!exists) return; // Don't append if the sheet hasn't been created yet

        const rawName = user.fullName || user.name || '';
        const accountName = rawName.toLowerCase().replace(/\s+/g, '.');
        let status = user.status === 'DELETED' ? 'DELETED' : 'UNPAID';
        
        // Format Due Date for that month
        const [month, year] = sheetName.split(' ');
        const dueDateString = `${month} 7, ${year}`;

        const rowData = [
            rawName,                          // A: Name
            accountName,                      // B: Account
            user.clientType || 'Old Client',     // C: Type
            'Monthly',                        // D: Payment
            dueDateString,                    // E: Due Date
            '',                               // F: Date of Payment
            status,                           // G: Payment Status (UNPAID)
            user.status || user.connectionStatus || 'CONNECTED', // H: Connection Status
            '',                               // I: Ref No.
            user.plan || user.Plan || '',           // J: Plan
            '',                               // K: Amount
            user.facebook || user.fb || '',         // L: Contact (FB)
            user.phone || user.contactNumber || '', // M: Phone
            user.email || '',                    // N: Email
            user.address || '',                  // O: Address
            user.Location || user.location || '',   // P: Location
            user.accountNumber || user.account || '' // Q: Account Number
        ];

        await sheetsAPI.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: `${sheetName}!A:Q`,
            valueInputOption: 'USER_ENTERED',
            insertDataOption: 'INSERT_ROWS',
            requestBody: {
                values: [rowData]
            }
        });
        console.log(`✅ Appended new user ${rawName} to Google Sheet: ${sheetName}`);
    } catch (err) {
        console.error(`❌ Error appending user to ${sheetName}:`, err);
    }
}

function listenForNewUsers() {
    console.log("👀 Listening for new users to append to Google Sheets...");
    
    db.collection('users').onSnapshot(async (snapshot) => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        for (const change of snapshot.docChanges()) {
            if (change.type === 'added') {
                const user = change.doc.data();
                
                // Only sync newly created users (using a timestamp if available, else assume they are old)
                // If the user doesn't have a createdAt, we skip them to avoid appending 100s of users on server restart
                if (user.createdAt && user.createdAt.toDate) {
                    const createdDate = user.createdAt.toDate();
                    if (createdDate > yesterday) {
                        // Append to Current Month
                        const now = new Date();
                        const currentMonthStr = now.toLocaleString('en-US', { month: 'long', year: 'numeric' });
                        await appendUserToSheet(currentMonthStr, user);
                        
                        // Append to Advance Month (if it exists)
                        const advanceDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
                        const advanceMonthStr = advanceDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });
                        await appendUserToSheet(advanceMonthStr, user);
                    }
                }
            }
        }
    });
}
