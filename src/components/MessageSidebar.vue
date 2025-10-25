<template>
  <div>
    <!-- Main Message Dialog -->
    <q-dialog 
      v-model="isOpen" 
      position="right" 
      :maximized="$q.screen.xs"
      class="message-sidebar-dialog"
    >
      <q-card class="message-sidebar-card">
      <!-- Header -->
      <q-card-section class="message-header">
        <div class="header-content">
          <div class="header-title">
            <q-icon name="message" class="header-icon" />
            <span class="title-text">Messages</span>
          </div>
          <q-btn
            icon="close"
            flat
            round
            dense
            v-close-popup
            class="close-btn"
          />
        </div>
      </q-card-section>

      <!-- Messages Content -->
      <q-card-section class="messages-content">
        <div class="messages-layout">
          <!-- Left Panel: Conversations List -->
          <div class="conversations-panel">
            <!-- Header Actions -->
            <div class="conversations-header">
              <div class="row items-center justify-between">
                <div class="text-h6 text-weight-bold">Messages</div>
                <div class="row q-gutter-xs">
                  <!-- Broadcast button for employers -->
                  <q-btn
                    v-if="currentUser?.role === 'company'"
                    round
                    flat
                    icon="campaign"
                    color="primary"
                    @click="showBroadcastDialog = true"
                    size="sm"
                    dense
                  >
                    <q-tooltip>Create Broadcast</q-tooltip>
                  </q-btn>
                  <!-- Refresh button -->
                  <q-btn
                    round
                    flat
                    icon="refresh"
                    color="primary"
                    @click="loadConversations"
                    :loading="loading"
                    size="sm"
                    dense
                  >
                    <q-tooltip>Refresh</q-tooltip>
                  </q-btn>
                </div>
              </div>
            </div>

            <!-- Conversations List -->
            <div class="conversations-list-container">
              <div v-if="loading" class="loading-section">
                <q-spinner color="primary" size="2em" />
                <div class="text-body2 q-mt-sm">Loading...</div>
              </div>
              
              <q-scroll-area v-else class="conversations-scroll">
                <q-list class="conversations-list">
                  <q-item 
                    v-for="conversation in conversations" 
                    :key="conversation.id" 
                    clickable 
                    v-ripple
                    @click="selectConversation(conversation)"
                    :class="{ 
                      'conversation-selected': selectedConversation?.id === conversation.id,
                      'conversation-unread': conversation.unreadCount > 0
                    }"
                    class="conversation-item"
                  >
                    <q-item-section avatar>
                      <q-avatar size="48px" color="primary" text-color="white">
                        <span class="avatar-text">{{ getConversationInitial(conversation) }}</span>
                      </q-avatar>
                    </q-item-section>
                    
                    <q-item-section>
                      <q-item-label lines="1" class="conversation-name">
                        {{ getConversationName(conversation) }}
                      </q-item-label>
                      <q-item-label caption lines="2" class="last-message">
                        {{ conversation.lastMessage?.content || 'No messages yet' }}
                      </q-item-label>
                      <q-item-label caption class="message-time">
                        {{ formatTimeAgo(conversation.lastMessage?.createdAt || conversation.createdAt) }}
                      </q-item-label>
                    </q-item-section>
                    
                    <q-item-section side>
                      <q-badge 
                        v-if="conversation.unreadCount > 0" 
                        color="red" 
                        rounded
                        class="unread-badge"
                      >
                        {{ conversation.unreadCount > 9 ? '9+' : conversation.unreadCount }}
                      </q-badge>
                    </q-item-section>
                  </q-item>
                  
                  <div v-if="conversations.length === 0" class="empty-state">
                    <q-icon name="chat" size="3em" />
                    <div class="text-body2 q-mt-md">No conversations yet</div>
                    <div class="text-caption text-grey-6">Start messaging!</div>
                  </div>
                </q-list>
              </q-scroll-area>
            </div>
          </div>

          <!-- Right Panel: Chat Window -->
          <div class="chat-panel">
            <div v-if="selectedConversation" class="chat-container">
              <!-- Chat Header -->
              <div class="chat-header">
                <div class="row items-center">
                  <q-avatar size="40px" color="primary" text-color="white" class="q-mr-md">
                    <span class="avatar-text">{{ getConversationInitial(selectedConversation) }}</span>
                  </q-avatar>
                  <div class="column">
                    <div class="chat-name">
                      {{ getConversationName(selectedConversation) }}
                    </div>
                    <div v-if="selectedConversation.job" class="chat-job-title">
                      Re: {{ selectedConversation.job.title }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Messages -->
              <q-scroll-area ref="chatScrollArea" class="chat-messages">
                <div v-for="message in messages" :key="message.id" class="message-item q-mb-md">
                  <q-chat-message
                    :name="message.senderId === currentUser?.id ? 'You' : getConversationName(selectedConversation)"
                    :text="[message.content]"
                    :sent="message.senderId === currentUser?.id"
                    :stamp="formatTimeAgo(message.createdAt)"
                    :bg-color="message.senderId === currentUser?.id ? 'primary' : 'grey-3'"
                    :text-color="message.senderId === currentUser?.id ? 'white' : 'dark'"
                  />
                </div>
              </q-scroll-area>

              <!-- Message Input -->
              <div class="message-input">
                <q-input
                  v-model="newMessage"
                  outlined
                  dense
                  placeholder="type a message"
                  @keyup.enter="sendMessage"
                  class="message-text-input"
                >
                  <template v-slot:after>
                    <q-btn
                      round
                      dense
                      flat
                      icon="send"
                      color="primary"
                      @click="sendMessage"
                      :disable="!newMessage.trim()"
                      class="send-btn"
                    />
                  </template>
                </q-input>
              </div>
            </div>

            <!-- No Conversation Selected -->
            <div v-else class="no-conversation-selected">
              <q-icon name="chat_bubble_outline" size="4em" color="grey-4" />
              <div class="text-h6 q-mt-md text-grey-6">Select a conversation</div>
              <div class="text-body2 text-grey-5">Choose from your existing conversations or start a new one</div>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>

  <!-- Broadcast Dialog -->
  <q-dialog v-model="showBroadcastDialog" persistent>
    <q-card style="min-width: 400px">
      <q-card-section class="row items-center">
        <div class="text-h6">Create Broadcast Message</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <q-input
          v-model="broadcastForm.title"
          label="Title"
          outlined
          class="q-mb-md"
        />
        <q-input
          v-model="broadcastForm.content"
          label="Message Content"
          type="textarea"
          outlined
          rows="4"
          class="q-mb-md"
        />
        <q-select
          v-model="broadcastForm.targetAudience"
          :options="[
            { label: 'All Candidates', value: 'all' },
            { label: 'Applied Candidates', value: 'applied' },
            { label: 'Active Conversations', value: 'conversations' }
          ]"
          label="Target Audience"
          outlined
          map-options
          emit-value
          class="q-mb-md"
        />
        <q-input
          v-model="broadcastForm.scheduledFor"
          label="Schedule For (Optional)"
          type="datetime-local"
          outlined
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn
          color="primary"
          label="Send Broadcast"
          @click="sendBroadcast"
          :loading="sendingBroadcast"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
  </div>
