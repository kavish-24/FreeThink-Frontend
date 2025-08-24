<template>
  <div class="modern-homepage">
    <AppHeader />
    
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-background">
        <div class="hero-gradient"></div>
        <div class="hero-pattern"></div>
      </div>
      
      <div class="container-unstop hero-content">
        <div class="hero-text animate-slide-up">
          <h1 class="hero-title">
            Your Dream Job is Just a Click Away
            <span class="handwritten">Explore. Apply. Succeed.</span>
          </h1>
          <p class="hero-subtitle">
            Connect with top companies, discover amazing opportunities, and take the next step in your career journey with JobHub.
          </p>
        </div>

        <!-- Modern Search Box -->
        <div class="search-container animate-fade-in">
          <div class="search-box-modern">
            <div class="search-input-group">
              <q-icon name="search" class="search-icon" />
              <input 
                type="text" 
                placeholder="Job title, keywords, or company" 
                v-model="searchInput"
                class="search-input"
              />
            </div>
            <div class="search-input-group">
              <q-icon name="place" class="search-icon" />
              <input 
                type="text" 
                placeholder="City, state, or remote" 
                v-model="locationInput"
                class="search-input"
              />
            </div>
            <q-btn 
              class="btn-unstop btn-primary search-btn"
              icon="search"
              label="Search Jobs"
              @click="performSearch"
              no-caps
            />
          </div>
          
          <!-- Quick Filters -->
          <div class="quick-filters">
            <span class="filter-label">Popular:</span>
            <q-chip 
              v-for="filter in quickFilters" 
              :key="filter"
              clickable
              outline
              color="primary"
              class="filter-chip"
              @click="searchInput = filter; performSearch()"
            >
              {{ filter }}
            </q-chip>
          </div>
        </div>

        <!-- Hero Stats -->
        <div class="hero-stats animate-bounce-in" ref="heroStats">
          <div class="stat-card">
            <div class="stat-number" ref="statJobs">0</div>
            <div class="stat-label">Active Jobs</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-card">
            <div class="stat-number" ref="statCompanies">0</div>
            <div class="stat-label">Companies</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-card">
            <div class="stat-number" ref="statSeekers">0</div>
            <div class="stat-label">Job Seekers</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Job Listings or Login Prompt -->
    <section v-if="isLoggedIn" class="jobs-section">
      <JobListingPage :searchQuery="searchInput" />
    </section>

    <!-- Categories Section -->
    <section v-if="!isEmployer" class="categories-section">
      <div class="container-unstop">
        <div class="section-header">
          <h2 class="section-title">
            Explore Jobs by <span class="gradient-text">Category</span>
          </h2>
          <p class="section-subtitle">
            Discover opportunities across various industries and find the perfect role that matches your skills and interests.
          </p>
        </div>

        <div class="categories-grid">
          <div 
            v-for="category in jobCategories" 
            :key="category.name"
            class="category-card-modern card-unstop card-interactive"
            @click="gotoCategory(category.slug)"
          >
            <div class="category-header">
              <div class="category-icon" :style="{ background: category.gradient }">
                <q-icon :name="category.icon" />
              </div>
              <div class="category-trend" v-if="category.trending">
                <q-icon name="trending_up" />
                <span>Trending</span>
              </div>
            </div>
            <div class="category-content">
              <h3 class="category-title">{{ category.name }}</h3>
              <div class="category-count">{{ category.count }}+ jobs</div>
              <p class="category-description">{{ category.description }}</p>
            </div>
            <div class="category-footer">
              <q-btn 
                flat
                icon="arrow_forward"
                class="explore-btn"
                size="sm"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section v-if="!isLoggedIn" class="how-it-works-section">
      <div class="container-unstop">
        <div class="section-header">
          <h2 class="section-title">How It <span class="gradient-text">Works</span></h2>
          <p class="section-subtitle">
            Get started with your job search in three simple steps. Our streamlined process makes finding your next opportunity easier than ever.
          </p>
        </div>

        <div class="steps-container">
          <div class="step-modern" v-for="(step, index) in howItWorksSteps" :key="index">
            <div class="step-visual">
              <div class="step-icon-modern" :style="{ background: step.gradient }">
                <q-icon :name="step.icon" />
              </div>
              <div class="step-number-modern">{{ index + 1 }}</div>
            </div>
            <div class="step-content">
              <h3 class="step-title">{{ step.title }}</h3>
              <p class="step-description">{{ step.description }}</p>
            </div>
            <div v-if="index < howItWorksSteps.length - 1" class="step-connector">
              <q-icon name="arrow_forward" />
            </div>
          </div>
        </div>

        <!-- Features Grid -->
        <div class="features-grid">
          <div 
            v-for="feature in features" 
            :key="feature.title"
            class="feature-card card-unstop"
          >
            <div class="feature-icon" :style="{ background: feature.gradient }">
              <q-icon :name="feature.icon" />
            </div>
            <h4 class="feature-title">{{ feature.title }}</h4>
            <p class="feature-description">{{ feature.description }}</p>
          </div>
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
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '../stores/auth.store';
import { storeToRefs } from 'pinia';

