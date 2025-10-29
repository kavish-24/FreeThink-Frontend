<template>
  <q-page class="suggestions-page">
    <!-- Hero Header -->
    <div class="page-hero">
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">
            <q-icon name="auto_awesome" class="title-icon" />
            Discover Talent
          </h1>
          <p class="hero-subtitle">Find the perfect candidates for your team</p>
        </div>
        
        <!-- Search Bar -->
        <div class="search-container">
          <q-input
            v-model="searchTerm"
            placeholder="Search by name, skills, or job title..."
            debounce="300"
            @update:model-value="onSearch"
            class="modern-search"
            filled
            clearable
          >
            <template #prepend>
              <q-icon name="search" class="search-icon" />
            </template>
          </q-input>
        </div>
      </div>
    </div>

    <!-- Action Bar -->
    <div class="action-bar">
      <div class="action-content">
        <div class="results-info">
          <q-icon name="groups" size="24px" class="info-icon" />
          <span class="results-text">
            {{ filteredResults.length }} Candidate{{ filteredResults.length !== 1 ? 's' : '' }}
          </span>
        </div>
        
        <div class="action-buttons">
          <q-btn
            unelevated
            rounded
            color="primary"
            icon="auto_awesome"
            label="Smart Suggestions"
            @click="loadCompanySuggestions"
            class="action-btn suggestions-btn"
          />
          
          <q-btn
            unelevated
            rounded
            :color="showFilters ? 'secondary' : 'grey-6'"
            :icon="showFilters ? 'filter_list' : 'filter_list_off'"
            :label="showFilters ? 'Hide Filters' : 'Show Filters'"
            @click="toggleFilters"
            class="action-btn"
          />
        </div>
      </div>
    </div>

    <!-- Filters Section -->
    <q-slide-transition>
      <div v-show="showFilters" class="filters-section">
        <q-card class="filters-card">
          <div class="filters-header">
            <q-icon name="tune" size="24px" />
            <span>Advanced Filters</span>
          </div>
          
          <div class="filters-grid">
            <div class="filter-group">
              <label class="filter-label">Skills</label>
              <q-select
                v-model="filters.skills"
                :options="availableSkills"
                multiple
                use-chips
                clearable
                filled
                dense
                emit-value
                map-options
                @update:model-value="applyFilters"
                placeholder="Select skills"
              >
                <template #no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No skills available
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>

            <div class="filter-group">
              <label class="filter-label">Experience Level</label>
              <q-select
                v-model="filters.experienceRange"
                :options="experienceRangeOptions"
                filled
                dense
                clearable
                emit-value
                map-options
                @update:model-value="applyFilters"
                placeholder="Select experience"
              />
            </div>

            <div class="filter-group">
              <label class="filter-label">Job Titles</label>
              <q-select
                v-model="filters.jobTitles"
                :options="availableJobTitles"
                multiple
                use-chips
                clearable
                filled
                dense
                emit-value
                map-options
                @update:model-value="applyFilters"
                placeholder="Select titles"
              >
                <template #no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No job titles available
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>

            <div class="filter-group clear-filter">
              <q-btn
                flat
                rounded
                color="negative"
                icon="clear_all"
                label="Clear All"
                @click="clearAllFilters"
                class="clear-btn"
              />
            </div>
          </div>

          <!-- Active Filters -->
          <div v-if="hasActiveFilters" class="active-filters">
            <div class="active-filters-label">Active Filters:</div>
            <div class="filters-chips">
              <q-chip
                v-for="skill in filters.skills"
                :key="`skill-${skill}`"
                removable
                @remove="removeSkillFilter(skill)"
                color="blue-1"
                text-color="blue-9"
                icon="verified"
              >
                {{ skill }}
              </q-chip>
              
              <q-chip
                v-if="filters.experienceRange"
                removable
                @remove="filters.experienceRange = null; applyFilters()"
                color="green-1"
                text-color="green-9"
                icon="work_history"
              >
                {{ getExperienceRangeLabel(filters.experienceRange) }}
              </q-chip>
              
              <q-chip
                v-for="title in filters.jobTitles"
                :key="`title-${title}`"
                removable
                @remove="removeJobTitleFilter(title)"
                color="purple-1"
                text-color="purple-9"
                icon="badge"
              >
                {{ title }}
              </q-chip>
            </div>
          </div>
        </q-card>
      </div>
    </q-slide-transition>

    <!-- Main Content -->
    <div class="content-container">
      <div class="content-grid">
        <!-- Candidates List -->
        <div class="candidates-list">
          <div v-if="loading" class="loading-cards">
            <div v-for="n in 3" :key="n" class="skeleton-card">
              <q-card class="candidate-skeleton">
                <q-card-section class="skeleton-content">
                  <q-skeleton type="QAvatar" size="64px" />
                  <div class="skeleton-text">
                    <q-skeleton type="text" width="160px" height="20px" />
                    <q-skeleton type="text" width="120px" height="16px" />
                    <q-skeleton type="text" width="100px" height="14px" />
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>

          <div v-else>
            <div v-if="filteredResults.length" class="candidates-scroll">
              <div
                v-for="user in filteredResults"
                :key="user.id"
                class="candidate-card-wrapper"
              >
                <q-card
                  class="candidate-card"
                  :class="{ 'selected': selectedUser && selectedUser.id === user.id }"
                  @click="selectUser(user)"
                >
                  <q-card-section class="candidate-content">
                    <q-avatar
                      size="64px"
                      :color="user.photo ? 'transparent' : 'primary'"
                      text-color="white"
                      class="candidate-avatar"
                    >
                      <img v-if="user.photo" :src="user.photo" :alt="user.name || 'User'" />
                      <q-icon v-else name="person" size="32px" />
                    </q-avatar>
                    
                    <div class="candidate-info">
                      <h3 class="candidate-name">{{ user.name || 'Unnamed' }}</h3>
                      <p class="candidate-title">{{ user.jobSeekerProfile.title || 'Role not set' }}</p>
                      <div class="candidate-skills">
                        <q-chip
                          v-for="(skill, idx) in user.jobSeekerProfile.skillsJson?.slice(0, 3)"
                          :key="idx"
                          dense
                          size="sm"
                          color="blue-1"
                          text-color="blue-9"
                        >
                          {{ skill }}
                        </q-chip>
                      </div>
                      <div class="candidate-experience">
                        <q-icon name="work" size="14px" />
                        <span>{{ user.jobSeekerProfile.experienceYears || 0 }} years</span>
                      </div>
                    </div>

                    <q-icon 
                      name="chevron_right" 
                      size="24px" 
                      color="grey-5" 
                      class="chevron-icon"
                    />
                  </q-card-section>
                </q-card>
              </div>
            </div>
            
            <div v-else class="empty-state">
              <q-icon name="groups" size="80px" color="grey-4" />
              <h3 class="empty-title">No candidates found</h3>
              <p class="empty-text">
                {{ hasActiveFilters ? 'Try adjusting your filters' : 'Click "Smart Suggestions" to discover talent' }}
              </p>
              <q-btn
                v-if="hasActiveFilters"
                unelevated
                rounded
                color="primary"
                label="Clear Filters"
                @click="clearAllFilters"
                class="empty-action"
              />
            </div>
          </div>
        </div>

        <!-- Profile Details -->
        <div class="profile-details">
          <div v-if="profileLoading" class="profile-loading">
            <q-card class="profile-skeleton">
              <q-card-section class="skeleton-header">
                <q-skeleton type="QAvatar" size="100px" />
                <div class="skeleton-header-text">
                  <q-skeleton type="text" width="200px" height="24px" />
                  <q-skeleton type="text" width="180px" height="18px" />
                  <q-skeleton type="text" width="160px" height="16px" />
                </div>
              </q-card-section>
              <q-separator />
              <q-card-section>
                <q-skeleton type="text" width="100%" height="16px" class="q-mb-sm" />
                <q-skeleton type="text" width="90%" height="16px" class="q-mb-sm" />
                <q-skeleton type="text" width="95%" height="16px" />
              </q-card-section>
            </q-card>
          </div>

          <div v-else-if="selectedUser" class="profile-scroll">
            <q-card class="profile-card">
              <!-- Profile Header -->
              <div class="profile-header">
                <div class="profile-header-bg"></div>
                <div class="profile-header-content">
                  <q-avatar
                    size="100px"
                    :color="selectedUser.photo ? 'transparent' : 'primary'"
                    text-color="white"
                    class="profile-avatar"
                  >
                    <img v-if="selectedUser.photo" :src="selectedUser.photo" :alt="selectedUser.name" />
                    <q-icon v-else name="person" size="48px" />
                  </q-avatar>
                  
                  <div class="profile-header-info">
                    <h2 class="profile-name">{{ selectedUser.name }}</h2>
                    <p class="profile-email">{{ selectedUser.email }}</p>
                    <p class="profile-job-title">{{ selectedUser.title }}</p>
                  </div>
                </div>
              </div>

              <q-card-section class="profile-body">
                <!-- Experience Years -->
                <div class="profile-section">
                  <div class="section-header">
                    <q-icon name="work" size="20px" color="primary" />
                    <span class="section-title">Experience</span>
                  </div>
                  <div class="section-content">
                    <span class="experience-value">{{ selectedUser.experienceYears || 'Not specified' }}</span>
                    <span v-if="selectedUser.experienceYears" class="experience-label">years of experience</span>
                  </div>
                </div>

                <!-- Summary -->
                <div class="profile-section">
                  <div class="section-header">
                    <q-icon name="description" size="20px" color="primary" />
                    <span class="section-title">Professional Summary</span>
                  </div>
                  <p class="section-text">{{ selectedUser.summary || 'No summary available' }}</p>
                </div>

                <!-- Skills -->
                <div class="profile-section">
                  <div class="section-header">
                    <q-icon name="star" size="20px" color="amber-7" />
                    <span class="section-title">Skills</span>
                  </div>
                  <div class="skills-container">
                    <q-chip
                      v-for="(skill, index) in selectedUser.skills"
                      :key="index"
                      color="blue-1"
                      text-color="blue-9"
                      icon="verified"
                      class="skill-chip"
                    >
                      {{ skill }}
                    </q-chip>
                    <span v-if="!selectedUser.skills?.length" class="empty-text">No skills listed</span>
                  </div>
                </div>

                <q-separator class="section-separator" />

                <!-- Work Experience -->
                <div class="profile-section">
                  <div class="section-header">
                    <q-icon name="work_history" size="20px" color="primary" />
                    <span class="section-title">Work Experience</span>
                  </div>
                  
                  <div v-if="selectedUser.experience?.length" class="timeline">
                    <div
                      v-for="exp in selectedUser.experience"
                      :key="exp.id"
                      class="timeline-item"
                    >
                      <div class="timeline-dot"></div>
                      <div class="timeline-content">
                        <h4 class="timeline-title">{{ exp.title }}</h4>
                        <p class="timeline-company">{{ exp.company }}</p>
                        <p class="timeline-date">
                          {{ formatDate(exp.start_date) }} - {{ formatDate(exp.end_date) }}
                        </p>
                        <p class="timeline-description">{{ exp.description }}</p>
                      </div>
                    </div>
                  </div>
                  <span v-else class="empty-text">No work experience listed</span>
                </div>

                <q-separator class="section-separator" />

                <!-- Education -->
                <div class="profile-section">
                  <div class="section-header">
                    <q-icon name="school" size="20px" color="primary" />
                    <span class="section-title">Education</span>
                  </div>
                  
                  <div v-if="selectedUser.education?.length" class="education-list">
                    <div
                      v-for="edu in selectedUser.education"
                      :key="edu.id"
                      class="education-item"
                    >
                      <div class="education-icon">
                        <q-icon name="school" size="24px" color="primary" />
                      </div>
                      <div class="education-content">
                        <h4 class="education-degree">{{ edu.degree }} in {{ edu.field }}</h4>
                        <p class="education-school">{{ edu.school }}</p>
                        <p class="education-date">
                          {{ formatDate(edu.start_date) }} - {{ formatDate(edu.end_date) }}
                        </p>
                      </div>
                    </div>
                  </div>
                  <span v-else class="empty-text">No education listed</span>
                </div>
              </q-card-section>

              <!-- Action Button -->
              <q-card-section class="profile-actions">
                <q-btn
                  unelevated
                  rounded
                  color="primary"
                  icon="send"
                  label="Send Invitation"
                  @click="inviteJobseeker(selectedUser.id)"
                  size="lg"
                  class="invite-btn"
                />
              </q-card-section>
            </q-card>
          </div>

          <div v-else class="profile-placeholder">
            <q-icon name="person_search" size="120px" color="grey-4" />
            <h3 class="placeholder-title">Select a Candidate</h3>
            <p class="placeholder-text">Choose a candidate from the list to view their detailed profile</p>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useQuasar } from 'quasar';