</template>

<script>
import { useAuthStore } from 'src/stores/auth.store';
import { messageService } from 'src/services/message.service';
import { formatDistanceToNow } from 'date-fns';
import { useQuasar } from 'quasar';

export default {
  name: 'MessageSidebar',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'notification-read'],
  data() {
    return {
      loading: false,
      conversations: [],
      selectedConversation: null,
      messages: [],
      newMessage: '',
      loadingMessages: false,
      showBroadcastDialog: false,
      sendingBroadcast: false,
      broadcastForm: {
        title: '',
        content: '',
        targetAudience: 'all',
        scheduledFor: ''
      }
    };
  },
  setup() {
    const authStore = useAuthStore();
    const $q = useQuasar();
    return { authStore, $q };
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
        this.loadConversations();
        this.initializeWebSocket();
      } else {
        this.disconnectWebSocket();
      }
    },
    selectedConversation(newConversation, oldConversation) {
      if (oldConversation) {
        // Leave previous conversation room
        messageService.leaveConversation(oldConversation.id);
      }
      if (newConversation) {
        this.loadMessages();
        // Join new conversation room
        messageService.joinConversation(newConversation.id);
      }
    }
  },
  methods: {
    initializeWebSocket() {
      // Set up WebSocket listeners for real-time events
      messageService.setupSocketListeners({
        onNewMessage: this.handleNewMessage,
        onMessageRead: this.handleMessageRead,
        onTyping: this.handleTyping,
        onStopTyping: this.handleStopTyping
      });
    },

    disconnectWebSocket() {
      messageService.disconnectSocket();
    },

    handleNewMessage(message) {
      console.log('Received new message via WebSocket:', message);
      
      // Update conversations list if this message is for a different conversation
      if (!this.selectedConversation || this.selectedConversation.id !== message.conversationId) {
        this.loadConversations();
      } else {
        // Add message to current conversation
        this.messages.push({
          id: message.id,
          content: message.content,
          senderId: message.senderId,
          createdAt: message.createdAt,
          messageType: message.messageType || 'text'
        });
        
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      }
    },

    handleMessageRead(data) {
      console.log('Message read via WebSocket:', data);
      
      // Update conversation unread count
      const conversation = this.conversations.find(c => c.id === data.conversationId);
      if (conversation) {
        conversation.unreadCount = 0;
      }
    },

    handleTyping(data) {
      console.log('User typing:', data);
      // You can implement typing indicators here
    },

    handleStopTyping(data) {
      console.log('User stopped typing:', data);
      // You can implement typing indicators here
    },

    async loadConversations() {
      this.loading = true;
      try {
        const response = await messageService.getConversations();
        if (response.success) {
          this.conversations = response.conversations || [];
        }
      } catch (error) {
        console.error('Failed to load conversations:', error);
        this.$q.notify({
          type: 'negative',
          message: 'Failed to load conversations'
        });
      } finally {
        this.loading = false;
      }
    },
    
    selectConversation(conversation) {
      this.selectedConversation = conversation;
      
      // Mark conversation as read
      if (conversation.unreadCount > 0) {
        this.markConversationAsRead(conversation.id);
        conversation.unreadCount = 0;
        this.$emit('notification-read');
      }
    },
    
    selectConversationById(conversationId) {
      const conversation = this.conversations.find(c => c.id === parseInt(conversationId));
      if (conversation) {
        this.selectConversation(conversation);
      }
    },
    
    async markConversationAsRead(conversationId) {
      try {
        await messageService.markAsRead(conversationId);
      } catch (error) {
        console.error('Failed to mark conversation as read:', error);
      }
    },
    
    async loadMessages() {
      if (!this.selectedConversation) return;
      
      this.loadingMessages = true;
      try {
        const response = await messageService.getMessages(this.selectedConversation.id, 1, 20);
        if (response.success) {
          this.messages = response.messages || [];
          this.$nextTick(() => {
            this.scrollToBottom();
          });
        }
      } catch (error) {
        console.error('Failed to load messages:', error);
        this.$q.notify({
          type: 'negative',
          message: 'Failed to load messages'
        });
      } finally {
        this.loadingMessages = false;
      }
    },
    
    async sendMessage() {
      if (!this.newMessage.trim() || !this.selectedConversation) return;
      
      const messageContent = this.newMessage.trim();
      this.newMessage = '';
      
      try {
        const response = await messageService.sendMessage(
          this.selectedConversation.id,
          messageContent
        );
        
        if (response.success) {
          this.messages.push({
            id: response.message.id,
            content: messageContent,
            senderId: this.currentUser.id,
            createdAt: new Date().toISOString()
          });
          
          this.$nextTick(() => {
            this.scrollToBottom();
          });
        }
      } catch (error) {
        console.error('Failed to send message:', error);
        this.$q.notify({
          type: 'negative',
          message: 'Failed to send message'
        });
      }
    },
    
    scrollToBottom() {
      if (this.$refs.chatScrollArea) {
        this.$refs.chatScrollArea.setScrollPosition('vertical', 999999);
      }
    },
    
    getConversationName(conversation) {
      if (!conversation) return 'Unknown';
      
      const userRole = this.currentUser?.role;
      if (userRole === 'company') {
        return conversation.jobSeeker?.name || conversation.candidateName || 'Unknown Candidate';
      } else {
        return conversation.employer?.name || conversation.employerName || 'Unknown Employer';
      }
    },
    
    getConversationInitial(conversation) {
      const name = this.getConversationName(conversation);
      return name.charAt(0).toUpperCase();
    },
    
    formatTimeAgo(timestamp) {
      if (!timestamp) return '';
      try {
        return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
      } catch {
        return '';
      }
    },

    async sendBroadcast() {
      if (!this.broadcastForm.title.trim() || !this.broadcastForm.content.trim()) {
        this.$q.notify({
          type: 'negative',
          message: 'Please fill in title and content'
        });
        return;
      }

      this.sendingBroadcast = true;
      try {
        // Create broadcast via API
        const broadcastData = {
          title: this.broadcastForm.title,
          content: this.broadcastForm.content,
          targetAudience: this.broadcastForm.targetAudience,
          scheduledFor: this.broadcastForm.scheduledFor || null
        };

        // Send broadcast (you'll need to implement this in your message service)
        const response = await messageService.createBroadcast(broadcastData);
        
        if (response.success) {
          this.$q.notify({
            type: 'positive',
            message: 'Broadcast sent successfully!'
          });
          
          this.showBroadcastDialog = false;
          this.resetBroadcastForm();
          this.loadConversations(); // Refresh conversations
        } else {
          throw new Error(response.message || 'Failed to send broadcast');
        }
      } catch (error) {
        console.error('Error sending broadcast:', error);
        this.$q.notify({
          type: 'negative',
          message: error.message || 'Failed to send broadcast'
        });
      } finally {
        this.sendingBroadcast = false;
      }
    },

    resetBroadcastForm() {
      this.broadcastForm = {
        title: '',
        content: '',
        targetAudience: 'all',
        scheduledFor: ''
      };
    }
  }
};
</script>

