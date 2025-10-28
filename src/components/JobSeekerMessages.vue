<template>
  <div class="jobseeker-messages">
    <div class="content-area row no-wrap full-height">
      <!-- Conversations List -->
      <div class="conversation-list column">
        <div class="list-header q-pa-md row justify-between items-center">
          <div class="text-h6 text-weight-bold content-title">Messages</div>
          <q-btn round flat icon="refresh" color="primary" @click="loadConversations">
            <q-tooltip>Refresh</q-tooltip>
          </q-btn>
        </div>
        
        <!-- Active Broadcasts Section -->
        <div v-if="activeBroadcasts.length > 0" class="broadcast-section">
          <div class="broadcast-header q-pa-sm text-body2 text-weight-medium text-primary">
            Company Announcements
          </div>
          <q-list separator>
            <q-item v-for="broadcast in activeBroadcasts" :key="broadcast.id" 
                    clickable @click="viewBroadcast(broadcast)" class="broadcast-item">
              <q-item-section avatar>
                <q-avatar color="orange" text-color="white" icon="campaign" />
              </q-item-section>
              <q-item-section>
                <q-item-label lines="1">{{ broadcast.title }}</q-item-label>
                <q-item-label caption lines="2">{{ broadcast.content }}</q-item-label>
              </q-item-section>
              <q-item-section side top>
                <q-item-label caption>{{ formatTimeAgo(broadcast.createdAt) }}</q-item-label>
                <q-badge v-if="!broadcast.isRead" color="orange" rounded floating />
              </q-item-section>
            </q-item>
          </q-list>
          <q-separator />
        </div>

        <q-scroll-area class="col">
          <div v-if="loading" class="q-pa-md text-center">
            <q-spinner color="primary" size="3em" />
            <div class="text-body2 q-mt-md">Loading conversations...</div>
          </div>
          <q-list v-else separator>
            <q-item v-for="convo in conversations" :key="convo.id" clickable v-ripple
              @click="selectConversation(convo)" :active="selectedConversation?.id === convo.id"
              active-class="selected-convo">
              <q-item-section avatar>
                <q-avatar color="blue-grey-2" text-color="primary">
                  <img v-if="convo.profilePicture" :src="convo.profilePicture" alt="Profile" />
                  <span v-else>{{ (convo.employerName || convo.participantName || 'Unknown')?.charAt(0)?.toUpperCase() || 'U' }}</span>
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label lines="1">{{ convo.employerName || convo.participantName || 'Unknown Employer' }}</q-item-label>
                <q-item-label v-if="convo.jobTitle" class="text-caption text-grey-6" lines="1">
                  Re: {{ convo.jobTitle }}
                </q-item-label>
                <q-item-label caption lines="1">{{ convo.lastMessage?.content || 'No messages yet' }}</q-item-label>
              </q-item-section>
              <q-item-section side top>
                <q-item-label caption>{{ formatTimeAgo(convo.lastMessage?.createdAt || convo.lastMessageTime) }}</q-item-label>
                <q-badge v-if="convo.unread" color="negative" rounded floating />
              </q-item-section>
            </q-item>
            
            <!-- Start New Conversation Button -->
            <q-item clickable @click="showNewConversationDialog = true" class="new-conversation-item">
              <q-item-section avatar>
                <q-avatar color="primary" text-color="white" icon="add" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Start New Conversation</q-item-label>
                <q-item-label caption>Message an employer about a job</q-item-label>
              </q-item-section>
            </q-item>
            
            <div v-if="conversations.length === 0" class="q-pa-md text-center text-grey-6">
              <q-icon name="chat" size="3em" />
              <div class="text-body2 q-mt-md">No conversations yet</div>
              <div class="text-caption">Start messaging employers about jobs you're interested in!</div>
            </div>
          </q-list>
        </q-scroll-area>
      </div>

      <!-- Chat Window -->
      <div class="chat-window column" v-if="selectedConversation">
        <div class="chat-header q-pa-md row items-center">
          <q-avatar color="primary" text-color="white" size="md" class="q-mr-md">
            <img v-if="selectedConversation.profilePicture" :src="selectedConversation.profilePicture" alt="Profile" />
            <span v-else>{{ (selectedConversation.employerName || selectedConversation.participantName || 'Unknown')?.charAt(0)?.toUpperCase() || 'U' }}</span>
          </q-avatar>
          <div>
            <div class="text-h6">{{ selectedConversation.employerName || selectedConversation.participantName || 'Unknown Employer' }}</div>
            <div v-if="selectedConversation.jobTitle" class="text-caption text-grey-6">
              Regarding: {{ selectedConversation.jobTitle }}
            </div>
          </div>
        </div>
        <q-scroll-area ref="chatScrollArea" class="col chat-messages q-pa-md">
          <div v-for="(msg, i) in selectedConversation.messages" :key="i" class="message-wrapper">
            <q-chat-message 
              :name="msg.sender === 'jobseeker' ? 'You' : (selectedConversation.employerName || selectedConversation.participantName || 'Unknown Employer')"
              :text="[msg.text]" 
              :sent="msg.sender === 'jobseeker'" 
              :stamp="formatTimeAgo(msg.timestamp)"
              :class="{ 'my-message': msg.sender === 'jobseeker', 'other-message': msg.sender !== 'jobseeker' }"
            />
            <!-- Debug info (remove in production) -->
            <div v-if="false" class="debug-info text-caption text-grey-6">
              Sender: {{ msg.sender }} | SenderId: {{ msg.senderId }} | Sent: {{ msg.sender === 'jobseeker' }}
            </div>
          </div>
        </q-scroll-area>
        <div class="chat-input-area q-pa-md">
          <q-input outlined v-model="newMessage" placeholder="Type a message..." @keyup.enter="sendMessage" dense>
            <template v-slot:after>
              <q-btn round dense flat icon="send" color="primary" @click="sendMessage" />
            </template>
          </q-input>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="chat-window column flex flex-center text-center text-grey-6">
        <q-icon name="chat" size="5rem" />
        <div class="text-h6 q-mt-md">Select a conversation to start chatting</div>
        <div class="text-body2 q-mt-sm">Or start a new conversation with an employer</div>
      </div>
    </div>

    <!-- New Conversation Dialog -->
    <q-dialog v-model="showNewConversationDialog">
      <q-card style="width: 500px">
        <q-card-section>
          <div class="text-h6">Start New Conversation</div>
          <div class="text-caption">Message an employer about a specific job</div>
        </q-card-section>
        <q-card-section class="q-gutter-y-md">
          <q-select 
            v-model="newConversationForm.jobId" 
            outlined 
            label="Select Job"
            :options="availableJobs"
            option-label="title"
            option-value="id"
            emit-value
            map-options
            use-input
            @filter="filterJobs"
          >
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section>
                  <q-item-label>{{ scope.opt.title }}</q-item-label>
                  <q-item-label caption>{{ scope.opt.companyName }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-input 
            v-model="newConversationForm.message" 
            type="textarea" 
            outlined 
            label="Initial Message" 
            rows="4"
            placeholder="Hi, I'm interested in this position. Could you tell me more about..." />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn color="primary" label="Start Conversation" @click="startNewConversation" 
                 :loading="creatingConversation" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Broadcast Dialog -->
    <q-dialog v-model="showBroadcastDialog">
      <q-card style="width: 500px">
        <q-card-section>
          <div class="text-h6">{{ selectedBroadcast?.title }}</div>
          <div class="text-caption">From {{ selectedBroadcast?.companyName }}</div>
        </q-card-section>
        <q-card-section>
          <div class="text-body1">{{ selectedBroadcast?.content }}</div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Close" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useQuasar } from 'quasar';
import { authHelpers } from 'src/services/auth.service';
import messageService from 'src/services/message.service';

const $q = useQuasar();

const selectedConversation = ref(null);
const newMessage = ref('');
const chatScrollArea = ref(null);
const showNewConversationDialog = ref(false);
const showBroadcastDialog = ref(false);
const selectedBroadcast = ref(null);
const currentUser = authHelpers.getCurrentUser();
const conversations = ref([]);
const activeBroadcasts = ref([]);
const availableJobs = ref([]);
const allJobs = ref([]); // Store original list for filtering
const loading = ref(false);
const creatingConversation = ref(false);

const newConversationForm = ref({
  jobId: null,
  message: ''
});

onMounted(async () => {
  await Promise.all([
    loadConversations(),
    loadActiveBroadcasts(),
    loadAvailableJobs()
  ]);
});

const loadConversations = async () => {
  loading.value = true;
  try {
    const result = await messageService.getConversations();
    if (result.success) {
      conversations.value = result.conversations.map(conv => ({
        id: conv.id,
        employerId: conv.participantId || conv.employerId,
        employerName: conv.participantName || conv.employerName,
        participantName: conv.participantName,
        jobId: conv.jobId,
        jobTitle: conv.jobTitle,
        unread: conv.unread || conv.unreadCount > 0,
        lastMessage: conv.lastMessage,
        lastMessageTime: conv.lastMessageTime || conv.lastMessageAt,
        messages: []
      }));
    } else {
      $q.notify({ type: 'negative', message: result.error });
    }
  } catch (error) {
    console.error('Error loading conversations:', error);
    $q.notify({ type: 'negative', message: 'Failed to load conversations' });
  } finally {
    loading.value = false;
  }
};

const loadActiveBroadcasts = async () => {
  try {
    const result = await messageService.getActiveBroadcasts();
    if (result.success) {
      activeBroadcasts.value = result.broadcasts.map(broadcast => ({
        ...broadcast,
        isRead: false // TODO: Track read status
      }));
    }
  } catch (error) {
    console.error('Error loading broadcasts:', error);
  }
};

const loadAvailableJobs = async () => {
  try {
    // TODO: Replace with actual job service call
    const jobs = [
      { id: 1, title: 'Frontend Developer', companyName: 'Tech Corp', employerId: 1 },
      { id: 2, title: 'UI/UX Designer', companyName: 'Design Studio', employerId: 2 },
      { id: 3, title: 'Full Stack Developer', companyName: 'Startup Inc', employerId: 3 }
    ];
    allJobs.value = [...jobs]; // Store original list
    availableJobs.value = [...jobs]; // Display list
  } catch (error) {
    console.error('Error loading jobs:', error);
  }
};

const selectConversation = async (convo) => {
  selectedConversation.value = convo;
  
  // Mark as read
  if (convo.unread) {
    await messageService.markAsRead(convo.id);
    convo.unread = false;
  }
  
  // Load messages for this conversation
  try {
    const result = await messageService.getMessages(convo.id);
    if (result.success) {
      console.log('Current user:', currentUser);
      console.log('Messages from API:', result.messages);
      
      convo.messages = result.messages.map(msg => {
        const isCurrentUser = msg.senderId === currentUser?.id;
        console.log(`Message ${msg.id}: senderId=${msg.senderId}, currentUserId=${currentUser?.id}, isCurrentUser=${isCurrentUser}`);
        
        return {
          sender: isCurrentUser ? 'jobseeker' : 'employer',
          text: msg.content || msg.text,
          timestamp: msg.createdAt || msg.timestamp,
          senderId: msg.senderId
        };
      });
      
      console.log('Mapped messages:', convo.messages);
    }
  } catch (error) {
    console.error('Error loading messages:', error);
  }
  
  scrollToBottom();
};

const sendMessage = async () => {
  if (!newMessage.value.trim() || !selectedConversation.value) return;
  
  try {
    const result = await messageService.sendMessage(
      selectedConversation.value.id,
      newMessage.value
    );
    
    if (result.success) {
      selectedConversation.value.messages.push({
        sender: 'jobseeker',
        text: newMessage.value,
        timestamp: new Date().toISOString()
      });
      newMessage.value = '';
      scrollToBottom();
    } else {
      $q.notify({ type: 'negative', message: result.error });
    }
  } catch (error) {
    console.error('Error sending message:', error);
    $q.notify({ type: 'negative', message: 'Failed to send message' });
  }
};

const startNewConversation = async () => {
  if (!newConversationForm.value.jobId || !newConversationForm.value.message.trim()) {
    $q.notify({ type: 'negative', message: 'Please select a job and enter a message' });
    return;
  }

  creatingConversation.value = true;
  try {
    const selectedJob = availableJobs.value.find(job => job.id === newConversationForm.value.jobId);
    const result = await messageService.createConversation(
      selectedJob.employerId,
      newConversationForm.value.jobId,
      newConversationForm.value.message
    );
    
    if (result.success) {
      await loadConversations();
      showNewConversationDialog.value = false;
      newConversationForm.value = { jobId: null, message: '' };
      $q.notify({ type: 'positive', message: 'Conversation started successfully!' });
      
      // Select the new conversation
      const newConvo = conversations.value.find(c => c.id === result.conversation.id);
      if (newConvo) selectConversation(newConvo);
    } else {
      $q.notify({ type: 'negative', message: result.error });
    }
  } catch (error) {
    console.error('Error starting conversation:', error);
    $q.notify({ type: 'negative', message: 'Failed to start conversation' });
  } finally {
    creatingConversation.value = false;
  }
};

const viewBroadcast = async (broadcast) => {
  selectedBroadcast.value = broadcast;
  showBroadcastDialog.value = true;
  
  // Mark as read
  if (!broadcast.isRead) {
    await messageService.markBroadcastAsRead(broadcast.id);
    broadcast.isRead = true;
  }
};

const filterJobs = (val, update) => {
  update(() => {
    if (val === '') {
      availableJobs.value = [...allJobs.value]; // Reset to original list
    } else {
      const needle = val.toLowerCase();
      availableJobs.value = allJobs.value.filter(job => 
        job.title.toLowerCase().includes(needle) || 
        job.companyName.toLowerCase().includes(needle)
      );
    }
  });
};

const scrollToBottom = () => {
  nextTick(() => {
    if (chatScrollArea.value) {
      chatScrollArea.value.setScrollPercentage('vertical', 1, 300);
    }
  });
};

const formatTimeAgo = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};
</script>

