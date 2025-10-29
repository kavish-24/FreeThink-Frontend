<template>
  <div class="applications-container">
    <!-- Header Section -->
    <div class="applications-header">
      <div class="header-content">
        <div class="title-section">
          <h1 class="page-title gradient-text">My Applications</h1>
          <p class="page-subtitle">Track your job applications and their progress</p>
        </div>
        <div class="stats-badge">
          <div class="stat-item">
            <q-icon name="description" class="stat-icon" />
            <span class="stat-number">{{ applications.length }}</span>
            <span class="stat-label">Applications</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="loading-container">
      <div class="loading-content">
        <q-spinner-dots size="60px" color="primary" />
        <h3 class="loading-title">Loading Applications</h3>
        <p class="loading-subtitle">Fetching your latest application data...</p>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else-if="applications.length === 0" class="empty-state">
      <div class="empty-content">
        <div class="empty-icon">
          <q-icon name="work_outline" />
        </div>
        <h2 class="empty-title">No Applications Yet</h2>
        <p class="empty-subtitle">
          Ready to take the next step in your career? Start applying to jobs and track your progress here.
        </p>
        <q-btn 
          class="btn-unstop btn-primary btn-lg"
          icon="search"
          label="Browse Jobs"
          @click="navigateToJobs"
        />
      </div>
    </div>

    <!-- Applications Grid -->
    <div v-else class="applications-grid">
      <div
        v-for="(app, index) in applications"
        :key="app.id || index"
        class="application-card card-unstop card-interactive"
        @click="viewApplication(app)"
      >
        <!-- Card Header -->
        <div class="card-header">
          <div class="job-info">
            <h3 class="job-title">{{ app.job?.title || 'Job Title' }}</h3>
            <div class="company-info">
              <q-icon name="business" class="company-icon" />
              <span class="company-name">{{ app.job?.company || 'Company Name' }}</span>
            </div>
          </div>
          <div class="status-badge">
            <span 
              class="badge-unstop"
              :class="getStatusBadgeClass(app.status)"
            >
              {{ formatStatus(app.status) }}
            </span>
          </div>
        </div>

        <!-- Card Content -->
        <div class="card-content">
          <div class="job-details">
            <div class="detail-item">
              <q-icon name="place" class="detail-icon" />
              <span class="detail-text">{{ app.job?.location || 'Location not specified' }}</span>
            </div>
            <div class="detail-item">
              <q-icon name="attach_money" class="detail-icon" />
              <span class="detail-text">{{ app.job?.salary_range || 'Salary not specified' }}</span>
            </div>
            <div class="detail-item">
              <q-icon name="schedule" class="detail-icon" />
              <span class="detail-text">Applied {{ formatDate(app.applied_at) }}</span>
            </div>
           
          </div>

          <!-- Application Attachments -->
          <div class="attachments" v-if="app.cover_letter || app.resume_link">
            <div class="attachment-item" v-if="app.cover_letter">
              <q-icon name="description" class="attachment-icon" />
              <span class="attachment-text">Cover letter included</span>
            </div>
            <div class="attachment-item" v-if="app.resume_link">
              <q-icon name="attach_file" class="attachment-icon" />
              <span class="attachment-text">Resume attached</span>
            </div>
          </div>
        </div>

        <!-- Card Actions -->
        <div class="card-actions">
          <q-btn
            flat
            round
            icon="visibility"
            color="primary"
            size="sm"
            class="action-btn"
            @click.stop="viewApplication(app)"
          >
            <q-tooltip class="bg-grey-8">View Details</q-tooltip>
          </q-btn>
          <q-btn
            flat
            round
            icon="more_vert"
            color="grey-6"
            size="sm"
            class="action-btn"
            @click.stop="showMoreOptions"
          >
            <q-tooltip class="bg-grey-8">More Options</q-tooltip>
          </q-btn>
        </div>
      </div>
    </div>

    <!-- Application Details Dialog -->
    <q-dialog v-model="showDetailsDialog" maximized transition-show="slide-up" transition-hide="slide-down">
      <q-card class="application-details-dialog">
        <q-bar class="dialog-bar">
          <q-icon name="description" />
          <div class="dialog-title">Application Details</div>
          <q-space />
          <q-btn flat dense icon="close" v-close-popup />
        </q-bar>

        <q-card-section v-if="selectedApplication" class="dialog-content">
          <!-- Header Section -->
          <div class="dialog-header-section">
            <div class="job-header-info">
              <h2 class="dialog-job-title">{{ selectedApplication.job?.title }}</h2>
              <div class="job-meta-row">
                <div class="meta-chip">
                  <q-icon name="business" size="16px" />
                  <span>Company ID: {{ selectedApplication.job?.company_id }}</span>
                </div>
                <div class="meta-chip">
                  <q-icon name="place" size="16px" />
                  <span>{{ selectedApplication.job?.location }}</span>
                </div>
                <div class="meta-chip">
                  <q-icon name="work" size="16px" />
                  <span>{{ formatJobType(selectedApplication.job?.type) }}</span>
                </div>
              </div>
            </div>
            <div class="status-section">
              <span class="badge-unstop" :class="getStatusBadgeClass(selectedApplication.status)">
                {{ formatStatus(selectedApplication.status) }}
              </span>
            </div>
          </div>

          <q-separator class="section-separator" />

          <!-- ATS Score Section -->
          <div class="info-section" v-if="selectedApplication.ats_score || selectedApplication.ats_feedback">
            <div class="section-header">
              <q-icon name="analytics" class="section-icon" />
              <h3 class="section-title">ATS Analysis</h3>
            </div>
            <div class="ats-content">
              <div class="ats-score-card" v-if="selectedApplication.ats_score">
                <div class="score-display">
                  <div class="score-circle" :style="`background: conic-gradient(${getATSScoreColor(selectedApplication.ats_score)} ${selectedApplication.ats_score * 3.6}deg, #e5e7eb 0deg)`">
                
                  </div>
                  <div class="score-info">
                    <h4>Resume Match Score</h4>
                    <p>Your resume scored {{ selectedApplication.ats_score }}% match with job requirements</p>
                  </div>
                </div>
              </div>
              <div class="ats-feedback-card" v-if="selectedApplication.ats_feedback">
                <h4 class="feedback-title">
                  <q-icon name="feedback" />
                  Detailed Feedback
                </h4>
                <div class="feedback-content">{{ selectedApplication.ats_feedback }}</div>
              </div>
            </div>
          </div>

          <q-separator class="section-separator" />

          <!-- Job Description -->
          <div class="info-section">
            <div class="section-header">
              <q-icon name="description" class="section-icon" />
              <h3 class="section-title">Job Description</h3>
            </div>
            <p class="job-description">{{ selectedApplication.job?.description }}</p>
          </div>

          <q-separator class="section-separator" />

          <!-- Job Details Grid -->
          <div class="info-section">
            <div class="section-header">
              <q-icon name="info" class="section-icon" />
              <h3 class="section-title">Job Information</h3>
            </div>
            <div class="details-grid">
              <div class="detail-card">
                <div class="detail-label">Salary Range</div>
                <div class="detail-value">₹{{ selectedApplication.job?.salary_range || 'Not disclosed' }}</div>
              </div>
              <div class="detail-card">
                <div class="detail-label">Experience Required</div>
               <div class="detail-value">
  {{ selectedApplication.job?.experience_min ? selectedApplication.job.experience_min + '+ years' : 'Fresher' }}
