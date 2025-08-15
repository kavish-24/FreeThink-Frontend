<template>
  <div class="joblistingpage">
    <q-page class="q-pa-md job-page-wrapper">
      <div class="row job-page-content" style="max-width: 1400px; margin: 0 auto; width: 100%;">
        <!-- Left pane: Job List -->
        <div class="col-12 col-lg-6 job-list-pane">
          <div v-if="!searchQuery && authHelpers.getCurrentUser()" class="text-h6 q-mb-md">
            Suggested for You
          </div>

          <!-- Filters Section -->
          <q-expansion-item 
            icon="tune" 
            label="Filters" 
            class="q-mb-md"
            :default-opened="false"
          >
            <div class="q-pa-md bg-grey-1 rounded-borders">
              <!-- Sort Option -->
              <q-select
                v-model="sortOption"
                :options="sortOptions"
                label="Sort By"
                outlined
                dense
                class="q-mb-md"
              />

              <!-- Work Mode Filter -->
              <q-select
                v-model="filters.workMode"
                :options="workModeOptions"
                label="Work Mode"
                outlined
                dense
                multiple
                use-chips
                class="q-mb-md"
              />

              <!-- Salary Range Filter -->
              <div class="q-mb-md">
                <q-item-label class="q-mb-sm">Salary Range</q-item-label>
                <div class="row q-gutter-sm">
                  <q-input
                    v-model.number="filters.salaryRange.min"
                    type="number"
                    label="Min Salary"
                    outlined
                    dense
                    class="col"
                    :min="0"
                  />
                  <q-input
                    v-model.number="filters.salaryRange.max"
                    type="number"
                    label="Max Salary"
                    outlined
                    dense
                    class="col"
                    :min="0"
                  />
                </div>
              </div>

              <!-- Skills Filter -->
              <q-select
                v-model="filters.skills"
                :options="availableSkills"
                label="Skills"
                outlined
                dense
                multiple
                use-chips
                use-input
                @filter="filterSkills"
                class="q-mb-md"
              />

              <!-- Experience Level Filter -->
              <q-select
                v-model="filters.experienceLevel"
                :options="experienceLevelOptions"
                label="Experience Level"
                outlined
                dense
                multiple
                use-chips
                option-value="value"
                option-label="label"
                emit-value
                map-options
                class="q-mb-md"
              />

              <!-- Posted Date Filter -->
              <q-select
                v-model="filters.postedDate"
                :options="postedDateOptions"
                label="Posted Date"
                outlined
                dense
                option-value="value"
                option-label="label"
                emit-value
                map-options
                class="q-mb-md"
              />
             
              <!-- Clear Filters Button -->
              <q-btn 
                label="Clear All Filters" 
                color="grey" 
                outline 
                size="sm"
                @click="clearFilters"
                class="full-width"
              />
            </div>
          </q-expansion-item>

          <!-- Results Count -->
          <div class="text-caption text-grey-7 q-mb-sm">
            Showing {{ filteredJobs.length }} {{ filteredJobs.length === 1 ? 'job' : 'jobs' }}
          </div>
          
          <div class="job-list-scroll">
            <q-card
              v-for="job in filteredJobs"
              :key="job.id"
              class="q-mb-sm job-card row items-center no-wrap"
              :class="{ 'selected-job-card': selectedJobId === job.id }"
              style="cursor: pointer;"
              @click="selectJob(job)"
            >
              <q-card-section class="col row items-center no-wrap q-pa-md">
                <q-avatar size="48px" class="bg-grey-3 text-grey-8 q-mr-md">
                  <q-icon name="business" size="28px" />
                </q-avatar>

                <div class="col">
                  <div class="text-subtitle1 text-weight-medium">{{ job.title }}</div>
                  <div class="text-caption text-grey-7">{{ job.companyName || job.company_name }}</div>

                  <div class="row items-center text-caption text-grey-8 q-mt-xs q-gutter-sm">
                    <div class="row items-center">
                      <q-icon name="place" size="16px" class="q-mr-xs" />
                      {{ job.location }}
                    </div>
                    <div class="row items-center">
                      <q-icon name="attach_money" size="16px" class="q-mr-xs" />
                      {{ job.salary }}
                    </div>
                    <div class="row items-center">
                      <q-icon name="schedule" size="16px" class="q-mr-xs" />
                      {{ timeAgo(job.postedAt) }}
                    </div>
                    <div class="row items-center">
                      <q-icon name="work" size="16px" class="q-mr-xs" />
                      {{ job.experience_min && job.experience_min > 0 ? job.experience_min + ' yrs' : 'Fresher' }}
                    </div>
                  </div>

                  <div class="q-mt-sm">
                    <q-badge v-if="job.mode === 'Remote'" color="green" label="Remote" class="q-mr-sm" />
                    <q-badge v-if="job.mode === 'Hybrid'" color="blue" label="Hybrid" class="q-mr-sm" />
                    <q-badge v-if="job.mode === 'Work from Office'" color="purple" label="Work from Office" class="q-mr-sm" />
                    <q-chip
                      v-for="(skill, i) in job.skills.slice(0, 3)"
                      :key="i"
                      color="primary"
                      text-color="white"
                      size="sm"
                      class="q-mr-xs"
                    >
                      {{ skill }}
                    </q-chip>
                    <q-chip
                      v-if="job.skills.length > 3"
                      color="grey"
                      text-color="white"
                      size="sm"
                    >
                      +{{ job.skills.length - 3 }} more
                    </q-chip>
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <div v-if="filteredJobs.length === 0" class="empty-state-container q-mt-lg">
              <div v-if="hasActiveFilters">
                <q-icon name="filter_list_off" size="30px" class="q-mb-sm" />
                <div>No jobs match your current filters</div>
                <q-btn 
                  label="Clear Filters" 
                  color="primary" 
                  outline 
                  size="sm" 
                  class="q-mt-sm"
                  @click="clearFilters"
                />
              </div>
              <div v-else-if="searchQuery">
                <q-icon name="search_off" size="30px" class="q-mb-sm" />
                No jobs found for "<strong>{{ searchQuery }}</strong>"
              </div>
              <div v-else-if="!authHelpers.getCurrentUser()">
                <q-icon name="lock" size="30px" class="q-mb-sm" />
                Please <router-link to="/login">log in</router-link> to get personalized job suggestions.
              </div>
              <div v-else>
                <q-icon name="info" size="30px" class="q-mb-sm" />
                No job suggestions available at the moment.
              </div>
            </div>
          </div>
        </div>

        <!-- Right pane: Job Detail -->
        <div class="col-12 col-lg-6 job-detail-pane">
          <div v-if="loadingDetail" class="text-center q-my-xl">
            <q-spinner-dots size="40px" color="primary" />
            <div>Loading job details...</div>
          </div>

          <div v-else-if="selectedJob" class="job-detail-scroll">
            <JobDetailContent :job="selectedJob" />
          </div>

          <div v-else class="text-center text-grey q-pa-xl">
            Select a job to see details here.
          </div>
        </div>
      </div>
    </q-page>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';

