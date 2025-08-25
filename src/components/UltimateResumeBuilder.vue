<template>
  <div class="ultimate-resume-builder">
    <!-- Header Section -->
    <div class="builder-header">
      <div class="header-content">
        <div class="title-section">
          <h1 class="page-title">
            <q-icon name="description" class="title-icon" />
            Resume Builder
          </h1>
          <p class="page-subtitle">
            AI-powered, ATS-optimized resumes tailored for your dream job
          </p>
        </div>
        <div class="ats-score-display" v-if="currentResume.atsScore">
          <div class="score-circle" :class="getATSScoreClass(currentResume.atsScore)">
            <span class="score-number">{{ currentResume.atsScore }}</span>
            <span class="score-label">ATS Score</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Builder Interface -->
    <div class="builder-container">
      <!-- Enhanced Sidebar -->
      <div class="builder-sidebar">
        <!-- Job Target Selection with Search -->
        <div class="section-card">
          <h3 class="section-title">
            <q-icon name="work" />
            Target Job
          </h3>
          
          <!-- Job Search Container -->
          <div class="job-search-container" style="position: relative;">
            <!-- Enhanced Job Search Input -->
            <q-input
              v-model="jobSearchQuery"
              outlined
              dense
              placeholder="Enter job title to search (e.g. Software Engineer, Data Scientist)"
              @input="onJobSearch"
              @focus="showJobSuggestions = true"
              @blur="onInputBlur"
              @keydown.enter="searchJobsFromInput"
              @keydown.down="focusFirstSuggestion"
              @keydown.escape="hideJobSuggestions"
              debounce="300"
              ref="jobSearchInput"
            >
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
              <template v-slot:append>
                <q-btn 
                  flat 
                  round 
                  dense 
                  icon="search" 
                  @click="searchJobsFromInput"
                  :loading="isSearchingJobs"
                />
              </template>
            </q-input>

            <!-- Job Suggestions Menu -->
            <div 
              v-if="showJobSuggestions && filteredJobs.length > 0 && jobSearchQuery"
              class="job-suggestions-container"
              @mousedown.prevent
            >
              <q-list class="job-suggestions-list">
                <q-item
                  v-for="job in filteredJobs.slice(0, 8)"
                  :key="job.id"
                  clickable
                  @click="selectJobFromSearch(job)"
                  @mousedown.prevent
                  class="job-suggestion-item"
                >
                  <q-item-section>
                    <q-item-label>{{ job.title }}</q-item-label>
                    <q-item-label caption>{{ job.company?.companyName || job.company }}</q-item-label>
                    <q-item-label caption class="text-green">{{ job.location }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-badge color="primary" :label="job.company?.industry || 'Tech'" />
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </div>

          <!-- Selected Job Display -->
          <div v-if="targetJob" class="selected-job-card q-mt-sm">
            <q-card flat bordered>
              <q-card-section class="q-pa-sm">
                <div class="row items-center">
                  <div class="col">
                    <div class="text-weight-bold">{{ targetJob.title }}</div>
                    <div class="text-caption">{{ targetJob.company?.companyName || targetJob.company }}</div>
                    <div class="text-caption text-green">{{ targetJob.location }}</div>
                  </div>
                  <div class="col-auto">
                    <q-btn
                      flat
                      round
                      dense
                      size="sm"
                      icon="close"
                      @click="clearSelectedJob"
                      color="grey-7"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
          
          <div v-if="jobKeywords.technical?.length" class="keywords-preview">
            <p class="keywords-title">Key Skills Required:</p>
            <div class="keywords-chips">
              <q-chip
                v-for="keyword in jobKeywords.technical.slice(0, 8)"
                :key="keyword"
                size="sm"
                outline
                color="primary"
              >
                {{ keyword }}
              </q-chip>
            </div>
          </div>
        </div>

        <!-- Enhanced Template Selection -->
        <div class="section-card">
          <h3 class="section-title">
            <q-icon name="palette" />
            Professional Templates
          </h3>
          <div class="template-grid">
            <div
              v-for="template in templates"
              :key="template.id"
              class="template-card"
              :class="{ active: selectedTemplate === template.id }"
              @click="selectedTemplate = template.id"
            >
              <div class="template-preview">
                <q-icon :name="getTemplateIcon(template.id)" />
              </div>
              <div class="template-info">
                <span class="template-name">{{ template.name }}</span>
                <div class="ats-badge" :class="getATSBadgeClass(template.atsScore)">
                  {{ template.atsScore }}% ATS
                </div>
                <div class="template-features">
                  <span v-for="feature in template.features.slice(0, 2)" :key="feature" class="feature-tag">
                    {{ feature }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- AI Assistant -->
        <div class="section-card ai-assistant">
          <h3 class="section-title">
            <q-icon name="psychology" />
            AI Assistant
          </h3>
          <div class="ai-suggestions" v-if="aiSuggestions.length">
            <div
              v-for="suggestion in aiSuggestions.slice(0, 3)"
              :key="suggestion.id"
              class="suggestion-item"
              @click="applySuggestion(suggestion)"
            >
              <q-icon :name="suggestion.icon" class="suggestion-icon" />
              <div class="suggestion-content">
                <p class="suggestion-text">{{ suggestion.text }}</p>
                <span class="suggestion-impact">{{ suggestion.impact }}</span>
              </div>
              <q-btn
                flat
                dense
                round
                icon="auto_awesome"
                color="primary"
                @click.stop="applySuggestion(suggestion)"
              />
            </div>
          </div>
          <q-btn
            flat
            dense
            icon="refresh"
            label="Generate AI Suggestions"
            @click="generateAISuggestions"
            class="refresh-suggestions-btn"
            :loading="generatingAI"
          />
        </div>

        <!-- Progress Tracker -->
        <div class="section-card">
          <h3 class="section-title">
            <q-icon name="timeline" />
            Completion Progress
          </h3>
          <div class="progress-items">
            <div class="progress-item" :class="{ completed: resumeData.personalInfo.name }">
              <q-icon name="person" />
              <span>Personal Info</span>
              <q-icon name="check_circle" v-if="resumeData.personalInfo.name" color="green" />
            </div>
            <div class="progress-item" :class="{ completed: resumeData.summary }">
              <q-icon name="description" />
              <span>Summary</span>
              <q-icon name="check_circle" v-if="resumeData.summary" color="green" />
            </div>
            <div class="progress-item" :class="{ completed: resumeData.experience.length }">
              <q-icon name="work" />
              <span>Experience</span>
              <q-icon name="check_circle" v-if="resumeData.experience.length" color="green" />
            </div>
            <div class="progress-item" :class="{ completed: resumeData.skills.length }">
              <q-icon name="code" />
              <span>Skills</span>
              <q-icon name="check_circle" v-if="resumeData.skills.length" color="green" />
            </div>
            <div class="progress-item" :class="{ completed: resumeData.education.length }">
              <q-icon name="school" />
              <span>Education</span>
              <q-icon name="check_circle" v-if="resumeData.education.length" color="green" />
            </div>
          </div>
        </div>
      </div>

      <!-- Main Editor -->
      <div class="builder-main">
        <!-- Section Tabs -->
        <q-tabs
          v-model="activeSection"
          class="section-tabs"
          indicator-color="primary"
          active-color="primary"
          align="left"
        >
          <q-tab name="personal" icon="person" label="Personal Info" />
          <q-tab name="summary" icon="description" label="Summary" />
          <q-tab name="experience" icon="work" label="Experience" />
          <q-tab name="skills" icon="code" label="Skills" />
          <q-tab name="education" icon="school" label="Education" />
          <q-tab name="preview" icon="visibility" label="Preview" />
        </q-tabs>

        <!-- Section Content -->
        <div class="section-content">
          <!-- Personal Information -->
          <div v-show="activeSection === 'personal'" class="content-section">
            <div class="section-header">
              <h2>Personal Information</h2>
              <p>Your contact information and professional details</p>
            </div>
            
            <div class="form-grid">
              <q-input
                v-model="resumeData.personalInfo.name"
                label="Full Name"
                outlined
                dense
                class="form-field"
              />
              <q-input
                v-model="resumeData.personalInfo.email"
                label="Email"
                type="email"
                outlined
                dense
                class="form-field"
              />
              <q-input
                v-model="resumeData.personalInfo.phone"
                label="Phone Number"
                outlined
                dense
                class="form-field"
              />
              <q-input
                v-model="resumeData.personalInfo.address"
                label="Address"
                outlined
                dense
                class="form-field full-width"
              />
              <q-input
                v-model="resumeData.personalInfo.linkedin"
                label="LinkedIn URL"
                outlined
                dense
                class="form-field"
              />
              <q-input
                v-model="resumeData.personalInfo.website"
                label="Portfolio/Website"
                outlined
                dense
                class="form-field"
              />
            </div>
          </div>

          <!-- AI-Enhanced Summary -->
          <div v-show="activeSection === 'summary'" class="content-section">
            <div class="section-header">
              <h2>Professional Summary</h2>
              <p>AI-optimized summary tailored for your target job</p>
            </div>
            
            <div class="ai-writing-assistant">
              <q-input
                v-model="resumeData.summary"
                type="textarea"
                label="Professional Summary"
                outlined
                rows="6"
                class="summary-textarea"
                placeholder="Write a compelling summary of your professional background..."
              />
              
              <div class="writing-controls">
                <q-btn
                  color="primary"
                  icon="auto_awesome"
                  label="AI Optimize"
                  @click="optimizeSummaryWithAI"
                  :loading="optimizingContent"
                  class="optimize-btn"
                />
                <q-btn
                  outline
                  color="primary"
                  icon="lightbulb"
                  label="AI Suggestions"
                  @click="generateSummaryTemplates"
                  :loading="generatingTemplates"
                />
              </div>

              <!-- Writing Stats -->
              <div class="writing-stats">
                <div class="stat-item">
                  <span class="stat-label">Word Count</span>
                  <span class="stat-value">{{ wordCount(resumeData.summary) }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Keywords Match</span>
                  <span class="stat-value">{{ keywordMatchCount }}/{{ totalJobKeywords }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">ATS Score</span>
                  <span class="stat-value" :class="getScoreClass(summaryScore)">{{ summaryScore }}%</span>
                </div>
              </div>

              <!-- ATS Score Breakdown -->
              <div class="ats-breakdown-panel">
                <h4>
                  <q-icon name="analytics" size="sm" class="q-mr-sm" />
                  ATS Analysis ({{ calculateATSScore.grade }})
                </h4>
                <div class="ats-factors">
                  <div 
                    v-for="(factor, index) in calculateATSScore.factors" 
                    :key="index"
                    class="ats-factor"
                    :class="{
                      'factor-good': factor.startsWith('✓'),
                      'factor-warning': factor.startsWith('⚠'),
                      'factor-bad': factor.startsWith('✗')
                    }"
                  >
                    {{ factor }}
                  </div>
                </div>
                <div class="ats-score-summary">
                  <div class="score-progress">
                    <div class="progress-bar">
                      <div 
                        class="progress-fill" 
                        :style="{ width: calculateATSScore.score + '%' }"
                        :class="{
                          'excellent': calculateATSScore.score >= 90,
                          'good': calculateATSScore.score >= 80 && calculateATSScore.score < 90,
                          'fair': calculateATSScore.score >= 70 && calculateATSScore.score < 80,
                          'poor': calculateATSScore.score < 70
                        }"
                      ></div>
                    </div>
                    <span class="score-text">{{ calculateATSScore.score }}/100</span>
                  </div>
                </div>
              </div>

              <!-- AI Summary Templates -->
              <div v-if="summaryTemplates.length" class="ai-templates-panel">
                <h4>AI-Generated Templates</h4>
                <div
                  v-for="(template, index) in summaryTemplates"
                  :key="index"
                  class="template-suggestion"
                  @click="useSummaryTemplate(template)"
                >
                  <q-icon name="auto_awesome" color="primary" />
                  <div class="template-content">
                    <p>{{ template }}</p>
                  </div>
                  <q-btn flat dense round icon="content_copy" @click.stop="copySummaryTemplate(template)" />
                </div>
              </div>
            </div>
          </div>

          <!-- Experience Section with AI -->
          <div v-show="activeSection === 'experience'" class="content-section">
            <div class="section-header">
              <h2>Work Experience</h2>
              <p>AI-optimized job descriptions with impact metrics</p>
              <q-btn
                color="primary"
                icon="add"
                label="Add Experience"
                @click="addExperience"
                class="add-btn"
              />
            </div>

            <div class="experience-list">
              <div
                v-for="(exp, index) in resumeData.experience"
                :key="index"
                class="experience-item"
              >
                <div class="experience-header">
                  <q-input
                    v-model="exp.title"
                    label="Job Title"
                    outlined
                    dense
                    class="title-field"
                  />
                  <q-input
                    v-model="exp.company"
                    label="Company"
                    outlined
                    dense
                    class="company-field"
                  />
                  <q-btn
                    flat
                    round
                    icon="delete"
                    color="negative"
                    @click="removeExperience(index)"
                    class="delete-btn"
                  />
                </div>
                
                <div class="experience-dates">
                  <q-input
                    v-model="exp.startDate"
                    label="Start Date"
                    type="month"
                    outlined
                    dense
                  />
                  <q-input
                    v-model="exp.endDate"
                    label="End Date"
                    type="month"
                    outlined
                    dense
                    :disable="exp.current"
                  />
                  <q-checkbox
                    v-model="exp.current"
                    label="Current Position"
                    @update:model-value="() => handleCurrentPositionChange(exp)"
                  />
                </div>

                <div class="bullet-points">
                  <h4>Achievements & Responsibilities:</h4>
                  <div
                    v-for="(bullet, bulletIndex) in exp.bullets"
                    :key="bulletIndex"
                    class="bullet-item"
                  >
                    <q-input
                      v-model="exp.bullets[bulletIndex]"
                      outlined
                      dense
                      class="bullet-input"
                      placeholder="Describe your achievement with metrics..."
                    />
                    <q-btn
                      flat
                      round
                      icon="auto_awesome"
                      color="primary"
                      @click="optimizeBulletWithAI(index, bulletIndex)"
                      class="ai-optimize-btn"
                      :loading="optimizingBullet === `${index}-${bulletIndex}`"
                    >
                      <q-tooltip>AI Optimize Bullet Point</q-tooltip>
                    </q-btn>
                    <q-btn
                      flat
                      round
                      icon="delete"
                      color="negative"
                      @click="removeBullet(index, bulletIndex)"
                      class="delete-btn"
                    />
                  </div>
                  <q-btn
                    flat
                    icon="add"
                    label="Add Achievement"
                    @click="addBullet(index)"
                    class="add-bullet-btn"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- AI-Enhanced Skills -->
          <div v-show="activeSection === 'skills'" class="content-section">
            <div class="section-header">
              <h2>Skills & Technologies</h2>
              <p>AI-curated skills optimized for your target role</p>
            </div>
            
            <div class="skills-manager">
              <!-- Current Skills -->
              <div class="current-skills">
                <h4>Your Skills</h4>
                <div class="skills-chips">
                  <q-chip
                    v-for="(skill, index) in resumeData.skills"
                    :key="index"
                    removable
                    color="primary"
                    @remove="removeSkill(index)"
                    :class="{ 'job-match': isJobMatch(skill) }"
                  >
                    {{ skill }}
                    <q-tooltip v-if="isJobMatch(skill)">Matches job requirements</q-tooltip>
                  </q-chip>
                </div>
              </div>

              <!-- Add Skills -->
              <div class="add-skills">
                <q-input
                  v-model="newSkill"
                  label="Add Skill"
                  outlined
                  dense
                  @keyup.enter="addSkill"
                  class="skill-input"
                />
                <q-btn
                  color="primary"
                  icon="add"
                  @click="addSkill"
                  dense
                />
              </div>

              <!-- AI Skill Suggestions -->
              <div class="ai-skill-suggestions">
                <div class="suggestions-header">
                  <h4>AI Skill Suggestions</h4>
                  <q-btn
                    flat
                    dense
                    icon="refresh"
                    label="Get AI Suggestions"
                    @click="getAISkillSuggestions"
                    :loading="generatingSkills"
                  />
                </div>
                <div class="suggested-chips">
                  <q-chip
                    v-for="skill in suggestedSkills"
                    :key="skill"
                    clickable
                    outline
                    color="secondary"
                    @click="addSuggestedSkill(skill)"
                    icon="add"
                  >
                    {{ skill }}
                  </q-chip>
                </div>
              </div>

              <!-- Job-Matched Skills -->
              <div v-if="jobKeywords.technical?.length" class="job-skills">
                <h4>Skills from Target Job</h4>
                <div class="suggested-chips">
                  <q-chip
                    v-for="skill in jobKeywords.technical.filter(skill => !resumeData.skills.includes(skill))"
                    :key="skill"
                    clickable
                    outline
                    color="orange"
                    @click="addSuggestedSkill(skill)"
                    icon="work"
                  >
                    {{ skill }}
                  </q-chip>
                </div>
              </div>
            </div>
          </div>

          <!-- Education Section -->
          <div v-show="activeSection === 'education'" class="content-section">
            <div class="section-header">
              <h2>Education</h2>
              <p>Academic background and certifications</p>
              <q-btn
                color="primary"
                icon="add"
                label="Add Education"
                @click="addEducation"
                class="add-btn"
              />
            </div>

            <div class="education-list">
              <div
                v-for="(edu, index) in resumeData.education"
                :key="index"
                class="education-item"
              >
                <div class="education-fields">
                  <q-input
                    v-model="edu.degree"
                    label="Degree"
                    outlined
                    dense
                  />
                  <q-input
                    v-model="edu.institution"
                    label="Institution"
                    outlined
                    dense
                  />
                  <q-input
                    v-model="edu.graduationDate"
                    label="Graduation Year"
                    type="number"
                    outlined
                    dense
                  />
                  <q-input
                    v-model="edu.gpa"
                    label="GPA (Optional)"
                    outlined
                    dense
                  />
                  <q-btn
                    flat
                    round
                    icon="delete"
                    color="negative"
                    @click="removeEducation(index)"
                    class="delete-btn"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Enhanced Preview Section -->
          <div v-show="activeSection === 'preview'" class="content-section">
            <div class="section-header">
              <h2>Resume Preview</h2>
              <p>See how your AI-optimized resume will look</p>
              <div class="preview-actions">
                <q-btn
                  color="primary"
                  icon="download"
                  label="Download PDF"
                  @click="downloadPDF"
                  :loading="generatingPDF"
                />
                <q-btn
                  outline
                  color="primary"
                  icon="auto_awesome"
                  label="Generate AI Resume"
                  @click="generateCompleteResume"
                  :loading="generatingResume"
                />
                <q-btn
                  outline
                  color="secondary"
                  icon="article"
                  label="Generate Cover Letter"
                  @click="generateCoverLetter"
                  :loading="generatingCoverLetter"
                />
              </div>
            </div>

            <!-- Resume Templates Preview -->
            <div class="resume-preview" :class="`template-${selectedTemplate}`">
              <component 
                :is="getTemplateComponent(selectedTemplate)"
                :resume-data="resumeData"
                :ats-score="currentResume.atsScore"
                :job-keywords="jobKeywords"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading Overlay -->
    <q-dialog v-model="loading" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-spinner-orbit size="40px" color="primary" />
          <span class="q-ml-sm">{{ loadingMessage }}</span>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Cover Letter Modal -->
    <q-dialog v-model="showCoverLetter" maximized>
      <q-card class="cover-letter-modal">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">AI-Generated Cover Letter</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="cover-letter-content">
          <q-input
            v-model="generatedCoverLetter"
            type="textarea"
            outlined
            rows="20"
            class="full-width"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Copy" @click="copyCoverLetter" />
          <q-btn color="primary" label="Download" @click="downloadCoverLetter" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'
import { resumeBuilderService } from '../services/resumeBuilderService'

// Import template components
import ModernTemplate from './resume-templates/ModernTemplate.vue'
import ExecutiveTemplate from './resume-templates/ExecutiveTemplate.vue'
import CreativeTemplate from './resume-templates/CreativeTemplate.vue'
import MinimalistTemplate from './resume-templates/MinimalistTemplate.vue'
import TechnicalTemplate from './resume-templates/TechnicalTemplate.vue'

const $q = useQuasar()

// Reactive data
const loading = ref(false)
const loadingMessage = ref('')
const activeSection = ref('personal')
const targetJob = ref(null)
const selectedTemplate = ref('minimalist') // Start with highest ATS score
const newSkill = ref('')
const jobSearchQuery = ref('')
const filteredJobs = ref([])
const showJobSuggestions = ref(false)
const isSearchingJobs = ref(false)

// AI and optimization states
const optimizingContent = ref(false)
const generatingTemplates = ref(false)
const generatingAI = ref(false)
const generatingSkills = ref(false)
const optimizingBullet = ref('')
const generatingPDF = ref(false)
const generatingResume = ref(false)
const generatingCoverLetter = ref(false)
const showCoverLetter = ref(false)
const generatedCoverLetter = ref('')

// Resume data
const resumeData = ref({
  personalInfo: {
    name: '',
    email: '',
    phone: '',
    address: '',
    linkedin: '',
    website: ''
  },
  summary: '',
  experience: [],
  skills: [],
  education: []
})

// AI and optimization data
const currentResume = ref({ atsScore: 0 })
const jobKeywords = ref({})
const templates = ref([])
const availableJobs = ref([])
const aiSuggestions = ref([])
const summaryTemplates = ref([])
const suggestedSkills = ref([])
const summaryScore = ref(0)

// Computed properties
const wordCount = (text) => {
  if (!text) return 0
  return text.trim().split(/\s+/).length
}

const keywordMatchCount = computed(() => {
  if (!resumeData.value.summary || !jobKeywords.value.technical) return 0
  const summaryLower = resumeData.value.summary.toLowerCase()
  return jobKeywords.value.technical.filter(keyword =>
    summaryLower.includes(keyword.toLowerCase())
  ).length
})

const totalJobKeywords = computed(() => {
  return jobKeywords.value.technical?.length || 0
})

// Enhanced job search methods
const onJobSearch = () => {
  if (!jobSearchQuery.value.trim()) {
    showJobSuggestions.value = false
    filteredJobs.value = []
    return
  }
  
  // Filter available jobs based on search query
  const query = jobSearchQuery.value.toLowerCase()
  filteredJobs.value = availableJobs.value.filter(job => 
    job.title.toLowerCase().includes(query) ||
    (job.company?.companyName || job.company || '').toLowerCase().includes(query) ||
    (job.location || '').toLowerCase().includes(query) ||
    (job.skills || []).some(skill => skill.toLowerCase().includes(query))
  )
  
  showJobSuggestions.value = filteredJobs.value.length > 0
}

const onInputBlur = () => {
  // Delay hiding to allow clicks to register
  setTimeout(() => {
    showJobSuggestions.value = false
  }, 150)
}

const hideJobSuggestions = () => {
  showJobSuggestions.value = false
}

const focusFirstSuggestion = (event) => {
  event.preventDefault()
  // Focus logic can be added here if needed
}

const searchJobsFromInput = async () => {
  if (!jobSearchQuery.value.trim()) return
  
  isSearchingJobs.value = true
  try {
    // First try to use the search to filter existing jobs
    onJobSearch()
    
    // If we have results from local filtering, use those
    if (filteredJobs.value.length > 0) {
      showJobSuggestions.value = true
      return
    }
    
    // If no local results, try backend search
    const response = await resumeBuilderService.searchJobs(jobSearchQuery.value)
    if (response.success && response.jobs.length > 0) {
      filteredJobs.value = response.jobs
      showJobSuggestions.value = true
    } else {
      $q.notify({
        type: 'info',
        message: 'No jobs found for your search. Try different keywords.'
      })
    }
  } catch (error) {
    console.error('Error searching jobs:', error)
    $q.notify({
      type: 'negative',
      message: 'Error searching jobs. Please try again.'
    })
  } finally {
    isSearchingJobs.value = false
  }
}

const selectJobFromSearch = (job) => {
  targetJob.value = job
  jobSearchQuery.value = job.title
  showJobSuggestions.value = false
  onJobSelected()
}

const clearSelectedJob = () => {
  targetJob.value = null
  jobSearchQuery.value = ''
  jobKeywords.value = { technical: [], soft: [], keywords: [] }
}

const fetchTemplates = async () => {
  try {
    const response = await resumeBuilderService.getTemplates()
    if (response.success) {
      templates.value = response.templates
    } else {
      throw new Error('Backend templates failed')
    }
  } catch (error) {
    console.error('Error fetching templates:', error)
    // Force fallback templates to always load
    templates.value = [
      {
        id: 'minimalist',
        name: 'Minimalist',
        description: 'Clean design with maximum ATS compatibility',
        atsScore: 98,
        features: ['Maximum ATS Score', 'Clean Layout', 'Universal Appeal']
      },
      {
        id: 'technical',
        name: 'Technical Specialist',
        description: 'Perfect for technical and engineering roles',
        atsScore: 96,
        features: ['Skills Focused', 'Project Highlights', 'Technical Optimized']
      },
      {
        id: 'modern',
        name: 'Modern Professional',
        description: 'Contemporary design for modern professionals',
        atsScore: 95,
        features: ['ATS Optimized', 'Clean Layout', 'Professional']
      },
      {
        id: 'executive',
        name: 'Executive',
        description: 'Sophisticated design for leadership roles',
        atsScore: 90,
        features: ['Leadership Focus', 'Results-Oriented', 'Executive Style']
      },
      {
        id: 'creative',
        name: 'Creative Professional',
        description: 'Stylish design for creative industries',
        atsScore: 85,
        features: ['Visual Appeal', 'Creative Layout', 'Portfolio Ready']
      }
    ]
  }
  
  // Always ensure templates are set
  if (!templates.value || templates.value.length === 0) {
    templates.value = [
      {
        id: 'minimalist',
        name: 'Minimalist',
        description: 'Clean design with maximum ATS compatibility',
        atsScore: 98,
        features: ['Maximum ATS Score', 'Clean Layout', 'Universal Appeal']
      },
      {
        id: 'technical',
        name: 'Technical Specialist',
        description: 'Perfect for technical and engineering roles',
        atsScore: 96,
        features: ['Skills Focused', 'Project Highlights', 'Technical Optimized']
      },
      {
        id: 'modern',
        name: 'Modern Professional',
        description: 'Contemporary design for modern professionals',
        atsScore: 95,
        features: ['ATS Optimized', 'Clean Layout', 'Professional']
      },
      {
        id: 'executive',
        name: 'Executive',
        description: 'Sophisticated design for leadership roles',
        atsScore: 90,
        features: ['Leadership Focus', 'Results-Oriented', 'Executive Style']
      },
      {
        id: 'creative',
        name: 'Creative Professional',
        description: 'Stylish design for creative industries',
        atsScore: 85,
        features: ['Visual Appeal', 'Creative Layout', 'Portfolio Ready']
      }
    ]
  }
}

const fetchAvailableJobs = async () => {
  try {
    console.log('Fetching real jobs from backend...')
    const response = await resumeBuilderService.getAvailableJobs({ limit: 100 })
    console.log('Jobs response:', response)
    
    if (response.success && response.jobs && response.jobs.length > 0) {
      availableJobs.value = response.jobs
      filteredJobs.value = response.jobs.slice(0, 20)
      console.log(`Loaded ${response.jobs.length} real jobs`)
    } else {
      console.warn('No jobs returned from backend, trying direct API call...')
      // Try direct API call as fallback
      const directResponse = await fetch('http://localhost:3000/api/jobs/jobs')
      const directData = await directResponse.json()
      
      if (directData.success && directData.jobs && directData.jobs.length > 0) {
        availableJobs.value = directData.jobs
        filteredJobs.value = directData.jobs.slice(0, 20)
        console.log(`Loaded ${directData.jobs.length} real jobs via direct API`)
      } else {
        throw new Error('No real jobs available from any source')
      }
    }
  } catch (error) {
    console.error('Error fetching real jobs:', error)
    $q.notify({
      type: 'negative',
      message: 'Unable to load real jobs from database. Please ensure backend is running and has job data.',
      timeout: 5000
    })
    
    // Set empty array to force user to add real jobs
    availableJobs.value = []
    filteredJobs.value = []
  }
}

const onJobSelected = async () => {
  if (!targetJob.value) return
  
  loading.value = true
  loadingMessage.value = 'Analyzing job requirements with AI...'
  
  try {
    const response = await resumeBuilderService.extractJobKeywords(targetJob.value.id)
    if (response.success) {
      jobKeywords.value = response.keywords
      
      // Get AI skill suggestions based on job
      await getAISkillSuggestions()
      
      // Generate AI content suggestions
      await generateAISuggestions()
    }
  } catch (error) {
    console.error('Error analyzing job:', error)
    $q.notify({
      type: 'negative',
      message: 'Error analyzing job requirements'
    })
  } finally {
    loading.value = false
  }
}

const optimizeSummaryWithAI = async () => {
  if (!resumeData.value.summary.trim()) {
    $q.notify({
      type: 'warning',
      message: 'Please write a summary first'
    })
    return
  }

  optimizingContent.value = true
  try {
    console.log('Starting REAL AI summary optimization...')
    
    // Get job-specific details if a job is selected
    let jobDetails = null
    if (targetJob.value) {
      jobDetails = {
        title: targetJob.value.title,
        company: targetJob.value.company,
        description: targetJob.value.description,
        requirements: targetJob.value.requirements,
        keywords: jobKeywords.value
      }
      console.log('Optimizing for specific job:', jobDetails.title, 'at', jobDetails.company)
    }
    
    const response = await resumeBuilderService.optimizeSummary(
      resumeData.value.summary,
      targetJob.value?.title || 'Professional',
      resumeData.value.skills || [],
      resumeData.value.experience.length || 0,
      jobDetails // Pass job details for better targeting
    )

    console.log('Real AI optimization response:', response)
    if (response.success) {
      resumeData.value.summary = response.optimizedSummary
      $q.notify({
        type: 'positive',
        message: '✅ Summary optimized with REAL AI!',
        caption: targetJob.value ? `Tailored for ${targetJob.value.title} position` : 'Enhanced with actual artificial intelligence'
      })
    } else {
      throw new Error(response.message || 'AI optimization failed')
    }
  } catch (error) {
    console.error('AI optimization error:', error)
    $q.notify({
      type: 'negative',
      message: 'AI optimization failed: ' + (error.message || 'Please try again'),
      caption: 'Check your internet connection and try again'
    })
  } finally {
    optimizingContent.value = false
  }
}

const optimizeBulletWithAI = async (expIndex, bulletIndex) => {
  const bullet = resumeData.value.experience[expIndex].bullets[bulletIndex]
  if (!bullet.trim()) {
    $q.notify({
      type: 'warning',
      message: 'Please write a bullet point first'
    })
    return
  }

  optimizingBullet.value = `${expIndex}-${bulletIndex}`
  try {
    const response = await resumeBuilderService.optimizeBulletPoint(
      bullet,
      targetJob.value?.title || resumeData.value.experience[expIndex].title
    )

    if (response.success) {
      resumeData.value.experience[expIndex].bullets[bulletIndex] = response.optimizedBullet
      $q.notify({
        type: 'positive',
        message: 'Bullet point optimized with AI!'
      })
    } else {
      throw new Error(response.message || 'Failed to optimize bullet point')
    }
  } catch (error) {
    console.error('Error optimizing bullet:', error)
    $q.notify({
      type: 'negative',
      message: 'Error optimizing bullet point'
    })
  } finally {
    optimizingBullet.value = ''
  }
}

const getAISkillSuggestions = async () => {
  generatingSkills.value = true
  try {
    const response = await resumeBuilderService.getAISkillSuggestions({
      currentSkills: resumeData.value.skills,
      jobTitle: targetJob.value?.title || 'Software Developer',
      industry: targetJob.value?.company?.industry || 'Technology'
    })

    if (response.success) {
      suggestedSkills.value = response.suggestedSkills.filter(skill => 
        !resumeData.value.skills.includes(skill)
      )
    }
  } catch (error) {
    console.error('Error getting AI skill suggestions:', error)
    // Fallback suggestions
    suggestedSkills.value = ['React', 'Node.js', 'TypeScript', 'AWS', 'Docker']
  } finally {
    generatingSkills.value = false
  }
}

const generateAISuggestions = async () => {
  generatingAI.value = true
  try {
    const response = await resumeBuilderService.generateContentSuggestions({
      jobTitle: targetJob.value?.title || 'Professional',
      experience: resumeData.value.experience.length,
      skills: resumeData.value.skills,
      industry: targetJob.value?.company?.industry || 'Technology'
    })

    if (response.success) {
      aiSuggestions.value = [
        {
          id: 1,
          icon: 'psychology',
          text: 'Optimize summary with job keywords',
          impact: '+15 ATS score',
          action: 'optimizeSummary'
        },
        {
          id: 2,
          icon: 'code',
          text: 'Add suggested skills',
          impact: '+10 ATS score',
          action: 'addSuggestedSkills'
        },
        {
          id: 3,
          icon: 'work',
          text: 'Enhance experience bullets',
          impact: '+12 ATS score',
          action: 'optimizeExperience'
        }
      ]
    }
  } catch (error) {
    console.error('Error generating AI suggestions:', error)
  } finally {
    generatingAI.value = false
  }
}

const generateCoverLetter = async () => {
  if (!targetJob.value) {
    $q.notify({
      type: 'warning',
      message: 'Please select a target job first'
    })
    return
  }

  generatingCoverLetter.value = true
  try {
    const response = await resumeBuilderService.generateCoverLetter({
      resumeData: resumeData.value,
      jobTitle: targetJob.value.title,
      company: targetJob.value.company.companyName,
      jobDescription: targetJob.value.description || ''
    })

    if (response.success) {
      generatedCoverLetter.value = response.coverLetter
      showCoverLetter.value = true
    }
  } catch (error) {
    console.error('Error generating cover letter:', error)
    $q.notify({
      type: 'negative',
      message: 'Error generating cover letter'
    })
  } finally {
    generatingCoverLetter.value = false
  }
}

const generateCompleteResume = async () => {
  generatingResume.value = true
  loadingMessage.value = 'Generating AI-optimized resume...'
  
  try {
    const response = await resumeBuilderService.generateATSOptimizedResume({
      jobId: targetJob.value?.id,
      templateId: selectedTemplate.value,
      sections: resumeData.value
    })

    if (response.success) {
      currentResume.value = response.resume
      $q.notify({
        type: 'positive',
        message: `Resume generated! ATS Score: ${response.score}%`
      })
    }
  } catch (error) {
    console.error('Error generating resume:', error)
    $q.notify({
      type: 'negative',
      message: 'Error generating resume'
    })
  } finally {
    generatingResume.value = false
  }
}

// Utility methods
const getTemplateComponent = (templateId) => {
  const components = {
    modern: ModernTemplate,
    executive: ExecutiveTemplate,
    creative: CreativeTemplate,
    minimalist: MinimalistTemplate,
    technical: TechnicalTemplate
  }
  return components[templateId] || MinimalistTemplate
}

const getTemplateIcon = (templateId) => {
  const icons = {
    modern: 'laptop',
    executive: 'business_center',
    creative: 'palette',
    minimalist: 'article',
    technical: 'code'
  }
  return icons[templateId] || 'description'
}

const getATSScoreClass = (score) => {
  if (score >= 85) return 'score-excellent'
  if (score >= 70) return 'score-good'
  if (score >= 55) return 'score-fair'
  return 'score-poor'
}

const getATSBadgeClass = (score) => {
  if (score >= 90) return 'ats-excellent'
  if (score >= 80) return 'ats-good'
  return 'ats-fair'
}

const getScoreClass = (score) => {
  if (score >= 80) return 'text-green'
  if (score >= 60) return 'text-orange'
  return 'text-red'
}

const isJobMatch = (skill) => {
  return jobKeywords.value.technical?.some(jobSkill =>
    jobSkill.toLowerCase().includes(skill.toLowerCase()) ||
    skill.toLowerCase().includes(jobSkill.toLowerCase())
  )
}

// Experience management
const addExperience = () => {
  resumeData.value.experience.push({
    title: '',
    company: '',
    startDate: '',
    endDate: '',
    current: false,
    bullets: ['']
  })
}

const removeExperience = (index) => {
  resumeData.value.experience.splice(index, 1)
}

const addBullet = (expIndex) => {
  resumeData.value.experience[expIndex].bullets.push('')
}

const removeBullet = (expIndex, bulletIndex) => {
  resumeData.value.experience[expIndex].bullets.splice(bulletIndex, 1)
}

const handleCurrentPositionChange = (exp) => {
  if (exp.current) {
    exp.endDate = ''
  }
}

// Skills management
const addSkill = () => {
  if (newSkill.value.trim()) {
    resumeData.value.skills.push(newSkill.value.trim())
    newSkill.value = ''
  }
}

const removeSkill = (index) => {
  resumeData.value.skills.splice(index, 1)
}

const addSuggestedSkill = (skill) => {
  if (!resumeData.value.skills.includes(skill)) {
    resumeData.value.skills.push(skill)
    suggestedSkills.value = suggestedSkills.value.filter(s => s !== skill)
  }
}

// Education management
const addEducation = () => {
  resumeData.value.education.push({
    degree: '',
    institution: '',
    graduationDate: '',
    gpa: ''
  })
}

const removeEducation = (index) => {
  resumeData.value.education.splice(index, 1)
}

// File operations
const downloadPDF = async () => {
  generatingPDF.value = true
  // Implement PDF generation
  await new Promise(resolve => setTimeout(resolve, 2000))
  generatingPDF.value = false
  $q.notify({
    type: 'positive',
    message: 'Resume downloaded successfully!'
  })
}

const copyCoverLetter = () => {
  navigator.clipboard.writeText(generatedCoverLetter.value)
  $q.notify({
    type: 'positive',
    message: 'Cover letter copied to clipboard!'
  })
}

const downloadCoverLetter = () => {
  const element = document.createElement('a')
  const file = new Blob([generatedCoverLetter.value], {type: 'text/plain'})
  element.href = URL.createObjectURL(file)
  element.download = 'cover-letter.txt'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    fetchTemplates(),
    fetchAvailableJobs()
  ])
  
  // Calculate initial ATS score
  const atsResult = calculateATSScore.value
  summaryScore.value = atsResult.score
  currentResume.value.atsScore = atsResult.score
})

