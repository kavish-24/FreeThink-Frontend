<template>
  <q-card class="notification-card q-pa-xl q-mb-xl" flat bordered role="region" aria-label="Notifications section">
    <div class="row items-center justify-between q-mb-lg">
      <div class="row items-center q-gutter-md">
        <q-icon name="notifications" size="44px" color="primary" class="notification-icon" aria-hidden="true" />
        <div class="text-h5 text-primary text-weight-bold header-title">Notifications</div>
        <q-badge
          v-if="unreadCount > 0"
          :label="unreadCount"
          color="red-7"
          rounded
          floating
          class="q-ml-sm text-subtitle2 badge-adjust"
          :aria-label="`${unreadCount} unread notifications`"
        />
      </div>
      <div class="row q-gutter-sm">
        <q-btn
          flat
          round
          icon="refresh"
          size="md"
          @click="debouncedRefreshNotifications"
          :loading="loading"
          aria-label="Refresh notifications"
          class="refresh-btn"
        >
          <q-tooltip class="professional-tooltip" anchor="top middle" self="bottom middle" :offset="[10, 10]">
            Refresh Notifications
          </q-tooltip>
        </q-btn>
        <q-btn
          flat
          round
          icon="mark_email_read"
          size="md"
          @click="markAllAsRead"
          aria-label="Mark all notifications as read"
          v-if="unreadCount > 0"
          class="mark-all-btn"
        >
          <q-tooltip class="professional-tooltip" anchor="top middle" self="bottom middle" :offset="[10, 10]">
            Mark All as Read
          </q-tooltip>
        </q-btn>
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
    </div>

    <q-separator inset class="q-my-lg separator" />

    <!-- Loading State -->
    <div v-if="loading && notifications.length === 0" class="text-center q-py-xl">
      <q-spinner color="primary" size="3em" />
      <div class="text-body2 text-grey-6 q-mt-md">Loading notifications...</div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state text-center q-py-xl">
      <q-icon name="error_outline" size="80px" color="red-5" class="q-mb-lg" />
      <div class="text-h6 text-red-8 text-weight-medium">Failed to Load Notifications</div>
      <div class="text-body2 text-grey-6 q-mb-lg">{{ errorMessage }}</div>
      <q-btn 
        color="primary" 
        @click="debouncedRefreshNotifications" 
        :loading="loading"
        label="Try Again"
        class="q-mt-md"
        aria-label="Retry loading notifications"
      />
    </div>

    <!-- Notifications List -->
    <div v-else-if="notifications.length > 0" class="q-mt-xl">
      <!-- Filter/Sort Controls -->
      <div class="row items-center justify-between q-mb-md">
        <q-select
          v-model="filterType"
          :options="filterOptions"
          label="Filter by type"
          dense
          outlined
          class="filter-select"
          style="min-width: 150px"
          emit-value
          map-options
          aria-label="Filter notifications by type"
        />
        <q-btn-group flat>
          <q-btn
            flat
            :color="sortOrder === 'newest' ? 'primary' : 'grey'"
            label="Newest"
            @click="sortOrder = 'newest'"
            size="sm"
            aria-label="Sort notifications by newest"
          />
          <q-btn
            flat
            :color="sortOrder === 'oldest' ? 'primary' : 'grey'"
            label="Oldest"
            @click="sortOrder = 'oldest'"
            size="sm"
            aria-label="Sort notifications by oldest"
          />
        </q-btn-group>
      </div>

      <q-list bordered class="rounded-borders notification-list">
        <transition-group name="slide-fade" tag="div">
          <q-item
            v-for="notification in paginatedNotifications"
            :key="notification.id"
            class="notification-item"
            :class="{ 'notification-unread': !notification.read }"
            clickable
            @click="markAsRead(notification)"
            :aria-label="`Notification: ${notification.message}`"
            role="listitem"
          >
            <q-item-section avatar>
              <div class="relative">
                <q-icon
                  :name="getNotificationIcon(notification.type)"
                  :color="getNotificationColor(notification.type)"
                  size="34px"
                  class="notification-type-icon"
                />
                <q-badge
                  v-if="!notification.read"
                  color="red"
                  floating
                  rounded
                  style="top: -5px; right: -5px"
                  aria-label="Unread notification"
                />
              </div>
            </q-item-section>
            
            <q-item-section>
              <q-item-label class="notification-message text-weight-medium">
                {{ notification.message }}
              </q-item-label>
              <q-item-label caption class="notification-timestamp">
                {{ formatTimestamp(notification.created_at) }}
              </q-item-label>
              <div v-if="notification.action_url" class="q-mt-sm">
                <q-btn
                  flat
                  dense
                  color="primary"
                  :label="notification.action_text || 'View Details'"
                  @click.stop="handleAction(notification)"
                  size="sm"
                  :aria-label="`View details for ${notification.message}`"
                />
              </div>
            </q-item-section>
            
            <q-item-section side class="notification-actions">
              <div class="column q-gutter-xs">
                <q-btn
                  v-if="!notification.read"
                  flat
                  round
                  icon="mark_email_read"
                  size="sm"
                  @click.stop="markAsRead(notification)"
                  class="action-btn"
                  aria-label="Mark notification as read"
                >
                  <q-tooltip class="professional-tooltip">Mark as Read</q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  round
                  icon="close"
                  size="sm"
                  @click.stop="dismissNotification(notification.id)"
                  class="close-btn"
                  aria-label="Dismiss this notification"
                >
                  <q-tooltip class="professional-tooltip">Dismiss</q-tooltip>
                </q-btn>
              </div>
            </q-item-section>
          </q-item>
        </transition-group>
      </q-list>

      <!-- Pagination Controls -->
      <div class="row justify-center q-mt-lg" v-if="totalPages > 1">
        <q-pagination
          v-model="currentPage"
          :max="totalPages"
          :max-pages="5"
          direction-links
          boundary-links
          @update:model-value="loadNotifications(currentPage, false)"
          aria-label="Notification pagination"
        />
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="no-notifications text-center text-grey-6 q-py-xl">
      <q-icon name="notifications_off" size="80px" color="grey-5" class="q-mb-lg" aria-hidden="true" />
      <div class="text-h6 text-grey-8 text-weight-medium">You're All Caught Up!</div>
      <div class="text-body2 text-grey-6">No new notifications to display.</div>
    </div>
  </q-card>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { useQuasar } from 'quasar';
