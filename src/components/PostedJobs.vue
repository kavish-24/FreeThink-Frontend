<template>
  <div class="portal-layout">
    <AppHeader class="sticky-header" />
    
    <div class="page-wrapper">
      <EmployerSidebar :active-link="selected" @navigate="(label) => selected = label" />

      <!-- Main Content Area -->
      <div class="content-area">
        <div class="content-container">
          <!-- Loading State -->
          <div v-if="loading" class="loading-container">
            <q-spinner-dots size="60px" color="primary" />
            <div class="loading-text">Loading your jobs...</div>
          </div>

          <!-- Main Content -->
          <template v-else>
            <!-- Page Header -->
            <div class="page-header">
              <div class="page-title-section">
                <h1 class="page-title">All Posted Jobs</h1>
                <p class="page-subtitle">Manage, edit, and review your company's job listings.</p>
              </div>
              
              <q-btn 
                color="primary" 
                icon="add" 
                label="Post New Job" 
                @click="$router.push('/post-job')"
                class="post-job-btn"
                no-caps
                unelevated
              />
            </div>
            
            <!-- Status Banner -->
            <q-slide-transition>
              <q-banner 
                v-if="showStatusBanner" 
                :class="`banner-${statusBanner.color}`" 
                rounded 
                class="status-banner"
              >
                <template v-slot:avatar>
                  <q-icon :name="statusBanner.icon" size="24px" />
                </template>
                <div class="banner-message">{{ statusBanner.message }}</div>
              </q-banner>
            </q-slide-transition>

            <!-- Filters and Search -->
            <q-card flat class="filters-card">
              <q-card-section class="filters-section">
                <div class="filters-grid">
                  <div class="search-field">
                    <q-input 
                      v-model="searchQuery" 
                      placeholder="Search by job title or location..." 
                      outlined
                      dense
                      debounce="300"
                      clearable
                      class="search-input"
                    >
                      <template v-slot:prepend>
                        <q-icon name="search" color="grey-6" />
                      </template>
                    </q-input>
                  </div>
                  
                  <div class="filter-field">
                    <q-select 
                      v-model="statusFilter" 
                      :options="statusOptions" 
                      label="Filter by Status" 
                      outlined
                      dense
                      emit-value
                      map-options
                      class="status-filter"
                    />
                  </div>
                  
                  <div class="stats-section">
                    <div class="stat-item">
                      <span class="stat-number">{{ filteredJobs.length }}</span>
                      <span class="stat-label">Jobs</span>
                    </div>
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <!-- Empty State -->
            <div v-if="!jobs.length && !loading" class="empty-state">
              <div class="empty-icon-container">
                <q-icon name="work_off" class="empty-icon" />
              </div>
              <h3 class="empty-title">No jobs posted yet</h3>
              <p class="empty-description">Start building your team by creating your first job posting</p>
              <q-btn 
                color="primary" 
                icon="add" 
                label="Post Your First Job" 
                @click="$router.push('/post-job')"
                no-caps
                unelevated
                size="lg"
                class="empty-action-btn"
              />
            </div>

            <!-- Jobs Grid/Table -->
            <div v-else-if="filteredJobs.length" class="jobs-container">
              <!-- Desktop Table View -->
              <q-table 
                v-if="$q.screen.gt.sm"
                :rows="filteredJobs" 
                :columns="columns" 
                row-key="id" 
                flat
                class="jobs-table"
                :pagination="pagination"
                @update:pagination="pagination = $event"
                :rows-per-page-options="[5, 10, 20, 0]"
                :loading="loading"
                separator="none"
              >
                <template v-slot:body-cell-title="props">
                  <q-td :props="props" class="title-cell">
                    <div class="job-title">{{ props.row.title }}</div>
                    <div class="job-location">
                      <q-icon name="location_on" size="14px" class="location-icon" />
                      {{ props.row.location || 'Remote' }}
                    </div>
                  </q-td>
                </template>

                <template v-slot:body-cell-datePosted="props">
                  <q-td :props="props" class="date-cell">
                    {{ formatDate(props.row.createdAt) }}
                  </q-td>
                </template>

                <template v-slot:body-cell-deadline="props">
                  <q-td :props="props" class="deadline-cell">
                    <div :class="{ 'deadline-warning': isDeadlineSoon(props.row.deadline) }">
                      {{ formatDate(props.row.deadline) }}
                    </div>
                    <div v-if="isDeadlineSoon(props.row.deadline)" class="deadline-alert">
                      <q-icon name="warning" size="12px" />
                      Deadline approaching
                    </div>
                  </q-td>
                </template>

                <template v-slot:body-cell-applicants="props">
                  <q-td :props="props" class="applicants-cell">
                    <q-chip 
                      :color="props.row.applicants > 0 ? 'primary' : 'grey-4'" 
                      :text-color="props.row.applicants > 0 ? 'white' : 'grey-7'"
                      dense
                      class="applicants-chip"
                    >
                      {{ props.row.applicants || 0 }}
                    </q-chip>
                  </q-td>
                </template>

                <template v-slot:body-cell-status="props">
                  <q-td :props="props" class="status-cell">
                    <div class="status-container">
                      <q-badge 
                        :class="`status-badge status-${getStatusClass(props.row.status)}`"
                        :title="props.row.rejectionReason ? `Rejection: ${props.row.rejectionReason}` : ''"
                      >
                        <q-icon :name="getStatusIcon(props.row.status)" size="12px" class="status-icon" />
                        {{ formatStatus(props.row.status) }}
                      </q-badge>
                      
                      <q-tooltip 
                        v-if="props.row.rejectionReason" 
                        anchor="top middle" 
                        self="bottom middle"
                        class="rejection-tooltip"
                      >
                        <div class="tooltip-content">
                          <div class="tooltip-title">Rejection Reason:</div>
                          <div class="tooltip-text">{{ props.row.rejectionReason }}</div>
                          <div v-if="props.row.updatedAt" class="tooltip-date">
                            Updated: {{ formatDate(props.row.updatedAt) }}
                          </div>
                        </div>
                      </q-tooltip>
                    </div>
                  </q-td>
                </template>

                <template v-slot:body-cell-actions="props">
                  <q-td :props="props" class="actions-cell">
                    <div class="action-buttons">
                      <q-btn 
                        v-if="['open','closed' ,'approved'].includes(props.row.status)" 
                        flat 
                        round 
                        dense 
                        icon="groups" 
                        color="primary" 
                        @click="viewApplicants(props.row.id)"
                        class="action-btn"
                      >
                        <q-tooltip>View Applicants</q-tooltip>
                      </q-btn>
                      
                      <q-btn 
                        v-if="['draft', 'closed','rejected', 'open'].includes(props.row.status)" 
                        flat 
                        round 
                        dense 
                        icon="edit" 
                        color="grey-8" 
                        @click="editJob(props.row)" 
                        class="action-btn"
                      >
                        <q-tooltip>Edit Job</q-tooltip>
                      </q-btn>
                      
                      <q-btn 
                        flat 
                        round 
                        dense 
                        icon="visibility" 
                        color="info" 
                        @click="viewJob(props.row.id)" 
                        class="action-btn"
                      >
                        <q-tooltip>View Details</q-tooltip>
                      </q-btn>
                      
                      <q-btn 
                        flat 
                        round 
                        dense 
                        icon="delete" 
                        color="negative" 
                        @click="confirmDelete(props.row)" 
                        class="action-btn"
                      
                      >
                        <q-tooltip>
                          {{ 'Delete Job' }}
                        </q-tooltip>
                      </q-btn>
                    </div>
                  </q-td>
                </template>
              </q-table>

              <!-- Mobile Card View -->
              <div v-else class="mobile-jobs-grid">
                <q-card 
                  v-for="job in filteredJobs" 
                  :key="job.id" 
                  class="job-card"
                  flat
                  bordered
                >
                  <q-card-section class="job-card-header">
                    <div class="job-card-title">{{ job.title }}</div>
                    <div class="job-card-location">
                      <q-icon name="location_on" size="14px" />
                      {{ job.location || 'Remote' }}
                    </div>
                  </q-card-section>

                  <q-card-section class="job-card-content">
                    <div class="job-card-row">
                      <span class="label">Posted:</span>
                      <span class="value">{{ formatDate(job.createdAt) }}</span>
                    </div>
                    <div class="job-card-row">
                      <span class="label">Deadline:</span>
                      <span class="value" :class="{ 'deadline-warning': isDeadlineSoon(job.deadline) }">
                        {{ formatDate(job.deadline) }}
                      </span>
                    </div>
                    <div class="job-card-row">
                      <span class="label">Applicants:</span>
                      <q-chip 
                        :color="job.applicants > 0 ? 'primary' : 'grey-4'" 
                        :text-color="job.applicants > 0 ? 'white' : 'grey-7'"
                        dense
                        size="sm"
                      >
                        {{ job.applicants || 0 }}
                      </q-chip>
                    </div>
                    <div class="job-card-row">
                      <span class="label">Status:</span>
                      <q-badge :class="`status-badge status-${getStatusClass(job.status)}`">
                        <q-icon :name="getStatusIcon(job.status)" size="12px" class="status-icon" />
                        {{ formatStatus(job.status) }}
                      </q-badge>
                    </div>
                  </q-card-section>

                  <q-card-actions class="job-card-actions">
                    <q-btn 
                      v-if="['open','closed ', 'approved'].includes(job.status)" 
                      flat 
                      dense 
                      icon="groups" 
                      label="Applicants"
                      color="primary" 
                      @click="viewApplicants(job.id)"
                      no-caps
                    />
                    <q-btn 
                      v-if="['draft', 'closed', 'open'].includes(job.status)" 
                      flat 
                      dense 
                      icon="edit" 
                      label="Edit"
                      color="grey-8" 
                      @click="editJob(job)" 
                      no-caps
                    />
                    <q-btn 
                      flat 
                      dense 
                      icon="visibility" 
                      label="View"
                      color="info" 
                      @click="viewJob(job.id)" 
                      no-caps
                    />
                    <q-space />
                    <q-btn 
                      flat 
                      round 
                      dense 
                      icon="delete" 
                      color="negative" 
                      @click="confirmDelete(job)" 
                      
                    >
                      <q-tooltip>Delete</q-tooltip>
                    </q-btn>
                  </q-card-actions>
                </q-card>
              </div>
            </div>

            <!-- No Results State -->
            <div v-else class="no-results-state">
              <q-icon name="search_off" class="no-results-icon" />
              <h3 class="no-results-title">No jobs found</h3>
              <p class="no-results-description">Try adjusting your search or filter criteria</p>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Edit Job Dialog -->
    <q-dialog v-model="showEditDialog" persistent max-width="800px">
      <q-card class="edit-dialog">
        <q-card-section class="dialog-header">
          <div class="dialog-title">
            <q-icon name="edit" class="dialog-icon" />
            <span>Edit Job</span>
          </div>
          <q-btn 
            flat 
            round 
            dense 
            icon="close" 
            @click="closeEditDialog"
            class="close-btn"
          />
        </q-card-section>

        <q-separator />

        <q-card-section class="dialog-content">
          <div v-if="editLoading" class="loading-section">
            <q-spinner-dots size="40px" color="primary" />
            <div class="loading-text">Loading job details...</div>
          </div>

          <q-form v-else @submit.prevent="saveJob" class="edit-form">
            <div class="form-grid">
              <!-- Job Title -->
              <div class="form-field full-width">
                <q-input
                  v-model="editForm.title"
                  label="Job Title *"
                  outlined
                  dense
                  :rules="[val => !!val || 'Job title is required']"
                  class="form-input"
                />
              </div>

              <!-- Location and Type -->
              <div class="form-field">
                <q-input
                  v-model="editForm.location"
                  label="Location"
                  outlined
                  dense
                  placeholder="e.g., New York, NY or Remote"
                  class="form-input"
                />
              </div>

              <div class="form-field">
                <q-select
                  v-model="editForm.type"
                  :options="jobTypeOptions"
                  label="Job Type"
                  outlined
                  dense
                  emit-value
                  map-options
                  class="form-input"
                />
              </div>

              <!-- Salary and Experience -->
              <div class="form-field">
                <q-input
                  v-model="editForm.salary"
                  label="Salary Range"
                  outlined
                  dense
                  placeholder="e.g., $50,000 - $70,000"
                  class="form-input"
                />
              </div>

              <div class="form-field">
                <q-input
                  v-model="editForm.experience"
                  label="Min. Experience (years)"
                  outlined
                  dense
                  type="number"
                  min="0"
                  class="form-input"
                />
              </div>

              <!-- Education and Deadline -->
              <div class="form-field">
                <q-select
                  v-model="editForm.education"
                  :options="educationOptions"
                  label="Education Level"
                  outlined
                  dense
                  emit-value
                  map-options
                  class="form-input"
                />
              </div>

              <div class="form-field">
                <q-input
                  v-model="editForm.deadline"
                  label="Application Deadline"
                  outlined
                  dense
                  type="date"
                  :min="today"
                  class="form-input"
                />
              </div>

              <!-- Description -->
              <div class="form-field full-width">
                <q-input
                  v-model="editForm.description"
                  label="Job Description *"
                  outlined
                  type="textarea"
                  rows="4"
                  :rules="[val => !!val || 'Job description is required']"
                  class="form-input"
                />
              </div>

              <!-- Skills -->
              <div class="form-field full-width">
                <q-select
                  v-model="editForm.skills"
                  :options="skillOptions"
                  label="Required Skills"
                  outlined
                  multiple
                  use-chips
                  use-input
                  input-debounce="0"
                  @new-value="createSkill"
                  class="form-input"
                >
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        Type to add new skills
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>

              <!-- Tags -->
              <div class="form-field full-width">
                <q-select
                  v-model="editForm.tags"
                  :options="tagOptions"
                  label="Job Tags"
                  outlined
                  multiple
                  use-chips
                  use-input
                  input-debounce="0"
                  @new-value="createTag"
                  class="form-input"
                >
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        Type to add new tags
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>

              <!-- Benefits -->
              <div class="form-field full-width">
                <q-input
                  v-model="editForm.benefits"
                  label="Benefits & Perks"
                  outlined
                  type="textarea"
                  rows="2"
                  placeholder="e.g., Health insurance, Remote work, Flexible hours..."
                  class="form-input"
                />
              </div>

              <!-- Status -->
              <div class="form-field">
                <q-select
                  v-model="editForm.status"
                  :options="statusOptionsForEdit"
                  label="Job Status"
                  outlined
                  dense
                  emit-value
                  map-options
                  class="form-input"
                />
              </div>
            </div>
          </q-form>
        </q-card-section>

        <q-separator />

        <q-card-actions class="dialog-actions">
          <q-btn 
            flat 
            label="Cancel" 
            @click="closeEditDialog"
            class="cancel-btn"
          />
          <q-space />
          <q-btn 
            color="primary" 
            label="Save Changes" 
            @click="saveJob"
            :loading="saveLoading"
            :disable="!isFormValid"
            class="save-btn"
            no-caps
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter} from 'vue-router';
import { useQuasar, date } from 'quasar';
import AppHeader from 'src/components/HeaderPart.vue';
import EmployerSidebar from 'src/components/EmployerSidebar.vue';
import api from 'src/services/auth.service.js';
import { authHelpers } from 'src/services/auth.service.js';

