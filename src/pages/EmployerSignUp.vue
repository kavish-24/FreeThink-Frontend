<template>
  <div class="signup-bg flex flex-center">
    <q-card class="glass-card q-pa-xl">
      <div class="row items-center q-mb-sm no-gap">
        <q-btn
          flat
          icon="arrow_back"
          label="Back to Employers"
          @click="goToEmployers"
          class="interactive-link"
          size="sm"
          dense
        />
      </div>

      <div class="text-center q-mb-lg">
        <q-avatar size="64px" class="q-mb-sm" color="primary" text-color="white">
          <q-icon name="business" size="38px" />
        </q-avatar>
        <div class="text-h5 text-weight-bold text-dark dark:text-white">Company Registration</div>
        <div class="text-caption text-grey-8 dark:text-grey-3">
          Create an account to start posting jobs
        </div>
      </div>

      <q-banner v-if="error" class="bg-red-1 text-red q-mb-md" rounded>
        {{ error }}
        <template v-slot:action>
          <q-btn flat color="red" icon="close" @click="error = ''" />
        </template>
      </q-banner>

      <q-form @submit.prevent="registerCompany" class="q-gutter-y-md">
        <div class="text-subtitle2 text-grey-8 q-mb-none dark:text-grey-3">Company Information</div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <label class="field-label">Company Name *</label>
            <q-input
              v-model="formData.companyName"
              outlined
              dense
              placeholder="Enter your company name"
              :dark="$q.dark.isActive"
              :rules="[ val => !!val || 'Company name is required' ]"
              :disable="loading"
            />
          </div>
          <div class="col-12 col-md-6">
            <label class="field-label">Business Email *</label>
            <q-input
              v-model="formData.email"
              outlined
              dense
              type="email"
              placeholder="company@example.com"
              :dark="$q.dark.isActive"
              :rules="[
                val => !!val || 'Email is required',
                val => /.+@.+\..+/.test(val) || 'Enter a valid email'
              ]"
              :disable="loading"
            />
          </div>
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <label class="field-label">Contact Number *</label>
            <q-input
              v-model="formData.contactNumber"
              outlined
              dense
              type="tel"
              placeholder="(123) 456-7890"
              mask="(###) ### - ####"
              :dark="$q.dark.isActive"
              :rules="[ val => !!val || 'Contact number is required' ]"
              :disable="loading"
            >
              <template v-slot:prepend>
                <q-icon name="phone" />
              </template>
            </q-input>
          </div>
          <div class="col-12 col-md-6">
            <label class="field-label">Website</label>
            <q-input
              v-model="formData.website"
              outlined
              dense
              placeholder="https://yourcompany.com"
              :dark="$q.dark.isActive"
              :disable="loading"
            />
          </div>
        </div>

        <div>
          <label class="field-label">Create Password *</label>
          <q-input
            v-model="formData.password"
            outlined
            dense
            :type="showPassword ? 'text' : 'password'"
            placeholder="8+ characters with uppercase, lowercase, & number"
            :dark="$q.dark.isActive"
            :rules="[
              val => !!val || 'Password is required',
              val => (val && val.length >= 8) || 'Password must be at least 8 characters'
            ]"
            :disable="loading"
          >
            <template v-slot:append>
              <q-icon
                :name="showPassword ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="showPassword = !showPassword"
              />
            </template>
          </q-input>
        </div>
        
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <label class="field-label">Industry</label>
            <q-input
              v-model="formData.industry"
              outlined
              dense
              placeholder="e.g., Technology, Healthcare"
              :dark="$q.dark.isActive"
              :disable="loading"
            />
          </div>
          <div class="col-12 col-md-6">
            <label class="field-label">Location</label>
            <q-input
              v-model="formData.location"
              outlined
              dense
              placeholder="e.g., New York, USA"
              :dark="$q.dark.isActive"
              :disable="loading"
            />
          </div>
        </div>
        
        <div>
          <label class="field-label">Company Description</label>
          <q-input
            v-model="formData.description"
            outlined
            dense
            type="textarea"
            placeholder="Tell us about your company"
            :dark="$q.dark.isActive"
            :disable="loading"
            rows="3"
          />
        </div>

        <div class="row justify-center q-mt-xl">
          <q-btn
            label="Create Account"
            type="submit"
            color= "blue"
            class="full-width"
            unelevated
            rounded
            size="lg"
            no-caps
            :loading="loading"
          >
            <template v-slot:loading>
              <q-spinner-oval class="on-left" />
              Creating Account...
            </template>
          </q-btn>
        </div>

        <div class="text-center q-mt-md">
          <span class="text-grey-8 dark:text-grey-4">Already have an account? </span>
          <router-link to="/login" class="interactive-link text-weight-medium">Sign In</router-link>
        </div>
      </q-form>

      <div class="text-center q-mt-md">
        <q-btn
          flat
          label="Back to Home"
          @click="goToHome"
          size="sm"
          dense
          class="interactive-link"
        />
      </div>
    </q-card>
  </div>