export default {
  name: 'HomePage',
  components: {
    AppHeader,
    AppFooter,
    JobListingPage
  },
  setup() {
    const router = useRouter();
    const searchInput = ref('');
    const locationInput = ref('');
    const authStore = useAuthStore();
    const { isAuthenticated } = storeToRefs(authStore);
    const isLoggedIn = computed(() => authStore.isAuthenticated);
    const isEmployer = computed(() => authStore.role === 'company');

    const heroStats = ref(null);
    const statJobs = ref(null);
    const statCompanies = ref(null);
    const statSeekers = ref(null);

    const quickFilters = ['Remote', 'Full-time', 'Software Engineer', 'Marketing', 'Design'];

    const jobCategories = [
      {
        name: 'Information Technology',
        slug: 'technology',
        icon: 'computer',
        count: '12,500',
        description: 'Software, Web Development, Data Science',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        trending: true
      },
      {
        name: 'Marketing & Sales',
        slug: 'marketing',
        icon: 'trending_up',
        count: '8,300',
        description: 'Digital Marketing, Sales, Business Development',
        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
      },
      {
        name: 'Finance & Accounting',
        slug: 'finance',
        icon: 'account_balance',
        count: '6,700',
        description: 'Accounting, Financial Analysis, Investment',
        gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
      },
      {
        name: 'Design & Creative',
        slug: 'design',
        icon: 'palette',
        count: '2,900',
        description: 'UI/UX, Graphics, Content Creation',
        gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        trending: true
      },
      {
        name: 'Healthcare & Medical',
        slug: 'healthcare',
        icon: 'local_hospital',
        count: '5,200',
        description: 'Medical, Nursing, Healthcare Admin',
        gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
      },
      {
        name: 'Business & Consulting',
        slug: 'business',
        icon: 'business_center',
        count: '3,800',
        description: 'Strategy, Operations, Management',
        gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
      }
    ];

    const howItWorksSteps = [
      {
        title: 'Create Your Profile',
        description: 'Sign up and build your professional profile with your skills, experience, and career preferences.',
        icon: 'person_add',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      },
      {
        title: 'Search & Discover',
        description: 'Browse thousands of jobs, use smart filters, and get intelligent recommendations tailored for you.',
        icon: 'search',
        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
      },
      {
        title: 'Apply & Get Hired',
        description: 'Apply with one click, track your applications, and connect with employers to land your dream job.',
        icon: 'work',
        gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
      }
    ];

    const features = [
      {
        title: 'Quick Setup',
        description: 'Create your profile in under 5 minutes',
        icon: 'flash_on',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      },
      {
        title: 'Smart Matching',
        description: 'Smart job recommendations',
        icon: 'psychology',
        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
      },
      {
        title: '24/7 Support',
        description: 'Get help whenever you need it',
        icon: 'support_agent',
        gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
      }
    ];

    function animateCount(refVar, target, duration = 2000) {
      if (!refVar.value) return;
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
            animateCount(statJobs, 50000);
            animateCount(statCompanies, 15000);
            animateCount(statSeekers, 2000000);
            observerInstance.unobserve(entry.target);
          }
        });
      }, options);

      if (heroStats.value) {
        observer.observe(heroStats.value);
      }
    }

    function gotoCategory(category) {
      router.push(`/jobs/${category}`);
    }

    function performSearch() {
      const query = searchInput.value.trim();
      const location = locationInput.value.trim();
      
      if (query || location) {
        const searchParams = new URLSearchParams();
        if (query) searchParams.append('q', query);
        if (location) searchParams.append('location', location);
        
        router.push(`/jobs?${searchParams.toString()}`);
      }
    }

    onMounted(() => {
      authStore.initialize();
      initIntersectionObserver();
    });

    return {
      gotoCategory,
      isAuthenticated,
      searchInput,
      locationInput,
      performSearch,
      isLoggedIn,
      isEmployer,
      heroStats,
      statJobs,
      statCompanies,
      statSeekers,
      quickFilters,
      jobCategories,
      howItWorksSteps,
      features
    };
  }
};
</script>