const router = useRouter();

const $q = useQuasar();

// State
const selected = ref('Posted Jobs');
const jobs = ref([]);
const jobToDelete = ref(null);
const searchQuery = ref('');
const statusFilter = ref('All');
const loading = ref(false);
const showStatusBanner = ref(false);
const statusBanner = ref({
  message: '',
  color: 'positive',
  icon: 'check_circle'
});

// Edit dialog state
const showEditDialog = ref(false);
const editingJob = ref(null);
const editLoading = ref(false);
const saveLoading = ref(false);
const editForm = ref({
  title: '',
  description: '',
  location: '',
  type: '',
  salary: '',
  deadline: '',
  skills: [],
  status: '',
  tags: [],
  benefits: '',
  education: '',
  experience: 0
});

// Form options
const jobTypeOptions = [
  { label: 'Full-time', value: 'full-time' },
  { label: 'Part-time', value: 'part-time' },
  { label: 'Contract', value: 'contract' },
  { label: 'Freelance', value: 'freelance' },
  { label: 'Internship', value: 'internship' }
];

const educationOptions = [
  { label: 'High School', value: 'high-school' },
  { label: 'Bachelor\'s Degree', value: 'bachelors' },
  { label: 'Master\'s Degree', value: 'masters' },
  { label: 'PhD', value: 'phd' },
  { label: 'Any', value: 'any' }
];

