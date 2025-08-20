<template>
  <div class="landing-page">
    <AppHeader />

    <section class="employer-hero">
  <div class="hero-background-elements">
    <div class="shape shape-1"></div>
    <div class="shape shape-2"></div>
  </div>
      <div class="hero-text">
        <h1 class="tagline text-glow" style="color: #2a2a2a; text-shadow: 0 0 5px rgba(45, 108, 255, 0.442), 0 0 6px rgba(45, 108, 255, 0.442), 0 0 8px rgba(45, 108, 255, 0.442);">Hire the Best Talent <span class="handwritten">Faster</span></h1>
        <p>Connect with over <strong>500,000</strong> pre‑screened professionals. Use AI-powered matching to find your perfect candidate in days, not months.</p>
        <div class="hero-buttons">
          <button class="btn primary" @click="goToEmployerLogin">Post a Job Now</button>
          <button class="btn outline" @click="scrollToPricing">View Plans</button>
        </div>
        <div class="hero-stats" ref="heroStats">
          <div><strong ref="statEmployers">0</strong> Active Employers</div>
          <div><strong ref="statCandidates">0</strong> Quality Candidates</div>
          <div><strong ref="statHires">0</strong>% Successful Hires</div>
          <div><strong ref="statSpeed">0</strong>% Faster Hiring</div>
        </div>
      </div>
      
      <div class="hero-image-slider">
        <div
          v-for="(image, index) in sliderImages"
          :key="index"
          class="slider-card"
          :class="getCardClass(index)"
          :style="{ backgroundImage: `url(${image.src})` }"
          @mouseover="setActiveImage(index)"
        >
          <div v-if="index === activeImageIndex" class="slider-card-description">
      {{ image.description }}
    </div>
  </div>
      </div>
      </section>
    <JobseekerSuggestions />
    <section class="why-choose glass-section">
      <h2>Why Choose JobHub for Hiring?</h2>
      <p>Join thousands of companies that have transformed their hiring process with our platform.</p>
      <ul class="features-list">
        <li><strong>AI‑Driven Matching</strong><br>Advanced algorithms that surface top-fit candidates.</li>
        <li><strong>Fast Turnaround</strong><br>Cut time-to-hire by up to 60%.</li>
        <li><strong>Trusted Professionals</strong><br>All profiles pre-screened for skills and experience.</li>
        <li><strong>24/7 Support</strong><br>We're here whenever you need us.</li>
      </ul>
    </section>

    <section class="how-it-works glass-section">
      <h2>How It Works</h2>
      <p>Get started with hiring in three simple steps. It's that easy.</p>
      <div class="steps">
        <div class="step">
          <div class="step-number">1</div>
          <h3>Post Your Job</h3>
          <p>Create detailed job postings with our easy-to-use builder in under 5 minutes.</p>
        </div>
        <div class="step">
          <div class="step-number">2</div>
          <h3>Find Candidates</h3>
          <p>Browse our talent pool or let our AI recommend the best matches for your role.</p>
        </div>
        <div class="step">
          <div class="step-number">3</div>
          <h3>Hire with Confidence</h3>
          <p>Use our analytics and interview tools to make informed hiring decisions.</p>
        </div>
      </div>
    </section>

    <section class="employer-features glass-section" id="branding-section">
      <h2>Powerful Features for Employers</h2>
      <p>Everything you need to streamline your hiring process and find the right talent.</p>
      <div class="features-grid">
        <div class="feature">
          <div class="feature-icon">🏢</div>
          <h4>Company Branding</h4>
          <p>Customize your company profile to attract top talent with your brand story.</p>
        </div>
        <div class="feature">
          <div class="feature-icon">⚡</div>
          <h4>Instant Notifications</h4>
          <p>Get real-time alerts when qualified candidates apply to your positions.</p>
        </div>
        <div class="feature">
          <div class="feature-icon">🛡️</div>
          <h4>Verified Profiles</h4>
          <p>All candidates go through identity verification and skill assessments.</p>
        </div>
        <div class="feature">
          <div class="feature-icon">🌐</div>
          <h4>Global Reach</h4>
          <p>Access talent from around the world with our international job board.</p>
        </div>
      </div>
    </section>

    <section class="pricing glass-section" id="pricing-section">
      <div class="reveal-trigger" @click="isPricingVisible = !isPricingVisible">
        <span>Checkout Our Pricing</span>
        <span class="chevron" :class="{ 'rotated': isPricingVisible }"></span>
      </div>
      <transition name="expand">
        <div v-if="isPricingVisible" class="collapsible-content">
          <div class="pricing-toggle">
            <label :class="{ active: billingCycle === 'monthly' }">Monthly</label>
            <div class="toggle-switch" @click.stop="billingCycle = billingCycle === 'monthly' ? 'annually' : 'monthly'" :class="{ 'toggled': billingCycle === 'annually' }">
              <div class="toggle-handle"></div>
            </div>
            <label :class="{ active: billingCycle === 'annually' }">Annually <span class="discount-badge">Save 20%</span></label>
          </div>
          <div class="pricing-cards">
            <div class="pricing-card">
              <h3>Basic</h3>
              <p class="price">{{ billingCycle === 'monthly' ? '₹2,499' : '₹1,999' }}<span>/mo</span></p>
              <ul>
                <li>✓ 5 Job Posts</li>
                <li>✓ Basic Company Profile</li>
                <li>✓ Candidate Search</li>
                <li>✗ AI Matching</li>
                <li>✗ 24/7 Support</li>
              </ul>
              <button class="btn outline">Get Started</button>
            </div>
            <div class="pricing-card popular">
              <span class="popular-badge">Most Popular</span>
              <h3>Pro</h3>
              <p class="price">{{ billingCycle === 'monthly' ? '₹4,999' : '₹3,999' }}<span>/mo</span></p>
              <ul>
                <li>✓ 20 Job Posts</li>
                <li>✓ Premium Company Profile</li>
                <li>✓ Candidate Search</li>
                <li>✓ AI Matching</li>
                <li>✓ 24/7 Support</li>
              </ul>
              <button class="btn primary">Get Started</button>
            </div>
            <div class="pricing-card">
              <h3>Enterprise</h3>
              <p class="price">Contact Us</p>
              <ul>
                <li>✓ Unlimited Job Posts</li>
                <li>✓ Fully Customizable Profile</li>
                <li>✓ Dedicated Account Manager</li>
                <li>✓ Advanced Analytics</li>
                <li>✓ Priority Support</li>
              </ul>
              <button class="btn outline">Contact Sales</button>
            </div>
          </div>
        </div>
      </transition>
    </section>

    <section class="testimonials glass-section">
      <div class="reveal-trigger" @click="isTestimonialsVisible = !isTestimonialsVisible">
        <span>Trusted by Leading Companies</span>
        <span class="chevron" :class="{ 'rotated': isTestimonialsVisible }"></span>
      </div>
      <transition name="expand">
        <div v-if="isTestimonialsVisible" class="collapsible-content">
          <div class="testimonial-wrapper">
            <transition name="slide-fade" mode="out-in">
              <div class="testimonial-card" :key="currentTestimonialIndex">
                <img :src="currentTestimonial.img" :alt="currentTestimonial.name" class="client-photo">
                <p class="quote">"{{ currentTestimonial.quote }}"</p>
                <p class="author"><strong>{{ currentTestimonial.name }}</strong>, {{ currentTestimonial.title }}</p>
                <p class="company-logo">{{ currentTestimonial.company }}</p>
              </div>
            </transition>
            <button @click="prevTestimonial" class="nav-btn prev-btn" aria-label="Previous testimonial">‹</button>
            <button @click="nextTestimonial" class="nav-btn next-btn" aria-label="Next testimonial">›</button>
          </div>
        </div>
      </transition>
    </section>

    <AppFooter />
  </div>