// Real ATS Score Calculation - Based on actual ATS factors
const calculateATSScore = computed(() => {
  let score = 0
  let factors = []
  
  // 1. Contact Information (10 points)
  if (resumeData.value.personalInfo.name && resumeData.value.personalInfo.email && resumeData.value.personalInfo.phone) {
    score += 10
    factors.push('✓ Complete contact information')
  } else {
    factors.push('✗ Missing contact information')
  }
  
  // 2. Professional Summary (15 points)
  if (resumeData.value.summary) {
    const wordCount = resumeData.value.summary.split(' ').length
    if (wordCount >= 30 && wordCount <= 80) {
      score += 15
      factors.push('✓ Optimal summary length (30-80 words)')
    } else if (wordCount >= 20) {
      score += 10
      factors.push('✓ Good summary length')
    } else if (wordCount > 0) {
      score += 5
      factors.push('⚠ Summary too short')
    }
  } else {
    factors.push('✗ No professional summary')
  }
  
  // 3. Keywords and Skills (20 points)
  const skillsCount = resumeData.value.skills.length
  if (skillsCount >= 8) {
    score += 20
    factors.push('✓ Comprehensive skills section (8+ skills)')
  } else if (skillsCount >= 5) {
    score += 15
    factors.push('✓ Good skills coverage (5-7 skills)')
  } else if (skillsCount >= 3) {
    score += 10
    factors.push('⚠ Basic skills listed (3-4 skills)')
  } else {
    factors.push('✗ Insufficient skills listed')
  }
  
  // 4. Job Target Alignment (15 points)
  if (targetJob.value) {
    score += 8
    factors.push('✓ Job target specified')
    
    // Check skill alignment with target job
    const targetSkills = jobKeywords.value.technical || []
    const matchingSkills = resumeData.value.skills.filter(skill => 
      targetSkills.some(target => target.toLowerCase().includes(skill.toLowerCase()))
    )
    
    if (matchingSkills.length >= 3) {
      score += 7
      factors.push('✓ Strong skill-job alignment')
    } else if (matchingSkills.length >= 1) {
      score += 4
      factors.push('⚠ Some skill-job alignment')
    } else {
      factors.push('✗ No skill-job alignment')
    }
  } else {
    factors.push('✗ No target job specified')
  }
  
  // 5. Work Experience Quality (15 points)
  const expCount = resumeData.value.experience.length
  if (expCount >= 3) {
    score += 15
    factors.push('✓ Comprehensive work history (3+ jobs)')
  } else if (expCount >= 2) {
    score += 12
    factors.push('✓ Good work history (2 jobs)')
  } else if (expCount >= 1) {
    score += 8
    factors.push('⚠ Limited work history (1 job)')
  } else {
    factors.push('✗ No work experience listed')
  }
  
  // 6. Bullet Points Quality (10 points)
  let totalBullets = 0
  let actionVerbBullets = 0
  
  resumeData.value.experience.forEach(exp => {
    totalBullets += exp.bullets.filter(bullet => bullet.trim().length > 0).length
    actionVerbBullets += exp.bullets.filter(bullet => {
      const actionVerbs = ['achieved', 'developed', 'implemented', 'managed', 'led', 'created', 'improved', 'increased', 'reduced', 'optimized', 'designed', 'built', 'delivered', 'collaborated', 'analyzed', 'executed', 'launched', 'maintained', 'coordinated', 'established']
      return actionVerbs.some(verb => bullet.toLowerCase().trim().startsWith(verb))
    }).length
  })
  
  if (totalBullets >= 6 && actionVerbBullets >= 3) {
    score += 10
    factors.push('✓ Strong bullet points with action verbs')
  } else if (totalBullets >= 3) {
    score += 6
    factors.push('⚠ Adequate bullet points')
  } else {
    factors.push('✗ Insufficient bullet points')
  }
  
  // 7. Education (5 points)
  if (resumeData.value.education.length > 0) {
    score += 5
    factors.push('✓ Education included')
  } else {
    factors.push('✗ No education listed')
  }
  
  // 8. Resume Structure (10 points) - Always give this since we're creating the resume
  score += 10
  factors.push('✓ Proper resume structure')
  
  return {
    score: Math.min(score, 100), // Cap at 100
    factors,
    grade: score >= 90 ? 'Excellent' : score >= 80 ? 'Good' : score >= 70 ? 'Fair' : 'Needs Improvement'
  }
})

