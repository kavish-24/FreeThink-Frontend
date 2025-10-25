<template>
  <q-dialog 
    v-model="isOpen" 
    position="right" 
    :maximized="$q.screen.xs"
    class="notification-sidebar-dialog"
  >
    <q-card class="notification-sidebar-card">
      <!-- Header -->
      <q-card-section class="notification-header">
        <div class="header-content">
          <div class="header-title">
            <q-icon name="notifications" class="header-icon" />
            <span class="title-text">Notifications</span>
          </div>
          <div class="header-actions">
            <q-btn
              v-if="notifications.length > 0"
              flat
              dense
              icon="mark_email_read"
              @click="markAllAsRead"
              size="sm"
              class="mark-all-btn"
            >
              <q-tooltip>Mark all as read</q-tooltip>
            </q-btn>
            <q-btn
              icon="close"
              flat
              round
              dense
              v-close-popup
              class="close-btn"
            />
          </div>
        </div>
      </q-card-section>

      <!-- Notifications Content -->
      <q-card-section class="notifications-content">
        <div v-if="loading" class="loading-section">
          <q-spinner color="primary" size="3em" />
          <div class="text-body2 q-mt-md">Loading notifications...</div>
        </div>
        
        <q-scroll-area v-else class="notifications-scroll">
          <q-list separator>
            <q-item 
              v-for="notification in notifications" 
              :key="notification.id" 
              clickable 
              v-ripple
              @click="handleNotificationClick(notification)"
              :class="{ 'notification-unread': !notification.seen }"
            >
              <q-item-section avatar>
                <div class="relative">
                  <q-icon
                    :name="getNotificationIcon(notification.type)"
                    :color="getNotificationColor(notification.type)"
                    size="32px"
                    class="notification-type-icon"
                  />
                  <q-badge
                    v-if="!notification.seen"
                    color="red"
                    floating
                    rounded
                    style="top: -5px; right: -5px"
                  />
                </div>
              </q-item-section>
              
              <q-item-section>
                <q-item-label class="text-weight-medium">
                  {{ notification.message }}
                </q-item-label>
                <q-item-label caption class="text-grey-6">
                  {{ formatTimeAgo(notification.created_at) }}
                </q-item-label>
                <div v-if="notification.action_url" class="q-mt-sm">
                  <q-btn
                    flat
                    dense
                    color="primary"
                    :label="notification.action_text || 'View Details'"
                    @click.stop="handleAction(notification)"
                    size="sm"
                  />
                </div>
              </q-item-section>
              
              <q-item-section side>
                <div class="column q-gutter-xs">
                  <q-btn
                    v-if="!notification.seen"
                    flat
                    round
                    icon="mark_email_read"
                    size="sm"
                    @click.stop="markAsRead(notification)"
                    class="action-btn"
                  >
                    <q-tooltip>Mark as Read</q-tooltip>
                  </q-btn>
                  <q-btn
                    flat
                    round
                    icon="close"
                    size="sm"
                    @click.stop="dismissNotification(notification.id)"
                    class="dismiss-btn"
                  >
                    <q-tooltip>Dismiss</q-tooltip>
                  </q-btn>
                </div>
              </q-item-section>
            </q-item>
            
            <div v-if="notifications.length === 0" class="empty-state">
              <q-icon name="notifications_none" size="4em" />
              <div class="text-h6 q-mt-md">No notifications yet</div>
              <div class="text-body2 text-grey-6">You're all caught up!</div>
            </div>
          </q-list>
          
          <!-- Load More Button -->
          <div v-if="hasMore && notifications.length > 0" class="load-more-section">
            <q-btn
              flat
              color="primary"
              @click="loadMoreNotifications"
              :loading="loadingMore"
              class="load-more-btn"
            >
              Load More
            </q-btn>
          </div>
        </q-scroll-area>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { useAuthStore } from 'src/stores/auth.store';
import notificationService from 'src/services/notification.service';
import { formatDistanceToNow } from 'date-fns';

