<template>
  <div class="dashboard-header">
    <!-- Background Decorations -->
    <div class="header-background">
      <div class="background-pattern"></div>
      <div class="gradient-overlay"></div>
    </div>
    
    <div class="header-content row items-center justify-between">
      <!-- Left Section: User Info -->
      <div class="user-section row items-center no-wrap">
        <!-- Professional Avatar -->
        <div class="avatar-container">
          <q-avatar size="100px" class="professional-avatar">
            <q-icon name="person" size="40px" color="white" />
            <div class="avatar-ring"></div>
            <div class="avatar-status"></div>
          </q-avatar>
        </div>
        
        <!-- Welcome Content -->
        <div class="welcome-content">
          <div class="welcome-header">
            <h4 class="welcome-text">
              {{ welcomeMessage }}
            </h4>
          </div>
          <p class="subtext">
            Ready to accelerate your career journey? Discover opportunities tailored just for you.
          </p>
        </div>
      </div>
      
      <!-- Right Section: Action Buttons -->
      <div class="action-section">
        <div class="action-buttons">
          <q-btn
            icon="account_circle"
            label="Complete Profile"
            unelevated
            class="professional-btn primary-btn"
            @click="$emit('open-profile')"
            no-caps
          >
            <q-tooltip class="professional-tooltip">
              Complete your profile to get better job matches
            </q-tooltip>
          </q-btn>
          
          <q-btn
            icon="description"
            label="Build Resume"
            class="professional-btn secondary-btn"
            @click="$emit('go-resume')"
            no-caps
            outline
          >
            <q-tooltip class="professional-tooltip">
              Create or update your resume
            </q-tooltip>
          </q-btn>
        </div>
        
        <!-- Quick Actions -->
        <div class="quick-actions">
          <q-btn 
            flat 
            round 
            icon="notifications" 
            size="md" 
            class="quick-action-btn"
          >
            <q-badge floating color="orange" rounded>5</q-badge>
            <q-tooltip>Notifications</q-tooltip>
          </q-btn>
          
          <q-btn 
            flat 
            round 
            icon="help_outline" 
            size="md" 
            class="quick-action-btn"
          >
            <q-tooltip>Help & Support</q-tooltip>
          </q-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from 'src/stores/auth.store';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const authStore = useAuthStore();
const welcomeMessage = ref('Welcome!');

onMounted(async () => {
  try {
    // Check for token and fetch user data if not already loaded
    if (authStore.token && !authStore.user) {
      await authStore.fetchCurrentUser();
    }
    if (authStore.user && authStore.user.name) {
      welcomeMessage.value = authStore.user.isNewUser
        ? `Welcome ${authStore.user.name}!`
        : `Welcome back ${authStore.user.name}!`;
    } else {
      welcomeMessage.value = 'Welcome!';
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    welcomeMessage.value = 'Welcome!';
    $q.notify({
      type: 'negative',
      message: 'Failed to load user data. Please try logging in again.',
      position: 'top',
    });
  }
});
</script>

<style scoped>
/* Header Container */
.dashboard-header {
  position: relative;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  padding: 30px;
  margin-bottom: 24px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.08);
}

/* Background Decorations */
.header-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

.background-pattern {
  position: absolute;
  top: -50px;
  right: -50px;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%);
  border-radius: 50%;
}

.background-pattern::before {
  content: '';
  position: absolute;
  top: 80px;
  left: -100px;
  width: 150px;
  height: 150px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.03) 0%, transparent 70%);
  border-radius: 50%;
}

.gradient-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #3b82f6, #6366f1, #8b5cf6);
  opacity: 0.6;
}

/* Header Content */
.header-content {
  position: relative;
  z-index: 2;
}

/* User Section */
.user-section {
  flex: 1;
  max-width: calc(100% - 320px);
}

.avatar-container {
  position: relative;
  margin-right: 1.5rem;
  flex-shrink: 0;
}

.professional-avatar {
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  border: 4px solid white;
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.25);
  position: relative;
  overflow: visible;
}

.avatar-ring {
  position: absolute;
  top: -6px;
  left: -6px;
  right: -6px;
  bottom: -6px;
  border: 2px solid #dbeafe;
  border-radius: 50%;
  animation: pulse 3s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.7; }
}

/* Welcome Content */
.welcome-content {
  flex: 1;
  min-width: 0;
}

.welcome-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.welcome-text {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  background: linear-gradient(135deg, #1e40af, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-family: 'Satisfy', cursive;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.75rem;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  color: #059669;
}

.subtext {
  color: #64748b;
  font-size: 1rem;
  line-height: 1.5;
  margin: 0 0 1rem 0;
  font-weight: 400;
}

.quick-stats {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #475569;
  font-weight: 500;
}

/* Action Section */
.action-section {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1rem;
  flex-shrink: 0;
}

.action-buttons {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.professional-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.professional-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.professional-btn:hover::before {
  left: 100%;
}

.primary-btn {
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  color: white;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
}

.primary-btn:hover {
  background: linear-gradient(135deg, #1e40af, #1d4ed8);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
}

.secondary-btn {
  background: white;
  color: #3b82f6;
  border: 2px solid #3b82f6;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.secondary-btn:hover {
  background: #f0f9ff;
  border-color: #1e40af;
  color: #1e40af;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

/* Quick Actions */
.quick-actions {
  display: flex;
  gap: 0.5rem;
}

.quick-action-btn {
  color: #64748b;
  background: white;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.quick-action-btn:hover {
  background: #f8fafc;
  color: #3b82f6;
  border-color: #cbd5e1;
  transform: scale(1.05);
}

/* Professional Tooltip */
.professional-tooltip {
  background: #1e293b;
  color: white;
  font-size: 0.8rem;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .dashboard-header {
    padding: 24px 20px;
  }
  
  .header-content {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .user-section {
    max-width: 100%;
    width: 100%;
  }
  
  .action-section {
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  
  .welcome-text {
    font-size: 1.5rem;
  }
}

@media (max-width: 768px) {
  .dashboard-header {
    padding: 20px 16px;
  }
  
  .user-section {
    flex-direction: column;
    text-align: center;
  }
  
  .avatar-container {
    margin-right: 0;
    margin-bottom: 1rem;
  }
  
  .professional-avatar {
    width: 80px !important;
    height: 80px !important;
  }
  
  .welcome-header {
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .welcome-text {
    font-size: 1.375rem;
  }
  
  .quick-stats {
    justify-content: center;
  }
  
  .action-section {
    flex-direction: column;
    width: 100%;
  }
  
  .action-buttons {
    width: 100%;
    justify-content: center;
  }
  
  .professional-btn {
    flex: 1;
    min-width: 140px;
  }
  
  .quick-actions {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .action-buttons {
    flex-direction: column;
    width: 100%;
  }
  
  .professional-btn {
    width: 100%;
  }
  
  .quick-stats {
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }
}

/* Enhanced Accessibility */
.professional-btn:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.quick-action-btn:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* High Contrast Mode */
@media (prefers-contrast: high) {
  .welcome-text {
    -webkit-text-fill-color: #1e40af;
    background: none;
  }
  
  .primary-btn {
    background: #1e40af;
  }
  
  .secondary-btn {
    border-width: 3px;
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .professional-btn,
  .quick-action-btn,
  .avatar-ring {
    transition: none;
    animation: none;
  }
  
  .professional-btn::before {
    display: none;
  }
}
</style>