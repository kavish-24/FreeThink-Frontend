<template>
  <div class="recommendations-container">
    <!-- Header Section -->
    <div class="recommendations-header">
      <div class="header-content">
        <div class="title-section">
          <h1 class="page-title gradient-text">
            <q-icon name="auto_awesome" class="title-icon" />
            Job Recommendations
          </h1>
          <p class="page-subtitle">
            Personalized job matches based on your skills and preferences
          </p>
        </div>
        <div class="recommendation-stats" v-if="!loading && recommendations.length > 0">
          <div class="stat-card">
            <div class="stat-icon">
              <q-icon name="psychology" />
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ recommendations.length }}</div>
              <div class="stat-label">Recommendations</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">
              <q-icon name="trending_up" />
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ averageMatchScore }}%</div>
              <div class="stat-label">Avg Match</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="loading-content">
        <div class="smart-loader">
          <q-spinner-orbit size="80px" color="primary" />
          <div class="loader-particles">
            <div class="particle" v-for="n in 6" :key="n"></div>
          </div>
        </div>
        <h3 class="loading-title">Analyzing your profile...</h3>
        <p class="loading-subtitle">Finding the perfect job matches for you</p>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="recommendations.length === 0 && !loading" class="empty-state">
      <div class="empty-content">
        <div class="empty-icon">
          <q-icon name="psychology" />
        </div>
        <h2 class="empty-title">Building Your Recommendations</h2>
        <p class="empty-subtitle">
          Complete your profile with skills and experience to get personalized job recommendations.
        </p>
        <q-btn 
          class="btn-unstop btn-primary btn-lg"
          icon="person"
          label="Complete Profile"
          @click="goToProfile"
        />
      </div>
    </div>

    <!-- Recommendations Grid -->
    <div v-else class="recommendations-content">
      <!-- Filter Section -->
      <div class="filter-section">
        <div class="filter-controls">
          <q-select
            v-model="sortBy"
            :options="sortOptions"
            label="Sort by"
            dense
            outlined
            class="sort-select"
            @update:model-value="sortRecommendations"
          />
          <q-btn
            flat
            round
            icon="refresh"
            color="primary"
            @click="refreshRecommendations"
            class="refresh-btn"
          >
            <q-tooltip>Refresh Recommendations</q-tooltip>
          </q-btn>
        </div>
      </div>

      <!-- Recommendations List -->
      <div class="recommendations-grid">
        <div
          v-for="job in sortedRecommendations"
          :key="job.id"
          class="recommendation-card card-unstop card-interactive"
          @click="viewJob(job)"
        >
          <!-- Match Score Badge -->
          <div class="match-score-badge">
            <div class="score-circle" :class="getScoreClass(job.recommendationScore)">
              <span class="score-text">{{ Math.round(job.recommendationScore) }}%</span>
            </div>
            <span class="match-label">Match</span>
          </div>

          <!-- Job Header -->
          <div class="job-header">
            <div class="company-logo">
              <img 
                v-if="job.company?.logo" 
                :src="job.company.logo" 
                :alt="job.company?.companyName"
                class="logo-img"
              />
              <q-icon v-else name="business" class="logo-placeholder" />
            </div>
            <div class="job-basic-info">
              <h3 class="job-title">{{ job.title }}</h3>
              <div class="company-info">
                <span class="company-name">{{ job.company?.companyName || 'Company' }}</span>
                <q-chip 
                  v-if="job.company?.industry"
                  size="sm" 
                  outline 
                  color="primary"
                  class="industry-chip"
                >
                  {{ job.company.industry }}
                </q-chip>
              </div>
            </div>
          </div>

          <!-- Job Details -->
          <div class="job-details">
            <div class="detail-row">
              <q-icon name="place" class="detail-icon" />
              <span class="detail-text">{{ job.location || 'Location not specified' }}</span>
            </div>
            <div class="detail-row" v-if="job.salary_range">
              <q-icon name="attach_money" class="detail-icon" />
              <span class="detail-text">{{ job.salary_range }}</span>
            </div>
            <div class="detail-row">
              <q-icon name="work" class="detail-icon" />
              <span class="detail-text">{{ formatJobType(job.type) }}</span>
            </div>
            <div class="detail-row" v-if="job.posted_at">
              <q-icon name="schedule" class="detail-icon" />
              <span class="detail-text">Posted {{ formatDate(job.posted_at) }}</span>
            </div>
          </div>

          <!-- Match Factors -->
          <div class="match-factors" v-if="job.matchFactors">
            <h4 class="factors-title">Why this matches you:</h4>
            <div class="factors-list">
              <div 
                class="factor-item" 
                v-if="job.matchFactors.skillsMatch?.percentage > 0"
              >
                <q-icon name="code" class="factor-icon" />
                <span class="factor-text">
                  {{ Math.round(job.matchFactors.skillsMatch.percentage * 100) }}% 
                  skills match
                </span>
              </div>
              <div 
                class="factor-item" 
                v-if="job.matchFactors.experienceMatch?.percentage > 0.8"
              >
                <q-icon name="trending_up" class="factor-icon" />
                <span class="factor-text">Experience level fit</span>
              </div>
              <div 
                class="factor-item" 
                v-if="job.matchFactors.locationMatch?.percentage > 0.8"
              >
                <q-icon name="place" class="factor-icon" />
                <span class="factor-text">Location preference</span>
              </div>
              <div 
                class="factor-item" 
                v-if="job.matchFactors.recencyMatch?.percentage > 0.8"
              >
                <q-icon name="new_releases" class="factor-icon" />
                <span class="factor-text">Recently posted</span>
              </div>
            </div>
          </div>

          <!-- Matched Skills -->
          <div class="matched-skills" v-if="job.matchFactors?.skillsMatch?.matchedSkills?.length">
            <div class="skills-container">
              <q-chip
                v-for="skill in job.matchFactors.skillsMatch.matchedSkills.slice(0, 4)"
                :key="skill"
                size="sm"
                color="primary"
                text-color="white"
                icon="check_circle"
                class="matched-skill-chip"
              >
                {{ skill }}
              </q-chip>
              <span 
                v-if="job.matchFactors.skillsMatch.matchedSkills.length > 4"
                class="more-skills"
              >
                +{{ job.matchFactors.skillsMatch.matchedSkills.length - 4 }} more
              </span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="card-actions">
            <q-btn
              flat
              round
              icon="visibility"
              color="primary"
              size="sm"
              @click.stop="viewJob(job)"
            >
              <q-tooltip>View Details</q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              icon="bookmark_border"
              color="grey-6"
              size="sm"
              @click.stop="bookmarkJob()"
            >
              <q-tooltip>Bookmark</q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              icon="share"
              color="grey-6"
              size="sm"
              @click.stop="shareJob(job)"
            >
              <q-tooltip>Share</q-tooltip>
            </q-btn>
          </div>
        </div>
      </div>

      <!-- Load More Button -->
      <div class="load-more-section" v-if="pagination?.totalPages > pagination?.page">
        <q-btn
          class="btn-unstop btn-outline btn-lg"
          :loading="loadingMore"
          @click="loadMore"
          icon="expand_more"
          label="Load More Recommendations"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { recommendationService } from '../services/recommendationService'