</div>

              </div>
              <div class="detail-card">
                <div class="detail-label">Education</div>
                <div class="detail-value">{{ selectedApplication.job?.education || 'Not specified' }}</div>
              </div>
              <div class="detail-card">
                <div class="detail-label">Category</div>
                <div class="detail-value">{{ selectedApplication.job?.category || 'Not specified' }}</div>
              </div>
              <div class="detail-card">
                <div class="detail-label">Posted On</div>
                <div class="detail-value">{{ formatDate(selectedApplication.job?.posted_at) }}</div>
              </div>
              <div class="detail-card">
                <div class="detail-label">Deadline</div>
                <div class="detail-value">{{ formatDate(selectedApplication.job?.deadline) }}</div>
              </div>
            </div>
          </div>

          <q-separator class="section-separator" />

          <!-- Skills Required -->
          <div class="info-section" v-if="parseSkills(selectedApplication.job?.skills).length">
            <div class="section-header">
              <q-icon name="psychology" class="section-icon" />
              <h3 class="section-title">Skills Required</h3>
            </div>
            <div class="skills-chips">
              <q-chip
                v-for="skill in parseSkills(selectedApplication.job?.skills)"
                :key="skill"
                color="primary"
                text-color="white"
                icon="check_circle"
              >
                {{ skill }}
              </q-chip>
            </div>
          </div>

          <q-separator class="section-separator" v-if="parseSkills(selectedApplication.job?.skills).length" />

          <!-- Benefits -->
          <div class="info-section" v-if="selectedApplication.job?.benefits">
            <div class="section-header">
              <q-icon name="stars" class="section-icon" />
              <h3 class="section-title">Benefits</h3>
            </div>
            <p class="benefits-text">{{ selectedApplication.job?.benefits }}</p>
          </div>

          <q-separator class="section-separator" v-if="selectedApplication.job?.benefits" />

          <!-- Tags -->
          <div class="info-section" v-if="parseTags(selectedApplication.job?.tags).length">
            <div class="section-header">
              <q-icon name="label" class="section-icon" />
              <h3 class="section-title">Tags</h3>
            </div>
            <div class="tags-container">
              <q-chip
                v-for="tag in parseTags(selectedApplication.job?.tags)"
                :key="tag"
                color="grey-3"
                text-color="grey-8"
                size="sm"
              >
                {{ tag }}
              </q-chip>
            </div>
          </div>

          <q-separator class="section-separator" v-if="parseTags(selectedApplication.job?.tags).length" />

          <!-- Application Info -->
          <div class="info-section">
            <div class="section-header">
              <q-icon name="assignment" class="section-icon" />
              <h3 class="section-title">Your Application</h3>
            </div>
            <div class="application-info-grid">
              <div class="info-card">
                <q-icon name="event" size="24px" color="primary" />
                <div class="info-card-content">
                  <div class="info-card-label">Applied On</div>
                  <div class="info-card-value">{{ formatDate(selectedApplication.applied_at) }}</div>
                </div>
              </div>
              <div class="info-card" v-if="selectedApplication.cover_letter">
                <q-icon name="description" size="24px" color="primary" />
                <div class="info-card-content">
                  <div class="info-card-label">Cover Letter</div>
                  <div class="info-card-value">Included</div>
                </div>
              </div>
              <div class="info-card clickable" v-if="selectedApplication.resume_link" @click="downloadResume(selectedApplication.resume_link)">
                <q-icon name="attach_file" size="24px" color="primary" />
                <div class="info-card-content">
                  <div class="info-card-label">Resume</div>
                  <div class="info-card-value">View/Download</div>
                </div>
                <q-icon name="open_in_new" size="16px" color="grey-6" />
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="dialog-actions">
          <q-btn flat label="Close" color="grey-7" v-close-popup />
          <q-btn 
            v-if="selectedApplication?.resume_link"
            unelevated 
            label="View Resume" 
            color="primary" 
            icon="open_in_new"
            @click="downloadResume(selectedApplication.resume_link)" 
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/auth.service'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const router = useRouter()
const applications = ref([])
const loading = ref(false)
const selectedApplication = ref(null)
const showDetailsDialog = ref(false)

