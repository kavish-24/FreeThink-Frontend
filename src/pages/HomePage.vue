<!-- Modern Unstop-Inspired HomePage -->
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

    <section v-else class="login-prompt-section">
      <div class="container-unstop">
        <div class="login-prompt-card">
          <div class="prompt-icon">
            <q-icon name="lock_open" />
          </div>
          <h3 class="prompt-title">Unlock Personalized Job Recommendations</h3>
          <p class="prompt-text">
            Sign in to get job suggestions tailored to your skills, experience, and preferences.
          </p>
          <div class="prompt-actions">
            <q-btn 
              class="btn-unstop btn-primary"
              label="Sign In"
              @click="$router.push('/login')"
              no-caps
            />
            <q-btn 
              class="btn-unstop btn-outline"
              label="Create Account"
              @click="$router.push('/create-account')"
              no-caps
            />
          </div>
        </div>
      </div>
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
import { ref, onMounted, computed } from 'vue'; // Added computed here
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

    // DECLARED REFS for template elements to enable animation
    const heroStats = ref(null);
    const statJobs = ref(null);
    const statCompanies = ref(null);
    const statSeekers = ref(null);

    // Data for the new design
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
      router.push(`/jobs/${category}`);
    }

    function performSearch() {
      const query = searchInput.value.trim();
      const location = locationInput.value.trim();
      
      if (query || location) {
        // Navigate to jobs page with search parameters
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

.step-modern {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 300px;
  position: relative;
}

.step-visual {
  position: relative;
  margin-bottom: var(--space-6);
}

.step-icon-modern {
  width: 80px;
  height: 80px;
  border-radius: var(--border-radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: var(--space-3);
}

.step-icon-modern .q-icon {
  font-size: 2rem;
}

.step-number-modern {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 32px;
  height: 32px;
  background: var(--color-accent-orange);
  color: white;
  border-radius: var(--border-radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: var(--font-size-sm);
  box-shadow: var(--shadow-md);
}

.step-content {
  flex: 1;
}

.step-title {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--color-gray-800);
  margin: 0 0 var(--space-3) 0;
}

.step-description {
  font-size: var(--font-size-base);
  color: var(--color-gray-600);
  line-height: 1.6;
  margin: 0;
}

.step-connector {
  position: absolute;
  top: 40px;
  right: -60px;
  color: var(--color-gray-400);
  font-size: 1.5rem;
}

/* Features Grid */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-8);
}

.feature-card {
  text-align: center;
  padding: var(--space-8);
  background: var(--color-surface);
  border-radius: var(--border-radius-xl);
  transition: all var(--transition-base);
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
}</style>
