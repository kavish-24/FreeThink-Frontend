<template>
  <div class="header-container">
    <div class="top-margin-blur" :class="{ 'active-blur': isScrolled }"></div>

    <header class="navbar" :class="{ 'starry-background': showWelcomeMessage }">
      <div v-if="showWelcomeMessage" class="welcome-message">
        Welcome to JobHub! 👋
      </div>

      <div v-if="!showWelcomeMessage" class="navbar-content">
        <div class="logo">💼 JobHub</div>
        <nav class="nav-links">
          <router-link to="/" exact-active-class="active-link"
            >Home</router-link
          >

          <div class="nav-dropdown-wrapper">
            <JobsDropDown />
          </div>

          <router-link to="/employers" exact-active-class="active-link"
            >Employers</router-link
          >
        </nav>

        <div class="auth-buttons">
          <template v-if="!user && !isEmployerPage">
            <router-link to="/login" class="sign-in">Sign In</router-link>
            <router-link to="/create-account" class="sign-up"
              >Sign Up</router-link
            >
          </template>

          <template v-if="user">
            <div class="user-dropdown" @click="toggleDropdown">
              <div class="user-profile">
                <q-icon name="account_circle" class="q-mr-sm" size="2.2rem" />
                {{ user.name || user.email }}
                <q-icon name="arrow_drop_down" size="1.8rem" />
              </div>

              <div v-if="showDropdown" class="dropdown-menu">
                <div
                  v-if="user.role === 'job_seeker'"
                  class="dropdown-item"
                  @click="$router.push('/dashboard')"
                >
                  Job Seeker Dashboard
                </div>
                <div
                  v-if="user.role === 'company'"
                  class="dropdown-item"
                  @click="$router.push('/employer-portal')"
                >
                  Employer Dashboard
                </div>
                <q-separator class="q-my-xs" />
                <div class="dropdown-item logout-item" @click="logout">
                  Logout
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </header>
  </div>
</template>

<script>
import { useAuthStore } from 'src/stores/auth.store';
import JobsDropDown from './JobsDropDown.vue';

export default {
  name: 'AppNavbar',
  components: { JobsDropDown },
  data() {
    return {
      showDropdown: false,
      initialized: false,
      showWelcomeMessage: false,
      isScrolled: false,
    };
  },
  async mounted() {
    if (!sessionStorage.getItem('hasVisited')) {
      this.showWelcomeMessage = true;
      sessionStorage.setItem('hasVisited', 'true');
      setTimeout(() => {
        this.showWelcomeMessage = false;
      }, 2500); // Increased time to enjoy the stars
    }
    window.addEventListener('scroll', this.handleScroll);
    await this.authStore.checkAuth();
    this.initialized = true;
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll() {
      this.isScrolled = window.scrollY > 10;
    },
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
    logout() {
      this.authStore.logout();
      this.showDropdown = false;
      this.$router.push('/');
    },
  },
  setup() {
    const authStore = useAuthStore();
    return { authStore };
  },
  computed: {
    user() {
      return this.authStore.userData;
    },
    isEmployerPage() {
      const employerPaths = [
        '/employer-portal',
        '/posted-jobs',
        '/post-job',
        '/candidates',
        '/employer-messages',
        '/company-profile',
        '/employer-settings',
      ];
      return employerPaths.includes(this.$route.path);
    },
  },
  watch: {
    $route: {
      handler() {
        this.authStore.checkAuth();
      },
      immediate: true,
    },
  },
};
</script>

<style scoped>
/* --- FONT IMPORT --- */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

.header-container {
  height: 100px;
}

.top-margin-blur {
  position: fixed;
  top: 0;
  left: 20px;
  right: 20px;
  height: 20px;
  z-index: 1099;
  background-color: transparent;
  backdrop-filter: blur(0px);
  -webkit-backdrop-filter: blur(0px);
  transition: background-color 0.4s ease, backdrop-filter 0.4s ease;
}

