<template>
  <div class="signup-bg flex flex-center">
    <q-card class="glass-card q-pa-xl">
      <div
        class="row items-center q-mb-lg cursor-pointer interactive-link"
        @click="goBack"
      >
        <q-icon name="arrow_back" size="20px" class="q-mr-sm" />
        <span class="text-weight-medium">Back to Home</span>
      </div>

      <div class="q-mb-lg text-center">
        <q-avatar size="72px" class="bg-primary text-white q-mb-sm">
          <q-icon name="person_add" size="38px" />
        </q-avatar>
        <div class="text-h5 text-weight-bold text-dark dark:text-white">Create Your Account</div>
        <div class="text-subtitle2 text-grey-8 dark:text-grey-3">Join our community of job seekers</div>
      </div>

      <q-banner
        v-if="authStore.error"
        class="bg-red-1 text-red q-mb-md"
        rounded
      >
        {{ authStore.error }}
        <template v-slot:action>
          <q-btn flat color="red" icon="close" @click="authStore.clearError()" />
        </template>
      </q-banner>

      <q-form @submit.prevent="handleSubmit" class="q-gutter-y-md">
        <div class="row q-col-gutter-md">
          <div class="col-12 col-sm-6">
            <q-input
              outlined
              dense
              label="First name"
              v-model="formData.firstName"
              :dark="$q.dark.isActive"
              :rules="[val => !!val || 'First name is required']"
              :disable="authStore.loading"
            />
          </div>
          <div class="col-12 col-sm-6">
            <q-input
              outlined
              dense
              label="Last name"
              v-model="formData.lastName"
              :dark="$q.dark.isActive"
              :rules="[val => !!val || 'Last name is required']"
              :disable="authStore.loading"
            />
          </div>
        </div>

        <q-input
          outlined
          dense
          label="Email address"
          v-model="formData.email"
          type="email"
          :dark="$q.dark.isActive"
          :rules="[
            val => !!val || 'Email is required',
            val => /.+@.+\..+/.test(val) || 'Please enter a valid email'
          ]"
          lazy-rules
          :disable="authStore.loading"
        />

        <q-input
          outlined
          dense
          label="Phone number"
          v-model="formData.phone"
          mask="(###) ### - ####"
          :dark="$q.dark.isActive"
          :rules="[val => !!val || 'Phone number is required']"
          :disable="authStore.loading"
        >
          <template v-slot:prepend>
            <q-icon name="phone" />
          </template>
        </q-input>

        <q-input
          outlined
          dense
          label="Password"
          v-model="formData.password"
          :type="showPassword ? 'text' : 'password'"
          :dark="$q.dark.isActive"
          :rules="[
            val => !!val || 'Password is required',
            val => val.length >= 8 || 'Password must be at least 8 characters'
          ]"
          lazy-rules
          :disable="authStore.loading"
        >
          <template #append>
            <q-icon
              :name="showPassword ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="showPassword = !showPassword"
            />
          </template>
        </q-input>

        <q-input
          outlined
          dense
          label="Confirm Password"
          v-model="formData.confirmPassword"
          :type="showConfirmPassword ? 'text' : 'password'"
          :dark="$q.dark.isActive"
          :rules="[
            val => !!val || 'Please confirm your password',
            val => val === formData.password || 'Passwords do not match'
          ]"
          lazy-rules
          :disable="authStore.loading"
        >
          <template #append>
            <q-icon
              :name="showConfirmPassword ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="showConfirmPassword = !showConfirmPassword"
            />
          </template>
        </q-input>

        <q-checkbox
          v-model="formData.termsAccepted"
          label="I agree to the Terms of Service and Privacy Policy"
          class="q-mt-md"
          :rules="[val => !!val || 'You must accept the terms and conditions']"
          :disable="authStore.loading"
        />

        <q-btn
          label="Create Account"
          type="submit"
          color= "primary"
          class="full-width q-mt-lg"
          size="lg"
          no-caps
          rounded
          unelevated
          :loading="authStore.loading"
        >
          <template v-slot:loading>
            <q-spinner-oval class="on-left" />
            Creating Account...
          </template>
        </q-btn>
      </q-form>

      <div class="text-center q-mt-lg">
        <span class="text-grey-8 dark:text-grey-4">Already have an account? </span>
        <q-btn
          flat
          label="Sign In"
          class="q-pa-none text-weight-medium interactive-link"
          @click="goToLogin"
          :disable="authStore.loading"
        />
      </div>
    </q-card>
  </div>
</template>

<script setup>
// UNCHANGED: The script logic remains exactly as you provided it.
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useAuthStore } from 'src/stores/auth.store';

const $q = useQuasar();
const router = useRouter();
const authStore = useAuthStore();

const formData = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  termsAccepted: false
});

const showPassword = ref(false);
const showConfirmPassword = ref(false);

const handleSubmit = async () => {
  try {
    const result = await authStore.register({
      firstName: formData.value.firstName,
      lastName: formData.value.lastName,
      email: formData.value.email,
      phone: formData.value.phone.replace(/\D/g, ''),
      password: formData.value.password,
    });

    if (result.success) {
      $q.notify({
        type: 'positive',
        message: 'Account created successfully! Logging in...',
        position: 'top',
        timeout: 2000,
      });

      const loginResult = await authStore.login({
        email: formData.value.email,
        password: formData.value.password,
      });

      if (loginResult.success) {
        setTimeout(() => {
          if (authStore.isJobSeeker) {
            router.push('/');
          } else if (authStore.isEmployer) {
            router.push('/employer-portal');
          }
        }, 2000);
      } else {
        router.push({
          path: '/login',
          query: { registered: 'true', email: formData.value.email },
        });
      }
    }
  } catch (error) {
    console.error('Registration error:', error);
  }
};

const goBack = () => {
  router.push('/');
};

const goToLogin = () => {
  router.push('/login');
};
</script>

<style scoped>
/* --- Page Background --- */
.signup-bg {
  min-height: 100vh;
  padding: 48px 16px;
  background-image:
    linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}

/* --- Frosted Glass Card UI --- */
.glass-card {
  width: 100%;
  max-width: 550px;
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.49);
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
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
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