<style scoped>.message-sidebar-dialog {
  --dialog-width: 1100px;
  z-index: 9999;
  top: 20px !important;
  transform: translateY(-20px) !important;
}

.message-sidebar-dialog .q-dialog__inner {
  padding: 0;
}

.message-sidebar-card {
  width: var(--dialog-width) !important;
  max-width: 100vw;
  height: 100vh;
  max-height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border-radius: 0;
  box-shadow: -6px 0 32px rgba(0, 0, 0, 0.15);
}

/* Header */
.message-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 28px 32px;
  position: sticky;
  top: 0;
  z-index: 2000;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
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

.close-btn {
  color: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
}

.close-btn:hover {
  color: white;
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(90deg) scale(1.1);
}

/* Content */
.messages-content {
  flex: 1;
  padding: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.messages-layout {
  height: 100%;
  overflow: hidden;
  display: flex !important;
  flex-direction: row !important;
  width: 100% !important;
  min-width: 1000px !important;
}

/* Left Panel: Conversations */
.conversations-panel {
  width: 380px !important;
  min-width: 380px !important;
  max-width: 380px !important;
  border-right: 2px solid #e8eaf6;
  display: flex;
  flex-direction: column;
  background: linear-gradient(to bottom, #fafafa 0%, #f5f5f5 100%);
  flex-shrink: 0 !important;
  flex-grow: 0 !important;
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.05);
}

.conversations-header {
  padding: 20px 24px;
  border-bottom: 2px solid #e8eaf6;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.conversations-header .text-h6 {
  color: #2c3e50;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.3px;
}

.conversations-header .q-btn {
  transition: all 0.3s ease;
}

.conversations-header .q-btn:hover {
  transform: scale(1.1);
  background: rgba(102, 126, 234, 0.1);
}

.conversations-list-container {
  flex: 1;
  overflow: hidden;
}

.conversations-scroll {
  height: 100%;
}

.conversations-list {
  padding: 8px 0;
}

.conversation-item {
  min-height: 100px;
  padding: 20px 24px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  background: white;
  margin: 0 8px 8px 8px;
  border-radius: 12px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.conversation-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transition: width 0.3s ease;
}

.conversation-item:hover {
  background: linear-gradient(to right, rgba(102, 126, 234, 0.06), rgba(118, 75, 162, 0.04));
  transform: translateX(-4px);
  box-shadow: 4px 0 16px rgba(102, 126, 234, 0.15);
}

.conversation-item:hover::before {
  width: 4px;
}

.conversation-selected {
  background: linear-gradient(to right, rgba(102, 126, 234, 0.12), rgba(118, 75, 162, 0.08)) !important;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.2) !important;
  border-left: 5px solid #667eea;
}

