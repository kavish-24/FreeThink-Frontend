<template>
  <div class="dashboard-overview">
    <!-- Quick Actions -->
    <div class="quick-actions-section">
      <h2 class="section-title">Quick Actions</h2>
      <div class="actions-grid">
        <div class="action-card card-unstop card-interactive" @click="$router.push('/jobs')">
          <div class="action-icon search">
            <q-icon name="search" />
          </div>
          <div class="action-content">
            <h3 class="action-title">Find Jobs</h3>
            <p class="action-description">Browse thousands of opportunities</p>
          </div>
          <q-icon name="arrow_forward" class="action-arrow" />
        </div>

        <div class="action-card card-unstop card-interactive" @click="$emit('open-profile')">
          <div class="action-icon profile">
            <q-icon name="person" />
          </div>
          <div class="action-content">
            <h3 class="action-title">Complete Profile</h3>
            <p class="action-description">Boost your visibility to employers</p>
          </div>
          <q-icon name="arrow_forward" class="action-arrow" />
        </div>

        <div class="action-card card-resume card-interactive" @click="$router.push('/resume-builder')">
          <div class="action-icon resume">
            <q-icon name="description" />
          </div>
          <div class="action-content">
            <h3 class="action-title">Resume Builder</h3>
            <p class="action-description">AI-powered resume creation with job optimization</p>
          </div>
          <div class="ai-badge">
            <span>AI</span>
          </div>
          <q-icon name="arrow_forward" class="action-arrow" />
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="activity-section">
      <div class="section-header">
        <h2 class="section-title">Recent Activity</h2>
        <q-btn 
          flat
          label="View All"
          class="view-all-btn"
          @click="$router.push('/dashboard?tab=applications')"
        />
      </div>
      
      <div class="activity-list">
        <div v-if="recentActivities.length === 0" class="empty-activity">
          <div class="empty-icon">
            <q-icon name="timeline" />
          </div>
          <h3>No Recent Activity</h3>
          <p>Start applying to jobs to see your activity here</p>
          <q-btn 
            class="btn-unstop btn-primary"
            label="Browse Jobs"
            @click="$router.push('/jobs')"
            no-caps
          />
        </div>
        
        <div 
          v-else
          v-for="activity in recentActivities" 
          :key="activity.id"
          class="activity-item"
        >
          <div class="activity-icon" :class="activity.type">
            <q-icon :name="getActivityIcon(activity.type)" />
          </div>
          <div class="activity-content">
            <h4 class="activity-title">{{ activity.title }}</h4>
            <p class="activity-description">{{ activity.description }}</p>
            <span class="activity-time">{{ formatTime(activity.timestamp) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Job Recommendations -->
    <div class="recommendations-section">
      <div class="section-header">
        <h2 class="section-title">Smart Recommendations</h2>
        <q-btn 
          flat
          label="View All"
          class="view-all-btn"
          @click="$router.push('/recommendations')"
        />
      </div>
      
      <div v-if="loadingRecommendations" class="loading-state">
        <q-spinner-dots size="48px" color="primary" />
        <p>Loading smart recommendations...</p>
      </div>
      
      <div v-else-if="recommendedJobs.length === 0" class="empty-recommendations">
        <div class="empty-icon">
          <q-icon name="psychology" />
        </div>
        <h3>No Recommendations Yet</h3>
        <p>Complete your profile to get personalized job recommendations</p>
        <q-btn 
          class="btn-unstop btn-primary"
          label="Complete Profile"
          @click="$emit('open-profile')"
          no-caps
        />
      </div>
      
      <div v-else class="recommendations-grid">
        <div 
          v-for="job in recommendedJobs" 
          :key="job.id"
          class="job-card card-unstop card-interactive"
          @click="openJobDetails(job.id)"
        >
          <!-- Smart Match Score Badge -->
          <div class="smart-match-badge">
            <div class="match-score" :class="getMatchScoreClass(job.matchScore)">
              <span class="score-text">{{ job.matchScore }}%</span>
            </div>
            <span class="smart-label">Smart Match</span>
          </div>
          
          <div class="job-header">
            <div class="company-logo">
              <q-icon name="business" />
            </div>
            <div class="job-badge" v-if="job.featured">
              <span>Featured</span>
            </div>
          </div>
          <div class="job-content">
            <h3 class="job-title">{{ job.title }}</h3>
            <p class="job-company">{{ job.company }}</p>
            <div class="job-details">
              <span class="job-location">
                <q-icon name="place" />
                {{ job.location }}
              </span>
              <span class="job-salary">
                <q-icon name="attach_money" />
                {{ job.salary }}
              </span>
            </div>
            <div class="job-skills">
              <q-chip 
                v-for="skill in job.skills.slice(0, 3)" 
                :key="skill"
                size="sm"
                outline
                color="primary"
              >
                {{ skill }}
              </q-chip>
              <q-chip 
                v-if="job.matchedSkills > 0"
                size="sm"
                color="primary"
                text-color="white"
                icon="check_circle"
              >
                {{ job.matchedSkills }} skills match
              </q-chip>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Job Details Dialog -->
    <q-dialog v-model="showJobDialog" maximized transition-show="slide-up" transition-hide="slide-down">
      <q-card class="job-details-card">
        <q-bar class="bg-primary text-white">
          <q-space />
          <q-btn flat dense icon="close" v-close-popup />
        </q-bar>

        <q-card-section v-if="loadingJobDetails" class="flex flex-center" style="min-height: 400px;">
          <div class="text-center">
            <q-spinner-dots size="48px" color="primary" />
            <p class="q-mt-md text-grey-7">Loading job details...</p>
          </div>
        </q-card-section>

        <q-card-section v-else-if="selectedJobDetails" class="job-details-content">
          <!-- Company Header -->
          <div class="company-header-section">
            <div class="company-info-wrapper">
              <div class="company-logo-large">
                <img v-if="selectedJobDetails.company?.logo" :src="selectedJobDetails.company.logo" alt="Company Logo" />
                <q-icon v-else name="business" size="48px" color="grey-5" />
              </div>
              <div class="company-text-info">
                <h3 class="job-detail-title">{{ selectedJobDetails.title }}</h3>
                <p class="company-detail-name">{{ selectedJobDetails.company?.companyName || 'Company' }}</p>
                <div class="job-meta-info">
                  <span class="meta-item">
                    <q-icon name="place" size="16px" />
                    {{ selectedJobDetails.location }}
                  </span>
                  <span class="meta-item">
                    <q-icon name="work_history" size="16px" />
                    {{ selectedJobDetails.experience_min || 0 }}+ years
                  </span>
                  <span class="meta-item">
                    <q-icon name="schedule" size="16px" />
                    {{ formatJobType(selectedJobDetails.type) }}
                  </span>
                </div>
              </div>
            </div>
            <div class="salary-badge">
              <q-icon name="payments" size="20px" class="q-mr-xs" />
              {{ formatSalary(selectedJobDetails.salary_range) }}
            </div>
          </div>

          <q-separator class="q-my-md" />

          <!-- Job Description -->
          <div class="detail-section">
            <h4 class="section-heading">
              <q-icon name="description" class="q-mr-sm" />
              Job Description
            </h4>
            <p class="job-description-text">{{ selectedJobDetails.description }}</p>
          </div>

          <!-- Skills Required -->
          <div class="detail-section" v-if="selectedJobDetails.skills && selectedJobDetails.skills.length">
            <h4 class="section-heading">
              <q-icon name="psychology" class="q-mr-sm" />
              Skills Required
            </h4>
            <div class="skills-container">
              <q-chip
                v-for="skill in selectedJobDetails.skills"
                :key="skill"
                color="primary"
                text-color="white"
                icon="check_circle"
              >
                {{ skill }}
              </q-chip>
            </div>
          </div>

          <!-- Benefits -->
          <div class="detail-section" v-if="selectedJobDetails.benefits">
            <h4 class="section-heading">
              <q-icon name="stars" class="q-mr-sm" />
              Benefits
            </h4>
            <p class="benefits-text">{{ selectedJobDetails.benefits }}</p>
          </div>

          <!-- Company Information -->
          <div class="detail-section" v-if="selectedJobDetails.company">
            <h4 class="section-heading">
              <q-icon name="business_center" class="q-mr-sm" />
              About {{ selectedJobDetails.company.companyName }}
            </h4>
            <p class="company-description">{{ selectedJobDetails.company.description }}</p>
            <div class="company-details-grid">
              <div class="company-detail-item" v-if="selectedJobDetails.company.industry">
                <strong>Industry:</strong> {{ selectedJobDetails.company.industry }}
              </div>
              <div class="company-detail-item" v-if="selectedJobDetails.company.website">
                <strong>Website:</strong>
                <a :href="selectedJobDetails.company.website" target="_blank" class="company-link">
                  {{ selectedJobDetails.company.website }}
                </a>
              </div>
              <div class="company-detail-item" v-if="selectedJobDetails.company.location">
                <strong>Location:</strong> {{ selectedJobDetails.company.location }}
              </div>
            </div>
          </div>

          <!-- Additional Info -->
          <div class="additional-info">
            <div class="info-row">
              <span class="info-label">Category:</span>
              <span class="info-value">{{ selectedJobDetails.category || 'Not specified' }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Education:</span>
              <span class="info-value">{{ selectedJobDetails.education || 'Not specified' }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Application Deadline:</span>
              <span class="info-value">{{ formatDeadline(selectedJobDetails.deadline) }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Posted:</span>
              <span class="info-value">{{ formatPostedDate(selectedJobDetails.posted_at) }}</span>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Close" color="grey-7" v-close-popup />
          <q-btn unelevated label="Apply Now" color="primary" icon="send" @click="applyToJob" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { authHelpers } from '../services/auth.service'
import api from '../services/auth.service'
import suggestService from '../services/suggest.service'

defineEmits(['open-profile'])

const currentUser = authHelpers.getCurrentUser()
const userId = currentUser?.id

// Mock data - replace with real data from API
const recentActivities = ref([
  {
    id: 1,
    type: 'application',
    title: 'Applied to Software Engineer',
    description: 'at Google Inc.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
  },
  {
    id: 2,
    type: 'bookmark',
    title: 'Saved Frontend Developer',
    description: 'at Microsoft',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000) // 5 hours ago
  },
  {
    id: 3,
    type: 'interview',
    title: 'Interview Scheduled',
    description: 'for Product Manager role at Apple',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
  }
])

const recommendedJobs = ref([])
const loadingRecommendations = ref(false)
const showJobDialog = ref(false)
const selectedJobDetails = ref(null)
const loadingJobDetails = ref(false)

// Fetch recommendations from the service
const fetchRecommendations = async () => {
  if (!userId) return
  
  loadingRecommendations.value = true
  try {
    const result = await suggestService.getSuggestions(userId)
    
    if (result.success && Array.isArray(result.data)) {
      // Map the API response to our component format
      recommendedJobs.value = result.data.slice(0, 3).map(job => ({
        id: job.jobId || job.id,
        title: job.title || 'Untitled',
        company: job.company_name || job.companyName || 'Unknown Company',
        location: job.location || 'N/A',
        salary: job.salary || job.salary_range || 'N/A',
        skills: parseSkills(job.skills),
        featured: false,
        matchScore: Math.round((job.match || 0) * 100) , // Default to 75% if match is 0
        matchedSkills: parseSkills(job.skills).length
      }))
    }
  } catch (error) {
    console.error('Failed to fetch recommendations:', error)
  } finally {
    loadingRecommendations.value = false
  }
}

// Helper function to parse skills from various formats
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

onMounted(() => {
  fetchRecommendations()
})

function getActivityIcon(type) {
  switch (type) {
    case 'application': return 'work'
    case 'bookmark': return 'bookmark'
    case 'interview': return 'event'
    case 'profile': return 'person'
    default: return 'notifications'
  }
}

function formatTime(timestamp) {
  const now = new Date()
  const diff = now - timestamp
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(hours / 24)
  
  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  } else {
    return 'Just now'
  }
}

function getMatchScoreClass(score) {
  if (score >= 85) return 'match-excellent'
  if (score >= 70) return 'match-good' 
  if (score >= 55) return 'match-fair'
  return 'match-low'
}

// Open job details dialog
const openJobDetails = async (jobId) => {
  if (!jobId) return
  
  showJobDialog.value = true
  loadingJobDetails.value = true
  selectedJobDetails.value = null
  
  try {
    const response = await api.get(`/jobs/jobs/${jobId}`)
    
    if (response.data.success && response.data.job) {
      selectedJobDetails.value = response.data.job
    } else {
      console.error('Failed to fetch job details')
      showJobDialog.value = false
    }
  } catch (error) {
    console.error('Error fetching job details:', error)
    showJobDialog.value = false
  } finally {
    loadingJobDetails.value = false
  }
}

// Helper functions for formatting
const formatJobType = (type) => {
  if (!type) return 'Not specified'
  return type.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ')
}

const formatSalary = (salaryRange) => {
  if (!salaryRange) return 'Not disclosed'
  return salaryRange
}

const formatDeadline = (deadline) => {
  if (!deadline) return 'Not specified'
  const date = new Date(deadline)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

const formatPostedDate = (postedAt) => {
  if (!postedAt) return 'Unknown'
  const date = new Date(postedAt)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

const applyToJob = () => {
  // TODO: Implement job application logic
  console.log('Apply to job:', selectedJobDetails.value?.id)
  // You could navigate to application page or open application dialog
}
</script>

<style scoped>
.dashboard-overview {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

/* Quick Actions */
.section-title {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-gray-800);
  margin: 0 0 var(--space-6) 0;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-4);
}

.action-card {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-6);
  cursor: pointer;
  border: 2px solid #e5e7eb; /* Added border */
  border-radius: var(--border-radius-xl); /* Consistent with card design */
  background: white; /* Ensure background is white for contrast */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); /* Subtle shadow for card effect */
  transition: all var(--transition-base);
}

.action-card:hover {
  border-color: #3b82f6; /* Change border color on hover */
  transform: translateY(-2px); /* Slight lift effect */
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15); /* Enhanced shadow on hover */
}

.action-icon {
  width: 50px;
  height: 50px;
  border-radius: var(--border-radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.action-icon.search {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.action-icon.profile {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.action-icon.resume {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.action-icon.smart-resume {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
}

.smart-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  color: white;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
}

.action-card:hover .smart-badge {
  transform: scale(1.1);
  transition: transform 0.2s ease;
}

.action-icon .q-icon {
  font-size: 1.5rem;
}

.action-content {
  flex: 1;
}

.action-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-gray-800);
  margin: 0 0 var(--space-1) 0;
}

.action-description {
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
  margin: 0;
}

.action-arrow {
  color: var(--color-gray-400);
  transition: all var(--transition-base);
}

.action-card:hover .action-arrow {
  color: var(--color-primary-500);
  transform: translateX(4px);
}

/* Section Headers */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-6);
}

.view-all-btn {
  color: var(--color-primary-600);
  font-weight: 500;
}

/* Activity Section */
.activity-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.empty-activity {
  text-align: center;
  padding: var(--space-12);
  background: var(--color-surface);
  border-radius: var(--border-radius-xl);
  border: 2px dashed var(--color-gray-300);
}

.empty-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto var(--space-4) auto;
  background: var(--color-gray-100);
  border-radius: var(--border-radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-icon .q-icon {
  font-size: 2rem;
  color: var(--color-gray-400);
}

.empty-activity h3 {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-gray-700);
  margin: 0 0 var(--space-2) 0;
}

.empty-activity p {
  font-size: var(--font-size-base);
  color: var(--color-gray-500);
  margin: 0 0 var(--space-6) 0;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: var(--space-4);
  padding: var(--space-4);
  background: var(--color-surface);
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--color-gray-200);
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--border-radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.activity-icon.application {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.activity-icon.bookmark {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.activity-icon.interview {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.activity-content {
  flex: 1;
}

.activity-title {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-gray-800);
  margin: 0 0 var(--space-1) 0;
}

.activity-description {
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
  margin: 0 0 var(--space-1) 0;
}

.activity-time {
  font-size: var(--font-size-xs);
  color: var(--color-gray-500);
}

/* Recommendations */
.loading-state {
  text-align: center;
  padding: var(--space-12);
  background: var(--color-surface);
  border-radius: var(--border-radius-xl);
}

.loading-state p {
  margin-top: var(--space-4);
  color: var(--color-gray-600);
  font-size: var(--font-size-base);
}

.empty-recommendations {
  text-align: center;
  padding: var(--space-12);
  background: var(--color-surface);
  border-radius: var(--border-radius-xl);
  border: 2px dashed var(--color-gray-300);
}

.empty-recommendations .empty-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto var(--space-4) auto;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: var(--border-radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-recommendations .empty-icon .q-icon {
  font-size: 2rem;
  color: white;
}

.empty-recommendations h3 {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-gray-700);
  margin: 0 0 var(--space-2) 0;
}

.empty-recommendations p {
  font-size: var(--font-size-base);
  color: var(--color-gray-500);
  margin: 0 0 var(--space-6) 0;
}

.recommendations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: var(--space-6);
}

.job-card {
  padding: var(--space-6);
  cursor: pointer;
  position: relative;
  border: 2px solid #e5e7eb; /* Added border */
  border-radius: var(--border-radius-xl); /* Consistent with card design */
  background: white; /* Ensure background is white for contrast */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); /* Subtle shadow for card effect */
  transition: all var(--transition-base);
}

.job-card:hover {
  border-color: #3b82f6; /* Change border color on hover */
  transform: translateY(-2px); /* Slight lift effect */
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15); /* Enhanced shadow on hover */
}

