<template>
  <q-dialog 
    v-model="dialogVisible" 
    persistent
    @hide="onDialogHide"
    transition-show="scale"
  >
    <q-card class="profile-card">
      <q-card-section class="q-pt-md q-pb-none">
        <div class="row items-center justify-between">
          <div class="text-h6 text-weight-bold text-primary">Complete Your Profile</div>
          <q-btn flat dense round icon="close" v-close-popup />
        </div>
        <p class="text-grey-7 q-mt-xs">
          Let's build a standout profile to catch the eye of recruiters.
        </p>
      </q-card-section>

      <q-card-section class="q-py-none">
        <div class="q-mb-md">
          <q-linear-progress :value="step / 3" color="primary" rounded size="8px" animation-speed="500" />
          <div class="row justify-between text-caption text-grey-7 q-mt-xs">
            <span :class="step >= 1 ? 'text-weight-bold text-primary' : ''">Personal</span>
            <span :class="step >= 2 ? 'text-weight-bold text-primary' : ''">Background</span>
            <span :class="step >= 3 ? 'text-weight-bold text-primary' : ''">Skills</span>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <!-- Step 1: Personal Details -->
        <q-form ref="step1Form" v-show="step === 1">
          <div class="text-subtitle1 text-weight-medium text-primary q-mb-md">Step 1: Personal Details</div>
          
          <div class="column items-center q-mb-md">
            <q-avatar 
              size="120px" 
              font-size="60px" 
              color="grey-2" 
              text-color="grey-5" 
              icon="person" 
              class="cursor-pointer"
              @click="triggerFileUpload"
            >
              <img v-if="profilePicUrl" :src="profilePicUrl" alt="Profile" style="object-fit: cover;" />
              <div class="absolute-bottom text-center bg-transparent q-pa-xs">
                <q-icon name="photo_camera" color="primary" size="sm" class="bg-white rounded-borders q-pa-xs" />
              </div>
            </q-avatar>
            <div class="text-caption text-grey-6 q-mt-sm">Tap to upload a photo</div>
            <input 
              ref="fileInputRef"
              type="file"
              accept=".jpg,.jpeg,.png"
              style="display: none"
              @change="handleFileChange"
            />
          </div>

          <div class="row q-col-gutter-sm">
            <q-input v-model="profile.firstName" label="First Name" outlined class="col-12 col-sm-6" :rules="[val => !!val || 'First name is required']" lazy-rules />
            <q-input v-model="profile.lastName" label="Last Name" outlined class="col-12 col-sm-6" :rules="[val => !!val || 'Last name is required']" lazy-rules />
          </div>
          <q-input v-model="profile.email" label="Email" outlined class="q-mt-sm" type="email" :rules="[val => !!val || 'Email is required', emailRule]" lazy-rules />
          <q-input v-model="profile.phone" label="Phone Number" outlined class="q-mt-sm" type="tel" mask="##########" :rules="[val => !!val || 'Phone is required']" lazy-rules />
          <q-input v-model="profile.street" label="Street Address" outlined class="q-mt-sm" :rules="[val => !!val || 'Street is required']" lazy-rules />
          <div class="row q-col-gutter-sm q-mt-xs">
            <q-input v-model="profile.city" label="City" outlined class="col-12 col-sm-4" :rules="[val => !!val || 'City is required']" lazy-rules />
            <q-input v-model="profile.state" label="State" outlined class="col-6 col-sm-4" :rules="[val => !!val || 'State is required']" lazy-rules />
            <q-input v-model="profile.zip" label="Zip Code" outlined class="col-6 col-sm-4" :rules="[val => !!val || 'Zip is required']" lazy-rules />
          </div>
        </q-form>

        <!-- Step 2: Professional Background -->
        <q-form ref="step2Form" v-show="step === 2">
          <div class="text-subtitle1 text-weight-medium text-primary q-mb-md">Step 2: Professional Background</div>
          <q-input v-model="profile.summary" label="Professional Summary" outlined type="textarea" class="q-mb-md" autogrow :rules="[val => !!val || 'Summary is required']" lazy-rules />
          <div class="q-mb-md">
            <div class="text-subtitle2 text-weight-medium q-mb-sm">Education</div>
            <div v-for="(edu, index) in educationList" :key="index" class="q-mb-sm">
              <q-card flat bordered class="q-pa-sm"><q-card-section class="q-pa-xs"><div class="row items-center q-col-gutter-sm"><q-input v-model="edu.degree" label="Degree/Certificate" outlined dense class="col" :rules="[val => !!val || 'Required']" lazy-rules /><q-input v-model="edu.institution" label="Institution" outlined dense class="col" :rules="[val => !!val || 'Required']" lazy-rules /><q-btn flat round color="negative" icon="delete" @click="removeEducation(index)" size="sm" class="q-ml-sm" /></div></q-card-section></q-card>
            </div>
            <q-btn label="Add Education" icon="add" color="primary" outline size="sm" @click="addEducation" :disable="educationList.length >= 5" />
          </div>
          <div>
            <div class="text-subtitle2 text-weight-medium q-mb-sm">Work Experience</div>
            <div v-for="(exp, index) in experienceList" :key="index" class="q-mb-sm">
              <q-card flat bordered class="q-pa-sm"><q-card-section class="q-pa-xs"><div class="row items-center q-col-gutter-sm q-mb-sm"><q-input v-model="exp.title" label="Job Title" outlined dense class="col" :rules="[val => !!val || 'Required']" lazy-rules /><q-input v-model="exp.company" label="Company" outlined dense class="col" :rules="[val => !!val || 'Required']" lazy-rules /><q-btn flat round color="negative" icon="delete" @click="removeExperience(index)" size="sm" class="q-ml-sm" /></div><q-input v-model="exp.jobDescription" label="Job Description" outlined dense type="textarea" autogrow /></q-card-section></q-card>
            </div>
            <q-btn label="Add Experience" icon="add" color="primary" outline size="sm" @click="addExperience" :disable="experienceList.length >= 5" />
          </div>
        </q-form>

        <!-- Step 3: Skills & Resume -->
        <q-form ref="step3Form" v-show="step === 3">
          <div class="text-subtitle1 text-weight-medium text-primary q-mb-md">Step 3: Skills & Resume</div>
          <q-select ref="skillsSelectRef" @blur="addSkillOnBlur" v-model="profile.skills" label="Skills and Expertise" outlined multiple use-chips use-input @new-value="createSkill" hint="Type a skill and press Enter or click away." :rules="[val => val.length > 0 || 'At least one skill is required']" lazy-rules />
          <q-uploader label="Upload Resume (.pdf, .doc, .docx)" @added="onResumeAdded" accept=".pdf,.doc,.docx" max-files="1" flat bordered color="primary" class="full-width q-mt-md">
            <template v-slot:list="scope"><q-list separator><q-item v-if="scope.files.length > 0"><q-item-section><q-item-label class="full-width ellipsis">{{ scope.files[0].name }}</q-item-label><q-item-label caption>{{ scope.files[0].__sizeLabel }}</q-item-label></q-item-section><q-item-section top side><q-btn class="gt-xs" size="12px" flat dense round icon="delete" @click="scope.removeFile(scope.files[0])" /></q-item-section></q-item></q-list></template>
          </q-uploader>
        </q-form>
      </q-card-section>

      <q-card-actions align="right" class="q-px-md q-pb-md">
        <q-btn v-if="step > 1" label="Back" flat color="primary" @click="step--" icon="arrow_back" />
        <q-space />
        <q-btn v-if="step < 3" label="Next" color="primary" @click="goToNextStep" icon-right="arrow_forward" />
        <q-btn v-if="step === 3" label="Submit Profile" color="positive" @click="submitProfile" icon="check_circle" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch} from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { jobSeekerProfileService } from 'src/services/profile.service'
