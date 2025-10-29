<template>
  <div class="profile-page">
    <AppHeader />
    
    <div class="profile-container">
      <q-inner-loading :showing="loading">
        <q-spinner-dots size="60px" color="primary" />
        <div class="loading-text">Loading your profile...</div>
      </q-inner-loading>

      <!-- Hero Header Section -->
      <div class="hero-header">
        <div class="hero-background">
          <div class="hero-pattern"></div>
        </div>
        <div class="hero-content">
          <div class="avatar-section-hero">
            <div class="avatar-wrapper">
              <q-avatar
                size="140px"
                class="profile-avatar-hero"
                @click="editMode && triggerFileUpload()"
                :class="{ 'cursor-pointer': editMode }"
              >
                <img v-if="profile.photo" :src="profile.photo" />
                <span v-else class="avatar-initials-hero">{{ initials }}</span>
                <div v-if="editMode" class="avatar-overlay-hero">
                  <q-icon name="camera_alt" size="32px" />
                  <span class="overlay-text">Change Photo</span>
                </div>
              </q-avatar>
              <input
                type="file"
                ref="fileInput"
                accept="image/*"
                @change="handlePhotoUpload"
                hidden
              />
            </div>
            
            <div class="hero-info">
              <h1 class="hero-name">{{ fullName }}</h1>
              <p class="hero-title">{{ profile.title || 'Add your professional title' }}</p>
              <p class="hero-email">{{ profile.email }}</p>
              
              <!-- Stats Row -->
              <div class="hero-stats">
                <div class="stat-badge">
                  <q-icon name="work_history" size="20px" />
                  <span>{{ profile.experienceYears || 0 }} Years</span>
                </div>
                <div class="stat-badge">
                  <q-icon name="psychology" size="20px" />
                  <span>{{ profile.skills?.length || 0 }} Skills</span>
                </div>
                <div class="stat-badge">
                  <q-icon name="school" size="20px" />
                  <span>{{ profile.education?.length || 0 }} Education</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="hero-actions">
            <q-btn
              :icon="editMode ? 'close' : 'edit'"
              :label="editMode ? 'Cancel' : 'Edit Profile'"
              :color="editMode ? 'negative' : 'primary'"
              unelevated
              no-caps
              size="lg"
              class="action-btn-hero"
              @click="toggleEditMode"
            />
          </div>
        </div>
        
        <!-- Profile Completeness Bar -->
        <div class="completeness-banner" v-if="profileCompleteness < 1">
          <div class="completeness-content">
            <div class="completeness-info">
              <q-icon name="info_outline" size="20px" />
              <span>Complete your profile to increase visibility to employers</span>
            </div>
            <div class="completeness-progress-wrapper">
              <q-linear-progress
                :value="profileCompleteness"
                color="primary"
                track-color="grey-3"
                size="8px"
                rounded
              />
              <span class="completeness-percent">{{ Math.round(profileCompleteness * 100) }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="content-grid">
        <!-- Contact Information Card -->
        <div class="profile-card">
          <div class="card-header">
            <div class="card-title">
              <q-icon name="contact_phone" class="title-icon" />
              <span>Contact Information</span>
            </div>
          </div>
          <div class="card-body">
            <div class="info-grid-2col">
              <div class="info-field">
                <q-input
                  v-if="editMode"
                  v-model="profile.firstName"
                  label="First Name"
                  outlined
                  dense
                  class="modern-input"
                >
                  <template v-slot:prepend>
                    <q-icon name="person" />
                  </template>
                </q-input>
                <div v-else class="field-display">
                  <div class="field-label">First Name</div>
                  <div class="field-value">{{ profile.firstName || 'Not provided' }}</div>
                </div>
              </div>

              <div class="info-field">
                <q-input
                  v-if="editMode"
                  v-model="profile.lastName"
                  label="Last Name"
                  outlined
                  dense
                  class="modern-input"
                >
                  <template v-slot:prepend>
                    <q-icon name="person" />
                  </template>
                </q-input>
                <div v-else class="field-display">
                  <div class="field-label">Last Name</div>
                  <div class="field-value">{{ profile.lastName || 'Not provided' }}</div>
                </div>
              </div>

              <div class="info-field">
                <q-input
                  v-if="editMode"
                  v-model="profile.email"
                  label="Email"
                  outlined
                  dense
                  class="modern-input"
                >
                  <template v-slot:prepend>
                    <q-icon name="email" />
                  </template>
                </q-input>
                <div v-else class="field-display">
                  <div class="field-label">Email</div>
                  <div class="field-value">{{ profile.email || 'Not provided' }}</div>
                </div>
              </div>

              <div class="info-field">
                <q-input
                  v-if="editMode"
                  v-model="profile.phoneNumber"
                  label="Phone Number"
                  outlined
                  dense
                  class="modern-input"
                >
                  <template v-slot:prepend>
                    <q-icon name="phone" />
                  </template>
                </q-input>
                <div v-else class="field-display">
                  <div class="field-label">Phone Number</div>
                  <div class="field-value">{{ profile.phoneNumber || 'Not provided' }}</div>
                </div>
              </div>

              <div class="info-field">
                <q-input
                  v-if="editMode"
                  v-model="profile.streetAddress"
                  label="Street Address"
                  outlined
                  dense
                  class="modern-input"
                >
                  <template v-slot:prepend>
                    <q-icon name="location_on" />
                  </template>
                </q-input>
                <div v-else class="field-display">
                  <div class="field-label">Street Address</div>
                  <div class="field-value">{{ profile.streetAddress || 'Not provided' }}</div>
                </div>
              </div>

              <div class="info-field">
                <q-input
                  v-if="editMode"
                  v-model="profile.zipcode"
                  label="Zip Code"
                  outlined
                  dense
                  class="modern-input"
                >
                  <template v-slot:prepend>
                    <q-icon name="pin_drop" />
                  </template>
                </q-input>
                <div v-else class="field-display">
                  <div class="field-label">Zip Code</div>
                  <div class="field-value">{{ profile.zipcode || 'Not provided' }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Professional Information Card -->
        <div class="profile-card">
          <div class="card-header">
            <div class="card-title">
              <q-icon name="work" class="title-icon" />
              <span>Professional Information</span>
            </div>
          </div>
          <div class="card-body">
            <div class="info-field full-width">
              <q-input
                v-if="editMode"
                v-model="profile.summary"
                type="textarea"
                label="Professional Summary"
                outlined
                autogrow
                class="modern-input"
                rows="4"
              >
                <template v-slot:prepend>
                  <q-icon name="description" />
                </template>
              </q-input>
              <div v-else class="field-display">
                <div class="field-label">Professional Summary</div>
                <div class="field-value summary-text">{{ profile.summary || 'Add a professional summary to showcase your expertise' }}</div>
              </div>
            </div>

            <div class="info-grid-2col">
              <div class="info-field">
                <q-input
                  v-if="editMode"
                  v-model="profile.title"
                  label="Professional Title"
                  outlined
                  dense
                  class="modern-input"
                >
                  <template v-slot:prepend>
                    <q-icon name="badge" />
                  </template>
                </q-input>
                <div v-else class="field-display">
                  <div class="field-label">Professional Title</div>
                  <div class="field-value">{{ profile.title || 'Not provided' }}</div>
                </div>
              </div>

              <div class="info-field">
                <q-input
                  v-if="editMode"
                  v-model.number="profile.experienceYears"
                  type="number"
                  label="Years of Experience"
                  outlined
                  dense
                  class="modern-input"
                >
                  <template v-slot:prepend>
                    <q-icon name="work_history" />
                  </template>
                </q-input>
                <div v-else class="field-display">
                  <div class="field-label">Years of Experience</div>
                  <div class="field-value">{{ profile.experienceYears || 0 }} years</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Skills Card -->
        <div class="profile-card">
          <div class="card-header">
            <div class="card-title">
              <q-icon name="psychology" class="title-icon" />
              <span>Skills & Expertise</span>
            </div>
            <q-btn
              v-if="editMode"
              icon="add"
              flat
              round
              dense
              color="primary"
              @click="addSkill"
              class="add-btn"
            >
              <q-tooltip>Add Skill</q-tooltip>
            </q-btn>
          </div>
          <div class="card-body">
            <div v-if="!editMode" class="skills-display">
              <q-chip
                v-for="skill in profile.skills"
                :key="skill"
                color="primary"
                text-color="white"
                class="skill-chip-modern"
                icon="check_circle"
              >
                {{ skill }}
              </q-chip>
              <div v-if="!profile.skills || profile.skills.length === 0" class="empty-state-small">
                <q-icon name="psychology" size="32px" color="grey-5" />
                <span>No skills added yet</span>
              </div>
            </div>
            <div v-else class="skills-edit-grid">
              <div v-for="(skill, index) in profile.skills" :key="index" class="skill-edit-item">
                <q-input
                  v-model="profile.skills[index]"
                  outlined
                  dense
                  :label="`Skill ${index + 1}`"
                  class="modern-input"
                />
                <q-btn
                  icon="delete"
                  flat
                  round
                  dense
                  color="negative"
                  @click="removeSkill(index)"
                  size="sm"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Education Card -->
        <div class="profile-card">
          <div class="card-header">
            <div class="card-title">
              <q-icon name="school" class="title-icon" />
              <span>Education</span>
            </div>
            <q-btn
              v-if="editMode"
              icon="add"
              flat
              round
              dense
              color="primary"
              @click="addEducation"
              class="add-btn"
            >
              <q-tooltip>Add Education</q-tooltip>
            </q-btn>
          </div>
          <div class="card-body">
            <div v-if="profile.education.length === 0" class="empty-state-small">
              <q-icon name="school" size="32px" color="grey-5" />
              <span>No education added yet</span>
            </div>
            <div v-else class="timeline-list">
              <div v-for="(edu, index) in profile.education" :key="index" class="timeline-item">
                <div v-if="!editMode" class="timeline-content">
                  <div class="timeline-header">
                    <h4 class="timeline-title">{{ edu.degree }}</h4>
                    <span class="timeline-date">
                      {{ formatDateForDisplay(edu.start_date) }} - {{ formatDateForDisplay(edu.end_date) }}
                    </span>
                  </div>
                  <div class="timeline-subtitle">{{ edu.school }}</div>
                  <div class="timeline-description">{{ edu.field }}</div>
                </div>
                <div v-else class="edit-form">
                  <div class="edit-form-grid">
                    <q-input v-model="edu.school" label="School" dense outlined class="modern-input" />
                    <q-select
                      v-model="edu.degree"
                      :options="[
                        { label: 'SSC', value: 'SSC' },
                        { label: 'HSSC', value: 'HSSC' },
                        { label: 'Bachelor', value: 'Bachelor' },
                        { label: 'Master', value: 'Master' },
                        { label: 'PhD', value: 'PhD' }
                      ]"
                      label="Degree"
                      dense
                      outlined
                      emit-value
                      map-options
                      class="modern-input"
                    />
                    <q-input v-model="edu.field" label="Field of Study" dense outlined class="modern-input" />
                    <div class="date-inputs">
                      <q-input v-model="edu.start_date" type="date" label="Start Date" dense outlined class="modern-input" />
                      <q-input v-model="edu.end_date" type="date" label="End Date" dense outlined class="modern-input" />
                    </div>
                  </div>
                  <q-btn
                    icon="delete"
                    label="Remove"
                    flat
                    color="negative"
                    @click="removeEducation(index)"
                    size="sm"
                    class="remove-btn"
                  />
                  <q-separator v-if="index < profile.education.length - 1" class="q-my-md" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Work Experience Card -->
        <div class="profile-card">
          <div class="card-header">
            <div class="card-title">
              <q-icon name="business_center" class="title-icon" />
              <span>Work Experience</span>
            </div>
            <q-btn
              v-if="editMode"
              icon="add"
              flat
              round
              dense
              color="primary"
              @click="addExperience"
              class="add-btn"
            >
              <q-tooltip>Add Experience</q-tooltip>
            </q-btn>
          </div>
          <div class="card-body">
            <div v-if="profile.experience.length === 0" class="empty-state-small">
              <q-icon name="business_center" size="32px" color="grey-5" />
              <span>No work experience added yet</span>
            </div>
            <div v-else class="timeline-list">
              <div v-for="(exp, index) in profile.experience" :key="index" class="timeline-item">
                <div v-if="!editMode" class="timeline-content">
                  <div class="timeline-header">
                    <h4 class="timeline-title">{{ exp.title }}</h4>
                    <span class="timeline-date">
                      {{ formatDateForDisplay(exp.start_date) }} - {{ formatDateForDisplay(exp.end_date) }}
                    </span>
                  </div>
                  <div class="timeline-subtitle">{{ exp.company }}</div>
                  <div class="timeline-description">{{ exp.description }}</div>
                </div>
                <div v-else class="edit-form">
                  <div class="edit-form-grid">
                    <q-input v-model="exp.title" label="Job Title" dense outlined class="modern-input" />
                    <q-input v-model="exp.company" label="Company" dense outlined class="modern-input" />
                    <q-input v-model="exp.description" label="Description" type="textarea" dense outlined autogrow class="modern-input full-width" />
                    <div class="date-inputs">
                      <q-input v-model="exp.start_date" type="date" label="Start Date" dense outlined class="modern-input" />
                      <q-input v-model="exp.end_date" type="date" label="End Date" dense outlined class="modern-input" />
                    </div>
                  </div>
                  <q-btn
                    icon="delete"
                    label="Remove"
                    flat
                    color="negative"
                    @click="removeExperience(index)"
                    size="sm"
                    class="remove-btn"
                  />
                  <q-separator v-if="index < profile.experience.length - 1" class="q-my-md" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Resume Card -->
        <div class="profile-card">
          <div class="card-header">
            <div class="card-title">
              <q-icon name="description" class="title-icon" />
              <span>Resume</span>
            </div>
          </div>
          <div class="card-body">
            <div v-if="!editMode">
              <div v-if="profile.resume" class="resume-preview">
                <q-img
                  v-if="profile.resumeType === 'image'"
                  :src="profile.resume"
                  contain
                  class="resume-image"
                />
                <div v-else class="resume-pdf-link">
                  <q-icon name="picture_as_pdf" color="red" size="48px" />
                  <div class="resume-info">
                    <div class="resume-filename">Resume.pdf</div>
                    <a :href="profile.resume" target="_blank" class="resume-link-text">
                      <q-icon name="open_in_new" size="16px" />
                      View Resume
                    </a>
                  </div>
                </div>
              </div>
              <div v-else class="empty-state-small">
                <q-icon name="upload_file" size="32px" color="grey-5" />
                <span>No resume uploaded</span>
              </div>
            </div>
            <div v-if="editMode" class="resume-upload-section">
              <q-btn
                label="Upload Resume"
                icon="cloud_upload"
                unelevated
                color="primary"
                @click="triggerResumeUpload"
                class="upload-btn"
                no-caps
              />
              <input
                ref="resumeInput"
                type="file"
                accept=".pdf,image/*"
                hidden
                @change="handleResumeUpload"
              />
              <div class="upload-hint">
                <q-icon name="info" size="16px" />
                Accepted formats: PDF or image files (Max 10MB)
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Save Section -->
      <div v-if="editMode" class="save-section-modern">
        <div class="save-card-modern">
          <div class="save-content">
            <div class="save-info">
              <q-icon name="check_circle" size="32px" color="primary" />
              <div class="save-text">
                <h3>Ready to save your changes?</h3>
                <p>Make sure all information is correct before saving</p>
              </div>
            </div>
            <div class="save-actions-modern">
              <q-btn
                flat
                label="Cancel"
                color="grey-7"
                @click="toggleEditMode"
                size="lg"
                no-caps
              />
              <q-btn
                unelevated
                label="Save Changes"
                color="primary"
                icon="save"
                @click="saveProfile"
                :loading="saving"
                size="lg"
                no-caps
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useQuasar } from 'quasar';
import { jobSeekerProfileService } from 'src/services/profile.service';
import { authHelpers } from 'src/services/auth.service';
import AppHeader from 'src/components/HeaderPart.vue';

