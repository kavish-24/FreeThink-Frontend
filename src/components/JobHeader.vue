<template>
  <q-card
    class="q-pa-md q-mb-md transition-all cursor-pointer job-card"
    :class="{ 'shadow-4': isHovered }"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <div class="row justify-between items-center q-col-gutter-md">
      <!-- Left: Job Info -->
      <div class="col">
        <div class="text-h5 text-bold job-title">{{ job.title }}</div>
        <div class="text-subtitle2 q-mt-xs">{{ job.company?.companyName || 'Unknown Company' }}</div>

        <div class="text-grey text-caption q-mt-xs">
          {{ job.location }} • Posted on {{ createddate }} • Apply by {{ formattedDeadline }}
        </div>

        <div class="q-mt-sm q-gutter-sm">
          <q-badge v-if="job.remote" color="green-3" text-color="black" label="Remote" />
          <q-badge color="blue" label="Full-time" />
          <q-badge color="teal" label="Technology" />
        </div>
      </div>

      <!-- Right: Actions -->
      <div class="column items-end q-mt-sm q-mt-none-md">
      <q-btn
  :label="hasApplied ? 'Applied' : 'Apply Now'"
  :color="hasApplied ? 'positive' : 'primary'"
  :icon="hasApplied ? 'check_circle' : 'send'"
  :disable="hasApplied || checkingApplication"
  :loading="checkingApplication"
  class="q-mb-sm q-px-md"
  unelevated
  rounded
  glossy
  @click="handleApplyClick"
/>

      <q-btn
        label="Message"
        color="primary"
        flat
        class="q-mb-sm q-ml-sm"
        icon="chat"
        @click="openMessageDialog"
      />

        <div class="q-gutter-sm">
          <!-- Bookmark Button -->
          <q-btn
            flat
            round
            dense
            :icon="isBookmarked ? 'bookmark' : 'bookmark_border'"
            :color="isBookmarked ? 'blue' : 'grey'"
            @click="toggleBookmark"
            :loading="loading"
          >
            <q-tooltip>{{ isBookmarked ? 'Remove Bookmark' : 'Bookmark' }}</q-tooltip>
          </q-btn>

          <!-- Share Button -->
          <q-btn flat>
            <template #default>
              <img :src="shareIcon" alt="Share" width="20" height="20" />
              <q-tooltip>Share</q-tooltip>
            </template>
          </q-btn>

          <!-- Settings Button -->
          <q-btn
            flat
            round
            dense
            icon="settings"
            color="grey"
            @click="openSettings"
          >
            <q-tooltip>Settings</q-tooltip>
          </q-btn>
        </div>
      </div>
    </div>
  </q-card>
   <q-dialog v-model="showDialog" persistent>
  <q-card style="min-width: 400px; max-width: 600px;">
    <q-card-section class="row items-center q-pb-none">
      <div class="text-h6">Apply for {{ job.title }}</div>
      <q-space />
      <q-btn icon="close" flat round dense v-close-popup />
    </q-card-section>

    <q-separator />

    <q-card-section>
      <div class="q-mb-md">
        Applying to <b>{{ job.company?.companyName }}</b>
      </div>

      <!-- Resume Upload -->
      <q-file
        filled
        v-model="resume"
        label="Upload Resume"
        accept=".pdf,.doc,.docx"
        max-file-size="5000000"
        bottom-slots
      >
        <template v-slot:hint>PDF, DOC, DOCX — Max 5MB</template>
      </q-file>

      <!-- Cover Letter Upload -->
      <q-file
        filled
        v-model="coverLetter"
        label="Upload Cover Letter"
        accept=".pdf,.doc,.docx"
        max-file-size="5000000"
        bottom-slots
        class="q-mt-md"
      >
        <template v-slot:hint>Optional</template>
      </q-file>
    </q-card-section>

    <q-separator />

    <q-card-actions align="right">
      <q-btn flat label="Cancel" color="grey" v-close-popup />
      <q-btn 
        unelevated 
        label="Submit Application" 
        color="primary" 
        :loading="submitting" 
        @click="submitApplication" 
      />
    </q-card-actions>
  </q-card>
