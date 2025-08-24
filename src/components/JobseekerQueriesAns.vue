<template>
  <div class="page-container">
    <div class="content-wrapper">
      <!-- Header -->
      <div class="row justify-between items-center q-mb-md">
        <div>
          <div class="text-h4 text-weight-bold content-title">My Support Tickets</div>
          <div class="text-subtitle1 subtitle-text">Find answers and track your support requests.</div>
        </div>
        <q-btn
          label="New Ticket"
          icon="add"
          color="primary"
          unelevated
          @click="openNewQueryDialog"
        />
      </div>

      <!-- Queries List -->
      <q-card flat class="queries-card">
        <q-list separator>
          <q-item-label header class="text-weight-bold text-primary">Ticket History</q-item-label>
          <q-item v-if="queries.length === 0" class="text-center">
            <q-item-section>
              <q-item-label caption>You have no support tickets.</q-item-label>
            </q-item-section>
          </q-item>

          <q-expansion-item
            v-for="query in queries"
            :key="query.id"
            group="queries-group"
            header-class="query-item-header"
          >
            <template v-slot:header>
              <q-item-section>
                <q-item-label class="text-weight-medium">{{ query.subject }}</q-item-label>
                <q-item-label caption>Ticket #{{ query.id }} &bull; Opened: {{ formatFullDate(query.date) }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-chip
                  dense
                  :icon="getStatusInfo(query.status).icon"
                  :color="getStatusInfo(query.status).color"
                  text-color="white"
                  :label="query.status"
                />
              </q-item-section>
            </template>

            <q-card>
              <q-card-section class="q-pa-lg">
                <div class="text-subtitle2 text-grey-8 q-mb-sm">Your Message:</div>
                <p class="message-text">{{ query.message }}</p>

                <q-separator class="q-my-lg" />

                <div v-if="query.reply">
                  <div class="text-subtitle2 text-primary q-mb-sm">Support Team's Reply:</div>
                  <p class="message-text admin-reply">{{ query.reply }}</p>
                </div>
                <div v-else>
                   <div class="text-subtitle2 text-orange-8 q-mb-sm">Pending Reply</div>
                   <p class="message-text">Our support team will respond to your ticket as soon as possible.</p>
                </div>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>
      </q-card>
    </div>

    <!-- New Query Dialog -->
    <q-dialog v-model="showNewQueryDialog">
      <q-card style="width: 600px; max-width: 90vw;">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">Create a New Support Ticket</div>
        </q-card-section>

        <q-card-section class="q-pa-md">
          <q-input
            v-model="newQuery.subject"
            label="Subject"
            filled
            class="q-mb-md"
            :rules="[val => !!val || 'Subject is required']"
            placeholder="e.g., Trouble applying for a job"
          />
          <q-input
            v-model="newQuery.message"
            label="Please describe your issue in detail"
            type="textarea"
            filled
            rows="6"
            :rules="[val => !!val || 'Message is required']"
          />
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancel" color="grey" v-close-popup />
          <q-btn label="Submit Ticket" color="primary" unelevated @click="submitQuery" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();

const showNewQueryDialog = ref(false);
const newQuery = ref({
  subject: '',
  message: '',
});

// Mock data for existing queries from a job seeker
const queries = ref([
  {
    id: 7861,
    subject: 'Application status inquiry',
    message: 'Hi, I applied for the "UI/UX Designer" position at Innovate Inc. about a week ago. I was just wondering if there is any update on my application status. Thank you!',
    date: '2025-08-19T09:00:00Z',
    status: 'Answered',
    reply: 'Hello! Thanks for checking in. The hiring team at Innovate Inc. is currently reviewing all applications. You will be notified via email as soon as there is an update. We appreciate your patience!',
  },
  {
    id: 7855,
    subject: 'Technical issue with profile update',
    message: 'I am trying to update my work experience section on my profile, but it is not saving the changes. I click "Save" but the old information remains. Please help.',
    date: '2025-08-15T16:20:00Z',
    status: 'Closed',
    reply: 'We apologize for the inconvenience. We had a temporary issue with profile updates which has now been resolved. Please try saving your information again. Let us know if the problem persists.',
  }
]);

const openNewQueryDialog = () => {
  newQuery.value = { subject: '', message: '' };
  showNewQueryDialog.value = true;
};

const submitQuery = () => {
  if (!newQuery.value.subject || !newQuery.value.message) {
    $q.notify({
      type: 'negative',
      message: 'Please fill out all fields.'
    });
    return;
  }
  // Simulate submission
  queries.value.unshift({
    id: Math.floor(1000 + Math.random() * 9000), // random 4-digit ID
    subject: newQuery.value.subject,
    message: newQuery.value.message,
    date: new Date().toISOString(),
    status: 'Open',
    reply: null
  });
  showNewQueryDialog.value = false;
  $q.notify({
    type: 'positive',
    message: 'Your support ticket has been created!'
  });
};

const getStatusInfo = (status) => {
  const map = {
    Open: { color: 'orange', icon: 'hourglass_top' },
    Answered: { color: 'positive', icon: 'check_circle' },
    Closed: { color: 'grey-7', icon: 'lock' },
  };
  return map[status] || { color: 'grey', icon: 'help' };
};

const formatFullDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};
</script>

<style scoped>
.page-container {
  background-color: #f5f7fa;
  min-height: 100vh;
  padding: 24px;
  display: flex;
  justify-content: center;
}
.content-wrapper {
  width: 100%;
  max-width: 1000px;
}
.content-title { color: #1a202c; }
.subtitle-text { color: #4a5568; }

.queries-card {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background-color: #ffffff;
  margin-top: 16px;
}
.query-item-header {
  padding: 16px;
}
.message-text {
  white-space: pre-wrap;
  line-height: 1.6;
  color: #2d3748;
}
.admin-reply {
  background-color: #ebf8ff; /* A light blue background for admin replies */
  border-left: 4px solid #3182ce; /* A blue accent bar */
  padding: 12px;
  border-radius: 4px;
}

@media (max-width: 600px) {
  .page-container {
    padding: 16px;
  }
  .text-h4 {
    font-size: 1.75rem;
  }
}
</style>