const $q = useQuasar();
const userId = authHelpers.getCurrentUser()?.id;

const profile = ref({
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  title: '',
  streetAddress: '',
  zipcode: '',
  summary: '',
  photo: null,
  resume: '',
  resumeType: 'pdf',
  experienceYears: 0,
  skills: [],
  education: [],
  experience: []
})

const editMode = ref(false)
const saving = ref(false)
const loading = ref(false)
const fileInput = ref(null)
const resumeInput = ref(null)
const originalProfile = ref(null)

const fullName = computed(() => `${profile.value.firstName} ${profile.value.lastName}`)
const initials = computed(() => 
  (profile.value.firstName?.charAt(0) || '') + (profile.value.lastName?.charAt(0) || '')
)

const profileCompleteness = computed(() => {
  const fields = [
    'firstName', 'lastName', 'email', 'phoneNumber', 'title', 
    'streetAddress', 'zipcode', 'summary', 'photo'
  ]
  
  let completed = 0
  fields.forEach(field => {
    if (profile.value[field]) completed++
  })
  
  if (profile.value.skills?.length > 0) completed++
  if (profile.value.education?.length > 0) completed++
  if (profile.value.experience?.length > 0) completed++
  if (profile.value.resume) completed++
  
  return completed / (fields.length + 4)
})