import { authHelpers } from 'src/services/auth.service'

const props = defineProps({
  modelValue: Boolean
})
const emit = defineEmits(['update:modelValue'])
const $q = useQuasar()
const router = useRouter()

const emailRule = val => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val) || 'Invalid email format'
const step = ref(1)
const dialogVisible = ref(props.modelValue)
const step1Form = ref(null)
const step2Form = ref(null)
const step3Form = ref(null)
const skillsSelectRef = ref(null)
const fileInputRef = ref(null) 

const profilePicUrl = ref('')
const submissionSuccess = ref(false) // Flag to control actions after closing

watch(() => props.modelValue, val => {
  dialogVisible.value = val
  if (val) {
    resetForm()
    step.value = 1
    loadExistingProfile()
  }
})

watch(dialogVisible, (newValue) => {
  emit('update:modelValue', newValue)
})

// START: NEW SUBMIT LOGIC
// This function now ONLY runs after the dialog has successfully hidden.
function onDialogHide() {
  // Only act if the dialog was closed via a successful submission
  if (submissionSuccess.value) {
    $q.notify({
      icon: 'check_circle',
      color: 'positive',
      message: 'Profile Submitted Successfully!',
      position: 'top'
    });
    router.push({ name: 'JobSeekerDashboard' });
    
    // Reset the flag for the next time the dialog opens
    submissionSuccess.value = false;
  }
}

