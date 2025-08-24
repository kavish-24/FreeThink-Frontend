<template>
  <div class="profile-page">
    <AppHeader />
  <div class="q-pa-md bg-grey-1 full-height">
    <q-inner-loading :showing="loading">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
    <q-card class="header-card q-pa-md q-mb-xl">
      <div class="row justify-between items-center">
        <h4 class="q-mt-none q-mb-none text-primary">My Profile</h4>
        <q-btn
          flat
          icon="edit"
          :label="editMode ? 'Cancel' : 'Edit Profile'"
          class="edit-btn"
          @click="toggleEditMode"
        />
      </div>
    </q-card>

    <div class="row justify-center">
      <q-card class="avatar-card q-pa-lg q-mb-xl">
        <div class="column items-center q-gutter-md">
          <div class="avatar-container">
            <q-avatar
              size="100px"
              class="bg-primary text-white cursor-pointer professional-avatar"
              @click="triggerFileUpload"
            >
              <img v-if="profile.photo" :src="profile.photo" />
              <span v-else>{{ initials }}</span>
            </q-avatar>
            <input
              type="file"
              ref="fileInput"
              accept="image/*"
              @change="handlePhotoUpload"
              hidden
            />
          </div>
          <div class="text-h6 text-weight-medium text-dark">{{ fullName }}</div>
          <div class="text-caption text-grey-7">{{ profile.email }}</div>
        </div>

        <div class="q-mt-lg full-width">
          <div class="text-caption text-grey-6 text-weight-medium">Profile Completeness</div>
          <q-linear-progress
            :value="profileCompleteness"
            color="primary"
            track-color="grey-3"
            size="12px"
            rounded
            class="q-mt-sm"
          />
          <div class="text-right text-caption q-mt-xs">{{ Math.round(profileCompleteness * 100) }}%</div>
        </div>
      </q-card>
    </div>

    <q-card class="info-card q-pa-lg q-mb-xl">
      <div class="section-title">Profile Information</div>
      <div class="row q-col-gutter-lg">
        <div class="col-12 col-md-6">
          <q-input 
            v-if="editMode" 
            v-model="profile.firstName" 
            label="First Name" 
            outlined 
            dense 
            class="q-mb-md"
          />
          <div v-else class="q-mb-md"><span class="label">First Name:</span> {{ profile.firstName }}</div>

          <q-input 
            v-if="editMode" 
            v-model="profile.email" 
            label="Email" 
            outlined 
            dense 
            class="q-mb-md"
          />
          <div v-else class="q-mb-md"><span class="label">Email:</span> {{ profile.email }}</div>

          <q-input 
            v-if="editMode" 
            v-model="profile.streetAddress" 
            label="Street Address" 
            outlined 
            dense 
            class="q-mb-md"
          />
          <div v-else class="q-mb-md"><span class="label">Address:</span> {{ profile.streetAddress }}</div>
        </div>

        <div class="col-12 col-md-6">
          <q-input 
            v-if="editMode" 
            v-model="profile.lastName" 
            label="Last Name" 
            outlined 
            dense 
            class="q-mb-md"
          />
          <div v-else class="q-mb-md"><span class="label">Last Name:</span> {{ profile.lastName }}</div>

          <q-input 
            v-if="editMode" 
            v-model="profile.phoneNumber" 
            label="Phone Number" 
            outlined 
            dense 
            class="q-mb-md"
          />
          <div v-else class="q-mb-md"><span class="label">Phone Number:</span> {{ profile.phoneNumber }}</div>

          <q-input 
            v-if="editMode" 
            v-model="profile.zipcode" 
            label="Zip Code" 
            outlined 
            dense 
            class="q-mb-md"
          />
          <div v-else class="q-mb-md"><span class="label">Zip Code:</span> {{ profile.zipcode }}</div>
        </div>
      </div>
    </q-card>

    <q-card class="info-card q-pa-lg q-mb-xl">
      <div class="section-title">Professional Background</div>

      <div class="q-mb-lg">
        <q-input
          v-if="editMode"
          v-model="profile.summary"
          type="textarea"
          label="Professional Summary"
          outlined
          dense
          autogrow
          class="input-field"
        />
        <div v-else>
          <div class="label">Professional Summary</div>
          <div class="text-grey-7">{{ profile.summary || 'Not provided' }}</div>
        </div>
      </div>

      <div class="q-mb-md">
        <q-input
          v-if="editMode"
          v-model="profile.title"
          label="Professional Title"
          outlined
          dense
        />
        <div v-else>
          <div class="label">Title</div>
          <div class="text-grey-7">{{ profile.title || 'Not provided' }}</div>
        </div>
      </div>

      <div class="q-mb-md">
        <q-input
          v-if="editMode"
          v-model.number="profile.experienceYears"
          type="number"
          label="Years of Experience"
          outlined
          dense
        />
        <div v-else>
          <div class="label">Experience</div>
          <div class="text-grey-7">{{ profile.experienceYears }} years</div>
        </div>
      </div>

      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-6">
          <div class="label row items-center justify-between">
            <span>Education</span>
            <q-btn
              v-if="editMode"
              icon="add"
              dense flat
              @click="addEducation"
              size="sm"
              color="primary"
            />
          </div>

          <div v-for="(edu, index) in profile.education" :key="index" class="q-mb-md">
            <div v-if="!editMode" class="text-grey-7">
              {{ edu.degree }} – {{ edu.school }}<br />
              <span class="text-caption">{{ edu.field }}</span><br />
              <span class="text-caption text-grey">
                {{ formatDateForDisplay(edu.start_date) }} to {{ formatDateForDisplay(edu.end_date) }}
              </span>
            </div>

            <div v-else class="q-gutter-sm">
              <q-input v-model="edu.school" label="School" dense outlined />
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
              />
              <q-input v-model="edu.field" label="Field" dense outlined />
              <q-input v-model="edu.start_date" type="date" label="Start Date" dense outlined />
              <q-input v-model="edu.end_date" type="date" label="End Date" dense outlined />
              <q-btn
                icon="delete"
                color="negative"
                flat dense
                @click="removeEducation(index)"
                size="sm"
              />
              <q-separator spaced />
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="label row items-center justify-between">
            <span>Work Experience</span>
            <q-btn
              v-if="editMode"
              icon="add"
              dense flat
              @click="addExperience"
              size="sm"
              color="primary"
            />
          </div>

          <div v-for="(exp, index) in profile.experience" :key="index" class="q-mb-md">
            <div v-if="!editMode" class="text-grey-7">
              {{ exp.title }} at {{ exp.company }}<br />
              <div class="text-caption text-grey">{{ exp.description }}</div>
              <span class="text-caption text-grey">
                {{ formatDateForDisplay(exp.start_date) }} to {{ formatDateForDisplay(exp.end_date) }}
              </span>
            </div>

            <div v-else class="q-gutter-sm">
              <q-input v-model="exp.title" label="Job Title" dense outlined />
              <q-input v-model="exp.company" label="Company" dense outlined />
              <q-input v-model="exp.description" label="Description" type="textarea" dense outlined />
              <q-input v-model="exp.start_date" type="date" label="Start Date" dense outlined />
              <q-input v-model="exp.end_date" type="date" label="End Date" dense outlined />
              <q-btn
                icon="delete"
                color="negative"
                flat dense
                @click="removeExperience(index)"
                size="sm"
              />
              <q-separator spaced />
            </div>
          </div>
        </div>
      </div>
    </q-card>

    <q-card class="info-card q-pa-lg q-mb-xl">
      <div class="section-title">Skills & Resume</div>
      <div class="row q-col-gutter-lg">
        <div class="col-12 col-md-6">
          <div class="label">Skills</div>
          <div v-if="!editMode">
            <q-chip
              v-for="skill in profile.skills"
              :key="skill"
              color="blue-1"
              text-color="primary"
              class="q-mr-sm q-mb-sm skill-chip"
              dense
            >
              {{ skill }}
            </q-chip>
            <div v-if="!profile.skills || profile.skills.length === 0" class="text-grey-7">
              No skills added yet
            </div>
          </div>
          <div v-else>
            <div v-for="(skill, index) in profile.skills" :key="index" class="row q-gutter-sm items-center q-mb-sm">
              <q-input
                v-model="profile.skills[index]"
                outlined dense
                :label="`Skill ${index + 1}`"
                style="flex: 1;"
              />
              <q-btn 
                icon="delete" 
                flat dense 
                color="negative" 
                @click="removeSkill(index)"
                size="sm"
              />
            </div>
            <q-btn flat icon="add" label="Add Skill" @click="addSkill" />
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="label q-mb-sm">Resume</div>

          <div v-if="!editMode">
            <q-img
              v-if="profile.resumeType === 'image' && profile.resume"
              :src="profile.resume"
              contain
              style="max-height: 200px; border-radius: 8px;"
            />
            <div v-else-if="profile.resume" class="resume-link row items-center">
              <q-icon name="picture_as_pdf" color="red" size="40px" />
              <a :href="profile.resume" target="_blank" class="text-primary q-ml-sm">
                View Resume (PDF)
              </a>
            </div>
            <div v-else class="text-grey-7">No resume uploaded</div>
          </div>

          <div v-if="editMode">
            <q-btn
              label="Upload Resume"
              icon="cloud_upload"
              flat
              color="primary"
              @click="triggerResumeUpload"
              class="q-mb-sm"
            />
            <input
              ref="resumeInput"
              type="file"
              accept=".pdf,image/*"
              hidden
              @change="handleResumeUpload"
            />
            <div class="text-caption text-grey">
              Accepted: PDF or image formats
            </div>
          </div>
        </div>
      </div>
    </q-card>

    <q-btn
      v-if="editMode"
      label="Save Changes"
      color="primary"
      class="q-mt-lg save-btn"
      icon="save"
      @click="saveProfile"
      :loading="saving"
    />
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
const originalProfile = ref(null) // Store original data for cancel functionality

