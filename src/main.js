import './style.css';

// View Components
const views = {
  '/': () => `
    <section class="hero">
      <div class="hero-content">
        <h2 class="hero-kicker">RFIBERX</h2>
        <h1 class="hero-title">FAST INTERNET</h1>
        <p class="hero-subtitle">Experience next-level connectivity and seamless reliability.</p>
        <button class="btn btn-white" onclick="window.router.navigate('/subscriptions')">Get connected now</button>
      </div>
    </section>

    <section class="pldt-ad scroll-animate">
      <div class="pldt-ad-content">
        <h2>MORE SHOWS.<br>MORE STREAMING.</h2>
        <p>Now with HBO Max alongside Netflix and Cignal when you apply for Fiber Plan 2499!</p>
        <button class="btn btn-white rounded-pill" onclick="window.router.navigate('/subscriptions')">APPLY NOW</button>
      </div>
      <div class="pldt-overlay-card">
        <h3>FIBER UNLI ALL PLAN 2499</h3>
        <p>FREE SPEEDBOOST*</p>
        <div class="speed">700 MBPS</div>
        <p>AVG SPEED 570 MBPS, 80% RELIABILITY</p>
        <p style="font-weight: bold; margin-top: 1rem;">UNLI CALLS</p>
      </div>
    </section>

    <section class="section-container scroll-animate">
      <div class="section-header-left">
        <h2>Promos and offers</h2>
        <p>Take advantage of the fiber-powered offers and immerse yourself in the world of X possibilities.</p>
      </div>
      <div class="promo-grid">
        <div class="promo-card">
          <div class="img-placeholder grad-1">[Promo Image]</div>
          <div class="card-content">
            <h3>Nine's the Sign Upgrade Promo</h3>
            <p>Pay additional ₱9 on your next bill after upgrading to a new plan.</p>
            <button class="btn btn-outline">Unlock the promo</button>
          </div>
        </div>
        <div class="promo-card">
          <div class="img-placeholder grad-2">[Challenge Image]</div>
          <div class="card-content">
            <h3>Fastest Speedtest Challenge</h3>
            <p>Show your Super Speeds for a chance to win Super Prizes!</p>
            <button class="btn btn-outline">Unlock the promo</button>
          </div>
        </div>
      </div>
    </section>

    <section class="section-container scroll-animate">
      <div class="section-header-left">
        <h2>Plans and Bundles</h2>
        <p>Your NEXT-LEVEL FIBER experience starts here.</p>
      </div>
      <div class="bundle-grid">
        <div class="bundle-card">
          <div class="img-placeholder bg-purple">[Family Image]</div>
          <div class="card-content">
            <h3>Super FiberX</h3>
            <p>Packed fiber plans to power up your digital experience.</p>
            <button class="btn btn-outline" onclick="window.router.navigate('/subscriptions')">Check plans</button>
          </div>
        </div>
        <div class="bundle-card">
          <div class="img-placeholder bg-dark">[Netflix Image]</div>
          <div class="card-content">
            <h3>Netflix Bundles</h3>
            <p>Stream seamlessly with FiberX plans that include Netflix.</p>
            <button class="btn btn-outline" onclick="window.router.navigate('/subscriptions')">Check plans</button>
          </div>
        </div>
        <div class="bundle-card">
          <div class="img-placeholder bg-blue">[Night Image]</div>
          <div class="card-content">
            <h3>FiberX Time of Day</h3>
            <p>Faster Speeds when you need them most.</p>
            <button class="btn btn-outline" onclick="window.router.navigate('/subscriptions')">Check plans</button>
          </div>
        </div>
        <div class="bundle-card">
          <div class="img-placeholder bg-black">[Gamer Image]</div>
          <div class="card-content">
            <h3>The GameChanger</h3>
            <p>High-speed fiber plans dedicated for gamers and gaming enthusiasts.</p>
            <button class="btn btn-outline" onclick="window.router.navigate('/subscriptions')">Check plans</button>
          </div>
        </div>
      </div>
    </section>
  `,
  '/subscriptions': () => `
    <section class="section-container scroll-animate" style="max-width: 1600px; width: 95%;">
      <div class="section-header-left" style="text-align: center; margin-bottom: 4rem;">
        <h2>Choose Your Power</h2>
        <p>Unbeatable plans for every need. No hidden fees.</p>
      </div>
      <div class="pricing-grid">
        <!-- Plan 1 -->
        <div class="bundle-card" style="padding: 1.5rem;">
          <h3 style="font-size: 1.5rem;">Starter Fiber</h3>
          <div style="font-size: 3rem; font-weight: 800; color: var(--accent-color); margin: 1rem 0;">₱800<span style="font-size: 1rem; color: #555;">/mo</span></div>
          <p style="margin-bottom: 2rem; line-height: 2;">Up to 30 Mbps<br>Unlimited Data<br>Standard Router<br>Good for 1-2 devices</p>
          <button class="btn btn-outline" style="margin-top: auto;" onclick="window.router.openSignupForm('Starter Fiber', 'Up to 30 Mbps')">Get Started</button>
        </div>
        
        <!-- Plan 2 -->
        <div class="bundle-card" style="padding: 1.5rem;">
          <h3 style="font-size: 1.5rem;">Value Fiber</h3>
          <div style="font-size: 3rem; font-weight: 800; color: var(--accent-color); margin: 1rem 0;">₱1000<span style="font-size: 1rem; color: #555;">/mo</span></div>
          <p style="margin-bottom: 2rem; line-height: 2;">Up to 50 Mbps<br>Unlimited Data<br>Standard Router<br>HD Streaming Ready</p>
          <button class="btn btn-outline" style="margin-top: auto;" onclick="window.router.openSignupForm('Value Fiber', 'Up to 50 Mbps')">Get Started</button>
        </div>

        <!-- Plan 3 -->
        <div class="bundle-card" style="padding: 1.5rem;">
          <h3 style="font-size: 1.5rem;">Family Fiber</h3>
          <div style="font-size: 3rem; font-weight: 800; color: var(--accent-color); margin: 1rem 0;">₱1300<span style="font-size: 1rem; color: #555;">/mo</span></div>
          <p style="margin-bottom: 2rem; line-height: 2;">Up to 70 Mbps<br>Unlimited Data<br>Dual-Band Router<br>Great for 4-6 devices</p>
          <button class="btn btn-outline" style="margin-top: auto;" onclick="window.router.openSignupForm('Family Fiber', 'Up to 70 Mbps')">Get Started</button>
        </div>

        <!-- Plan 4 (Most Popular) -->
        <div class="bundle-card popular-card" style="padding: 1.5rem; border-color: var(--accent-color); z-index: 1;">
          <div style="position: absolute; top: 0; right: 0; background: var(--accent-color); color: #fff; padding: 0.2rem 1rem; font-size: 0.8rem; font-weight: bold; border-bottom-left-radius: 16px;">MOST POPULAR</div>
          <h3 style="font-size: 1.5rem;">Pro Fiber</h3>
          <div style="font-size: 3rem; font-weight: 800; color: var(--accent-color); margin: 1rem 0;">₱1500<span style="font-size: 1rem; color: #555;">/mo</span></div>
          <p style="margin-bottom: 2rem; line-height: 2;">Up to 100 Mbps<br>Unlimited Data<br>Wi-Fi 6 Router<br>4K Streaming & Gaming</p>
          <button class="btn btn-outline" style="margin-top: auto; background: var(--accent-color); color: #fff;" onclick="window.router.openSignupForm('Pro Fiber', 'Up to 100 Mbps')">Get Started</button>
        </div>

        <!-- Plan 5 -->
        <div class="bundle-card" style="padding: 1.5rem;">
          <h3 style="font-size: 1.5rem;">Extreme Fiber X</h3>
          <div style="font-size: 3rem; font-weight: 800; color: var(--accent-color); margin: 1rem 0;">₱2000<span style="font-size: 1rem; color: #555;">/mo</span></div>
          <p style="margin-bottom: 2rem; line-height: 2;">Up to 200 Mbps<br>Unlimited Data<br>Mesh System Included<br>Ultimate Smart Home</p>
          <button class="btn btn-outline" style="margin-top: auto;" onclick="window.router.openSignupForm('Extreme Fiber X', 'Up to 200 Mbps')">Get Started</button>
        </div>
      </div>

      <!-- Application Form Accordion -->
      <div id="signup-form-container" class="signup-container">
        <div style="background: var(--glass-bg); padding: 3rem; border-radius: 16px; border: 1px solid var(--accent-color); max-width: 800px; margin: 0 auto; text-align: left;">
          <h2 style="margin-bottom: 2rem; text-align: center;">Complete Your Application</h2>
          <form onsubmit="event.preventDefault(); alert('Application submitted successfully!');">
            <div class="contact-grid" style="gap: 2rem;">
              <div>
                <div class="form-group">
                  <label>Selected Plan</label>
                  <input type="text" id="selected-plan-input" class="form-control" readonly style="background: rgba(16, 185, 129, 0.1); border-color: var(--accent-color); font-weight: bold; color: var(--accent-color);">
                </div>
                <div class="form-group">
                  <label>Plan Speed</label>
                  <input type="text" id="selected-plan-speed" class="form-control" readonly style="background: rgba(0,0,0,0.4); color: #888;">
                </div>
                <div class="form-group">
                  <label>Email Address</label>
                  <input type="email" class="form-control" placeholder="john@example.com" required>
                </div>
                <div class="form-group">
                  <label>Facebook Name</label>
                  <input type="text" class="form-control" placeholder="John Doe" required>
                </div>
                <div class="form-group">
                  <label>Phone Number</label>
                  <input type="tel" class="form-control" placeholder="0912 345 6789" required>
                </div>
              </div>
              <div>
                <div class="form-group">
                  <label>Location</label>
                  <input type="text" class="form-control" value="Magdalena" readonly style="background: rgba(0,0,0,0.4); color: #888;">
                </div>
                <div class="form-group">
                  <label>Sub Location</label>
                  <select class="form-control" required style="appearance: none; background-image: url('data:image/svg+xml;utf8,<svg fill=%22white%22 height=%2224%22 viewBox=%220 0 24 24%22 width=%2224%22 xmlns=%22http://www.w3.org/2000/svg%22><path d=%22M7 10l5 5 5-5z%22/><path d=%22M0 0h24v24H0z%22 fill=%22none%22/></svg>'); background-repeat: no-repeat; background-position-x: 95%; background-position-y: 50%;">
                    <option value="" disabled selected>Select Sub Location</option>
                    <option style="background: #111;">Salasad</option>
                    <option style="background: #111;">Brgy. Ilog</option>
                    <option style="background: #111;">Bucal</option>
                    <option style="background: #111;">Ibabang Butnong</option>
                    <option style="background: #111;">Poblacion</option>
                    <option style="background: #111;">Munting Ambling</option>
                    <option style="background: #111;">Cigaras</option>
                    <option style="background: #111;">Tipunan</option>
                    <option style="background: #111;">Balanac</option>
                    <option style="background: #111;">Malinao</option>
                    <option style="background: #111;">Ilayang Butnong</option>
                    <option style="background: #111;">Sabang</option>
                    <option style="background: #111;">Buenavista</option>
                    <option style="background: #111;">Malaking Ambling</option>
                  </select>
                </div>
              </div>
            </div>
            <button type="submit" class="btn btn-outline" style="width: 100%; margin-top: 1rem; background: var(--accent-color); color: #fff; border-color: var(--accent-color);">Submit Application</button>
          </form>
        </div>
      </div>
    </section>

    <!-- Detailed Features Section -->
    <section class="section-container scroll-animate" style="margin-top: 2rem; padding-top: 4rem; border-top: 1px solid var(--glass-border);">
      <div class="section-header-left" style="text-align: center; margin-bottom: 3rem;">
        <h2>What's included in every plan?</h2>
        <p>We don't hold back. Every RFiberX customer gets the VIP treatment.</p>
      </div>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; text-align: center;">
        <div style="padding: 2rem; background: var(--glass-bg); border-radius: 16px; border: 1px solid var(--glass-border);">
          <div style="font-size: 3rem; margin-bottom: 1rem;">🚀</div>
          <h3 style="margin-bottom: 1rem;">Symmetrical Speeds</h3>
          <p style="color: var(--text-secondary); font-size: 0.95rem;">Upload as fast as you download. Perfect for content creators, remote work, and intense gaming.</p>
        </div>
        <div style="padding: 2rem; background: var(--glass-bg); border-radius: 16px; border: 1px solid var(--glass-border);">
          <div style="font-size: 3rem; margin-bottom: 1rem;">♾️</div>
          <h3 style="margin-bottom: 1rem;">No Data Caps</h3>
          <p style="color: var(--text-secondary); font-size: 0.95rem;">Stream, game, and download endlessly without worrying about overage charges or throttling.</p>
        </div>
        <div style="padding: 2rem; background: var(--glass-bg); border-radius: 16px; border: 1px solid var(--glass-border);">
          <div style="font-size: 3rem; margin-bottom: 1rem;">🔒</div>
          <h3 style="margin-bottom: 1rem;">Built-in Security</h3>
          <p style="color: var(--text-secondary); font-size: 0.95rem;">Our routers come equipped with advanced firewall protections and network-level ad blocking.</p>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="section-container scroll-animate" style="margin-bottom: 4rem;">
      <div class="section-header-left">
        <h2>Frequently Asked Questions</h2>
      </div>
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <div style="background: var(--glass-bg); border: 1px solid var(--glass-border); padding: 1.5rem; border-radius: 12px;">
          <h3 style="margin-bottom: 0.5rem; color: var(--accent-color);">How long does installation take?</h3>
          <p style="color: var(--text-secondary);">Standard installations usually take between 2 to 4 hours. Once you sign up, our dispatch team will contact you within 24 hours to schedule a convenient time.</p>
        </div>
        <div style="background: var(--glass-bg); border: 1px solid var(--glass-border); padding: 1.5rem; border-radius: 12px;">
          <h3 style="margin-bottom: 0.5rem; color: var(--accent-color);">Can I upgrade my plan later?</h3>
          <p style="color: var(--text-secondary);">Absolutely! You can upgrade your plan at any time through our online portal without any penalty fees. Downgrades are also permitted after your first 6 months.</p>
        </div>
        <div style="background: var(--glass-bg); border: 1px solid var(--glass-border); padding: 1.5rem; border-radius: 12px;">
          <h3 style="margin-bottom: 0.5rem; color: var(--accent-color);">Is the router really free?</h3>
          <p style="color: var(--text-secondary);">Yes, the router is included with your monthly service fee. We upgrade your equipment for free every 3 years to ensure you always have the best technology.</p>
        </div>
      </div>
    </section>
  `,
  '/support': () => `
    <section class="section-container scroll-animate" style="text-align: center; padding-top: 6rem; border-bottom: 1px solid var(--glass-border);">
      <h1 style="font-size: 3rem; margin-bottom: 1.5rem;">How can we help?</h1>
      <p style="color: var(--text-secondary); font-size: 1.2rem; margin-bottom: 3rem; max-width: 600px; margin-inline: auto;">Search our knowledge base or browse categories below to find exactly what you need.</p>
      
      <div style="max-width: 600px; margin: 0 auto 4rem auto; position: relative;">
        <input type="text" class="form-control" placeholder="Search for answers..." style="padding: 1.2rem; font-size: 1.1rem; border-radius: 50px;">
        <button class="btn btn-outline" style="position: absolute; right: 5px; top: 5px; margin-top: 0; border-radius: 50px; padding: 0.8rem 1.5rem; width: auto;">Search</button>
      </div>
    </section>

    <section class="section-container scroll-animate">
      <h2 style="text-align: center; margin-bottom: 3rem;">Browse by Category</h2>
      <div class="bundle-grid">
        <div class="bundle-card" style="padding: 2rem; text-align: center; cursor: pointer;">
          <div style="font-size: 3rem; margin-bottom: 1rem;">💳</div>
          <h3 style="margin-bottom: 0.5rem;">Billing & Payments</h3>
          <p style="color: var(--text-secondary); font-size: 0.9rem;">View your statements, update payment methods, or understand charges.</p>
        </div>
        <div class="bundle-card" style="padding: 2rem; text-align: center; cursor: pointer;">
          <div style="font-size: 3rem; margin-bottom: 1rem;">🔧</div>
          <h3 style="margin-bottom: 0.5rem;">Technical Support</h3>
          <p style="color: var(--text-secondary); font-size: 0.9rem;">Troubleshoot internet issues, router setups, and speed diagnostics.</p>
        </div>
        <div class="bundle-card" style="padding: 2rem; text-align: center; cursor: pointer;">
          <div style="font-size: 3rem; margin-bottom: 1rem;">👤</div>
          <h3 style="margin-bottom: 0.5rem;">Account Management</h3>
          <p style="color: var(--text-secondary); font-size: 0.9rem;">Change your plan, update contact info, or move services.</p>
        </div>
        <div class="bundle-card" style="padding: 2rem; text-align: center; cursor: pointer;">
          <div style="font-size: 3rem; margin-bottom: 1rem;">📡</div>
          <h3 style="margin-bottom: 0.5rem;">Outages & Network</h3>
          <p style="color: var(--text-secondary); font-size: 0.9rem;">Check for service interruptions in your area or report a downed line.</p>
        </div>
      </div>
    </section>
    
    <section class="section-container scroll-animate" style="text-align: center; margin-bottom: 4rem;">
      <h2 style="margin-bottom: 1rem;">Still need help?</h2>
      <p style="color: var(--text-secondary); margin-bottom: 2rem;">Our support team is available 24/7 to assist you.</p>
      <button class="btn btn-outline" onclick="window.router.navigate('/contact')" style="width: auto;">Contact Support</button>
    </section>
  `,
  '/contact': () => `
    <section class="section-container scroll-animate" style="padding-top: 6rem; margin-bottom: 4rem;">
      <div style="text-align: center; margin-bottom: 4rem;">
        <h1 style="font-size: 3.5rem; margin-bottom: 1rem;">Get in Touch</h1>
        <p style="color: var(--text-secondary); font-size: 1.2rem;">We're ready to answer your questions and get you connected.</p>
      </div>

      <div class="contact-grid">
        <!-- Contact Form -->
        <div style="background: var(--glass-bg); padding: 3rem; border-radius: 16px; border: 1px solid var(--glass-border); backdrop-filter: blur(10px);">
          <h2 style="margin-bottom: 2rem;">Send us a message</h2>
          <form onsubmit="event.preventDefault(); alert('Message sent successfully! We will get back to you shortly.');">
            <div class="form-group">
              <label>Full Name</label>
              <input type="text" class="form-control" placeholder="John Doe" required>
            </div>
            <div class="form-group">
              <label>Email Address</label>
              <input type="email" class="form-control" placeholder="john@example.com" required>
            </div>
            <div class="form-group">
              <label>Subject</label>
              <select class="form-control" style="appearance: none; background-image: url('data:image/svg+xml;utf8,<svg fill=%22white%22 height=%2224%22 viewBox=%220 0 24 24%22 width=%2224%22 xmlns=%22http://www.w3.org/2000/svg%22><path d=%22M7 10l5 5 5-5z%22/><path d=%22M0 0h24v24H0z%22 fill=%22none%22/></svg>'); background-repeat: no-repeat; background-position-x: 95%; background-position-y: 50%;">
                <option value="sales" style="background: #111;">Sales Inquiry</option>
                <option value="support" style="background: #111;">Technical Support</option>
                <option value="billing" style="background: #111;">Billing Question</option>
                <option value="other" style="background: #111;">Other</option>
              </select>
            </div>
            <div class="form-group">
              <label>Message</label>
              <textarea class="form-control" rows="5" placeholder="How can we help you?" required></textarea>
            </div>
            <button type="submit" class="btn btn-outline" style="width: 100%;">Submit Message</button>
          </form>
        </div>

        <!-- Contact Info -->
        <div>
          <h2 style="margin-bottom: 2rem;">Contact Information</h2>
          
          <div style="margin-bottom: 2.5rem; display: flex; gap: 1rem;">
            <div style="font-size: 2rem; color: var(--accent-color);">📞</div>
            <div>
              <h3 style="margin-bottom: 0.5rem;">Sales & Signups</h3>
              <p style="color: var(--text-secondary); font-size: 1.1rem;">1-800-RFIBERX</p>
              <p style="color: var(--text-secondary); font-size: 0.9rem;">Mon-Fri, 8am to 8pm EST</p>
            </div>
          </div>

          <div style="margin-bottom: 2.5rem; display: flex; gap: 1rem;">
            <div style="font-size: 2rem; color: var(--accent-color);">🎧</div>
            <div>
              <h3 style="margin-bottom: 0.5rem;">Technical Support</h3>
              <p style="color: var(--text-secondary); font-size: 1.1rem;">1-888-RFIBERX-HELP</p>
              <p style="color: var(--text-secondary); font-size: 0.9rem;">Available 24/7, 365 days a year</p>
            </div>
          </div>

          <div style="margin-bottom: 2.5rem; display: flex; gap: 1rem;">
            <div style="font-size: 2rem; color: var(--accent-color);">✉️</div>
            <div>
              <h3 style="margin-bottom: 0.5rem;">Email Us</h3>
              <p style="color: var(--text-secondary); font-size: 1.1rem;">support@rfiberx.com</p>
              <p style="color: var(--text-secondary); font-size: 0.9rem;">We aim to reply within 2 hours.</p>
            </div>
          </div>

          <div style="margin-bottom: 2.5rem; display: flex; gap: 1rem;">
            <div style="font-size: 2rem; color: var(--accent-color);">🏢</div>
            <div>
              <h3 style="margin-bottom: 0.5rem;">Headquarters</h3>
              <p style="color: var(--text-secondary); line-height: 1.6;">
                Newstreet Bldg., Mc Arthur Hi-way<br>
                Balibago, Angeles City<br>
                Philippines
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
};

// Router Logic
class Router {
  constructor() {
    this.appContent = document.getElementById('app-content');
    window.addEventListener('popstate', () => this.route());
    this.route();
  }

  navigate(path) {
    window.history.pushState(null, null, path);
    this.route();
  }

  route() {
    let path = window.location.pathname;
    if (!views[path]) {
      path = '/';
      window.history.replaceState(null, null, '/');
    }

    this.appContent.innerHTML = views[path]();
    this.setupScrollAnimations();
    this.updateNavLinks(path);
  }

  setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        } else {
          entry.target.classList.remove('visible');
        }
      });
    }, { threshold: 0.1 });

    const animatedElements = document.querySelectorAll('.scroll-animate');
    animatedElements.forEach(el => observer.observe(el));
  }

  updateNavLinks(currentPath) {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      if (item.getAttribute('href') === currentPath) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  openSignupForm(planName, planSpeed) {
    const formContainer = document.getElementById('signup-form-container');
    const planInput = document.getElementById('selected-plan-input');
    const speedInput = document.getElementById('selected-plan-speed');
    
    if (formContainer && planInput && speedInput) {
      planInput.value = planName;
      speedInput.value = planSpeed;
      formContainer.classList.add('open');
      
      // Smooth scroll to the form
      setTimeout(() => {
        formContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    } else {
      // If they clicked it from the home page, redirect to subscriptions first
      this.navigate('/subscriptions');
      setTimeout(() => {
        this.openSignupForm(planName, planSpeed);
      }, 100);
    }
  }
}

window.router = new Router();

document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('click', e => {
    if (e.target.matches('[data-link]')) {
      e.preventDefault();
      window.router.navigate(e.target.getAttribute('href'));
      
      // Close mobile menu if open
      const mobileMenu = document.getElementById('mobile-menu');
      if (mobileMenu) mobileMenu.classList.remove('open');
    }
  });

  // Mobile menu toggle logic
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
    });
  }
});
