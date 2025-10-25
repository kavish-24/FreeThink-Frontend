<template>
<AppHeader class="sticky-header" />
  <div class="page-wrapper row no-wrap">
    <div class="sidebar">
      <div class="sidebar-section logo-section flex items-center q-gutter-sm q-pa-md">
        <q-avatar icon="business_center" color="white" text-color="primary" />
        <div>
          <div class="text-h6 text-white">JobHub</div>
          <div class="text-caption text-blue-grey-3">Employer Portal</div>
        </div>
      </div>
      <div class="sidebar-section q-pt-sm q-pb-none q-px-md">
        <div class="text-subtitle1 text-weight-medium text-white">{{ currentUser.name }}</div>
        <div class="text-caption text-blue-grey-4">{{ currentUser.email }}</div>
      </div>
      <div class="sidebar-section q-pt-md q-pb-none">
        <q-list class="nav-list">
          <q-item v-for="link in links" :key="link.label" :active="selected === link.label" active-class="active-link"
            clickable v-ripple @click="navigate(link)">
            <q-item-section avatar><q-icon :name="link.icon" /></q-item-section>
            <q-item-section>{{ link.label }}</q-item-section>
          </q-item>
        </q-list>
      </div>

    </div>

    <div class="content-area row no-wrap full-height">
      <div class="conversation-list column">
        <div class="list-header q-pa-md row justify-between items-center">
          <div class="text-h6 text-weight-bold content-title">Conversations</div>
          <q-btn round flat icon="campaign" color="primary" @click="showBroadcastDialog = true">
            <q-tooltip>Create Broadcast</q-tooltip>
          </q-btn>
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
                  {{ (convo.candidateName || convo.participantName || 'Unknown')?.charAt(0)?.toUpperCase() || 'U' }}
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label lines="1">{{ convo.candidateName || convo.participantName || 'Unknown Candidate' }}</q-item-label>
                <q-item-label caption lines="1">{{ convo.lastMessage || 'No messages yet' }}</q-item-label>
              </q-item-section>
              <q-item-section side top>
                <q-item-label caption>{{ formatTimeAgo(convo.lastMessageTime) }}</q-item-label>
                <q-badge v-if="convo.unread" color="negative" rounded floating />
              </q-item-section>
            </q-item>
            <div v-if="conversations.length === 0" class="q-pa-md text-center text-grey-6">
              <q-icon name="chat" size="3em" />
              <div class="text-body2 q-mt-md">No conversations yet</div>
            </div>
          </q-list>
        </q-scroll-area>
      </div>

      <div class="chat-window column" v-if="selectedConversation">
        <div class="chat-header q-pa-md row items-center">
          <q-avatar color="primary" text-color="white" size="md" class="q-mr-md">
            {{ (selectedConversation.candidateName || selectedConversation.participantName || 'Unknown')?.charAt(0)?.toUpperCase() || 'U' }}
          </q-avatar>
          <div class="text-h6">{{ selectedConversation.candidateName || selectedConversation.participantName || 'Unknown Candidate' }}</div>
        </div>
        <q-scroll-area ref="chatScrollArea" class="col chat-messages q-pa-md">
          <div v-for="(msg, i) in selectedConversation.messages" :key="i" class="message-wrapper"
               :class="{ 'my-message': msg.sender === 'employer', 'other-message': msg.sender !== 'employer' }">
            <q-chat-message 
              :name="msg.sender === 'employer' ? 'You' : (selectedConversation.candidateName || selectedConversation.participantName || 'Unknown Candidate')"
              :text="[msg.text]" 
              :sent="msg.sender === 'employer'" 
              :stamp="formatTimeAgo(msg.timestamp)"
            />
           
            
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

      <div v-else class="chat-window column flex flex-center text-center text-grey-6">
        <q-icon name="chat" size="5rem" />
        <div class="text-h6 q-mt-md">Select a conversation to start chatting.</div>
      </div>
    </div>

    <q-dialog v-model="showBroadcastDialog">
      <q-card style="width: 500px">
        <q-card-section>
          <div class="text-h6">Create Broadcast Message</div>
          <div class="text-caption">Send a message to all or selected job seekers</div>
        </q-card-section>
        <q-card-section class="q-gutter-y-md">
          <q-input v-model="broadcastForm.title" outlined label="Broadcast Title" />
          <q-input v-model="broadcastForm.content" type="textarea" outlined label="Message Content" rows="4" />
          <q-select v-model="broadcastForm.targetAudience" outlined label="Target Audience" 
                    :options="[
                      { label: 'All Job Seekers', value: 'all' },
                      { label: 'Active Applicants', value: 'applicants' },
                      { label: 'Specific Skills', value: 'skills' }
                    ]" 
                    option-label="label" option-value="value" emit-value map-options />
          <q-input filled v-model="broadcastForm.scheduledFor" label="Schedule For (Optional)">
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="broadcastForm.scheduledFor" mask="YYYY-MM-DD HH:mm">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-time v-model="broadcastForm.scheduledFor" mask="YYYY-MM-DD HH:mm" format24h>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn color="primary" label="Send Broadcast" @click="scheduleBroadcast" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import AppHeader from 'src/components/HeaderPart.vue';
import { authHelpers } from 'src/services/auth.service';
import messageService from 'src/services/message.service';