const $q = useQuasar()
const router = useRouter()

// Reactive data
const loading = ref(false)
const loadingMore = ref(false)
const recommendations = ref([])
const pagination = ref({})
const metadata = ref({})
const sortBy = ref('score')

// Sort options
const sortOptions = [
  { label: 'Best Match', value: 'score' },
  { label: 'Most Recent', value: 'date' },
  { label: 'Salary (High to Low)', value: 'salary_high' },
  { label: 'Salary (Low to High)', value: 'salary_low' }
]

// Computed properties
const averageMatchScore = computed(() => {
  if (!recommendations.value.length) return 0
  const total = recommendations.value.reduce((sum, job) => sum + job.recommendationScore, 0)
  return Math.round(total / recommendations.value.length)
})

const sortedRecommendations = computed(() => {
  const sorted = [...recommendations.value]
  
  switch (sortBy.value) {
    case 'score':
      return sorted.sort((a, b) => b.recommendationScore - a.recommendationScore)
    case 'date':
      return sorted.sort((a, b) => new Date(b.posted_at) - new Date(a.posted_at))
    case 'salary_high':
      return sorted.sort((a, b) => {
        const salaryA = extractSalary(a.salary_range)
        const salaryB = extractSalary(b.salary_range)
        return salaryB - salaryA
      })
    case 'salary_low':
      return sorted.sort((a, b) => {
        const salaryA = extractSalary(a.salary_range)
        const salaryB = extractSalary(b.salary_range)
        return salaryA - salaryB
      })
    default:
      return sorted
  }
})

