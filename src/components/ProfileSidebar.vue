<template>
  <q-dialog 
    v-model="isOpen" 
    position="right" 
    :maximized="$q.screen.xs"
    class="profile-sidebar-dialog"
  >
    <q-card class="profile-sidebar-card">
      <!-- Header -->
      <q-card-section class="profile-header">
        <div class="header-content">
          <div class="header-title">
            <q-icon name="person" class="header-icon" />
            <span class="title-text">My Profile</span>
          </div>
          <q-btn
            icon="close"
            flat
            round
            dense
            v-close-popup
            class="close-btn"
          />
        </div>
      </q-card-section>

      <!-- Profile Content -->
      <q-card-section class="profile-content">
        <q-inner-loading :showing="loading">
          <q-spinner-gears size="50px" color="primary" />
        </q-inner-loading>

        <!-- Avatar Section -->
        <div class="avatar-section">
          <div class="avatar-container">
            <q-avatar
              size="80px"
              class="profile-avatar"
              @click="editMode && triggerFileUpload()"
              :class="{ 'cursor-pointer': editMode }"
            >
              <img v-if="profile.photo" :src="profile.photo" />
              <span v-else class="avatar-initials">{{ initials }}</span>
            </q-avatar>
            <input
              type="file"
              ref="fileInput"
              accept="image/*"
              @change="handlePhotoUpload"
              hidden
            />
          </div>
          <div class="profile-name">{{ fullName }}</div>
          <div class="profile-email">{{ profile.email }}</div>
          
          <!-- Profile Completeness -->
          <div class="completeness-section" v-if="profileCompleteness < 1">
            <div class="completeness-header">
              <span class="completeness-label">Profile Completeness</span>
              <span class="completeness-percentage">{{ Math.round(profileCompleteness * 100) }}%</span>
            </div>
            <q-linear-progress
              :value="profileCompleteness"
              color="primary"
              track-color="grey-3"
              size="8px"
              rounded
              class="completeness-bar"
            />
          </div>
          
          <!-- 100% Complete Badge -->
         
        </div>

        <!-- Quick Actions -->
        <div class="quick-actions">
          <q-btn
            flat
            icon="edit"
            :label="editMode ? 'Cancel' : 'Edit Profile'"
            color="primary"
            class="action-btn"
            @click="toggleEditMode"
          />
          <q-btn
            flat
            icon="visibility"
            label="Full View"
            color="secondary"
            class="action-btn"
            @click="openFullProfile"
          />
        </div>

        <!-- Profile Information -->
        <div class="info-sections">
          <!-- Contact Info -->
          <div class="info-section">
            <div class="section-title">
              <q-icon name="contact_phone" />
              Contact Information
            </div>
            <div class="info-grid">
              <div class="info-item">
                <q-input
                  v-if="editMode"
                  v-model="profile.firstName"
                  label="First Name"
                  outlined
                  dense
                />
                <div v-else>
                  <div class="info-label">First Name</div>
                  <div class="info-value">{{ profile.firstName || 'Not provided' }}</div>
                </div>
              </div>

              <div class="info-item">
                <q-input
                  v-if="editMode"
                  v-model="profile.lastName"
                  label="Last Name"
                  outlined
                  dense
                />
                <div v-else>
                  <div class="info-label">Last Name</div>
                  <div class="info-value">{{ profile.lastName || 'Not provided' }}</div>
                </div>
              </div>

              <div class="info-item">
                <q-input
                  v-if="editMode"
                  v-model="profile.phoneNumber"
                  label="Phone Number"
                  outlined
                  dense
                />
                <div v-else>
                  <div class="info-label">Phone Number</div>
                  <div class="info-value">{{ profile.phoneNumber || 'Not provided' }}</div>
                </div>
              </div>

              <div class="info-item">
                <q-input
                  v-if="editMode"
                  v-model="profile.streetAddress"
                  label="Address"
                  outlined
                  dense
                />
                <div v-else>
                  <div class="info-label">Address</div>
                  <div class="info-value">{{ profile.streetAddress || 'Not provided' }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Professional Info -->
          <div class="info-section">
            <div class="section-title">
              <q-icon name="work" />
              Professional Information
            </div>
            <div class="info-grid">
              <div class="info-item">
                <q-input
                  v-if="editMode"
                  v-model="profile.title"
                  label="Job Title"
                  outlined
                  dense
                />
                <div v-else>
                  <div class="info-label">Job Title</div>
                  <div class="info-value">{{ profile.title || 'Not provided' }}</div>
                </div>
              </div>

              <div class="info-item">
                <q-input
                  v-if="editMode"
                  v-model.number="profile.experienceYears"
                  type="number"
                  label="Years of Experience"
                  outlined
                  dense
                />
                <div v-else>
                  <div class="info-label">Experience</div>
                  <div class="info-value">{{ profile.experienceYears || 0 }} years</div>
                </div>
              </div>

              <div class="info-item full-width">
                <q-input
                  v-if="editMode"
                  v-model="profile.summary"
                  type="textarea"
                  label="Professional Summary"
                  outlined
                  dense
                  autogrow
                />
                <div v-else>
                  <div class="info-label">Professional Summary</div>
                  <div class="info-value">{{ profile.summary || 'Not provided' }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Skills -->
          <div class="info-section">
            <div class="section-title">
              <q-icon name="psychology" />
              Skills
              <q-btn
                v-if="editMode"
                icon="add"
                size="sm"
                flat
                round
                color="primary"
                @click="addSkill"
              />
            </div>
            <div v-if="!editMode" class="skills-display">
              <q-chip
                v-for="skill in profile.skills"
                :key="skill"
                color="primary"
                text-color="white"
                dense
                class="skill-chip"
              >
                {{ skill }}
              </q-chip>
              <div v-if="!profile.skills || profile.skills.length === 0" class="no-data">
                No skills added yet
              </div>
            </div>
            <div v-else class="skills-edit">
              <div v-for="(skill, index) in profile.skills" :key="index" class="skill-edit-item">
                <q-input
                  v-model="profile.skills[index]"
                  outlined
                  dense
                  :label="`Skill ${index + 1}`"
                />
                <q-btn
                  icon="delete"
                  flat
                  round
                  size="sm"
                  color="negative"
                  @click="removeSkill(index)"
                />
              </div>
            </div>
          </div>

          <!-- Resume -->
          <div class="info-section">
            <div class="section-title">
              <q-icon name="description" />
              Resume
            </div>
            <div v-if="!editMode" class="resume-display">
              <div v-if="profile.resume" class="resume-item">
                <q-icon
                  :name="profile.resumeType === 'pdf' ? 'picture_as_pdf' : 'image'"
                  :color="profile.resumeType === 'pdf' ? 'red' : 'blue'"
                  size="md"
                />
                <a :href="profile.resume" target="_blank" class="resume-link">
                  View Resume
                </a>
              </div>
              <div v-else class="no-data">No resume uploaded</div>
            </div>
            <div v-if="editMode" class="resume-edit">
              <q-btn
                label="Upload Resume"
                icon="cloud_upload"
                flat
                color="primary"
                @click="triggerResumeUpload"
              />
              <input
                ref="resumeInput"
                type="file"
                accept=".pdf,image/*"
                hidden
                @change="handleResumeUpload"
              />
            </div>
          </div>
        </div>

        <!-- Save Button -->
        <div v-if="editMode" class="save-section">
          <q-btn
            label="Save Changes"
            color="primary"
            icon="save"
            @click="saveProfile"
            :loading="saving"
            class="save-btn"
            no-caps
          />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useQuasar } from 'quasar'
import { jobSeekerProfileService } from 'src/services/profile.service'
import { authHelpers } from 'src/services/auth.service'
import { useRouter } from 'vue-router'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const $q = useQuasar()
const router = useRouter()
const userId = authHelpers.getCurrentUser()?.id

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

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
    'streetAddress', 'summary', 'photo'
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

// Watch for dialog open to load profile
watch(isOpen, (newValue) => {
  if (newValue && userId) {
    loadProfile()
  }
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

    // Ensure arrays exist
    data.education = Array.isArray(data.education) ? data.education : []
    data.experience = Array.isArray(data.experience) ? data.experience : []
    data.skills = Array.isArray(data.skills) ? data.skills : []

    // Ensure resume type is properly set
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
    // Cancel - restore original data
    profile.value = JSON.parse(JSON.stringify(originalProfile.value))
  }
  editMode.value = !editMode.value
}

const saveProfile = async () => {
  saving.value = true
  
  try {
    const profileData = {
      ...profile.value,
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
    $q.notify({ type: 'negative', message: res.error })
    return
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

const addSkill = () => {
  profile.value.skills.push('')
}

const removeSkill = (index) => {
  profile.value.skills.splice(index, 1)
}

const openFullProfile = () => {
  isOpen.value = false
  router.push('/profile')
}
</script>

<style scoped>
.profile-sidebar-dialog {
  --dialog-width: 450px;
  z-index: 9999;
}

.profile-sidebar-card {
  width: var(--dialog-width);
  max-width: 100vw;
  height: 100vh;
  max-height: 100vh;
  overflow-y: auto;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 0;
}

/* Header */
.profile-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  position: sticky;
  top: 0;
  z-index: 2000;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  font-size: 1.5rem;
}

.title-text {
  font-size: 1.25rem;
  font-weight: 600;
}

.close-btn {
  color: white;
}

/* Profile Content */
.profile-content {
  padding: 24px;
  background: transparent;
}

/* Avatar Section */
.avatar-section {
  text-align: center;
  margin-bottom: 24px;
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.avatar-container {
  margin-bottom: 16px;
}

.profile-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 1.5rem;
  border: 4px solid white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
}

.profile-avatar:hover {
  transform: scale(1.05);
}

.avatar-initials {
  font-weight: 600;
}

.profile-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.profile-email {
  color: #6b7280;
  margin-bottom: 16px;
}

.completeness-section {
  margin-top: 16px;
}

.completeness-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.completeness-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.completeness-percentage {
  font-size: 0.875rem;
  color: #667eea;
  font-weight: 600;
}

.completeness-bar {
  border-radius: 4px;
}

.complete-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
  padding: 12px;
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  border-radius: 12px;
  border: 2px solid #22c55e;
}

.complete-text {
  font-size: 0.875rem;
  color: #166534;
  font-weight: 600;
}

/* Quick Actions */
.quick-actions {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
}

.action-btn {
  flex: 1;
  border-radius: 8px;
  font-weight: 500;
}

/* Info Sections */
.info-sections {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 24px;
}

.info-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid #f3f4f6;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

.info-item.full-width {
  grid-column: 1 / -1;
}

.info-label {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.info-value {
  color: #374151;
  font-weight: 500;
  word-break: break-word;
}

/* Skills */
.skills-display {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-chip {
  font-size: 0.75rem;
  border-radius: 12px;
}

.skills-edit {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skill-edit-item {
  display: flex;
  gap: 8px;
  align-items: center;
}

/* Resume */
.resume-display {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.resume-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.resume-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}

.resume-link:hover {
  text-decoration: underline;
}

.resume-edit {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.no-data {
  color: #9ca3af;
  font-style: italic;
  text-align: center;
  padding: 12px;
}

/* Save Section */
.save-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
}

.save-btn {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  font-weight: 600;
}

/* Responsive */
@media (max-width: 768px) {
  .profile-sidebar-card {
    width: 100vw;
    border-radius: 0;
  }
  
  .profile-content {
    padding: 16px;
  }
  
  .avatar-section,
  .info-section,
  .save-section {
    padding: 16px;
  }
}

/* Custom scrollbar */
.profile-sidebar-card::-webkit-scrollbar {
  width: 6px;
}

.profile-sidebar-card::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.profile-sidebar-card::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.profile-sidebar-card::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>