<style scoped>

.modern-homepage {
  font-family: var(--font-family-primary);
  background: var(--color-gray-50);
  overflow-x: hidden;
}

/* Hero Section */
.hero-section {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

.hero-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, 
    rgba(14, 165, 233, 0.1) 0%, 
    rgba(139, 92, 246, 0.1) 50%, 
    rgba(236, 72, 153, 0.1) 100%);
}

.hero-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 25% 25%, rgba(14, 165, 233, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.1) 0%, transparent 50%);
  background-size: 400px 400px;
  animation: float 20s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(30px, -30px) rotate(120deg); }
  66% { transform: translate(-20px, 20px) rotate(240deg); }
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: var(--space-20) var(--space-6) var(--space-16) var(--space-6);
  max-width: 1200px;
  margin: 0 auto;
}


.hero-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  font-family: var(--font-family-display);
  line-height: 1.1;
  margin: 0 0 var(--space-6) 0;
  color: var(--color-gray-900);
}
.handwritten {
  font-family: 'Satisfy', cursive, sans-serif !important;
  font-size: 48px !important;
  color: #60348d !important;
  opacity: 1 !important; /* Force visibility */
  animation: none !important; /* Disable zoomIn and textGlow */
  transform: none !important; /* Remove scaling */
  display: inline !important;
  z-index: 10 !important; /* Ensure it’s not hidden behind other elements */
}

.hero-text {
  animation: slideUp 0.8s ease-out !important; 
  opacity: 1 !important;
  transform: translateY(0) !important;
}
.hero-subtitle {
  font-size: var(--font-size-xl);
  color: var(--color-gray-600);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Search Container */
.search-container {
  margin-bottom: var(--space-16);
}

.search-box-modern {
  display: flex;
  background: var(--color-surface);
  border-radius: var(--border-radius-2xl);
  padding: var(--space-2);
  box-shadow: var(--shadow-xl);
  border: 1px solid var(--color-gray-200);
  max-width: 800px;
  margin: 0 auto var(--space-6) auto;
  gap: var(--space-2);
}

.search-input-group {
  flex: 1;
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--border-radius-xl);
  transition: all var(--transition-base);
}

.search-input-group:hover {
  background: var(--color-gray-50);
}

.search-icon {
  color: var(--color-gray-400);
  font-size: 1.25rem;
  flex-shrink: 0;
}

.search-input {
  border: none;
  outline: none;
  background: transparent;
  font-size: var(--font-size-base);
  color: var(--color-gray-800);
  width: 100%;
  font-family: var(--font-family-primary);
}

.search-input::placeholder {
  color: var(--color-gray-400);
}

.search-btn {
  flex-shrink: 0;
  padding: var(--space-4) var(--space-6);
  font-size: var(--font-size-base);
  font-weight: 600;
}

.quick-filters {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  flex-wrap: wrap;
}

.filter-label {
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
  font-weight: 500;
}

.filter-chip {
  font-size: var(--font-size-xs);
  font-weight: 500;
}

/* Hero Stats */
.hero-stats {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--space-8);
  background: var(--color-surface);
  border-radius: var(--border-radius-2xl);
  padding: var(--space-8);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--color-gray-200);
  max-width: 600px;
  margin: 0 auto;
}

.stat-card {
  text-align: center;
}

.stat-number {
  font-size: var(--font-size-3xl);
  font-weight: 800;
  color: var(--color-primary-600);
  display: block;
  font-family: var(--font-family-display);
}

.stat-label {
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
  font-weight: 500;
  margin-top: var(--space-1);
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: var(--color-gray-200);
}

/* Login Prompt Section */
.login-prompt-section {
  padding: var(--space-20) var(--space-6);
  background: var(--color-surface);
}

.login-prompt-container {
  max-width: 1200px;
  margin: 0 auto;
}

.login-prompt-card {
  text-align: center;
  max-width: 500px;
  margin: 0 auto;
  padding: var(--space-12);
  background: var(--color-surface);
  border-radius: var(--border-radius-2xl);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--color-gray-200);
}

.prompt-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto var(--space-6) auto;
  background: linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-accent-purple) 100%);
  border-radius: var(--border-radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
}

.prompt-icon .q-icon {
  font-size: 2.5rem;
  color: white;
}

.prompt-title {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-gray-800);
  margin: 0 0 var(--space-4) 0;
}

