<template>
  <div class="q-pa-md bg-grey-1 full-height">
    <!-- Header -->
    <q-card class="header-card q-pa-md q-mb-xl">
      <div class="row justify-between items-center">
        <h4 class="q-mt-none q-mb-none text-primary header-title">My Profile</h4>
        <div class="row items-center q-gutter-sm">
          <q-btn
            flat
            icon="edit"
            :label="editMode ? 'Cancel' : 'Edit Profile'"
            class="edit-btn"
            @click="editMode = !editMode"
          >
            <q-tooltip class="professional-tooltip">Edit your profile details</q-tooltip>
          </q-btn>
          <q-btn
            flat
            icon="account_circle"
            label="Complete Profile"
            class="edit-btn"
            @click="$emit('open-profile')"
          >
            <q-tooltip class="professional-tooltip">Complete your profile to get better job matches</q-tooltip>
          </q-btn>
        </div>
      </div>
    </q-card>

    <!-- Avatar Card -->
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
            :value="0.85"
            color="primary"
            track-color="grey-3"
            size="12px"
            rounded
            class="q-mt-sm"
          />
          <div class="text-right text-caption text-primary q-mt-xs">85% Complete</div>
        </div>
      </q-card>
    </div>

    <!-- Info Card -->
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
            class="input-field"
          />
          <div v-else class="info-row">
            <span class="label">First Name:</span>
            <span class="info-text">{{ profile.firstName }}</span>
          </div>

          <q-input
            v-if="editMode"
            v-model="profile.email"
            label="Email"
            outlined
            dense
            class="input-field"
          />
          <div v-else class="info-row">
            <span class="label">Email:</span>
            <span class="info-text">{{ profile.email }}</span>
          </div>

          <q-input
            v-if="editMode"
            v-model="profile.streetAddress"
            label="Street Address"
            outlined
            dense
            class="input-field"
          />
          <div v-else class="info-row">
            <span class="label">Street Address:</span>
            <span class="info-text">{{ profile.streetAddress }}</span>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <q-input
            v-if="editMode"
            v-model="profile.lastName"
            label="Last Name"
            outlined
            dense
            class="input-field"
          />
          <div v-else class="info-row">
            <span class="label">Last Name:</span>
            <span class="info-text">{{ profile.lastName }}</span>
          </div>

          <q-input
            v-if="editMode"
            v-model="profile.phoneNumber"
            label="Phone Number"
            outlined
            dense
            class="input-field"
          />
          <div v-else class="info-row">
            <span class="label">Phone Number:</span>
            <span class="info-text">{{ profile.phoneNumber }}</span>
          </div>

          <q-input
            v-if="editMode"
            v-model="profile.zipcode"
            label="Zip Code"
            outlined
            dense
            class="input-field"
          />
          <div v-else class="info-row">
            <span class="label">Zip Code:</span>
            <span class="info-text">{{ profile.zipcode }}</span>
          </div>
        </div>
      </div>
    </q-card>

    <!-- Professional Background -->
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
          <div class="text-grey-7 text-body2">{{ profile.summary }}</div>
        </div>
      </div>

      <div class="row q-col-gutter-lg">
        <div class="col-12 col-md-6">
          <div class="label row items-center justify-between">
            <span>Education</span>
            <q-btn
              v-if="editMode"
              icon="add"
              dense
              flat
              @click="addEducation"
              size="sm"
              color="primary"
              class="add-btn"
            >
              <q-tooltip class="professional-tooltip">Add Education</q-tooltip>
            </q-btn>
          </div>

          <div v-for="(edu, index) in profile.education" :key="index" class="q-mb-md education-item">
            <div v-if="!editMode" class="text-grey-7">
              <div class="text-subtitle2 text-weight-medium">{{ edu.degree }} – {{ edu.school }}</div>
              <span class="text-caption">{{ edu.field }}</span><br />
              <span class="text-caption text-grey">
                {{ formatMonthYear(edu.start_date) }} to {{ formatMonthYear(edu.end_date) }}
              </span>
            </div>

            <div v-else class="q-gutter-sm">
              <q-input v-model="edu.school" label="School" dense outlined class="input-field" />
              <q-input v-model="edu.degree" label="Degree" dense outlined class="input-field" />
              <q-input v-model="edu.field" label="Field" dense outlined class="input-field" />
              <q-input v-model="edu.start_date" type="date" label="Start Date" dense outlined class="input-field" />
              <q-input v-model="edu.end_date" type="date" label="End Date" dense outlined class="input-field" />
              <q-btn
                icon="delete"
                color="negative"
                flat
                dense
                @click="removeEducation(index)"
                size="sm"
                class="delete-btn"
              >
                <q-tooltip class="professional-tooltip">Remove Education</q-tooltip>
              </q-btn>
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
              dense
              flat
              @click="addExperience"
              size="sm"
              color="primary"
              class="add-btn"
            >
              <q-tooltip class="professional-tooltip">Add Experience</q-tooltip>
            </q-btn>
          </div>

          <div v-for="(exp, index) in profile.experience" :key="index" class="q-mb-md experience-item">
            <div v-if="!editMode" class="text-grey-7">
              <div class="text-subtitle2 text-weight-medium">{{ exp.title }} at {{ exp.company }}</div>
              <div class="text-caption text-grey">{{ exp.description }}</div>
              <span class="text-caption text-grey">
                {{ formatMonthYear(exp.start_date) }} to {{ formatMonthYear(exp.end_date) }}
              </span>
            </div>

            <div v-else class="q-gutter-sm">
              <q-input v-model="exp.title" label="Job Title" dense outlined class="input-field" />
              <q-input v-model="exp.company" label="Company" dense outlined class="input-field" />
              <q-input v-model="exp.description" label="Description" type="textarea" dense outlined class="input-field" />
              <q-input v-model="exp.start_date" type="date" label="Start Date" dense outlined class="input-field" />
              <q-input v-model="exp.end_date" type="date" label="End Date" dense outlined class="input-field" />
              <q-btn
                icon="delete"
                color="negative"
                flat
                dense
                @click="removeExperience(index)"
                size="sm"
                class="delete-btn"
              >
                <q-tooltip class="professional-tooltip">Remove Experience</q-tooltip>
              </q-btn>
              <q-separator spaced />
            </div>
          </div>
        </div>
      </div>
    </q-card>

    <!-- Skills & Resume -->
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
          </div>
          <div v-else>
            <q-input
              v-for="(skill, index) in profile.skills"
              :key="index"
              v-model="profile.skills[index]"
              outlined
              dense
              class="q-mb-sm input-field"
              :label="`Skill ${index + 1}`"
            />
            <q-btn
              flat
              icon="add"
              label="Add Skill"
              @click="profile.skills.push('')"
              class="add-btn"
            >
              <q-tooltip class="professional-tooltip">Add a new skill</q-tooltip>
            </q-btn>
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
            class="resume-preview"
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
              class="q-mb-sm upload-btn"
            >
              <q-tooltip class="professional-tooltip">Upload a new resume</q-tooltip>
            </q-btn>
            <input
              ref="resumeInput"
              type="file"
              accept=".pdf,image/*"
              hidden
              @change="handleResumeUpload"
            />
            <div class="text-caption text-grey-6">
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
    >
      <q-tooltip class="professional-tooltip">Save profile changes</q-tooltip>
    </q-btn>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useQuasar } from 'quasar';
