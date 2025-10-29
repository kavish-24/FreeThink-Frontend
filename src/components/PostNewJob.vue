<template>
  <div class="portal-layout">
    <AppHeader class="sticky-header" />
    <div class="page-wrapper row no-wrap">
      <EmployerSidebar :active-link="selected" @navigate="(label) => selected = label" />

      <div class="content-area post-job-bg q-pa-md q-pa-lg-xl">
      <div class="step-indicator-container q-mb-xl">
        <div class="text-center q-mb-md">
          <div class="text-overline text-primary">Step {{ step }} of 4</div>
          <div class="text-h5 text-weight-bold step-section-title">{{ stepSections[step - 1] }}</div>
        </div>
        <q-linear-progress :value="step / 4" color="primary" track-color="white" size="8px" rounded />
      </div>

      <!-- Company Verification Status Banners -->
      <q-banner v-if="verificationStatus === 'pending'" class="bg-blue-1 text-blue-9 q-mb-md" rounded>
        <template v-slot:avatar>
          <q-icon name="pending_actions" color="blue-7" size="2em" />
        </template>
        <div class="text-weight-medium">Your company is under review</div>
        <div>You can post jobs, but they will be marked as pending until your company is verified. The verification
          process typically takes 1-2 business days.</div>
      </q-banner>
      <q-banner v-else-if="verificationStatus === 'rejected'" class="bg-red-1 text-red-9 q-mb-md" rounded>
        <template v-slot:avatar>
          <q-icon name="warning" color="red-7" size="2em" />
        </template>
        <div class="text-weight-medium">Company Verification Required</div>
        <div>Your company verification was rejected. Reason: {{ rejectionReason || 'Not specified' }}. Please update
          your company information and submit for review again.</div>
        <template v-slot:action>
          <q-btn flat color="red-8" label="Update Company Profile" to="/company-profile" />
        </template>
      </q-banner>
      <q-banner v-else-if="verificationStatus === 'approved'" class="bg-green-1 text-green-9 q-mb-md" rounded>
        <template v-slot:avatar>
          <q-icon name="verified" color="green-7" size="2em" />
        </template>
        <div class="text-weight-medium">Your company is verified!</div>
        <div>Your job postings will be published immediately after submission.</div>
      </q-banner>

      <!-- Step 1: Job Details -->
      <q-card v-if="step === 1" class="step-card full-width-card">
        <q-card-section class="q-pt-lg">
          <div class="text-h6">Job Details</div>
          <p>Provide the essential details for your job opening.</p>
        </q-card-section>
        <q-form @submit.prevent="nextStep">
          <q-card-section class="q-pa-xl">
            <div class="q-gutter-y-lg">
              <div class="row q-col-gutter-x-lg q-col-gutter-y-lg">
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="form.title"
                    label="Job Title"
                    filled
                    stack-label
                    required
                    @input="debouncedFetchSuggestions"
                    class="form-field-large"
                  />
                </div>
                <div class="col-12 col-md-6">
                  <q-input 
                    v-model="form.location" 
                    label="Job Location (e.g., City, 'Remote')" 
                    filled 
                    stack-label
                    required 
                    class="form-field-large"
                  />
                </div>
                <div class="col-12 col-md-6">
                  <q-select
  v-model="form.type"
  :options="jobTypeOptions"
  emit-value          
  map-options        
  label="Job Type"
  filled
  stack-label
  required