const fullName = computed(() => `${profile.value.firstName} ${profile.value.lastName}`)
const initials = computed(() => 
  (profile.value.firstName?.charAt(0) || '') + (profile.value.lastName?.charAt(0) || '')
)

// Calculate profile completeness
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

    // Ensure arrays exist and handle backend structure
    data.education = Array.isArray(data.education) ? data.education : []
    data.experience = Array.isArray(data.experience) ? data.experience : []
    data.skills = Array.isArray(data.skills) ? data.skills : []

    // Convert date formats for display - handle both date formats
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

    // Ensure resume type is properly set
    if (data.resume && !data.resumeType) {
      data.resumeType = data.resume.endsWith('.pdf') ? 'pdf' : 'image'
    }

    profile.value = data
    originalProfile.value = JSON.parse(JSON.stringify(data)) // Deep copy for cancel
  } catch (error) {
    console.error('Error loading profile:', error)
    $q.notify({ type: 'negative', message: 'Failed to load profile' })
  } finally {
    loading.value = false
  }
}

const toggleEditMode = () => {
  if (editMode.value) {
    // Cancel - restore original data
    profile.value = JSON.parse(JSON.stringify(originalProfile.value))
  }
  editMode.value = !editMode.value
}

const saveProfile = async () => {
  saving.value = true
  
  try {
    // Prepare data for backend - ensure proper structure
    const profileData = {
      ...profile.value,
      // Map education fields to match backend expectations
      education: profile.value.education.map(e => ({
        school: e.school,
        degree: e.degree,
        field: e.field,
        start_date: e.start_date,
        end_date: e.end_date
      })),
      // Map experience fields to match backend expectations
      experience: profile.value.experience.map(e => ({
        title: e.title,
        company: e.company,
        description: e.description,
        start_date: e.start_date,
        end_date: e.end_date
      })),
      // Filter out empty skills
      skills: profile.value.skills.filter(skill => skill.trim() !== '')
    }

    const res = await jobSeekerProfileService.updateProfile(userId, profileData)

    if (!res.success) {
      $q.notify({ type: 'negative', message: res.error })
      return
    }

    $q.notify({ type: 'positive', message: 'Profile saved successfully' })
    editMode.value = false
    originalProfile.value = JSON.parse(JSON.stringify(profile.value)) // Update original
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

  // Check file size (limit to 5MB)
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
  
  // Clear the input
  event.target.value = ''
}

const triggerResumeUpload = () => resumeInput.value?.click()

const handleResumeUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  // Validate file type
  const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
  if (!validTypes.includes(file.type)) {
    $q.notify({ type: 'negative', message: 'Please upload a PDF or image file' })
    return
  }

  // Check file size (limit to 10MB)
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
  
  // Clear the input
  event.target.value = ''
}

