<template>
  <div class="privacy-policy-page">
      <header class="navbar">
      <div class="logo">💼 JobHub</div>
      <nav class="nav-links">
        <router-link to="/" exact-active-class="active-link">Home</router-link>
        <router-link to="/employers" exact-active-class="active-link">Employers</router-link>
      </nav>
    </header>
    <section class="policy-hero">
      <div class="hero-content">
        <h1>Privacy Policy</h1>
        <p class="subtitle">Your trust is important to us. Here’s how we protect your data.</p>
        <p class="last-updated">Last Updated: August 12, 2025</p>
      </div>
    </section>

    <div class="policy-container glass-section">
      <div class="disclaimer-box">
        <p><strong>Please Note:</strong> Our Privacy Policy is compliant with all applicable laws, including the Digital Personal Data Protection Act (DPDPA) in India.</p>
      </div>

      <div class="policy-content">
        <div v-if="isLoading" class="text-center q-pa-xl">
          <q-spinner-dots color="primary" size="40px" />
          <p class="q-mt-md text-grey-7">Loading latest policy...</p>
        </div>
        <div v-else-if="error" class="text-center text-negative q-pa-xl">
          <q-icon name="warning" size="40px" />
          <p class="q-mt-md">{{ error }}</p>
        </div>
        <div v-else v-html="policyHtml"></div>
      </div>
    </div>
    <AppFooter />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { marked } from 'marked';
import AppFooter from '../components/FooterPart.vue'; // Adjust path if needed

const policyHtml = ref('');
const isLoading = ref(true);
const error = ref(null);

// This function runs automatically when the page loads
onMounted(() => {
  fetchPolicyContent();
});

const fetchPolicyContent = async () => {
  try {
    // 1. Fetch the raw markdown content from the public folder
    const response = await axios.get('/content/privacy-policy.md');
    const markdownText = response.data;

    // 2. Convert the markdown text into an HTML string
    policyHtml.value = marked.parse(markdownText);

  } catch (err) {
    console.error("Failed to fetch privacy policy:", err);
    error.value = "Could not load the privacy policy at this time. Please try again later.";
  } finally {
    isLoading.value = false;
  }
};
</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

/* Basic Page & Background Setup */
.privacy-policy-page {
  font-family: 'Inter', sans-serif;
  color: #2a2a2a;
  background: linear-gradient(-45deg, #f0f8ff, #f3eaff, #e0f0ff, #d1e3ff);
  background-size: 400% 400%;
  animation: animatedGradient 20s ease infinite;
  padding-bottom: 60px;
}
@keyframes animatedGradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}


.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 60px;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.logo{font-weight:700;color:#2d6cff;font-size:24px}.nav-links a{margin:0 20px;color:#333;font-weight:500;text-decoration:none;transition:color .2s}.nav-links a:hover,.nav-links .active-link{color:#2d6cff}



/* Hero Section */
.policy-hero {
  padding: 80px 40px 40px;
  text-align: center;
}
.policy-hero h1 {
  font-size: 52px;
  font-weight: 700;
  margin-bottom: 10px;
}
.policy-hero .subtitle {
  font-size: 18px;
  color: #333;
}
.last-updated {
  margin-top: 20px;
  color: #666;
  font-size: 14px;
}

/* Glass Section Container */
.policy-container {
  margin: 0 60px 40px;
  border-radius: 24px;
  padding: 40px 50px;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.1);
}

/* Disclaimer Box */
.disclaimer-box {
  background-color: rgba(255, 235, 238, 0.8);
  border-left: 5px solid #f56565;
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.disclaimer-box p {
  margin: 0;
  color: #c53030;
}
.disclaimer-box strong {
  color: #9b2c2c;
}

/* Policy Content Styling */
.policy-content {
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.8;
}

/* MODIFIED: Styling for the v-html rendered content */
.policy-content :deep(h2) {
  font-size: 24px;
  font-weight: 600;
  margin-top: 40px;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(0,0,0,0.1);
}
.policy-content :deep(h2:first-of-type) {
  margin-top: 0;
}
.policy-content :deep(h3) {
  font-size: 18px;
  font-weight: 600;
  margin-top: 25px;
  margin-bottom: 10px;
  color: #333;
}
.policy-content :deep(p) {
  margin-bottom: 15px;
}
.policy-content :deep(ul) {
  padding-left: 25px;
  margin-bottom: 15px;
}
.policy-content :deep(li) {
  margin-bottom: 10px;
}
.policy-content :deep(a) {
  color: #2d6cff;
  font-weight: 500;
  text-decoration: none;
  transition: text-decoration 0.2s;
}
.policy-content :deep(a:hover) {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .policy-container {
    margin: 0 20px 20px;
    padding: 30px 25px;
  }
  .policy-hero {
    padding: 60px 20px 30px;
  }
}
</style>