export default {
  name: 'NotificationSidebar',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'notification-read', 'open-message-sidebar'],
  data() {
    return {
      loading: false,
      loadingMore: false,
      notifications: [],
      currentPage: 1,
      hasMore: true,
    };
  },
  setup() {
    const authStore = useAuthStore();
    return { authStore };
  },
  computed: {
    isOpen: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit('update:modelValue', value);
      }
    },
    currentUser() {
      return this.authStore.userData;
    }
  },
  watch: {
    isOpen(newValue) {
      if (newValue) {
        this.loadNotifications();
      }
    }
  },
  methods: {
    async loadNotifications() {
      if (!this.currentUser?.id) return;
      
      this.loading = true;
      this.currentPage = 1;
      this.hasMore = true;
      
      try {
        const response = await notificationService.fetchNotifications(this.currentUser.id, 1);
        this.notifications = response.notifications || [];
        this.hasMore = response.hasMore || false;
      } catch (error) {
        console.error('Failed to load notifications:', error);
        this.$q.notify({
          type: 'negative',
          message: 'Failed to load notifications'
        });
      } finally {
        this.loading = false;
      }
    },
    
    async loadMoreNotifications() {
      if (!this.currentUser?.id || !this.hasMore || this.loadingMore) return;
      
      this.loadingMore = true;
      this.currentPage++;
      
      try {
        const response = await notificationService.fetchNotifications(this.currentUser.id, this.currentPage);
        const newNotifications = response.notifications || [];
        this.notifications.push(...newNotifications);
        this.hasMore = response.hasMore || false;
      } catch (error) {
        console.error('Failed to load more notifications:', error);
        this.$q.notify({
          type: 'negative',
          message: 'Failed to load more notifications'
        });
      } finally {
        this.loadingMore = false;
      }
    },
    
    async markAsRead(notification) {
      if (notification.seen) return;
      
      try {
        await notificationService.markAsRead(notification.id);
        notification.seen = true;
        this.$emit('notification-read');
        this.$q.notify({
          type: 'positive',
          message: 'Notification marked as read'
        });
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
        this.$q.notify({
          type: 'negative',
          message: 'Failed to mark as read'
        });
      }
    },
    
    async markAllAsRead() {
      const unreadNotifications = this.notifications.filter(n => !n.seen);
      if (unreadNotifications.length === 0) return;
      
      try {
        const unreadIds = unreadNotifications.map(n => n.id);
        await notificationService.markAllAsRead(unreadIds);
        
        unreadNotifications.forEach(n => {
          n.seen = true;
        });
        
        this.$emit('notification-read');
        this.$q.notify({
          type: 'positive',
          message: 'All notifications marked as read'
        });
      } catch (error) {
        console.error('Failed to mark all notifications as read:', error);
        this.$q.notify({
          type: 'negative',
          message: 'Failed to mark all as read'
        });
      }
    },
    
    async dismissNotification(id) {
      try {
        await notificationService.dismissNotification(id);
        this.notifications = this.notifications.filter(n => n.id !== id);
        this.$emit('notification-read');
        this.$q.notify({
          type: 'positive',
          message: 'Notification dismissed'
        });
      } catch (error) {
        console.error('Failed to dismiss notification:', error);
        this.$q.notify({
          type: 'negative',
          message: 'Failed to dismiss notification'
        });
      }
    },
    
    handleNotificationClick(notification) {
      // Mark as read when clicked
      if (!notification.seen) {
        this.markAsRead(notification);
      }
      
      // Handle action if available
      if (notification.action_url) {
        this.handleAction(notification);
      }
    },
    
    handleAction(notification) {
      if (notification.type === 'message' && notification.action_url?.includes('/messages')) {
        // For message notifications, emit event to open message sidebar
        this.$emit('open-message-sidebar');
        this.isOpen = false;
      } else if (notification.action_url) {
        // For other notifications, open in new tab
        window.open(notification.action_url, '_blank');
      }
    },
    
    getNotificationIcon(type) {
      const icons = {
        info: 'info',
        warning: 'warning',
        error: 'error',
        success: 'check_circle',
        message: 'message',
      };
      return icons[type] || 'notifications';
    },
    
    getNotificationColor(type) {
      const colors = {
        info: 'blue-6',
        warning: 'orange-6',
        error: 'red-6',
        success: 'green-6',
        message: 'purple-6',
      };
      return colors[type] || 'grey-6';
    },
    
    formatTimeAgo(timestamp) {
      if (!timestamp) return '';
      try {
        return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
      } catch {
        return '';
      }
    }
  }
};
</script>