</template>

<script>
// The script section is unchanged
import AppHeader from '../components/HeaderPart.vue';
import AppFooter from '../components/FooterPart.vue';
import JobseekerSuggestions from './JobseekerSuggestions.vue'
export default {
  name: 'EmployerHomePage',
  components: {
    AppHeader,
    AppFooter,
    JobseekerSuggestions
  },
  data() {
    return {
      isPricingVisible: false,
      isTestimonialsVisible: false,
      billingCycle: 'monthly',
      currentTestimonialIndex: 0,
      testimonials: [
        {
          quote: "JobHub's AI matching is phenomenal. We filled our Senior Developer role in just two weeks, a process that used to take months. The quality of candidates was outstanding.",
          name: 'Sarah Chen',
          title: 'CTO, Innovate Inc.',
          company: 'Innovate Inc.',
          img: 'https://randomuser.me/api/portraits/women/44.jpg'
        },
        {
          quote: "The platform is incredibly user-friendly and the support team is always responsive. We've cut our hiring time by more than half since we started using JobHub.",
          name: 'David Lee',
          title: 'HR Director, Tech Solutions',
          company: 'Tech Solutions',
          img: 'https://randomuser.me/api/portraits/men/32.jpg'
        },
        {
          quote: "As a startup, finding the right talent quickly is crucial. JobHub gave us access to a pool of pre-screened professionals that we couldn't find anywhere else. A total game-changer.",
          name: 'Maria Garcia',
          title: 'CEO, NextGen Startups',
          company: 'NextGen',
          img: 'https://randomuser.me/api/portraits/women/33.jpg'
        }
      ],
      // #################### SCRIPT ADDITIONS FOR SLIDER ####################
      sliderImages: [
        { src: 'src/assets/employee4.jpeg', description: 'Celebrate the milestones!' },
        { src: 'src/assets/employee5.jpeg', description: 'Analyze performance efficiently!' },
        { src: 'src/assets/employee3.jpeg', description: 'Brand your company effectively!' },
        { src: 'src/assets/employee.jpg',   description: 'Find & Hire the best candidates!' },
        { src: 'src/assets/employee1.jpeg', description: 'Build a collaborative team!' } 
      ],
      activeImageIndex: 2, // Default focus on the 3rd image (index 2)
      // #################### END OF SCRIPT ADDITIONS ####################
      observer: null
    };
  },
  computed: {
    currentTestimonial() {
      return this.testimonials[this.currentTestimonialIndex];
    }
  },
  methods: {
    // #################### SCRIPT METHODS FOR SLIDER ####################
    setActiveImage(index) {
      this.activeImageIndex = index;
    },
    getCardClass(index) {
      const numImages = this.sliderImages.length;
      let diff = index - this.activeImageIndex;
      
      // Handle wrapping for a seamless loop
      if (Math.abs(diff) > Math.floor(numImages / 2)) {
        if (diff > 0) {
          diff -= numImages;
        } else {
          diff += numImages;
        }
      }

      switch (diff) {
        case 0: return 'active';
        case 1: return 'next';
        case -1: return 'prev';
        case 2: return 'far-next';
        case -2: return 'far-prev';
        default: return 'hidden-card';
      }
    },
    // #################### END OF SCRIPT METHODS ####################
    goToEmployerLogin() {
      this.$router.push('/employer-signup');
    },
    scrollToPricing() {
      const pricingSection = document.getElementById('pricing-section');
      pricingSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      this.isPricingVisible = true;
    },
    scrollToAndOpenPricing() {
      this.scrollToPricing();
    },
    nextTestimonial() {
      this.currentTestimonialIndex = (this.currentTestimonialIndex + 1) % this.testimonials.length;
    },
    prevTestimonial() {
      this.currentTestimonialIndex = (this.currentTestimonialIndex - 1 + this.testimonials.length) % this.testimonials.length;
    },
    animateValue(ref, start, end, duration, suffix = '') {
      let startTimestamp = null;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const currentVal = Math.floor(progress * (end - start) + start);
        if (ref) {
          ref.innerHTML = currentVal.toLocaleString() + suffix;
        }
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    },
    initIntersectionObserver() {
      const options = {
        root: null,
        threshold: 0.5
      };
      this.observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animateValue(this.$refs.statEmployers, 0, 10000, 2000, '+');
            this.animateValue(this.$refs.statCandidates, 0, 500, 2000, 'K+');
            this.animateValue(this.$refs.statHires, 0, 95, 2000, '%');
            this.animateValue(this.$refs.statSpeed, 0, 60, 2000, '%');
            observer.unobserve(entry.target);
          }
        });
      }, options);
      if (this.$refs.heroStats) {
        this.observer.observe(this.$refs.heroStats);
      }
    }
  },

  mounted() {
    this.initIntersectionObserver();
  },
  beforeUnmount() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
};
</script>