const router = useRouter();
const $q = useQuasar();

const employer = ref({ name: 'Innovate Inc.', email: 'hr@innovate.com' });
const selected = ref('Messages');
const selectedConversation = ref(null);
const newMessage = ref('');
const chatScrollArea = ref(null);
const showBroadcastDialog = ref(false);
const broadcastForm = ref({ title: '', content: '', scheduledFor: '', targetAudience: 'all' });
const currentUser = authHelpers.getCurrentUser();
const conversations = ref([]);
const loading = ref(false);

onMounted(async () => {
  const stored = localStorage.getItem('employerData');
  if (stored) employer.value = JSON.parse(stored);
  await loadConversations();
});

const loadConversations = async () => {
  loading.value = true;
  try {
    const result = await messageService.getConversations();
    console.log('Raw conversations result:', result);
    if (result.success) {
      console.log('Individual conversations:', result.conversations);
      conversations.value = result.conversations.map(conv => {
        console.log('Processing conversation:', conv);
        const mapped = {
          id: conv.id,
          candidateId: conv.participantId || conv.jobSeekerId,
          candidateName: conv.participantName || conv.candidateName || conv.jobSeekerName,
          participantName: conv.participantName,
          unread: conv.unread || conv.unreadCount > 0,
          lastMessage: conv.lastMessage,
          lastMessageTime: conv.lastMessageTime || conv.lastMessageAt,
          jobTitle: conv.jobTitle,
          jobId: conv.jobId,
          messages: []
        };
        console.log('Mapped conversation:', mapped);
        return mapped;
      });
      if (conversations.value.length > 0) {
        selectConversation(conversations.value[0]);
      }
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

const scrollToBottom = () => {
  nextTick(() => {
    if (chatScrollArea.value) {
      chatScrollArea.value.setScrollPercentage('vertical', 1, 300);
    }
  });
};

const selectConversation = async (convo) => {
  selectedConversation.value = convo;
  
  console.log('EmployerMessages - selectConversation debug:');
  console.log('currentUser:', currentUser);
  console.log('currentUser?.id:', currentUser?.id);
  console.log('convo:', convo);
  
  // Mark as read
  if (convo.unread) {
    await messageService.markAsRead(convo.id);
    convo.unread = false;
  }
  
  // Load messages for this conversation
  try {
    const result = await messageService.getMessages(convo.id);
    if (result.success) {
      convo.messages = result.messages.map(msg => {
        const isMyMessage = msg.senderId === currentUser?.id;
        console.log('Message mapping:', {
          senderId: msg.senderId,
          currentUserId: currentUser?.id,
          isMyMessage: isMyMessage,
          content: msg.content?.substring(0, 20) + '...'
        });
        return {
          sender: isMyMessage ? 'employer' : 'candidate',
          text: msg.content,
          timestamp: msg.createdAt
        };
      });
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
        sender: 'employer',
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

const scheduleBroadcast = async () => {
  if (!broadcastForm.value.title || !broadcastForm.value.content) {
    $q.notify({ type: 'negative', message: 'Please fill in title and content.' });
    return;
  }
  
  const broadcastData = {
    title: broadcastForm.value.title,
    content: broadcastForm.value.content,
    targetAudience: broadcastForm.value.targetAudience,
    scheduledFor: broadcastForm.value.scheduledFor ? new Date(broadcastForm.value.scheduledFor).toISOString() : null
  };
  
  try {
    const result = await messageService.createBroadcast(broadcastData);
    if (result.success) {
      $q.notify({ type: 'positive', message: 'Broadcast scheduled successfully!' });
      showBroadcastDialog.value = false;
      broadcastForm.value = { title: '', content: '', scheduledFor: '', targetAudience: 'all' };
    } else {
      $q.notify({ type: 'negative', message: result.error });
    }
  } catch (error) {
    console.error('Error creating broadcast:', error);
    $q.notify({ type: 'negative', message: 'Failed to create broadcast' });
  }
};

const links = [
    { label: 'Dashboard Overview', icon: 'dashboard', to: '/employer-portal' },
    { label: 'Posted Jobs', icon: 'work', to: '/posted-jobs' },
    { label: 'Post New Job', icon: 'add_box', to: '/post-job' },
    { label: 'Candidates', icon: 'groups', to: '/candidates' },
    { label: 'Messages', icon: 'mail', to: '/employer-messages' },
    { label: 'Company Profile', icon: 'domain', to: '/company-profile' },
    { label: 'Settings', icon: 'settings', to: '/employer-settings' }
];
const navigate = (link) => {
  selected.value = link.label;
  if (link.to) router.push(link.to);
};

const formatTimeAgo = (dateString) => {
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
}
</script>

<style scoped>
.portal-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden; /* Important to prevent double scrollbars */
}

.sticky-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  /* The header component has its own background and shadow */
}

.page-wrapper {
  flex-grow: 1; /* Takes up the remaining vertical space */
  overflow: hidden; /* Important */
}

/* Sidebar and Content Area take full height of the wrapper */
.sidebar, .content-area {
  height: 100%;
}

.content-area {
  flex: 1;
  overflow-y: auto;
}
.page-wrapper { height: 100vh; background-color: #f4f8fa; }
.sidebar { width: 260px; background-color: #1565c0; color: #f0f4f8; display: flex; flex-direction: column; }
.sidebar-section { border-bottom: 1px solid #243B55; }
.logo-section { border-bottom-color: transparent; }
.nav-list .q-item { color: #BCCCDC; padding: 12px; margin: 4px 12px; border-radius: 8px; }
.nav-list .q-item:hover { background-color: #243B55; color: #ffffff; }
.active-link { background-color: #00529b !important; color: #ffffff !important; font-weight: 600; }
.logout-btn { color: #FFB5B5; border-radius: 8px; margin: 16px; }
.logout-btn:hover { background-color: #d32f2f; color: #ffffff; }

.content-area { flex: 1; overflow-y: hidden; }
.full-height { height: 100%; }
.conversation-list { width: 350px; min-width: 350px; background-color: #fff; border-right: 1px solid #e0e0e0; }
.list-header { border-bottom: 1px solid #e0e0e0; }
.selected-convo { background-color: #e3f2fd; }
.chat-window { flex-grow: 1; }
.chat-header { background-color: #f5f5f5; border-bottom: 1px solid #e0e0e0; }
.chat-messages { background-color: #f4f8fa; }
.chat-input-area { background-color: #fff; border-top: 1px solid #e0e0e0; }

/* Message alignment styles */
.message-wrapper {
  display: flex;
  flex-direction: column;
  margin-bottom: 8px;
}

.my-message {
  align-self: flex-end;
  margin-left: 20%;
}

.my-message .q-chat-message {
  background-color: #2196F3;
  color: white;
}

.other-message {
  align-self: flex-start;
  margin-right: 20%;
}

.other-message .q-chat-message {
  background-color: #f5f5f5;
  color: #333;
}
</style>