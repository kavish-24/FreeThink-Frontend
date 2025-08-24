<!-- src/pages/HomePage.vue -->
<template>
  <div class="landing-page">
    <AppHeader />

    <section class="hero">

      <div class="hero-background-strip"></div>
      
      <h1 class="tagline" style="color: #2a2a2a; text-shadow: 0 0 5px rgba(45, 108, 255, 0.442), 0 0 6px rgba(45, 108, 255, 0.442), 0 0 8px rgba(45, 108, 255, 0.442);">Your Dream Job is Just a Click Away <br/><span class="handwritten">Explore. Apply. Succeed.</span></h1>
      <p>
        Unlock your next big opportunity - thousands of jobs, zero stress. Start your career adventure with JobHub today!
      </p>

      <div class="search-box">
    <input type="text" placeholder="🔍 Job title or keyword" v-model="searchInput" />
        <input type="text" placeholder="📍 City, state, or remote" />
        <button @click="performSearch">Search Jobs</button>
      </div>

        <div class="hero-stats" ref="heroStats">
          <div><strong ref="statJobs">0</strong> Active Jobs</div>
          <div><strong ref="statCompanies">0</strong> Companies</div>
          <div><strong ref="statSeekers">0</strong>Job Seekers</div>
        </div>
    </section>
   
    <section v-if="isLoggedIn">
      <JobListingPage :searchQuery="searchInput" />
    </section>
<section v-if="isLoggedIn && !isEmployer">
  <SuggestedSkills />
</section>
    <div v-else class="login-prompt">
      <p>
        <q-icon name="lock" size="1.2em" class="q-mr-sm" />
        Please <router-link to="/login">log in</router-link> to get personalized job suggestions.
      </p>
    </div>


    <section v-if="!isEmployer" class="categories">
      <h2>Browse Jobs by <span>Category</span></h2>
      <p>
        Explore opportunities across various industries and find the perfect role that
        matches your skills and interests.
      </p>

      <div class="category-grid">
  <q-card class="category-card cursor-pointer" style="background-image: url('https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2');" @click="gotoCategory('Technology')">
    <div class="icon">💻</div>
    <div class="card-content">
      <h3>Information Technology</h3>
      <p class="count">12,500+ jobs</p>
      <small>Software, Web Development, Data Science</small>
    </div>
  </q-card>

  <div class="category-card" style="background-image: url('https://images.pexels.com/photos/6476783/pexels-photo-6476783.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2');">
    <div class="icon">📈</div>
    <div class="card-content">
      <h3>Marketing & Sales</h3>
      <p class="count">8,300+ jobs</p>
      <small>Digital Marketing, Sales, Business Development</small>
    </div>
  </div>

  <div class="category-card" style="background-image: url('https://images.pexels.com/photos/7788009/pexels-photo-7788009.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2');">
    <div class="icon">💰</div>
    <div class="card-content">
      <h3>Finance & Accounting</h3>
      <p class="count">6,700+ jobs</p>
      <small>Accounting, Financial Analysis, Investment</small>
    </div>
  </div>

  <div class="category-card" style="background-image: url('https://images.pexels.com/photos/3184433/pexels-photo-3184433.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2');">
    <div class="icon">👥</div>
    <div class="card-content">
      <h3>Human Resources</h3>
      <p class="count">4,200+ jobs</p>
      <small>HR Management, Recruitment, Training</small>
    </div>
  </div>

  <div class="category-card" style="background-image: url('https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2');">
    <div class="icon">📦</div>
    <div class="card-content">
      <h3>Business & Consulting</h3>
      <p class="count">3,800+ jobs</p>
      <small>Strategy, Operations, Management</small>
    </div>
  </div>

  <div class="category-card" style="background-image: url('https://images.pexels.com/photos/326503/pexels-photo-326503.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2');">
    <div class="icon">🎨</div>
    <div class="card-content">
      <h3>Design & Creative</h3>
      <p class="count">2,900+ jobs</p>
      <small>UI/UX, Graphics, Content Creation</small>
    </div>
  </div>

  <div class="category-card" style="background-image: url('https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2');">
    <div class="icon">🛡️</div>
    <div class="card-content">
      <h3>Legal & Compliance</h3>
      <p class="count">1,500+ jobs</p>
      <small>Legal Affairs, Compliance, Risk</small>
    </div>
  </div>

  <div class="category-card" style="background-image: url('https://images.pexels.com/photos/3992933/pexels-photo-3992933.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2');">
    <div class="icon">⚕️</div>
    <div class="card-content">
      <h3>Healthcare & Medical</h3>
      <p class="count">5,200+ jobs</p>
      <small>Medical, Nursing, Healthcare Admin</small>
    </div>
  </div>