import suggestService from '../services/suggest.service';
import searchService from '../services/search.service';
import jobService from '../services/job.service.js';

import { authHelpers } from '../services/auth.service';

import JobDetailContent from './JobDetailContent.vue';

const props = defineProps({
  searchQuery: {
    type: String,
    default: ''
  }
});

// Experience level options with proper structure
const experienceLevelOptions = [
  { label: 'Fresher (0-1 years)', value: 0 },
  { label: '1-3 years', value: 1 },
  { label: '3-5 years', value: 2 },
  { label: '5+ years', value: 3 }
];

// Posted date options with proper structure
const postedDateOptions = [
  { label: 'Last 24 hours', value: 1 },
  { label: 'Last 3 days', value: 3 },
  { label: 'Last week', value: 7 },
  { label: 'Last 2 weeks', value: 14 },
  { label: 'Last month', value: 30 }
];

function timeAgo(dateString) {
  const now = new Date();
  const posted = new Date(dateString);
  const seconds = Math.floor((now - posted) / 1000);

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
    }
  }
  return 'Just now';
}

const route = useRoute();
const category = computed(() => route.params.category?.toLowerCase().trim() || '');

const jobList = ref([]);
const sortOption = ref({ label: 'Date: Newest First', value: 'dateDesc' });

// Filter options
const sortOptions = [
  { label: 'Salary: High to Low', value: 'salaryDesc' },
  { label: 'Salary: Low to High', value: 'salaryAsc' },
  { label: 'Date: Newest First', value: 'dateDesc' },
  { label: 'Date: Oldest First', value: 'dateAsc' },
  { label: 'Best Match', value: 'matchDesc' }
];

