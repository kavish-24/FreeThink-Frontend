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
            <q-item v-for="link in links" :key="link.label" :active="selected === link.label"
              active-class="active-link" clickable v-ripple @click="navigate(link)">
              <q-item-section avatar>
                <q-icon :name="link.icon" />
              </q-item-section>
              <q-item-section>{{ link.label }}</q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>

      <div class="content-area column q-pa-md">
        <div class="row justify-between items-center q-mb-md">
          <div>
            <div class="text-h5 text-weight-bold content-title">Candidate Pipeline</div>
            <div class="text-subtitle1 subtitle-text">Review and manage your applicants.</div>
          </div>
        </div>

        <q-card flat class="q-mb-md control-bar">
          <div class="row items-center q-pa-sm q-gutter-md">
            <div class="col-12 col-md-4">
              <q-select filled dense v-model="selectedJobId" :options="jobOptions" label="Filter by Job" emit-value
                map-options options-dense />
            </div>
            <div class="col-12 col-md-4">
              <q-input filled dense v-model="searchQuery" placeholder="Search candidate name..." debounce="300"
                :disable="!selectedJobId" clearable>
                <template v-slot:prepend>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
          </div>
        </q-card>

        <div v-if="selectedJobId" class="kanban-board-wrapper">
          <div class="kanban-board row no-wrap q-gutter-md">
            <div v-for="stage in stages" :key="stage" class="kanban-column">
              <div class="column-header">
                <span class="text-subtitle1 text-weight-bold column-title">{{ stage }}</span>
                <q-badge rounded :label="getStageCandidateCount(stage)" class="header-badge" />
              </div>
              <div class="column-body">
                <transition-group name="fade-list">
                  <q-card v-for="candidate in candidatesByStage[stage]" :key="candidate.id"
                    class="candidate-card q-mb-sm" @click="viewCandidate(candidate)">
                    <div class="status-strip" :class="`status-color-${getStatusColor(candidate.status)}`"></div>
                    <q-item>
                      <q-item-section avatar>
                        <q-avatar color="light-blue-1" text-color="primary" class="text-weight-bold">
                          {{ candidate.name.charAt(0) }}
                        </q-avatar>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="text-weight-bold list-item-title">{{ candidate.name }}</q-item-label>
                        <q-item-label caption>Applied {{ formatTimeAgo(candidate.appliedDate) }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-card>
                </transition-group>
              </div>
            </div>
          </div>
        </div>

        <q-card v-else class="flex flex-center" style="height: 50vh; background: transparent;" flat>
          <div class="text-center subtitle-text">
            <q-icon name="work_outline" size="4rem" />
            <div class="text-h6 q-mt-md">Please select a job to view candidates.</div>
          </div>
        </q-card>

        <q-dialog v-model="showCandidateDetail" backdrop-filter="blur(4px) brightness(80%)">
          <q-card v-if="selectedCandidate" class="dialog-card q-pa-none" style="width: 800px; max-width: 90vw;">
            <q-card-section class="dialog-header text-white q-pa-lg">
              <div class="row items-start justify-between">
                <q-item class="q-pa-none" style="flex: 1;">
                  <q-item-section avatar>
                    <q-avatar size="64px" color="white" text-color="primary">{{ selectedCandidate.name.charAt(0) }}</q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-h5 text-weight-bold">{{ selectedCandidate.name }}</q-item-label>
                    <q-item-label>Applied for <b>{{ getJobTitle(selectedCandidate.jobId) }}</b></q-item-label>
                  </q-item-section>
                </q-item>
                <q-btn icon="close" flat round dense v-close-popup class="q-ml-md" />
              </div>
            </q-card-section>

            <q-tabs v-model="detailTab" dense class="text-grey" active-color="primary" indicator-color="primary"
              align="justify">
              <q-tab name="profile" label="Profile" />
              <q-tab name="feedback" label="Feedback" />
            </q-tabs>
            <q-separator />

            <q-tab-panels v-model="detailTab" animated>
              <q-tab-panel name="profile" class="q-pa-lg profile-tab-panel">
                <div class="profile-section q-mb-lg">
                  <div class="section-title row items-center q-mb-sm">
                    <q-icon name="person_outline" class="q-mr-sm" />
                    <div class="text-subtitle1 text-weight-bold text-primary">Personal Information</div>
                  </div>
                  <div class="row q-col-gutter-md">
                    <div class="col-12 col-sm-6"><q-item-label caption>First Name</q-item-label><div class="field-value">{{ selectedCandidate.firstName }}</div></div>
                    <div class="col-12 col-sm-6"><q-item-label caption>Last Name</q-item-label><div class="field-value">{{ selectedCandidate.lastName }}</div></div>
                    <div class="col-12 col-sm-6"><q-item-label caption>Email Address</q-item-label><div class="field-value">{{ selectedCandidate.email }}</div></div>
                    <div class="col-12 col-sm-6"><q-item-label caption>Phone Number</q-item-label><div class="field-value">{{ selectedCandidate.phone }}</div></div>
                    <div class="col-12 col-sm-6" v-if="selectedCandidate.location"><q-item-label caption>Current Location</q-item-label><div class="field-value">{{ selectedCandidate.location }}</div></div>
                    <div class="col-12 col-sm-6" v-if="selectedCandidate.linkedinUrl"><q-item-label caption>LinkedIn Profile</q-item-label><div class="field-value"><a :href="selectedCandidate.linkedinUrl" target="_blank" class="text-primary">View Profile</a></div></div>
                    <div class="col-12 col-sm-6" v-if="selectedCandidate.portfolioUrl"><q-item-label caption>Portfolio/Website</q-item-label><div class="field-value"><a :href="selectedCandidate.portfolioUrl" target="_blank" class="text-primary">Visit Website</a></div></div>
                  </div>
                </div>

                <div class="profile-section q-mb-lg">
                  <div class="section-title row items-center q-mb-sm">
                     <q-icon name="school" class="q-mr-sm" />
                    <div class="text-subtitle1 text-weight-bold text-primary">Education</div>
                  </div>
                   <div class="row q-col-gutter-md">
                    <div class="col-12"><q-item-label caption>Highest Qualification</q-item-label><div class="field-value">{{ selectedCandidate.highestQualification }}</div></div>
                    <div class="col-12"><q-item-label caption>Institution Name</q-item-label><div class="field-value">{{ selectedCandidate.institutionName }}</div></div>
                    <div class="col-12 col-sm-6"><q-item-label caption>Year of Passing</q-item-label><div class="field-value">{{ selectedCandidate.yearOfPassing }}</div></div>
                    <div class="col-12 col-sm-6" v-if="selectedCandidate.cgpa"><q-item-label caption>CGPA / Percentage</q-item-label><div class="field-value">{{ selectedCandidate.cgpa }}</div></div>
                  </div>
                </div>

                <div class="profile-section q-mb-lg">
                  <div class="section-title row items-center q-mb-sm">
                    <q-icon name="work_history" class="q-mr-sm" />
                    <div class="text-subtitle1 text-weight-bold text-primary">Work Experience</div>
                  </div>
                   <div class="row q-col-gutter-md">
                    <div class="col-12 col-sm-6"><q-item-label caption>Total Years of Experience</q-item-label><div class="field-value">{{ selectedCandidate.totalExperience }} Years</div></div>
                    <div class="col-12 col-sm-6"><q-item-label caption>Last Job Title</q-item-label><div class="field-value">{{ selectedCandidate.lastJobTitle }}</div></div>
                    <div class="col-12"><q-item-label caption>Last Company</q-item-label><div class="field-value">{{ selectedCandidate.lastCompanyName }}</div></div>
                    <div class="col-12" v-if="selectedCandidate.responsibilities"><q-item-label caption>Responsibilities / Achievements</q-item-label><div class="field-value text-body2" style="white-space: pre-wrap;">{{ selectedCandidate.responsibilities }}</div></div>
                    <div class="col-12 col-sm-4"><q-item-label caption>Notice Period</q-item-label><div class="field-value">{{ selectedCandidate.noticePeriod }}</div></div>
                    <div class="col-12 col-sm-4"><q-item-label caption>Current Salary (p.a.)</q-item-label><div class="field-value">{{ formatSalary(selectedCandidate.currentSalary) }}</div></div>
                    <div class="col-12 col-sm-4"><q-item-label caption>Expected Salary (p.a.)</q-item-label><div class="field-value">{{ formatSalary(selectedCandidate.expectedSalary) }}</div></div>
                  </div>
                </div>

                 <div class="profile-section q-mb-lg">
                  <div class="section-title row items-center q-mb-sm">
                    <q-icon name="psychology" class="q-mr-sm" />
                    <div class="text-subtitle1 text-weight-bold text-primary">Skills & Certifications</div>
                  </div>
                  <q-item-label caption>Key Skills</q-item-label>
                  <div class="q-mt-sm q-mb-md">
                     <q-chip v-for="skill in selectedCandidate.skills" :key="skill" glossy color="light-blue-2" text-color="primary" class="q-mr-sm q-mb-sm">{{ skill }}</q-chip>
                  </div>
                  <div v-if="selectedCandidate.certifications && selectedCandidate.certifications.length">
                     <q-item-label caption>Certifications</q-item-label>
                     <div class="q-mt-sm">
                        <div v-for="cert in selectedCandidate.certifications" :key="cert" class="field-value q-mb-xs">- {{ cert }}</div>
                     </div>
                  </div>
                </div>

                 <div class="profile-section q-mb-lg">
                  <div class="section-title row items-center q-mb-sm">
                    <q-icon name="event_available" class="q-mr-sm" />
                    <div class="text-subtitle1 text-weight-bold text-primary">Availability</div>
                  </div>
                   <div class="row q-col-gutter-md">
                      <div class="col-12 col-sm-6"><q-item-label caption>Earliest Joining Date</q-item-label><div class="field-value">{{ formatFullDate(selectedCandidate.earliestJoiningDate) }}</div></div>
                      <div class="col-12 col-sm-6"><q-item-label caption>Preferred Interview Slot</q-item-label><div class="field-value">{{ selectedCandidate.preferredInterviewSlot }}</div></div>
                   </div>
                </div>

                <div class="profile-section">
                  <div class="section-title row items-center q-mb-sm">
                    <q-icon name="description" class="q-mr-sm" />
                    <div class="text-subtitle1 text-weight-bold text-primary">Resume</div>
                  </div>
                  <q-btn icon="download" label="Download Resume" color="primary" unelevated :href="selectedCandidate.resumeUrl" target="_blank" class="full-width q-mt-sm" />
                </div>
              </q-tab-panel>

              <q-tab-panel name="feedback" class="q-pa-lg">
                <div class="text-subtitle1 text-weight-medium q-mb-sm">Provide Feedback to Candidate</div>
                <p class="text-caption text-grey-8">
                  Share constructive feedback with the candidate. This message will be sent to them along with the rejection notice. This step is optional.
                </p>
                <q-input
                  v-model="feedbackMessage"
                  type="textarea"
                  filled
                  rows="8"
                  label="Feedback Message"
                  placeholder="e.g., Thank you for your interest. While your profile is impressive, we have decided to move forward with other candidates whose experience more closely aligns with the specific requirements of this role..."
                />
                <q-btn
                  label="Send Feedback & Reject"
                  icon="send"
                  color="negative"
                  unelevated
                  class="full-width q-mt-md"
                  @click="confirmAndRejectWithFeedback(selectedCandidate)"
                />
              </q-tab-panel>

            </q-tab-panels>

            <q-card-actions v-if="detailTab !== 'feedback'" align="right" class="q-pa-md bg-blue-grey-1">
              <q-btn flat label="Reject" color="negative" @click="promptForRejection(selectedCandidate)" />
              <q-btn v-if="selectedCandidate.status !== 'Hired'" label="Move to Next Stage" color="primary" unelevated
                @click="confirmMoveToNextStage(selectedCandidate)" />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
import AppHeader from 'src/components/HeaderPart.vue';

const $q = useQuasar();
const router = useRouter();
const route = useRoute();
const employer = ref({ name: 'Innovate Inc.', email: 'hr@innovate.com' });
const selected = ref('Candidates');

// Mock Data
const jobs = ref([
  { id: 1, title: 'Senior Frontend Developer' },
  { id: 2, title: 'UI/UX Designer' },
  { id: 5, title: 'Backend Developer (Node.js)' },
]);

const allCandidates = ref([
  {
    id: 101, name: 'Aarav Sharma', jobId: 1, status: 'New Applicant', appliedDate: '2025-07-29T10:00:00Z',
    firstName: 'Aarav', lastName: 'Sharma', email: 'aarav.s@example.com', phone: '+91-9876543210', location: 'Bengaluru, India',
    linkedinUrl: 'https://linkedin.com/in/aaravsharma', portfolioUrl: 'https://aarav.dev',
    highestQualification: 'Bachelor of Technology (B.Tech) in Computer Science', yearOfPassing: 2019,
    institutionName: 'Indian Institute of Technology, Bombay', cgpa: '8.5/10',
    totalExperience: 6, lastJobTitle: 'Senior Frontend Engineer', lastCompanyName: 'TechSolutions Pvt. Ltd.',
    responsibilities: 'Led the development of a new client-facing dashboard using Vue.js and Pinia.\nMentored junior developers and improved code quality by 30%.',
    noticePeriod: '1 Month', currentSalary: 1800000, expectedSalary: 2200000,
    skills: ['Vue.js', 'TypeScript', 'Quasar', 'Pinia', 'Jest', 'CI/CD'],
    certifications: ['AWS Certified Cloud Practitioner'],
    preferredInterviewSlot: 'Weekdays, 4 PM - 6 PM IST', earliestJoiningDate: '2025-09-15',
    resumeUrl: '#',
    answers: [{ question: 'Years of Vue experience?', answer: '5+ Years' }], notes: ''
  },
  {
    id: 102, name: 'Priya Patel', jobId: 1, status: 'Screening', appliedDate: '2025-07-30T11:30:00Z',
    firstName: 'Priya', lastName: 'Patel', email: 'priya.p@example.com', phone: '+91-9876543211', location: 'Pune, India',
    linkedinUrl: 'https://linkedin.com/in/priyapatel', portfolioUrl: null,
    highestQualification: 'B.E in Information Technology', yearOfPassing: 2020,
    institutionName: 'Pune Institute of Computer Technology', cgpa: '9.1/10',
    totalExperience: 4, lastJobTitle: 'Frontend Developer', lastCompanyName: 'Digital Innovations',
    responsibilities: 'Developed and maintained UI components for a large-scale e-commerce platform.',
    noticePeriod: '2 Months', currentSalary: 1200000, expectedSalary: 1500000,
    skills: ['React', 'Vue.js', 'Testing', 'Redux'], certifications: [],
    preferredInterviewSlot: 'Any weekday after 5 PM', earliestJoiningDate: '2025-10-01',
    resumeUrl: '#', answers: [{ question: 'Years of Vue experience?', answer: '4 Years' }], notes: 'Strong portfolio.'
  },
  {
    id: 104, name: 'Sneha Verma', jobId: 1, status: 'Interview', appliedDate: '2025-07-27T15:00:00Z',
    firstName: 'Sneha', lastName: 'Verma', email: 'sneha.v@example.com', phone: '+91-9876543213', location: 'Hyderabad, India',
    linkedinUrl: null, portfolioUrl: 'https://sneha.design',
    highestQualification: 'Master of Computer Applications (MCA)', yearOfPassing: 2018,
    institutionName: 'University of Hyderabad', cgpa: '8.8/10',
    totalExperience: 7, lastJobTitle: 'Lead UI Developer', lastCompanyName: 'Fintech Corp',
    responsibilities: 'Architected the frontend for a new mobile banking app.',
    noticePeriod: '45 Days', currentSalary: 2500000, expectedSalary: 3000000,
    skills: ['Vue.js', 'Nuxt.js', 'GraphQL', 'Webpack', 'Performance Tuning'], certifications: ['Certified JavaScript Developer'],
    preferredInterviewSlot: 'Weekends Only', earliestJoiningDate: '2025-09-20',
    resumeUrl: '#', answers: [{ question: 'Years of Vue experience?', answer: '6 Years' }], notes: 'Scheduled for technical round on 4th Aug.'
  },
]);


// Page State
const selectedJobId = ref(null);
const searchQuery = ref('');
const showCandidateDetail = ref(false);
const selectedCandidate = ref(null);
const detailTab = ref('profile');
const feedbackMessage = ref('');
const stages = ['New Applicant', 'Screening', 'Interview', 'Offered', 'Hired', 'Rejected'];

// Computed Properties
const jobOptions = computed(() => jobs.value.map(job => ({ label: job.title, value: job.id })));
const filteredCandidates = computed(() => {
  if (!selectedJobId.value) return [];
  let candidates = allCandidates.value.filter(c => c.jobId === selectedJobId.value);
  if (searchQuery.value) {
    candidates = candidates.filter(c => c.name.toLowerCase().includes(searchQuery.value.toLowerCase()));
  }
  return candidates;
});
const candidatesByStage = computed(() => {
  const grouped = {};
  stages.forEach(stage => { grouped[stage] = []; });
  filteredCandidates.value.forEach(candidate => {
    if (grouped[candidate.status]) {
      grouped[candidate.status].push(candidate);
    }
  });
  return grouped;
});

// Lifecycle & Watchers
onMounted(() => {
  const stored = localStorage.getItem('employerData');
  if (stored) employer.value = JSON.parse(stored);
  const jobIdFromQuery = parseInt(route.query.jobId);
  if (jobIdFromQuery && jobs.value.some(j => j.id === jobIdFromQuery)) {
    selectedJobId.value = jobIdFromQuery;
  }
});
watch(selectedJobId, () => { searchQuery.value = ''; });

// Methods
const getStatusColor = (status) => {
    const colorMap = {
        'New Applicant': 'blue', 'Screening': 'orange', 'Interview': 'purple',
        'Offered': 'teal', 'Hired': 'positive', 'Rejected': 'negative'
    };
    return colorMap[status] || 'grey';
};
const getStageCandidateCount = (stage) => candidatesByStage.value[stage]?.length || 0;
const getJobTitle = (jobId) => jobs.value.find(j => j.id === jobId)?.title || 'N/A';

const viewCandidate = (candidate) => {
  selectedCandidate.value = { ...candidate };
  detailTab.value = 'profile';
  feedbackMessage.value = ''; // Reset feedback message
  showCandidateDetail.value = true;
};

const changeCandidateStatus = (candidate, newStatus) => {
  const original = allCandidates.value.find(c => c.id === candidate.id);
  if (original) original.status = newStatus;
  showCandidateDetail.value = false; // Close main dialog after action
};

const moveToNextStage = (candidate) => {
  const i = stages.indexOf(candidate.status);
  if (i >= 0 && i < stages.indexOf('Hired')) {
    const newStatus = stages[i+1];
    const original = allCandidates.value.find(c => c.id === candidate.id);
    if (original) original.status = newStatus;
  }
};

const confirmMoveToNextStage = (candidate) => {
  $q.dialog({
    title: 'Confirm Action',
    message: `Do you really want to move this candidate to the next stage?`,
    persistent: true,
    ok: { label: 'Yes, Move', color: 'primary', unelevated: true },
    cancel: { label: 'Wait', color: 'blue-grey', flat: true },
  }).onOk(() => {
    moveToNextStage(candidate);
    showCandidateDetail.value = false;
  });
};

const promptForRejection = (candidate) => {
  $q.dialog({
    title: 'Reject Candidate?',
    message: 'Are you sure you want to reject this candidate?',
    persistent: true,
    ok: { label: 'Yes', color: 'negative' },
    cancel: { label: 'Wait', color: 'grey', flat: true }
  }).onOk(() => {
    // After first confirmation, ask about feedback
    askForFeedback(candidate);
  }).onCancel(() => {
    // Rejection action cancelled
    console.log('Rejection cancelled');
  });
};

const askForFeedback = (candidate) => {
    $q.dialog({
        title: 'Provide Feedback?',
        message: 'Would you like to provide feedback to the candidate?',
        persistent: true,
        ok: { label: 'Yes, Provide Feedback', color: 'primary', unelevated: true },
        cancel: { label: 'No, Reject Immediately', color: 'negative', flat: true }
    }).onOk(() => {
        // Switch to the feedback tab
        detailTab.value = 'feedback';
    }).onCancel(() => {
        // Reject without feedback
        changeCandidateStatus(candidate, 'Rejected');
    });
};

const confirmAndRejectWithFeedback = (candidate) => {
  $q.dialog({
    title: 'Confirm Rejection',
    message: 'This will send the feedback and permanently reject the candidate. Are you sure?',
    persistent: true,
    ok: {
      label: 'Yes, Reject',
      color: 'negative',
      unelevated: true
    },
    cancel: {
      label: 'Wait',
      color: 'grey',
      flat: true
    },
  }).onOk(() => {
    // In a real app, you would send the feedbackMessage.value here
    console.log(`Feedback for ${candidate.name}: ${feedbackMessage.value}`);
    changeCandidateStatus(candidate, 'Rejected');
  });
}

const formatTimeAgo = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  let interval = seconds / 86400;
  if (interval > 7) return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return "Just now";
};

const formatFullDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const formatSalary = (value) => {
  if (typeof value !== 'number') return 'N/A';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
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

</script>

<style scoped>
/* Scoped styles for the new dialog UI */
.dialog-header {
  background: linear-gradient(45deg, #1e88e5 0%, #1565c0 100%);
}
.bg-white-transparent {
  background-color: rgba(255, 255, 255, 0.1);
}

/* START: New Profile Tab Styles */
.profile-tab-panel {
  max-height: 60vh;
  overflow-y: auto;
}
.profile-section {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  background-color: #fafafa;
}
.section-title {
  color: #1565c0; /* primary color */
}
.section-title .q-icon {
  font-size: 24px;
}
.field-value {
  font-weight: 500;
  color: #333;
  margin-top: 2px;
}
.q-item-label--caption {
  font-size: 0.8rem;
}
/* END: New Profile Tab Styles */


/* --- Full Page Layout Styles --- */
.portal-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden; /* Prevents the whole page from scrolling */
}

.sticky-header {
  flex-shrink: 0; /* Prevents header from shrinking */
}

.page-wrapper {
  flex-grow: 1; /* Makes this container fill the remaining vertical space */
  overflow: hidden; /* Important to contain sidebar/content scrolling */
}

.sidebar {
  width: 260px;
  flex-shrink: 0; /* Prevents sidebar from shrinking if window is too small */
  background-color: #1565c0;
  color: #f0f4f8;
  display: flex;
  flex-direction: column;
}

.content-area {
  flex-grow: 1; /* Makes content area fill remaining horizontal space */
  overflow-y: auto; /* This makes ONLY the content area scrollable */
  background-color: #F0F7FF;
}
/* --- End of Layout Styles --- */


/* Sidebar Styles */
.sidebar-section { border-bottom: 1px solid rgba(255,255,255,0.1); }
.nav-list .q-item { color: #BCCCDC; padding-top: 12px; padding-bottom: 12px; margin: 4px 12px; border-radius: 8px; }
.active-link { background-color: #00529b !important; color: #ffffff !important; font-weight: 600; }

/* Content Area Styles */
.content-title { color: #0D1B2A; }
.subtitle-text { color: #5A7184; }
.list-item-title { color: #0D1B2A; }
.control-bar {
  background-color: #ffffff;
  border-radius: 12px;
  border: 1px solid #DDE8F5;
}

/* Kanban Board Styles */
.kanban-board-wrapper {
  flex-grow: 1;
  overflow-x: auto;
  padding: 8px 0;
}
.kanban-board { min-height: 100%; }
.kanban-column {
  width: 310px;
  min-width: 310px;
  background-color: #eaf2ff;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
}
.column-header {
  padding: 12px 16px;
  color: #1E4267;
  display: flex;
  align-items: center;
}
.header-badge {
  background-color: #d1e3f8;
  color: #10316B;
  font-weight: 600;
}
.column-title {
  flex-grow: 1;
}
.column-body {
  flex-grow: 1;
  padding: 0 8px 8px 8px;
  overflow-y: auto;
}

/* Candidate Card Styles */
.candidate-card {
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
  position: relative;
  overflow: hidden;
}
.candidate-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}
.status-strip {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
}
.status-color-blue { background-color: #3a86ff; }
.status-color-orange { background-color: #fb8500; }
.status-color-purple { background-color: #8338ec; }
.status-color-teal { background-color: #2196f3; }
.status-color-positive { background-color: #2dc653; }
.status-color-negative { background-color: #d90429; }
.fade-list-enter-active,
.fade-list-leave-active {
  transition: all 0.4s ease;
}
.fade-list-enter-from,
.fade-list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>

<style lang="scss">
/* Global styles to ensure a true full-height layout */
body, html {
  margin: 0;
  padding: 0;
  overflow: hidden !important; /* Prevents the body itself from ever scrolling */
}
</style>