import api from '../services/auth.service'; // Assuming you have a separate API service
import jobseekerService from '../services/jobseeker.service';
import { authHelpers } from '../services/auth.service';

const $q = useQuasar();

const searchTerm = ref('');
const results = ref([]);
const loading = ref(false);
const profileLoading = ref(false);
const selectedUser = ref(null);
const showFilters = ref(false);

// Filter state
const filters = ref({
  skills: [],
  experienceRange: null,
  jobTitles: []
});

// Experience range options
const experienceRangeOptions = [
  { label: 'Entry Level (0-2 years)', value: '0-2' },
  { label: 'Junior (2-5 years)', value: '2-5' },
  { label: 'Mid Level (5-8 years)', value: '5-8' },
  { label: 'Senior (8-12 years)', value: '8-12' },
  { label: 'Expert (12+ years)', value: '12+' }
];

// Computed properties for filter options
const availableSkills = computed(() => {
  const skillsSet = new Set();
  results.value.forEach(user => {
    if (user.jobSeekerProfile?.skillsJson) {
      user.jobSeekerProfile.skillsJson.forEach(skill => {
        if (skill && skill.trim()) {
          skillsSet.add(skill.trim());
        }
      });
    }
  });
  return Array.from(skillsSet).sort().map(skill => ({
    label: skill,
    value: skill
  }));
});

