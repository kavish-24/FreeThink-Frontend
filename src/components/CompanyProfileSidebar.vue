<template>
  <div>
    <q-dialog 
      v-model="isOpen" 
      position="right" 
      :maximized="$q.screen.xs"
      class="company-profile-sidebar-dialog"
    >
    <q-card class="company-profile-sidebar-card">
      <!-- Header -->
      <q-card-section class="company-profile-header">
        <div class="header-content">
          <div class="header-title">
            <q-icon name="business" class="header-icon" />
            <span class="title-text">Company Profile</span>
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
      <q-card-section class="company-profile-content">
        <q-inner-loading :showing="loading">
          <q-spinner-gears size="50px" color="primary" />
        </q-inner-loading>

        <!-- Company Logo & Info Section -->
        <div class="company-header-section">
          <div class="logo-container">
            <q-avatar
              size="100px"
              class="company-logo"
              @click="editMode && triggerLogoUpload()"
              :class="{ 'cursor-pointer': editMode }"
            >
              <img v-if="companyProfile.logo" :src="companyProfile.logo" />
              <q-icon v-else name="business" size="50px" color="white" />
            </q-avatar>
            <input
              type="file"
              ref="logoInput"
              accept="image/*"
              @change="handleLogoUpload"
              hidden
            />
          </div>
          <div class="company-name">{{ companyProfile.companyName || 'Company Name' }}</div>
          <div class="company-industry" v-if="companyProfile.industry">
            <q-chip dense color="secondary" text-color="white" icon="category">
              {{ companyProfile.industry }}
            </q-chip>
          </div>
          
          <!-- Profile Completeness -->
          <div class="completeness-section">
            <div class="completeness-header">
              <span class="completeness-label">Profile Completeness</span>
              <span class="completeness-percentage">{{ Math.round(profileCompleteness * 100) }}%</span>
            </div>
            <q-linear-progress
              :value="profileCompleteness"
              color="secondary"
              track-color="grey-3"
              size="8px"
              rounded
              class="completeness-bar"
            />
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="quick-actions">
          <q-btn
            flat
            icon="edit"
            :label="editMode ? 'Cancel' : 'Edit Profile'"
            color="secondary"
            class="action-btn"
            @click="toggleEditMode"
          />
          <q-btn
            flat
            icon="visibility"
            label="Full View"
            color="primary"
            class="action-btn"
            @click="openFullProfile"
          />
        </div>

        <!-- Profile Information -->
        <div class="info-sections">
          <!-- Company Details -->
          <div class="info-section">
            <div class="section-title">
              <q-icon name="business_center" />
              Company Details
            </div>
            <div class="info-grid">
              <div class="info-item">
                <q-input
                  v-if="editMode"
                  v-model="companyProfile.companyName"
                  label="Company Name"
                  outlined
                  dense
                />
                <div v-else>
                  <div class="info-label">Company Name</div>
                  <div class="info-value">{{ companyProfile.companyName || 'Not provided' }}</div>
                </div>
              </div>

              <div class="info-item">
                <q-select
                  v-if="editMode"
                  v-model="companyProfile.industry"
                  :options="industries"
                  label="Industry"
                  outlined
                  dense
                />
                <div v-else>
                  <div class="info-label">Industry</div>
                  <div class="info-value">{{ companyProfile.industry || 'Not provided' }}</div>
                </div>
              </div>

              <div class="info-item">
                <q-input
                  v-if="editMode"
                  v-model="companyProfile.website"
                  label="Website"
                  outlined
                  dense
                  type="url"
                />
                <div v-else>
                  <div class="info-label">Website</div>
                  <div class="info-value">
                    <a v-if="companyProfile.website" :href="companyProfile.website" target="_blank" class="website-link">
                      {{ companyProfile.website }}
                    </a>
                    <span v-else>Not provided</span>
                  </div>
                </div>
              </div>

              <div class="info-item">
                <q-select
                  v-if="editMode"
                  v-model="companyProfile.companySize"
                  :options="companySizes"
                  label="Company Size"
                  outlined
                  dense
                />
                <div v-else>
                  <div class="info-label">Company Size</div>
                  <div class="info-value">{{ companyProfile.companySize || 'Not provided' }}</div>
                </div>
              </div>

              <div class="info-item full-width">
                <q-input
                  v-if="editMode"
                  v-model="companyProfile.description"
                  type="textarea"
                  label="Company Description"
                  outlined
                  dense
                  autogrow
                  :rows="3"
                />
                <div v-else>
                  <div class="info-label">About Company</div>
                  <div class="info-value">{{ companyProfile.description || 'Not provided' }}</div>
                </div>
              </div>

              <div class="info-item full-width">
                <q-input
                  v-if="editMode"
                  v-model="companyProfile.positionsAvailable"
                  label="Positions Available (comma-separated)"
                  outlined
                  dense
                  hint="e.g., Software Engineer, Product Manager, Designer"
                />
                <div v-else>
                  <div class="info-label">Positions Available</div>
                  <div class="info-value" v-if="companyProfile.positionsAvailableArray && companyProfile.positionsAvailableArray.length">
                    <div class="positions-chips">
                      <q-chip
                        v-for="(position, index) in companyProfile.positionsAvailableArray.slice(0, 4)"
                        :key="index"
                        color="primary"
                        text-color="white"
                        dense
                        icon="work"
                      >
                        {{ position }}
                      </q-chip>
                      <q-chip
                        v-if="companyProfile.positionsAvailableArray.length > 4"
                        color="secondary"
                        text-color="white"
                        dense
                        clickable
                        icon="more_horiz"
                        @click="showAllPositions = true"
                      >
                        +{{ companyProfile.positionsAvailableArray.length - 4 }} more
                      </q-chip>
                    </div>
                  </div>
                  <div v-else class="info-value">Not provided</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Contact Information -->
          <div class="info-section">
            <div class="section-title">
              <q-icon name="contact_phone" />
              Contact Information
            </div>
            <div class="info-grid">
              <div class="info-item">
                <q-input
                  v-if="editMode"
                  v-model="companyProfile.contactEmail"
                  label="Contact Email"
                  outlined
                  dense
                  type="email"
                />
                <div v-else>
                  <div class="info-label">Contact Email</div>
                  <div class="info-value">{{ companyProfile.contactEmail || 'Not provided' }}</div>
                </div>
              </div>

              <div class="info-item">
                <q-input
                  v-if="editMode"
                  v-model="companyProfile.contactPhone"
                  label="Contact Phone"
                  outlined
                  dense
                />
                <div v-else>
                  <div class="info-label">Contact Phone</div>
                  <div class="info-value">{{ companyProfile.contactPhone || 'Not provided' }}</div>
                </div>
              </div>

              <div class="info-item full-width">
                <q-input
                  v-if="editMode"
                  v-model="companyProfile.address"
                  label="Address"
                  outlined
                  dense
                />
                <div v-else>
                  <div class="info-label">Address</div>
                  <div class="info-value">{{ companyProfile.address || 'Not provided' }}</div>
                </div>
              </div>

              <div class="info-item">
                <q-input
                  v-if="editMode"
                  v-model="companyProfile.city"
                  label="City"
                  outlined
                  dense
                />
                <div v-else>
                  <div class="info-label">City</div>
                  <div class="info-value">{{ companyProfile.city || 'Not provided' }}</div>
                </div>
              </div>

              <div class="info-item">
                <q-input
                  v-if="editMode"
                  v-model="companyProfile.state"
                  label="State"
                  outlined
                  dense
                />
                <div v-else>
                  <div class="info-label">State</div>
                  <div class="info-value">{{ companyProfile.state || 'Not provided' }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Social Media Links -->
          <div class="info-section">
            <div class="section-title">
              <q-icon name="public" />
              Social Media
            </div>
            <div class="social-links">
              <div class="social-item">
                <q-input
                  v-if="editMode"
                  v-model="companyProfile.linkedIn"
                  label="LinkedIn"
                  outlined
                  dense
                  prefix="linkedin.com/company/"
                />
                <div v-else-if="companyProfile.linkedIn" class="social-link">
                  <q-icon name="fab fa-linkedin" color="blue-7" size="sm" />
                  <a :href="getFullUrl(companyProfile.linkedIn, 'linkedin')" target="_blank">
                    LinkedIn Profile
                  </a>
                </div>
                <div v-else class="no-data">LinkedIn not provided</div>
              </div>

              <div class="social-item">
                <q-input
                  v-if="editMode"
                  v-model="companyProfile.twitter"
                  label="Twitter/X"
                  outlined
                  dense
                  prefix="twitter.com/"
                />
                <div v-else-if="companyProfile.twitter" class="social-link">
                  <q-icon name="fab fa-twitter" color="blue-5" size="sm" />
                  <a :href="getFullUrl(companyProfile.twitter, 'twitter')" target="_blank">
                    Twitter Profile
                  </a>
                </div>
                <div v-else class="no-data">Twitter not provided</div>
              </div>
            </div>
          </div>

          <!-- Company Stats -->
          <div class="info-section">
            <div class="section-title">
              <q-icon name="bar_chart" />
              Company Statistics
            </div>
            <div class="stats-grid">
              <div class="stat-card">
                <q-icon name="work_outline" size="md" color="primary" />
                <div class="stat-value">{{ companyProfile.activeJobs || 0 }}</div>
                <div class="stat-label">Active Jobs</div>
              </div>
              <div class="stat-card">
                <q-icon name="people_outline" size="md" color="secondary" />
                <div class="stat-value">{{ companyProfile.totalApplications || 0 }}</div>
                <div class="stat-label">Total Applications</div>
              </div>
              <div class="stat-card">
                <q-icon name="verified" size="md" color="green" />
                <div class="stat-value">{{ companyProfile.isVerified ? 'Yes' : 'No' }}</div>
                <div class="stat-label">Verified</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Save Button -->
        <div v-if="editMode" class="save-section">
          <q-btn
            label="Save Changes"
            color="secondary"
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

  <!-- All Positions Dialog -->
  <q-dialog v-model="showAllPositions">
    <q-card style="min-width: 400px; max-width: 600px;">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">All Available Positions</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <div class="positions-grid">
          <q-chip
            v-for="(position, index) in companyProfile.positionsAvailableArray"
            :key="index"
            color="primary"
            text-color="white"
            icon="work"
            size="md"
          >
            {{ position }}
          </q-chip>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Close" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useQuasar } from 'quasar'
import { authHelpers } from 'src/services/auth.service'
import { useRouter } from 'vue-router'
import api from '../services/auth.service'

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

const companyProfile = ref({
  companyName: '',
  industry: '',
  description: '',
  website: '',
  companySize: '',
  contactEmail: '',
  contactPhone: '',
  address: '',
  city: '',
  state: '',
  logo: null,
  linkedIn: '',
  twitter: '',
  positionsAvailable: '',
  positionsAvailableArray: [],
  activeJobs: 0,
  totalApplications: 0,
  isVerified: false
})

const industries = [
  'Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing',
  'Retail', 'Real Estate', 'Hospitality', 'Transportation', 'Energy',
  'Construction', 'Media', 'Telecommunications', 'Agriculture', 'Other'
]

const companySizes = [
  '1-10 employees',
  '11-50 employees',
  '51-200 employees',
  '201-500 employees',
  '501-1000 employees',
  '1000+ employees'
]

const editMode = ref(false)
const saving = ref(false)
const loading = ref(false)
const logoInput = ref(null)
const originalProfile = ref(null)
const showAllPositions = ref(false)

const profileCompleteness = computed(() => {
  const fields = [
    'companyName', 'industry', 'description', 'website', 'companySize',
    'contactEmail', 'contactPhone', 'address', 'city', 'state', 'logo'
  ]
  
  let completed = 0
  fields.forEach(field => {
    if (companyProfile.value[field]) completed++
  })
  
  if (companyProfile.value.linkedIn) completed++
  if (companyProfile.value.twitter) completed++
  
  return completed / (fields.length + 2)
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
    // Fetch company profile
    const res = await api.get(`/company/${userId}`)
    
    if (res.data) {
      // Parse positions available
      const positionsArray = Array.isArray(res.data.positionsAvailable) 
        ? res.data.positionsAvailable 
        : []
      
      // Map the backend data to our component structure
      companyProfile.value = {
        companyName: res.data.companyName || '',
        industry: res.data.industry || '',
        description: res.data.description || '',
        website: res.data.website || '',
        companySize: res.data.numberOfEmployees || '',
        contactEmail: res.data.user?.email || '',
        contactPhone: res.data.contactNumber || '',
        address: res.data.location || '',
        city: '', // Extract from location if needed
        state: '', // Extract from location if needed
        logo: res.data.logo || null,
        linkedIn: '', // Add if available in backend
        twitter: '', // Add if available in backend
        positionsAvailable: positionsArray.join(', '),
        positionsAvailableArray: positionsArray,
        activeJobs: 0,
        totalApplications: 0,
        isVerified: res.data.user?.status === 'approved'
      }
      
      // Fetch active jobs count
      try {
        const jobsRes = await api.get(`/jobs/jobs/company/${userId}`)
        if (jobsRes.data && jobsRes.data.jobs && Array.isArray(jobsRes.data.jobs)) {
          // Count only active/open jobs
          companyProfile.value.activeJobs = jobsRes.data.jobs.filter(job => 
            job.status === 'open' || job.status === 'active'
          ).length
        }
      } catch (err) {
        console.error('Error fetching jobs:', err)
      }
      
      // Fetch total applications count
      try {
        const applicationsRes = await api.get(`/applications/company-candidates/${userId}`)
        if (applicationsRes.data) {
          companyProfile.value.totalApplications = Array.isArray(applicationsRes.data) 
            ? applicationsRes.data.length 
            : applicationsRes.data.total || 0
        }
      } catch (err) {
        console.error('Error fetching applications:', err)
      }
      
      originalProfile.value = JSON.parse(JSON.stringify(companyProfile.value))
    }
  } catch (error) {
    console.error('Error loading company profile:', error)
    $q.notify({ 
      type: 'negative', 
      message: 'Failed to load company profile' 
    })
  } finally {
    loading.value = false
  }
}

const toggleEditMode = () => {
  if (editMode.value) {
    // Cancel - restore original data
    companyProfile.value = JSON.parse(JSON.stringify(originalProfile.value))
  }
  editMode.value = !editMode.value
}

const saveProfile = async () => {
  saving.value = true
  
  try {
    // Parse positions available
    const positionsArray = companyProfile.value.positionsAvailable
      ? companyProfile.value.positionsAvailable.split(',').map(p => p.trim()).filter(Boolean)
      : []
    
    // Prepare payload matching backend structure
    const payload = {
      companyName: companyProfile.value.companyName?.trim(),
      contactNumber: companyProfile.value.contactPhone?.trim(),
      website: companyProfile.value.website?.trim(),
      description: companyProfile.value.description?.trim(),
      industry: companyProfile.value.industry?.trim(),
      location: companyProfile.value.address?.trim(),
      numberOfEmployees: companyProfile.value.companySize 
        ? parseInt(companyProfile.value.companySize, 10) || null
        : null,
      positionsAvailable: positionsArray
    }

    const res = await api.put(`/companies/${userId}`, payload)

    if (res.data.success) {
      $q.notify({ 
        type: 'positive', 
        message: 'Company profile saved successfully' 
      })
      editMode.value = false
      originalProfile.value = JSON.parse(JSON.stringify(companyProfile.value))
      // Reload to get fresh data
      await loadProfile()
    } else {
      $q.notify({ 
        type: 'negative', 
        message: res.data.message || 'Failed to save company profile' 
      })
    }
  } catch (error) {
    console.error('Error saving company profile:', error)
    $q.notify({ 
      type: 'negative', 
      message: error.response?.data?.message || 'Failed to save company profile' 
    })
  } finally {
    saving.value = false
  }
}

const triggerLogoUpload = () => {
  if (editMode.value) {
    logoInput.value?.click()
  }
}

const handleLogoUpload = async (event) => {
  const file = event.target.files[0]
  if (!file || !file.type.startsWith('image/')) {
    $q.notify({ type: 'negative', message: 'Please select a valid image file' })
    return
  }

  if (file.size > 5 * 1024 * 1024) {
    $q.notify({ type: 'negative', message: 'File size must be less than 5MB' })
    return
  }

  const formData = new FormData()
  formData.append('photo', file)

  try {
    const res = await api.post(`/companies/photo/${userId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    if (res.data?.url) {
      companyProfile.value.logo = res.data.url
      $q.notify({ type: 'positive', message: 'Logo uploaded successfully' })
    }
  } catch (error) {
    console.error('Error uploading logo:', error)
    $q.notify({ 
      type: 'negative', 
      message: error.response?.data?.error || 'Failed to upload logo' 
    })
  }
  
  event.target.value = ''
}

const getFullUrl = (url, type) => {
  if (!url) return ''
  if (url.startsWith('http')) return url
  
  const prefixes = {
    linkedin: 'https://linkedin.com/company/',
    twitter: 'https://twitter.com/'
  }
  
  return prefixes[type] + url
}

const openFullProfile = () => {
  isOpen.value = false
  router.push('/company-profile')
}
</script>

<style scoped>
.company-profile-sidebar-dialog {
  --dialog-width: 480px;
  z-index: 9999;
}

.company-profile-sidebar-card {
  width: var(--dialog-width);
  max-width: 100vw;
  height: 100vh;
  max-height: 100vh;
  overflow-y: auto;
  background: linear-gradient(135deg, #f8fafc 0%, #e8eef5 100%);
  border-radius: 0;
}

/* Header */
.company-profile-header {
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  color: white;
  padding: 20px;
  position: sticky;
  top: 0;
  z-index: 2000;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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
.company-profile-content {
  padding: 24px;
  background: transparent;
}

/* Company Header Section */
.company-header-section {
  text-align: center;
  margin-bottom: 24px;
  background: white;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.logo-container {
  margin-bottom: 20px;
}

.company-logo {
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  color: white;
  border: 5px solid white;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
}

.company-logo:hover {
  transform: scale(1.05);
}

.company-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
}

.company-industry {
  margin-bottom: 16px;
}

.completeness-section {
  margin-top: 20px;
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
  color: #3b82f6;
  font-weight: 700;
}

.completeness-bar {
  border-radius: 4px;
}

/* Quick Actions */
.quick-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 24px;
}

.action-btn {
  flex: 1;
  border-radius: 10px;
  font-weight: 600;
  padding: 10px 16px;
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
  border-radius: 14px;
  padding: 22px;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.06);
  border: 1px solid #e5e7eb;
  transition: box-shadow 0.3s ease;
}

.info-section:hover {
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.1);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.05rem;
  font-weight: 700;
  color: #374151;
  margin-bottom: 18px;
  padding-bottom: 10px;
  border-bottom: 2px solid #e5e7eb;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 18px;
}

.info-item.full-width {
  grid-column: 1 / -1;
}

.info-label {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 600;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.info-value {
  color: #374151;
  font-weight: 500;
  word-break: break-word;
  line-height: 1.5;
}

.website-link {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
}

.website-link:hover {
  text-decoration: underline;
}

/* Positions Chips */
.positions-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
}

/* Positions Grid - for dialog */
.positions-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 8px 0;
}

/* Social Links */
.social-links {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.social-item {
  display: flex;
  flex-direction: column;
}

.social-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.social-link a {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
}

.social-link a:hover {
  text-decoration: underline;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 8px 0 4px 0;
}

.stat-label {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
  text-align: center;
}

.no-data {
  color: #9ca3af;
  font-style: italic;
  text-align: center;
  padding: 12px;
  font-size: 0.875rem;
}

/* Save Section */
.save-section {
  background: white;
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.06);
  border: 1px solid #e5e7eb;
}

.save-btn {
  width: 100%;
  padding: 14px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 1rem;
}

/* Responsive */
@media (max-width: 768px) {
  .company-profile-sidebar-card {
    width: 100vw;
    border-radius: 0;
  }
  
  .company-profile-content {
    padding: 16px;
  }
  
  .company-header-section,
  .info-section,
  .save-section {
    padding: 18px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}

/* Custom scrollbar */
.company-profile-sidebar-card::-webkit-scrollbar {
  width: 7px;
}

.company-profile-sidebar-card::-webkit-scrollbar-track {
  background: #e2e8f0;
}

.company-profile-sidebar-card::-webkit-scrollbar-thumb {
  background: #94a3b8;
  border-radius: 4px;
}

.company-profile-sidebar-card::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}
</style>