</div>
    </section>
        <section v-if="!isLoggedIn" class="how-it-works">
      <h2>How It Works</h2>
      <p class="subtitle">
        Get started with your job search in three simple steps. Our streamlined process<br />
        makes finding your next opportunity easier than ever.
      </p>

      <div class="steps">
        <div class="step">
          <div class="step-icon blue">👤➕</div>
          <div class="step-number">1</div>
          <h3>Create Profile</h3>
          <p>Sign up and build your professional profile with your skills, experience, and preferences.</p>
        </div>

        <div class="step">
          <div class="step-icon green">🔍</div>
          <div class="step-number">2</div>
          <h3>Search & Apply</h3>
          <p>Browse through thousands of jobs, filter by your preferences, and apply with one click.</p>
        </div>

        <div class="step">
          <div class="step-icon purple">✅</div>
          <div class="step-number">3</div>
          <h3>Get Hired</h3>
          <p>Connect with employers, attend interviews, and land your dream job with our support.</p>
        </div>
      </div>

      <div class="features">
        <div class="feature-item">
          <strong>Quick Setup</strong>
          <small>Create your profile in under 5 minutes</small>
        </div>
        <div class="feature-item">
          <strong>Smart Matching</strong>
          <small>AI-powered job recommendations</small>
        </div>
        <div class="feature-item">
          <strong>24/7 Support</strong>
          <small>Get help whenever you need it</small>
        </div>
      </div>
    </section>

    <!-- Add other homepage sections here -->
    
    <AppFooter />
  </div>
</template>