.top-margin-blur.active-blur {
  background-color: rgba(210, 253, 250, 0.75);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

@keyframes breathingBackground {
  0% {
    background-color: #d8ddff;
  }
  33% {
    background-color: #bddbff;
  }
  66% {
    background-color: #bebef9;
  }
  100% {
    background-color: #afe6fa;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.navbar {
  display: flex;
  padding: 0 25px;
  align-items: center;
  /* --- TYPOGRAPHY: Updated base font --- */
  font-family: 'Poppins', sans-serif;
  animation: breathingBackground 15s ease-in-out infinite;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 20px;
  left: 20px;
  right: 20px;
  z-index: 1100;
  min-height: 50px;
  overflow: visible;
  transition: background 1.5s ease-in-out;
}

/* === STARRY BACKGROUND STYLES === */
@keyframes twinkle {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    opacity: 0;
  }
}

.starry-background {
  background: linear-gradient(to bottom, #c6fcff, #a0bbfd, #a48ff7);
  animation: none; /* Disable breathing animation */
}

.starry-background::before,
.starry-background::after {
  content: ' ';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.starry-background::before {
  box-shadow: 5% 22% 1px #fff, 15% 80% 1px #fff, 25% 30% 1px #fff,
    40% 90% 1px #fff, 55% 20% 1px #fff, 68% 75% 1px #fff, 80% 10% 1px #fff,
    95% 50% 1px #fff, 8% 55% 1px #fff;
  animation: twinkle 5s infinite;
}

.starry-background::after {
  box-shadow: 20% 5% 2px #fff, 35% 45% 2px #fff, 50% 95% 2px #fff,
    70% 35% 2px #fff, 85% 85% 2px #fff, 90% 25% 2px #fff;
  animation: twinkle 7s infinite;
}
/* === END OF STARRY BACKGROUND STYLES === */

.navbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  animation: fadeInUp 0.7s ease-out forwards;
}

.welcome-message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: transparent;
  color: #6a00ff;
  text-shadow: 0 2px 8px rgba(255, 255, 255, 0.7);
  padding: 10px 25px;
  font-size: 24px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-weight: 600;
  z-index: 1000;
  white-space: nowrap;
  box-shadow: none;
  animation: fadeInDown 0.5s ease-out;
}

@keyframes fadeInDown {
  0% {
    opacity: 0;
    transform: translate(-50%, -70%);
  }
  100% {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
}

.logo {
  font-weight: 700;
  color: #1565c0;
  font-size: 40px;
  font-family: Gabriola;
  font-style: bold;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

/* --- LOGO HOVER: Improved effect --- */
.logo:hover {
  transform: scale(1.05) rotate(-2deg);
  color: #1e88e5;
  text-shadow: 0 4px 20px rgba(21, 101, 192, 0.4);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: Georgia;
  font-size:20px;
}

/* --- NAV LINKS: Improved typography and new hover effect --- */
.nav-links a {
  position: relative;
  margin: 0 12px;
  color: #333;
  font-weight: 500;
  text-decoration: none;
  font-size: 16px;
  padding: 5px 0;
  transition: color 0.3s ease;
}

.nav-links a::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #1565c0;
  transform: scaleX(0);
  transform-origin: center;
  transition: transform 0.4s cubic-bezier(0.19, 1, 0.22, 1);
}

.nav-links a:hover {
  color: #1565c0;
}

.nav-links a:hover::after {
  transform: scaleX(1);
}

.nav-dropdown-wrapper {
  padding: 10px;
  transition: transform 0.3s ease-out, box-shadow 0.3s ease-out;
  border-radius: 8px;
}

.nav-dropdown-wrapper:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(21, 101, 192, 0.15);
}

/* --- BUTTONS: Redesigned for modern look --- */
.auth-buttons {
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: Georgia;
  font-size:20px;
}

.auth-buttons .sign-in {
  font-weight: 600;
  font-size: 15px;
  color: #1565c0;
  text-decoration: none;
  padding: 7px 18px;
  border: 2px solid #1565c0;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.auth-buttons .sign-in:hover {
  background-color: #e3f2fd;
  color: #1c4fcf;
}

.auth-buttons .sign-up {
  background-image: linear-gradient(45deg, #1565c0 0%, #1e88e5 100%);
  color: white;
  font-size: 15px;
  padding: 9px 20px;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  border: none;
  box-shadow: 0 4px 15px rgba(21, 101, 192, 0.3);
  transition: all 0.3s ease;
}

.auth-buttons .sign-up:hover {
  transform: translateY(-2px);
  box-shadow: 0 7px 20px rgba(21, 101, 192, 0.4);
}

/* --- Active Link Style --- */
.nav-links .active-link {
  position: relative;
  color: #1565c0;
  font-weight: 700;
  font-family: Georgia;
  font-size:20px;
}
.nav-links .active-link::after {
  transform: scaleX(1);
}

.user-profile {
  cursor: pointer;
  font-weight: 600;
  color: #1565c0;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
  gap: 10px;
  font-size: 15px;
  padding: 6px 12px;
  border-radius: 8px;
}
.user-profile:hover {
  color: #1c4fcf;
  background-color: #f5f7fa;
}

.user-dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  /* --- TYPOGRAPHY: Updated font --- */
  font-family: 'Poppins', sans-serif;
  margin-top: 12px;
  background-color: rgb(255, 255, 255);
  border: 1px solid #eaecef;
  border-radius: 10px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  min-width: 200px;
  overflow: hidden;
  z-index: 1102;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(-5px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-item {
  padding: 12px 18px;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  font-weight: 500;
  text-decoration: none;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.dropdown-item:hover {
  background-color: #f5f7fa;
  color: #1565c0;
}

.logout-item {
  color: #d32f2f !important;
}

.logout-item:hover {
  background-color: #fdecea;
  color: #b71c1c !important;
}

@keyframes slideDownFade {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

:deep(.jobs-dropdown-menu) {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 15px;
  background: linear-gradient(135deg, #fdfdca 0%, #e9ffe5 100%);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
  min-width: 220px;
  z-index: 1101;
  padding: 8px;
  animation: slideDownFade 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}
</style>