onMounted(async () => {
  await loadProfile()
})

const loadProfile = async () => {
  loading.value = true
  
  try {
    const res = await jobSeekerProfileService.getProfile(userId)

    if (!res.success) {
      $q.notify({ type: 'negative', message: res.error })
      return
    }

    const data = res.data

    data.education = Array.isArray(data.education) ? data.education : []
    data.experience = Array.isArray(data.experience) ? data.experience : []
    data.skills = Array.isArray(data.skills) ? data.skills : []

    data.education = data.education.map(e => ({
      ...e,
      school: e.school || e.institution || '',
      degree: e.degree || e.degree_type || '',
      field: e.field || e.field_of_study || '',
      start_date: e.start_date ? formatDateForInput(e.start_date) : '',
      end_date: e.end_date ? formatDateForInput(e.end_date) : ''
    }))

    data.experience = data.experience.map(e => ({
      ...e,
      title: e.title || e.job_title || '',
      company: e.company || e.company_name || '',
      description: e.description || '',
      start_date: e.start_date ? formatDateForInput(e.start_date) : '',
      end_date: e.end_date ? formatDateForInput(e.end_date) : ''
    }))

    if (data.resume && !data.resumeType) {
      data.resumeType = data.resume.endsWith('.pdf') ? 'pdf' : 'image'
    }

    profile.value = data
    originalProfile.value = JSON.parse(JSON.stringify(data))
  } catch (error) {
    console.error('Error loading profile:', error)
    $q.notify({ type: 'negative', message: 'Failed to load profile' })
  } finally {
    loading.value = false
  }
}