const emit = defineEmits(['applications-loaded'])

const fetchApplications = async () => {
  loading.value = true
  try {
    const response = await api.get('/applications/my-applications')
    if (response.data.success) {
      applications.value = response.data.applications
      // Emit the applications count to parent component
      emit('applications-loaded', response.data.applications.length)
    } else {
      throw new Error(response.data.message || 'Failed to fetch applications')
    }
  } catch (error) {
    console.error('Error fetching applications:', error)
    $q.notify({
      type: 'negative',
      message: 'Failed to load applications. Please try again.',
      position: 'top'
    })
  } finally {
    loading.value = false
  }
}

const parseSkills = (skills) => {
  if (Array.isArray(skills)) return skills
  if (!skills) return []
  if (typeof skills !== 'string') return []
  try {
    const parsed = JSON.parse(skills)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return skills.split(',').map(s => s.trim()).filter(Boolean)
  }
}

const parseTags = (tags) => {
  if (Array.isArray(tags)) return tags
  if (!tags) return []
  if (typeof tags !== 'string') return []
  try {
    const parsed = JSON.parse(tags)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return tags.split(',').map(s => s.trim()).filter(Boolean)
  }
}

const getStatusBadgeClass = (status) => {
  switch (status?.toLowerCase()) {
    case 'applied':
      return 'badge-primary'
    case 'under review':
    case 'reviewing':
      return 'badge-warning'
    case 'interview scheduled':
    case 'interview':
      return 'badge-info'
    case 'accepted':
    case 'hired':
      return 'badge-success'
    case 'rejected':
      return 'badge-error'
    case 'withdrawn':
      return 'badge-secondary'
    default:
      return 'badge-primary'
  }
}

