<template>
  <q-card class="settings-card q-pa-xl q-mb-xl" flat bordered>
    <div class="row items-center justify-between q-mb-lg">
      <div class="row items-center q-gutter-md">
        <q-icon name="settings" size="28px" color="primary" class="settings-icon" />
        <div class="text-h5 text-weight-bold header-title">Settings</div>
      </div>
      <q-btn
        flat
        label="Save Changes"
        color="primary"
        :disable="!hasChanges"
        @click="saveSettings"
        class="save-btn"
        icon="save"
        aria-label="Save settings changes"
      >
        <q-tooltip class="professional-tooltip" anchor="top middle" self="bottom middle" :offset="[10, 10]">
          Save Settings
        </q-tooltip>
      </q-btn>
    </div>

    <q-separator class="q-my-lg separator" />

    <!-- Profile Preferences -->
    <q-expansion-item
      expand-separator
      header-class="settings-header"
      default-opened
      label="Profile Preferences"
      caption="Manage your profile visibility and public info"
      icon="person_outline"
      aria-label="Profile preferences section"
    >
      <q-card flat class="section-card">
        <q-card-section class="section-content">
          <q-toggle 
  v-model="profilePublic" 
  label="Make profile public" 
  @update:model-value="toggleStatus" 
/>

          <q-input
            v-model="displayName"
            label="Display Name"
            outlined
            dense
            class="q-mt-lg input-field"
            :rules="[val => !!val || 'Display name is required']"
            aria-label="Enter display name"
          />
        </q-card-section>
      </q-card>
    </q-expansion-item>

    <!-- Notification Settings -->
    <q-expansion-item
      expand-separator
      header-class="settings-header"
      label="Notification Settings"
      caption="Control how you receive updates"
      icon="notifications"
      aria-label="Notification settings section"
    >
      <q-card flat class="section-card">
        <q-card-section class="section-content">
          <div class="row q-gutter-lg items-center">
            <q-toggle
              v-model="emailNotifications"
              label="Email Notifications"
              color="primary"
              class="settings-toggle"
              aria-label="Toggle email notifications"
            />
            <q-toggle
              v-model="pushNotifications"
              label="Push Notifications"
              color="primary"
              class="settings-toggle"
              aria-label="Toggle push notifications"
            />
          </div>
        </q-card-section>
      </q-card>
    </q-expansion-item>

    <!-- Account Management -->
    <q-expansion-item
      expand-separator
      header-class="settings-header"
      label="Account Management"
      caption="Update credentials or manage your account"
      icon="manage_accounts"
      aria-label="Account management section"
    >
      <q-card flat class="section-card">
        <q-card-section class="section-content">
          <q-input
            v-model="email"
            label="Email Address"
            outlined
            dense
            readonly
            class="q-mb-lg input-field"
            aria-label="User email address (read-only)"
          />
          <q-input
            v-model="newPassword"
            label="New Password"
            type="password"
            outlined
            dense
            class="q-mb-lg input-field"
            :rules="[val => val.length >= 6 || 'Password must be at least 6 characters']"
            aria-label="Enter new password"
          />
          <q-input
            v-model="confirmPassword"
            label="Confirm Password"
            type="password"
            outlined
            dense
            class="q-mb-lg input-field"
            :rules="[val => val === newPassword.value || 'Passwords must match']"
            aria-label="Confirm new password"
          />
          <q-btn
            flat
            label="Save Password"
            color="primary"
            icon="save"
            :disable="!canSavePassword"
            @click="savePassword"
            class="q-mb-lg save-password-btn"
            aria-label="Save new password"
          >
            <q-tooltip class="professional-tooltip" anchor="top middle" self="bottom middle" :offset="[10, 10]">
              Save Password
            </q-tooltip>
          </q-btn>

          <q-separator class="q-my-lg" />

          <q-btn
            flat
            label="Delete Account"
            color="negative"
            icon="delete_forever"
            @click="confirmDelete"
            class="delete-btn"
            aria-label="Delete account"
          >
            <q-tooltip class="professional-tooltip" anchor="top middle" self="bottom middle" :offset="[10, 10]">
              Delete Account
            </q-tooltip>
          </q-btn>
        </q-card-section>
      </q-card>
    </q-expansion-item>

    <!-- Confirmation Dialog -->
    <q-dialog v-model="showDeleteConfirm" persistent>
      <q-card class="delete-confirm-card">
        <q-card-section class="row items-center">
          <q-icon name="warning_amber" color="negative" size="36px" class="q-mr-md" />
          <div class="text-h6 text-weight-medium">Confirm Account Deletion</div>
        </q-card-section>
        <q-card-section class="text-body2 text-grey-8">
          This action cannot be undone. Are you sure you want to delete your account?
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup aria-label="Cancel account deletion" />
          <q-btn flat label="Delete" color="negative" @click="deleteAccount" v-close-popup aria-label="Confirm account deletion" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { passwordService } from '../services/password.service'
import { jobSeekerProfileService } from 'src/services/profile.service';
import { authHelpers } from 'src/services/auth.service'

const $q = useQuasar()
const profilePublic = ref(false);

const userId = authHelpers.getCurrentUser()?.id

// State
const email = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const savingPassword = ref(false)