const toggleEditMode = () => {
  if (editMode.value) {
    profile.value = JSON.parse(JSON.stringify(originalProfile.value))
  }
  editMode.value = !editMode.value
}

const saveProfile = async () => {
  saving.value = true
  
  try {
    const profileData = {
      ...profile.value,
      education: profile.value.education.map(e => ({
        school: e.school,
        degree: e.degree,
        field: e.field,
        start_date: e.start_date,
        end_date: e.end_date
      })),
      experience: profile.value.experience.map(e => ({
        title: e.title,
        company: e.company,
        description: e.description,
        start_date: e.start_date,
        end_date: e.end_date
      })),
      skills: profile.value.skills.filter(skill => skill.trim() !== '')
    }

    const res = await jobSeekerProfileService.updateProfile(userId, profileData)

    if (!res.success) {
      $q.notify({ type: 'negative', message: res.error })
      return
    }

    $q.notify({ type: 'positive', message: 'Profile saved successfully' })
    editMode.value = false
    originalProfile.value = JSON.parse(JSON.stringify(profile.value))
  } catch (error) {
    console.error('Error saving profile:', error)
    $q.notify({ type: 'negative', message: 'Failed to save profile' })
  } finally {
    saving.value = false
  }
}

const triggerFileUpload = () => {
  if (editMode.value) {
    fileInput.value?.click()
  }
}