.smart-match-badge {
  position: absolute;
  top: var(--space-4);
  right: var(--space-4);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  z-index: 2;
}

.match-score {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid;
  font-weight: 700;
  font-size: var(--font-size-xs);
}

.match-excellent {
  border-color: #10b981;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.match-good {
  border-color: #3b82f6;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
}

.match-fair {
  border-color: #f59e0b;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
}

.match-low {
  border-color: #ef4444;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

.smart-label {
  font-size: var(--font-size-xs);
  color: var(--color-gray-600);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.job-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-4);
}

.company-logo {
  width: 50px;
  height: 50px;
  background: var(--color-gray-100);
  border-radius: var(--border-radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-gray-500);
}

.job-badge {
  background: var(--color-accent-orange);
  color: white;
  padding: var(--space-1) var(--space-2);
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-xs);
  font-weight: 600;
}

.job-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-gray-800);
  margin: 0 0 var(--space-1) 0;
}

.job-company {
  font-size: var(--font-size-base);
  color: var(--color-gray-600);
  margin: 0 0 var(--space-3) 0;
}

.job-details {
  display: flex;
  gap: var(--space-4);
  margin-bottom: var(--space-3);
}

.job-location,
.job-salary {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
}

.job-skills {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
}

/* Responsive Design */
@media (max-width: 768px) {
  .actions-grid {
    grid-template-columns: 1fr;
  }
  
  .recommendations-grid {
    grid-template-columns: 1fr;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-2);
  }
}