// Methods
const fetchRecommendations = async (page = 1) => {
  const isLoadMore = page > 1
  if (isLoadMore) {
    loadingMore.value = true
  } else {
    loading.value = true
  }

  try {
    const response = await recommendationService.getJobRecommendations({
      limit: 12,
      page
    })

    if (response.success) {
      if (isLoadMore) {
        recommendations.value.push(...response.recommendations)
      } else {
        recommendations.value = response.recommendations
      }
      pagination.value = response.pagination
      metadata.value = response.metadata
    } else {
      throw new Error(response.message || 'Failed to fetch recommendations')
    }
  } catch (error) {
    console.error('Error fetching recommendations:', error)
    $q.notify({
      type: 'negative',
      message: 'Failed to load recommendations. Please try again.',
      position: 'top'
    })
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

const refreshRecommendations = () => {
  fetchRecommendations(1)
}

const loadMore = () => {
  if (pagination.value.page < pagination.value.totalPages) {
    fetchRecommendations(pagination.value.page + 1)
  }
}

const sortRecommendations = () => {
  // Trigger reactivity for computed property
}

const getScoreClass = (score) => {
  if (score >= 80) return 'score-excellent'
  if (score >= 65) return 'score-good'
  if (score >= 50) return 'score-fair'
  return 'score-low'
}

const formatJobType = (type) => {
  return type?.replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ') || 'N/A'
}

const formatDate = (dateString) => {
  if (!dateString) return 'Unknown'
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays <= 7) return `${diffDays} days ago`
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    return date.toLocaleDateString()
  } catch {
    return 'Unknown'
  }
}

const extractSalary = (salaryRange) => {
  if (!salaryRange) return 0
  const numbers = salaryRange.match(/\d+/g)
  if (!numbers) return 0
  return parseInt(numbers[0]) || 0
}

const viewJob = (job) => {
  router.push(`/job/${job.id}`)
}

const goToProfile = () => {
  router.push('/profile')
}

const bookmarkJob = async () => {
  try {
    // Implementation for bookmarking
    $q.notify({
      type: 'positive',
      message: 'Job bookmarked successfully!',
      position: 'top'
    })
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Failed to bookmark job',
      position: 'top'
    })
  }
}

const shareJob = (job) => {
  if (navigator.share) {
    navigator.share({
      title: job.title,
      text: `Check out this job: ${job.title} at ${job.company?.companyName}`,
      url: `${window.location.origin}/job/${job.id}`
    })
  } else {
    // Fallback: copy to clipboard
    navigator.clipboard.writeText(`${window.location.origin}/job/${job.id}`)
    $q.notify({
      type: 'positive',
      message: 'Job link copied to clipboard!',
      position: 'top'
    })
  }
}

// Lifecycle
onMounted(() => {
  fetchRecommendations()
})
</script>

<style scoped>
.recommendations-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  padding: var(--space-6);
}

.recommendations-header {
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
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.title-icon {
  font-size: 2.5rem;
  background: linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 100%);
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.page-subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-gray-600);
  margin: 0;
  font-weight: 400;
}

.recommendation-stats {
  display: flex;
  gap: var(--space-4);
}

.stat-card {
  background: var(--color-surface);
  border-radius: var(--border-radius-xl);
  padding: var(--space-4);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-gray-200);
  display: flex;
  align-items: center;
  gap: var(--space-3);
  min-width: 120px;
}

.stat-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-accent-purple) 100%);
  border-radius: var(--border-radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.stat-number {
  font-size: var(--font-size-xl);
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
  min-height: 500px;
}

.loading-content {
  text-align: center;
}

.smart-loader {
  position: relative;
  display: inline-block;
  margin-bottom: var(--space-6);
}

.loader-particles {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.particle {
  position: absolute;
  width: 8px;
  height: 8px;
  background: var(--color-primary-500);
  border-radius: 50%;
  animation: particle-float 2s infinite ease-in-out;
}

.particle:nth-child(1) { animation-delay: 0s; transform: rotate(0deg) translateX(60px); }
.particle:nth-child(2) { animation-delay: 0.3s; transform: rotate(60deg) translateX(60px); }
.particle:nth-child(3) { animation-delay: 0.6s; transform: rotate(120deg) translateX(60px); }
.particle:nth-child(4) { animation-delay: 0.9s; transform: rotate(180deg) translateX(60px); }
.particle:nth-child(5) { animation-delay: 1.2s; transform: rotate(240deg) translateX(60px); }
.particle:nth-child(6) { animation-delay: 1.5s; transform: rotate(300deg) translateX(60px); }

@keyframes particle-float {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
}

.loading-title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--color-gray-800);
  margin: 0 0 var(--space-2) 0;
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

/* Filter Section */
.filter-section {
  margin-bottom: var(--space-6);
}

.filter-controls {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  justify-content: flex-end;
}

.sort-select {
  min-width: 200px;
}

.refresh-btn {
  transition: transform var(--transition-base);
}

.refresh-btn:hover {
  transform: rotate(90deg);
}

/* Recommendations Grid */
.recommendations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
  gap: var(--space-6);
  margin-bottom: var(--space-8);
}