<style scoped>
.jobseeker-messages {
  height: 100vh;
  background-color: #f4f8fa;
}

.content-area {
  height: 100%;
}

.conversation-list {
  width: 400px;
  min-width: 400px;
  background-color: #fff;
  border-right: 1px solid #e0e0e0;
}

.list-header {
  border-bottom: 1px solid #e0e0e0;
  background-color: #f8f9fa;
}

.broadcast-section {
  border-bottom: 1px solid #e0e0e0;
}

.broadcast-header {
  background-color: #fff3e0;
  border-bottom: 1px solid #ffcc02;
}

.broadcast-item {
  background-color: #fffbf0;
}

.broadcast-item:hover {
  background-color: #fff8e1;
}

.selected-convo {
  background-color: #e3f2fd;
}

.new-conversation-item {
  background-color: #f0f8ff;
  border-top: 1px solid #e3f2fd;
}

.new-conversation-item:hover {
  background-color: #e6f3ff;
}

.chat-window {
  flex-grow: 1;
}

.chat-header {
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
}

.chat-messages {
  background-color: #f4f8fa;
}

/* Message alignment fixes */
.message-wrapper {
  margin-bottom: 8px;
}

/* Your messages (right side) - sent messages */
.my-message .q-message-container {
  flex-direction: row-reverse;
}

.my-message .q-message-text {
  background-color: #1976d2 !important;
  color: white !important;
}

/* Other person's messages (left side) - received messages */
.other-message .q-message-text {
  background-color: #e0e0e0 !important;
  color: #333 !important;
}

/* Debug info styling */
.debug-info {
  text-align: center;
  padding: 2px 0;
  margin: 2px 0;
  background: rgba(255, 255, 0, 0.1);
  border-radius: 4px;
}

.chat-input-area {
  background-color: #fff;
  border-top: 1px solid #e0e0e0;
}

.content-title {
  color: #1976d2;
}
</style>