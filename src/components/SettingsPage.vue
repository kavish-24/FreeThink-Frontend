<template>
  <q-card class="settings-card q-pa-lg q-mb-xl" flat>
    <div class="row items-center justify-between q-mb-lg">
      <div class="text-h5 text-weight-bold text-primary">
        <q-icon name="settings" class="q-mr-sm" size="24px" />
        Settings
      </div>
      <q-btn
        flat
        label="Save Changes"
        color="primary"
        :disable="!hasChanges"
        @click="saveSettings"
        class="save-btn"
      />
    </div>

    <q-separator />

    <!-- Profile Preferences -->
    <q-expansion-item
      expand-separator
      header-class="settings-header"
      default-opened
      label="Profile Preferences"
      caption="Manage your profile visibility and public info"
      icon="person_outline"
    >
      <q-card flat>
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
            class="q-mt-md"
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
    >
      <q-card flat>
        <q-card-section class="section-content">
            <div class="row q-gutter-md items-center">
                <q-toggle v-model="emailNotifications" label="Email Notifications" />
                <q-toggle v-model="pushNotifications" label="Push Notifications" />
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
    >
      <q-card flat>
        <q-card-section class="section-content">
          <q-input
            v-model="email"
            label="Email Address"
            outlined
            dense
            readonly
            class="q-mb-md"
            />

            <q-input
            v-model="newPassword"
            label="New Password"
            type="password"
            outlined
            dense
            class="q-mb-md"
            />

            <q-input
            v-model="confirmPassword"
            label="Confirm Password"
            type="password"
            outlined
            dense
            class="q-mb-md"
            />

            <q-btn
            flat
            label="Save Password"
            color="primary"
            icon="save"
            :disable="!canSavePassword"
            @click="savePassword"
            class="q-mb-md"
            />

            <q-separator class="q-my-md" />

            <q-btn
            flat
            label="Delete Account"
            color="negative"
            icon="delete_forever"
            @click="confirmDelete"
            class="delete-btn"
            />
        </q-card-section>
      </q-card>
    </q-expansion-item>
  </q-card>

  <!-- Confirmation Dialog -->
  <q-dialog v-model="showDeleteConfirm" persistent>
    <q-card class="delete-confirm-card">
      <q-card-section class="row items-center">
        <q-icon name="warning_amber" color="negative" size="32px" class="q-mr-sm" />
        <div class="text-h6">Confirm Account Deletion</div>
      </q-card-section>
      <q-card-section class="text-body2">
        This action cannot be undone. Are you sure you want to delete your account?
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" v-close-popup />
        <q-btn flat label="Delete" color="negative" @click="deleteAccount" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
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
  background: linear-gradient(to bottom right, #ffffff, #f8fbfd);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.07);
  max-width: 960px; /* Increased from 600px */
  width: 100%;
  margin: 40px auto;
  transition: box-shadow 0.3s, transform 0.3s;
  padding: 32px;
}


.settings-card:hover {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
  transform: translateY(-4px);
}

.settings-header {
  font-weight: 600;
  font-size: 17px;
  color: #2c3e50;
}

.section-content {
  padding: 16px 24px;
}

.save-btn {
  padding: 8px 22px;
  border-radius: 30px;
  font-weight: 500;
  transition: background-color 0.2s, transform 0.2s;
}

.save-btn:hover:not(:disabled) {
  background-color: #e3f2fd;
  transform: scale(1.04);
}

.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.delete-btn {
  padding: 6px 18px;
  border-radius: 20px;
  transition: background-color 0.3s, transform 0.2s;
}

.delete-btn:hover {
  background-color: #fdecea;
  transform: scale(1.03);
}

.delete-confirm-card {
  width: 420px;
  border-radius: 14px;
  padding: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
}

@media (max-width: 768px) {
  .settings-card {
    max-width: 100%;
    padding: 16px;
  }

  .section-content {
    padding: 12px 16px;
  }

  .delete-confirm-card {
    width: 90%;
  }
}

@media (max-width: 600px) {
  .section-content .row {
    flex-direction: column;
    align-items: start;
  }
}

</style>