import { jobSeekerProfileService } from 'src/services/profile.service';
import { authHelpers } from 'src/services/auth.service';

const $q = useQuasar();
const userId = authHelpers.getCurrentUser()?.id;

const profile = ref({
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
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
});

const editMode = ref(false);
const fileInput = ref(null);
const resumeInput = ref(null);

const fullName = computed(() => `${profile.value.firstName} ${profile.value.lastName}`);
const initials = computed(() => profile.value.firstName?.charAt(0) + profile.value.lastName?.charAt(0));

onMounted(async () => {
  const res = await jobSeekerProfileService.getProfile(userId);

  if (!res.success) {
    $q.notify({ type: 'negative', message: res.error });
    return;
  }

  const data = res.data;

  // Format date fields
  if (Array.isArray(data.education)) {
    data.education = data.education.map(e => ({
      ...e,
      start_date: formatMonthYear(e.start_date),
      end_date: formatMonthYear(e.end_date)
    }));
  }

  if (Array.isArray(data.experience)) {
    data.experience = data.experience.map(e => ({
      ...e,
      start_date: formatMonthYear(e.start_date),
      end_date: formatMonthYear(e.end_date)
    }));
  }

  profile.value = data;
});

const saveProfile = async () => {
  const res = await jobSeekerProfileService.updateProfile(userId, profile.value);

  if (!res.success) {
    $q.notify({ type: 'negative', message: res.error });
    return;
  }

  $q.notify({ type: 'positive', message: 'Profile saved successfully' });
  editMode.value = false;
};

const triggerFileUpload = () => fileInput.value?.click();

const handlePhotoUpload = (event) => {
  const file = event.target.files[0];
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = () => {
      profile.value.photo = reader.result;
    };
    reader.readAsDataURL(file);
  }
};

const triggerResumeUpload = () => {
  resumeInput.value?.click();
};

const handleResumeUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      profile.value.resume = reader.result;
      profile.value.resumeType = file.type.startsWith('image/') ? 'image' : 'pdf';
    };
    reader.readAsDataURL(file);
  }
};