const handlePhotoUpload = async (event) => {
  const file = event.target.files[0]
  if (!file || !file.type.startsWith('image/')) {
    $q.notify({ type: 'negative', message: 'Please select a valid image file' })
    return
  }

  if (file.size > 5 * 1024 * 1024) {
    $q.notify({ type: 'negative', message: 'File size must be less than 5MB' })
    return
  }

  const res = await jobSeekerProfileService.uploadPhoto(userId, file)
  if (!res.success) {
    $q.notify({ type: 'negative', message: res.error });
    return;
  }

  profile.value.photo = res.url
  $q.notify({ type: 'positive', message: 'Photo uploaded successfully' })
  
  event.target.value = ''
}

const triggerResumeUpload = () => resumeInput.value?.click()

const handleResumeUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
  if (!validTypes.includes(file.type)) {
    $q.notify({ type: 'negative', message: 'Please upload a PDF or image file' })
    return
  }

  if (file.size > 10 * 1024 * 1024) {
    $q.notify({ type: 'negative', message: 'File size must be less than 10MB' })
    return
  }

  const res = await jobSeekerProfileService.uploadResume(userId, file)
  if (!res.success) {
    $q.notify({ type: 'negative', message: res.error })
    return
  }

  profile.value.resume = res.url
  profile.value.resumeType = file.type.includes('pdf') ? 'pdf' : 'image'
  $q.notify({ type: 'positive', message: 'Resume uploaded successfully' })
  
  event.target.value = ''
}

