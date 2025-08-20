<template>
  <div class="dashboard-sidebar">
    <!-- Sidebar Header -->
    <div class="sidebar-header">
      <div class="user-avatar">
        <q-avatar size="50px" class="avatar-gradient">
          <img v-if="userPhoto" :src="userPhoto" alt="User avatar" />
          <span v-else>{{ userInitials }}</span>
        </q-avatar>
      </div>
      <div class="user-info">
        <h6 class="user-name">{{ userName || 'Dashboard' }}</h6>
        <p class="user-role">Job Seeker</p>
      </div>
    </div>

    <!-- Navigation Menu -->
    <nav class="sidebar-nav">
      <q-list padding class="nav-list">
        <q-item
          v-for="item in sidebarItems"
          :key="item.key"
          clickable
          v-ripple="rippleConfig"
          :active="selectedSection === item.key"
          active-class="active-link"
          @click="navigate(item.key)"
          class="sidebar-item"
          :aria-label="`${item.label} ${item.badge ? `(${item.badge} new)` : ''}`"
        >
          <q-item-section avatar class="item-icon">
            <div class="icon-wrapper">
              <q-icon 
                :name="item.icon" 
                :color="selectedSection === item.key ? 'white' : 'grey-5'" 
                size="22px"
              />
            </div>
          </q-item-section>
          <q-item-section class="item-label">
            <span>{{ item.label }}</span>
          </q-item-section>
          <q-item-section side class="item-indicator" v-if="item.badge && item.badge !== '0'">
            <q-badge 
              :color="item.badgeColor" 
              :label="item.badge"
              rounded
              class="notification-badge"
              :aria-label="`${item.label} has ${item.badge} new items`"
            />
          </q-item-section>
        </q-item>
      </q-list>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const emit = defineEmits(['navigate']);

defineProps({
  selectedSection: String,
});

// Simulated user data (could be fetched from auth service)
const userName = ref('John Doe');
const userPhoto = ref(null); // Replace with actual user photo URL if available
const userInitials = computed(() => {
  if (!userName.value) return 'JD';
  const [first, last] = userName.value.split(' ');
  return `${first?.charAt(0) || ''}${last?.charAt(0) || ''}`.toUpperCase();
});

// Simulated application and notification data
const applications = ref([
  { id: 1, jobTitle: 'Software Engineer', status: 'Pending', date: '2025-08-10' },
  { id: 2, jobTitle: 'Data Analyst', status: 'Under Review', date: '2025-08-12' },
  { id: 3, jobTitle: 'Product Manager', status: 'Pending', date: '2025-08-15' },
]);

const notifications = ref([
  { message: 'Profile updated successfully!', timestamp: '10:20 PM IST, Aug 02, 2025', type: 'success' },
  { message: 'New message received from Admin.', timestamp: '09:45 PM IST, Aug 02, 2025', type: 'info' },
  { message: 'Your subscription is expiring soon!', timestamp: '08:00 PM IST, Aug 02, 2025', type: 'warning' },
  { message: 'Failed to process payment.', timestamp: '07:30 PM IST, Aug 02, 2025', type: 'error' },
  { message: 'Application submitted!', timestamp: '06:00 PM IST, Aug 01, 2025', type: 'success' },
]);

// Ripple configuration
const rippleConfig = {
  color: 'blue-4',
  center: false,
};

// Sidebar items with dynamic badge counts
const sidebarItems = computed(() => [
  { 
    key: 'applications', 
    label: 'My Applications', 
    icon: 'assignment_turned_in',
    badge: applications.value.length.toString(),
    badgeColor: 'blue-8'
  },
  { 
    key: 'bookmarks', 
    label: 'Bookmarked Jobs', 
    icon: 'bookmark_added',
    badge: '0', // Could be dynamic if bookmarks data is available
    badgeColor: 'indigo-8'
  },
  { 
    key: 'profile', 
    label: 'My Profile', 
    icon: 'account_circle' 
  },
  { 
    key: 'notifications', 
    label: 'Notifications', 
    icon: 'notifications_active',
    badge: notifications.value.length.toString(),
    badgeColor: 'orange-8'
  },

  { 
    key: 'settings', 
    label: 'Settings', 
    icon: 'settings' 
  },
]);

function navigate(section) {
  emit('navigate', section);
}
</script>

