<template>
  <div class="applications-container">
    <!-- Header Section -->
    <div class="applications-header">
      <div class="header-content">
        <div class="title-section">
          <h2 class="page-title">My Applications</h2>
          <p class="page-subtitle">Track and manage your job application progress</p>
        </div>
        <div class="stats-section">
          <div class="stat-item">
            <q-icon name="description" class="stat-icon" />
            <span class="stat-value">{{ applications.length }}</span>
            <span class="stat-label">Total Applications</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <q-icon name="trending_up" class="stat-icon success" />
            <span class="stat-value">{{ getActiveApplicationsCount() }}</span>
            <span class="stat-label">Active</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Filter Controls -->
    <div class="controls-section">
      <div class="filter-controls">
        <div class="filter-chips">
          <div 
            v-for="filter in statusFilters" 
            :key="filter.value"
            @click="selectedFilter = filter.value"
            :class="['filter-chip', { active: selectedFilter === filter.value }]"
          >
            <q-icon :name="filter.icon" class="filter-icon" />
            <span>{{ filter.label }}</span>
            <span class="filter-count">{{ getFilterCount(filter.value) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Applications List -->
    <div class="applications-list">
      <div v-if="filteredApplications.length === 0" class="empty-state">
        <div class="empty-icon">
          <q-icon name="inbox" />
        </div>
        <h3 class="empty-title">No applications found</h3>
        <p class="empty-description">
          {{ selectedFilter === 'all' ? 'Start applying to jobs to see them here' : `No applications with status "${selectedFilter}"` }}
        </p>
      </div>

      <div
        v-for="(app) in filteredApplications"
        :key="app.id"
        class="application-card"
        @click="viewApplication(app.id)"
      >
        <div :class="['status-bar', getStatusClass(app.status)]"></div>
        
        <div class="card-content">
          <div class="application-main">
            <div class="job-info">
              <h3 class="job-title">{{ app.position }}</h3>
              
              <div class="company-info">
                <div class="company-details">
                  <q-icon name="business" class="detail-icon" />
                  <span class="company-name">{{ app.company }}</span>
                </div>
                <div class="location-details">
                  <q-icon name="place" class="detail-icon" />
                  <span class="location-text">{{ app.location }}</span>
                </div>
                <div class="salary-details">
                  <q-icon name="payments" class="detail-icon" />
                  <span class="salary-text">{{ app.salary }}</span>
                </div>
              </div>

              <div class="application-meta">
                <div class="date-info">
                  <q-icon name="schedule" class="meta-icon" />
                  <span>Applied {{ formatDate(app.date) }}</span>
                </div>
                <div class="progress-info">
                  <q-icon name="timeline" class="meta-icon" />
                  <span>{{ getProgressText(app.status) }}</span>
                </div>
              </div>
            </div>

            <div class="application-actions">
              <div class="status-section">
                <div :class="['status-badge', getStatusClass(app.status)]">
                  <q-icon :name="getStatusIcon(app.status)" class="status-icon" />
                  <span class="status-text">{{ app.status }}</span>
                </div>
                <div class="progress-indicator">
                  <div class="progress-track">
                    <div 
                      :class="['progress-fill', getStatusClass(app.status)]"
                      :style="{ width: getProgressWidth(app.status) }"
                    ></div>
                  </div>
                  <span class="progress-text">{{ getProgressPercentage(app.status) }}% Complete</span>
                </div>
              </div>

              <div class="action-buttons">
                <q-btn
                  flat
                  round
                  icon="visibility"
                  class="action-btn view-btn"
                  @click.stop="viewApplication(app.id)"
                >
                  <q-tooltip class="professional-tooltip">View Details</q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  round
                  icon="edit"
                  class="action-btn edit-btn"
                  @click.stop="editApplication(app.id)"
                >
                  <q-tooltip class="professional-tooltip">Edit Application</q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  round
                  icon="more_vert"
                  class="action-btn menu-btn"
                  @click.stop="showMenu(app.id)"
                >
                  <q-tooltip class="professional-tooltip">More Options</q-tooltip>
                </q-btn>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, computed } from 'vue';

const router = useRouter();
const selectedFilter = ref('all');

const applications = [
  {
    id: 'app-001',
    position: 'Senior Frontend Developer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    salary: '$120k - $150k',
    date: '2024-01-15',
    status: 'Under Review'
  },
  {
    id: 'app-003',
    position: 'UX Designer',
    company: 'DesignStudio',
    location: 'New York, NY',
    salary: '$80k - $110k',
    date: '2024-01-10',
    status: 'Rejected'
  },
  {
    id: 'app-004',
    position: 'Full Stack Developer',
    company: 'InnovateTech',
    location: 'Austin, TX',
    salary: '$90k - $120k',
    date: '2024-01-08',
    status: 'Applied'
  }
];

const statusFilters = [
  { value: 'all', label: 'All', icon: 'list' },
  { value: 'Applied', label: 'Applied', icon: 'send' },
  { value: 'Under Review', label: 'Under Review', icon: 'hourglass_empty' },
  { value: 'Interview Scheduled', label: 'Interview', icon: 'event' },
  { value: 'Rejected', label: 'Rejected', icon: 'close' }
];

const filteredApplications = computed(() => {
  if (selectedFilter.value === 'all') {
    return applications;
  }
  return applications.filter(app => app.status === selectedFilter.value);
});

const getActiveApplicationsCount = () => {
  return applications.filter(app => 
    ['Applied', 'Under Review', 'Interview Scheduled'].includes(app.status)
  ).length;
};

const getFilterCount = (filterValue) => {
  if (filterValue === 'all') return applications.length;
  return applications.filter(app => app.status === filterValue).length;
};

const getStatusClass = (status) => {
  switch (status) {
    case 'Applied':
      return 'status-applied';
    case 'Under Review':
      return 'status-review';
    case 'Interview Scheduled':
      return 'status-interview';
    case 'Rejected':
      return 'status-rejected';
    default:
      return 'status-default';
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'Applied':
      return 'send';
    case 'Under Review':
      return 'hourglass_empty';
    case 'Interview Scheduled':
      return 'event';
    case 'Rejected':
      return 'close';
    default:
      return 'help';
  }
};

const getProgressWidth = (status) => {
  switch (status) {
    case 'Applied':
      return '25%';
    case 'Under Review':
      return '50%';
    case 'Interview Scheduled':
      return '75%';
    case 'Rejected':
      return '100%';
    default:
      return '0%';
  }
};

const getProgressPercentage = (status) => {
  switch (status) {
    case 'Applied':
      return 25;
    case 'Under Review':
      return 50;
    case 'Interview Scheduled':
      return 75;
    case 'Rejected':
      return 100;
    default:
      return 0;
  }
};

const getProgressText = (status) => {
  switch (status) {
    case 'Applied':
      return 'Application submitted';
    case 'Under Review':
      return 'Being reviewed by employer';
    case 'Interview Scheduled':
      return 'Interview process';
    case 'Rejected':
      return 'Application closed';
    default:
      return 'Status unknown';
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
  return date.toLocaleDateString();
};

const viewApplication = (id) => {
  router.push({ name: 'ApplicationDetails', params: { applicationId: id } });
};

const editApplication = (id) => {
  router.push({ name: 'EditApplication', params: { applicationId: id } });
};

const showMenu = (id) => {
  console.log('Show menu for application:', id);
};
</script>

<style scoped>
.applications-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
}

/* Header */
.applications-header {
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  margin-bottom: 16px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
}

.title-section {
  flex: 1;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 4px 0;
}

.page-subtitle {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.stats-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
  min-width: 80px;
}

.stat-icon {
  font-size: 20px;
  color: #2563eb;
  margin-bottom: 4px;
}

.stat-icon.success {
  color: #16a34a;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
}

.stat-label {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
}

.stat-divider {
  width: 1px;
  height: 32px;
  background: #e5e7eb;
}

/* Controls */
.controls-section {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 16px;
  padding: 12px;
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.filter-chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  color: #4b5563;
  font-size: 14px;
  cursor: pointer;
}

.filter-chip:hover:not(.active) {
  border-color: #2563eb;
  color: #2563eb;
  background: #eff6ff;
}

.filter-chip.active {
  background: #2563eb;
  color: #ffffff;
  border-color: #2563eb;
}

.filter-icon {
  font-size: 16px;
}

.filter-count {
  background: #e5e7eb;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 12px;
  color: #4b5563;
}

.filter-chip.active .filter-count {
  background: #bfdbfe;
  color: #1e40af;
}

/* Application Cards */
.applications-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.application-card {
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  cursor: pointer;
}

.application-card:hover {
  border-color: #2563eb;
}

.status-bar {
  height: 4px;
}

.status-bar.status-applied {
  background: #2563eb;
}

.status-bar.status-review {
  background: #d97706;
}

.status-bar.status-interview {
  background: #16a34a;
}

.status-bar.status-rejected {
  background: #dc2626;
}

.card-content {
  padding: 16px;
}

.application-main {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.job-info {
  flex: 1;
}

.job-title {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 12px 0;
}

.company-info {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 12px;
}

.company-details,
.location-details,
.salary-details {
  display: flex;
  align-items: center;
  gap: 6px;
}

.detail-icon {
  font-size: 16px;
  color: #6b7280;
}

.company-name {
  font-size: 15px;
  font-weight: 500;
  color: #2563eb;
}

.location-text,
.salary-text {
  font-size: 14px;
  color: #4b5563;
}

.application-meta {
  display: flex;
  gap: 16px;
}

.date-info,
.progress-info {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #6b7280;
}

.meta-icon {
  font-size: 14px;
}

/* Application Actions */
.application-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
  min-width: 180px;
}

.status-section {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid;
}

.status-badge.status-applied {
  background: #eff6ff;
  color: #1e40af;
  border-color: #bfdbfe;
}

.status-badge.status-review {
  background: #fef3c7;
  color: #92400e;
  border-color: #fcd34d;
}

.status-badge.status-interview {
  background: #ecfdf5;
  color: #065f46;
  border-color: #6ee7b7;
}

.status-badge.status-rejected {
  background: #fef2f2;
  color: #dc2626;
  border-color: #f87171;
}

.status-icon {
  font-size: 12px;
}

.progress-indicator {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  min-width: 100px;
}

.progress-track {
  width: 100%;
  height: 5px;
  background: #f3f4f6;
  border-radius: 5px;
}

.progress-fill {
  height: 100%;
  border-radius: 5px;
}

.progress-fill.status-applied {
  background: #2563eb;
}

.progress-fill.status-review {
  background: #d97706;
}

.progress-fill.status-interview {
  background: #16a34a;
}

.progress-fill.status-rejected {
  background: #dc2626;
}

.progress-text {
  font-size: 12px;
  color: #6b7280;
}

.action-buttons {
  display: flex;
  gap: 6px;
}

.action-btn {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  color: #6b7280;
}

.action-btn:hover {
  border-color: #2563eb;
  color: #2563eb;
  background: #eff6ff;
}

/* Tooltip */
.professional-tooltip {
  background: #111827;
  color: #ffffff;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 12px;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 40px 16px;
  background: #ffffff;
  border-radius: 8px;
  border: 1px dashed #e5e7eb;
}

.empty-icon {
  font-size: 48px;
  color: #d1d5db;
  margin-bottom: 16px;
}

.empty-title {
  font-size: 20px;
  font-weight: 500;
  color: #4b5563;
  margin: 0 0 8px 0;
}

.empty-description {
  font-size: 14px;
  color: #6b7280;
}

/* Responsive Design */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .stats-section {
    justify-content: space-around;
  }
  
  .controls-section {
    flex-direction: column;
    gap: 12px;
  }
  
  .application-main {
    flex-direction: column;
    gap: 12px;
  }
  
  .application-actions {
    align-items: stretch;
  }
  
  .status-section {
    align-items: stretch;
  }
  
  .company-info {
    flex-direction: column;
    gap: 8px;
  }
}

@media (max-width: 480px) {
  .filter-chips {
    flex-direction: column;
    gap: 6px;
  }
  
  .filter-chip {
    justify-content: center;
  }
}
</style>