// This function is now very simple.
function submitProfile() {
  // Check for missing required fields
  const hasSkills = profile.value.skills && profile.value.skills.length > 0;
  const hasResume = profile.value.resume !== null;

  if (!hasSkills || !hasResume) {
    $q.notify({
      type: 'negative',
      message: !hasSkills && !hasResume
        ? 'Please add at least one skill and upload your resume.'
        : !hasSkills
        ? 'Please add at least one skill.'
        : 'Please upload your resume.',
      position: 'top',
      icon: 'error'
    });
    return; // Stop here, do not close modal
  }

  // Close the modal
  dialogVisible.value = false;
  submissionSuccess.value = true; // flag used in `onDialogHide()` to proceed with routing + notify
}

// END: NEW SUBMIT LOGIC

const profile = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  street: '',
  city: '',
  state: '',
  zip: '',
  summary: '',
  skills: [],
  resume: null,
  profilePic: null 
})

const educationList = ref([])
const experienceList = ref([])

function triggerFileUpload() {
  fileInputRef.value.click();
}

function handleFileChange(event) {
  const files = event.target.files;
  if (files && files[0]) {
    profile.value.profilePic = files[0];
    const reader = new FileReader();
    reader.onload = e => {
      profilePicUrl.value = e.target.result;
    };
    reader.readAsDataURL(files[0]);
  }
}

function addEducation() {
  if (educationList.value.length < 5) {
    educationList.value.push({ id: Date.now(), degree: '', institution: '' })
  }
}

function removeEducation(index) {
  educationList.value.splice(index, 1)
}

function addExperience() {
  if (experienceList.value.length < 5) {
    experienceList.value.push({ id: Date.now(), title: '', company: '', jobDescription: '' })
  }
}

function removeExperience(index) {
  experienceList.value.splice(index, 1)
}

function createSkill(val, done) {
  if (val.length > 0) {
    done(val, 'add-unique')
  }
}

function addSkillOnBlur() {
  const skillsInput = skillsSelectRef.value;
  if (skillsInput && skillsInput.inputValue.trim()) {
    const newValue = skillsInput.inputValue.trim();
    if (!profile.value.skills.includes(newValue)) {
      profile.value.skills.push(newValue);
    }
    skillsInput.updateInputValue('', true);
  }
}

function onResumeAdded(files) {
  profile.value.resume = files[0] || null
}