// Validation
const canSavePassword = computed(() => {
  return (
    newPassword.value.length > 0 &&
    confirmPassword.value.length > 0 &&
    newPassword.value === confirmPassword.value
  )
})
const toggleStatus = async () => {
  const newStatus = profilePublic.value ? 'active' : 'inactive';
const res = await jobSeekerProfileService.updateStatus(userId, newStatus);


  if (res.success) {
    $q.notify({ type: 'positive', message: `Status updated to ${newStatus}` });
  } else {
    $q.notify({ type: 'negative', message: 'Failed to update status' });
    profilePublic.value = !profilePublic.value; // revert if failed
  }
};

// Load email from profile API
onMounted(async () => {
  const res = await jobSeekerProfileService.getProfile(userId); // <-- fetch, don't update

  if (res.success) {
    email.value = res.data.email;
    profilePublic.value = res.data.status === 'active';
  } else {
    $q.notify({ type: 'negative', message: 'Failed to load profile info' });
  }
});


// Save password
const savePassword = async () => {
  try {
    savingPassword.value = true
    await passwordService.updatePassword(
      email.value,
      newPassword.value,
      confirmPassword.value
    )
    $q.notify({ type: 'positive', message: 'Password updated successfully' })
    newPassword.value = ''
    confirmPassword.value = ''
  } catch (err) {
    $q.notify({
      type: 'negative',
      message: err.response?.data?.message || 'Failed to update password'
    })
  } finally {
    savingPassword.value = false
  }
}
</script>



<style scoped>
.settings-card {
  border-radius: 20px;
  background: linear-gradient(145deg, #ffffff 0%, #f1f5f9 100%);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  max-width: 1000px;
  margin: 48px auto;
  padding: 40px;
  transition: transform 0.4s ease, box-shadow 0.4s ease;
}

.settings-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}

.header-title {
  font-size: 26px;
  font-weight: 700;
  background: linear-gradient(135deg, #1e40af, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.settings-icon {
  transition: transform 0.3s ease;
}

.settings-icon:hover {
  transform: rotate(30deg);
}

.separator {
  background: linear-gradient(to right, #e2e8f0, #3b82f6, #e2e8f0);
  height: 2px;
}

.settings-header {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  padding: 16px 24px;
  border-radius: 12px;
  transition: background-color 0.3s ease;
}

.settings-header:hover {
  background: #eff6ff;
}

.section-card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
}

.section-card:hover {
  transform: translateY(-2px);
}

.section-content {
  padding: 24px 32px;
}

.settings-toggle {
  font-size: 15px;
  color: #1e293b;
  transition: transform 0.3s ease;
}

.settings-toggle:hover {
  transform: translateX(4px);
}

.input-field {
  margin-bottom: 24px;
}

.input-field .q-field__control {
  border-radius: 10px;
  background: #f8fafc;
  transition: border-color 0.3s ease;
}

.input-field:hover .q-field__control {
  border-color: #3b82f6;
}

.save-btn {
  padding: 10px 24px;
  border-radius: 12px;
  font-weight: 600;
  background: linear-gradient(135deg, #154899, #1e40af);
  color: #ffffff;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.save-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.save-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.save-password-btn {
  padding: 8px 20px;
  border-radius: 10px;
  font-weight: 600;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.save-password-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.delete-btn {
  padding: 8px 20px;
  border-radius: 10px;
  font-weight: 600;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.delete-btn:hover {
  background: #fef2f2;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
}

.delete-confirm-card {
  width: 480px;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  background: #ffffff;
}

.professional-tooltip {
  background: #1e293b;
  color: #ffffff;
  font-size: 13px;
  padding: 10px 14px;
  border-radius: 10px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

/* Responsive Design */
@media (max-width: 768px) {
  .settings-card {
    max-width: 100%;
    padding: 28px;
    border-radius: 14px;
    margin: 32px auto;
  }

  .section-content {
    padding: 16px 20px;
  }

  .header-title {
    font-size: 22px;
  }

  .settings-header {
    font-size: 16px;
    padding: 12px 20px;
  }

  .delete-confirm-card {
    width: 90%;
  }

  .input-field {
    margin-bottom: 16px;
  }
}

@media (max-width: 480px) {
  .settings-card {
    padding: 20px;
  }

  .section-content .row {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .header-title {
    font-size: 20px;
  }

  .settings-toggle {
    font-size: 14px;
  }

  .save-btn, .save-password-btn, .delete-btn {
    width: 100%;
    text-align: center;
  }
}

/* Accessibility */
.settings-header:focus-visible,
.settings-toggle:focus-visible,
.save-btn:focus-visible,
.save-password-btn:focus-visible,
.delete-btn:focus-visible {
  outline: 3px solid #3b82f6;
  outline-offset: 3px;
}

@media (prefers-contrast: high) {
  .settings-card {
    border: 2px solid #1e3a8a;
  }

  .header-title {
    -webkit-text-fill-color: #1e40af;
    background: none;
  }

  .settings-header {
    color: #1e3a8a;
    font-weight: 700;
  }

  .save-btn, .save-password-btn, .delete-btn {
    border: 2px solid #1e40af;
  }

  .separator {
    background: #1e40af;
  }
}

@media (prefers-reduced-motion: reduce) {
  .settings-card,
  .section-card,
  .settings-icon,
  .settings-toggle,
  .save-btn,
  .save-password-btn,
  .delete-btn {
    transition: none;
  }
}
</style>