const statusOptionsForEdit = [
  { label: 'Draft', value: 'draft' },
  { label: 'Open', value: 'open' },
  { label: 'Closed', value: 'closed' }
];

const skillOptions = ref([
  'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'SQL', 'HTML', 'CSS',
  'TypeScript', 'Vue.js', 'Angular', 'PHP', 'C++', 'C#', 'Swift', 'Kotlin',
  'Go', 'Ruby', 'Rust', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP',
  'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Git', 'Linux'
]);

const tagOptions = ref([
  'Remote', 'Hybrid', 'On-site', 'Entry Level', 'Mid Level', 'Senior Level',
  'Management', 'Leadership', 'Startup', 'Enterprise', 'Flexible Hours',
  'Health Benefits', 'Stock Options', 'Competitive Salary', 'Growth Opportunity'
]);

// Get current user ID for company_id
const currentUser = authHelpers.getCurrentUser();
const companyId = currentUser?.id;

const statusOptions = [
  { label: 'All', value: 'All' },
  { label: 'Draft', value: 'draft' },
  { label: 'Open', value: 'open' },
  { label: 'Pending Review', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Closed', value: 'closed' }
];

const pagination = ref({
  sortBy: 'createdAt',
  descending: true,
  page: 1,
  rowsPerPage: 10
});

const columns = [
  { 
    name: 'title', 
    label: 'Job Title', 
    field: 'title', 
    align: 'left', 
    sortable: true,
    style: 'width: 30%'
  },
  { 
    name: 'datePosted', 
    label: 'Date Posted', 
    field: 'createdAt', 
    align: 'left', 
    sortable: true,
    style: 'width: 15%'
  },
  { 
    name: 'deadline', 
    label: 'Deadline', 
    field: 'deadline', 
    align: 'left', 
    sortable: true,
    style: 'width: 15%'
  },
  { 
    name: 'applicants', 
    label: 'Applicants', 
    field: 'applicants', 
    align: 'center', 
    sortable: true,
    style: 'width: 12%'
  },
  { 
    name: 'status', 
    label: 'Status', 
    field: 'status', 
    align: 'center', 
    sortable: true,
    style: 'width: 15%'
  },
  { 
    name: 'actions', 
    label: 'Actions', 
    field: 'actions', 
    align: 'right',
    style: 'width: 13%'
  }
];

const filteredJobs = computed(() => {
  let filtered = jobs.value;
  
  if (statusFilter.value && statusFilter.value !== 'All') {
    filtered = filtered.filter(job => job.status === statusFilter.value);
  }
  
  if (searchQuery.value) {
    const lower = searchQuery.value.toLowerCase();
    filtered = filtered.filter(job => 
      job.title.toLowerCase().includes(lower) ||
      (job.location && job.location.toLowerCase().includes(lower))
    );
  }
  
  return filtered;
});

// Computed properties for edit form
const today = computed(() => {
  const now = new Date();
  return now.toISOString().split('T')[0];
});

const isFormValid = computed(() => {
  return editForm.value.title.trim() !== '' && 
         editForm.value.description.trim() !== '';
});

// Helper methods for edit form
const createSkill = (val, done) => {
  if (val.length > 0) {
    if (!skillOptions.value.includes(val)) {
      skillOptions.value.push(val);
    }
    done(val, 'add-unique');
  }
};

const createTag = (val, done) => {
  if (val.length > 0) {
    if (!tagOptions.value.includes(val)) {
      tagOptions.value.push(val);
    }
    done(val, 'add-unique');
  }
};

// All the existing methods remain the same...
const fetchJobs = async () => {
  if (!companyId) {
    showStatusMessage('No company ID found', 'negative', 'error');
    return;
  }

  loading.value = true;
  
  try {
    const response = await api.get(`jobs/jobs/company/${companyId}`);
    
    if (response.data.success) {
      jobs.value = response.data.jobs.map(job => ({
        id: job.id,
        title: job.title,
        description: job.description,
        location: job.location,
        type: job.type,
        status: job.status || 'draft',
        deadline: job.deadline,
        createdAt: job.createdAt,
        updatedAt: job.updatedAt,
        salary: job.salary_range,
        experience: job.experience_min,
        benefits: job.benefits,
        education: job.education,
        category: job.category,
        skills: typeof job.skills === 'string' ? JSON.parse(job.skills || '[]') : (job.skills || []),
        tags: typeof job.tags === 'string' ? JSON.parse(job.tags || '[]') : (job.tags || []),
        applicants: job.applicants || 0,
        rejectionReason: job.rejectionReason || null
      }));
      
      showStatusMessage(`Loaded ${jobs.value.length} jobs successfully`, 'positive', 'check_circle');
    } else {
      throw new Error(response.data.error || 'Failed to fetch jobs');
    }
  } catch (error) {
    console.error('Error fetching jobs:', error);
    showStatusMessage(
      error.response?.data?.error || error.message || 'Failed to load jobs', 
      'negative', 
      'error'
    );
    jobs.value = [];
  } finally {
    loading.value = false;
  }
};

const showStatusMessage = (message, color = 'positive', icon = 'check_circle') => {
  statusBanner.value = { message, color, icon };
  showStatusBanner.value = true;
  setTimeout(() => {
    showStatusBanner.value = false;
  }, 5000);
};

const viewApplicants = (jobId) => {
  router.push({
    path: '/candidates',
    query: { jobId }  // <-- pass jobId as query param
  });
};


const viewJob = (jobId) => {
  router.push(`/job/${jobId}`);
};

const editJob = async (job) => {
  editingJob.value = job;
  editLoading.value = true;
  showEditDialog.value = true;

  try {
    // Fetch the complete job details
    const response = await api.get(`/jobs/jobs/${job.id}`);
    
    if (response.data.success) {
      const jobData = response.data.job;
      
      // Populate the edit form
      editForm.value = {
        title: jobData.title || '',
        description: jobData.description || '',
        location: jobData.location || '',
        type: jobData.type || '',
        salary: jobData.salary_range || jobData.salary || '',
        deadline: jobData.deadline ? jobData.deadline.split('T')[0] : '',
        skills: Array.isArray(jobData.skills) ? jobData.skills : [],
        status: jobData.status || 'draft',
        tags: Array.isArray(jobData.tags) ? jobData.tags : [],
        benefits: jobData.benefits || '',
        education: jobData.education || '',
        experience: jobData.experience_min || jobData.experience || 0
      };
    } else {
      throw new Error(response.data.error || 'Failed to fetch job details');
    }
  } catch (error) {
    console.error('Error fetching job details:', error);
    showStatusMessage('Failed to load job details', 'negative', 'error');
    closeEditDialog();
  } finally {
    editLoading.value = false;
  }
};

const closeEditDialog = () => {
  showEditDialog.value = false;
  editingJob.value = null;
  editForm.value = {
    title: '',
    description: '',
    location: '',
    type: '',
    salary: '',
    deadline: '',
    skills: [],
    status: '',
    tags: [],
    benefits: '',
    education: '',
    experience: 0
  };
};

const saveJob = async () => {
  if (!isFormValid.value || !editingJob.value) return;

  saveLoading.value = true;

  try {
    const payload = {
      title: editForm.value.title.trim(),
      description: editForm.value.description.trim(),
      location: editForm.value.location.trim(),
      type: editForm.value.type,
      salary: editForm.value.salary.trim(),
      deadline: editForm.value.deadline || null,
      skills: editForm.value.skills,
      status: editForm.value.status,
      tags: editForm.value.tags,
      benefits: editForm.value.benefits.trim(),
      education: editForm.value.education,
      experience: Number(editForm.value.experience) || 0
    };

    const response = await api.put(`/jobs/jobs/${editingJob.value.id}`, payload);

    if (response.data.success) {
      // Update the job in the local jobs array
      const jobIndex = jobs.value.findIndex(j => j.id === editingJob.value.id);
      if (jobIndex !== -1) {
        jobs.value[jobIndex] = {
          ...jobs.value[jobIndex],
          ...payload,
          salary_range: payload.salary,
          experience_min: payload.experience,
          updatedAt: new Date().toISOString()
        };
      }

      showStatusMessage('Job updated successfully', 'positive', 'check_circle');
      closeEditDialog();
    } else {
      throw new Error(response.data.error || 'Failed to update job');
    }
  } catch (error) {
    console.error('Error updating job:', error);
    showStatusMessage(
      error.response?.data?.error || error.message || 'Failed to update job',
      'negative',
      'error'
    );
  } finally {
    saveLoading.value = false;
  }
};

const confirmDelete = (job) => {
  jobToDelete.value = job;
  $q.dialog({
    title: 'Confirm Delete',
    message: `Are you sure you want to delete "${job.title}"? This action cannot be undone.`,
    persistent: true,
    ok: {
      label: 'Delete',
      color: 'negative',
      flat: true
    },
    cancel: {
      label: 'Cancel',
      flat: true
    }
  }).onOk(() => deleteJob());
};

const deleteJob = async () => {
  if (!jobToDelete.value) return;
  
  try {
    await api.delete(`jobs/jobs/${jobToDelete.value.id}`);
    jobs.value = jobs.value.filter(job => job.id !== jobToDelete.value.id);
    showStatusMessage('Job deleted successfully', 'positive', 'delete');
  } catch (error) {
    console.error('Error deleting job:', error);
    showStatusMessage('Failed to delete job', 'negative', 'error');
  } finally {
    jobToDelete.value = null;
  }
};

const isDeadlineSoon = (deadline) => {
  if (!deadline) return false;
  const deadlineDate = new Date(deadline);
  const now = new Date();
  const daysUntilDeadline = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24));
  return daysUntilDeadline <= 7 && daysUntilDeadline > 0;
};

