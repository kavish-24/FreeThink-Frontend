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
      
      <div class="recommendations-grid">
        <div 
          v-for="job in recommendedJobs" 
          :key="job.id"
          class="job-card card-unstop card-interactive"
          @click="$router.push(`/job/${job.id}`)"
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
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineEmits(['open-profile'])

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

const recommendedJobs = ref([
  {
    id: 1,
    title: 'Senior Frontend Developer',
    company: 'Tech Corp',
    location: 'San Francisco, CA',
    salary: '$120k - $150k',
    skills: ['React', 'TypeScript', 'Node.js', 'GraphQL'],
    featured: true,
    matchScore: 92,
    matchedSkills: 4
  },
  {
    id: 2,
    title: 'Full Stack Engineer',
    company: 'StartupXYZ',
    location: 'Remote',
    salary: '$100k - $130k',
    skills: ['Vue.js', 'Python', 'AWS', 'Docker'],
    matchScore: 85,
    matchedSkills: 3
  },
  {
    id: 3,
    title: 'UI/UX Designer',
    company: 'Design Studio',
    location: 'New York, NY',
    salary: '$90k - $110k',
    skills: ['Figma', 'Sketch', 'Prototyping', 'User Research'],
    matchScore: 78,
    matchedSkills: 2
  }
])

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
</style>