<script>
import AppHeader from '../components/HeaderPart.vue';
import AppFooter from '../components/FooterPart.vue';
import JobListingPage from './JobListing.vue';
import { useRouter } from 'vue-router';
import { ref, onMounted, computed } from 'vue'; // Added computed here
import { useAuthStore } from '../stores/auth.store';
import { storeToRefs } from 'pinia';
import SuggestedSkills from '../components/SuggestedSkills.vue';
export default {
  name: 'HomePage',
  components: {
    AppHeader,
    AppFooter,
    JobListingPage,
    SuggestedSkills
  },
  setup() {
    const router = useRouter();
    const searchInput = ref('');
    const authStore = useAuthStore();
    const { isAuthenticated } = storeToRefs(authStore);
    const isLoggedIn = computed(() => !!authStore.userData);
    const isEmployer = computed(() => authStore.userData?.role === 'company');

    // DECLARED REFS for template elements to enable animation
    const heroStats = ref(null);
    const statJobs = ref(null);
    const statCompanies = ref(null);
    const statSeekers = ref(null);

    // This is the animation logic for the counters
    function animateCount(refVar, target, duration = 2000) {
        if (!refVar.value) return; // Guard clause if the element isn't rendered
        const start = 0;
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const currentVal = Math.floor(progress * (target - start) + start);
            refVar.value.innerText = currentVal.toLocaleString();
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    function initIntersectionObserver() {
      const options = {
        root: null,
        threshold: 0.5
      };

      const observer = new IntersectionObserver((entries, observerInstance) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Call animateCount for each stat
            animateCount(statJobs, 50000);
            animateCount(statCompanies, 15000);
            animateCount(statSeekers, 2000000);
            
            // Stop observing after the animation has run once
            observerInstance.unobserve(entry.target);
          }
        });
      }, options);

      if (heroStats.value) {
        observer.observe(heroStats.value);
      }
    }

    function gotoCategory(category) {
      router.push({ name: 'JobListing', params: { category } });
    }

    function performSearch() {
      searchInput.value = searchInput.value.trim();
    }

    onMounted(() => {
      authStore.initialize();
      initIntersectionObserver();
    });

    return {
      gotoCategory,
      isAuthenticated,
      searchInput,
      performSearch,
      isLoggedIn,
      isEmployer,
      heroStats,
      statJobs,
      statCompanies,
      statSeekers
    };
  }
};
</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Satisfy&display=swap');
.sticky-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  /* The header component has its own background and shadow */
}
@keyframes breathe {
  0%   { background-color: #e1f5fe; } /* Light Sky Blue */
  20%  { background-color: #e0f2f1; } /* Light Cyan/Green */
  40%  { background-color: #fffde7; } /* Light Yellow */
  60%  { background-color: #f3e5f5; } /* Light Violet/Purple */
  80%  { background-color: #e3f2fd; } /* Light Blue */
  100% { background-color: #e1f5fe; } /* Back to Light Sky Blue */
}
@keyframes hover-breathe {
  0%   { background-color: #e3f2fd; } /* Light Blue */
  25%  { background-color: #fff3f7ff; } /* Light Pink */
  50%  { background-color: #fbf4e8ff; } /* Light Orange */
  75%  { background-color: #fffde7; } /* Light Yellow */
  100% { background-color: #e3f2fd; } /* Back to Light Blue */
}
@keyframes sea-breathe {
  0%   { background-color: #e0f7fa; } /* Light Sea Blue */
  50%  { background-color: #e0f2f1; } /* Light Sea Green */
  100% { background-color: #e0f7fa; } /* Back to Light Sea Blue */
}
/* ADD THESE NEW STYLES */

@keyframes animated-gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
/* In <style scoped> */

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0; /* Places it behind the hero content */

  /* 1. The background image */
  background-image: url('src/assets/bghome2.jpeg');
  background-size: cover;
  background-position: center;
  
  /* 2. A soft blur effect */
  filter: blur(5px);
  
  /* 3. The mask that makes the center transparent */
  -webkit-mask-image: 
  /* This first mask makes the center transparent */
  linear-gradient(to right, 
    black 15%, transparent 45%, transparent 55%, black 85%
  ),
  /* This second mask makes the bottom edge blurry */
  linear-gradient(to bottom,
    black 85%, 
    transparent 100%
  );

mask-image: 
  linear-gradient(to right, 
    black 15%, transparent 45%, transparent 55%, black 85%
  ),
  linear-gradient(to bottom,
    black 85%, 
    transparent 100%
  );
}
.hero-background-strip {
  position: absolute;
  top: 50%;
  left: -10%; /* Extend beyond the edges */
  right: -10%;
  height: 450px; /* Adjust height as needed */
  transform: translateY(-50%) rotate(-2deg); /* Slight angle for dynamism */
  z-index: 0; /* Place it behind the content */

  /* A soft, multi-tone blue gradient */
  background: linear-gradient(-45deg, #c8e4f9, #b9d4ff, #baf7fe, #9dd3ff);
  background-size: 400% 400%;
  animation: animated-gradient 15s ease infinite;
  
  filter: blur(20px); /* Softens the entire strip */
  opacity: 0.7; /* Make it subtle */
}

/* Ensure hero content stays on top of the new strip */
.hero h1,
.hero p,
.hero .search-box,
.hero .hero-stats {
  position: relative;
  z-index: 1;
}

.landing-page {
  font-family: 'Inter', 'Segoe UI', sans-serif;
  color: #2a2a2a;
  animation: breathe 18s ease-in-out infinite;
  line-height: 1.6;
}

/* Navbar */
.navbar {
  display: flex;
  justify-content: space-between;
  padding: 20px 60px;
  align-items: center;
  background-color: #fff;
  border-bottom: 1px solid #eaecef;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
}

.logo {
  font-weight: 700;
  color: #1565c0;
  font-size: 24px;
}

.nav-links a {
  margin: 0 20px;
  color: #333;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s;
}
.nav-links a:hover {
  color: #1565c0;
}

.auth-buttons .sign-in {
  margin-right: 15px;
  font-weight: 600;
  color: #333;
  text-decoration: none;
}
.auth-buttons .sign-in:hover {
  color: #1565c0;
}

.auth-buttons .sign-up {
  background-color: #1565c0;
  color: white;
  padding: 8px 20px;
  border-radius: 6px;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.3s;
}
.auth-buttons .sign-up:hover {
  background-color: #1c4fcf;
}

.section-divider {
  border: 0;
  height: 1px;
  background-image: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(21, 101, 192, 0.2), rgba(0, 0, 0, 0));
  margin: 20px auto;
}
.handwritten {
  opacity: 0;
  transform: scale(.8);
  animation: zoomIn .6s ease-out forwards, textGlow 4s infinite ease-in-out; /* Add the glow animation */
  animation-delay: .2s, 0s; /* Adjust delays if needed */
}

/* Hero */
.hero {
  text-align: center;
  padding: 90px 20px 70px;
  position: relative; 
  overflow: hidden;   
}
.hero h1 {
  font-size: 44px;
  font-weight: 700;
}
.hero h1 span {
  color: #1565c0;
}
.hero p {
  margin-top: 20px;
  color: #555;
  font-size: 18px;
}
.hero-stats {
  display: flex;
  justify-content: center;
  gap: 40px;
  font-size: 16px;
  margin: 60px auto 0;
  padding: 20px;
  max-width: 800px;
  background-color: transparent;
  backdrop-filter: blur(4px);
}
.hero-stats > div {
  position: relative;
  padding: 0 30px;
  text-align: center;
}
.hero-stats > div:not(:last-child)::after {
  content: '';
  position: absolute;
  right: -5px;
  top: 50%;
  transform: translateY(-50%);
  width: 1px;
  height: 40px;
  background-color: #dbe4f0;
}
.hero-stats strong {
  display: block;
  font-size: 28px;
  color: #1565c0; 
}

/* Search */
.search-box {
  margin-top: 40px;
  display: flex;
  justify-content: center;
  gap: 0; 
  flex-wrap: wrap;
  background: #fff;
  padding: 12px;
 border-radius: 12px;
  box-shadow: 0 8px 32px rgba(21, 101, 192, 0.15);
  max-width: 850px;
  margin-left: auto;
  margin-right: auto;
}
.search-box input {
  padding: 14px 20px;
  border: none; 
  border-radius: 0;
  width: 260px;
  font-size: 15px;
  border-right: 1px solid #eee; 
}
.search-box input:last-of-type {
  border-right: none;
}
.search-box button {
  background-color: #1565c0;
  color: white;
  padding: 14px 24px;
  border: none;
  border-radius: 8px; 
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-left: 10px;
}
.search-box button:hover {
  background-color: #1c4fcf;
}

/* Stats */
.stats {
  display: flex;
  justify-content: center;
  gap: 60px;
  margin-top: 50px;
  font-size: 17px;
  color: #444;
}
.stats strong {
  font-size: 24px;
  color: #1565c0;
}

/* logged-out message */
.login-prompt {
  text-align: center;
  font-size: 25px;
  font-family: monospace;
  padding: 30px 20px;
  background-color: transparent; /* Changed from a solid color */
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  margin: 40px auto;
  max-width: 800px;
  color: #555;
  transition: background-color 0.4s ease; /* For a smooth start to the hover */
}

/* ADD THIS: Apply the new animation on hover */
.login-prompt:hover {
  animation: sea-breathe 8s ease-in-out infinite;
}

.login-prompt a {
  color: #1565c0; /* Your theme's primary blue color */
  font-weight: 600;
  text-decoration: none;
}

.login-prompt a:hover {
  text-decoration: underline;
}

/* Categories */
.categories {
  text-align: center;
  font-family: Lucida Bright;
  padding: 60px 30px 70px;
  background-color: transparent; /* Changed from a solid color */
  border-radius: 20px; /* Add border-radius for a nicer hover effect */
  transition: background-color 0.5s ease; /* Smooth transition in */
}
.categories h2 {
  font-size: 40px;
  font-family: MV Boli;
  font-weight: 700;
  margin-bottom: 12px;
}
.categories h2 span {
  color: #1565c0;
}
.categories p {
  font-size: 20px;
  font-family:Rockwell;
  color: #666;
}
.category-grid {
  display: flex; 
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));         
  flex-wrap: wrap;        
  justify-content: center;
  gap: 32px;
  margin-top: 20px;
}
.category-card {
  position: relative; /* For positioning child elements */
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  min-width: 260px;
  max-width: 300px;
  height: 300px; /* Adjusted height */
  overflow: hidden; /* Important for border-radius on children */
  
  /* Flexbox to position icon at top and content at bottom */
  display: flex;
  flex-direction: column;
  justify-content: space-between; 
  padding: 0; /* Remove old padding */
  
  /* Styles for the new background image */
  background-size: cover;
  background-position: center;
}
/* Add a dark overlay to make text more readable */
.category-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1;
}
.category-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 8px 32px rgba(37, 139, 222, 0.851);
  border: none;
}
.categories h2 {
  /* Keep your existing font styles */
  font-size: 40px;
  font-family: MV Boli;
  font-weight: 700;
  margin-bottom: 12px;

  /* Add this for a smooth animation */
  transition: transform 0.3s ease-out, text-shadow 0.4s ease-out;
  cursor: pointer; /* Changes the cursor to indicate it's interactive */
}

.categories h2:hover {
  /* 1. Animate the heading upwards */
  transform: translateY(-6px);
  
  /* 2. Add a soft blue glow that matches your theme */
  text-shadow: 0 0 12px rgba(10, 121, 247, 0.842);
}
.card-content {
  background: rgba(227, 242, 253, 0.668); /* Semi-transparent light blue */
  backdrop-filter: blur(10px); /* The "glossy" effect */
  -webkit-backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.5);
  padding: 16px;
  width: 100%;
  z-index: 2; /* Ensure it's above the ::before overlay */
  text-align: center;
  max-height: 55px; /* Collapsed height, just enough for the h3 */
  overflow: hidden; /* Hides the extra content */
  transition: max-height 0.4s ease-in-out;
  box-sizing: border-box; /* Ensures padding is included in height calculation */
}
.category-card:hover .card-content {
  max-height: 180px; /* Expanded height, enough for all content */
}
.card-content .count,
.card-content small {
  display: block; /* Ensures they take up their own line */
  opacity: 0;
  max-height: 0;
  transition: opacity 0.2s ease, max-height 0.2s ease;
}
.category-card:hover .card-content .count,
.category-card:hover .card-content small {
  opacity: 1;
  max-height: 50px; /* Give them space to appear */
  transition-delay: 0.15s; /* Delay the fade-in until the box has expanded a bit */
}
.category-card .icon {
  font-size: 32px;
  z-index: 2; /* Above the overlay */
  margin: 20px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  color: white; /* Make the emoji render cleanly */
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.5); /* A shadow to lift it off the image */
  align-self: flex-start; /* Position icon to the top-left */
}
/* Keep other text styles, but ensure they are targeting the new structure */
.category-card h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1d2b53;
  margin: 0 0 8px 0; /* Adjust margin */
}
.category-card .count {
  color: #1565c0;
  font-weight: 700;
}
.category-card small {
  color: #334e68;
  font-size: 13px;
}

/* How it works */
.how-it-works {
  padding: 80px 30px;
  text-align: center;
  background-color: rgba(240, 245, 255, 0.5); /* Lighter, subtle background */
  border-radius: 20px;
  transition: background-color 0.5s ease;
  position: relative;
  overflow: hidden;
}
.how-it-works::before {
  content: '';
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 400'%3E%3Cpath d='M-200 100 Q-100 0 0 100 T200 100 T400 100 T600 100 T800 100 T1000 100' stroke='%23eef4ff' fill='none' stroke-width='2'/%3E%3Cpath d='M-200 200 Q-100 100 0 200 T200 200 T400 200 T600 200 T800 200 T1000 200' stroke='%23eef4ff' fill='none' stroke-width='2'/%3E%3C/svg%3E");
  opacity: 0.5;
  z-index: 0;
}
.how-it-works > * {
  position: relative;
  z-index: 1;
}
.how-it-works h2 {
  font-size: 40px;
  font-family: 'MV Boli';
  color: #1565c0;
  margin-bottom: 10px;
  transition: transform 0.3s ease-out, text-shadow 0.4s ease-out;
  cursor: pointer;
}
.how-it-works h2:hover {
  transform: translateY(-5px);
  text-shadow: 0 0 12px rgba(21, 101, 192, 0.741);
}
.how-it-works .subtitle {
  font-size: 20px;
  font-style: bold;
  font-family: 'Geneva';
  color: #556;
  margin-bottom: 70px; /* Increased margin for more space */
}

.categories:hover,
.how-it-works:hover {
  animation: hover-breathe 15s ease-in-out infinite;
}

.steps {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 30px; /* Slightly reduced gap */
  margin-bottom: 50px;
  position: relative;
}
.steps::before {
  content: '';
  position: absolute;
  top: 55px; /* Adjust vertical position to align with icons */
  left: 15%;
  right: 15%;
  height: 2px;
  background: repeating-linear-gradient(90deg, #cddcff, #cddcff 6px, transparent 6px, transparent 12px);
  z-index: 0;
}
.step {
  /* --- The "Glass" Foundation --- */
  background: rgba(195, 244, 252, 0.7); /* More opaque white for a clearer glass effect */
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  
  /* --- The "Glass" Edge --- */
  border: 1px solid rgba(255, 255, 255, 0.4); /* A border to define the edge */
  border-right-color: rgba(255, 255, 255, 0.2);
  border-bottom-color: rgba(255, 255, 255, 0.2);

  /* --- General Styling & Animation --- */
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 8px 32px rgba(73, 31, 189, 0.188);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1 1 300px;
  max-width: 320px;

  /* --- Prep for the Glossy Sheen --- */
  position: relative;
  overflow: hidden;
}
.step::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    to bottom right,
    rgba(255, 255, 255, 0),
    rgba(255, 255, 255, 0.4) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  transform: rotate(45deg);
  opacity: 0;
  transition: opacity 0.5s ease;
}
.step:hover {
  transform: translateY(-10px);
  box-shadow: 0 12px 40px rgba(25, 126, 242, 0.705);
}
.step:hover::after {
  opacity: 1;
}
.step-icon {
  font-size: 28px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  color: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}
/* Unique gradient backgrounds for each icon */
.step-icon.blue { background: linear-gradient(135deg, #4dabf7, #1565c0); }
.step-icon.green { background: linear-gradient(135deg, #66bb6a, #2e7d32); }
.step-icon.purple { background: linear-gradient(135deg, #ab47bc, #6a1b9a); }
.step-number {
  background-color: rgba(255, 255, 255, 0.2);
  color: #1565c0;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  font-size: 14px;
  font-weight: 700;
  line-height: 28px;
  margin-top: -20px; /* Pulls number slightly over the icon */
  margin-bottom: 20px;
  border: 2px solid white;
}
.step h3 {
  font-size: 20px;
  margin: 0 0 10px 0;
  color: #1d2b53;
  font-weight: 800;
}

.step p {
  font-size: 15px;
  color: #445;
  line-height: 1.6;
}

.tagline {
  opacity: 0;
  transform: scale(0.8);
  animation: zoomIn 0.6s ease-out forwards;
  animation-delay: 0.2s;
}

@keyframes zoomIn {
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.features {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  text-align: center;
  gap: 80px;
  margin-top: 40px;
  flex-wrap: wrap;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 200px;
  background-color: #f5eefb;
  border-radius: 10px;
  padding: 10px; 
  transition: all 0.3s ease; 
}

.feature-item:hover {
  transform: translateY(-4px);
  background-color: #debdf9;
  box-shadow: 0 5px 15px #6124da7f; 
}

.feature-item strong {
  color: #1565c0; /* professional blue */
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 8px;
  text-decoration: underline;
}

.feature-item small {
  color: #555;
  font-size: 0.9rem;
  line-height: 1.3;
  font-family: sans-serif;
  font-size: 15px;
}

.handwritten {
  font-family: 'Satisfy', cursive;
  font-size: 30px;
  color: #1565c0; /* Keep the same blue or adjust */
  display: inline-block;
  margin-top: 10px;
  letter-spacing: 1px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.05);
  font-size: larger;
}

.footer {
  background: #1565c0;
  color: white;
  padding: 60px 40px 20px;
  margin-top: 80px;
}

.footer-top {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 40px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 40px;
}

.footer-brand {
  max-width: 300px;
}
.footer-logo {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
}
.footer-brand p {
  font-size: 14px;
  line-height: 1.6;
  color: #e0e0e0;
}
.social-icons {
  margin-top: 15px;
}
.social-icons a {
  margin-right: 10px;
  color: white;
  font-size: 16px;
  transition: color 0.2s ease;
}
.social-icons a:hover {
  color: #cfd8ff;
}

.footer-links {
  display: flex;
  gap: 50px;
  flex-wrap: wrap;
}
.footer-links h4 {
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: 600;
}
.footer-links a {
  display: block;
  margin-bottom: 8px;
  color: #e0e0e0;
  font-size: 14px;
  text-decoration: none;
}
.footer-links a:hover {
  color: white;
}

.footer-bottom {
  text-align: center;
  font-size: 13px;
  padding-top: 20px;
  color: #cbdfff;
}

.nav-links .active-link {
  position: relative;
  color: #1565c0;
  font-weight: 700;
  transition: color 0.3s ease;
}

.nav-links .active-link::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #1565c0;
  animation: slideIn 0.3s ease-out forwards;
}

@keyframes slideIn {
  0% {
    width: 0;
    opacity: 0;
  }
  100% {
    width: 100%;
    opacity: 1;
  }
}

.nav-link {
  position: relative;
  font-weight: 500;
  color: white;
  text-transform: none;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: white;
  transition: width 0.3s ease-in-out;
}

.nav-link:hover::after,
.nav-link.router-link-exact-active::after {
  width: 100%;
}

.search-box input:hover {
  border-color: #1565c0;
  box-shadow: 0 0 0 2px rgba(21, 101, 192, 0.2);
  transition: all 0.3s ease;
}

.search-box button:hover {
  transform: scale(1.05);
  background-color: #1c4fcf;
}


.step:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(21, 101, 192, 0.1);
  transition: all 0.3s ease;
}

.feature-item:hover {
  transform: translateY(-4px);
  transition: all 0.3s ease;
  background-color: #f4f8ff;
  border-radius: 10px;
  padding: 10px;
}

</style>