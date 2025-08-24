<template>
  <div v-if="!showQueries">
  <q-card class="notification-card q-pa-xl q-mb-xl" flat bordered>
    <div class="row items-center justify-between q-mb-lg">
      <div class="row items-center q-gutter-md">
        <q-icon name="notifications" size="44px" color="primary" class="notification-icon" />
        <div class="text-h5 text-primary text-weight-bold header-title">Notifications</div>
        <q-badge
          v-if="notifications.length"
          :label="notifications.length"
          color="red-7"
          rounded
          floating
          class="q-ml-sm text-subtitle2 badge-adjust"
          aria-label="Number of notifications"
        />
      </div>
      <q-btn
        flat
        round
        icon="delete_sweep"
        size="md"
        @click="clearAllNotifications"
        aria-label="Clear all notifications"
        v-if="notifications.length > 0"
        class="clear-btn"
      >
        <q-tooltip class="professional-tooltip" anchor="top middle" self="bottom middle" :offset="[10, 10]">
          Clear All Notifications
        </q-tooltip>
      </q-btn>
    </div>

    <q-separator inset class="q-my-lg separator" />

    <div class="q-my-lg">
  <q-list bordered padding class="rounded-borders action-card">
    <q-item clickable v-ripple @click="goToQueries" aria-label="Go to support and queries page">
      <q-item-section avatar>
        <q-avatar icon="support_agent" color="primary" text-color="white" />
      </q-item-section>

      <q-item-section>
        <q-item-label class="text-weight-bold">Support & Queries</q-item-label>
        <q-item-label caption>Have a question? View your past support tickets or create a new one.</q-item-label>
      </q-item-section>

      <q-item-section side>
        <q-icon name="chevron_right" color="grey-6" />
      </q-item-section>
    </q-item>
  </q-list>
</div>


    <div class="q-mt-xl" v-if="notifications.length > 0">
      <q-list bordered class="rounded-borders notification-list">
        <transition-group name="slide-fade" tag="div">
          <q-item
            v-for="(notification, index) in notifications"
            :key="notification.timestamp"
            class="notification-item"
            clickable
            @click="dismissNotification(index)"
            role="button"
            :aria-label="`Notification: ${notification.message}`"
          >
            <q-item-section avatar>
              <q-icon
                :name="getNotificationIcon(notification.type)"
                :color="getNotificationColor(notification.type)"
                size="34px"
                class="notification-type-icon"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label class="notification-message text-weight-medium">
                {{ notification.message }}
              </q-item-label>
              <q-item-label caption class="notification-timestamp">
                {{ notification.timestamp }}
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn
                flat
                round
                icon="close"
                size="sm"
                @click.stop="dismissNotification(index)"
                class="close-btn"
                aria-label="Dismiss this notification"
              >
                <q-tooltip class="professional-tooltip" anchor="top middle" self="bottom middle" :offset="[10, 10]">
                  Dismiss Notification
                </q-tooltip>
              </q-btn>
            </q-item-section>
          </q-item>
        </transition-group>
      </q-list>
    </div>

    <div v-else class="no-notifications text-center text-grey-6 q-py-xl">
      <q-icon name="notifications_off" size="80px" color="grey-5" class="q-mb-lg" />
      <div class="text-h6 text-grey-8 text-weight-medium">You're All Caught Up!</div>
      <div class="text-body2 text-grey-6">No new notifications to display.</div>
    </div>
    
  </q-card>
  </div>
  <div v-else>
  <!-- Add a button to return to notifications -->
  <q-btn
    label="Back to Notifications"
    icon="arrow_back"
    color="primary"
    flat
    @click="showQueries = false"
    class="q-mb-md"
  />
  
  <!-- Add the component for queries -->
  <JobseekerQueriesAns />
</div>
</template>

<script setup>
import { ref } from 'vue';
import JobseekerQueriesAns from './JobseekerQueriesAns.vue';

const showQueries = ref(false);

const notifications = ref([
  { message: 'Profile updated successfully!', timestamp: '10:20 PM IST, Aug 02, 2025', type: 'success' },
  { message: 'New message received from Admin.', timestamp: '09:45 PM IST, Aug 02, 2025', type: 'info' },
  { message: 'Your subscription is expiring soon!', timestamp: '08:00 PM IST, Aug 02, 2025', type: 'warning' },
  { message: 'Failed to process payment.', timestamp: '07:30 PM IST, Aug 02, 2025', type: 'error' }
]);

const dismissNotification = (index) => {
  notifications.value.splice(index, 1);
};

const clearAllNotifications = () => {
  notifications.value = [];
};

const goToQueries = () => {
  showQueries.value = true;
};

const getNotificationIcon = (type) => {
  switch (type) {
    case 'success': return 'check_circle';
    case 'info': return 'info';
    case 'warning': return 'warning';
    case 'error': return 'error';
    default: return 'notifications';
  }
};