const navigateToJobs = () => {
  router.push('/')
}

const showMoreOptions = () => {
  $q.notify({
    type: 'info',
    message: 'More options coming soon!',
    position: 'top'
  })
}

const formatStatus = (status) => {
  if (!status) return 'Applied'
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
}

const formatDate = (dateString) => {
  if (!dateString) return 'Unknown date'
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch {
    return 'Invalid date'
  }
}

const formatJobType = (type) => {
  if (!type) return 'Not specified'
  return type.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ')
}

const getATSScoreColor = (score) => {
  if (!score) return 'grey'
  if (score >= 80) return 'green'
  if (score >= 60) return 'orange'
  return 'red'
}

const viewApplication = (app) => {
  selectedApplication.value = app
  showDetailsDialog.value = true
}

const downloadResume = (resumeLink) => {
  if (resumeLink) {
    window.open(resumeLink, '_blank')
  }
}

onMounted(() => {
  fetchApplications()
})
</script>

<style scoped>
.applications-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  padding: var(--space-6);
}

.applications-header {
  margin-bottom: var(--space-8);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-6);
  flex-wrap: wrap;
}

.title-section {
  flex: 1;
}

.page-title {
  font-size: var(--font-size-4xl);
  font-weight: 800;
  font-family: var(--font-family-display);
  margin: 0 0 var(--space-2) 0;
  background: linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-gray-600);
  margin: 0;
  font-weight: 400;
}

.stats-badge {
  background: var(--color-surface);
  border-radius: var(--border-radius-xl);
  padding: var(--space-4) var(--space-6);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-gray-200);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.stat-icon {
  color: var(--color-primary-500);
  font-size: 1.5rem;
}

.stat-number {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-gray-800);
}

.stat-label {
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
  font-weight: 500;
}

/* Loading State */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.loading-content {
  text-align: center;
}

.loading-title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--color-gray-800);
  margin: var(--space-4) 0 var(--space-2) 0;
}

.loading-subtitle {
  font-size: var(--font-size-base);
  color: var(--color-gray-600);
  margin: 0;
}

/* Empty State */
.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 500px;
}

.empty-content {
  text-align: center;
  max-width: 400px;
}

.empty-icon {
  width: 120px;
  height: 120px;
  margin: 0 auto var(--space-6) auto;
  background: linear-gradient(135deg, var(--color-primary-100) 0%, var(--color-primary-200) 100%);
  border-radius: var(--border-radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-icon .q-icon {
  font-size: 4rem;
  color: var(--color-primary-500);
}

.empty-title {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-gray-800);
  margin: 0 0 var(--space-3) 0;
}

.empty-subtitle {
  font-size: var(--font-size-base);
  color: var(--color-gray-600);
  line-height: 1.6;
  margin: 0 0 var(--space-6) 0;
}

/* Applications Grid */
.applications-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: var(--space-6);
}

.application-card {
  background: var(--color-surface);
  border-radius: var(--border-radius-xl);
  padding: var(--space-6);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-gray-200);
  transition: all var(--transition-base);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.application-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--color-primary-500) 0%, var(--color-accent-purple) 100%);
  transform: scaleX(0);
  transition: transform var(--transition-base);
}

.application-card:hover::before {
  transform: scaleX(1);
}

.application-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-xl);
  border-color: var(--color-primary-200);
}

/* Card Header */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-4);
  gap: var(--space-4);
}

.job-info {
  flex: 1;
}

.job-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-gray-800);
  margin: 0 0 var(--space-2) 0;
  line-height: 1.4;
}

.company-info {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.company-icon {
  color: var(--color-gray-500);
  font-size: 1rem;
}

.company-name {
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
  font-weight: 500;
}

.status-badge {
  flex-shrink: 0;
}

/* Badge Styles */
.badge-unstop {
  display: inline-flex;
  align-items: center;
  padding: var(--space-1) var(--space-3);
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge-primary {
  background: var(--color-primary-100);
  color: var(--color-primary-700);
}

.badge-success {
  background: #dcfce7;
  color: #166534;
}

.badge-warning {
  background: #fef3c7;
  color: #92400e;
}

.badge-error {
  background: #fee2e2;
  color: #991b1b;
}

.badge-info {
  background: #dbeafe;
  color: #1e40af;
}

.badge-secondary {
  background: var(--color-gray-100);
  color: var(--color-gray-700);
}

/* Card Content */
.card-content {
  margin-bottom: var(--space-4);
}

.job-details {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
}

.detail-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.detail-icon {
  color: var(--color-gray-500);
  font-size: 1rem;
  width: 16px;
  flex-shrink: 0;
}

.detail-text {
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
}

.attachments {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  padding-top: var(--space-3);
  border-top: 1px solid var(--color-gray-200);
}

.attachment-item {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-2);
  background: var(--color-gray-100);
  border-radius: var(--border-radius-md);
}

.attachment-icon {
  color: var(--color-primary-500);
  font-size: 0.875rem;
}

.attachment-text {
  font-size: var(--font-size-xs);
  color: var(--color-gray-700);
  font-weight: 500;
}

/* Card Actions */
.card-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-2);
  padding-top: var(--space-3);
  border-top: 1px solid var(--color-gray-200);
}