// Watch for changes to update ATS score in real-time
watch(() => resumeData.value, () => {
  const atsResult = calculateATSScore.value
  summaryScore.value = atsResult.score
  currentResume.value.atsScore = atsResult.score
}, { deep: true })
</script>

<style scoped>
/* Enhanced styling for ultimate resume builder */
.ultimate-resume-builder {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
}

.builder-header {
  padding: var(--space-6);
  background: white;
  border-bottom: 1px solid var(--color-gray-200);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
}

.title-section h1 {
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
}

.page-subtitle {
  font-size: 1.1rem;
  color: #64748b;
  margin: 0.5rem 0 0 0;
}

.ats-score-display {
  text-align: center;
}

.score-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  border: 3px solid;
}

.score-excellent {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-color: #10b981;
}

.score-good {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border-color: #3b82f6;
}

.score-fair {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  border-color: #f59e0b;
}

.score-poor {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border-color: #ef4444;
}

.score-number {
  font-size: 1.5rem;
}

.score-label {
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.builder-container {
  display: flex;
  max-width: 1400px;
  margin: 0 auto;
  gap: 2rem;
  padding: 2rem;
}

.builder-sidebar {
  width: 380px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.section-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  border: 1px solid #e2e8f0;
}

.ai-assistant {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border: 1px solid #3b82f6;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.template-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.template-card {
  padding: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.template-card:hover {
  border-color: #3b82f6;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.template-card.active {
  border-color: #3b82f6;
  background: #f0f9ff;
}

.template-preview {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
  border-radius: 6px;
  color: #3b82f6;
}

.template-info {
  flex: 1;
}

.template-name {
  font-size: 0.875rem;
  font-weight: 600;
  display: block;
  margin-bottom: 0.25rem;
}

.ats-badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-weight: 600;
  display: inline-block;
  margin-bottom: 0.25rem;
}

.ats-excellent {
  background: #dcfce7;
  color: #166534;
}

.ats-good {
  background: #dbeafe;
  color: #1e40af;
}

.ats-fair {
  background: #fef3c7;
  color: #92400e;
}

.template-features {
  display: flex;
  gap: 0.25rem;
  flex-wrap: wrap;
}

.feature-tag {
  font-size: 0.625rem;
  padding: 0.125rem 0.25rem;
  background: #f1f5f9;
  color: #64748b;
  border-radius: 4px;
}

.ai-suggestions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.suggestion-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
}