<style scoped>
/* All existing styles are preserved */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Satisfy&display=swap');

@keyframes textGlow {
  0%, 100% {
    text-shadow: 0 0 8px rgba(45, 108, 255, 0.442), 0 0 16px rgba(45, 108, 255, 0.421);
  }
  50% {
    text-shadow: 0 0 16px rgba(45, 108, 255, 0.559), 0 0 32px rgba(45, 108, 255, 0.542);
  }
}
@keyframes popularGlow {
  0% { box-shadow: 0 0 10px rgba(45, 108, 255, 0.2), 0 4px 15px rgba(0, 0, 0, 0.05); }
  50% { box-shadow: 0 0 25px rgba(45, 108, 255, 0.5), 0 4px 15px rgba(0, 0, 0, 0.05); }
  100% { box-shadow: 0 0 10px rgba(45, 108, 255, 0.2), 0 4px 15px rgba(0, 0, 0, 0.05); }
}
@keyframes animatedGradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
@keyframes breathingBackground {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.landing-page { font-family: 'Inter', sans-serif; color: #2a2a2a; background: linear-gradient(-45deg, #d1e3ff, #f0f8ff, #e0f0ff, #f3eaff); background-size: 400% 400%; animation: animatedGradient 20s ease infinite; }
.glass-section { margin: 40px 60px; border-radius: 24px; padding: 60px; text-align: center; background: transparent; border: 1px solid transparent; backdrop-filter: none; -webkit-backdrop-filter: none; box-shadow: none; transition: background 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease, box-shadow 0.4s ease; }
.glass-section:hover { background: linear-gradient(135deg, rgba(208, 234, 246, 0.4), rgba(174, 212, 248, 0.5), rgba(218, 200, 252, 0.5), rgba(196, 131, 252, 0.4)); background-size: 400% 400%; animation: breathingBackground 15s ease infinite; backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.5); box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.1); }
.employer-hero { 
  display: flex; 
  align-items: center; 
  justify-content: space-between; 
  padding: 80px 60px; 
  min-height: 90vh; 
  position: relative; /* Add this to contain the new elements */
  overflow: hidden;   /* Add this to clip the shapes neatly */
}
.hero-background-elements {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0; /* Place it behind the content */
}

