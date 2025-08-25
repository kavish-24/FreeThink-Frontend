<template>
  <q-page class="flex flex-center q-pa-md login-page-bg">
    <q-card
      class="q-pa-xl q-mx-sm shadow-10 glass-card"
      style="width: 100%; max-width: 450px; border-radius: 20px;"
    >
      <div
        class="q-mb-lg row items-center text-black-6 dark:text-grey-4 cursor-pointer interactive-link"
        @click="goBack"
      >
        <q-icon name="arrow_back" size="20px" class="q-mr-sm" />
        <span class="text-weight-medium">Back to Home</span>
      </div>

      <div class="q-mb-lg text-center">
        <q-avatar size="72px" class="bg-blue-1 q-mb-sm">
          <q-icon name="work" size="38px" color="#1565c0" />
        </q-avatar>
        <div class="text-h5 text-weight-bold text-dark dark:text-white">Welcome Back</div>
        <div class="text-subtitle2 text-grey-8 dark:text-grey-3">Sign in to your JobHub account</div>
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

      <q-form @submit.prevent="handleLogin" class="q-gutter-md" ref="loginForm">
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
          label="Password"
          v-model="formData.password"
          :type="showPassword ? 'text' : 'password'"
          :dark="$q.dark.isActive"
          :rules="[val => !!val || 'Password is required']"
          lazy-rules
          :disable="authStore.loading"
        >
          <template #append>
            <q-icon
              :name="showPassword ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="showPassword = !showPassword"
              color="grey-6"
            />
          </template>
        </q-input>

        <div class="row items-center justify-between q-mt-sm">
          <q-checkbox
            v-model="formData.rememberMe"
            label="Remember me"
            size="sm"
            :disable="authStore.loading"
          />
          <q-btn
            flat
            label="Forgot Password?"
            size="sm"
            class="q-pa-none interactive-link"
            @click="$router.push('/forgot-password')"
            :disable="authStore.loading"
          />
        </div>

        <q-btn
          label="Sign In"
          class="full-width bg-custom-blue q-mt-lg"
          unelevated
          rounded
          type="submit"
          size="lg"
          no-caps
          :loading="authStore.loading"
        >
          <template v-slot:loading>
            <q-spinner-oval class="on-left" />
            Signing in...
          </template>
        </q-btn>

        <div class="row items-center q-my-md no-wrap">
          <q-separator class="col" />
          <div class="q-px-sm text-black-6 text-caption">or continue with</div>
          <q-separator class="col" />
        </div>

        <q-btn
          outline
          class="full-width q-mb-sm"
          :color="$q.dark.isActive ? 'white' : 'grey-8'"
          no-caps
          size="md"
          :disable="authStore.loading"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            style="width: 20px; margin-right: 8px;"
          />
          Continue with Google
        </q-btn>
      </q-form>

      <div class="text-center q-mt-lg">
        <span class="text-grey-8 dark:text-grey-4">Don't have an account? </span>
        <q-btn
          flat
          label="Sign Up"
          class="q-pa-none text-weight-medium interactive-link"
          @click="goToSignup"
          :disable="authStore.loading"
        />
      </div>
    </q-card>
  </q-page>
</template> 

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
import { useAuthStore } from 'src/stores/auth.store';
import { Loading } from 'quasar';

const $q = useQuasar();
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const formData = ref({
  email: '',
  password: '',
  rememberMe: false
});
const showPassword = ref(false);
const loginForm = ref(null);

onMounted(() => {
  if (route.query.registered === 'true' && route.query.email) {
    formData.value.email = route.query.email;
    $q.notify({
      type: 'positive',
      message: 'Registration successful! Please log in.',
      position: 'top',
      timeout: 5000
    });
    const cleanUrl = window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);
  }
  if (!formData.value.email) {
    const emailInput = document.querySelector('input[type="email"]');
    if (emailInput) emailInput.focus();
  }
});

const redirectBasedOnRole = () => {
  if (authStore.isJobSeeker) {
    router.push(authStore.returnUrl || '/'); 
  } else if (authStore.isEmployer) {
    router.push(authStore.returnUrl || '/employers');
  }
  authStore.setReturnUrl(null);
};

const handleLogin = async () => {
  try {
    authStore.clearError();
    const valid = await loginForm.value.validate();
    if (!valid) return;

    Loading.show({ message: 'Signing in...' });

    const response = await authStore.login({
      email: formData.value.email.trim(),
      password: formData.value.password,
    });

    if (response.success) {
      $q.notify({
        type: 'positive',
        message: authStore.user.isNewUser ? `Welcome ${authStore.user.name}!` : `Welcome back ${authStore.user.name}!`,
        position: 'top',
        timeout: 1500,
      });
      redirectBasedOnRole();
    } else {
      $q.notify({
        type: 'negative',
        message: response.error || 'Login failed. Please try again.',
        position: 'top',
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    $q.notify({
      type: 'negative',
      message: 'An error occurred during login.',
    });
  } finally {
    Loading.hide();
  }
};

const goBack = () => router.push('/');
const goToSignup = () => router.push('/create-account');
</script>

<style scoped>
/* --- Page Background --- */
.login-page-bg {
  background-image:
    linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url('https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2');
  background-size: cover;
  background-position: center;
}

/* --- Improved Glass Card --- */
.glass-card {
  /* Increased opacity for better readability */
  background-color: rgba(255, 255, 255, 0.48);
  
  /* Increased blur for a stronger separation from the background */
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);

  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: background-color 0.3s ease, border 0.3s ease;
}

/* --- Dark Mode Adjustments --- */
.body--dark .glass-card {
  background-color: rgba(30, 30, 30, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* --- Improved Input Fields --- */
:deep(.q-field--outlined .q-field__control) {
  border-radius: 10px !important;
}

/* Make labels more readable */
.body--light :deep(.q-field .q-field__label) {
  color: #444 !important;
}
.body--dark :deep(.q-field .q-field__label) {
  color: #ccc !important;
}

/* Highlight the focused input field with the primary color */
:deep(.q-field--outlined.q-field--focused .q-field__control:after) {
  border-color: #1565c0 !important;
  border-width: 2px;
}

/* --- Interactivity & Attractiveness --- */

/* All buttons get a smooth transition and slight lift on hover */
.q-btn {
  transition: transform 0.2s ease-out, box-shadow 0.2s ease-out;
}
.q-btn:hover {
  transform: scale(1.03);
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

/* Special class for text-based links/buttons */
.interactive-link {
  color: #1565c0;
  transition: filter 0.2s ease-out, text-decoration 0.2s ease-out;
}
.interactive-link:hover {
  filter: brightness(1.2);
  text-decoration: underline;
}
.body--dark .interactive-link {
  color: #64b5f6; /* Lighter blue for dark mode */
}

/* --- Base Custom Colors (from original code) --- */
.bg-custom-blue {
  background: #1565c0 !important;
  color: white !important;
}
:deep(.q-field--disabled) {
  opacity: 0.7;
}
</style>