<style scoped>
/* Sidebar Container */
.dashboard-sidebar {
  width: 280px;
  min-height: 100vh;
  background: linear-gradient(180deg, #1e3a8a 0%, #3b82f6 100%);
  color: #f1f5f9;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  transition: transform 0.4s ease, box-shadow 0.4s ease;
}

.dashboard-sidebar:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

/* Sidebar Header */
.sidebar-header {
  padding: 2.25rem 1.75rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  background: rgba(0, 0, 0, 0.15);
  border-bottom: 2px solid rgba(255, 255, 255, 0.25);
}

.user-avatar {
  position: relative;
}

.avatar-gradient {
  background: linear-gradient(135deg, #60a5fa, #1e40af);
  border: 4px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  font-size: 20px;
  font-weight: 600;
}

.avatar-gradient:hover {
  transform: scale(1.12);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.35);
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 700;
  color: #ffffff;
}

.user-role {
  margin: 0;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 400;
}

/* Navigation Section */
.sidebar-nav {
  flex: 1;
  padding: 2rem 0;
  overflow-y: auto;
}

.nav-list {
  padding: 0 1.25rem;
}

/* Sidebar Items */
.sidebar-item {
  font-size: 1rem;
  font-weight: 500;
  padding: 1rem 1.25rem;
  border-radius: 14px;
  margin: 0.75rem 0;
  transition: all 0.3s ease;
  background: transparent;
  color: #d1dae6;
}

.sidebar-item:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
  transform: translateX(6px);
}

/* Active Link Styles */
.active-link {
  background: #1e3a8a !important;
  color: #ffffff !important;
  font-weight: 600;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.25);
}

.active-link .icon-wrapper {
  background: #ffffff;
}

.active-link .q-icon {
  color: #1e40af !important;
}

/* Item Components */
.item-icon {
  min-width: 44px;
  margin-right: 1rem;
}

.icon-wrapper {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.sidebar-item:hover .icon-wrapper {
  background: rgba(255, 255, 255, 0.3);
}

.item-label {
  font-weight: 500;
  font-size: 1rem;
}

.item-indicator {
  min-width: auto;
  margin-left: 0.75rem;
}

.notification-badge {
  font-size: 0.8rem;
  font-weight: 600;
  min-width: 24px;
  height: 24px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
  transition: transform 0.3s ease;
}

.notification-badge:hover {
  transform: scale(1.15);
}

/* Scrollbar Styling */
.sidebar-nav::-webkit-scrollbar {
  width: 8px;
}

.sidebar-nav::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.4);
  border-radius: 4px;
}

.sidebar-nav::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.6);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .dashboard-sidebar {
    width: 260px;
  }
}

@media (max-width: 768px) {
  .dashboard-sidebar {
    width: 240px;
  }

  .sidebar-header {
    padding: 1.75rem 1.25rem;
  }

  .sidebar-item {
    padding: 0.85rem 1rem;
  }

  .user-name {
    font-size: 1.05rem;
  }

  .user-role {
    font-size: 0.85rem;
  }

  .icon-wrapper {
    width: 36px;
    height: 36px;
  }
}

@media (max-width: 480px) {
  .dashboard-sidebar {
    width: 220px;
  }

  .sidebar-item {
    font-size: 0.95rem;
    padding: 0.75rem;
  }

  .icon-wrapper {
    width: 32px;
    height: 32px;
  }

  .notification-badge {
    min-width: 20px;
    height: 20px;
    font-size: 0.75rem;
  }
}

/* Accessibility */
.sidebar-item:focus-visible {
  outline: 3px solid #3b82f6;
  outline-offset: 3px;
}

@media (prefers-contrast: high) {
  .dashboard-sidebar {
    background: #1e3a8a;
  }

  .sidebar-item {
    color: #ffffff;
    border-bottom: 2px solid #ffffff;
  }

  .active-link {
    background: #1e40af !important;
  }

  .icon-wrapper {
    background: #ffffff;
  }

  .notification-badge {
    border: 2px solid #ffffff;
  }
}

@media (prefers-reduced-motion: reduce) {
  .dashboard-sidebar,
  .sidebar-item,
  .avatar-gradient,
  .icon-wrapper,
  .notification-badge {
    transition: none;
  }
}
</style>