<style scoped>
.notification-sidebar-dialog {
  --dialog-width: 960px;
  z-index: 9999;
}

.notification-sidebar-card {
  width: var(--dialog-width);
  max-width: 100vw;
  height: 100vh;
  max-height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border-radius: 0;
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.12);
}

/* Header */
.notification-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 28px 32px;
  position: sticky;
  top: 0;
  z-index: 2000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon {
  font-size: 32px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.title-text {
  font-size: 24px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.mark-all-btn {
  color: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
  padding: 8px 12px;
}

.mark-all-btn:hover {
  color: white;
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.close-btn {
  color: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
}

.close-btn:hover {
  color: white;
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(90deg);
}

/* Content */
.notifications-content {
  flex: 1;
  padding: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: #f8f9fa;
}

.loading-section {
  padding: 60px 32px;
  text-align: center;
  color: var(--q-color-grey-6);
}

.notifications-scroll {
  flex: 1;
  height: 100%;
}

.empty-state {
  padding: 80px 32px;
  text-align: center;
  color: var(--q-color-grey-6);
}

.empty-state .q-icon {
  color: var(--q-color-grey-4);
}

.load-more-section {
  padding: 24px;
  text-align: center;
  background: white;
}

.load-more-btn {
  padding: 8px 24px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.load-more-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

/* Notification Items */
.q-item {
  min-height: 100px;
  padding: 24px 32px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  background: white;
  margin-bottom: 2px;
}

.q-item:hover {
  background: linear-gradient(to right, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05));
  transform: translateX(-4px);
  box-shadow: 4px 0 12px rgba(102, 126, 234, 0.1);
}

.notification-unread {
  background: linear-gradient(to right, rgba(102, 126, 234, 0.08), rgba(118, 75, 162, 0.05));
  border-left: 5px solid #667eea;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.1);
}

.notification-unread:hover {
  background: linear-gradient(to right, rgba(102, 126, 234, 0.12), rgba(118, 75, 162, 0.08));
}

.notification-type-icon {
  opacity: 0.9;
  transition: all 0.3s ease;
}

.q-item:hover .notification-type-icon {
  transform: scale(1.1);
}

.q-item-label {
  font-size: 15px;
  line-height: 1.5;
}

.q-item-label.text-weight-medium {
  font-size: 16px;
  color: #2c3e50;
}

.q-item-label.caption {
  font-size: 13px;
  margin-top: 4px;
}

.action-btn {
  transition: all 0.3s ease;
  color: var(--q-color-grey-7);
}

.action-btn:hover {
  color: var(--q-color-primary);
  background: rgba(102, 126, 234, 0.1);
  transform: scale(1.15);
}

.dismiss-btn {
  transition: all 0.3s ease;
  color: var(--q-color-grey-7);
}

.dismiss-btn:hover {
  color: var(--q-color-negative);
  background: rgba(244, 67, 54, 0.1);
  transform: scale(1.15);
}

.relative {
  position: relative;
}

/* Mobile Responsive */
@media (max-width: 1024px) {
  .notification-sidebar-card {
    width: 600px;
  }
}

@media (max-width: 600px) {
  .notification-sidebar-card {
    width: 100vw;
    height: 100vh;
    max-height: 100vh;
  }
  
  .notification-header {
    padding: 20px 16px;
  }
  
  .title-text {
    font-size: 20px;
  }
  
  .header-icon {
    font-size: 28px;
  }
  
  .q-item {
    padding: 20px 16px;
  }
}

/* Scrollbar Styling */
.notifications-scroll :deep(.q-scrollarea__content) {
  padding: 8px 0;
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f3f5;
}

::-webkit-scrollbar-thumb {
  background: #c1c7cd;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #667eea;
}

/* Animations */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.q-item {
  animation: slideIn 0.3s ease-out;
}
</style>