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
              <span class="detail-text">{{ app.job?.salary || 'Salary not specified' }}</span>
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { applicationService } from '../services/applicationService'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const router = useRouter()
const applications = ref([])
const loading = ref(false)

const emit = defineEmits(['applications-loaded'])

const fetchApplications = async () => {
  loading.value = true
  try {
    const response = await applicationService.getMyApplications()
    if (response.success) {
      applications.value = response.applications
      // Emit the applications count to parent component
      emit('applications-loaded', response.applications.length)
    } else {
      throw new Error(response.message || 'Failed to fetch applications')
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

const viewApplication = (app) => {
  $q.dialog({
    title: 'Application Details',
    message: `
      <div class="application-details-modal">
        <div class="modal-header">
          <h3>${app.job?.title || 'Job Title'}</h3>
          <span class="status-badge ${getStatusBadgeClass(app.status)}">${formatStatus(app.status)}</span>
        </div>
        <div class="modal-content">
          <div class="detail-row">
            <strong>Company:</strong> ${app.job?.company || 'N/A'}
          </div>
          <div class="detail-row">
            <strong>Location:</strong> ${app.job?.location || 'N/A'}
          </div>
          <div class="detail-row">
            <strong>Salary:</strong> ${app.job?.salary || 'Not specified'}
          </div>
          <div class="detail-row">
            <strong>Applied on:</strong> ${formatDate(app.applied_at)}
          </div>
          ${app.cover_letter ? '<div class="detail-row"><strong>Cover Letter:</strong> Included</div>' : ''}
          ${app.resume_link ? '<div class="detail-row"><strong>Resume:</strong> Attached</div>' : ''}
        </div>
      </div>
    `,
    html: true,
    ok: {
      label: 'Close',
      color: 'primary',
      flat: true
    }
  })
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
</style>
