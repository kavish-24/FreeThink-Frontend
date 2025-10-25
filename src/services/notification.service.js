import api from './auth.service';
import socketService from './socket.service';

// Fetch paginated notifications
const fetchNotifications = async (userId, page = 1) => {
  const response = await api.get(`/notifications/${userId}`, {
    params: { page }
  });
  console.log('Fetched notifications:', response.data);
  return response.data;
};

// Get unread notification count
const getUnreadCount = async (userId) => {
  const response = await api.get(`/notifications/unread-count/${userId}`);
  return response.data;
};

// Dismiss single notification
const dismissNotification = async (id) => {
  return api.delete(`/notifications/${id}`);
};

// Clear all notifications for a user
const clearAllNotifications = async (userId) => {
  return api.delete(`/notifications/user/${userId}`);
};

// Mark notification as read
const markAsRead = async (id) => {
  return api.put(`/notifications/${id}/read`);
};

// Mark multiple notifications as read
const markAllAsRead = async (ids) => {
  return api.put('/notifications/bulk-read', { ids });
};

// WebSocket notification methods
const initializeWebSocket = () => {
  return socketService.connect();
};

const setupWebSocketListeners = (callbacks) => {
  const socket = socketService.getSocket();
  if (!socket) return;

  socket.on('new_notification', (notification) => {
    console.log('Received new notification via WebSocket:', notification);
    callbacks.onNewNotification?.(notification);
  });

  socket.on('notification_read', (data) => {
    console.log('Notification read via WebSocket:', data);
    callbacks.onNotificationRead?.(data);
  });
};

const disconnectWebSocket = () => {
  socketService.disconnect();
};

export default {
  fetchNotifications,
  getUnreadCount,
  dismissNotification,
  clearAllNotifications,
  markAsRead,
  markAllAsRead,
  initializeWebSocket,
  setupWebSocketListeners,
  disconnectWebSocket
};