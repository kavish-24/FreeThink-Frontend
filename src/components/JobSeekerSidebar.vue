<template>
  <div class="dashboard-sidebar">
    <!-- Sidebar Header -->
    <div class="sidebar-header">
      <div class="user-avatar">
        <q-avatar size="40px" class="avatar-gradient">
          <q-icon name="person" size="20px" color="white" />
        </q-avatar>
      </div>
      <div class="user-info">
        <h6 class="user-name">Dashboard</h6>
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
        >
          <q-item-section avatar class="item-icon">
            <div class="icon-wrapper">
              <q-icon 
                :name="item.icon" 
                :color="selectedSection === item.key ? 'white' : 'blue-grey-6'" 
                size="18px"
              />
            </div>
          </q-item-section>
          <q-item-section class="item-label">
            <span>{{ item.label }}</span>
          </q-item-section>
          <q-item-section side class="item-indicator" v-if="item.badge">
            <q-badge 
              :color="item.badgeColor || 'orange'" 
              :label="item.badge"
              rounded
              class="notification-badge"
            />
          </q-item-section>
        </q-item>
      </q-list>
    </nav>

  </div>
</template>

<script setup>
const emit = defineEmits(['navigate'])

defineProps({
  selectedSection: String,
})

// Enhanced ripple configuration
const rippleConfig = {
  color: 'blue-2',
  center: false
}

// Enhanced sidebar items with badges
const sidebarItems = [
  { 
    key: 'applications', 
    label: 'My Applications', 
    icon: 'assignment_turned_in',
    badge: '3',
    badgeColor: 'blue'
  },
  { 
    key: 'bookmarks', 
    label: 'Bookmarked Jobs', 
    icon: 'bookmark_added',
    badge: '',
    badgeColor: 'indigo'
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
    badge: '5',
    badgeColor: 'orange'
  },

  { 
    key: 'settings', 
    label: 'Settings', 
    icon: 'settings' 
  },
]

function navigate(section) {
  emit('navigate', section)
}
</script>

<style scoped>
/* Sidebar Container */
.dashboard-sidebar {
  width: 260px;
  min-height: 100vh;
  background-color: #1565c0;
  color: #f0f4f8;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

/* Sidebar Header */
.sidebar-header {
  padding: 1.5rem 1.25rem 1rem;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  position: relative;
}

.user-avatar {
  position: relative;
  z-index: 2;
}

.avatar-gradient {
  background: linear-gradient(135deg, #60a5fa, #3b82f6);
  border: 2px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.2);
}

.user-info {
  position: relative;
  z-index: 2;
}

.user-name {
  margin: 0 0 0.2rem 0;
  font-size: 1rem;
  font-weight: 700;
  color: white;
}

.user-role {
  margin: 0;
  font-size: 0.8rem;
  opacity: 0.9;
  color: rgba(255, 255, 255, 0.8);
}

/* Navigation Section */
.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
}

.nav-list {
  padding: 0 0.75rem;
}

/* Sidebar Items */
.sidebar-item {
  font-size: 0.9rem;
  font-weight: 500;
  padding: 0.75rem;
  border-radius: 10px;
  transition: all 0.3s ease;
  margin-bottom: 0.4rem;
  position: relative;
  background: transparent;
  color: #BCCCDC;
  border-bottom: 1px solid #243B55;
}

.sidebar-item:hover {
  background-color: #243B55;
  color: #ffffff;
}

/* Active Link Styles */
.active-link {
  background-color: #00529b !important;
  color: white !important;
  font-weight: 600;
}

/* Item Components */
.item-icon {
  min-width: auto;
  margin-right: 0.5rem;
}

.icon-wrapper {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.item-label {
  font-weight: 500;
}

.item-indicator {
  min-width: auto;
  margin-left: 0.4rem;
}

.notification-badge {
  font-size: 0.7rem;
  font-weight: 600;
  min-width: 18px;
  height: 18px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

/* Sidebar Footer */
.sidebar-footer {
  padding: 0.75rem 1.25rem 1.5rem;
  margin-top: auto;
}

.upgrade-card {
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
}

.upgrade-icon {
  margin-bottom: 0.5rem;
}

.upgrade-title {
  margin: 0 0 0.2rem 0;
  font-size: 0.9rem;
  font-weight: 700;
  color: #1e293b;
}

.upgrade-text {
  margin: 0 0 0.75rem 0;
  font-size: 0.75rem;
  color: #64748b;
  line-height: 1.3;
}

.upgrade-btn {
  font-weight: 600;
  font-size: 0.75rem;
  padding: 0.4rem 0.8rem;
  box-shadow: 0 2px 6px rgba(59, 130, 246, 0.25);
  transition: all 0.3s ease;
}

.upgrade-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 3px 10px rgba(59, 130, 246, 0.35);
}

/* Scrollbar Styling */
.sidebar-nav::-webkit-scrollbar {
  width: 4px;
}

.sidebar-nav::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

.sidebar-nav::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .dashboard-sidebar {
    width: 260px;
  }
}

@media (max-width: 768px) {
  .dashboard-sidebar {
    width: 260px;
  }
}

@media (max-width: 600px) {
  .dashboard-sidebar {
    width: 260px;
  }
}
</style>