const workModeOptions = ['Remote', 'Hybrid', 'Work from Office'];

// Initialize filters with proper defaults
const filters = ref({
  workMode: [],
  salaryRange: { min: 0, max: 1000000 }, // Increased max default
  skills: [],
  experienceLevel: [],
  companySize: null,
  postedDate: null
});

// Available skills for filtering (populated from job data)
const availableSkills = ref([]);
const skillsOptions = ref([]);

const searchTerm = ref(props.searchQuery?.toLowerCase().trim() || '');

const loadingDetail = ref(false);
const selectedJobId = ref(null);
const selectedJob = ref(null);

/* ---------- helpers ---------- */
const safeParseJson = (input) => {
  if (Array.isArray(input)) return input;
  if (!input && input !== '') return [];
  if (typeof input !== 'string') return [];
  try {
    const parsed = JSON.parse(input);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return input
      .toString()
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
  }
};

const deriveMode = (job) => {
  const modeVal = (job.mode || job.location || job.type || '').toString().toLowerCase();
  if (modeVal.includes('remote')) return 'Remote';
  if (modeVal.includes('hybrid')) return 'Hybrid';
  return 'Work from Office';
};

const normalizeJob = (job) => {
  const parsedSkills = safeParseJson(job.skills);
  const parsedTags = safeParseJson(job.tags);
  const effectiveTags = parsedSkills.length ? parsedSkills : parsedTags;

  return {
    id: job.id ?? job.jobId ?? job.job_id ?? null,
    jobId: job.jobId ?? job.id ?? job.job_id ?? null,
    title: job.title ?? 'Untitled',
    company_name: job.company_name ?? job.company?.companyName ?? job.employer ?? 'Unknown Company',
    companyName: job.companyName ?? job.company_name ?? job.company?.companyName ?? job.employer ?? 'Unknown Company',
    location: job.location ?? 'N/A',
    salary: job.salary ?? job.salary_range ?? 'N/A',
    duration: job.duration ?? '',
    mode: job.mode ?? deriveMode(job),
    skills: parsedSkills,
    tags: effectiveTags,
    postedAt: job.postedAt ?? job.posted_at ?? new Date().toISOString(),
    match: typeof job.match === 'number' ? job.match : parseFloat(job.match) || 0,
    category: (job.category ?? '').toString(),
    experience_min: job.experience_min ?? 0,
    companySize: job.companySize ?? job.company_size ?? ''
  };
};

/* ---------- fetch / mapping ---------- */
const fetchJobs = async () => {
  const currentUser = authHelpers.getCurrentUser();
  const isLoggedIn = !!currentUser?.id;

  try {
    let result;
    let rawJobs = [];

    if (searchTerm.value && searchTerm.value.length > 0) {
      result = await searchService.searchJobs(searchTerm.value);
      rawJobs = result?.success && Array.isArray(result.data?.jobs) ? result.data.jobs : [];
    } else if (isLoggedIn) {
      result = await suggestService.getSuggestions(currentUser.id);
      rawJobs = result?.success && Array.isArray(result.data) ? result.data : [];
    } else {
      rawJobs = [];
    }

    const mapped = rawJobs.map(normalizeJob);

    if (!searchTerm.value) {
      mapped.sort((a, b) => (b.match || 0) - (a.match || 0));
    }

    jobList.value = mapped;
    
    // Extract unique skills for filter options
    const allSkills = new Set();
    mapped.forEach(job => {
      job.skills.forEach(skill => {
        if (skill && skill.trim()) {
          allSkills.add(skill.trim());
        }
      });
    });
    skillsOptions.value = Array.from(allSkills).sort();
    availableSkills.value = skillsOptions.value;
    
  } catch (err) {
    console.error('API Error:', err);
    jobList.value = [];
  }
};