const addEducation = () => {
  profile.value.education.push({
    school: '',
    degree: '',
    field: '',
    start_date: '',
    end_date: ''
  })
}

const removeEducation = (index) => {
  profile.value.education.splice(index, 1)
}

const addExperience = () => {
  profile.value.experience.push({
    title: '',
    company: '',
    description: '',
    start_date: '',
    end_date: ''
  })
}

const removeExperience = (index) => {
  profile.value.experience.splice(index, 1)
}

const addSkill = () => {
  profile.value.skills.push('')
}

const removeSkill = (index) => {
  profile.value.skills.splice(index, 1)
}

const formatDateForInput = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return d.toISOString().split('T')[0]
}

const formatDateForDisplay = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  padding: 20px;
}

.profile-container {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
}

.loading-text {
  margin-top: 16px;
  color: #0ea5e9;
  font-weight: 500;
}

/* Hero Header Styles */
.hero-header {
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  margin-bottom: 30px;
  animation: fadeInUp 0.6s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-background {
  height: 220px;
  background: linear-gradient(135deg, #a7d7ed 0%, #ffffff 100%);
  position: relative;
  overflow: hidden;
}

.hero-background::before {
  content: '';
  position: absolute;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: moveBackground 20s linear infinite;
}

@keyframes moveBackground {
  0% { transform: translate(0, 0); }
  100% { transform: translate(50px, 50px); }
}

.hero-background::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100px;
  background: linear-gradient(to bottom, transparent, white);
}

.hero-content {
  padding: 0 40px 40px;
  margin-top: -100px;
  position: relative;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 20px;
}

.avatar-section-hero {
  display: flex;
  align-items: center;
  gap: 30px;
  flex: 1;
  min-width: 300px;
}

.avatar-wrapper {
  position: relative;
}

.profile-avatar-hero {
  border: 6px solid white;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  background: linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 100%);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.profile-avatar-hero:hover {
  transform: scale(1.05);
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.3);
}