async function goToNextStep() {
  if (step.value === 1) {
    const success = await step1Form.value.validate()
    if (success) step.value = 2
  } else if (step.value === 2) {
    const success = await step2Form.value.validate()
    const isEduFilled = educationList.value.length > 0
    const isExpFilled = experienceList.value.length > 0
    if (!isEduFilled) $q.notify({ type: 'negative', message: 'Please add at least one education entry.' })
    if (!isExpFilled) $q.notify({ type: 'negative', message: 'Please add at least one experience entry.' })
    if (success && isEduFilled && isExpFilled) {
      step.value = 3
    }
  }
}

function resetForm() {
  profile.value = {
    firstName: '', lastName: '', email: '', phone: '',
    street: '', city: '', state: '', zip: '',
    summary: '', skills: [], resume: null, profilePic: null
  }
  profilePicUrl.value = ''
  educationList.value = []
  experienceList.value = []
  addEducation();
  addExperience();
}

async function loadExistingProfile() {
  try {
    const user = authHelpers.getCurrentUser()
    const userId = user?.id
    if (!userId) return

    const res = await jobSeekerProfileService.getProfile(userId)
    if (!res.success || !res.data) return

    const data = res.data || {}

    // Personal details
    profile.value.firstName = data.firstName || ''
    profile.value.lastName = data.lastName || ''
    profile.value.email = data.email || ''
    profile.value.phone = data.phoneNumber || data.phone || ''
    profile.value.street = data.streetAddress || ''
    profile.value.city = data.city || ''
    profile.value.state = data.state || ''
    profile.value.zip = data.zipcode || ''
    profile.value.summary = data.summary || ''
    profile.value.skills = Array.isArray(data.skills) ? data.skills : []

    // Profile picture preview if exists
    if (data.photo) {
      profilePicUrl.value = data.photo
    }

    // Education mapping
    const eduArr = Array.isArray(data.education) ? data.education : []
    educationList.value = eduArr.map(e => ({
      id: Date.now() + Math.random(),
      degree: e.degree || e.degree_type || '',
      institution: e.school || e.institution || ''
    }))
    if (educationList.value.length === 0) addEducation()

    // Experience mapping
    const expArr = Array.isArray(data.experience) ? data.experience : []
    experienceList.value = expArr.map(e => ({
      id: Date.now() + Math.random(),
      title: e.title || e.job_title || '',
      company: e.company || e.company_name || '',
      jobDescription: e.description || e.jobDescription || ''
    }))
    if (experienceList.value.length === 0) addExperience()
  } catch (err) {
    // Silent fail to avoid disrupting UX
    console.error('Failed to autofill profile:', err)
  }
}
</script>

<style scoped>
.profile-card {
  width: 100%;
  max-width: 640px;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(47, 128, 237, 0.2); /* blue glow */
  background: linear-gradient(to bottom right, #f9fbff, #eef3fb);
  border: 1px solid #d0e2ff;
}

/* For Avatar hover */
.q-avatar:hover {
  box-shadow: 0 0 0 4px rgba(47, 128, 237, 0.2);
  transition: box-shadow 0.3s ease;
}

/* Step Titles */
.text-subtitle1 {
  font-size: 1.25rem;
  color: #2F80ED;
}

/* Step Tracker Text */
.text-caption span {
  transition: color 0.3s ease, font-weight 0.3s ease;
}

/* Progress bar */
.q-linear-progress {
  background-color: #d8eafe;
}

.q-linear-progress__track {
  background-color: #d8eafe;
}

/* Button Hover Effects */
.q-btn:hover {
  filter: brightness(1.05);
}

/* Skill Chips */
.q-chip {
  background-color: #e3f0ff;
  color: #2F80ED;
  font-weight: 500;
}

/* Resume uploader style */
.q-uploader {
  border: 1px dashed #2F80ED;
  background-color: #f5faff;
}

/* Cards inside form (Education & Experience) */
.q-card[flat][bordered] {
  border: 1px solid #c9defa;
  background-color: #f9fbff;
  border-radius: 8px;
}

</style>