const addEducation = () => {
  profile.value.education.push({
    school: '',
    degree: '',
    field: '',
    start_date: '',
    end_date: ''
  });
};

const removeEducation = (index) => {
  profile.value.education.splice(index, 1);
};

const addExperience = () => {
  profile.value.experience.push({
    title: '',
    company: '',
    description: '',
    start_date: '',
    end_date: ''
  });
};

const removeExperience = (index) => {
  profile.value.experience.splice(index, 1);
};

const formatMonthYear = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
};
</script>

<style scoped>
.full-height {
  min-height: 100vh;
  padding: 32px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
}

/* Header Card */
.header-card {
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  background: #ffffff;
  padding: 24px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.header-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.08);
}

.header-title {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  background: linear-gradient(135deg, #1e40af, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.edit-btn {
  border: 2px solid #3b82f6;
  color: #3b82f6;
  font-weight: 600;
  padding: 8px 24px;
  border-radius: 8px;
  background: #ffffff;
  transition: all 0.3s ease;
}

.edit-btn:hover {
  background: #eff6ff;
  color: #1e40af;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

/* Avatar Card */
.avatar-card {
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  width: 450px;
}

.avatar-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.08);
}

.avatar-container {
  position: relative;
}

.professional-avatar {
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  border: 4px solid #ffffff;
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.25);
  transition: transform 0.3s ease;
}

.professional-avatar:hover {
  transform: scale(1.05);
}

/* Info Card */
.info-card {
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  background: #ffffff;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.info-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.08);
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 24px;
  border-bottom: 2px solid #e3f2fd;
  padding-bottom: 8px;
}

.label {
  font-weight: 600;
  color: #3b82f6;
  font-size: 14px;
  margin-bottom: 12px;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.info-text {
  color: #4b5563;
  font-size: 14px;
}

.input-field {
  margin-bottom: 16px;
}

.input-field .q-field__control {
  border-radius: 8px;
  background: #f8fafc;
  transition: border-color 0.3s ease;
}

.input-field:hover .q-field__control {
  border-color: #3b82f6;
}

.education-item, .experience-item {
  padding: 12px;
  border-radius: 8px;
  background: #f8fafc;
  margin-bottom: 16px;
  transition: background 0.3s ease;
}

.education-item:hover, .experience-item:hover {
  background: #eff6ff;
}

.add-btn {
  border-radius: 8px;
  color: #3b82f6;
  transition: all 0.3s ease;
}

.add-btn:hover {
  background: #eff6ff;
  transform: translateY(-2px);
}

.delete-btn {
  border-radius: 8px;
  transition: all 0.3s ease;
}

.delete-btn:hover {
  background: #fef2f2;
  transform: translateY(-2px);
}

.skill-chip {
  border-radius: 16px;
  transition: transform 0.3s ease;
}

.skill-chip:hover {
  transform: scale(1.05);
}

.upload-btn {
  border-radius: 8px;
  padding: 8px 16px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.upload-btn:hover {
  background: #eff6ff;
  transform: translateY(-2px);
}

.resume-preview {
  transition: transform 0.3s ease;
}

.resume-preview:hover {
  transform: scale(1.02);
}

.save-btn {
  border-radius: 8px;
  padding: 10px 24px;
  font-weight: 600;
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  transition: all 0.3s ease;
}

.save-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.professional-tooltip {
  background: #1e293b;
  color: #ffffff;
  font-size: 12px;
  padding: 8px 12px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

/* Responsive Design */
@media (max-width: 768px) {
  .q-pa-md {
    padding: 24px;
  }

  .header-card, .avatar-card, .info-card {
    padding: 16px;
  }

  .avatar-card {
    width: 100%;
  }

  .header-title {
    font-size: 20px;
  }

  .edit-btn {
    padding: 6px 16px;
  }
}

@media (max-width: 480px) {
  .q-pa-md {
    padding: 16px;
  }

  .row.items-center.q-gutter-sm {
    flex-direction: column;
    gap: 8px;
  }

  .edit-btn {
    width: 100%;
    text-align: center;
  }

  .section-title {
    font-size: 18px;
  }
}

/* Accessibility */
.edit-btn:focus-visible,
.add-btn:focus-visible,
.delete-btn:focus-visible,
.upload-btn:focus-visible,
.save-btn:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

@media (prefers-contrast: high) {
  .header-title {
    -webkit-text-fill-color: #1e40af;
    background: none;
  }

  .edit-btn, .add-btn, .upload-btn, .save-btn {
    border-width: 3px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .header-card, .avatar-card, .info-card,
  .edit-btn, .add-btn, .delete-btn,
  .upload-btn, .save-btn, .skill-chip,
  .resume-preview, .professional-avatar {
    transition: none;
  }
}
</style>