<template>
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
        <div class="text-subtitle1 text-weight-medium text-white">{{ employer.name }}</div>
        <div class="text-caption text-blue-grey-4">{{ employer.email }}</div>
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
                <img v-if="company.logoUrl" :src="company.logoUrl" alt="Company Logo" />
                <q-icon v-else name="business" size="xl" color="grey-5" />
              </q-avatar>
              <div class="text-h6 text-weight-bold">{{ company.name }}</div>
              <div class="text-subtitle2 text-grey-8">{{ company.industry }}</div>
            </q-card-section>
            <q-separator />
            <q-card-section>
              <div class="text-subtitle1 text-bold q-mb-sm">About</div>
              <p class="text-body2 text-grey-7">{{ company.about }}</p>
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
                    <q-item-label>{{ company.companySize }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Year Founded</q-item-label>
                    <q-item-label>{{ company.foundedYear }}</q-item-label>
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
                    <q-item-label>{{ company.email }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Phone Number</q-item-label>
                    <q-item-label>{{ company.phone }}</q-item-label>
                  </q-item-section>
                </q-item>
                 <q-item>
                  <q-item-section>
                    <q-item-label caption>Address</q-item-label>
                    <q-item-label class="text-wrap">{{ company.address }}</q-item-label>
                  </q-item-section>
                </q-item>
                 <q-item>
                  <q-item-section>
                    <q-item-label caption>Socials</q-item-label>
                    <q-item-label>
                      <q-btn flat dense round icon="fab fa-linkedin" type="a" :href="company.socials.linkedin" target="_blank" />
                      <q-btn flat dense round icon="fab fa-twitter" type="a" :href="company.socials.twitter" target="_blank" />
                    </q-item-label>
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
              <q-input v-model="form.name" label="Company Name" outlined class="q-mb-md" />
              <q-input v-model="form.industry" label="Industry (e.g., Technology)" outlined class="q-mb-md" />
              <q-select v-model="form.companySize" :options="['1-10 employees', '11-50 employees', '51-200 employees', '201-500 employees', '501+ employees']" label="Company Size" outlined class="q-mb-md" />
              <q-input v-model="form.foundedYear" label="Year Founded" type="number" outlined />
            </q-step>

            <q-step :name="2" title="Contact" icon="contacts" :done="step > 2">
              <q-input v-model="form.email" label="Public Email" outlined class="q-mb-md" />
              <q-input v-model="form.phone" label="Phone Number" outlined class="q-mb-md" />
              <q-input v-model="form.website" label="Website URL" outlined class="q-mb-md" />
              <q-input v-model="form.address" label="Company Address" type="textarea" outlined />
            </q-step>

            <q-step :name="3" title="Branding" icon="palette">
<q-file
  v-model="form.logoFile"
  label="Upload Company Logo"
  outlined
  accept=".jpg, .jpeg, .png"
  max-file-size="2097152"
  @rejected="onRejected"
  @update:model-value="onLogoSelected"
>
  <template v-slot:prepend> <q-icon name="attach_file" /> </template>
  <template v-slot:hint> Max 2MB (PNG, JPG) </template>
</q-file>

<!-- Preview uploaded logo inside wizard -->
<div v-if="form.logoPreview" class="q-mt-md text-center">
  <q-avatar size="100px" class="shadow-3">
    <img :src="form.logoPreview" alt="Logo Preview" />
  </q-avatar>
</div>

               <q-input v-model="form.about" label="About the Company" type="textarea" outlined class="q-mt-md" />
               <q-input v-model="form.socials.linkedin" label="LinkedIn Profile URL" outlined class="q-mt-md" />
               <q-input v-model="form.socials.twitter" label="Twitter Profile URL" outlined class="q-mt-md" />
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
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import AppHeader from 'src/components/HeaderPart.vue';

const router = useRouter();
const $q = useQuasar();

const employer = ref({ name: 'Innovate Inc.', email: 'hr@innovate.com' });

onMounted(() => {
const storedCompany = localStorage.getItem('companyData');
if (storedCompany) {
  company.value = JSON.parse(storedCompany);
}

});

const selected = ref('Company Profile');
const showWizard = ref(false);
const step = ref(1);

const company = ref({
  name: 'Innovate Inc.',
  email: 'public@innovate.com',
  website: 'https://innovate.com',
  address: '123 Innovation Park, Tech City, 12345',
  about: 'Innovate Inc. is a leading tech company focusing on smart AI solutions for a better future. We thrive on creativity and collaboration.',
  logoUrl: null, // This will hold the URL for the displayed logo
  industry: 'Artificial Intelligence',
  companySize: '51-200 employees',
  foundedYear: '2015',
  phone: '+1 (555) 123-4567',
  socials: {
    linkedin: 'https://linkedin.com/company/innovate-inc',
    twitter: 'https://twitter.com/innovateinc'
  }
});

// Form state should be separate to avoid updating the UI before submission
const form = ref({
  name: '',
  email: '',
  website: '',
  address: '',
  about: '',
  logoFile: null, // This will hold the File object
  industry: '',
  companySize: '',
  foundedYear: '',
  phone: '',
  socials: {
    linkedin: '',
    twitter: ''
  }
});

const openWizard = () => {
  // Pre-fill form with current company data for editing
  form.value = JSON.parse(JSON.stringify(company.value));
  form.value.logoFile = null; // Reset file input
  step.value = 1;
  showWizard.value = true;
};

const onLogoSelected = (file) => {
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      form.value.logoPreview = e.target.result; // base64 string
    };
    reader.readAsDataURL(file);
  } else {
    form.value.logoPreview = null;
  }
};



const submitForm = () => {
  // If a new logo file was uploaded, create a URL for it
if (form.value.logoFile) {
  const reader = new FileReader();
  reader.onload = (e) => {
    company.value.logoUrl = e.target.result; // base64 string
    localStorage.setItem('companyData', JSON.stringify(company.value));
  };
  reader.readAsDataURL(form.value.logoFile);
} else {
  localStorage.setItem('companyData', JSON.stringify(company.value));
}



  // Update company data from the form
  // We don't copy logoFile to the main company object, so we disable the linter warning for this line.
  // eslint-disable-next-line no-unused-vars
  const { logoFile, ...restOfForm } = form.value;
  company.value = { ...company.value, ...restOfForm };
  
  
  showWizard.value = false;
  step.value = 1;

  $q.notify({
    color: 'positive',
    icon: 'check_circle',
    message: 'Profile updated successfully!'
  });
};

const onRejected = (rejectedEntries) => {
    $q.notify({
        type: 'negative',
        message: `${rejectedEntries.length} file(s) did not pass validation constraints (e.g., size).`
    })
}

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

</script>

<style scoped>
.portal-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden; /* Important to prevent double scrollbars */
}

.sticky-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  /* The header component has its own background and shadow */
}

.page-wrapper {
  flex-grow: 1; /* Takes up the remaining vertical space */
  overflow: hidden; /* Important */
}

/* Sidebar and Content Area take full height of the wrapper */
.sidebar, .content-area {
  height: 100%;
}

.content-area {
  flex: 1;
  overflow-y: auto;
}
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
.logout-btn {
  color: #FFB5B5;
  border-radius: 8px;
  margin: 16px;
}
.logout-btn:hover {
  background-color: #d32f2f;
  color: #ffffff;
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