/* ---------- filtering ---------- */
const parseSalaryRange = (salaryStr) => {
  if (!salaryStr || typeof salaryStr !== 'string') return { min: 0, max: 0, avg: 0 };

  // Remove currency symbols and clean the string
  const cleanStr = salaryStr.replace(/[₹$,]/g, '').replace(/\s+/g, ' ').trim();
  
  // Match patterns like "50000-100000", "50K-100K", "50000 to 100000", etc.
  const rangePattern = /(\d+(?:\.\d+)?)\s*(?:k|K|lakh|lakhs?)?\s*(?:-|to)\s*(\d+(?:\.\d+)?)\s*(?:k|K|lakh|lakhs?)?/i;
  const singlePattern = /(\d+(?:\.\d+)?)\s*(?:k|K|lakh|lakhs?)?/i;
  
  let matches = cleanStr.match(rangePattern);
  
  if (matches) {
    let min = parseFloat(matches[1]);
    let max = parseFloat(matches[2]);
    
    // Handle K (thousands) multiplier
    if (/k|K/i.test(matches[0])) {
      min *= 1000;
      max *= 1000;
    }
    
    // Handle lakh multiplier
    if (/lakh|lakhs/i.test(matches[0])) {
      min *= 100000;
      max *= 100000;
    }
    
    return { min, max, avg: Math.round((min + max) / 2) };
  }
  
  // Try single number
  matches = cleanStr.match(singlePattern);
  if (matches) {
    let value = parseFloat(matches[1]);
    
    if (/k|K/i.test(matches[0])) {
      value *= 1000;
    }
    
    if (/lakh|lakhs/i.test(matches[0])) {
      value *= 100000;
    }
    
    return { min: value, max: value, avg: value };
  }
  
  return { min: 0, max: 0, avg: 0 };
};

const parseJobDate = (job) => {
  const rawDate = job.postedAt || job.posted_at || job.created_at || '';
  if (!rawDate) return 0;

  const date = new Date(rawDate);
  return isNaN(date) ? 0 : date.getTime();
};

const isWithinDateRange = (job, days) => {
  if (!days) return true;
  
  const jobDate = parseJobDate(job);
  if (jobDate === 0) return false; // Invalid date
  
  const now = Date.now();
  const cutoff = now - (days * 24 * 60 * 60 * 1000);
  
  return jobDate >= cutoff;
};

const hasActiveFilters = computed(() => {
  return filters.value.workMode.length > 0 ||
         filters.value.salaryRange.min > 0 ||
         filters.value.salaryRange.max < 1000000 ||
         filters.value.skills.length > 0 ||
         filters.value.experienceLevel.length > 0 ||
         filters.value.companySize !== null ||
         filters.value.postedDate !== null;
});

const filteredJobs = computed(() => {
  const jobs = Array.isArray(jobList.value) ? jobList.value : [];
  const cat = category.value;

  let result = jobs.filter(job => {
    const { min, max, avg } = parseSalaryRange(job.salary);
    const jobCat = (job.category ?? '').toLowerCase().trim();

    // Category filter (from route)
    if (cat && jobCat !== cat) return false;

    // Work mode filter
    if (filters.value.workMode.length > 0 && !filters.value.workMode.includes(job.mode)) {
      return false;
    }

    // Salary range filter - only filter if we have valid salary data
    if (max > 0 && filters.value.salaryRange.min > 0 && avg < filters.value.salaryRange.min) {
      return false;
    }
    if (min > 0 && filters.value.salaryRange.max < 1000000 && avg > filters.value.salaryRange.max) {
      return false;
    }

    // Skills filter
    if (filters.value.skills.length > 0) {
      const jobSkills = Array.isArray(job.skills) ? job.skills.map(s => s.toLowerCase()) : [];
      const hasSkill = filters.value.skills.some(skill => 
        jobSkills.some(jobSkill => jobSkill.includes(skill.toLowerCase()))
      );
      if (!hasSkill) return false;
    }

    // Experience level filter
    if (filters.value.experienceLevel.length > 0) {
      const exp = Number(job.experience_min) || 0;
      
      const hasLevel = filters.value.experienceLevel.some(level => {
        if (level === 0) return exp >= 0 && exp <= 1;   // Fresher: 0-1 years
        if (level === 1) return exp >= 1 && exp <= 3;   // 1-3 years
        if (level === 2) return exp > 3 && exp <= 5;    // 3-5 years  
        if (level === 3) return exp > 5;                // 5+ years
        return false;
      });

      if (!hasLevel) return false;
    }

    // Company size filter
    if (filters.value.companySize) {
      if (job.companySize !== filters.value.companySize) {
        return false;
      }
    }

    // Posted date filter
    if (filters.value.postedDate) {
      if (!isWithinDateRange(job, filters.value.postedDate)) {
        return false;
      }
    }

    // Search term filter (when not using backend search)
    if (searchTerm.value && searchTerm.value.length > 0) {
      const searchLower = searchTerm.value.toLowerCase();
      const titleMatch = job.title.toLowerCase().includes(searchLower);
      const companyMatch = (job.company_name || '').toLowerCase().includes(searchLower);
      const skillsMatch = job.skills.some(skill => skill.toLowerCase().includes(searchLower));
      const locationMatch = job.location.toLowerCase().includes(searchLower);
      
      if (!titleMatch && !companyMatch && !skillsMatch && !locationMatch) {
        return false;
      }
    }

    return true;
  });

  // Sorting
  const sortValue = sortOption.value?.value || 'dateDesc';
  
  if (sortValue === 'salaryDesc') {
    result.sort((a, b) => parseSalaryRange(b.salary).avg - parseSalaryRange(a.salary).avg);
  } else if (sortValue === 'salaryAsc') {
    result.sort((a, b) => parseSalaryRange(a.salary).avg - parseSalaryRange(b.salary).avg);
  } else if (sortValue === 'dateDesc') {
    result.sort((a, b) => parseJobDate(b) - parseJobDate(a));
  } else if (sortValue === 'dateAsc') {
    result.sort((a, b) => parseJobDate(a) - parseJobDate(b));
  } else if (sortValue === 'matchDesc') {
    result.sort((a, b) => (b.match || 0) - (a.match || 0));
  }

  return result;
});