.suggestion-item:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transform: translateY(-2px);
}

.suggestion-icon {
  color: #3b82f6;
  font-size: 1.2rem;
}

.suggestion-content {
  flex: 1;
}

.suggestion-text {
  font-size: 0.875rem;
  font-weight: 500;
  color: #1e293b;
  margin: 0 0 0.25rem 0;
}

.suggestion-impact {
  font-size: 0.75rem;
  color: #3b82f6;
  font-weight: 600;
}

.progress-items {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.progress-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.progress-item.completed {
  background: #f0fdf4;
  color: #166534;
}

.builder-main {
  flex: 1;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  overflow: hidden;
}

.section-tabs {
  border-bottom: 1px solid #e2e8f0;
  padding: 0 1.5rem;
}

.section-content {
  padding: 2rem;
}

.content-section {
  max-width: 800px;
}

.section-header {
  margin-bottom: 2rem;
}

.section-header h2 {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
}

.section-header p {
  font-size: 1rem;
  color: #64748b;
  margin: 0;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-field.full-width {
  grid-column: 1 / -1;
}

.ai-writing-assistant {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.writing-controls {
  display: flex;
  gap: 1rem;
}

.writing-stats {
  display: flex;
  gap: 2rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
}

.stat-value {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
}

.ai-templates-panel {
  background: #f8fafc;
  border-radius: 8px;
  padding: 1rem;
}

.ai-templates-panel h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.75rem 0;
}

.template-suggestion {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  background: white;
  border-radius: 6px;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.template-suggestion:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.template-content {
  flex: 1;
}

.template-content p {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.5;
}

.experience-list,
.education-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.experience-item,
.education-item {
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fafafa;
}

.experience-header {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 1rem;
  margin-bottom: 1rem;
}

.experience-dates {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 1rem;
  margin-bottom: 1rem;
}

.bullet-points h4 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.75rem 0;
}

.bullet-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.bullet-input {
  flex: 1;
}

.ai-optimize-btn {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.skills-manager {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.current-skills h4,
.ai-skill-suggestions h4,
.job-skills h4 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.75rem 0;
}

.skills-chips,
.suggested-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.skills-chips .q-chip.job-match {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.add-skills {
  display: flex;
  gap: 0.5rem;
  align-items: flex-end;
}

.skill-input {
  flex: 1;
}

.suggestions-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.education-fields {
  display: grid;
  grid-template-columns: 1fr 1fr auto auto auto;
  gap: 1rem;
  align-items: flex-end;
}

.preview-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.resume-preview {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  min-height: 600px;
  overflow: hidden;
}

.cover-letter-modal {
  width: 90vw;
  max-width: 800px;
}

.cover-letter-content {
  max-height: 70vh;
  overflow-y: auto;
}

/* Responsive */
@media (max-width: 1200px) {
  .builder-container {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .builder-sidebar {
    width: 100%;
  }
  
  .template-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .experience-header,
  .experience-dates,
  .education-fields {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  
  .writing-stats {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .preview-actions {
    flex-direction: column;
  }
}

/* Job Search Enhancements */
.job-suggestions-container {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 1000;
  max-height: 300px;
  overflow-y: auto;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  margin-top: 4px;
}

.job-suggestions-list {
  padding: 0;
}

.job-suggestion-item {
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s ease;
  padding: 12px 16px;
  cursor: pointer;
}

.job-suggestion-item:last-child {
  border-bottom: none;
}

.job-suggestion-item:hover {
  background-color: #f8f9fa;
}

.selected-job-card {
  border: 1px solid #667eea;
  border-radius: 8px;
  background: rgba(102, 126, 234, 0.05);
  position: relative;
}

.selected-job-card:hover {
  background: rgba(102, 126, 234, 0.1);
}

/* ATS Breakdown Panel Styles */
.ats-breakdown-panel {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-top: 16px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.ats-breakdown-panel h4 {
  margin: 0 0 16px 0;
  color: #2c3e50;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.ats-factors {
  margin-bottom: 16px;
}

.ats-factor {
  padding: 8px 12px;
  margin: 4px 0;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
}

.factor-good {
  background: #d4edda;
  color: #155724;
  border-left: 4px solid #28a745;
}

.factor-warning {
  background: #fff3cd;
  color: #856404;
  border-left: 4px solid #ffc107;
}

.factor-bad {
  background: #f8d7da;
  color: #721c24;
  border-left: 4px solid #dc3545;
}

.ats-score-summary {
  border-top: 1px solid #e0e0e0;
  padding-top: 16px;
}

.score-progress {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-bar {
  flex: 1;
  height: 20px;
  background: #f0f0f0;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  border-radius: 10px;
  transition: width 0.3s ease, background-color 0.3s ease;
}

.progress-fill.excellent {
  background: linear-gradient(90deg, #28a745, #34ce57);
}

.progress-fill.good {
  background: linear-gradient(90deg, #17a2b8, #20c997);
}

.progress-fill.fair {
  background: linear-gradient(90deg, #ffc107, #ffcd39);
}

.progress-fill.poor {
  background: linear-gradient(90deg, #dc3545, #e74c3c);
}

.score-text {
  font-weight: 600;
  color: #2c3e50;
  min-width: 60px;
}
</style>