// Helper functions for array management
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

// Date formatting functions
const formatDateForInput = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return d.toISOString().split('T')[0] // YYYY-MM-DD format for input[type="date"]
}

const formatDateForDisplay = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
}
</script>

<style scoped>
/* Font and color variables for consistency */
:root {
  --font-family-primary: 'Inter', sans-serif;
  --color-primary: #3b82f6;
  --color-primary-dark: #2563eb;
  --color-gray-100: #f8fafc;
  --color-gray-200: #e5e7eb;
  --color-gray-500: #6b7280;
  --color-gray-600: #4b5563;
  --color-gray-700: #374151;
  --color-gray-800: #1f2937;
  --color-blue-50: #eff6ff;
  --color-red: #ef4444;
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --transition-base: all 0.3s ease;
}

.profile-page {
  min-height: 100vh;
  background: var(--color-gray-100);
  font-family: var(--font-family-primary);
}

/* Header Card */
.header-card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: var(--shadow-md);
  padding: 1.5rem;
  margin-bottom: 2rem;
  border: 1px solid var(--color-gray-200);
  transition: var(--transition-base);
}

.header-card:hover {
  box-shadow: var(--shadow-lg);
}

.header-card h4 {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-primary);
  margin: 0;
}

.edit-btn {
  color: var(--color-primary);
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: var(--transition-base);
}