.prompt-text {
  font-size: var(--font-size-base);
  color: var(--color-gray-600);
  line-height: 1.6;
  margin: 0 0 var(--space-8) 0;
}

.prompt-actions {
  display: flex;
  gap: var(--space-4);
  justify-content: center;
  flex-wrap: wrap;
}



/* Categories Section */
.categories-section {
  padding: 80px 24px; /* Fallback values */
  background: #f9fafb;
}



.section-header {
  text-align: center;
  margin-bottom: var(--space-16);
}

.section-title {
  font-size: var(--font-size-4xl);
  font-weight: 800;
  font-family: var(--font-family-display);
  color: var(--color-gray-900);
  margin: 0 0 var(--space-4) 0;
}

.section-subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-gray-600);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.categories-grid {
  display: grid !important;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)) !important;
  gap: 24px !important;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 0;
}

.category-card-modern {
  padding: 24px; /* Fallback for var(--space-6) */
  background: #ffffff; /* Fallback for var(--color-surface) */
  border-radius: 16px; /* Fallback for var(--border-radius-xl) */
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); /* Fallback for var(--transition-base) */
  position: relative;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid #e5e7eb; /* Fallback for var(--color-gray-200) */
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06); /* Fallback for var(--shadow-sm) */
  min-height: 200px;
  display: flex;
  flex-direction: column;
}

.category-card-modern::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--color-primary-500) 0%, var(--color-accent-purple) 100%);
  transform: scaleX(0);
  transition: transform var(--transition-base);
}

.category-card-modern:hover::before {
  transform: scaleX(1);
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-6);
}

.category-icon {
  width: 60px;
  height: 60px;
  border-radius: var(--border-radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.category-icon .q-icon {
  font-size: 1.75rem;
}

.category-trend {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  background: var(--color-accent-orange);
  color: white;
  padding: var(--space-1) var(--space-2);
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-xs);
  font-weight: 600;
}

.category-content {
  margin-bottom: var(--space-6);
}

.category-title {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--color-gray-800);
  margin: 0 0 var(--space-2) 0;
}

.category-count {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--color-primary-600);
  margin-bottom: var(--space-2);
}

.category-description {
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
  line-height: 1.5;
  margin: 0;
}

.category-footer {
  display: flex;
  justify-content: flex-end;
}

.explore-btn {
  color: var(--color-primary-600);
  transition: all var(--transition-base);
}

.explore-btn:hover {
  transform: translateX(4px);
}

/* How It Works Section */
.how-it-works-section {
  padding: var(--space-20) var(--space-6);
  background: var(--color-surface);
}

.how-it-works-container {
  max-width: 1200px;
  margin: 0 auto;
}

.steps-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--space-8);
  margin-bottom: var(--space-16);
  flex-wrap: wrap;
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

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.feature-icon {
  width: 60px;
  height: 60px;
  border-radius: var(--border-radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--space-4) auto;
  color: white;
}

.feature-icon .q-icon {
  font-size: 1.75rem;
}

.feature-title {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--color-gray-800);
  margin: 0 0 var(--space-2) 0;
}

.feature-description {
  font-size: var(--font-size-base);
  color: var(--color-gray-600);
  line-height: 1.5;
  margin: 0;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .categories-grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)) !important;
  }
}

@media (max-width: 768px) {
  .hero-content {
    padding: 64px 0; /* var(--space-16) fallback */
  }
  
  .search-box-modern {
    flex-direction: column;
    gap: 12px; /* var(--space-3) fallback */
  }
  
  .search-btn {
    width: 100%;
  }
  
  .hero-stats {
    flex-direction: column;
    gap: 24px; /* var(--space-6) fallback */
    padding: 24px; /* var(--space-6) fallback */
  }
  
  .stat-divider {
    width: 40px;
    height: 1px;
  }
  
  .categories-grid {
    grid-template-columns: 1fr !important;
    gap: 16px !important;
  }
  
  .steps-container {
    flex-direction: column;
    gap: 48px; /* var(--space-12) fallback */
  }
  
  .step-connector {
    display: none;
  }
  
  .prompt-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .section-title {
    font-size: var(--font-size-3xl);
  }
  
  .category-card-modern,
  .feature-card {
    padding: var(--space-6);
  }
}

/* Animation Classes */
.animate-fade-in {
  animation: fadeIn 0.8s ease-out;
}

.animate-slide-up {
  animation: slideUp 0.8s ease-out;
}