const getStatusIcon = (status) => {
  const icons = {
    'draft': 'drafts',
    'open': 'work',
    'pending': 'schedule',
    'approved': 'check_circle',
    'rejected': 'warning',
    'closed': 'lock'
  };
  return icons[status] || 'help_outline';
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
 
    return date.formatDate(dateString, 'MMM D, YYYY');
  
};

const formatStatus = (status) => {
  const statusMap = {
    'draft': 'Draft',
    'open': 'Open',
    'pending': 'Pending',
    'approved': 'Approved',
    'rejected': 'Rejected',
    'closed': 'Closed'
  };
  return statusMap[status] || status;
};

const getStatusClass = (status) => {
  const classMap = {
    'draft': 'draft',
    'open': 'open',
    'pending': 'pending',
    'approved': 'approved',
    'rejected': 'rejected',
    'closed': 'closed'
  };
  return classMap[status] || 'draft';
};

onMounted(async () => {
  await fetchJobs();
});
</script>

<style scoped>
.portal-layout {
  min-height: 100vh;
  background-color: #f8fafc;
}

.sticky-header {
  position: sticky;
  top: 0;
  z-index: 1000;
}

.page-wrapper {
  display: flex;
  min-height: calc(100vh - 64px);
  position: relative;
}

/* Content Area */
.content-area {
  flex: 1;
  overflow-y: auto;
  background-color: #f8fafc;
}