const availableJobTitles = computed(() => {
  const titlesSet = new Set();
  results.value.forEach(user => {
    if (user.jobSeekerProfile?.title && user.jobSeekerProfile.title.trim()) {
      titlesSet.add(user.jobSeekerProfile.title.trim());
    }
  });
  return Array.from(titlesSet).sort().map(title => ({
    label: title,
    value: title
  }));
});

// Filtered results based on active filters
const filteredResults = computed(() => {
  let filtered = [...results.value];

  // Skills filter
  if (filters.value.skills.length > 0) {
    filtered = filtered.filter(user => {
      const userSkills = user.jobSeekerProfile?.skillsJson || [];
      return filters.value.skills.some(filterSkill => 
        userSkills.some(userSkill => 
          userSkill && userSkill.toLowerCase().includes(filterSkill.toLowerCase())
        )
      );
    });
  }

  // Experience range filter
  if (filters.value.experienceRange) {
    filtered = filtered.filter(user => {
      const experience = parseFloat(user.totalExperienceYears) || 
                         parseFloat(user.jobSeekerProfile?.experienceYears) || 0;
      
      switch (filters.value.experienceRange) {
        case '0-2':
          return experience >= 0 && experience <= 2;
        case '2-5':
          return experience > 2 && experience <= 5;
        case '5-8':
          return experience > 5 && experience <= 8;
        case '8-12':
          return experience > 8 && experience <= 12;
        case '12+':
          return experience > 12;
        default:
          return true;
      }
    });
  }

  // Job titles filter
  if (filters.value.jobTitles.length > 0) {
    filtered = filtered.filter(user => {
      const userTitle = user.jobSeekerProfile?.title || '';
      return filters.value.jobTitles.some(filterTitle => 
        userTitle.toLowerCase().includes(filterTitle.toLowerCase())
      );
    });
  }

  return filtered;
});