.action-btn {
  transition: all var(--transition-base);
}

.action-btn:hover {
  transform: scale(1.1);
}

/* Responsive Design */
@media (max-width: 768px) {
  .applications-container {
    padding: var(--space-4);
  }
  
  .applications-grid {
    grid-template-columns: 1fr;
  }
  
  .header-content {
    flex-direction: column;
    align-items: stretch;
  }
  
  .page-title {
    font-size: var(--font-size-3xl);
  }
  
  .application-card {
    padding: var(--space-4);
  }
}

@media (max-width: 480px) {
  .card-header {
    flex-direction: column;
    align-items: stretch;
    gap: var(--space-3);
  }
  
  .status-badge {
    align-self: flex-start;
  }
}

/* Application Details Dialog Styles */
.application-details-dialog {
  background: white;
}

.dialog-bar {
  background: linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 100%);
  color: white;
  padding: 16px 20px;
}

.dialog-title {
  font-size: 18px;
  font-weight: 600;
  margin-left: 12px;
}

.dialog-content {
  max-width: 1000px;
  margin: 0 auto;
  padding: 32px 24px;
}

.dialog-header-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
  margin-bottom: 24px;
}

.job-header-info {
  flex: 1;
}

.dialog-job-title {
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 16px 0;
  line-height: 1.2;
}

.job-meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.meta-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #f3f4f6;
  border-radius: 20px;
  font-size: 14px;
  color: #374151;
}

.status-section {
  flex-shrink: 0;
}

.section-separator {
  margin: 32px 0;
}

.info-section {
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.section-icon {
  font-size: 28px;
  color: #0ea5e9;
}

.section-title {
  font-size: 22px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

/* ATS Section */
.ats-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.ats-score-card {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 16px;
  padding: 24px;
}

.score-display {
  display: flex;
  align-items: center;
  gap: 24px;
}

.score-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.score-inner {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.score-number {
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1;
}

.score-label {
  font-size: 12px;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 4px;
}

.score-info h4 {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 8px 0;
}

.score-info p {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
}

.ats-feedback-card {
  background: #f9fafb;
  border-radius: 12px;
  padding: 20px;
  border-left: 4px solid #0ea5e9;
}

.feedback-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 12px 0;
}

.feedback-content {
  font-size: 14px;
  line-height: 1.7;
  color: #374151;
  white-space: pre-wrap;
}

/* Job Description */
.job-description {
  font-size: 15px;
  line-height: 1.7;
  color: #374151;
  margin: 0;
}

/* Details Grid */
.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.detail-card {
  background: #f9fafb;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #e5e7eb;
}

.detail-label {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.detail-value {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
}

/* Skills and Tags */
.skills-chips,
.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.benefits-text {
  font-size: 15px;
  line-height: 1.7;
  color: #374151;
  margin: 0;
}

/* Application Info Grid */
.application-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.info-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: #f9fafb;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
}

.info-card.clickable {
  cursor: pointer;
}

.info-card.clickable:hover {
  background: #f3f4f6;
  border-color: #0ea5e9;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.15);
}

.info-card-content {
  flex: 1;
}

.info-card-label {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.info-card-value {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
}

.dialog-actions {
  padding: 20px 24px;
  border-top: 1px solid #e5e7eb;
}

/* Responsive Dialog */
@media (max-width: 768px) {
  .dialog-content {
    padding: 24px 16px;
  }

  .dialog-job-title {
    font-size: 24px;
  }

  .dialog-header-section {
    flex-direction: column;
  }

  .score-display {
    flex-direction: column;
    text-align: center;
  }

  .details-grid {
    grid-template-columns: 1fr;
  }

  .application-info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
