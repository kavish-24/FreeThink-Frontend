<template>
  <header class="modern-navbar glass-effect">
    <div class="navbar-container">
      <!-- Logo Section -->
      <div class="logo-section">
        <router-link to="/" class="logo-link">
          <div class="logo">
            <q-icon name="work" class="logo-icon" />
            <span class="logo-text">JobHub</span>
          </div>
        </router-link>
      </div>

      <!-- Centered Desktop Navigation -->
      <nav class="desktop-nav-center hide-mobile">
        <router-link to="/" class="nav-link" exact-active-class="nav-link-active">
          <q-icon name="home" class="nav-icon" />
          <span>Home</span>
        </router-link>
        <JobsDropDown v-if="!user || user.role !== 'job_seeker'" />
        <router-link 
          v-if="!user || user.role !== 'job_seeker'"
          to="/employers" 
          class="nav-link" 
          exact-active-class="nav-link-active"
        >
          <q-icon name="business" class="nav-icon" />
          <span>Employers</span>
        </router-link>
      </nav>

      <!-- Mobile Menu Button -->
      <q-btn
        flat
        dense
        round
        icon="menu"
        class="mobile-menu-btn hide-desktop"
        @click="toggleMobileMenu"
      />

      <!-- User Actions -->
      <div class="user-actions">
        <template v-if="!user && !isEmployerPage">
          <q-btn 
            class="btn-unstop btn-ghost"
            label="Sign In"
            @click="$router.push('/login')"
            no-caps
          />
          <q-btn 
            class="btn-unstop btn-primary"
            label="Sign Up"
            @click="$router.push('/create-account')"
            no-caps
          />
        </template>

        <template v-if="user">
          <!-- Notifications -->
          <q-btn
            flat
            round
            icon="notifications_none"
            class="notification-btn"
            @click="$router.push(notificationRoute)"
          >
            <q-badge color="red" floating>3</q-badge>
            <q-tooltip>Notifications</q-tooltip>
          </q-btn>

          <!-- User Menu -->
          <q-btn-dropdown
            flat
            class="user-menu-btn"
            dropdown-icon="none"
          >
            <template v-slot:label>
              <div class="user-avatar">
                <q-avatar size="32px" class="avatar">
                  <q-icon name="person" />
                </q-avatar>
                <div class="user-info hide-mobile">
                  <div class="user-name">{{ user.name || user.email }}</div>
                  <div class="user-role">{{ getUserRoleLabel() }}</div>
                </div>
                <q-icon name="keyboard_arrow_down" class="dropdown-icon" />
              </div>
            </template>

            <q-list class="user-dropdown">
              <q-item 
                v-if="user.role === 'job_seeker' || user.type === 'seeker'" 
                clickable 
                v-close-popup 
                @click="$router.push('/dashboard')"
              >
                <q-item-section avatar>
                  <q-icon name="dashboard" />
                </q-item-section>
                <q-item-section>Dashboard</q-item-section>
              </q-item>

              <q-item 
                v-if="user.role === 'job_seeker' || user.type === 'seeker'" 
                clickable 
                v-close-popup 
                @click="$router.push('/resume-builder')"
              >
                <q-item-section avatar>
                  <q-icon name="description" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Resume Builder</q-item-label>
                  <q-item-label caption class="smart-caption">AI Powered</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-badge color="primary" label="AI" />
                </q-item-section>
              </q-item>
              
              <q-item 
                v-if="user.role === 'company' || user.type === 'employer'" 
                clickable 
                v-close-popup 
                @click="$router.push('/employer-portal')"
              >
                <q-item-section avatar>
                  <q-icon name="business_center" />
                </q-item-section>
                <q-item-section>Employer Portal</q-item-section>
              </q-item>

              <q-item clickable v-close-popup @click="$router.push(profileRoute)">
                <q-item-section avatar>
                  <q-icon name="person" />
                </q-item-section>
                <q-item-section>Profile</q-item-section>
              </q-item>

              <q-item clickable v-close-popup @click="$router.push(settingsRoute)">
                <q-item-section avatar>
                  <q-icon name="settings" />
                </q-item-section>
                <q-item-section>Settings</q-item-section>
              </q-item>

              <q-separator />

              <q-item clickable v-close-popup @click="logout">
                <q-item-section avatar>
                  <q-icon name="logout" color="negative" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-negative">Sign Out</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </template>
      </div>
    </div>

    <!-- Mobile Drawer -->
    <q-drawer
      v-model="mobileMenuOpen"
      side="left"
      overlay
      behavior="mobile"
      class="mobile-drawer"
    >
      <div class="drawer-content">
        <div class="drawer-header">
          <div class="logo">
            <q-icon name="work" class="logo-icon" />
            <span class="logo-text">JobHub</span>
          </div>
          <q-btn
            flat
            round
            icon="close"
            @click="mobileMenuOpen = false"
          />
        </div>

        <q-list class="mobile-nav">
          <q-item 
            clickable
            v-ripple
            @click="navigateAndClose('/')"
            :class="{ 'mobile-nav-active': $route.path === '/' }"
          >
            <q-item-section avatar>
              <q-icon name="home" />
            </q-item-section>
            <q-item-section>Home</q-item-section>
          </q-item>

          <q-item 
            v-if="!user || user.role !== 'job_seeker'"
            clickable
            v-ripple
            @click="navigateAndClose('/jobs')"
          >
            <q-item-section avatar>
              <q-icon name="work" />
            </q-item-section>
            <q-item-section>Jobs</q-item-section>
          </q-item>

          <q-item 
            v-if="!user || user.role !== 'job_seeker'"
            clickable
            v-ripple
            @click="navigateAndClose('/employers')"
            :class="{ 'mobile-nav-active': $route.path === '/employers' }"
          >
            <q-item-section avatar>
              <q-icon name="business" />
            </q-item-section>
            <q-item-section>Employers</q-item-section>
          </q-item>

          <q-item 
            v-if="user"
            clickable
            v-ripple
            @click="navigateAndClose(profileRoute)"
            :class="{ 'mobile-nav-active': $route.path === profileRoute }"
          >
            <q-item-section avatar>
              <q-icon name="person" />
            </q-item-section>
            <q-item-section>Profile</q-item-section>
          </q-item>

          <q-item 
            v-if="user"
            clickable
            v-ripple
            @click="navigateAndClose(settingsRoute)"
            :class="{ 'mobile-nav-active': $route.path === settingsRoute }"
          >
            <q-item-section avatar>
              <q-icon name="settings" />
            </q-item-section>
            <q-item-section>Settings</q-item-section>
          </q-item>

          <q-item 
            v-if="user"
            clickable
            v-ripple
            @click="navigateAndClose(notificationRoute)"
            :class="{ 'mobile-nav-active': $route.path === notificationRoute }"
          >
            <q-item-section avatar>
              <q-icon name="notifications_none" />
            </q-item-section>
            <q-item-section>Notifications</q-item-section>
          </q-item>

          <q-item 
            v-if="user"
            clickable
            v-ripple
            @click="logout"
            :class="{ 'mobile-nav-active': $route.path === '/logout' }"
          >
            <q-item-section avatar>
              <q-icon name="logout" color="negative" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-negative">Sign Out</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>

        <div class="drawer-footer" v-if="!user">
          <q-btn 
            class="btn-unstop btn-outline full-width"
            label="Sign In"
            @click="navigateAndClose('/login')"
            no-caps
          />
          <q-btn 
            class="btn-unstop btn-primary full-width"
            label="Sign Up"
            @click="navigateAndClose('/create-account')"
            no-caps
          />
        </div>
      </div>
    </q-drawer>
  </header>
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
      mobileMenuOpen: false,
    };
  },
  setup() {
    const authStore = useAuthStore();
    return { authStore };
  },
  async mounted() {
    await this.authStore.checkAuth();
    this.initialized = true;
    console.log('AppNavbar mounted, user:', this.user);
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
    notificationRoute() {
      if (this.user && (this.user.role === 'job_seeker' || this.user.type === 'seeker')) {
        return '/notifications';
      } else if (this.user && (this.user.role === 'company' || this.user.type === 'employer')) {
        return '/employer/notifications';
      }
      return '/notifications';
    },
    profileRoute() {
      if (this.user && (this.user.role === 'job_seeker' || this.user.type === 'seeker')) {
        return '/profile';
      } else if (this.user && (this.user.role === 'company' || this.user.type === 'employer')) {
        return '/employer/profile';
      }
      return '/profile';
    },
    settingsRoute() {
      if (this.user && (this.user.role === 'job_seeker' || this.user.type === 'seeker')) {
        return '/settings';
      } else if (this.user && (this.user.role === 'company' || this.user.type === 'employer')) {
        return '/employer/settings';
      }
      return '/settings';
    },
  },
  watch: {
    $route: {
      handler() {
        this.authStore.checkAuth();
        console.log('Route changed, user:', this.user);
      },
      immediate: true,
    },
  },
  methods: {
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen;
    },
    navigateAndClose(path) {
      this.$router.push(path);
      this.mobileMenuOpen = false;
    },
    getUserRoleLabel() {
      if (this.user?.role === 'job_seeker' || this.user?.type === 'seeker') {
        return 'Job Seeker';
      } else if (this.user?.role === 'company' || this.user?.type === 'employer') {
        return 'Employer';
      }
      return 'User';
    },
    logout() {
      this.authStore.logout();
      this.showDropdown = false;
      this.mobileMenuOpen = false;
      this.$router.push('/');
      console.log('Logout triggered, user:', this.user);
    },
  },
};
</script>

