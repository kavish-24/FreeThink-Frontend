<template>
  <q-page class="flex flex-center q-pa-md login-page-bg">
    <q-card
      class="q-pa-xl q-mx-sm shadow-10 glass-card"
      style="width: 100%; max-width: 450px; border-radius: 20px;"
    >
      <div v-if="step === 1">
        <div
          class="q-mb-lg row items-center text-black-6 dark:text-grey-4 cursor-pointer interactive-link"
          @click="goToLogin"
        >
          <q-icon name="arrow_back" size="20px" class="q-mr-sm" />
          <span class="text-weight-medium">Back to Login</span>
        </div>

        <div class="q-mb-lg text-center">
          <q-avatar size="72px" class="bg-blue-1 q-mb-sm">
            <q-icon name="lock_reset" size="38px" color="#1565c0" />
          </q-avatar>
          <div class="text-h5 text-weight-bold text-dark dark:text-white">Forgot Password</div>
          <div class="text-subtitle2 text-grey-8 dark:text-grey-3">Verify your email to reset your password</div>
        </div>

        <q-form @submit.prevent="verifyOtp" class="q-gutter-md">
          <q-input
            outlined
            dense
            label="Email address"
            v-model="email"
            type="email"
            :dark="$q.dark.isActive"
            :rules="[ val => !!val || 'Email is required' ]"
            lazy-rules
          >
            <template v-slot:append>
              <q-btn flat dense class="interactive-link text-weight-bold" @click="sendOtp" label="Send OTP" no-caps />
            </template>
          </q-input>

          <q-input
            outlined
            dense
            label="Enter OTP"
            v-model="otp"
            :dark="$q.dark.isActive"
            :rules="[ val => !!val || 'OTP is required' ]"
            lazy-rules
          />

          <q-btn
            label="Verify OTP"
            class="full-width bg-custom-blue q-mt-lg"
            unelevated
            rounded
            type="submit"
            size="lg"
            no-caps
          />
        </q-form>
      </div>

      <div v-if="step === 2">
        <div class="row justify-between items-center q-mb-lg">
          <div
            class="row items-center text-black-6 dark:text-grey-4 cursor-pointer interactive-link"
            @click="step = 1"
          >
            <q-icon name="arrow_back" size="20px" class="q-mr-sm" />
            <span class="text-weight-medium">Back</span>
          </div>
          <div
            class="row items-center text-black-6 dark:text-grey-4 cursor-pointer interactive-link"
            @click="goToLogin"
          >
            <q-icon name="login" size="20px" class="q-mr-sm" />
            <span class="text-weight-medium">Back to Login</span>
          </div>
        </div>

        <div class="q-mb-lg text-center">
          <q-avatar size="72px" class="bg-blue-1 q-mb-sm">
            <q-icon name="password" size="38px" color="#1565c0" />
          </q-avatar>
          <div class="text-h5 text-weight-bold text-dark dark:text-white">Set New Password</div>
          <div class="text-subtitle2 text-grey-8 dark:text-grey-3">Please choose a new password</div>
        </div>

        <q-form @submit.prevent="updatePassword" class="q-gutter-md">
          <q-input
            outlined
            dense
            label="New Password"
            v-model="newPassword"
            :type="showNewPassword ? 'text' : 'password'"
            :dark="$q.dark.isActive"
            :rules="[
              val => !!val || 'Password is required',
              val => val.length >= 8 || 'Minimum 8 characters',
              val => /[A-Z]/.test(val) || 'At least 1 uppercase letter required',
              val => /[^A-Za-z0-9]/.test(val) || 'At least 1 special character required'
            ]"
            lazy-rules
          >
            <template #append>
              <q-icon
                :name="showNewPassword ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="showNewPassword = !showNewPassword"
              />
            </template>
          </q-input>

          <q-input
            outlined
            dense
            label="Confirm New Password"
            v-model="confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            :dark="$q.dark.isActive"
            :rules="[
              val => !!val || 'Please confirm your password',
              val => val === newPassword || 'Passwords must match'
            ]"
            lazy-rules
          >
            <template #append>
              <q-icon
                :name="showConfirmPassword ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="showConfirmPassword = !showConfirmPassword"
              />
            </template>
          </q-input>

          <q-btn
            label="Update Password"
            class="full-width bg-custom-blue q-mt-lg"
            unelevated
            rounded
            type="submit"
            size="lg"
            no-caps
          />
        </q-form>
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { passwordService } from '../services/password.service';

const router = useRouter();
const $q = useQuasar();

const step = ref(1);
const email = ref('');
const otp = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

const sendOtp = async () => {
  if (!email.value) {
    $q.notify({ type: 'negative', message: 'Please enter your email' });
    return;
  }

  try {
    const res = await passwordService.sendOtp(email.value);
    $q.notify({ type: 'positive', message: res.data.message || 'OTP sent to your email', position: 'top', icon: 'email' });
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Failed to send OTP',
      position: 'top'
    });
  }
};

const verifyOtp = async () => {
  if (!otp.value) {
    $q.notify({ type: 'negative', message: 'Please enter the OTP' });
    return;
  }

  try {
    const res = await passwordService.verifyOtp(email.value, otp.value);
    $q.notify({ type: 'positive', message: res.data.message || 'OTP Verified Successfully', position: 'top', icon: 'verified' });
    step.value = 2;
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'OTP verification failed',
      position: 'top'
    });
  }
};

const updatePassword = async () => {
  if (!newPassword.value || !confirmPassword.value) {
    $q.notify({ type: 'negative', message: 'Please fill both password fields.' });
    return;
  }
  if (newPassword.value !== confirmPassword.value) {
    $q.notify({ type: 'negative', message: 'Passwords do not match.' });
    return;
  }

  try {
    const res = await passwordService.updatePassword(email.value, newPassword.value, confirmPassword.value);
    $q.notify({ type: 'positive', message: res.data.message || 'Password updated successfully', position: 'top' });
    router.push('/login');
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Failed to update password',
      position: 'top'
    });
  }
};

const goToLogin = () => {
  router.push('/login');
};
</script>


<style scoped>
.login-page-bg {
  background-image:
    linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url('https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2');
  background-size: cover;
  background-position: center;
}

.glass-card {
  background-color: rgba(255, 255, 255, 0.48);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.body--dark .glass-card {
  background-color: rgba(30, 30, 30, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.interactive-link {
  color: #1565c0;
  transition: filter 0.2s ease-out;
}
.interactive-link:hover {
  filter: brightness(1.2);
}
.body--dark .interactive-link {
  color: #64b5f6;
}

.bg-custom-blue {
  background: #1565c0 !important;
  color: white !important;
}
</style>