/>

                </div>
                <div class="col-12 col-md-6">
                  <q-input 
                    v-model.number="form.positions" 
                    type="number" 
                    label="Number of Positions" 
                    filled 
                    stack-label
                    required 
                    :rules="[val => val > 0 || 'Must be greater than 0']"
                    class="form-field-large"
                  />
                </div>
              </div>
            </div>
            <q-separator spaced="xl" />
            <div class="q-gutter-y-lg">
              <div class="row q-col-gutter-x-lg q-col-gutter-y-lg">
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="form.salary"
                    label="Salary Range (per annum)"
                    filled
                    stack-label
                    required
                    hint="e.g., ₹8,00,000 - ₹12,00,000"
                    class="form-field-large"
                  />
                </div>
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="form.timeline" 
                    label="Recruitment Timeline" 
                    filled 
                    stack-label 
                    required
                    hint="e.g., 'Immediate', 'Within 2 weeks'" 
                    class="form-field-large"
                  />
                </div>
              </div>
              <q-input 
                v-model="form.benefits" 
                label="Bonus and Benefits (Optional)" 
                filled 
                stack-label 
                class="form-field-large"
              />
            </div>
            <q-separator spaced="xl" />
            
            <!-- Job Tags Section -->
            <div class="row">
              <div class="col-12">
                <div class="text-subtitle1 q-mb-sm text-weight-medium">Job Tags</div>
                <div class="q-mb-sm">
                  <q-chip
                    v-for="(tag, index) in form.tags"
                    :key="index"
                    removable
                    @remove="form.tags.splice(index, 1)"
                    class="q-mr-xs q-mb-xs"
                    color="primary"
                    text-color="white"
                  >
                    {{ tag }}
                  </q-chip>
                </div>
                <q-input
                  v-model="tagInput"
                  label="Add Job Tags"
                  filled
                  stack-label
                  hint="Type a tag and press Enter or comma to add"
                  @keyup="onTagKeyup"
                  @blur="addTag"
                  @focus="showCachedSuggestions('tags')"
                  class="form-field-large"
                />
                
                <!-- Available Tags from Cache -->
                <div v-if="showTagsSuggestions && tagsSuggestions.length" class="q-mt-sm">
                  <div class="text-caption text-grey-6 q-mb-xs">Suggested tags (click to add):</div>
                  <div class="suggestion-chips">
                    <q-chip
                      v-for="(suggestion, index) in tagsSuggestions"
                      :key="index"
                      clickable
                      @click="addSuggestionToTags(suggestion)"
                      class="q-mr-xs q-mb-xs suggestion-chip"
                      outline
                      color="primary"
                      :disable="form.tags.includes(suggestion)"
                    >
                      {{ suggestion }}
                      <q-icon v-if="!form.tags.includes(suggestion)" name="add" size="xs" class="q-ml-xs" />
                      <q-icon v-else name="check" size="xs" class="q-ml-xs" />
                    </q-chip>
                  </div>
                  <q-btn 
                    flat 
                    size="sm" 
                    color="grey" 
                    icon="close" 
                    label="Hide suggestions" 
                    @click="showTagsSuggestions = false"
                    class="q-mt-xs"
                  />
                </div>
              </div>
            </div>
            
            <q-separator spaced="xl" />
            
            <!-- Job Description Section -->
            <div>
              <div class="text-subtitle1 q-mb-sm text-weight-medium">Job Description</div>
              <q-editor
                v-model="form.description"
                placeholder="Describe the responsibilities, requirements..."
                :min-height="200"
                :toolbar="[['bold', 'italic', 'underline'], ['unordered', 'ordered']]"
                :rules="descriptionRules"
                @input="debouncedFetchSuggestions"
                @focus="fetchSuggestionsOnce"
                @blur="hideDescriptionSuggestions"
                class="form-editor-large"
              >
                <template v-slot:after>
                  <div
                    class="text-caption text-right q-pa-sm"
                    :class="plainDescription.length < 200 ? 'text-negative' : 'text-positive'"
                  >
                    {{ plainDescription.length }} / 200+ characters
                  </div>
                </template>
              </q-editor>
              
              <!-- Description Suggestions - Now with Paragraphs -->
              <div v-if="showDescriptionSuggestions && descriptionSuggestions.length" class="description-suggestions-container q-mt-sm">
                <div class="text-caption text-grey-6 q-mb-xs">AI-generated description suggestions:</div>
                <q-list bordered class="rounded-borders">
                  <q-item clickable v-ripple @click="showDescriptionSuggestions = false">
                    <q-item-section avatar>
                      <q-icon name="close" />
                    </q-item-section>
                    <q-item-section>
                      <em>Don't use AI suggestions</em>
                    </q-item-section>
                  </q-item>
                  <q-item
                    v-for="(suggestion, index) in descriptionSuggestions"
                    :key="index"
                    clickable
                    v-ripple
                    @click="selectSuggestion('description', suggestion)"
                    class="description-suggestion-item"
                  >
                    <q-item-section>
                      <div class="description-suggestion-text" v-html="formatDescriptionSuggestion(suggestion)"></div>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </div>
          </q-card-section>
          <q-card-actions align="right" class="q-pa-xl">
            <q-btn glossy label="next" color="primary" type="submit" padding="md xl" />
          </q-card-actions>
        </q-form>
      </q-card>

      <!-- Step 2: Candidate Requirements -->
      <q-card v-if="step === 2" class="step-card full-width-card">
        <q-card-section class="q-pt-lg">
          <div class="text-h6">Candidate Requirements</div>
          <p>Specify the desired qualifications. These fields are optional but recommended.</p>
        </q-card-section>
        <q-card-section class="q-gutter-y-xl q-pa-xl">
          <q-input 
            v-model.number="form.experience" 
            type="number" 
            label="Minimum Experience (years)" 
            filled 
            stack-label
            hint="Empty will be considered as 0"
            :rules="[val => val === null || val === '' || val >= 0 || 'Must be 0 or greater']"
            class="form-field-large"
          />
          
          <!-- Skills Section -->
          <div>
            <div class="text-subtitle1 q-mb-sm text-weight-medium">Key Skills</div>
            <div class="q-mb-sm">
              <q-chip
                v-for="(skill, index) in form.skills"
                :key="index"
                removable
                @remove="form.skills.splice(index, 1)"
                class="q-mr-xs q-mb-xs"
                color="secondary"
                text-color="white"
              >
                {{ skill }}
              </q-chip>
            </div>
            <q-input
              v-model="skillInput"
              label="Add Skills"
              filled
              stack-label
              hint="Type a skill and press Enter or comma to add"
              @keyup="onSkillKeyup"
              @blur="addSkill"
              @focus="showCachedSuggestions('skills')"
              class="form-field-large"
            />
            
            <!-- Available Skills from Cache -->
            <div v-if="showSkillsSuggestions && skillsSuggestions.length" class="q-mt-sm">
              <div class="text-caption text-grey-6 q-mb-xs">Suggested skills (click to add):</div>
              <div class="suggestion-chips">
                <q-chip
                  v-for="(suggestion, index) in skillsSuggestions"
                  :key="index"
                  clickable
                  @click="addSuggestionToSkills(suggestion)"
                  class="q-mr-xs q-mb-xs suggestion-chip"
                  outline
                  color="secondary"
                  :disable="form.skills.includes(suggestion)"
                >
                  {{ suggestion }}
                  <q-icon v-if="!form.skills.includes(suggestion)" name="add" size="xs" class="q-ml-xs" />
                  <q-icon v-else name="check" size="xs" class="q-ml-xs" />
                </q-chip>
              </div>
              <q-btn 
                flat 
                size="sm" 
                color="grey" 
                icon="close" 
                label="Hide suggestions" 
                @click="showSkillsSuggestions = false"
                class="q-mt-xs"
              />
            </div>
          </div>

          <q-select 
            v-model="form.education" 
            label="Education Level" 
            :options="educationOptions" 
            filled 
            stack-label
            emit-value 
            map-options 
            hint="Select highest education level" 
            class="form-field-large"
          />
        </q-card-section>
        <q-card-actions align="right" class="q-pa-xl">
          <q-btn flat label="Back" color="black" @click="step--" padding="md xl" />
          <q-btn glossy color="primary" label="next" @click="nextStep" padding="md xl" />
        </q-card-actions>
      </q-card>

      <!-- Step 3: Application Preferences -->
      <q-card v-if="step === 3" class="step-card full-width-card">
        <q-card-section class="q-pt-lg">
          <div class="text-h6">Application Preferences</div>
          <p>Set how you want to receive and manage applications.</p>
        </q-card-section>
        <q-form @submit.prevent="nextStep">
          <q-card-section class="q-gutter-y-xl q-pa-xl">
            <div>
              <div class="text-subtitle1 q-mb-md text-weight-medium">Preferred Communication Methods</div>
              <q-option-group 
                v-model="form.communication"
                :options="communicationOptions"
                type="checkbox"
                inline 
                class="communication-options"
              />
            </div>
            <q-input 
              v-model="form.deadline" 
              label="Application Deadline" 
              type="date" 
              filled 
              stack-label
              :min="today" 
              required 
              class="form-field-large"
            />
            <div class="q-mt-lg">
              <q-toggle 
                v-model="form.resumeRequired" 
                label="Resume submission is required" 
                left-label 
                color="primary"
                size="lg"
              />
            </div>
          </q-card-section>
          <q-card-actions align="right" class="q-pa-xl">
            <q-btn flat label="Back" color="black" @click="step--" padding="md xl" />
            <q-btn glossy color="primary" label="next" type="submit" padding="md xl" />
          </q-card-actions>
        </q-form>
      </q-card>

      <!-- Step 4: Review & Submit -->
      <q-card v-if="step === 4" class="step-card full-width-card">
        <q-card-section class="q-pt-lg">
          <div class="text-h6">Review & Submit</div>
          <p>Please review all the information carefully before submitting.</p>
        </q-card-section>
        <q-card-section class="q-gutter-y-lg q-pa-xl">
          <div class="text-h6 text-primary q-mb-sm">Job Details</div>
          <q-list bordered separator class="rounded-borders">
            <q-item>
              <q-item-section>
                <q-item-label overline>Job Title</q-item-label>
                <q-item-label>{{ form.title || 'N/A'}}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label overline>Location</q-item-label>
                <q-item-label>{{ form.location || 'N/A' }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label overline>Job Type</q-item-label>
                <q-item-label class="text-capitalize">{{ formattedJobType }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label overline>Positions Available</q-item-label>
                <q-item-label>{{ form.positions || 'N/A' }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label overline>Salary Range</q-item-label>
                <q-item-label>{{ form.salary || 'N/A' }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label overline>Recruitment Timeline</q-item-label>
                <q-item-label>{{ form.timeline || 'N/A' }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item v-if="form.benefits">
              <q-item-section>
                <q-item-label overline>Benefits</q-item-label>
                <q-item-label>{{ form.benefits }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item v-if="form.tags && form.tags.length">
              <q-item-section>
                <q-item-label overline>Job Tags</q-item-label>
                <q-item-label>
                  <q-chip 
                    v-for="tag in form.tags" 
                    :key="tag" 
                    :label="tag" 
                    color="primary" 
                    text-color="white"
                    size="sm" 
                    class="q-mr-xs" 
                  />
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label overline>Description</q-item-label>
                <q-item-label caption class="q-pt-xs description-preview">{{ plainDescription || 'N/A' }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>

          <div class="text-h6 text-primary q-mb-sm">Candidate Requirements</div>
          <q-list bordered separator class="rounded-borders">
            <q-item>
              <q-item-section>
                <q-item-label overline>Experience</q-item-label>
                <q-item-label>{{ formatExperience(form.experience) }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label overline>Key Skills</q-item-label>
                <q-item-label>{{ form.skills.length ? form.skills.join(', ') : 'Not specified' }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label overline>Education Level</q-item-label>
                <q-item-label>{{ educationLabel }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>

          <div class="text-h6 text-primary q-mb-sm">Application Preferences</div>
          <q-list bordered separator class="rounded-borders">
            <q-item>
              <q-item-section>
                <q-item-label overline>Communication Methods</q-item-label>
                <q-item-label class="text-capitalize">{{ formattedCommunication }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label overline>Application Deadline</q-item-label>
                <q-item-label>{{ formatDate(form.deadline) }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label overline>Resume Required</q-item-label>
                <q-item-label>{{ form.resumeRequired ? 'Yes' : 'No' }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>

          <div v-if="submitted" class="text-positive q-mt-md text-center text-subtitle1">
            <q-icon name="check_circle" /> Status: <strong>Pending Admin Approval</strong>
          </div>
        </q-card-section>
        <q-card-actions align="right" class="q-pa-xl">
          <q-btn flat label="Back" color="black" @click="step--" :disable="submitted" padding="md xl" />
          <q-btn 
            glossy 
            label="submit job" 
            color="primary" 
            @click="submitJob" 
            :loading="submitted" 
            padding="md xl"
            icon-right="send" 
          />
        </q-card-actions>
      </q-card>
    </div>
  </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useQuasar, date } from 'quasar';
import { useRouter } from 'vue-router';
import jobService from '../services/jobpost.service';
import { getSuggestions } from '../services/gemini.service';
import api from '../services/auth.service.js';
import AppHeader from 'src/components/HeaderPart.vue';
import EmployerSidebar from 'src/components/EmployerSidebar.vue';
// Initialize stores and utilities
const router = useRouter();
const $q = useQuasar();

// Refs for form state
const step = ref(1);
const submitted = ref(false);
const tagInput = ref('');
const skillInput = ref('');
const loading = ref(false);
const initialLoading = ref(false);
const descriptionSuggestions = ref([]);
const tagsSuggestions = ref([]);
const skillsSuggestions = ref([]);
const showDescriptionSuggestions = ref(false);
const showTagsSuggestions = ref(false);
const showSkillsSuggestions = ref(false);
const suggestionsPreloaded = ref(false);

// UI state
const selected = ref('Post New Job');
const verificationStatus = ref('');
const rejectionReason = ref('');
const today = date.formatDate(new Date(), 'YYYY-MM-DD');

// Job type options
const jobTypeOptions = [
  { label: 'Full Time', value: 'full_time' },
  { label: 'Part Time', value: 'part_time' },
  { label: 'Contract', value: 'contract' },
  { label: 'Internship', value: 'internship' },
  { label: 'Remote', value: 'remote' }
];

// Communication options
const communicationOptions = [
  { label: 'Email', value: 'email' },
  { label: 'Website', value: 'website' }
];

// Education options for the form
const educationOptions = [
  { label: '10th (SSC)', value: '10th' },
  { label: '12th (HSC)', value: '12th' },
  { label: 'Diploma', value: 'diploma' },
  { label: "Graduation (Bachelor's)", value: 'Bachelor' },
  { label: "Post Graduation (Master's)", value: 'Master' },
  { label: 'PhD / Doctorate', value: 'PHD' }
];

const stepSections = [
  'Job Details', 'Candidate Requirements', 'Application Preferences', 'Review & Submit'
];

const cachedSuggestions = ref({
  skills: [],
  tags: [],
  description: []
});

// Form reactive data
const form = ref({
  title: '',
  location: '',
  type: null,
  positions: 1,
  timeline: '',
  salary: '',
  benefits: '',
  description: '',
  experience: null,
  skills: [],
  education: '',
  communication: ['email'],
  resumeRequired: true,
  deadline: '',
  tags: []
});

// Computed properties
const plainDescription = computed(() => {
  return (form.value.description || '').replace(/<[^>]*>/g, '').trim();
});

const educationLabel = computed(() => {
  if (!form.value.education) return 'Not specified';
  const option = educationOptions.find(opt => opt.value === form.value.education);
  return option ? option.label : form.value.education;
});

const formattedJobType = computed(() => {
  if (!form.value.type) return 'N/A';
  const option = jobTypeOptions.find(opt => opt.value === form.value.type);
  return option ? option.label : form.value.type.replace('_', ' ');
});

const formattedCommunication = computed(() => {
  if (!form.value.communication || !form.value.communication.length) return 'N/A';
  return form.value.communication.map(comm => {
    const option = communicationOptions.find(opt => opt.value === comm);
    return option ? option.label : comm;
  }).join(', ');
});

// Form validation rules
const descriptionRules = [
  val => (val && plainDescription.value.length >= 200) || 'Minimum 200 characters required.'
];

// Format functions for display
const formatExperience = (exp) => {
  if (exp === null || exp === '') return 'Not specified';
  return exp === 0 ? 'Fresher (0 years)' : `${exp} year${exp > 1 ? 's' : ''}`;
};

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  return date.formatDate(dateStr, 'DD MMM YYYY');
};

// Format description suggestions as paragraphs
const formatDescriptionSuggestion = (suggestion) => {
  if (!suggestion) return '';
console.log('Original suggestion:', suggestion);
  // 1. Split by double newlines (natural paragraphs)
  let paragraphs = suggestion.split(/\n{2,}/).map(p => p.trim()).filter(Boolean);

  // 2. If only one paragraph, split by period followed by space + capital letter
  if (paragraphs.length === 1) {
    paragraphs = suggestion.split(/(?<=\.)\s+(?=[A-Z])/).map(p => p.trim()).filter(Boolean);
  }

  // 3. Wrap paragraphs in <p> tags
  return paragraphs.map(p => `<p>${p}</p>`).join('');
};

// Debounced function for fetching suggestions
let debounceTimer = null;
const debouncedFetchSuggestions = () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    fetchSuggestions();
  }, 500);
};

// Preload suggestions when job title is entered
const preloadSuggestions = async (jobTitle) => {
  if (!jobTitle || jobTitle.trim().length < 3) return;
  
  try {
    initialLoading.value = true;
    const [skills, tags, descriptions] = await Promise.all([
      getSuggestions(jobTitle, 'Key Skills'),
      getSuggestions(jobTitle, 'Job Tags'),
      getSuggestions(jobTitle, 'Job Description')
    ]);

    // Store in cache
    cachedSuggestions.value.skills = skills
      .filter(skill => skill && skill.trim())
      .map(skill => skill.trim().replace(/^"|"$/g, ''))
      .slice(0, 20);
    
    cachedSuggestions.value.tags = tags
      .filter(tag => tag && tag.trim())
      .map(tag => tag.trim().replace(/^"|"$/g, ''))
      .slice(0, 20);
    
    cachedSuggestions.value.description = descriptions.slice(0, 10);

    // Update UI suggestions
    skillsSuggestions.value = cachedSuggestions.value.skills;
    tagsSuggestions.value = cachedSuggestions.value.tags;
    descriptionSuggestions.value = cachedSuggestions.value.description;
    
    suggestionsPreloaded.value = true;
    
    console.log('Preloaded suggestions:', {
      skills: skillsSuggestions.value.length,
      tags: tagsSuggestions.value.length,
      descriptions: descriptionSuggestions.value.length
    });
    
  } catch (err) {
    console.error('Error preloading suggestions:', err);
  } finally {
    initialLoading.value = false;
  }
};

// Show cached suggestions
const showCachedSuggestions = (type) => {
  if (type === 'skills' && skillsSuggestions.value.length) {
    showSkillsSuggestions.value = true;
  } else if (type === 'tags' && tagsSuggestions.value.length) {
    showTagsSuggestions.value = true;
  }
};

// Functions for hiding suggestions with delay
const hideDescriptionSuggestions = () => {
  setTimeout(() => {
    showDescriptionSuggestions.value = false;
  }, 200);
};

// Watch for job title changes to preload suggestions
watch(() => form.value.title, (newTitle) => {
  if (newTitle && newTitle.trim().length >= 3 && !suggestionsPreloaded.value) {
    preloadSuggestions(newTitle);
  }
});

// Fetch suggestions once when focused
const fetchSuggestionsOnce = async () => {
  if (!form.value.title.trim() || form.value.title.trim().length < 3) return;

  // If already cached for this job title, use cache
  if (cachedSuggestions.value.skills.length && 
      cachedSuggestions.value.tags.length && 
      cachedSuggestions.value.description.length) {
    skillsSuggestions.value = cachedSuggestions.value.skills;
    tagsSuggestions.value = cachedSuggestions.value.tags;
    descriptionSuggestions.value = cachedSuggestions.value.description;
    showDescriptionSuggestions.value = true;
    return;
  }

  await preloadSuggestions(form.value.title);
  showDescriptionSuggestions.value = true;
};

// Fetch suggestions for description, tags, and skills based on job title
const fetchSuggestions = async () => {
  if (!form.value.title.trim() || form.value.title.trim().length < 3) {
    descriptionSuggestions.value = [];
    tagsSuggestions.value = [];
    skillsSuggestions.value = [];
    showDescriptionSuggestions.value = false;
    showTagsSuggestions.value = false;
    showSkillsSuggestions.value = false;
    return;
  }

  // If cached, don't make API call again
  if (cachedSuggestions.value.skills.length) {
    return;
  }

  try {
    loading.value = true;
    const fields = ['Job Description', 'Job Tags', 'Key Skills'];
    const suggestions = await Promise.all(fields.map(field => getSuggestions(form.value.title, field)));
    
    descriptionSuggestions.value = suggestions[0] || [];
    tagsSuggestions.value = suggestions[1] || [];
    skillsSuggestions.value = suggestions[2] || [];

    // Cache the results
    cachedSuggestions.value.description = descriptionSuggestions.value.slice(0, 10);
    cachedSuggestions.value.tags = tagsSuggestions.value.slice(0, 15);
    cachedSuggestions.value.skills = skillsSuggestions.value.slice(0, 15);

    showDescriptionSuggestions.value = descriptionSuggestions.value.length > 0;
    showTagsSuggestions.value = tagsSuggestions.value.length > 0;
    showSkillsSuggestions.value = skillsSuggestions.value.length > 0;
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    $q.notify({
      type: 'negative',
      message: 'Failed to fetch suggestions. Please try again.',
      position: 'top',
      timeout: 3000
    });
  } finally {
    loading.value = false;
  }
};

// Select suggestion and apply to form
const selectSuggestion = (field, suggestion) => {
  if (field === 'description') {
    form.value.description = suggestion;
    showDescriptionSuggestions.value = false;
  }
};

// Add individual suggestion functions
const addSuggestionToTags = (suggestion) => {
  const cleanTag = suggestion.trim().replace(/^"|"$/g, '');
  if (cleanTag && !form.value.tags.includes(cleanTag)) {
    form.value.tags.push(cleanTag);
  }
};

const addSuggestionToSkills = (suggestion) => {
  const cleanSkill = suggestion.trim().replace(/^"|"$/g, '');
  if (cleanSkill && !form.value.skills.includes(cleanSkill)) {
    form.value.skills.push(cleanSkill);
  }
};

const nextStep = () => {
  if (step.value < 4) step.value++;
};

// Tag management functions
const addTag = () => {
  const trimmedTag = tagInput.value.trim().replace(/^"|"$/g, '');
  if (trimmedTag && !form.value.tags.includes(trimmedTag)) {
    form.value.tags.push(trimmedTag);
    tagInput.value = '';
  }
};

const onTagKeyup = (event) => {
  if (event.key === 'Enter' || event.key === ',') {
    event.preventDefault();
    addTag();
  }
};

// Skill management functions
const addSkill = () => {
  const trimmedSkill = skillInput.value.trim().replace(/^"|"$/g, '');
  if (trimmedSkill && !form.value.skills.includes(trimmedSkill)) {
    form.value.skills.push(trimmedSkill);
    skillInput.value = '';
  }
};

const onSkillKeyup = (event) => {
  if (event.key === 'Enter' || event.key === ',') {
    event.preventDefault();
    addSkill();
  }
};

// Fetch company status from server
const fetchCompanyStatus = async () => {
  try {
    loading.value = true;
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await api.get('/company/status', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.data) {
      verificationStatus.value = response.data.status || '';
      rejectionReason.value = response.data.rejectionReason || '';

      // Update local storage with the latest status
      const storedEmployer = localStorage.getItem('employerData');
      if (storedEmployer) {
        const employerData = JSON.parse(storedEmployer);
        employerData.status = verificationStatus.value;
        employerData.rejectionReason = rejectionReason.value;
        localStorage.setItem('employerData', JSON.stringify(employerData));
      }
    }
  } catch (error) {
    console.error('Error fetching company status:', error);
    // Fallback to local storage data if available
    const storedEmployer = localStorage.getItem('employerData');
    if (storedEmployer) {
      const employerData = JSON.parse(storedEmployer);
      verificationStatus.value = employerData.status || '';
      rejectionReason.value = employerData.rejectionReason || '';
    }
  } finally {
    loading.value = false;
  }
};

// Submit job function
const submitJob = async () => {
  if (submitted.value) return;

  submitted.value = true;

  if (verificationStatus.value !== 'approved') {
    $q.dialog({
      title: 'Post Job as Pending',
      message: 'Your company is not yet verified. The job will be saved but will not be visible to candidates until your company is approved. Continue?',
      persistent: true,
      ok: {
        label: 'Yes, Post as Pending',
        color: 'primary',
        flat: true
      },
      cancel: {
        label: 'Cancel',
        color: 'grey',
        flat: true
      }
    }).onOk(async () => {
      await processJobSubmission();
    }).onCancel(() => {
      submitted.value = false;
    });
  } else {
    await processJobSubmission();
  }
};

// Process job submission
const processJobSubmission = async () => {
  try {
    loading.value = true;

    const storedUser = localStorage.getItem('userData');
    if (!storedUser) {
      throw new Error('User not authenticated');
    }

    const userData = JSON.parse(storedUser);

    const jobData = {
      title: form.value.title,
      description: form.value.description,
      location: form.value.location,
      type: form.value.type,
      salary: form.value.salary || '',
      deadline: form.value.deadline || null,
      skills: form.value.skills || [],
      tags: form.value.tags || [],
      benefits: form.value.benefits || '',
      education: form.value.education || '',
      experience: form.value.experience || 0,
      positions: form.value.positions || 1,
      timeline: form.value.timeline || '',
      communication: form.value.communication || ['email'],
      resumeRequired: form.value.resumeRequired,
      company_id: userData.id
    };

    const response = await jobService.postJob(jobData);

    if (response.success) {
      const isPending = response.status === 'pending';

      $q.notify({
        type: isPending ? 'info' : 'positive',
        message: isPending
          ? 'Job saved successfully! It will be reviewed once your company is verified.'
          : 'Job posted successfully and is now live!',
        position: 'top',
        timeout: 5000,
        icon: isPending ? 'pending_actions' : 'check_circle'
      });

      resetForm();
      router.push('/employer-portal');
    } else {
      submitted.value = false;
      $q.notify({
        type: 'negative',
        message: response.error || 'Failed to post job. Please try again.',
        position: 'top',
        timeout: 3000,
        icon: 'error'
      });
    }
  } catch (error) {
    console.error('Error submitting job:', error);
    submitted.value = false;
    $q.notify({
      type: 'negative',
      message: 'An error occurred while posting the job. Please try again.',
      position: 'top',
      timeout: 3000,
      icon: 'error'
    });
  } finally {
    loading.value = false;
  }
};

// Reset form function
const resetForm = () => {
  form.value = {
    title: '',
    location: '',
    type: null,
    positions: 1,
    timeline: '',
    salary: '',
    benefits: '',
    description: '',
    experience: null,
    skills: [],
    education: '',
    communication: ['email'],
    resumeRequired: true,
    deadline: '',
    tags: []
  };
  
  // Reset suggestions
  descriptionSuggestions.value = [];
  tagsSuggestions.value = [];
  skillsSuggestions.value = [];
  showDescriptionSuggestions.value = false;
  showTagsSuggestions.value = false;
  showSkillsSuggestions.value = false;
  
  // Reset cached suggestions
  cachedSuggestions.value = {
    skills: [],
    tags: [],
    description: []
  };
  
  // Reset other state
  step.value = 1;
  submitted.value = false;
  tagInput.value = '';
  skillInput.value = '';
  suggestionsPreloaded.value = false;
};

// Component lifecycle
onMounted(async () => {
  const stored = localStorage.getItem('employerData');
  if (stored) {
    const employerData = JSON.parse(stored);
    verificationStatus.value = employerData.status || '';
    rejectionReason.value = employerData.rejectionReason || '';
  } else {
    // fetch from API if not in localStorage
    await fetchCompanyStatus();
  }
});

</script>

<style scoped>
/* Form size improvements */
.full-width-card {
  max-width: 1200px;
  margin: 0 auto;
}

.form-field-large .q-field__control {
  min-height: 60px;
  padding: 8px 16px;
  font-size: 16px;
}

.form-field-large .q-field__native {
  min-height: 44px;
  padding: 12px 0;
}

.form-editor-large {
  min-height: 250px;
}

.form-editor-large .q-editor__content {
  min-height: 200px;
  font-size: 16px;
  line-height: 1.6;
}

/* Description suggestions styling */
.description-suggestions-container {
  max-width: 100%;
}

.description-suggestion-item {
  padding: 16px;
}

.description-suggestion-text {
  line-height: 1.6;
  font-size: 14px;
  color: #555;
}

.description-suggestion-text p {
  margin: 0 0 12px 0;
}

.description-suggestion-text p:last-child {
  margin-bottom: 0;
}

.description-preview {
  white-space: pre-wrap;
  line-height: 1.6;
  max-height: 120px;
  overflow-y: auto;
}

/* Communication options styling */
.communication-options .q-radio {
  margin-right: 24px;
  margin-bottom: 12px;
}

/* Suggestion chips styling */
.suggestion-chips {
  max-height: 200px;
  overflow-y: auto;
}

.suggestion-chip {
  cursor: pointer;
  transition: all 0.2s ease;
}

.suggestion-chip:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.suggestion-chip:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Enhanced form field styling */
.q-field--filled .q-field__control {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 12px;
}

.q-field--filled .q-field__control:hover {
  background: rgba(255, 255, 255, 0.95);
}

/* Responsive improvements */
@media (max-width: 600px) {
  .suggestion-chips {
    max-height: 150px;
  }
  
  .q-chip {
    font-size: 0.75rem;
  }
  
  .form-field-large .q-field__control {
    min-height: 56px;
  }
}

.portal-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.sticky-header {
  position: sticky;
  top: 0;
  z-index: 1000;
}

.page-wrapper {
  flex-grow: 1;
  display: flex;
  overflow: hidden;
  height: 100vh;
}

.content-area {
  flex: 1;
  height: 100%;
  overflow-y: auto;
}

.post-job-bg {
  min-height: 100vh;
  background-image: linear-gradient(135deg, #f5f7fa 0%, #eef5ff 100%);
}

.step-indicator-container {
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.step-card {
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.step-section-title {
  color: #1976d2;
}

/* Responsive design improvements */
@media (max-width: 768px) {
  .page-wrapper {
    flex-direction: column;
  }
  
  .full-width-card {
    margin: 0 8px;
  }
}

/* Button styling improvements */
.q-btn--glossy {
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3);
  border-radius: 8px;
}

.q-btn--glossy:hover {
  box-shadow: 0 6px 16px rgba(25, 118, 210, 0.4);
}

/* Banner styling */
.q-banner {
  border-radius: 12px;
}

/* Progress bar styling */
.q-linear-progress {
  border-radius: 4px;
}

/* Chip styling */
.q-chip {
  border-radius: 20px;
}

/* Error states */
.text-negative {
  color: #f44336;
}

.text-positive {
  color: #4caf50;
}
</style>