/* Job Details Dialog Styles */
.job-details-card {
  background: white;
}

.job-details-content {
  max-width: 900px;
  margin: 0 auto;
}

.company-header-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-radius: 12px;
  margin-bottom: 24px;
}

.company-info-wrapper {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  flex: 1;
}

.company-logo-large {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  overflow: hidden;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.company-logo-large img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.company-text-info {
  flex: 1;
}

.job-detail-title {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.3;
}

.company-detail-name {
  margin: 0 0 12px 0;
  font-size: 16px;
  color: #666;
  font-weight: 500;
}

.job-meta-info {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #555;
  font-size: 14px;
}

.salary-badge {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  background: linear-gradient(135deg, #1976d2, #2196f3);
  color: white;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 600;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3);
}

.detail-section {
  margin-bottom: 28px;
}

.section-heading {
  display: flex;
  align-items: center;
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 16px 0;
}

.job-description-text,
.benefits-text,
.company-description {
  font-size: 15px;
  line-height: 1.7;
  color: #444;
  margin: 0;
}

.skills-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.company-details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 12px;
  margin-top: 16px;
}

.company-detail-item {
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  font-size: 14px;
}

.company-link {
  color: #1976d2;
  text-decoration: none;
  margin-left: 4px;
}

.company-link:hover {
  text-decoration: underline;
}

.additional-info {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  margin-top: 24px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #e0e0e0;
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  font-weight: 600;
  color: #555;
}

.info-value {
  color: #333;
  text-align: right;
}

@media (max-width: 768px) {
  .company-header-section {
    flex-direction: column;
  }

  .salary-badge {
    align-self: flex-start;
  }

  .job-detail-title {
    font-size: 22px;
  }

  .company-details-grid {
    grid-template-columns: 1fr;
  }

  .info-row {
    flex-direction: column;
    gap: 4px;
  }

  .info-value {
    text-align: left;
  }
}
</style>