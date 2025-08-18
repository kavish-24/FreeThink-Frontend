<template>
  <q-page class="q-pa-md bg-grey-2">
    <div class="q-mb-lg">
        <div class="row items-center q-mb-sm">
        <q-btn flat round icon="arrow_back" class="q-mr-sm" @click="$router.push('/admin/dashboard')" />
        <div class="text-h4 text-weight-bold">User Queries & Messages</div>
      </div>
      <div class="text-subtitle1 text-grey-7 q-pl-xl">Review and respond to inquiries from the contact page.</div>
    </div>

    <q-card flat bordered>
      <q-splitter
        v-model="splitterModel"
        style="height: calc(100vh - 200px)"
      >
        <template v-slot:before>
          <div class="q-pa-md">
            <q-input v-model="searchQuery" outlined dense placeholder="Search queries...">
              <template v-slot:append><q-icon name="search" /></template>
            </q-input>
            <q-tabs v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary" align="justify">
              <q-tab name="new" label="New" />
              <q-tab name="archived" label="Archived" />
            </q-tabs>
            <q-separator />
            <q-list separator>
              <q-item
                v-for="query in filteredQueries"
                :key="query.id"
                clickable
                v-ripple
                @click="selectQuery(query)"
                :active="selectedQuery && selectedQuery.id === query.id"
                active-class="bg-blue-1 text-primary"
              >
                <q-item-section>
                  <q-item-label :class="{ 'text-weight-bold': query.status === 'new' }" lines="1">{{ query.name }}</q-item-label>
                  <q-item-label caption lines="1">{{ query.subject }}</q-item-label>
                  <q-item-label caption lines="2" class="q-mt-xs">{{ query.message }}</q-item-label>
                </q-item-section>
                <q-item-section side top>
                  <q-item-label caption>{{ formatDate(query.receivedAt) }}</q-item-label>
                  <q-icon v-if="query.status === 'new'" name="fiber_manual_record" color="orange" class="q-mt-sm" />
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </template>

        <template v-slot:after>
          <div v-if="!selectedQuery" class="flex flex-center text-center text-grey-6" style="height: 100%;">
            <div>
              <q-icon name="inbox" size="80px" />
              <div class="text-h6">Select a query to view details</div>
            </div>
          </div>
          <div v-else class="q-pa-md">
            <q-card flat bordered>
              <q-card-section>
                <div class="row items-center no-wrap">
                    <div class="col">
                    <div class="text-h6">{{ selectedQuery.subject }}</div>
                    <div class="text-subtitle2">from {{ selectedQuery.name }} &lt;{{ selectedQuery.email }}&gt;</div>
                  </div>
                    <div class="col-auto">
                    <q-btn flat round icon="more_vert">
                        <q-menu>
                          <q-list dense>
                            <q-item clickable v-close-popup @click="archiveQuery(selectedQuery)"><q-item-section>Archive</q-item-section></q-item>
                            <q-item clickable v-close-popup @click="deleteQuery(selectedQuery)"><q-item-section>Delete</q-item-section></q-item>
                          </q-list>
                        </q-menu>
                    </q-btn>
                  </div>
                </div>
              </q-card-section>
              <q-separator />
              <q-card-section class="text-body1" style="white-space: pre-wrap;">
                {{ selectedQuery.message }}
              </q-card-section>
              

              <q-separator />
              <q-card-actions align="right">
                <q-btn unelevated color="primary" icon="reply" label="Reply" @click="openReplyDialog" />
              </q-card-actions>
            </q-card>
          </div>
        </template>
      </q-splitter>
    </q-card>

    <q-dialog v-model="showReplyDialog">
      <q-card style="width: 600px; max-width: 90vw;">
        <q-card-section>
          <div class="text-h6">Reply to {{ selectedQuery?.name }}</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input dense outlined readonly :model-value="`To: ${selectedQuery?.email}`" />
          <q-input dense outlined readonly :model-value="`Re: ${selectedQuery?.subject}`" class="q-mt-sm" />
          <q-editor v-model="replyMessage" min-height="10rem" class="q-mt-md" />
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn unelevated label="Send Reply" color="primary" @click="sendReply" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
// This script block is correct and does not need any changes.
import { ref, onMounted, computed } from 'vue';
import { useQuasar, date } from 'quasar';


const $q = useQuasar();
const allQueries = ref([]);
const selectedQuery = ref(null);
const tab = ref('new');
const splitterModel = ref(30);
const searchQuery = ref('');
const showReplyDialog = ref(false);
const replyMessage = ref('');


const filteredQueries = computed(() => {
  return allQueries.value.filter(q => {
    const statusMatch = q.status === tab.value;
    const searchMatch = q.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                        q.subject.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                        q.message.toLowerCase().includes(searchQuery.value.toLowerCase());
    return statusMatch && searchMatch;
  });
});

const formatDate = (dateString) => date.formatDate(dateString, 'MMM D, h:mm A');

const fetchQueries = () => {
  allQueries.value = [
    { id: 1, name: 'Priya Sharma', email: 'priya.sharma@example.com', subject: 'Technical Support', message: 'Hello, I am having trouble uploading my resume. It keeps giving me an error. Can you please assist?', status: 'new', receivedAt: '2025-08-11T13:00:00Z' },
    { id: 2, name: 'Rohan Mehta', email: 'rohan.m@example.com', subject: 'Billing Question', message: 'I was charged twice for my subscription this month. Please look into this and process a refund.', status: 'new', receivedAt: '2025-08-11T11:25:00Z' },
    { id: 3, name: 'Anjali Verma', email: 'anjali.v@example.com', subject: 'Feedback & Suggestions', message: 'Great platform! It would be wonderful if you could add a feature to save job searches. Keep up the good work.', status: 'new', receivedAt: '2025-08-10T18:10:00Z' },
    { id: 4, name: 'Vikram Singh', email: 'vikram.singh@example.com', subject: 'General Inquiry', message: 'How long does it take for a company profile to be verified?', status: 'archived', receivedAt: '2025-08-09T15:45:00Z' },
  ];
};

const selectQuery = (query) => {
  selectedQuery.value = query;
};

const archiveQuery = (query) => {
  $q.notify({ type: 'info', message: 'Query archived.' });
  query.status = 'archived';
  selectedQuery.value = null;
};

const deleteQuery = (query) => {
  $q.dialog({
    title: 'Confirm',
    message: 'Are you sure you want to delete this query?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    allQueries.value = allQueries.value.filter(q => q.id !== query.id);
    selectedQuery.value = null;
    $q.notify({ type: 'positive', message: 'Query deleted.' });
  });
};

const openReplyDialog = () => {
  replyMessage.value = `\n\n---\nOriginal Message:\n${selectedQuery.value.message}`;
  showReplyDialog.value = true;
};

const sendReply = () => {
  console.log('Sending reply:', replyMessage.value);
  showReplyDialog.value = false;
  archiveQuery(selectedQuery.value);
  $q.notify({ type: 'positive', message: 'Reply sent successfully!' });
};

onMounted(() => {
  fetchQueries();
});
</script>