</q-dialog>

<q-dialog v-model="showMessageDialog" persistent>
  <q-card style="min-width: 360px; max-width: 720px;">
    <q-card-section class="row items-center q-pb-none">
      <div class="text-h6">Message {{ job.title }}</div>
      <q-space />
      <q-btn icon="close" flat round dense v-close-popup @click="showMessageDialog = false" />
    </q-card-section>

    <q-separator />

    <q-card-section>
      <div class="q-mb-md">To: <b>{{ job.company?.companyName || 'Employer' }}</b></div>
      <q-input filled type="textarea" v-model="messageBody" label="Your message" autogrow />
    </q-card-section>

    <q-separator />

    <q-card-actions align="right">
      <q-btn flat label="Cancel" color="grey" v-close-popup @click="showMessageDialog = false" />
      <q-btn unelevated label="Send" color="primary" :loading="sendingMessage" @click="sendMessageToEmployer" />
    </q-card-actions>
  </q-card>
</q-dialog>

</template>

<script setup>
import { ref, toRef, computed, onMounted } from 'vue'
import api, { authHelpers } from '../services/auth.service'
import messageService from '../services/message.service'
import { bookmarkService } from '../services/bookmarkService'
import shareIcon from '../assets/share.png'
import { useQuasar } from 'quasar'
const props = defineProps({ job: Object })
const job = toRef(props, 'job')
const isHovered = ref(false)
const isBookmarked = ref(false)
const loading = ref(false)
const showDialog = ref(false)
const userId = authHelpers.getCurrentUser()?.id
const resume = ref(null)
const coverLetter = ref(null)
const submitting = ref(false)
const hasApplied = ref(false)
const checkingApplication = ref(false)
const $q = useQuasar()
const showMessageDialog = ref(false)
const messageBody = ref('')
const sendingMessage = ref(false)

const formattedDeadline = computed(() => {
  if (!job.value?.deadline) return 'Not specified'
  return new Date(job.value.deadline).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
})

const createddate = computed(() => {
  if (!job.value?.posted_at) return 'Not specified'
  return new Date(job.value.posted_at).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
})