.animate-bounce-in {
  animation: bounceIn 1s ease-out;
}

@keyframes fadeIn {
  from { 
    opacity: 0; 
    transform: translateY(20px);
  }
  to { 
    opacity: 1; 
    transform: translateY(0);
  }
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(40px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounceIn {
  from { 
    opacity: 0;
    transform: scale(0.8);
  }
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


.how-it-works-section {
  padding: var(--space-20) var(--space-6);
  background: var(--color-surface);
  position: relative;
  overflow: hidden;
}

.how-it-works-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    45deg,
    rgba(204, 220, 255, 0.1) 0,
    rgba(204, 220, 255, 0.1) 10px,
    transparent 10px,
    transparent 20px
  );
  opacity: 0.5;
  z-index: 0;
}

.section-header {
  text-align: center;
  margin-bottom: var(--space-16);
  position: relative;
  z-index: 1;
}

.section-title {
  font-size: var(--font-size-4xl);
  font-weight: 800;
  font-family: var(--font-family-display);
  color: var(--color-gray-900);
  margin: 0 0 var(--space-4) 0;
}

.section-subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-gray-600);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.steps-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: var(--space-8);
  margin-bottom: var(--space-16);
  flex-wrap: wrap;
  position: relative;
  z-index: 1;
}

.step-modern {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: var(--border-radius-xl);
  padding: var(--space-6);
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  flex: 1 1 300px;
  max-width: 320px;
  position: relative;
  overflow: hidden;
}

.step-modern::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  transform: rotate(45deg);
  opacity: 0;
  transition: opacity 0.5s ease;
}

.step-modern:hover::before {
  opacity: 1;
}

.step-modern:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 25px rgba(21, 101, 192, 0.2);
}

.step-visual {
  position: relative;
  margin-bottom: var(--space-4);
}

.step-icon-modern {
  width: 60px;
  height: 60px;
  border-radius: var(--border-radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--space-2) auto;
  color: white;
  transition: transform 0.3s ease;
}

.step-icon-modern .q-icon {
  font-size: 1.75rem;
}

.step-number-modern {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 30px;
  background: var(--color-primary-500);
  border: 2px solid white;
  border-radius: var(--border-radius-full);
  color: white;
  font-size: var(--font-size-sm);
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.step-content {
  padding: 0 var(--space-2);
}

.step-title {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--color-gray-800);
  margin: 0 0 var(--space-2) 0;
}

.step-description {
  font-size: var(--font-size-base);
  color: var(--color-gray-600);
  line-height: 1.5;
  margin: 0;
}

.step-connector {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 100%;
  color: var(--color-primary-500);
  font-size: var(--font-size-lg);
  margin-left: var(--space-4);
}

/* Features Grid */
.features-grid {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: var(--space-8);
  margin-top: var(--space-12);
  flex-wrap: wrap;
}

.feature-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--border-radius-xl);
  padding: var(--space-6);
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  flex: 1 1 280px;
  max-width: 300px;
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  transform: rotate(45deg);
  opacity: 0;
  transition: opacity 0.5s ease;
}

.feature-card:hover::before {
  opacity: 1;
}

.feature-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 8px 25px rgba(21, 101, 192, 0.2);
}

.feature-icon {
  width: 60px;
  height: 60px;
  border-radius: var(--border-radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--space-4) auto;
  color: white;
  transition: transform 0.3s ease;
}

.feature-icon .q-icon {
  font-size: 1.75rem;
}

.feature-title {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--color-gray-800);
  margin: 0 0 var(--space-2) 0;
}

.feature-description {
  font-size: var(--font-size-base);
  color: var(--color-gray-600);
  line-height: 1.5;
  margin: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .steps-container {
    flex-direction: column;
    gap: var(--space-12);
  }

  .step-connector {
    display: none;
  }

  .features-grid {
    flex-direction: column;
    gap: var(--space-6);
  }
}

/* Animation Classes */
.animate-fade-in {
  animation: fadeIn 0.8s ease-out;
}

.animate-slide-up {
  animation: slideUp 0.8s ease-out;
}

.animate-bounce-in {
  animation: bounceIn 1s ease-out;
}

@keyframes fadeIn {
  from { 
    opacity: 0; 
    transform: translateY(20px);
  }
  to { 
    opacity: 1; 
    transform: translateY(0);
  }
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(40px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounceIn {
  from { 
    opacity: 0;
    transform: scale(0.8);
  }
  to { 
    opacity: 1;
    transform: scale(1);
  }
}
</style>