// Check if any filters are active
const hasActiveFilters = computed(() => {
  return filters.value.skills.length > 0 || 
         filters.value.experienceRange !== null || 
         filters.value.jobTitles.length > 0;
});

// Methods
const toggleFilters = () => {
  showFilters.value = !showFilters.value;
};

const applyFilters = () => {
  // Filters are applied automatically through computed property
  selectedUser.value = null; // Clear selection when filters change
};

const clearAllFilters = () => {
  filters.value.skills = [];
  filters.value.experienceRange = null;
  filters.value.jobTitles = [];
  applyFilters();
};

const removeSkillFilter = (skill) => {
  const index = filters.value.skills.indexOf(skill);
  if (index > -1) {
    filters.value.skills.splice(index, 1);
    applyFilters();
  }
};

const removeJobTitleFilter = (title) => {
  const index = filters.value.jobTitles.indexOf(title);
  if (index > -1) {
    filters.value.jobTitles.splice(index, 1);
    applyFilters();
  }
};

const getExperienceRangeLabel = (value) => {
  const option = experienceRangeOptions.find(opt => opt.value === value);
  return option ? option.label : value;
};

const loadCompanySuggestions = async () => {
  const currentUser = authHelpers.getCurrentUser();
  if (!currentUser?.id) {
    $q.notify({ type: 'negative', message: 'Please log in to view suggestions' });
    results.value = [];
    return;
  }
  loading.value = true;
  try {
    const res = await jobseekerService.getSuggestions(currentUser.id);
    results.value = (res.data.jobseekers || []).map(user => ({
      ...user,
      id: user.user_id || user.id,
    }));
    selectedUser.value = null;
    // Clear filters when loading new data
    clearAllFilters();
  } catch {
    $q.notify({ type: 'negative', message: 'Error fetching suggestions' });
  } finally {
    loading.value = false;
  }
};