const getNotificationColor = (type) => {
  switch (type) {
    case 'success': return 'green-8';
    case 'info': return 'blue-8';
    case 'warning': return 'orange-8';
    case 'error': return 'red-8';
    default: return 'primary';
  }
};
</script>

<style scoped>
.notification-card {
  border-radius: 20px;
  background: linear-gradient(145deg, #ffffff 0%, #f1f5f9 100%);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  max-width: 960px;
  margin: 0 auto;
  padding: 40px;
  transition: transform 0.4s ease, box-shadow 0.4s ease;
}

.notification-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}

.header-title {
  font-size: 26px;
  font-weight: 700;
  background: linear-gradient(135deg, #1e40af, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.notification-icon {
  transition: transform 0.3s ease, color 0.3s ease;
}

.notification-icon:hover {
  transform: scale(1.12);
  color: #1e40af;
}

.separator {
  background: linear-gradient(to right, #e2e8f0, #3b82f6, #e2e8f0);
  height: 2px;
}

.action-card {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  transition: background-color 0.3s, box-shadow 0.3s;
}
.action-card:hover {
  background: #e9ecef;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
}

.notification-list {
  border-radius: 16px;
  background: #ffffff;
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.notification-item {
  padding: 24px 28px;
  border-bottom: 1px solid #e5e7eb;
  transition: background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
  align-items: center;
  background: #ffffff;
}

.notification-item:hover {
  background: #eff6ff;
  transform: translateX(6px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-message {
  font-size: 17px;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.5;
}

.notification-timestamp {
  font-size: 13px;
  color: #6b7280;
  margin-top: 8px;
  font-weight: 400;
}

.notification-type-icon {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.notification-type-icon:hover {
  transform: scale(1.2);
  opacity: 0.9;
}

.close-btn {
  color: #9ca3af;
  transition: color 0.3s ease, transform 0.3s ease;
}

.close-btn:hover {
  color: #dc2626;
  transform: scale(1.25) rotate(90deg);
}

.clear-btn {
  color: #6b7280;
  transition: color 0.3s ease, transform 0.3s ease;
}

.clear-btn:hover {
  color: #1e40af;
  transform: scale(1.15) rotate(5deg);
}

.no-notifications {
  padding: 56px 32px;
  background: linear-gradient(145deg, #f8fafc, #f1f5f9);
  border-radius: 16px;
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.no-notifications:hover {
  opacity: 0.95;
  transform: scale(1.01);
}

.professional-tooltip {
  background: #1e293b;
  color: #ffffff;
  font-size: 13px;
  padding: 10px 14px;
  border-radius: 10px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

/* Transition styles for slide-fade effect */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-fade-leave-active {
  position: absolute;
  width: 100%;
}

/* Responsive Design */
@media (max-width: 768px) {
  .notification-card {
    max-width: 100%;
    padding: 28px;
    border-radius: 14px;
  }

  .notification-item {
    padding: 18px 22px;
  }

  .notification-message {
    font-size: 16px;
  }

  .notification-timestamp {
    font-size: 12px;
  }

  .notification-icon {
    font-size: 40px !important;
  }

  .text-h5 {
    font-size: 1.3rem;
  }

  .q-badge {
    font-size: 0.8rem !important;
  }

  .no-notifications {
    padding: 40px 20px;
  }

  .no-notifications .q-icon {
    font-size: 64px !important;
  }
}

@media (max-width: 480px) {
  .notification-card {
    padding: 20px;
  }

  .notification-item {
    padding: 14px 18px;
  }

  .text-h5 {
    font-size: 1.15rem;
  }

  .notification-message {
    font-size: 15px;
  }

  .notification-timestamp {
    font-size: 11px;
  }

  .no-notifications .text-h6 {
    font-size: 1.05rem;
  }

  .no-notifications .q-icon {
    font-size: 56px !important;
  }
}

.badge-adjust {
  transform: translateX(-18px) translateY(-6px);
}

/* Accessibility */
.notification-item:focus-visible,
.close-btn:focus-visible,
.clear-btn:focus-visible {
  outline: 3px solid #3b82f6;
  outline-offset: 3px;
}

@media (prefers-contrast: high) {
  .notification-card {
    border: 2px solid #1e3a8a;
  }

  .notification-message {
    color: #1e3a8a;
    font-weight: 700;
  }

  .notification-timestamp {
    color: #1f2937;
  }

  .close-btn, .clear-btn {
    border: 2px solid #1e40af;
    color: #1e40af;
  }

  .separator {
    background: #1e40af;
  }
}

@media (prefers-reduced-motion: reduce) {
  .notification-card,
  .notification-item,
  .notification-icon,
  .notification-type-icon,
  .close-btn,
  .clear-btn,
  .no-notifications {
    transition: none;
  }

  .slide-fade-enter-active,
  .slide-fade-leave-active {
    transition: none;
  }
}
</style>