.recommendation-card {
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

.recommendation-card::before {
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

.recommendation-card:hover::before {
  transform: scaleX(1);
}

.recommendation-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-xl);
  border-color: var(--color-primary-200);
}

/* Match Score */
.match-score-badge {
  position: absolute;
  top: var(--space-4);
  right: var(--space-4);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
}

.score-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid;
  position: relative;
}

.score-excellent {
  border-color: #10b981;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.score-good {
  border-color: #3b82f6;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.score-fair {
  border-color: #f59e0b;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.score-low {
  border-color: #ef4444;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.score-text {
  font-size: var(--font-size-sm);
  font-weight: 700;
  color: white;
}

.match-label {
  font-size: var(--font-size-xs);
  color: var(--color-gray-600);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Job Header */
.job-header {
  display: flex;
  align-items: flex-start;
  gap: var(--space-4);
  margin-bottom: var(--space-4);
  padding-right: 80px; /* Space for match score */
}

.company-logo {
  width: 60px;
  height: 60px;
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-gray-100);
}

.logo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.logo-placeholder {
  font-size: 1.5rem;
  color: var(--color-gray-500);
}

.job-basic-info {
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
  flex-wrap: wrap;
}

.company-name {
  font-size: var(--font-size-base);
  color: var(--color-gray-600);
  font-weight: 500;
}

.industry-chip {
  font-size: var(--font-size-xs);
}

/* Job Details */
.job-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
}

.detail-row {
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

/* Match Factors */
.match-factors {
  margin-bottom: var(--space-4);
  padding: var(--space-3);
  background: var(--color-gray-50);
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--color-gray-200);
}

.factors-title {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-gray-800);
  margin: 0 0 var(--space-2) 0;
}

.factors-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-2);
}

.factor-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.factor-icon {
  color: var(--color-primary-500);
  font-size: 0.875rem;
}

.factor-text {
  font-size: var(--font-size-xs);
  color: var(--color-gray-700);
  font-weight: 500;
}

/* Matched Skills */
.matched-skills {
  margin-bottom: var(--space-4);
}

.skills-container {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  align-items: center;
}

.matched-skill-chip {
  font-size: var(--font-size-xs);
}

.more-skills {
  font-size: var(--font-size-xs);
  color: var(--color-gray-600);
  font-weight: 500;
  background: var(--color-gray-100);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--border-radius-full);
}

/* Card Actions */
.card-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-2);
  padding-top: var(--space-3);
  border-top: 1px solid var(--color-gray-200);
}

/* Load More */
.load-more-section {
  display: flex;
  justify-content: center;
  padding: var(--space-8) 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .recommendations-container {
    padding: var(--space-4);
  }
  
  .recommendations-grid {
    grid-template-columns: 1fr;
  }
  
  .header-content {
    flex-direction: column;
    align-items: stretch;
  }
  
  .recommendation-stats {
    justify-content: center;
  }
  
  .page-title {
    font-size: var(--font-size-3xl);
  }
  
  .job-details {
    grid-template-columns: 1fr;
  }
  
  .factors-list {
    grid-template-columns: 1fr;
  }
  
  .filter-controls {
    justify-content: flex-start;
  }
}

@media (max-width: 480px) {
  .job-header {
    padding-right: 0;
    margin-bottom: var(--space-6);
  }
  
  .match-score-badge {
    position: static;
    align-self: flex-start;
    margin-top: var(--space-2);
  }
  
  .recommendation-card {
    padding: var(--space-4);
  }
}
</style>
