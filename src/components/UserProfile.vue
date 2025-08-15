<template>
  <div class="q-pa-md bg-grey-1 full-height">
    <!-- Header -->
    <q-card class="q-pa-md header-card q-mb-lg">
      <div class="row justify-between items-center">
        <h4 class="q-mt-none q-mb-none text-primary">My Profile</h4>
        <q-btn
          flat
          icon="edit"
          :label="editMode ? 'Cancel' : 'Edit Profile'"
          class="edit-btn"
          @click="editMode = !editMode"
        />
      </div>
    </q-card>

    <!-- Avatar Card -->
    <div class="row justify-center">
      <q-card class="avatar-card q-pa-md" style="width: 420px;">
        <div class="column items-center q-gutter-sm">
          <q-avatar
            size="80px"
            class="bg-primary text-white cursor-pointer"
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
          <div class="text-subtitle2 q-mt-sm">{{ fullName }}</div>
          <div class="text-caption text-grey-7">{{ profile.email }}</div>
        </div>

        <div class="q-mt-md full-width">
          <div class="text-caption text-grey-6">Profile Completeness</div>
          <q-linear-progress
            :value="0.85"
            color="primary"
            track-color="grey-3"
            size="10px"
            rounded
            class="q-mt-xs"
          />
          <div class="text-right text-caption q-mt-xs">85%</div>
        </div>
      </q-card>
    </div>

    <!-- Info Card -->
    <q-card class="info-card q-pa-md q-mt-lg">
      <div class="section-title">Profile Information</div>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-6">
          <q-input v-if="editMode" v-model="profile.firstName" label="First Name" outlined dense />
          <div v-else><span class="label">First Name:</span> {{ profile.firstName }}</div>

          <q-input v-if="editMode" v-model="profile.email" label="Email" outlined dense />
          <div v-else><span class="label">Email:</span> {{ profile.email }}</div>

          <q-input v-if="editMode" v-model="profile.streetAddress" label="Street Address" outlined dense />
          <div v-else><span class="label">Address:</span> {{ profile.streetAddress }}</div>
        </div>

        <div class="col-12 col-md-6">
          <q-input v-if="editMode" v-model="profile.lastName" label="Last Name" outlined dense />
          <div v-else><span class="label">Last Name:</span> {{ profile.lastName }}</div>

          <q-input v-if="editMode" v-model="profile.phoneNumber" label="Phone Number" outlined dense />
          <div v-else><span class="label">Phone Number:</span> {{ profile.phoneNumber }}</div>

          <q-input v-if="editMode" v-model="profile.zipcode" label="Zip Code" outlined dense />
          <div v-else><span class="label">Zip Code:</span> {{ profile.zipcode }}</div>
        </div>
      </div>
    </q-card>

    <!-- Professional Background -->
    <q-card class="info-card q-pa-md q-mb-lg">
      <div class="section-title">Professional Background</div>

      <div class="q-mb-md">
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
          <div class="label">Professional Summary</div>
          <div class="text-grey-7">{{ profile.summary }}</div>
        </div>
      </div>
 <div class="q-mb-md">
        <q-input
          v-if="editMode"
          v-model="profile.title"
          type="textarea"
          label="Professional title"
          outlined
          dense
          autogrow
        />
        <div v-else>
          <div class="label">Title</div>
          <div class="text-grey-7">{{ profile.title  }}</div>
        </div>
      </div>
       <div class="q-mb-md">
        <q-input
          v-if="editMode"
          v-model="profile.experienceYears"
          type="textarea"
          label="Professional title"
          outlined
          dense
          autogrow
        />
        <div v-else>
          <div class="label">Experience</div>
          <div class="text-grey-7">{{ profile.experienceYears  }}</div>
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
      @click="profile.education.push({ school: '', degree: '', field: '', start_date: '', end_date: '' })  "
      size="sm"
      color="primary"
    />
  </div>

  <div v-for="(edu, index) in profile.education" :key="index" class="q-mb-md">
  <div v-if="!editMode" class="text-grey-7">
  {{ edu.degree }} – {{ edu.school }}<br />
  <span class="text-caption">{{ edu.field }}</span><br />
  <span class="text-caption text-grey">
    {{ formatMonthYear(edu.start_date) }} to {{ formatMonthYear(edu.end_date) }}
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
         @click="profile.education.splice(index, 1)"
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
      @click="profile.experience.push({ title: '', company: '', description: '', start_date: '', end_date: '' })  "
      size="sm"
      color="primary"
    />
  </div>

  <div v-for="(exp, index) in profile.experience" :key="index" class="q-mb-md">
   <div v-if="!editMode" class="text-grey-7">
  {{ exp.title }} at {{ exp.company }}<br />
  <div class="text-caption text-grey">{{ exp.description }}</div>
  <span class="text-caption text-grey">
    {{ formatMonthYear(exp.start_date) }} to {{ formatMonthYear(exp.end_date) }}
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
       @click="profile.experience.splice(index, 1)"
        size="sm"
      />
      <q-separator spaced />
    </div>
  </div>
  
