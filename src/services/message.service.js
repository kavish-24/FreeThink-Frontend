import api from './auth.service.js';
import socketService from './socket.service.js';

export const messageService = {
  // WebSocket connection management
  socket: null,
  isInitialized: false,
  currentConversationId: null,

  initializeSocket() {
    if (this.isInitialized) return;

    this.socket = socketService.connect();
    this.isInitialized = true;
    console.log('Message service WebSocket initialized');
  },

  disconnectSocket() {
    if (this.socket) {
      if (this.currentConversationId) {
        this.leaveConversation(this.currentConversationId);
      }
      socketService.disconnect();
      this.socket = null;
      this.isInitialized = false;
      this.currentConversationId = null;
    }
  },
  async getConversations() {
    try {
      console.log('Fetching conversations...');
      const response = await api.get('/messages/conversations');
      console.log('Conversations fetched successfully:', response.data);
      
      // Map backend response to frontend expected format
      const mappedConversations = response.data.conversations?.map(conv => ({
        id: conv.id,
        title: conv.title,
        // Map participant name to both possible fields for compatibility
        participantName: conv.participant?.name,
        employerName: conv.participant?.name, // For job seeker view
        candidateName: conv.participant?.name, // For employer view
        participantId: conv.participant?.id,
        participantEmail: conv.participant?.email,
        // Job information
        jobId: conv.job?.id,
        jobTitle: conv.job?.title,
        jobLocation: conv.job?.location,
        // Message information
        lastMessage: conv.lastMessage?.content || 'No messages yet',
        lastMessageTime: conv.lastMessage?.createdAt || conv.lastMessageAt,
        lastMessageAt: conv.lastMessage?.createdAt || conv.lastMessageAt,
        senderId: conv.lastMessage?.senderId,
        messageType: conv.lastMessage?.messageType,
        // Status and counts
        unread: conv.unreadCount > 0,
        unreadCount: conv.unreadCount || 0,
        status: conv.status,
        // Initialize empty messages array
        messages: []
      })) || [];
      
      console.log('Mapped conversations:', mappedConversations);
      
      return {
        success: true,
        conversations: mappedConversations
      };
    } catch (error) {
      console.error('Error fetching conversations:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      return {
        success: false,
        error: error.response?.data?.message || `Failed to fetch conversations: ${error.message}`,
        status: error.response?.status,
        details: error.response?.data
      };
    }
  },

  async createConversation(participantId, jobId = null, initialMessage = '') {
    try {
      console.log('Creating conversation with:', { participantId, jobId, initialMessage });
      const response = await api.post('/messages/conversations', {
        participantId,
        jobId,
        initialMessage
      });
      console.log('Conversation created successfully:', response.data);
      
      // Map the response to frontend expected format
      const mappedConversation = response.data.conversation ? {
        id: response.data.conversation.id,
        title: response.data.conversation.title,
        participantName: response.data.conversation.participant?.name,
        employerName: response.data.conversation.participant?.name,
        candidateName: response.data.conversation.participant?.name,
        participantId: response.data.conversation.participant?.id,
        participantEmail: response.data.conversation.participant?.email,
        jobId: response.data.conversation.job?.id,
        jobTitle: response.data.conversation.job?.title,
        jobLocation: response.data.conversation.job?.location,
        lastMessage: response.data.conversation.lastMessage?.content || initialMessage,
        lastMessageTime: response.data.conversation.lastMessage?.createdAt || response.data.conversation.lastMessageAt,
        lastMessageAt: response.data.conversation.lastMessage?.createdAt || response.data.conversation.lastMessageAt,
        unread: response.data.conversation.unreadCount > 0,
        unreadCount: response.data.conversation.unreadCount || 0,
        status: response.data.conversation.status,
        messages: []
      } : null;
      
      return {
        success: true,
        conversation: mappedConversation
      };
    } catch (error) {
      console.error('Error creating conversation:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      return {
        success: false,
        error: error.response?.data?.message || `Failed to create conversation: ${error.message}`,
        status: error.response?.status,
        details: error.response?.data
      };
    }
  },

  async deleteConversation(conversationId) {
    try {
      await api.delete(`/messages/conversations/${conversationId}`);
      return { success: true };
    } catch (error) {
      console.error('Error deleting conversation:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete conversation'
      };
    }
  },

  // Message methods
  async getMessages(conversationId, page = 1, limit = 50) {
    try {
      const response = await api.get(`/messages/conversations/${conversationId}/messages`, {
        params: { page, limit }
      });
      
      // Map backend message format to frontend expected format
      const mappedMessages = response.data.messages?.map(msg => ({
        id: msg.id,
        text: msg.content,
        content: msg.content,
        sender: msg.senderId === msg.currentUserId ? 'jobseeker' : 'employer', // This might need adjustment based on your user type detection
        senderId: msg.senderId,
        timestamp: msg.createdAt,
        createdAt: msg.createdAt,
        messageType: msg.messageType || 'text',
        attachmentUrl: msg.attachmentUrl
      })) || [];
      
      return {
        success: true,
        messages: mappedMessages,
        pagination: response.data.pagination
      };
    } catch (error) {
      console.error('Error fetching messages:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch messages'
      };
    }
  },

  async sendMessage(conversationId, content, messageType = 'text', attachmentUrl = null) {
    try {
      const response = await api.post('/messages/messages', {
        conversationId,
        content,
        messageType,
        attachmentUrl
      });
      
      // Map the response message to frontend format
      const mappedMessage = response.data.message ? {
        id: response.data.message.id,
        text: response.data.message.content,
        content: response.data.message.content,
        sender: 'jobseeker', // Assume current user is sending
        senderId: response.data.message.senderId,
        timestamp: response.data.message.createdAt,
        createdAt: response.data.message.createdAt,
        messageType: response.data.message.messageType || 'text',
        attachmentUrl: response.data.message.attachmentUrl
      } : null;
      
      return {
        success: true,
        message: mappedMessage
      };
    } catch (error) {
      console.error('Error sending message:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to send message'
      };
    }
  },

  async markAsRead(conversationId) {
    try {
      await api.put(`/messages/conversations/${conversationId}/read`);
      return { success: true };
    } catch (error) {
      console.error('Error marking messages as read:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to mark messages as read'
      };
    }
  },

  // Get unread message count
  async getUnreadCount() {
    try {
      const response = await api.get('/messages/unread-count');
      return {
        success: true,
        count: response.data.count || response.data.unreadCount || 0
      };
    } catch (error) {
      console.error('Error fetching unread count:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch unread count',
        count: 0
      };
    }
  },

  // Real-time connection methods
  setupSocketListeners(callbacks) {
    if (!this.socket) {
      this.initializeSocket();
    }

    if (!this.socket) return;

    this.socket.on('new_message', (message) => {
      console.log('Received new message via WebSocket:', message);
      callbacks.onNewMessage?.(message);
    });

    this.socket.on('message_read', (data) => {
      console.log('Received message read via WebSocket:', data);
      callbacks.onMessageRead?.(data);
    });

    this.socket.on('typing', (data) => {
      callbacks.onTyping?.(data);
    });

    this.socket.on('stop_typing', (data) => {
      callbacks.onStopTyping?.(data);
    });
  },

  joinConversation(conversationId) {
    if (!this.socket) {
      this.initializeSocket();
    }

    if (this.socket && conversationId) {
      this.socket.emit('join_conversation', { conversationId });
      this.currentConversationId = conversationId;
      console.log('Joined conversation:', conversationId);
    }
  },

  leaveConversation(conversationId) {
    if (this.socket && conversationId) {
      this.socket.emit('leave_conversation', { conversationId });
      if (this.currentConversationId === conversationId) {
        this.currentConversationId = null;
      }
      console.log('Left conversation:', conversationId);
    }
  },

  emitTyping(conversationId) {
    if (this.socket && conversationId) {
      this.socket.emit('typing', { conversationId });
    }
  },

  emitStopTyping(conversationId) {
    if (this.socket && conversationId) {
      this.socket.emit('stop_typing', { conversationId });
    }
  },

  // Broadcast methods
  async createBroadcast(broadcastData) {
    try {
      const response = await api.post('/broadcasts', broadcastData);
      return {
        success: true,
        broadcast: response.data.broadcast
      };
    } catch (error) {
      console.error('Error creating broadcast:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create broadcast'
      };
    }
  },

  async getBroadcasts(page = 1, limit = 20, status = null) {
    try {
      const params = { page, limit };
      if (status) params.status = status;
      
      const response = await api.get('/broadcasts', { params });
      return {
        success: true,
        broadcasts: response.data.broadcasts,
        pagination: response.data.pagination
      };
    } catch (error) {
      console.error('Error fetching broadcasts:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch broadcasts'
      };
    }
  },

  async getActiveBroadcasts() {
    try {
      const response = await api.get('/broadcasts/active');
      return {
        success: true,
        broadcasts: response.data.broadcasts
      };
    } catch (error) {
      console.error('Error fetching active broadcasts:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch active broadcasts'
      };
    }
  },

  async updateBroadcast(id, updates) {
    try {
      const response = await api.put(`/broadcasts/${id}`, updates);
      return {
        success: true,
        broadcast: response.data.broadcast
      };
    } catch (error) {
      console.error('Error updating broadcast:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update broadcast'
      };
    }
  },

  async deleteBroadcast(id) {
    try {
      await api.delete(`/broadcasts/${id}`);
      return { success: true };
    } catch (error) {
      console.error('Error deleting broadcast:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete broadcast'
      };
    }
  },

  async markBroadcastAsRead(id) {
    try {
      await api.post(`/broadcasts/${id}/read`);
      return { success: true };
    } catch (error) {
      console.error('Error marking broadcast as read:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to mark broadcast as read'
      };
    }
  }
};

export default messageService;