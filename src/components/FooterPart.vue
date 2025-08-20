<template>
  <div class="footer-container">
    <footer class="footer">
      <div class="footer-wave">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path
            d="M0,100 L0,70 C 300,50 800,90 1440,60 L1440,100 Z"
            style="fill: #1e3a8a;"
          ></path>
          <path
            d="M0,100 L0,50 C 400,20 900,80 1440,50 L1440,100 Z"
            style="fill: #2563eb;"
          ></path>
        </svg>
      </div>

      <div class="footer-top">
        <div class="footer-brand">
          <div class="footer-logo">💼 <strong>JobHub</strong></div>
          <p>Connecting talented professionals with amazing opportunities worldwide.</p>
          <div class="social-icons">
            <a href="#" aria-label="Facebook" class="facebook"><i class="fab fa-facebook-f"></i></a>
            <a href="#" aria-label="Twitter" class="twitter"><i class="fab fa-twitter"></i></a>
            <a href="#" aria-label="LinkedIn" class="linkedin"><i class="fab fa-linkedin-in"></i></a>
            <a href="#" aria-label="Instagram" class="instagram"><i class="fab fa-instagram"></i></a>
          </div>
        </div>

        <div class="footer-links">
          <div>
            <h4>For Job Seekers</h4>
            <router-link to="/jobs/all">Browse Jobs</router-link>
            <a href="#">Career Advice</a>
            <router-link to="/resume-builder">Resume Builder</router-link>
            <a href="#">Salary Guide</a>
          </div>
          <div>
            <h4>For Employers</h4>
            <router-link to="/post-job">Post a Job</router-link>
            <router-link to="/candidates">Find Candidates</router-link>
            <router-link to="/employers#branding-section">Employer Branding</router-link>
            <router-link to="/employers#pricing-section">Pricing</router-link>
          </div>
          <div>
            <h4>Company</h4>
            <router-link to="/about">About Us</router-link>
            <router-link to="/contact">Contact</router-link>
            <router-link to="/privacy-policy">Privacy Policy</router-link>
            <router-link to="/terms-and-conditions">Terms of Service</router-link>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p>© {{ new Date().getFullYear() }} JobHub. All rights reserved.</p>
      </div>
    </footer>

    <transition name="fade">
      <button v-if="isBackToTopVisible" @click="scrollToTop" class="back-to-top" aria-label="Back to top">
        <i class="fas fa-arrow-up"></i>
      </button>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'AppFooter',
  data() {
    return {
      isBackToTopVisible: false,
    };
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll() {
      if (window.scrollY > 300) {
        this.isBackToTopVisible = true;
      } else {
        this.isBackToTopVisible = false;
      }
    },
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    },
  },
};
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');

.footer-container {
  position: relative;
  /* --- FIX: Force space above the footer to prevent overlap --- */
  /* This value may need to be adjusted depending on your content. */
  margin-top: 10rem; 
  width: 100%;
  clear: both; /* Helps with floated content from the page */
}

.footer-wave {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  transform: translateY(-100%);
  pointer-events: none;
}

.footer-wave svg {
  display: block;
  width: 100%;
  height: 100px;
}

.footer {
  position: relative;
  background: linear-gradient(135deg, #2563eb, #1e3a8a);
  color: white;
  padding: 70px 50px 30px;
}

.footer-top {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 50px;
  padding-bottom: 40px;
  max-width: 1200px;
  margin: 0 auto;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
}

.footer-brand {
  max-width: 350px;
}

.footer-logo {
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.footer-brand p {
  font-size: 15px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 24px;
}

.social-icons {
  display: flex;
  gap: 16px;
}

.social-icons a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  color: white;
  font-size: 16px;
  text-decoration: none;
  transition: all 0.3s ease;
  backdrop-filter: blur(8px);
}

.social-icons a:hover {
  transform: translateY(-4px) scale(1.1);
  color: white;
}

.social-icons .facebook:hover { background-color: #1877F2; }
.social-icons .twitter:hover { background-color: #1DA1F2; }
.social-icons .linkedin:hover { background-color: #0A66C2; }
.social-icons .instagram:hover { background: radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%,#d6249f 60%,#285AEB 90%); }

.footer-links {
  display: flex;
  gap: 60px;
  flex-wrap: wrap;
}

.footer-links > div {
  min-width: 160px;
}

.footer-links h4 {
  margin-bottom: 16px;
  font-size: 18px;
  font-weight: 600;
  color: white;
  position: relative;
  padding-bottom: 8px;
}

.footer-links h4::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 30px;
  height: 2px;
  background: #3b82f6;
}

.footer-links a {
  display: block;
  margin-bottom: 10px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 15px;
  text-decoration: none;
  transition: all 0.3s ease;
  padding: 4px 0;
}

.footer-links a:hover {
  color: white;
  transform: translateX(8px);
}

.footer-bottom {
  text-align: center;
  font-size: 13px;
  padding-top: 30px;
  color: rgba(255, 255, 255, 0.7);
  max-width: 1200px;
  margin: 0 auto;
}

.back-to-top {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 5px 15px rgba(59, 130, 246, 0.4);
  z-index: 1000;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.back-to-top:hover {
  background: #2563eb;
  transform: translateY(-5px);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

@media (max-width: 768px) {
  .footer {
    padding: 60px 20px 20px;
  }
  .footer-top {
    flex-direction: column;
    gap: 40px;
  }
  .footer-links {
    gap: 40px;
  }
}
</style>