import { debounce } from 'quasar';
import { formatDistanceToNow } from 'date-fns';
import notificationService from 'src/services/notification.service';
import { authHelpers } from 'src/services/auth.service';

// Initialize Quasar and state
const $q = useQuasar();
const notifications = ref([]);
const loading = ref(false);
const loadingMore = ref(false);
const error = ref(null);
const currentPage = ref(1);
const itemsPerPage = ref(10);
const hasMore = ref(true);
const userId = ref(authHelpers.getCurrentUser()?.id);
const filterType = ref('all');
const sortOrder = ref('newest');

// Filter options
const filterOptions = [
  { label: 'All', value: 'all' },
  { label: 'Info', value: 'info' },
  { label: 'Warning', value: 'warning' },
  { label: 'Error', value: 'error' },
  { label: 'Success', value: 'success' },
];

// Computed properties
const errorMessage = computed(() => {
  return error.value ? (typeof error.value === 'string' ? error.value : 'An unexpected error occurred') : '';
});

const unreadCount = computed(() => {
  return notifications.value.filter(n => !n.read).length;
});

const filteredAndSortedNotifications = computed(() => {
  let filtered = notifications.value;
  if (filterType.value !== 'all') {
    filtered = notifications.value.filter(n => n.type === filterType.value);
  }
  return filtered.sort((a, b) => {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);
    return sortOrder.value === 'newest' ? dateB - dateA : dateA - dateB;
  });
});

const totalPages = computed(() => {
  return Math.ceil(filteredAndSortedNotifications.value.length / itemsPerPage.value);
});

const paginatedNotifications = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredAndSortedNotifications.value.slice(start, end);
});

