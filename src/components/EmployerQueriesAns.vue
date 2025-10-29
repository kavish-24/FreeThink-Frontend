<template>
  <div class="portal-layout">
    <!-- Re-using the same portal structure for consistency -->
    <AppHeader class="sticky-header" />
    <div class="page-wrapper row no-wrap">
      <EmployerSidebar :active-link="selected" @navigate="(label) => selected = label" />

      <!-- Main Content Area for Queries -->
      <div class="content-area column q-pa-md">
        <div class="row justify-between items-center q-mb-md">
          <div>
            <div class="text-h5 text-weight-bold content-title">Support & Queries</div>
            <div class="text-subtitle1 subtitle-text">Track your conversations with our support team.</div>
          </div>
          <q-btn
            label="Submit New Query"
            icon="add_comment"
            color="primary"
            unelevated
            @click="openNewQueryDialog"
          />
        </div>

        <!-- Queries List -->
        <q-card flat class="queries-card">
          <q-list separator>
            <q-item-label header class="text-weight-bold text-primary">Your Query History</q-item-label>
            <q-item v-if="queries.length === 0" class="text-center">
              <q-item-section>
                <q-item-label caption>You haven't submitted any queries yet.</q-item-label>
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
                  <q-item-label caption>Submitted: {{ formatFullDate(query.date) }}</q-item-label>
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
                    <div class="text-subtitle2 text-primary q-mb-sm">Admin Reply:</div>
                    <p class="message-text admin-reply">{{ query.reply }}</p>
                  </div>
                  <div v-else>
                     <div class="text-subtitle2 text-orange-8 q-mb-sm">Awaiting Reply</div>
                     <p class="message-text">Our team has received your query and will get back to you shortly.</p>
                  </div>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-list>
        </q-card>
      </div>
    </div>

    <!-- New Query Dialog -->
    <q-dialog v-model="showNewQueryDialog">
      <q-card style="width: 600px; max-width: 90vw;">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">Submit a New Query</div>
        </q-card-section>

        <q-card-section class="q-pa-md">
          <q-input
            v-model="newQuery.subject"
            label="Subject"
            filled
            class="q-mb-md"
            :rules="[val => !!val || 'Subject is required']"
          />
          <q-input
            v-model="newQuery.message"
            label="Your Message"
            type="textarea"
            filled
            rows="6"
            :rules="[val => !!val || 'Message is required']"
          />
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancel" color="grey" v-close-popup />
          <q-btn label="Send Query" color="primary" unelevated @click="submitQuery" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import AppHeader from 'src/components/HeaderPart.vue';
import EmployerSidebar from 'src/components/EmployerSidebar.vue';

const $q = useQuasar();
const selected = ref('Support');

const showNewQueryDialog = ref(false);
const newQuery = ref({
  subject: '',
  message: '',
});

// Mock data for existing queries
const queries = ref([
  {
    id: 1,
    subject: 'Issue with job posting visibility',
    message: 'Hello, I posted a job for a "Senior Frontend Developer" yesterday, but it doesn\'t seem to be visible in the public job listings. Could you please check on this for me? The job ID is 1.',
    date: '2025-08-20T10:00:00Z',
    status: 'Answered',
    reply: 'Hi Innovate Inc., thanks for reaching out. We\'ve checked the posting and it was pending final review. It has now been approved and is live on the site. Apologies for the delay.',
  },
  {
    id: 2,
    subject: 'Question about subscription plans',
    message: 'I would like to know more about the enterprise subscription plan and its features, specifically regarding the number of users that can be added to an employer account.',
    date: '2025-08-18T14:30:00Z',
    status: 'Closed',
    reply: 'The Enterprise plan allows for unlimited user accounts under one employer profile. We have also sent detailed documentation to your registered email address.',
  },
  {
    id: 3,
    subject: 'Unable to download candidate resume',
    message: 'I am trying to download the resume for candidate ID 102, but I am getting an error. Can you please assist?',
    date: '2025-08-21T11:00:00Z',
    status: 'Open',
    reply: null,
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
      message: 'Please fill in both subject and message fields.'
    });
    return;
  }
  // Simulate submission
  queries.value.unshift({
    id: Date.now(),
    subject: newQuery.value.subject,
    message: newQuery.value.message,
    date: new Date().toISOString(),
    status: 'Open',
    reply: null
  });
  showNewQueryDialog.value = false;
  $q.notify({
    type: 'positive',
    message: 'Your query has been submitted successfully!'
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
/* Using the same layout styles for consistency */
.portal-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}
.sticky-header { flex-shrink: 0; }
.page-wrapper {
  flex-grow: 1;
  overflow: hidden;
}
.content-area {
  flex-grow: 1;
  overflow-y: auto;
  background-color: #F0F7FF;
}
.content-title { color: #0D1B2A; }
.subtitle-text { color: #5A7184; }

/* Styles specific to this query page */
.queries-card {
  border: 1px solid #DDE8F5;
  border-radius: 12px;
  background-color: #ffffff;
}
.query-item-header {
  padding: 16px;
}
.message-text {
  white-space: pre-wrap;
  line-height: 1.6;
  color: #333;
}
.admin-reply {
  background-color: #e8f5e9; /* A light green background for admin replies */
  border-left: 4px solid #4caf50; /* A green accent bar */
  padding: 12px;
  border-radius: 4px;
}
</style>