.content-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px 24px;
}

/* Loading State */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  gap: 16px;
}

.loading-text {
  font-size: 16px;
  color: #64748b;
  font-weight: 500;
}

/* Page Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  gap: 24px;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: stretch;
  }
}

.page-title-section {
  flex: 1;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 8px 0;
  line-height: 1.2;
}

.page-subtitle {
  font-size: 16px;
  color: #64748b;
  margin: 0;
  line-height: 1.5;
}

.post-job-btn {
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.15);
  transition: all 0.2s ease;
}

.post-job-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
}

/* Status Banner */
.status-banner {
  margin-bottom: 24px;
  border-left: 4px solid currentColor;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.banner-positive {
  background-color: #f0fdf4;
  color: #16a34a;
  border-left-color: #16a34a;
}

.banner-negative {
  background-color: #fef2f2;
  color: #dc2626;
  border-left-color: #dc2626;
}

.banner-warning {
  background-color: #fffbeb;
  color: #d97706;
  border-left-color: #d97706;
}

.banner-message {
  font-weight: 500;
}

/* Filters Card */
.filters-card {
  margin-bottom: 24px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.filters-section {
  padding: 20px;
}

.filters-grid {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 20px;
  align-items: center;
}

@media (max-width: 768px) {
  .filters-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

.search-field {
  min-width: 0;
}

.search-input {
  max-width: 400px;
}

.filter-field {
  min-width: 200px;
}

@media (max-width: 768px) {
  .filter-field {
    min-width: 0;
  }
}

.stats-section {
  display: flex;
  gap: 24px;
}

.stat-item {
  text-align: center;
  padding: 8px 16px;
  background: #f1f5f9;
  border-radius: 8px;
  min-width: 80px;
}

.stat-number {
  display: block;
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
}

.stat-label {
  display: block;
  font-size: 12px;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Empty States */
.empty-state, .no-results-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
}

.empty-icon-container {
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}

.empty-icon {
  font-size: 48px;
  color: #94a3b8;
}

.no-results-icon {
  font-size: 64px;
  color: #94a3b8;
  margin-bottom: 24px;
}

.empty-title, .no-results-title {
  font-size: 24px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 12px 0;
}

.empty-description, .no-results-description {
  font-size: 16px;
  color: #64748b;
  margin: 0 0 32px 0;
  max-width: 400px;
}

.empty-action-btn {
  padding: 14px 28px;
  font-size: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.15);
}

/* Jobs Container */
.jobs-container {
  margin-top: 8px;
}

/* Desktop Table */
.jobs-table {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.jobs-table :deep(thead th) {
  background: #f8fafc;
  color: #374151;
  font-weight: 600;
  font-size: 14px;
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.jobs-table :deep(tbody td) {
  padding: 16px;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: top;
}

.jobs-table :deep(tbody tr:hover) {
  background-color: #fafbfc;
}

/* Table Cell Styles */
.title-cell {
  max-width: 250px;
}

.job-title {
  font-weight: 600;
  font-size: 15px;
  color: #0f172a;
  margin-bottom: 4px;
  line-height: 1.4;
}

.job-location {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #64748b;
}

.location-icon {
  color: #94a3b8;
}

.date-cell {
  font-size: 14px;
  color: #374151;
}

.deadline-cell {
  font-size: 14px;
}

.deadline-warning {
  color: #d97706;
  font-weight: 600;
}

.deadline-alert {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #d97706;
  margin-top: 2px;
}

.applicants-cell {
  text-align: center;
}

.applicants-chip {
  font-weight: 600;
  min-width: 40px;
}

.status-cell {
  text-align: center;
}

.status-container {
  display: inline-block;
  position: relative;
}

/* Status Badges */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
  min-width: 80px;
  justify-content: center;
  border: 1px solid transparent;
}

.status-icon {
  flex-shrink: 0;
}

.status-draft {
  background-color: #f1f5f9;
  color: #475569;
  border-color: #e2e8f0;
}

.status-open {
  background-color: #dbeafe;
  color: #1d4ed8;
  border-color: #bfdbfe;
}

.status-pending {
  background-color: #fef3c7;
  color: #d97706;
  border-color: #fde68a;
}

.status-approved {
  background-color: #d1fae5;
  color: #059669;
  border-color: #a7f3d0;
}

.status-rejected {
  background-color: #fee2e2;
  color: #dc2626;
  border-color: #fecaca;
}

.status-closed {
  background-color: #f3f4f6;
  color: #6b7280;
  border-color: #e5e7eb;
}

/* Action Buttons */
.actions-cell {
  text-align: right;
}

.action-buttons {
  display: flex;
  gap: 4px;
  justify-content: flex-end;
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.action-btn:hover {
  transform: translateY(-1px);
}

/* Tooltips */
.rejection-tooltip {
  max-width: 300px;
}

.tooltip-content {
  padding: 4px;
}

.tooltip-title {
  font-weight: 600;
  margin-bottom: 4px;
}

.tooltip-text {
  margin-bottom: 4px;
}

.tooltip-date {
  font-size: 11px;
  opacity: 0.8;
  font-style: italic;
}

/* Mobile Cards */
.mobile-jobs-grid {
  display: grid;
  gap: 16px;
}

.job-card {
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s ease;
  border: 1px solid #e2e8f0;
}

.job-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.job-card-header {
  padding: 20px 20px 12px;
  border-bottom: 1px solid #f1f5f9;
}

.job-card-title {
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 8px;
  line-height: 1.3;
}

.job-card-location {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #64748b;
}

.job-card-content {
  padding: 16px 20px;
}

.job-card-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.job-card-row:last-child {
  margin-bottom: 0;
}

.job-card-row .label {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}

.job-card-row .value {
  font-size: 14px;
  color: #0f172a;
  font-weight: 500;
}

.job-card-actions {
  padding: 12px 20px 20px;
  gap: 8px;
}

.job-card-actions .q-btn {
  font-size: 12px;
  padding: 8px 12px;
}

/* Responsive Design */
@media (max-width: 600px) {
  .content-container {
    padding: 20px 16px;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .page-subtitle {
    font-size: 14px;
  }
  
  .filters-section {
    padding: 16px;
  }
  
  .empty-state, .no-results-state {
    padding: 60px 20px;
  }
  
  .empty-title, .no-results-title {
    font-size: 20px;
  }
  
  .empty-description, .no-results-description {
    font-size: 14px;
  }
}

/* Animations */
@keyframes slideInFromTop {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.status-banner {
  animation: slideInFromTop 0.3s ease-out;
}

/* Print Styles */
@media print {
  .sidebar,
  .filters-card,
  .action-buttons,
  .post-job-btn,
  .status-banner {
    display: none !important;
  }
  
  .content-area {
    width: 100% !important;
  }
  
  .page-wrapper {
    display: block !important;
  }
}

/* Edit Dialog Styles */
.edit-dialog {
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  border-radius: 12px;
  overflow: hidden;
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-bottom: 1px solid #e2e8f0;
}

.dialog-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 600;
  color: #0f172a;
}

.dialog-icon {
  font-size: 24px;
  color: #3b82f6;
}

.close-btn {
  color: #64748b;
}

.close-btn:hover {
  color: #0f172a;
  background-color: rgba(148, 163, 184, 0.1);
}

.dialog-content {
  padding: 24px;
  max-height: 60vh;
  overflow-y: auto;
}

.loading-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 16px;
}

.loading-section .loading-text {
  font-size: 16px;
  color: #64748b;
  font-weight: 500;
}

.edit-form {
  width: 100%;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

.form-field {
  display: flex;
  flex-direction: column;
}

.form-field.full-width {
  grid-column: 1 / -1;
}

.form-input {
  width: 100%;
}

.form-input :deep(.q-field__control) {
  border-radius: 8px;
}

.form-input :deep(.q-field__label) {
  font-weight: 500;
  color: #374151;
}

.form-input :deep(.q-field--outlined .q-field__control) {
  border-color: #d1d5db;
}

.form-input :deep(.q-field--focused .q-field__control) {
  border-color: #3b82f6;
  box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.1);
}

.dialog-actions {
  padding: 16px 24px;
  background-color: #f8fafc;
  border-top: 1px solid #e2e8f0;
}

.cancel-btn {
  color: #64748b;
  font-weight: 500;
  padding: 8px 16px;
}

.cancel-btn:hover {
  background-color: rgba(148, 163, 184, 0.1);
  color: #0f172a;
}

.save-btn {
  padding: 10px 24px;
  font-weight: 600;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.15);
}

.save-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.25);
}

.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Form validation styles */
.form-input :deep(.q-field--error .q-field__control) {
  border-color: #ef4444;
}

.form-input :deep(.q-field--error .q-field__label) {
  color: #ef4444;
}

/* Chip styles in selects */
.form-input :deep(.q-chip) {
  background-color: #e0e7ff;
  color: #3730a3;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
}

.form-input :deep(.q-chip .q-icon) {
  color: #6366f1;
}

/* Custom scrollbar for dialog content */
.dialog-content::-webkit-scrollbar {
  width: 6px;
}

.dialog-content::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.dialog-content::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.dialog-content::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>