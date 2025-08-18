<template>
  <q-page class="q-pa-lg breathing-background">
    <div class="row q-gutter-md items-center q-mb-xl">
      <q-input
        standout
        rounded
        dense
        v-model="searchTerm"
        label="Search Jobseekers..."
        debounce="300"
        @update:model-value="onSearch"
        clearable
        class="col-grow bg-grey-2"
        :aria-label="'Search for jobseekers by title or skills'"
      >
        <template #append>
          <q-icon name="search" class="cursor-pointer" @click="onSearch" :aria-label="'Search button'" />
        </template>
      </q-input>

      <q-btn
        rounded
        unelevated
        color="green-7"
        icon="auto_awesome"
        label="Load Suggestions"
        @click="loadCompanySuggestions"
        class="text-weight-bold"
        :aria-label="'Load suggested jobseekers'"
      />

      <q-btn
        rounded
        unelevated
        :color="showFilters ? 'blue-7' : 'grey-7'"
        :icon="showFilters ? 'filter_list' : 'filter_list_off'"
        :label="showFilters ? 'Hide Filters' : 'Show Filters'"
        @click="toggleFilters"
        class="text-weight-bold"
      />
    </div>

    <q-slide-transition>
      <div v-show="showFilters" class="q-mb-lg">
        <q-card flat bordered class="q-pa-md bg-blue-1">
          <div class="text-h6 text-weight-bold q-mb-md">
            <q-icon name="tune" class="q-mr-xs" /> Filters
          </div>
          
          <div class="row q-gutter-md">
            <div class="col-12 col-md-4">
              <q-select
                v-model="filters.skills"
                :options="availableSkills"
                label="Skills"
                multiple
                use-chips
                clearable
                outlined
                dense
                emit-value
                map-options
                @update:model-value="applyFilters"
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

            <div class="col-12 col-md-3">
              <q-select
                v-model="filters.experienceRange"
                :options="experienceRangeOptions"
                label="Experience Years"
                outlined
                dense
                clearable
                emit-value
                map-options
                @update:model-value="applyFilters"
              />
            </div>

            <div class="col-12 col-md-3">
              <q-select
                v-model="filters.jobTitles"
                :options="availableJobTitles"
                label="Job Titles"
                multiple
                use-chips
                clearable
                outlined
                dense
                emit-value
                map-options
                @update:model-value="applyFilters"
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

            <div class="col-12 col-md-2 flex items-end">
              <q-btn
                flat
                rounded
                color="red-6"
                icon="clear_all"
                label="Clear All"
                @click="clearAllFilters"
                size="sm"
                class="full-width"
              />
            </div>
          </div>

          <div v-if="hasActiveFilters" class="q-mt-md">
            <div class="text-subtitle2 text-weight-bold q-mb-xs">Active Filters:</div>
            <div class="row q-gutter-xs">
              <q-chip
                v-for="skill in filters.skills"
                :key="`skill-${skill}`"
                removable
                @remove="removeSkillFilter(skill)"
                color="blue-2"
                text-color="blue-8"
                size="sm"
              >
                Skill: {{ skill }}
              </q-chip>
              
              <q-chip
                v-if="filters.experienceRange"
                removable
                @remove="filters.experienceRange = null; applyFilters()"
                color="green-2"
                text-color="green-8"
                size="sm"
              >
                Experience: {{ getExperienceRangeLabel(filters.experienceRange) }}
              </q-chip>
              
              <q-chip
                v-for="title in filters.jobTitles"
                :key="`title-${title}`"
                removable
                @remove="removeJobTitleFilter(title)"
                color="purple-2"
                text-color="purple-8"
                size="sm"
              >
                Title: {{ title }}
              </q-chip>
            </div>
          </div>
        </q-card>
      </div>
    </q-slide-transition>

    <q-separator spaced color="grey-3" />

    <div class="row" style="min-height: calc(100vh - 150px)">
      <div class="col-12 col-md-4 q-pr-lg" style="overflow-y: auto">
        <div class="text-h6 text-weight-bold q-mb-md">
          {{ searchTerm.trim() ? 'Search Results' : 'Suggested Jobseekers' }}
          <q-badge v-if="filteredResults.length" color="blue-6" class="q-ml-sm">
            {{ filteredResults.length }}
          </q-badge>
        </div>

        <div v-if="loading" class="q-col-gutter-md">
          <div v-for="n in 3" :key="n" class="q-mb-md">
            <q-card flat bordered class="q-pa-sm">
              <q-card-section class="row items-center">
                <q-avatar size="56px" class="q-mr-md">
                  <q-skeleton type="QAvatar" size="56px" />
                </q-avatar>
                <div>
                  <q-skeleton type="text" width="150px" />
                  <q-skeleton type="text" width="100px" />
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <div v-else>
          <div v-if="filteredResults.length" class="q-col-gutter-md">
            <div style="max-width: 600px; max-height: 800px; overflow: auto;">
            <div
              v-for="user in filteredResults"
              :key="user.id"
              class="q-mb-md"
            >
              <q-card
                flat
                bordered
                class="hover-card cursor-pointer"
                :class="{ 'bg-blue-1': selectedUser && selectedUser.id === user.id }"
                @click="selectUser(user)"
                role="button"
                tabindex="0"
                @keyup.enter="selectUser(user)"
                :aria-label="`Select ${user.name || 'Unnamed'} profile`"
              >
                <q-card-section class="row items-center">
                  <q-avatar
                    size="56px"
                    :color="user.photo ? 'transparent' : 'blue-6'"
                    text-color="white"
                    :icon="user.photo ? null : 'person'"
                    class="q-mr-md"
                  >
                    <img v-if="user.photo" :src="user.photo" :alt="`Profile photo of ${user.name || 'Unnamed'}`" />
                  </q-avatar>
                  <div class="full-width">
                    <div class="text-h6 text-weight-bold">{{ user.name || 'Unnamed' }}</div>
                    <div class="text-caption text-grey-8">{{ user.jobSeekerProfile.title || 'Role not set' }}</div>
                    <div class="text-caption text-grey-6">
                      {{ user.jobSeekerProfile.skillsJson?.slice(0, 2).join(', ') || 'No skills' }}
                    </div>
                    <div class="text-caption text-blue-6">
                      <q-icon name="work" size="12px" class="q-mr-xs" />
                      {{  user.jobSeekerProfile.experienceYears || 0 }} years exp.
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
</div>
          <div v-else class="flex flex-center column q-my-xl">
            <q-icon name="groups" size="64px" color="grey-5" />
            <div class="text-subtitle1 text-grey q-mt-sm">
              {{ hasActiveFilters ? 'No jobseekers match your filters' : 'No jobseekers found' }}
            </div>
            <q-btn
              v-if="hasActiveFilters"
              flat
              rounded
              color="blue-6"
              label="Clear Filters"
              @click="clearAllFilters"
              class="q-mt-sm"
            />
          </div>
        </div>
      </div>

      <div class="col-12 col-md-8 q-pl-lg" style="overflow-y: auto">
        <div v-if="profileLoading" class="q-pa-md">
          <q-card flat bordered>
            <q-card-section class="row items-center">
              <q-skeleton type="QAvatar" size="72px" class="q-mr-md" />
              <div>
                <q-skeleton type="text" width="200px" class="q-mb-xs" />
                <q-skeleton type="text" width="150px" />
              </div>
            </q-card-section>
            <q-separator spaced />
            <q-card-section>
              <q-skeleton type="text" width="90%" class="q-mb-sm" />
              <q-skeleton type="text" width="80%" class="q-mb-sm" />
              <q-skeleton type="text" width="95%" />
            </q-card-section>
          </q-card>
        </div>

        <div v-else-if="selectedUser" class="q-pa-md">
          <div style="max-width: 1300px; max-height: 800px; overflow: auto;">
          <q-card elevated class="q-pa-md bg-yellow-1">
            <div class="row items-center q-mb-lg">
              <q-avatar
                size="80px"
                :color="selectedUser.photo ? 'transparent' : 'blue-6'"
                text-color="white"
                :icon="selectedUser.photo ? null : 'person'"
                class="q-mr-md shadow-2"
              >
                <img
                  v-if="selectedUser.photo"
                  :src="selectedUser.photo"
                  :alt="`Profile photo of ${selectedUser.name}`"
                  style="object-fit: cover"
                />
              </q-avatar>
              <div>
                <div class="text-h5 text-weight-bold">{{ selectedUser.name }}</div>
                <div class="text-subtitle2 text-grey-8">{{ selectedUser.email }}</div>
                <div class="text-subtitle2 text-grey-8">{{ selectedUser.title }}</div>
              </div>
            </div>

            <q-separator spaced color="grey-5" />
            <div class="q-mb-lg">
              <div class="text-subtitle1 text-weight-bold q-mb-xs">
                <q-icon name="work" size="18px" class="q-mr-xs" color="blue-6" /> Experience
              </div>
              <div class="text-body2 text-grey-8">{{ selectedUser.experienceYears || 'Not specified' }} years</div>
              </div>
            <div class="q-mb-lg">
              <div class="text-subtitle1 text-weight-bold q-mb-xs">
                <q-icon name="description" size="18px" class="q-mr-xs" color="blue-6" /> Summary
              </div>
              <div class="text-body2 text-grey-8">{{ selectedUser.summary || 'No summary available' }}</div>
            </div>

            <div class="q-mb-lg">
              <div class="text-subtitle1 text-weight-bold q-mb-xs">
                <q-icon name="star" color="green-7" size="18px" class="q-mr-xs" /> Skills
              </div>
              <div>
                <q-chip
                  v-for="(skill, index) in selectedUser.skills"
                  :key="index"
                  color="green-1"
                  text-color="green-8"
                  class="q-mr-xs q-mb-xs"
                  dense
                >
                  {{ skill }}
                </q-chip>
                <span v-if="!selectedUser.skills?.length" class="text-grey-6">None listed</span>
              </div>
            </div>

            <q-separator spaced color="grey-4" style="width: 80%;" class="q-mx-auto"/>
            <div class="q-mb-lg">
              <div class="text-subtitle1 text-weight-bold q-mb-xs">
                <q-icon name="work" color="blue-6" size="18px" class="q-mr-xs" /> Experience
              </div>
              <div v-if="selectedUser.experience?.length">
                <div
                  v-for="exp in selectedUser.experience"
                  :key="exp.id"
                  class="q-mb-md"
                >
                  <div class="text-weight-bold text-grey-9">{{ exp.title }} - {{ exp.company }}</div>
                  <div class="text-caption text-grey-7">
                    {{ formatDate(exp.start_date) }} - {{ formatDate(exp.end_date) }}
                  </div>
                  <div class="text-body2 text-grey-8">{{ exp.description }}</div>
                </div>
              </div>
              <span v-else class="text-grey-6">None listed</span>
            </div>

            <q-separator spaced color="grey-4" style="width: 80%;" class="q-mx-auto" />
            <div>
              <div class="text-subtitle1 text-weight-bold q-mb-xs">
                <q-icon name="school" color="blue-6" size="18px" class="q-mr-xs" /> Education
              </div>
              <div v-if="selectedUser.education?.length">
                <div
                  v-for="edu in selectedUser.education"
                  :key="edu.id"
                  class="q-mb-md"
                >
                  <div class="text-weight-bold text-grey-9">{{ edu.degree }} in {{ edu.field }}</div>
                  <div class="text-grey-8">{{ edu.school }}</div>
                  <div class="text-caption text-grey-7">
                    {{ formatDate(edu.start_date) }} - {{ formatDate(edu.end_date) }}
                  </div>
                </div>
              </div>
              <span v-else class="text-grey-6">None listed</span>
            </div>

            <q-card-actions align="right" class="q-mt-md">
              <q-btn
                unelevated
                rounded
                color="blue-6"
                icon="send"
                label="Send Invite"
                @click="inviteJobseeker(selectedUser.id)"
              />
            </q-card-actions>
          </q-card>
        </div>
        </div>
        <div v-else class="flex flex-center column q-my-xl">
          <q-icon name="person_outline" size="64px" color="grey-5" />
          <div class="text-subtitle1 text-grey q-mt-sm">Select a jobseeker to view their profile</div>
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
/* Add this keyframe animation */
@keyframes breathingBackground {
  0% {
    background-color: #dfeffc; /* A very light blue */
  }
  50% {
    background-color: #d3e7fe; /* A slightly deeper light blue */
  }
  100% {
    background-color: #bfe1ff; /* Return to the start color */
  }
}

.breathing-background {
  animation: breathingBackground 10s ease-in-out infinite;
}

.hover-card {
  transition: all 0.3s ease;
  background-color: #9edfdf8b;
}
.hover-card:hover {
  transform: translateY(-3px) scale(1.01);
  box-shadow: 0 4px 12px rgba(81, 46, 46, 0.999);
}
.q-chip {
  margin: 2px;
}
</style>