.conversation-selected::before {
  width: 5px;
}

.conversation-unread {
  background: linear-gradient(to right, rgba(255, 152, 0, 0.08), rgba(255, 193, 7, 0.04));
  border-left: 4px solid #ff9800;
  box-shadow: 0 2px 8px rgba(255, 152, 0, 0.15);
}

.conversation-unread:hover {
  background: linear-gradient(to right, rgba(255, 152, 0, 0.12), rgba(255, 193, 7, 0.06));
}

.avatar-text {
  font-size: 20px;
  font-weight: 700;
}

.q-avatar {
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.conversation-item:hover .q-avatar {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.conversation-name {
  font-size: 17px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 6px;
  letter-spacing: 0.2px;
}

.last-message {
  font-size: 14px;
  color: #6c757d;
  margin-bottom: 6px;
  line-height: 1.5;
  font-weight: 400;
}

.message-time {
  font-size: 12px;
  color: #95a5a6;
  font-weight: 500;
}

.unread-badge {
  font-size: 12px;
  font-weight: 700;
  padding: 5px 10px;
  box-shadow: 0 4px 8px rgba(244, 67, 54, 0.4);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

/* Right Panel: Chat */
.chat-panel {
  flex: 1 1 auto !important;
  min-width: 600px !important;
  width: calc(100% - 380px) !important;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  overflow: hidden;
  flex-shrink: 0 !important;
}

.chat-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-header {
  padding: 20px 28px;
  border-bottom: 2px solid #e8eaf6;
  background: linear-gradient(to right, #ffffff, #fafafa);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  flex-shrink: 0;
}

.chat-name {
  font-size: 18px;
  font-weight: 700;
  color: #2c3e50;
  letter-spacing: 0.3px;
}

.chat-job-title {
  font-size: 13px;
  color: #667eea;
  margin-top: 4px;
  font-weight: 500;
}

.chat-messages {
  flex: 1;
  background: linear-gradient(to bottom, #f8f9fa 0%, #ffffff 100%);
  padding: 24px;
  position: relative;
  overflow-y: auto;
  min-height: 0;
}

.chat-messages::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100px;
  background: linear-gradient(to bottom, rgba(102, 126, 234, 0.03), transparent);
  pointer-events: none;
}

.message-input {
  padding: 20px 28px;
  background: white;
  border-top: 2px solid #e8eaf6;
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.08);
  flex-shrink: 0;
  position: relative;
  z-index: 10;
}

.no-conversation-selected {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
  padding: 40px;
}

.no-conversation-selected .q-icon {
  color: #c5cae9;
}

.no-conversation-selected .text-h6 {
  font-weight: 600;
  color: #5f6368;
  margin-top: 20px;
}

.no-conversation-selected .text-body2 {
  color: #95a5a6;
  margin-top: 8px;
  max-width: 400px;
}

.loading-section {
  padding: 80px 32px;
  text-align: center;
  color: var(--q-color-grey-6);
}

.empty-state {
  padding: 100px 32px;
  text-align: center;
  color: var(--q-color-grey-6);
}

.empty-state .q-icon {
  color: #c5cae9;
}

.empty-state .text-body2 {
  font-weight: 600;
  color: #5f6368;
  margin-top: 16px;
}

.empty-state .text-caption {
  color: #95a5a6;
  margin-top: 8px;
}

/* Message Input Styles */
.message-text-input {
  font-size: 15px;
}

.message-text-input :deep(.q-field__control) {
  border-radius: 28px;
  padding: 10px 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 2px solid #e8eaf6;
  transition: all 0.3s ease;
}

.message-text-input :deep(.q-field__control):hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
}

.message-text-input :deep(.q-field__control--focused) {
  border-color: #667eea;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.25);
}

.send-btn {
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  margin-left: 12px;
}

.send-btn:hover {
  transform: scale(1.15) rotate(-10deg);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.send-btn:not([disabled]):active {
  transform: scale(0.95);
}

.send-btn[disabled] {
  opacity: 0.5;
  background: #bdbdbd;
}

/* Mobile Responsive */
@media (max-width: 1200px) {
  .message-sidebar-card {
    width: 1000px;
  }
  
  .conversations-panel {
    width: 350px !important;
    min-width: 350px !important;
    max-width: 350px !important;
  }
  
  .chat-panel {
    width: calc(100% - 350px) !important;
  }
}

@media (max-width: 1024px) {
  .message-sidebar-card {
    width: 900px;
  }
  
  .conversations-panel {
    width: 320px !important;
    min-width: 320px !important;
    max-width: 320px !important;
  }
  
  .chat-panel {
    width: calc(100% - 320px) !important;
    min-width: 550px !important;
  }
}

@media (max-width: 768px) {
  .message-sidebar-card {
    width: 100vw;
    height: 100vh;
    max-height: 100vh;
  }
  
  .conversations-panel {
    width: 300px !important;
    min-width: 300px !important;
    max-width: 300px !important;
  }
  
  .message-header {
    padding: 20px 16px;
  }
  
  .title-text {
    font-size: 20px;
  }
  
  .header-icon {
    font-size: 28px;
  }
  
  .conversation-item {
    padding: 16px;
    min-height: 85px;
  }
  
  .chat-header {
    padding: 16px 20px;
  }
  
  .chat-messages {
    padding: 16px;
  }
  
  .message-input {
    padding: 16px 20px;
  }
}

@media (max-width: 600px) {
  .messages-layout {
    flex-direction: column !important;
  }
  
  .conversations-panel {
    width: 100% !important;
    min-width: 100% !important;
    max-width: 100% !important;
    height: 350px;
    border-right: none;
    border-bottom: 2px solid #e8eaf6;
  }
  
  .chat-panel {
    width: 100% !important;
    min-width: 100% !important;
    height: calc(100% - 350px);
  }
  
  .conversation-item {
    min-height: 75px;
    padding: 12px 16px;
    margin: 0 4px 6px 4px;
  }
}

/* Scrollbar Styling */
.conversations-scroll :deep(.q-scrollarea__content),
.chat-messages :deep(.q-scrollarea__content) {
  padding: 8px 0;
}

::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: #f1f3f5;
  border-radius: 5px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 5px;
  border: 2px solid #f1f3f5;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%);
}

/* Animations */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(25px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.conversation-item {
  animation: slideIn 0.3s ease-out;
}

.message-item {
  max-width: 100%;
  animation: slideUp 0.3s ease-out;
}

/* Chat Message Customization */
.chat-messages :deep(.q-message-text) {
  padding: 14px 18px;
  border-radius: 18px;
  font-size: 15px;
  line-height: 1.6;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.12);
  max-width: 70%;
  word-wrap: break-word;
}

.chat-messages :deep(.q-message-sent .q-message-text) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.chat-messages :deep(.q-message-received .q-message-text) {
  background: white;
  color: #2c3e50;
  border: 2px solid #e8eaf6;
}

.chat-messages :deep(.q-message-name) {
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 6px;
  opacity: 0.9;
  letter-spacing: 0.3px;
}

.chat-messages :deep(.q-message-stamp) {
  font-size: 11px;
  opacity: 0.7;
  font-weight: 500;
  margin-top: 4px;
}

.chat-messages :deep(.q-message-avatar) {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Broadcast Button Styling */
.conversations-header .q-btn[aria-label*="Broadcast"],
.conversations-header .q-btn[aria-label*="Create"] {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.conversations-header .q-btn[aria-label*="Broadcast"]:hover,
.conversations-header .q-btn[aria-label*="Create"]:hover {
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  transform: scale(1.15);
}

/* Enhanced Focus States */
.conversation-item:focus-visible {
  outline: 3px solid #667eea;
  outline-offset: -3px;
}

.q-btn:focus-visible {
  outline: 2px solid #667eea;
  outline-offset: 2px;
}

/* Loading Animation */
.loading-section .q-spinner {
  animation: fadeIn 0.3s ease-in;
}
</style>