.hero-text, .hero-image-slider {
  position: relative;
  z-index: 1; /* Ensure hero content stays above the background */
}

.shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px); /* This creates the soft, diffused look */
  opacity: 0.6;
}

.shape-1 {
  width: 1200px;
  height: 800px;
  background: rgba(160, 196, 255, 0.751); /* Soft blue */
  top: -150px;
  left: -200px;
}

.shape-2 {
  width: 1200px;
  height: 800px;
  background: rgba(225, 212, 255, 0.759); /* Soft lavender */
  bottom: -150px;
  right: -150px;
}
.hero-text { max-width: 600px; text-align: left; }
.employer-hero h1 { font-size: 42px; font-weight: 700; margin-bottom: 20px; }
.employer-hero p { font-size: 18px; color: #333; margin-bottom: 30px; }
.hero-stats { display: flex; gap: 40px; font-size: 16px; margin-top: 40px; }
.hero-stats strong {
  display: block;
  font-size: 28px;
  color: #203bec;
  min-width: 100px;
  text-align: left;
  animation: textGlow 4s infinite ease-in-out; /* Add the glow animation */
}
.handwritten { font-family: 'Satisfy', cursive; font-size: 48px; color: #004cff; }
.features-list li, .step, .feature, .pricing-card, .testimonial-card, .reveal-trigger { background: rgba(255, 255, 255, 0.6) !important; border: 1px solid rgba(255, 255, 255, 0.7) !important; text-align: left; }
.step, .feature, .testimonial-card, .reveal-trigger { text-align: center; }
.tagline, .handwritten {
  opacity: 0;
  transform: scale(.8);
  animation: zoomIn .6s ease-out forwards, textGlow 4s infinite ease-in-out; /* Add the glow animation */
  animation-delay: .2s, 0s; /* Adjust delays if needed */
}

/* Original Styles (with minor adjustments if needed) */
.logo{font-weight:700;color:#2d6cff;font-size:24px}.nav-links a{margin:0 20px;color:#333;font-weight:500;text-decoration:none;transition:color .2s}.nav-links a:hover,.nav-links .active-link{color:#2d6cff}.auth-buttons .sign-in{margin-right:15px;font-weight:600;color:#333;text-decoration:none}.auth-buttons .sign-in:hover{color:#2d6cff}.auth-buttons .sign-up{background:#2d6cff;color:#fff;padding:8px 20px;border-radius:6px;font-weight:600;text-decoration:none}.auth-buttons .sign-up:hover{background:#1c4fcf}.hero-buttons{text-align:left;}.hero-buttons .btn{padding:14px 24px;border-radius:8px;font-weight:600;border:none;cursor:pointer;margin-right:15px;margin-bottom:20px}.btn.primary{background:#2d6cff;color:#fff}.btn.primary:hover{background:#1c4fcf}.btn.outline{background:transparent;color:#2d6cff;border:2px solid #2d6cff}.btn.outline:hover{background:rgba(45,108,255,0.1)}.tagline{opacity:0;transform:scale(.8);animation:zoomIn .6s ease-out forwards;animation-delay:.2s}.why-choose h2{font-size:32px;margin-bottom:15px}.why-choose p{color:#666;margin-bottom:50px}.features-list{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:30px;list-style:none;padding:0;margin:0}.features-list li{padding:30px;border-radius:12px;position:relative;overflow:hidden;transition:transform .3s ease,box-shadow .3s ease;opacity:0;animation:fadeInUp .6s ease-out forwards}.features-list li:nth-child(1){animation-delay:.2s}.features-list li:nth-child(2){animation-delay:.4s}.features-list li:nth-child(3){animation-delay:.6s}.features-list li:nth-child(4){animation-delay:.8s}.features-list li::after{content:'';position:absolute;top:0;left:0;right:0;height:4px;background-color:#2d6cff;transform:translateY(-100%);transition:transform .3s ease}.features-list li:hover{transform:translateY(-8px);box-shadow:0 12px 28px rgba(0,0,0,.08)}.features-list li:hover::after{transform:translateY(0)}.features-list li strong{color:#2d6cff;display:block;margin-bottom:10px;font-size:18px}.how-it-works h2{font-size:32px;margin-bottom:10px}.how-it-works p{color:#666;margin-bottom:60px}.steps{display:flex;justify-content:center;gap:40px;flex-wrap:wrap;position:relative}.steps::before{content:'';position:absolute;top:25px;left:20%;right:20%;height:2px;background:repeating-linear-gradient(90deg,#c4d5ff,#c4d5ff 8px,transparent 8px,transparent 16px);z-index:0}.step{max-width:290px;padding:30px 25px;border-radius:16px;box-shadow:0 4px 15px rgba(0,0,0,.05);transition:transform .3s ease,box-shadow .3s ease;z-index:1;opacity:0;animation:popIn .6s cubic-bezier(.34,1.56,.64,1) forwards}.steps .step:nth-child(1){animation-delay:.3s}.steps .step:nth-child(2){animation-delay:.6s}.steps .step:nth-child(3){animation-delay:.9s}.step:hover{transform:translateY(-12px);box-shadow:0 10px 25px rgba(45,108,255,.15)}.step-number{background:linear-gradient(135deg,#2d6cff,#4e8bff);color:#fff;width:50px;height:50px;font-size:20px;font-weight:700;line-height:50px;border-radius:50%;margin:0 auto 20px;transition:transform .3s ease;box-shadow:0 4px 10px rgba(45,108,255,.3)}.step:hover .step-number{transform:scale(1.15)}.step h3{font-size:20px;margin-bottom:10px;color:#333}.step p{color:#555;font-size:15px;line-height:1.6}.employer-features h2{font-size:32px;margin-bottom:10px}.employer-features p{color:#666;margin-bottom:50px}.features-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:40px}.feature{padding:30px;border-radius:12px;transition:transform .3s ease,box-shadow .3s ease,border-color .3s ease;opacity:0;animation:fadeInUp .6s ease-out forwards}.features-grid .feature:nth-child(1){animation-delay:.2s}.features-grid .feature:nth-child(2){animation-delay:.4s}.features-grid .feature:nth-child(3){animation-delay:.6s}.features-grid .feature:nth-child(4){animation-delay:.8s}.feature:hover{transform:translateY(-8px);box-shadow:0 8px 20px rgba(0,0,0,.07);border-color:#2d6cff !important}.feature-icon{font-size:36px;color:#2d6cff;margin-bottom:15px;transition:transform .4s ease}.feature:hover .feature-icon{transform:rotateY(360deg)}.feature h4{transition:color .3s ease;margin-bottom:10px}.feature:hover h4{color:#2d6cff}
@keyframes zoomIn{to{opacity:1;transform:scale(1)}}@keyframes pulseGlow{0%{box-shadow:0 0 15px rgba(45,108,255,.4)}50%{box-shadow:0 0 30px rgba(45,108,255,.6)}100%{box-shadow:0 0 15px rgba(45,108,255,.4)}}@keyframes fadeInUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}@keyframes popIn{from{opacity:0;transform:scale(.8)}to{opacity:1;transform:scale(1)}}
.pricing-card{padding:30px;border-radius:16px;box-shadow:0 4px 15px rgba(0,0,0,.05);transition:transform .3s ease,box-shadow .3s ease;border-top:4px solid transparent}.pricing-card:hover{transform:translateY(-10px);box-shadow:0 12px 28px rgba(0,0,0,.1)}.pricing-card.popular{transform:scale(1.05);position:relative;background:linear-gradient(180deg,rgba(230,240,255,0.7),rgba(255,255,255,0.7)) !important;border:1px solid rgba(45,108,255,0.4) !important;border-top:4px solid #2d6cff;animation:popularGlow 3s infinite ease-in-out}
.pricing-toggle{display:flex;justify-content:center;align-items:center;margin-bottom:40px}.pricing-toggle label{font-weight:600;color:#555;transition:color .3s ease}.pricing-toggle label.active{color:#2d6cff}.toggle-switch{width:50px;height:26px;background:#ccc;border-radius:13px;margin:0 15px;cursor:pointer;position:relative;transition:background-color .3s ease}.toggle-switch.toggled{background-color:#2d6cff}.toggle-handle{width:22px;height:22px;background:#fff;border-radius:50%;position:absolute;top:2px;left:2px;transition:transform .3s ease}.toggle-switch.toggled .toggle-handle{transform:translateX(24px)}.discount-badge{background:rgba(45,108,255,0.1);color:#2d6cff;font-size:12px;font-weight:600;padding:3px 8px;border-radius:4px;margin-left:8px}.pricing-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:30px;max-width:1100px;margin:0 auto}.pricing-card:hover{transform:translateY(-10px);box-shadow:0 12px 28px rgba(0,0,0,0.08)}.pricing-card.popular{transform:scale(1.05);position:relative}.popular-badge{position:absolute;top:-15px;left:50%;transform:translateX(-50%);background:#2d6cff;color:#fff;padding:5px 15px;border-radius:15px;font-size:14px;font-weight:600}.pricing-card h3{font-size:24px;margin-bottom:10px}.pricing-card .price{font-size:42px;font-weight:700;color:#2d6cff;margin-bottom:30px}.pricing-card .price span{font-size:16px;font-weight:400;color:#666}.pricing-card ul{list-style:none;padding:0;margin-bottom:30px}.pricing-card li{margin-bottom:15px;color:#555}.pricing-card .btn{width:100%;text-align:center;padding:14px}
.testimonial-wrapper{position:relative;max-width:800px;margin:0 auto}.client-photo{width:80px;height:80px;border-radius:50%;border:4px solid rgba(255,255,255,0.8);box-shadow:0 4px 10px rgba(0,0,0,0.1);margin-bottom:20px}.quote{font-size:18px;line-height:1.6;color:#555;margin-bottom:20px;font-style:italic}.author{font-size:16px;color:#333;margin-bottom:5px}.company-logo{font-size:14px;color:#2d6cff;font-weight:600}.nav-btn{position:absolute;top:50%;transform:translateY(-50%);background:rgba(255,255,255,0.5);border:1px solid #ddd;border-radius:50%;width:40px;height:40px;font-size:24px;cursor:pointer;transition:background-color .3s,border-color .3s;z-index:10}.nav-btn:hover{background:#2d6cff;color:#fff;border-color:#2d6cff}.prev-btn{left:-20px}.next-btn{right:-20px}.slide-fade-enter-active,.slide-fade-leave-active{transition:all .5s cubic-bezier(.55,0,.1,1)}.slide-fade-enter-from,.slide-fade-leave-to{opacity:0;transform:scale(.9)}
.reveal-trigger{display:flex;align-items:center;justify-content:center;cursor:pointer;padding:20px;margin:0;max-width:none;border-radius:20px;transition:background-color .3s,box-shadow .3s}.reveal-trigger:hover{background-color:rgba(255,255,255,0.7) !important;box-shadow:none}.reveal-trigger span{font-size:20px;font-weight:600;color:#333}.reveal-trigger::before,.reveal-trigger::after{content:'';flex:1;height:1px;background:rgba(200,215,255,0.8);margin:0 20px}.chevron{display:inline-block;width:24px;height:24px;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%232d6cff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");background-size:contain;transition:transform .4s ease;margin-left:15px}.chevron.rotated{transform:rotate(180deg)}.collapsible-content{padding-top:40px;overflow:hidden}.expand-enter-active,.expand-leave-active{transition:grid-template-rows .5s ease,opacity .5s ease}.expand-enter-from,.expand-leave-to{grid-template-rows:0fr;opacity:0}.expand-enter-to,.expand-leave-from{grid-template-rows:1fr;opacity:1}.collapsible-content{display:grid;grid-template-rows:1fr}

/* #################### MODIFIED STYLES FOR IMAGE SLIDER #################### */
.hero-image-slider {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 550px;
  height: 500px;
  position: relative;
  perspective: 1200px; /* Enhanced 3D effect */
  transform-style: preserve-3d;
}

.slider-card {
  position: absolute;
  width: 350px; /* Vertical rectangle: width < height */
  height: 500px;
  background-size: cover;
  background-position: center;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(45, 108, 255, 0.2);
  /* 👇 FIX 1: Removed the delay from the z-index transition */
  transition: transform 0.5s ease-in-out, filter 0.5s ease-in-out, opacity 0.5s ease-in-out, z-index 0.5s ease-in-out;
  cursor: pointer;
  opacity: 0.5; /* Default opacity for cards */
}

.slider-card.active {
  /* 👇 FIX 2: Added translateZ to push the active card forward */
  transform: translateZ(50px) scale(1.15); /* Enlarge and bring to center/front */
  filter: blur(0px);
  opacity: 1; /* Makes the image fully opaque */
  z-index: 10;
  box-shadow: 0 15px 40px rgba(45, 108, 255, 0.3);
  backface-visibility: hidden; /* Improves rendering quality on transforms */
}

.slider-card.prev {
  transform: translateX(-150px) scale(1) rotateY(35deg); /* Position to the left */
  opacity: 0.6; /* Removed blur, fully opaque */
  z-index: 5;
}

.slider-card.next {
  transform: translateX(150px) scale(1) rotateY(-35deg); /* Position to the right */
  opacity: 0.6; /* Removed blur, fully opaque */
  z-index: 5;
}

.slider-card.far-prev {
  transform: translateX(-280px) scale(0.9) rotateY(45deg); /* Further to the left */
  filter: blur(4px);
  opacity: 0.3;
  z-index: 1;
}

.slider-card.far-next {
  transform: translateX(280px) scale(0.9) rotateY(-45deg); /* Further to the right */
  filter: blur(4px);
  opacity: 0.3;
  z-index: 1;
}

.slider-card.hidden-card {
    transform: scale(0.5);
    opacity: 0;
}

/* Add these new styles to your <style scoped> section */

.slider-card-description {
  position: absolute;
  bottom: 25px; /* Position from the bottom of the card */
  left: 50%;
  transform: translateX(-50%) translateY(15px); /* Initial position: centered and moved down */
  background: rgba(0, 0, 0, 0.65);
  color: #fff;
  padding: 8px 18px;
  border-radius: 30px;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap; /* Keep the phrase on one line */
  opacity: 0; /* Initially hidden */
  transition: opacity 0.4s ease-out, transform 0.4s ease-out;
  pointer-events: none; /* Prevents the text from interfering with card hover */
}

/* This rule makes the description appear when you hover over the active card */
.slider-card.active:hover .slider-card-description {
  opacity: 1; /* Fade it in */
  transform: translateX(-50%) translateY(0); /* Animate it upwards */
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .employer-hero {
    flex-direction: column;
    text-align: center;
    padding: 60px 20px;
  }
  .hero-text {
    max-width: 100%;
    text-align: center;
    margin-bottom: 50px;
  }
  .hero-buttons, .hero-stats {
    justify-content: center;
  }
  .hero-image-slider {
    width: 100%;
    max-width: 500px;
    height: 400px;
    min-width: unset;
  }
  /* Adjust transforms for smaller screens */
  .slider-card.prev { transform: translateX(-110px) scale(0.9) rotateY(35deg); }
  .slider-card.next { transform: translateX(110px) scale(0.9) rotateY(-35deg); }
  .slider-card.far-prev { transform: translateX(-220px) scale(0.8) rotateY(45deg); }
  .slider-card.far-next { transform: translateX(220px) scale(0.8) rotateY(-45deg); }
}
</style>