.profile-avatar-hero.cursor-pointer {
  cursor: pointer;
}

.avatar-initials-hero {
  font-size: 3.5rem;
  font-weight: 700;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.avatar-overlay-hero {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  color: white;
}

.profile-avatar-hero:hover .avatar-overlay-hero {
  opacity: 1;
}

.overlay-text {
  font-size: 0.875rem;
  font-weight: 500;
  margin-top: 8px;
}

.hero-info {
  flex: 1;
  min-width: 250px;
}

.hero-name {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px 0;
  line-height: 1.2;
}

.hero-title {
  font-size: 1.25rem;
  color: #0ea5e9;
  font-weight: 500;
  margin: 0 0 4px 0;
}

.hero-email {
  font-size: 1rem;
  color: #6b7280;
  margin: 0 0 20px 0;
}

.hero-stats {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.stat-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 100%);
  color: white;
  padding: 10px 20px;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.9rem;
  box-shadow: 0 4px 15px rgba(14, 165, 233, 0.3);
  transition: all 0.3s ease;
}

.stat-badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(14, 165, 233, 0.4);
}

.hero-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.action-btn-hero {
  font-weight: 600;
  padding: 12px 32px;
  border-radius: 50px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.action-btn-hero:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.completeness-banner {
  background: linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 100%);
  padding: 20px 40px;
  color: white;
}

.completeness-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 30px;
  flex-wrap: wrap;
}

.completeness-info {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 500;
  font-size: 0.95rem;
}

.completeness-progress-wrapper {
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 250px;
}

.completeness-percent {
  font-weight: 700;
  font-size: 1.1rem;
  min-width: 50px;
}

/* Content Grid */
.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 24px;
  animation: fadeIn 0.8s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.profile-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  animation: slideIn 0.6s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.profile-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.card-header {
  background: linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 100%);
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 12px;
  color: white;
  font-size: 1.25rem;
  font-weight: 600;
}

.title-icon {
  font-size: 1.5rem;
}

.add-btn {
  color: white;
}

.card-body {
  padding: 24px;
}

/* Field Display */
.info-grid-2col {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.info-field {
  margin-bottom: 16px;
}

.info-field.full-width {
  grid-column: 1 / -1;
}

.field-display {
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
}

.field-display:hover {
  background: #f3f4f6;
  border-color: #0ea5e9;
}

.field-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 4px;
}

.field-value {
  font-size: 1rem;
  color: #1f2937;
  font-weight: 500;
}

.summary-text {
  line-height: 1.6;
  white-space: pre-wrap;
}

/* Modern Input Styles */
.modern-input {
  margin-bottom: 8px;
}

/* Skills */
.skills-display {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.skill-chip-modern {
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(14, 165, 233, 0.2);
  transition: all 0.3s ease;
}

.skill-chip-modern:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
}

.skills-edit-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.skill-edit-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Timeline */
.timeline-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.timeline-item {
  position: relative;
  padding-left: 24px;
  border-left: 3px solid #0ea5e9;
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: -9px;
  top: 0;
  width: 15px;
  height: 15px;
  background: #0ea5e9;
  border-radius: 50%;
  box-shadow: 0 0 0 4px white, 0 0 0 6px #0ea5e9;
}

