<template>
  <div class="portal-layout">
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
          <div class="text-subtitle1 text-weight-medium text-white">{{ employer.name }}</div>
          <div class="text-caption text-blue-grey-4">{{ employer.email }}</div>
        </div>
        <div class="sidebar-section q-pt-md q-pb-none">
          <q-list class="nav-list">
            <q-item v-for="link in links" :key="link.label" :active="selected === link.label" active-class="active-link"
              clickable v-ripple @click="navigate(link)">
              <q-item-section avatar>
                <q-icon :name="link.icon" />
              </q-item-section>
              <q-item-section>
                {{ link.label }}
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>

      <div class="content-area screening-test-bg q-pa-md q-pa-lg-xl">
        <div class="page-header">
          <q-icon name="playlist_add_check" color="primary" size="3rem" />
          <div class="page-header-text">
            <div class="text-h4 text-weight-bold">Manage Screening Tests</div>
            <div class="text-subtitle1 text-grey-7">View, edit, and see results for your published tests.</div>
          </div>
        </div>

        <q-banner v-if="publishedTests.length === 0" rounded class="bg-blue-1 text-blue-8">
            <template v-slot:avatar><q-icon name="history" color="blue-5" /></template>
            You have not published any screening tests yet.
            <template v-slot:action>
                <q-btn flat color="primary" label="Create a Test" to="/screening-test" />
            </template>
        </q-banner>

        <q-list v-else separator class="q-mt-md">
           <q-expansion-item
            v-for="test in publishedTests"
            :key="test.testId"
            class="test-expansion-card"
            group="published-tests"
          >
            <template v-slot:header>
              <q-item-section avatar>
                <q-avatar icon="quiz" color="primary" text-color="white" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-bold">{{ test.title }}</q-item-label>
                <q-item-label caption>
                  {{ getJobTitle(test.jobId) }}
                </q-item-label>
              </q-item-section>
              <q-item-section>
                  <q-item-label caption>Published on {{ formatDate(test.publishedAt) }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                 <q-badge outline color="positive" :label="test.status" />
              </q-item-section>
            </template>

            <q-card>
              <q-card-section>
                <div class="row q-gutter-md text-center">
                    <div class="col">
                        <div class="text-grey-7">Duration</div>
                        <div class="text-h6">{{ test.duration }} min</div>
                    </div>
                     <div class="col">
                        <div class="text-grey-7">Questions</div>
                        <div class="text-h6">{{ test.questions.length }}</div>
                    </div>
                     <div class="col">
                        <div class="text-grey-7">Total Points</div>
                        <div class="text-h6">{{ test.questions.reduce((sum, q) => sum + q.points, 0) }}</div>
                    </div>
                </div>
                <q-separator class="q-my-md" />
                <div class="row q-gutter-sm justify-end">
<q-btn 
  flat 
  color="grey-8" 
  label="Edit Test" 
  icon="edit" 
  :to="`/screening-test/${test.testId}`" 
/>
                    <q-btn color="negative" flat label="Delete Test" icon="delete" @click="deleteTest(test.testId, test.title)" />
                    <q-btn unelevated color="primary" label="View Results" icon="bar_chart" />
                </div>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar, date } from 'quasar';
import AppHeader from 'src/components/HeaderPart.vue';

const router = useRouter();
const $q = useQuasar();

// --- Sidebar Logic ---
const employer = ref({ name: 'Innovate Inc.', email: 'hr@innovate.com' });
const selected = ref('Screening Tests'); // Set the active link for this page
const links = [
  { label: 'Dashboard', icon: 'dashboard', to: '/employer-portal' },
  { label: 'Posted Jobs', icon: 'work', to: '/posted-jobs' },
  { label: 'Post New Job', icon: 'add_box', to: '/post-job' },
  { label: 'Screening Tests', icon: 'playlist_add_check', to: '/view-tests' }, // NEW LINK
  { label: 'Create Screening Test', icon: 'science', to: '/screening-test' },
  { label: 'Candidates', icon: 'groups', to: '/candidates' },
  { label: 'Messages', icon: 'mail', to: '/employer-messages' },
  { label: 'Company Profile', icon: 'domain', to: '/company-profile' },
  { label: 'Settings', icon: 'settings', to: '/employer-settings' }
];
const navigate = (link) => {
  selected.value = link.label;
  if (link.to) router.push(link.to);
};

// --- Page Logic ---
const publishedTests = ref([]);
const jobOptions = ref([ // This should ideally come from a shared store or API
    { label: 'Senior Frontend Developer', value: 101 },
    { label: 'UI/UX Designer', value: 102 },
    { label: 'Lead Backend Engineer (Python)', value: 103 },
    { label: 'DevOps Specialist', value: 104 },
]);

onMounted(() => {
  const stored = localStorage.getItem('employerData');
  if (stored) employer.value = JSON.parse(stored);
  fetchPublishedTests();
});

const fetchPublishedTests = () => {
    const storedTests = localStorage.getItem('jobhub_published_tests');
    if (storedTests) {
        publishedTests.value = JSON.parse(storedTests);
    }
};

const formatDate = (dateString) => {
    return date.formatDate(dateString, 'MMMM D, YYYY');
};

const getJobTitle = (jobId) => {
    const job = jobOptions.value.find(j => j.value === jobId);
    return job ? job.label : 'N/A';
};

const deleteTest = (testId, testTitle) => {
    $q.dialog({
        title: 'Confirm Deletion',
        message: `Are you sure you want to delete the test "${testTitle}"? This action cannot be undone.`,
        cancel: true,
        persistent: true,
        ok: { color: 'negative', label: 'Delete' }
    }).onOk(() => {
        let tests = JSON.parse(localStorage.getItem('jobhub_published_tests') || '[]');
        tests = tests.filter(t => t.testId !== testId);
        localStorage.setItem('jobhub_published_tests', JSON.stringify(tests));
        fetchPublishedTests(); // Refresh the list
        $q.notify({ type: 'positive', message: 'Test deleted successfully.' });
    });
};
</script>

<style scoped>
/* You can copy the exact same styles from ScreeningTest.vue */
.portal-layout { display: flex; flex-direction: column; height: 100vh; overflow: hidden; }
.sticky-header { position: sticky; top: 0; z-index: 1000; }
.page-wrapper { flex-grow: 1; overflow: hidden; }
.sidebar, .content-area { height: 100%; }
.sidebar { width: 260px; background-color: #1565c0; color: #f0f4f8; display: flex; flex-direction: column; }
.sidebar-section { border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
.nav-list .q-item { color: #BCCCDC; padding: 12px; margin: 4px 12px; border-radius: 8px; }
.nav-list .q-item:hover { background-color: rgba(255, 255, 255, 0.1); }
.active-link { background-color: #00529b !important; color: #ffffff !important; font-weight: 600; }
.content-area { flex: 1; overflow-y: auto; }
.screening-test-bg { background-color: #f0f4f8; }
.page-header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
.test-expansion-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 8px;
  background-color: #fff;
}
.q-expansion-item--expanded {
  background: #fafafa;
}
</style>