<style scoped>
.modern-navbar {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--color-gray-200);
  box-shadow: var(--shadow-sm);
}

.navbar-container {
  display: grid;
  grid-template-columns: minmax(200px, 1fr) auto minmax(200px, 1fr);
  align-items: center;
  padding: 0 var(--space-6);
  height: 80px;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
}

/* Logo Section */
.logo-section {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  grid-column: 1;
  min-width: 200px;
}

.logo-link {
  text-decoration: none;
}

.logo {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  transition: all var(--transition-base);
}

.logo:hover {
  transform: scale(1.05);
}

.logo-icon {
  font-size: 2rem;
  color: var(--color-primary-500);
}

.logo-text {
  font-size: var(--font-size-xl);
  font-weight: 700;
  font-family: var(--font-family-display);
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Desktop Navigation */
.desktop-nav {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

/* Centered Desktop Navigation */
.desktop-nav-center {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  z-index: 10;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--border-radius-lg);
  text-decoration: none;
  color: var(--color-gray-600);
  font-weight: 500;
  transition: all var(--transition-base);
  position: relative;
  white-space: nowrap;
}

.nav-link:hover {
  color: var(--color-primary-600);
  background: var(--color-primary-50);
}

.nav-link-active {
  color: var(--color-primary-600);
  background: var(--color-primary-50);
}

.nav-icon {
  font-size: 1.125rem;
}

/* Mobile Menu Button */
.mobile-menu-btn {
  color: var(--color-gray-600);
  grid-column: 3;
  justify-self: end;
  z-index: 20;
}

/* User Actions */
.user-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-3);
  grid-column: 3;
  min-width: 200px;
}