</template>

<script>
// UNCHANGED: The script logic remains exactly as you provided it.
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { companyAuth, auth } from '../services/auth.service';
import { authHelpers } from '../services/auth.service';

export default {
  name: 'EmployerSignup',
  setup() {
    const router = useRouter();
    const $q = useQuasar();

    const loading = ref(false);
    const error = ref('');
    const showPassword = ref(false);
    const user = ref(null);
    const isAuthenticated = ref(false);

    const formData = ref({
      companyName: '',
      email: '',
      contactNumber: '',
      password: '',
      website: '',
      logo: '',
      description: '',
      industry: '',
      location: '',
      companySize: '',
      foundedYear: '',
      linkedinUrl: '',
      twitterHandle: ''
    });

    const registerCompany = async () => {
      try {
        loading.value = true;
        error.value = '';

        // 1️⃣ Register company
        const response = await companyAuth.register(formData.value);

        if (!response.success) {
          error.value = response.error || 'Registration failed';
          $q.notify({ type: 'negative', message: error.value, position: 'top' });
          return;
        }

        // 2️⃣ Explicitly log in
        const loginResponse = await auth.login({
          email: formData.value.email,
          password: formData.value.password
        });

        if (!loginResponse.success) {
          error.value = loginResponse.error || 'Login failed after registration';
          $q.notify({ type: 'negative', message: error.value, position: 'top' });
          return;
        }

        // 3️⃣ Save token & user data
        const loginUser = loginResponse.data.user;
        const token = loginResponse.data.token;
        authHelpers.setAuthData(token, loginUser);

        user.value = loginUser;
        isAuthenticated.value = true;

        // 4️⃣ Redirect to employer portal
        router.push('/employers');

        $q.notify({
          type: 'positive',
          message: 'Registration & login successful 🎉',
          position: 'top',
        });

      } catch (err) {
        console.error('Registration/Login error:', err);
        error.value = 'An unexpected error occurred.';
        $q.notify({ type: 'negative', message: error.value, position: 'top' });
      } finally {
        loading.value = false;
      }
    };

    return {
      formData,
      loading,
      error,
      showPassword,
      user,
      isAuthenticated,
      registerCompany,
      $q
    };
  }
};

</script>

<style scoped>
/* --- Page Background --- */
.signup-bg {
  min-height: 100vh;
  padding: 48px 16px;
  background-image:
    linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.55)),
    url('https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}

/* --- Improved Glass Card UI --- */
.glass-card {
  width: 100%;
  max-width: 800px; /* MODIFIED: Increased width for the grid layout */
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.68);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 32px 40px;
  transition: background-color 0.3s ease, border 0.3s ease;
}
.body--dark .glass-card {
  background-color: rgba(30, 30, 30, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.15);
}

/* --- Form Field Labels --- */
.field-label {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 6px;
  display: block;
  color: #212121;
}
.body--dark .field-label {
  color: #ddd;
}

/* --- Input Field Styling --- */
:deep(.q-field--outlined .q-field__control) {
  border-radius: 10px !important;
}
:deep(.q-field--outlined.q-field--focused .q-field__control:after) {
  border-color: #1976d2 !important;
  border-width: 2px;
}

/* --- Interactivity & Attractiveness --- */
.q-btn {
  transition: transform 0.2s ease-out, box-shadow 0.2s ease-out;
}
.q-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.11);
}

.interactive-link, .router-link-active, .router-link-exact-active {
  color: #1976d2;
  text-decoration: none;
  transition: all 0.2s ease-out;
}
.interactive-link:hover, .router-link-active:hover, .router-link-exact-active:hover {
  filter: brightness(1.2);
  text-decoration: underline;
}
.body--dark .interactive-link,
.body--dark .router-link-active,
.body--dark .router-link-exact-active {
  color: #64b5f6;
}

/* --- Base Text & Color Overrides --- */
.text-primary {
  color: #1976d2 !important;
}
.body--dark .text-dark {
  color: #fff !important;
}
.dark-card .text-grey-8 {
  color: #bbb !important;
}
</style>