// Methods
const loadNotifications = async (page = 1, append = false) => {
  try {
    loading.value = !append;
    loadingMore.value = append;
    const data = await notificationService.fetchNotifications(userId.value, page);

    const formatted = Array.isArray(data.notifications)
      ? data.notifications.map(n => ({
          id: n.id,
          message: n.message,
          created_at: n.created_at,
          read: n.seen,
          type: n.type || (n.message.includes('not selected') ? 'error' : n.message.includes('approved') ? 'success' : 'info'),
          action_url: n.action_url,
          action_text: n.action_text,
        }))
      : [];

    if (append) {
      notifications.value.push(...formatted);
    } else {
      notifications.value = formatted;
    }
    await nextTick(); // Ensure DOM updates
    hasMore.value = data.hasMore || false;
    currentPage.value = page;
  } catch (err) {
    console.error('Error fetching notifications:', err);
    error.value = err.response?.data?.message || err.message;
    $q.notify({ type: 'negative', message: errorMessage.value });
  } finally {
    loading.value = false;
    loadingMore.value = false;
  }
};

const debouncedRefreshNotifications = debounce(async () => {
  currentPage.value = 1;
  hasMore.value = true;
  await loadNotifications(1, false);
}, 300);

const dismissNotification = async (id) => {
  try {
    await notificationService.dismissNotification(id);
    notifications.value = notifications.value.filter(n => n.id !== id);
    await nextTick(); // Ensure UI updates
    $q.notify({ type: 'positive', message: 'Notification dismissed' });
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.details || 'Failed to dismiss notification',
    });
  }
};

const clearAllNotifications = async () => {
  try {
    await notificationService.clearAllNotifications(userId.value);
    notifications.value = [];
    await nextTick(); // Ensure UI updates
    $q.notify({ type: 'positive', message: 'All notifications cleared' });
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.details || 'Failed to clear notifications',
    });
  }
};

const markAsRead = async (notification) => {
  if (notification.read) return;
  try {
    await notificationService.markAsRead(notification.id);
    notification.read = true;
    await nextTick(); // Ensure UI updates immediately
    $q.notify({ type: 'positive', message: 'Notification marked as read' });
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.details || 'Failed to mark as read',
    });
  }
};

const markAllAsRead = async () => {
  try {
    const unreadIds = notifications.value.filter(n => !n.read).map(n => n.id);
    if (unreadIds.length === 0) return;
    await notificationService.markAllAsRead(unreadIds);
    notifications.value.forEach(n => {
      if (!n.read) n.read = true;
    });
    await nextTick(); // Ensure UI updates immediately
    $q.notify({ type: 'positive', message: 'All notifications marked as read' });
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.details || 'Failed to mark all as read',
    });
  }
};

const handleAction = (notification) => {
  if (notification.action_url) {
    // Check if this is a message notification
    if (notification.type === 'message' && notification.action_url.includes('/messages')) {
      // Extract conversation ID from URL if possible
      const conversationMatch = notification.action_url.match(/conversation=(\d+)/);
      if (conversationMatch) {
        // Emit event to parent component to open message sidebar with specific conversation
        window.parent.postMessage({
          type: 'OPEN_MESSAGE_SIDEBAR',
          conversationId: conversationMatch[1]
        }, '*');
      } else {
        // Just open message sidebar
        window.parent.postMessage({
          type: 'OPEN_MESSAGE_SIDEBAR'
        }, '*');
      }
    } else {
      // For other notifications, open in new tab as before
      window.open(notification.action_url, '_blank');
    }
  }
};

const getNotificationIcon = (type) => {
  const icons = {
    info: 'info',
    warning: 'warning',
    error: 'error',
    success: 'check_circle',
    message: 'message',
  };
  return icons[type] || 'notifications';
};

const getNotificationColor = (type) => {
  const colors = {
    info: 'blue-6',
    warning: 'orange-6',
    error: 'red-6',
    success: 'green-6',
    message: 'purple-6',
  };
  return colors[type] || 'grey-6';
};

const formatTimestamp = (timestamp) => {
  try {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  } catch {
    return 'Unknown time';
  }
};

onMounted(() => {
  if (!userId.value) {
    console.error('No user ID found, cannot load notifications');
    error.value = 'User not authenticated';
    return;
  }
  loadNotifications();
});
</script>

<style scoped>
.notification-unread {
  background-color: #f5f5f5; /* Light grey background for unread notifications */
  font-weight: 500;
}
.notification-item {
  transition: background-color 0.3s ease;
}
.professional-tooltip {
  background-color: #424242;
  color: white;
  font-size: 12px;
}
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>