.notification-btn {
  color: var(--color-gray-600);
  position: relative;
  transition: all var(--transition-base);
}

.notification-btn:hover {
  color: var(--color-primary-600);
  background: var(--color-primary-50);
  border-radius: var(--border-radius-lg);
}

.user-menu-btn {
  color: var(--color-gray-700);
}

.user-avatar {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.avatar {
  border: 2px solid var(--color-primary-200);
  background: var(--color-primary-100);
  color: var(--color-primary-600);
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.user-name {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-gray-800);
  line-height: 1.2;
}

.user-role {
  font-size: var(--font-size-xs);
  color: var(--color-gray-500);
  line-height: 1.2;
}

.dropdown-icon {
  font-size: 1rem;
  color: var(--color-gray-500);
}

.user-dropdown {
  min-width: 220px;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--color-gray-200);
}

/* Mobile Drawer */
.mobile-drawer {
  background: var(--color-surface);
}

.drawer-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-6);
  border-bottom: 1px solid var(--color-gray-200);
}

.mobile-nav {
  flex: 1;
  padding: var(--space-4) 0;
}

.mobile-nav .q-item {
  margin: var(--space-1) var(--space-4);
  border-radius: var(--border-radius-lg);
  color: var(--color-gray-700);
}

.mobile-nav .q-item:hover {
  background: var(--color-primary-50);
  color: var(--color-primary-600);
}

.mobile-nav-active {
  background: var(--color-primary-50) !important;
  color: var(--color-primary-600) !important;
}

.drawer-footer {
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  border-top: 1px solid var(--color-gray-200);
}

.full-width {
  width: 100%;
}

/* Responsive Design */
@media (max-width: 768px) {
  .navbar-container {
    display: flex;
    justify-content: space-between;
    padding: 0 var(--space-4);
    position: relative;
  }
  
  .desktop-nav-center {
    position: static;
    transform: none;
    display: none;
  }
  
  .hide-mobile {
    display: none !important;
  }
}

@media (min-width: 769px) {
  .hide-desktop {
    display: none !important;
  }
}

/* Button Overrides for Header */
.user-actions .btn-unstop {
  font-size: var(--font-size-sm);
}

.user-actions .btn-ghost {
  color: var(--color-gray-600);
}

.user-actions .btn-ghost:hover {
  color: var(--color-primary-600);
  background: var(--color-primary-50);
}

/* No fixed positioning, so no margin needed */

.smart-caption {
  color: var(--color-orange-600) !important;
  font-weight: 500;
  font-size: 11px;
}
</style>