const onSearch = async () => {
  if (!searchTerm.value.trim()) return loadCompanySuggestions();
  loading.value = true;
  try {
    const res = await jobseekerService.searchJobseekers(searchTerm.value);
    let jobseekers = [];
    if (Array.isArray(res.data.jobseekers)) jobseekers = res.data.jobseekers;
    else {
      jobseekers = [...(res.data.exactMatches || []), ...(res.data.fuzzyMatches || [])];
    }
    results.value = jobseekers.map(user => ({
      ...user,
      id: user.user_id || user.id,
    }));
    selectedUser.value = null;
    // Clear filters when searching
    clearAllFilters();
  } catch {
    $q.notify({ type: 'negative', message: 'Error searching jobseekers' });
  } finally {
    loading.value = false;
  }
};

const selectUser = async (user) => {
  profileLoading.value = true;
  try {
    const res = await api.get(`/profile/${user.id}/public`);
    selectedUser.value = { ...res.data, id: user.id };
  } catch {
    $q.notify({ type: 'negative', message: 'Error loading profile details' });
    selectedUser.value = { ...user, id: user.id };
  } finally {
    profileLoading.value = false;
  }
};

const inviteJobseeker = async (userId) => {
  try {
    await api.post(`/invite/${userId}`);
    $q.notify({ type: 'positive', message: `Invitation sent to jobseeker ID ${userId}` });
  } catch {
    $q.notify({ type: 'negative', message: 'Error sending invitation' });
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return 'Present';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

onMounted(loadCompanySuggestions);
</script>

<style scoped>
.suggestions-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
}

/* Page Hero */
.page-hero {
  background: linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 100%);
  padding: 60px 40px 80px;
  margin-bottom: -40px;
  animation: fadeIn 0.6s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.hero-content {
  max-width: 1400px;
  margin: 0 auto;
}

.hero-text {
  margin-bottom: 32px;
}

.hero-title {
  font-size: 48px;
  font-weight: 700;
  color: white;
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 16px;
  animation: slideDown 0.6s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.title-icon {
  font-size: 52px;
}

.hero-subtitle {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.95);
  margin: 0;
}

/* Search Container */
.search-container {
  max-width: 800px;
  animation: slideUp 0.7s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modern-search {
  background: white;
  border-radius: 50px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
}

.modern-search :deep(.q-field__control) {
  border-radius: 50px;
  padding: 8px 24px;
  height: 60px;
}

.modern-search :deep(.q-field__native) {
  font-size: 16px;
  padding-left: 12px;
}

.search-icon {
  font-size: 28px;
  color: #0ea5e9;
}

/* Action Bar */
.action-bar {
  padding: 24px 40px;
  background: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  animation: slideDown 0.8s ease;
}

.action-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
}

.results-info {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.info-icon {
  color: #0ea5e9;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.action-btn {
  font-weight: 600;
  padding: 12px 24px;
  transition: all 0.3s ease;
}

.suggestions-btn {
  background: linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 100%);
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(14, 165, 233, 0.3);
}

/* Filters Section */
.filters-section {
  padding: 0 40px 24px;
  animation: slideDown 0.4s ease;
}

.filters-card {
  max-width: 1400px;
  margin: 0 auto;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  padding: 24px;
  background: white;
}

.filters-header {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 24px;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-group.clear-filter {
  justify-content: flex-end;
}

.filter-label {
  font-size: 14px;
  font-weight: 600;
  color: #4b5563;
}

.clear-btn {
  width: 100%;
  font-weight: 600;
}

/* Active Filters */
.active-filters {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 2px solid #e5e7eb;
}

.active-filters-label {
  font-size: 14px;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 12px;
}

.filters-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

/* Content Container */
.content-container {
  padding: 24px 40px 40px;
}

.content-grid {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 32px;
  min-height: 600px;
}

/* Candidates List */
.candidates-list {
  animation: slideRight 0.6s ease;
}

@keyframes slideRight {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.loading-cards,
.candidates-scroll {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.candidates-scroll {
  max-height: calc(100vh - 400px);
  overflow-y: auto;
  padding-right: 8px;
}

.candidates-scroll::-webkit-scrollbar {
  width: 6px;
}

.candidates-scroll::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 10px;
}

.candidates-scroll::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

.candidates-scroll::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Candidate Card */
.candidate-card {
  border-radius: 16px;
  background: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.candidate-card:hover {
  transform: translateX(4px);
  box-shadow: 0 8px 25px rgba(14, 165, 233, 0.2);
  border-color: #0ea5e9;
}

.candidate-card.selected {
  border-color: #0ea5e9;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  box-shadow: 0 8px 25px rgba(14, 165, 233, 0.25);
}

.candidate-content {
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.candidate-avatar {
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.candidate-avatar img {
  object-fit: cover;
}

.candidate-info {
  flex: 1;
  min-width: 0;
}

.candidate-name {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 4px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.candidate-title {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 8px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.candidate-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 8px;
}

.candidate-experience {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #0ea5e9;
  font-weight: 600;
}

.chevron-icon {
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

.candidate-card:hover .chevron-icon {
  transform: translateX(4px);
}

/* Skeleton States */
.candidate-skeleton,
.profile-skeleton {
  border-radius: 16px;
  background: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.skeleton-content {
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.skeleton-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skeleton-header {
  padding: 32px;
  display: flex;
  align-items: center;
  gap: 24px;
}

.skeleton-header-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.empty-title {
  font-size: 24px;
  font-weight: 700;
  color: #6b7280;
  margin: 20px 0 8px;
}

.empty-text {
  font-size: 16px;
  color: #9ca3af;
  margin: 0 0 24px;
}

.empty-action {
  font-weight: 600;
}

/* Profile Details */
.profile-details {
  animation: slideLeft 0.6s ease;
}

@keyframes slideLeft {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.profile-scroll {
  max-height: calc(100vh - 300px);
  overflow-y: auto;
  padding-right: 8px;
}

.profile-scroll::-webkit-scrollbar {
  width: 6px;
}

.profile-scroll::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 10px;
}

.profile-scroll::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

.profile-scroll::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Profile Card */
.profile-card {
  border-radius: 20px;
  background: white;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
  overflow: hidden;
}

/* Profile Header */
.profile-header {
  position: relative;
  padding-bottom: 24px;
}

.profile-header-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 120px;
  background: linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 100%);
}

.profile-header-content {
  position: relative;
  padding: 32px 32px 0;
  display: flex;
  align-items: flex-end;
  gap: 24px;
}

.profile-avatar {
  flex-shrink: 0;
  border: 4px solid white;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
}

.profile-avatar img {
  object-fit: cover;
}

.profile-header-info {
  flex: 1;
  padding-bottom: 8px;
}

.profile-name {
  font-size: 28px;
  font-weight: 700;
  color: white;
  margin: 0 0 6px 0;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.profile-email {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.95);
  margin: 0 0 4px 0;
}

.profile-job-title {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
  margin: 0;
}

/* Profile Body */
.profile-body {
  padding: 32px;
}

.profile-section {
  margin-bottom: 32px;
}

.profile-section:last-child {
  margin-bottom: 0;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
}

.section-content {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.experience-value {
  font-size: 24px;
  font-weight: 700;
  color: #0ea5e9;
}

.experience-label {
  font-size: 15px;
  color: #6b7280;
}

.section-text {
  font-size: 15px;
  color: #4b5563;
  line-height: 1.7;
  margin: 0;
}

.empty-text {
  font-size: 14px;
  color: #9ca3af;
  font-style: italic;
}

/* Skills */
.skills-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-chip {
  font-weight: 600;
  transition: all 0.3s ease;
}

.skill-chip:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
}

.section-separator {
  margin: 32px 0;
  background: linear-gradient(90deg, transparent, #e5e7eb, transparent);
}

/* Timeline */
.timeline {
  position: relative;
  padding-left: 32px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 8px;
  top: 8px;
  bottom: 8px;
  width: 2px;
  background: linear-gradient(180deg, #0ea5e9, #8b5cf6);
}

.timeline-item {
  position: relative;
  margin-bottom: 24px;
  padding-bottom: 24px;
}

.timeline-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
}

.timeline-dot {
  position: absolute;
  left: -28px;
  top: 6px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: white;
  border: 3px solid #0ea5e9;
  box-shadow: 0 0 0 4px #f0f9ff;
}

.timeline-content {
  background: #f9fafb;
  border-radius: 12px;
  padding: 16px;
  transition: all 0.3s ease;
}

.timeline-content:hover {
  background: #f0f9ff;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.1);
}

.timeline-title {
  font-size: 17px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 4px 0;
}

.timeline-company {
  font-size: 15px;
  font-weight: 600;
  color: #0ea5e9;
  margin: 0 0 6px 0;
}

.timeline-date {
  font-size: 13px;
  color: #6b7280;
  margin: 0 0 12px 0;
}

.timeline-description {
  font-size: 14px;
  color: #4b5563;
  line-height: 1.6;
  margin: 0;
}

/* Education */
.education-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.education-item {
  display: flex;
  gap: 16px;
  background: #f9fafb;
  border-radius: 12px;
  padding: 16px;
  transition: all 0.3s ease;
}

.education-item:hover {
  background: #f0f9ff;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.1);
}

.education-icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.education-content {
  flex: 1;
}

.education-degree {
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 4px 0;
}

.education-school {
  font-size: 15px;
  color: #0ea5e9;
  font-weight: 600;
  margin: 0 0 4px 0;
}

.education-date {
  font-size: 13px;
  color: #6b7280;
  margin: 0;
}

/* Profile Actions */
.profile-actions {
  padding: 24px 32px;
  border-top: 2px solid #f1f5f9;
  display: flex;
  justify-content: center;
}

.invite-btn {
  background: linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 100%);
  font-weight: 700;
  padding: 14px 32px;
  font-size: 16px;
  transition: all 0.3s ease;
}

.invite-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(14, 165, 233, 0.4);
}

/* Profile Placeholder */
.profile-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 500px;
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
}

.placeholder-title {
  font-size: 28px;
  font-weight: 700;
  color: #6b7280;
  margin: 24px 0 12px;
}

.placeholder-text {
  font-size: 16px;
  color: #9ca3af;
  margin: 0;
  max-width: 400px;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .content-grid {
    grid-template-columns: 350px 1fr;
    gap: 24px;
  }
}

@media (max-width: 1024px) {
  .page-hero {
    padding: 40px 24px 60px;
  }

  .hero-title {
    font-size: 36px;
  }

  .title-icon {
    font-size: 40px;
  }

  .action-bar,
  .filters-section,
  .content-container {
    padding-left: 24px;
    padding-right: 24px;
  }

  .content-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .candidates-list {
    max-height: none;
  }

  .candidates-scroll {
    max-height: 500px;
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 28px;
  }

  .title-icon {
    font-size: 32px;
  }

  .hero-subtitle {
    font-size: 16px;
  }

  .modern-search :deep(.q-field__control) {
    height: 50px;
  }

  .action-content {
    flex-direction: column;
    align-items: stretch;
  }

  .action-buttons {
    flex-direction: column;
  }

  .filters-grid {
    grid-template-columns: 1fr;
  }

  .profile-header-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .profile-name {
    font-size: 24px;
  }
}

@media (max-width: 480px) {
  .page-hero {
    padding: 32px 16px 50px;
  }

  .hero-title {
    font-size: 24px;
    flex-direction: column;
    gap: 8px;
  }

  .action-bar,
  .filters-section,
  .content-container {
    padding-left: 16px;
    padding-right: 16px;
  }

  .candidate-card {
    border-radius: 12px;
  }

  .candidate-content {
    padding: 16px;
  }

  .profile-card {
    border-radius: 16px;
  }

  .profile-body {
    padding: 24px 20px;
  }

  .profile-actions {
    padding: 20px 16px;
  }
}
</style>