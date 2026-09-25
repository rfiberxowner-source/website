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
    console.log("👀 Listening for new payments to sync to Google Sheets...");
    
    // We only want to sync NEW payments after the server started to avoid re-syncing everything, 
    // but onSnapshot will give us everything initially. We can filter by recent timestamp or just handle updates.
    // A safer way is to query payments from the last 24 hours
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    db.collection('payments').where('timestamp', '>', yesterday).onSnapshot(async (snapshot) => {
        for (const change of snapshot.docChanges()) {
            if (change.type === 'added' || change.type === 'modified') {
                const payment = change.doc.data();
                await syncPaymentToSheet(payment);
            }
        }
    });
}

async function syncPaymentToSheet(payment) {
    if (!sheetsAPI) return;
    try {
        const sheetName = await getLatestSheetName();
        const res = await sheetsAPI.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: `${sheetName}!B:B`, // Account name is column B
        });

        const rows = res.data.values;
        if (!rows) return;

        // Find the user's row
        let rowIndex = -1;
        const targetAccount = (payment.accountNumber || '').toLowerCase().trim();
        for (let i = 0; i < rows.length; i++) {
            if (rows[i][0] && rows[i][0].toLowerCase().trim() === targetAccount) {
                rowIndex = i + 1; // API uses 1-based index
                break;
            }
        }

        if (rowIndex === -1) {
            console.warn(`Could not find row for account ${targetAccount} in sheet ${sheetName}`);
            return;
        }

        // Update the row values
        // Date of Payment (F), Payment Status (G), Ref No (I), Plan (J), Amount (K)
        // Note: F = col 6, G = col 7, I = col 9, J = col 10, K = col 11
        
        let datePaidStr = '';
        if (payment.datePaid) {
            datePaidStr = new Date(payment.datePaid).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
        } else if (payment.timestamp && payment.timestamp.toDate) {
            datePaidStr = new Date(payment.timestamp.toDate()).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
        }

        const refNo = payment.referenceNumber || payment.refNo || payment.transactionId || '';
        
        // Batch update to update specific cells
        await sheetsAPI.spreadsheets.values.batchUpdate({
            spreadsheetId: SPREADSHEET_ID,
            requestBody: {
                valueInputOption: 'USER_ENTERED',
                data: [
                    { range: `${sheetName}!F${rowIndex}`, values: [[datePaidStr]] },
                    { range: `${sheetName}!G${rowIndex}`, values: [['PAID']] },
                    { range: `${sheetName}!I${rowIndex}`, values: [[refNo]] },
                    { range: `${sheetName}!J${rowIndex}`, values: [[payment.plan || '']] },
                    { range: `${sheetName}!K${rowIndex}`, values: [[payment.amount || payment.totalAmount || '']] },
                ]
            }
        });

        console.log(`✅ Synced payment for ${targetAccount} to Google Sheets!`);
    } catch (err) {
        console.error("❌ Error syncing payment to sheets:", err);
    }
}

async function createNewMonthSheet() {
    if (!sheetsAPI) return;
    try {
        const date = new Date();
        const currentMonth = date.toLocaleString('en-US', { month: 'long' });
        const currentYear = date.getFullYear();
        const newSheetName = `${currentMonth} ${currentYear}`;
        
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