</div>

</div>

    </q-card>

    <!-- Skills & Resume -->
    <q-card class="info-card q-pa-md q-mb-lg">
      <div class="section-title">Skills & Resume</div>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-6">
          <div class="label">Skills</div>
          <div v-if="!editMode">
            <q-chip
              v-for="skill in profile.skills"
              :key="skill"
              color="blue-1"
              text-color="primary"
              class="q-mr-sm q-mb-sm"
              dense
            >
              {{ skill }}
            </q-chip>
          </div>
          <div v-else>
            <q-input
              v-for="(skill, index) in profile.skills"
              :key="index"
              v-model="profile.skills[index]"
              outlined dense class="q-mb-sm"
              :label="`Skill ${index + 1}`"
            />
            <q-btn flat icon="add" label="Add Skill" @click="profile.skills.push('')" />
          </div>
        </div>

       <div class="col-12 col-md-6">
  <div class="label q-mb-sm">Resume</div>

  <!-- View mode preview -->
  <q-img
    v-if="!editMode && profile.resumeType === 'image'"
    :src="profile.resume"
    contain
    style="max-height: 200px; border-radius: 8px;"
  />
  <div v-else-if="!editMode" class="resume-link row items-center">
    <q-icon name="picture_as_pdf" color="red" size="40px" />
    <a :href="profile.resume" target="_blank" class="text-primary q-ml-sm">
      View Resume (PDF)
    </a>
  </div>

  <!-- Edit mode upload button -->
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
      Accepted: PDF or image formats (UI only, no upload yet)
    </div>
  </div>
</div>

      </div>
    </q-card>

    <q-btn
      v-if="editMode"
      label="Save Changes"
      color="primary"
      class="q-mt-md"
      icon="save"
      @click="saveProfile"
    />
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { jobSeekerProfileService } from 'src/services/profile.service'
import { authHelpers } from 'src/services/auth.service'

const $q = useQuasar()
const userId = authHelpers.getCurrentUser()?.id

const profile = ref({
  firstName: '', lastName: '', email: '', phoneNumber: '',title: '',
  streetAddress: '', zipcode: '', summary: '',
  photo: null, resume: '', resumeType: 'pdf',
  experienceYears: 0, skills: [], education: [], experience: []
})

const editMode = ref(false)
const fileInput = ref(null)

const fullName = computed(() => `${profile.value.firstName} ${profile.value.lastName}`)
const initials = computed(() => profile.value.firstName?.charAt(0) + profile.value.lastName?.charAt(0))

onMounted(async () => {
  const res = await jobSeekerProfileService.getProfile(userId)

  if (!res.success) {
    $q.notify({ type: 'negative', message: res.error })
    return
  }

  const data = res.data

  // Format date fields
  if (Array.isArray(data.education)) {
    data.education = data.education.map(e => ({
      ...e,
      start_date: formatMonthYear(e.start_date),
      end_date: formatMonthYear(e.end_date)
    }))
  }

  if (Array.isArray(data.experience)) {
    data.experience = data.experience.map(e => ({
      ...e,
      start_date: formatMonthYear(e.start_date),
      end_date: formatMonthYear(e.end_date)
    }))
  }

  profile.value = data
})

const saveProfile = async () => {
  const res = await jobSeekerProfileService.updateProfile(userId, profile.value)

  if (!res.success) {
    $q.notify({ type: 'negative', message: res.error })
    return
  }

  $q.notify({ type: 'positive', message: 'Profile saved successfully' })
  editMode.value = false
}

const triggerFileUpload = () => fileInput.value?.click()

const handlePhotoUpload = (event) => {
  const file = event.target.files[0]
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader()
    reader.onload = () => {
      profile.value.photo = reader.result
    }
    reader.readAsDataURL(file)
  }
}

const formatMonthYear = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
}
</script>


<style scoped>
.full-height {
  min-height: 100vh;
  padding-bottom: 30px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.label {
  font-weight: 600;
  color: #1976d2;
  margin-bottom: 8px;
  font-size: 14px;
}

.edit-btn {
  border: 1px solid #1976d2;
  color: #1976d2;
  font-weight: 500;
  padding: 6px 20px;
  border-radius: 4px;
  background-color: white;
  transition: all 0.3s ease;
}

.edit-btn:hover {
  background-color: #e3f2fd;
  transform: translateY(-2px);
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #171b1f;
  margin-bottom: 20px;
  border-bottom: 2px solid #e3f2fd;
  padding-bottom: 8px;
}

.avatar-card,
.info-card,
.header-card {
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  background-color: #ffffff;
  transition: transform 0.3s ease;
}

.avatar-card:hover,
.info-card:hover,
.header-card:hover {
  transform: translateY(-4px);
}
</style>
