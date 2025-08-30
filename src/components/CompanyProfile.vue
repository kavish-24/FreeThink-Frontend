<template>
  <div>
    <AppHeader class="sticky-header" />
    <div class="page-wrapper row no-wrap">
      <div class="sidebar">
        <div class="sidebar-section logo-section flex items-center q-gutter-sm q-pa-md">
          <q-avatar icon="business_center" color="white" text-color="primary" />
          <div>
            <div class="text-h6 text-white">JobHub</div>
            <div class="text-caption text-blue-grey-3">Employer Portal</div>
          </div>
        </div>

        <div class="sidebar-section q-pt-sm q-pb-none q-px-md">
          <div class="text-subtitle1 text-weight-medium text-white">{{company.companyName || 'Loading...'}}</div>
          <div class="text-caption text-blue-grey-4">{{  company.user.email || '-' }}</div>
        </div>

        <div class="sidebar-section q-pt-md q-pb-none">
          <q-list class="nav-list">
            <q-item v-for="link in links" :key="link.label" :active="selected === link.label"
              active-class="active-link" clickable v-ripple @click="navigate(link)">
              <q-item-section avatar>
                <q-icon :name="link.icon" />
              </q-item-section>
              <q-item-section>
                {{ link.label }}
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>

      <div class="content-area column q-pa-lg">
        <div class="row justify-between items-center q-mb-lg">
          <div>
            <div class="text-h5 text-weight-bold content-title">Company Profile</div>
            <div class="text-subtitle1 text-grey-7">Manage your company details and branding.</div>
          </div>
          <q-btn color="primary" label="Update Profile" @click="openWizard" />
        </div>

        <div class="row q-col-gutter-lg">
          <div class="col-12 col-md-4">
            <q-card class="full-height">
              <q-card-section class="text-center">
                <q-avatar size="120px" class="q-mb-md shadow-3">
                  <img v-if="company.logo" :src="company.logo" alt="Company Logo" />
                  <q-icon v-else name="business" size="xl" color="grey-5" />
                </q-avatar>
                <div class="text-h6 text-weight-bold">{{ company.companyName }}</div>
                <div class="text-subtitle2 text-grey-8">{{ company.industry }}</div>
              </q-card-section>
              <q-separator />
              <q-card-section>
                <div class="text-subtitle1 text-bold q-mb-sm">About</div>
                <p class="text-body2 text-grey-7">{{ company.description }}</p>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-md-8">
            <q-card class="q-mb-lg">
              <q-card-section>
                <div class="text-subtitle1 text-bold">Company Information</div>
              </q-card-section>
              <q-list separator>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Company Size</q-item-label>
                    <q-item-label>{{ company.numberOfEmployees }} employees</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Positions Available</q-item-label>
                    <q-item-label>{{ company.positionsAvailable.join(', ') }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Website</q-item-label>
                    <q-item-label><a :href="company.website" target="_blank">{{ company.website }}</a></q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card>

            <q-card>
              <q-card-section>
                <div class="text-subtitle1 text-bold">Contact Details</div>
              </q-card-section>
              <q-list separator>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Email Address</q-item-label>
                    <q-item-label>{{ company.user.email }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Phone Number</q-item-label>
                    <q-item-label>{{ company.contactNumber }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Address</q-item-label>
                    <q-item-label class="text-wrap">{{ company.location }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card>
          </div>
        </div>

        <q-dialog v-model="showWizard" persistent>
          <q-card style="min-width: 600px">
            <q-stepper v-model="step" ref="stepper" color="primary" animated header-nav>
              <q-step :name="1" title="Core Info" icon="foundation" :done="step > 1">
                <q-input v-model="form.companyName" label="Company Name" outlined class="q-mb-md" />
                <q-input v-model="form.industry" label="Industry (e.g., Electronics)" outlined class="q-mb-md" />
                <q-input v-model="form.numberOfEmployees" label="Number of Employees" type="number" outlined class="q-mb-md" />
                <q-input v-model="form.positionsAvailable" label="Positions Available (comma-separated)" outlined />
              </q-step>

              <q-step :name="2" title="Contact" icon="contacts" :done="step > 2">
                <q-input v-model="form.user.email" label="Public Email" outlined class="q-mb-md" />
                <q-input v-model="form.contactNumber" label="Phone Number" outlined class="q-mb-md" />
                <q-input v-model="form.website" label="Website URL" outlined class="q-mb-md" />
                <q-input v-model="form.location" label="Company Address" type="textarea" outlined />
              </q-step>

              <q-step :name="3" title="Branding" icon="palette">
              <q-file
  v-model="form.logoFile"
  label="Upload Company Logo"
  outlined
  accept=".jpg, .jpeg, .png"
  max-file-size="2097152"
  @rejected="onRejected"
>
  <template v-slot:prepend>
    <q-icon name="attach_file" />
  </template>
  <template v-slot:hint>
    Max 2MB (PNG, JPG)
  </template>
</q-file>

<q-btn
  label="Upload Logo"
  color="primary"
  class="q-mt-sm"
  :disable="!form.logoFile || loading"
  @click="uploadProfilePic"
/>

                <q-input v-model="form.description" label="About the Company" type="textarea" outlined class="q-mt-md" />
              </q-step>

              <template v-slot:navigation>
                <q-stepper-navigation class="q-pt-md">
                  <q-btn v-if="step < 3" color="primary" @click="$refs.stepper.next()" label="Next" />
                  <q-btn v-if="step === 3" color="primary" @click="submitForm" label="Submit" />
                  <q-btn v-if="step > 1" flat color="primary" @click="$refs.stepper.previous()" label="Back" class="q-ml-sm" />
                  <q-btn v-close-popup flat color="grey-8" label="Cancel" class="q-ml-auto" />
                </q-stepper-navigation>
              </template>
            </q-stepper>
          </q-card>
        </q-dialog>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import AppHeader from 'src/components/HeaderPart.vue';
import { authHelpers } from 'src/services/auth.service'
import api from 'src/services/auth.service';


const router = useRouter();
const $q = useQuasar();

const currentUser = authHelpers.getCurrentUser();

const employer = ref({
  name: currentUser?.name || 'Unknown Company',
  email: currentUser?.email || ''
});
const loading = ref(false);
const companyId = ref(authHelpers.getCurrentUser()?.id);



onMounted(async () => {
  const stored = localStorage.getItem('employerData');
  if (stored) {
    employer.value = JSON.parse(stored);
    if (employer.value.id) {
      companyId.value = employer.value.id;
    }
  }
  await loadCompanyData();
});

const selected = ref('Company Profile');
const showWizard = ref(false);
const step = ref(1);

const company = ref({
  companyName: '',
  contactNumber: '',
  logo: null,
  website: '',
  description: '',
  industry: '',
  location: '',
  positionsAvailable: [],
  numberOfEmployees: '',
  user: { id: null, name: '', email: '', role: '', status: '' }
});

const form = ref({
  companyName: '',
  contactNumber: '',
  logo: null,
  logoFile: null,
  website: '',
  description: '',
  industry: '',
  location: '',
  positionsAvailable: '',
  numberOfEmployees: '',
  user: { id: null, name: '', email: '', role: '', status: '' }
});

const loadCompanyData = async () => {
  try {
    loading.value = true;
    const res = await api.get(`/company/${companyId.value}`);
    if (res.data) {
      company.value = {
        companyName: res.data.companyName || '',
        contactNumber: res.data.contactNumber || '',
        logo: res.data.logo || null,
        website: res.data.website || '',
        description: res.data.description || '',
        industry: res.data.industry || '',
        location: res.data.location || '',
        positionsAvailable: res.data.positionsAvailable || [],
        numberOfEmployees: res.data.numberOfEmployees || '',
        user: {
          id: res.data.user?.id || null,
          name: res.data.user?.name || '',
          email: res.data.user?.email || '',
          role: res.data.user?.role || '',
          status: res.data.user?.status || ''
        }
      };
      form.value = {
        ...company.value,
        logoFile: null,
        positionsAvailable: company.value.positionsAvailable.join(', ')
      };
    }
  } catch (err) {
    console.error('Error loading company data:', err);
    $q.notify({
      color: 'negative',
      icon: 'error',
      message: 'Failed to load company data'
    });
  } finally {
    loading.value = false;
  }
};

const openWizard = () => {
  form.value = {
    ...company.value,
    logoFile: null,
    positionsAvailable: company.value.positionsAvailable.join(', ')
  };
  step.value = 1;
  showWizard.value = true;
};

const uploadProfilePic = async () => {
  if (!form.value.logoFile) {
    $q.notify({ color: 'negative', message: 'Please select a file to upload.' });
    return;
  }

  try {
    loading.value = true;

    const formData = new FormData();
    formData.append('photo', form.value.logoFile);

    const userId = companyId.value; // your current company ID

    const res = await api.post(`/companies/photo/${userId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    if (res.data.url) {
      // Update logo in form and UI
      form.value.logo = res.data.url;
      company.value.logo = res.data.url;

      $q.notify({
        color: 'positive',
        icon: 'check_circle',
        message: 'Logo uploaded successfully!'
      });

      form.value.logoFile = null; // reset file input
    }

  } catch (err) {
    console.error('Upload error:', err);
    $q.notify({
      color: 'negative',
      icon: 'error',
      message: err.response?.data?.error || 'Failed to upload logo'
    });
  } finally {
    loading.value = false;
  }
};

const submitForm = async () => {
  try {
    loading.value = true;

    // Prepare payload with cleaned data
    const payload = {
      companyName: form.value.companyName?.trim(),
      contactNumber: form.value.contactNumber?.trim(),
      website: form.value.website?.trim(),
      description: form.value.description?.trim(),
      industry: form.value.industry?.trim(),
      location: form.value.location?.trim(),
      numberOfEmployees: form.value.numberOfEmployees
        ? parseInt(form.value.numberOfEmployees, 10)
        : null,
      positionsAvailable: form.value.positionsAvailable
        ? form.value.positionsAvailable.split(",").map(pos => pos.trim()).filter(Boolean)
        : []
    };

    // If no file uploaded AND no new logo url, don't send logo field
    if (form.value.logoFile) {
      // Only include in FormData below
    } else if (form.value.logo) {
      // If you want to keep current URL-based logo
      payload.logo = form.value.logo;
    }

    let res;

    if (form.value.logoFile) {
      // --- Multipart upload ---
      const formData = new FormData();
      Object.keys(payload).forEach(key => {
        if (Array.isArray(payload[key])) {
          payload[key].forEach((item, index) => {
            formData.append(`${key}[${index}]`, item);
          });
        } else if (payload[key] !== null && payload[key] !== undefined) {
          formData.append(key, payload[key]);
        }
      });
      formData.append("logo", form.value.logoFile);

      res = await api.put(
        `/companies/${companyId.value}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

    } else {
      // --- JSON update ---
      res = await api.put(
        `/companies/${companyId.value}`,
        payload
      );
    }

    if (res.data.success) {
      await loadCompanyData();
      showWizard.value = false;
      $q.notify({
        color: "positive",
        icon: "check_circle",
        message: "Profile updated successfully!"
      });
      form.value.logoFile = null; // reset file input
    } else {
      $q.notify({
        color: "negative",
        icon: "error",
        message: res.data.message || "Update failed"
      });
    }
  } catch (err) {
    console.error("Error updating company profile:", err);
    $q.notify({
      color: "negative",
      icon: "error",
      message: err.response?.data?.message || "Error updating company"
    });
  } finally {
    loading.value = false;
  }
};

const onRejected = (rejectedEntries) => {
  $q.notify({
    type: 'negative',
    message: `${rejectedEntries.length} file(s) did not pass validation constraints.`
  });
};

const links = [
  { label: 'Dashboard Overview', icon: 'dashboard', to: '/employer-portal' },
  { label: 'Posted Jobs', icon: 'work', to: '/posted-jobs' },
  { label: 'Post New Job', icon: 'add_box', to: '/post-job' },
  { label: 'Candidates', icon: 'groups', to: '/candidates' },
  { label: 'Messages', icon: 'mail', to: '/employer-messages' },
  { label: 'Company Profile', icon: 'domain', to: '/company-profile' },
  { label: 'Settings', icon: 'settings', to: '/employer-settings' }
];

const navigate = (link) => {
  selected.value = link.label;
  if (link.to) {
    router.push(link.to);
  }
};

defineExpose({
  loading,
  loadCompanyData,
  submitForm
});
</script>

<style scoped>
.page-wrapper {
  height: 100vh;
  background-color: #f4f8fa;
}
.sidebar {
  width: 260px;
  background-color: #1565c0;
  color: #f0f4f8;
  display: flex;
  flex-direction: column;
}
.sidebar-section {
  border-bottom: 1px solid #243B55;
}
.logo-section {
  border-bottom-color: transparent;
}
.nav-list .q-item {
  color: #BCCCDC;
  padding: 12px;
  margin: 4px 12px;
  border-radius: 8px;
}
.nav-list .q-item:hover {
  background-color: #243B55;
  color: #ffffff;
}
.active-link {
  background-color: #00529b !important;
  color: #ffffff !important;
  font-weight: 600;
}
.content-area {
  flex: 1;
  overflow-y: auto;
}
.content-title {
  color: #102A43;
}
.full-height {
  height: 100%;
}
a {
  color: #00529b;
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}
</style>