.timeline-content {
  background: #f9fafb;
  padding: 20px;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.timeline-content:hover {
  background: #f3f4f6;
  transform: translateX(5px);
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  flex-wrap: wrap;
  gap: 10px;
}

.timeline-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.timeline-date {
  font-size: 0.875rem;
  color: #0ea5e9;
  font-weight: 600;
  background: white;
  padding: 4px 12px;
  border-radius: 50px;
  white-space: nowrap;
}

.timeline-subtitle {
  font-size: 1rem;
  color: #6b7280;
  font-weight: 600;
  margin-bottom: 8px;
}

.timeline-description {
  font-size: 0.95rem;
  color: #4b5563;
  line-height: 1.6;
}

/* Edit Form */
.edit-form {
  background: #f9fafb;
  padding: 20px;
  border-radius: 12px;
}

.edit-form-grid {
  display: grid;
  gap: 16px;
}

.date-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  grid-column: 1 / -1;
}

.remove-btn {
  margin-top: 12px;
}

/* Empty States */
.empty-state-small {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: #9ca3af;
  font-size: 0.95rem;
  text-align: center;
  gap: 12px;
}

/* Resume */
.resume-preview {
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  background: #f9fafb;
}

.resume-image {
  max-height: 500px;
  width: 100%;
}

.resume-pdf-link {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 30px;
}

.resume-info {
  flex: 1;
}

.resume-filename {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
}

.resume-link-text {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #0ea5e9;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.resume-link-text:hover {
  color: #8b5cf6;
  gap: 10px;
}

.resume-upload-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 30px;
}

.upload-btn {
  padding: 12px 32px;
  font-size: 1rem;
}

.upload-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6b7280;
  font-size: 0.875rem;
}

/* Save Section */
.save-section-modern {
  margin: 30px 0;
  animation: slideInUp 0.5s ease;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.save-card-modern {
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  border: 2px solid #0ea5e9;
}

.save-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}

.save-info {
  display: flex;
  align-items: center;
  gap: 20px;
  flex: 1;
}

.save-text h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 4px 0;
}

.save-text p {
  font-size: 0.95rem;
  color: #6b7280;
  margin: 0;
}

.save-actions-modern {
  display: flex;
  gap: 12px;
}

/* Responsive */
@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .hero-content {
    padding: 0 20px 20px;
  }

  .avatar-section-hero {
    flex-direction: column;
    text-align: center;
    width: 100%;
  }

  .hero-info {
    width: 100%;
  }

  .hero-stats {
    justify-content: center;
  }

  .hero-actions {
    width: 100%;
    justify-content: center;
  }

  .action-btn-hero {
    width: 100%;
  }

  .completeness-banner {
    padding: 16px 20px;
  }

  .completeness-content {
    flex-direction: column;
    gap: 16px;
  }

  .completeness-progress-wrapper {
    width: 100%;
  }

  .card-body {
    padding: 16px;
  }

  .info-grid-2col {
    grid-template-columns: 1fr;
  }

  .date-inputs {
    grid-template-columns: 1fr;
  }

  .timeline-header {
    flex-direction: column;
  }

  .save-content {
    flex-direction: column;
    text-align: center;
  }

  .save-actions-modern {
    width: 100%;
    flex-direction: column;
  }

  .save-actions-modern .q-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .profile-avatar-hero {
    width: 100px !important;
    height: 100px !important;
  }

  .avatar-initials-hero {
    font-size: 2.5rem;
  }

  .hero-name {
    font-size: 1.75rem;
  }

  .hero-title {
    font-size: 1rem;
  }

  .card-header {
    padding: 16px;
  }

  .card-title {
    font-size: 1.1rem;
  }
}

</style>