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
  opacity: 1 !important;
  animation: none !important;
  transform: none !important;
  display: inline !important;
  z-index: 10 !important;
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

/* Categories Section */
.categories-section {
  padding: 80px 24px;
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
  padding: 24px;
  background: #ffffff;
  border-radius: 16px;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
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
  padding: var(--space-4); /* Reduced padding for smaller size */
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  flex: 1 1 240px; /* Reduced base width */
  max-width: 260px; /* Smaller max-width compared to step-modern (320px) */
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
  width: 48px; /* Smaller icon size */
  height: 48px;
  border-radius: var(--border-radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--space-3) auto; /* Adjusted margin */
  color: white;
  transition: transform 0.3s ease;
}

.feature-icon .q-icon {
  font-size: 1.5rem; /* Smaller icon font size */
}

.feature-title {
  font-size: var(--font-size-md); /* Smaller font size */
  font-weight: 700;
  color: var(--color-gray-800);
  margin: 0 0 var(--space-2) 0;
}

.feature-description {
  font-size: var(--font-size-sm); /* Smaller font size */
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
    padding: 64px 0;
  }
  
  .search-box-modern {
    flex-direction: column;
    gap: 12px;
  }
  
  .search-btn {
    width: 100%;
  }
  
  .hero-stats {
    flex-direction: column;
    gap: 24px;
    padding: 24px;
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
    gap: 48px;
  }
  
  .step-connector {
    display: none;
  }
  
  .features-grid {
    flex-direction: column;
    gap: var(--space-6);
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .section-title {
    font-size: var(--font-size-3xl);
  }
  
  .category-card-modern {
    padding: var(--space-6);
  }
  
  .step-modern {
    padding: var(--space-6);
  }
  
  .feature-card {
    padding: var(--space-3); /* Further reduced padding for smaller screens */
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