.edit-btn:hover {
  background: var(--color-blue-50);
  color: var(--color-primary-dark);
  transform: translateY(-2px);
}

/* Avatar Card */
.avatar-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 12px;
  box-shadow: var(--shadow-md);
  padding: 2rem;
  margin-bottom: 2rem;
  max-width: 500px;
  width: 100%;
  border: 1px solid var(--color-gray-200);
  transition: var(--transition-base);
}

.avatar-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-4px);
}

.avatar-container {
  position: relative;
}

.professional-avatar {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  font-size: 2.5rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-base);
}

.professional-avatar:hover {
  transform: scale(1.05);
}

.q-linear-progress {
  border-radius: 9999px;
  overflow: hidden;
  margin-top: 0.5rem;
}

.q-linear-progress::v-deep(.q-linear-progress__track) {
  background: var(--color-gray-200);
}

.q-linear-progress::v-deep(.q-linear-progress__model) {
  background: var(--color-primary);
  transition: width 0.5s ease;
}

/* Info Card */
.info-card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: var(--shadow-md);
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid var(--color-gray-200);
  transition: var(--transition-base);
}

.info-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-4px);
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: 1rem;
}

.label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-gray-800);
  margin-bottom: 0.25rem;
}

/* Form Inputs and Selects */
.q-input,
.q-select {
  margin-bottom: 1rem;
}

.q-input::v-deep(.q-field__control),
.q-select::v-deep(.q-field__control) {
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid var(--color-gray-200);
  transition: var(--transition-base);
}

.q-input::v-deep(.q-field__control):focus-within,
.q-select::v-deep(.q-field__control):focus-within {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

/* Buttons */
.q-btn {
  border-radius: 8px;
  transition: var(--transition-base);
}

.q-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.q-btn[color="primary"] {
  background: var(--color-primary);
  color: #ffffff;
}

.q-btn[color="primary"]:hover {
  background: var(--color-primary-dark);
}

.q-btn[color="negative"] {
  color: var(--color-red);
}

.q-btn[color="negative"]:hover {
  background: #fef2f2;
}

/* Skill Chips */
.skill-chip {
  background: var(--color-blue-50);
  color: var(--color-primary);
  font-weight: 500;
  border-radius: 9999px;
  padding: 0.25rem 0.75rem;
  margin: 0.25rem;
  transition: var(--transition-base);
}

.skill-chip:hover {
  background: var(--color-primary);
  color: #ffffff;
}

/* Resume Link */
.resume-link {
  display: flex;
  align-items: center;
  padding: 1rem;
  background: #f8fafc;
  border: 1px solid var(--color-gray-200);
  border-radius: 8px;
  transition: var(--transition-base);
}

.resume-link:hover {
  background: var(--color-blue-50);
  transform: translateY(-2px);
}

.resume-link a {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
}

.resume-link a:hover {
  color: var(--color-primary-dark);
}

/* Save Button */
.save-btn {
  background: var(--color-primary);
  color: #ffffff;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  margin-top: 1.5rem;
  transition: var(--transition-base);
}

.save-btn:hover {
  background: var(--color-primary-dark);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

/* Responsive Design */
@media (max-width: 768px) {
  .avatar-card {
    padding: 1.5rem;
    max-width: 100%;
  }

  .info-card {
    padding: 1.5rem;
  }

  .section-title {
    font-size: 1.1rem;
  }

  .header-card {
    padding: 1rem;
  }

  .header-card h4 {
    font-size: 1.5rem;
  }

  .q-input,
  .q-select {
    margin-bottom: 0.75rem;
  }
}

@media (max-width: 480px) {
  .avatar-card {
    padding: 1rem;
  }

  .professional-avatar {
    width: 80px;
    height: 80px;
    font-size: 2rem;
  }

  .q-btn {
    width: 100%;
  }

  .resume-link {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .save-btn {
    width: 100%;
  }
}
</style>