const checkIfApplied = async () => {
  if (!userId || !job.value?.id) return
  
  try {
    checkingApplication.value = true
    const token = authHelpers.getToken() // Use authHelpers instead of direct localStorage
    const res = await api.get(`/applications/check/${job.value.id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    hasApplied.value = res.data.hasApplied
  } catch (err) {
    console.error('Error checking application status:', err)
    hasApplied.value = false
  } finally {
    checkingApplication.value = false
  }
}

const handleApplyClick = () => {
  if (hasApplied.value) {
    $q.notify({
      type: 'warning',
      message: 'You have already applied for this job'
    })
    return
  }
  showDialog.value = true
}


const submitApplication = async () => {
  if (!resume.value) {
    return $q.notify({ type: 'negative', message: 'Please upload your resume.' })
  }

  try {
    submitting.value = true
    const token = authHelpers.getToken() // Use authHelpers instead of direct localStorage
    const formData = new FormData()
    formData.append('job_id', job.value.id)
    formData.append('resume', resume.value)
    if (coverLetter.value) formData.append('coverLetter', coverLetter.value)

    const res = await api.post('/applications/apply', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    })

    $q.notify({ type: 'positive', message: res.data.message || 'Application submitted successfully ✅' })
    showDialog.value = false
    hasApplied.value = true // Update the status immediately

  } catch (err) {
    let message = 'Failed to apply'

    if (err.response) {
      // If backend returned JSON
      if (err.response.data?.message) message = err.response.data.message
      else message = JSON.stringify(err.response.data)
    } else if (err.request) {
      // No response from backend
      message = 'No response from server'
    } else {
      message = err.message
    }

    console.error('Application error:', err)  // log full error for debugging
    $q.notify({ type: 'negative', message })
  } finally {
    submitting.value = false
  }
}


const checkBookmark = async () => {
  try {
    const res = await bookmarkService.checkBookmark(userId, job.value.id)
    console.log("Bookmark check response:", res)
    isBookmarked.value = res.bookmarked
  } catch (err) {
    console.error('Error checking bookmark:', err)
  }
}

const toggleBookmark = async () => {
  loading.value = true
  try {
    if (isBookmarked.value) {
      await bookmarkService.removeBookmark(userId, job.value.id)
      isBookmarked.value = false
    } else {
      await bookmarkService.addBookmark(userId, job.value.id)
      isBookmarked.value = true
    }
  } catch (err) {
    console.error('Error toggling bookmark:', err)
  } finally {
    loading.value = false
  }
}

const openSettings = () => {
  // Add logic for settings action (e.g., open a modal or navigate to settings page)
  console.log('Settings clicked for job:', job.value.id)
  // Example: router.push('/job-settings/' + job.value.id)
}

onMounted(() => {
  checkBookmark()
  checkIfApplied()
})

const openMessageDialog = () => {
  // Prefill a polite starter message
  messageBody.value = `Hi, I'm interested in the ${job.value?.title || 'this role'}. Could you share more details?`;
  showMessageDialog.value = true
}

const sendMessageToEmployer = async () => {
  // Debug: Log the job object to see its structure
  console.log('Full job object:', job.value)
  console.log('Company object:', job.value?.company)
  
  // Try several possible fields for employer/company id
  const employerId = job.value?.company?.id || 
                    job.value?.company?.companyId || 
                    job.value?.company?.company_id || 
                    job.value?.company?.userId ||
                    job.value?.company?.user_id ||
                    job.value?.company_id || 
                    job.value?.employer_id ||
                    job.value?.employerId ||
                    job.value?.posted_by ||
                    job.value?.user_id ||
                    job.value?.userId ||
                    null
                    
  console.log('Detected employer ID:', employerId)
  
  if (!employerId) {
    // Show more detailed error with available fields
    const availableFields = Object.keys(job.value || {})
    const companyFields = Object.keys(job.value?.company || {})
    console.log('Available job fields:', availableFields)
    console.log('Available company fields:', companyFields)
    $q.notify({ 
      type: 'negative', 
      message: `Unable to determine employer to message. Available fields: ${availableFields.join(', ')}` 
    })
    return
  }

  if (!messageBody.value.trim()) {
    $q.notify({ type: 'warning', message: 'Please enter a message' })
    return
  }

  try {
    sendingMessage.value = true
    console.log('Calling messageService.createConversation with:', { employerId, jobId: job.value.id, messageBody: messageBody.value })
    // createConversation should create a conversation and optionally send the first message
    const res = await messageService.createConversation(employerId, job.value.id, messageBody.value)
    console.log('createConversation response:', res)
    
    if (res && res.success) {
      $q.notify({ type: 'positive', message: 'Message sent — conversation started.' })
      showMessageDialog.value = false
      messageBody.value = ''
      // Optionally navigate to messages page or open conversation — left commented for now
      // router.push({ name: 'JobSeekerMessages' })
    } else {
      const errMsg = res?.error || 'Failed to send message'
      const statusInfo = res?.status ? ` (Status: ${res.status})` : ''
      $q.notify({ 
        type: 'negative', 
        message: `${errMsg}${statusInfo}`,
        timeout: 5000
      })
      console.error('Backend error details:', res?.details)
    }
  } catch (err) {
    console.error('Error sending message to employer:', err)
    $q.notify({ 
      type: 'negative', 
      message: `Failed to send message: ${err.message}`,
      timeout: 5000 
    })
  } finally {
    sendingMessage.value = false
  }
}
</script>

<style scoped>
.transition-all {
  transition: box-shadow 0.3s ease, transform 0.2s ease;
}

.job-card {
  border-radius: 20px;
  border: 1px solid #e0e0e0;
}

.job-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(31, 101, 242, 0);
}

.job-title {
  color: #1565c0;
}
</style>