// Skills filter function for search
const filterSkills = (val, update) => {
  if (val === '') {
    update(() => {
      availableSkills.value = skillsOptions.value;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    availableSkills.value = skillsOptions.value.filter(skill => 
      skill.toLowerCase().indexOf(needle) > -1
    );
  });
};

// Clear all filters
const clearFilters = () => {
  filters.value = {
    workMode: [],
    salaryRange: { min: 0, max: 1000000 },
    skills: [],
    experienceLevel: [],
    companySize: null,
    postedDate: null
  };
  sortOption.value = { label: 'Date: Newest First', value: 'dateDesc' };
};

/* ---------- watch / lifecycle ---------- */
watch(() => props.searchQuery, (newQuery) => {
  searchTerm.value = newQuery?.toLowerCase().trim() || '';
  fetchJobs();
});

onMounted(() => {
  fetchJobs();
});

/* ---------- selection ---------- */
async function selectJob(job) {
  if (!job || selectedJobId.value === job.id) return;

  selectedJobId.value = job.id;
  loadingDetail.value = true;
  try {
    const res = await jobService.getJobById(job.id);
    selectedJob.value = res?.data ?? res;
  } catch (err) {
    console.error('Failed to load job details', err);
    selectedJob.value = null;
  } finally {
    loadingDetail.value = false;
  }
}
</script>

<style scoped>
.joblistingpage {
  font-family: 'Inter', sans-serif;
  background-color: #f9f9f9;
}

.job-page-wrapper {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding-top: 20px;
  padding-bottom: 20px;
}

.job-page-content {
  display: flex;
  flex-wrap: nowrap;
  gap: 16px;
  height: 85vh;
}

.job-list-pane,
.job-detail-pane {
  background: white;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  padding: 16px;
  overflow: hidden;
  height: 100%;
  flex: 1;
  min-width: 0;
}

.job-list-scroll,
.job-detail-scroll {
  overflow-y: auto;
  flex-grow: 1;
  padding-right: 8px;
}

.job-card {
  border-radius: 12px;
  background-color: #fff;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.job-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
}

.selected-job-card {
  border: 2px solid #1565c0;
  background-color: #e3f2fd;
}

.empty-state-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 10vh;
  color: #757575;
  text-align: center;
}

.q-badge {
  font-size: 12px;
}

.no-underline {
  text-decoration: none;
  color: inherit;
}

.border-job-primary {
  border: 2px solid #1565c0;
}

.bg-job-secondary {
  background-color: rgba(21, 101, 192, 0.1);
}

.text-job-accent {
  color: #10b981;
}

.fill-job-warning {
  fill: #f59e0b;
}

.text-job-warning {
  color: #f59e0b;
}

.text-job-primary {
  color: #1565c0;
}

@media (min-width: 768px) {
  .job-page-content {
    flex-direction: row;
  }
  .job-list-pane,
  .job-detail-pane {
    width: 50%;
    max-width: 700px;
  }
}

@media (max-width: 767px) {
  .job-page-content {
    flex-direction: column;
  }
  .job-list-pane,
  .job-detail-pane {
    width: 100%;
  }
}
</style>