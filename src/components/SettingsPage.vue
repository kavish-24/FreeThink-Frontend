<template>
  <div class="settings-page">
    <AppHeader />
    
    <div class="settings-container">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-content">
          <q-btn
            flat
            round
            icon="arrow_back"
            color="white"
            @click="$router.push('/')"
            class="back-btn"
          >
            <q-tooltip class="bg-grey-8">Back to Homepage</q-tooltip>
          </q-btn>
          <div class="header-text">
            <h1 class="page-title">
              <q-icon name="settings" class="title-icon" />
              Settings
            </h1>
            <p class="page-subtitle">Manage your account preferences and settings</p>
          </div>
        </div>
      </div>

      <div class="content-grid">
        <!-- Profile Preferences Card -->
        <div class="settings-card">
          <div class="card-header">
            <div class="card-title">
              <q-icon name="person_outline" class="header-icon" />
              <span>Profile Preferences</span>
            </div>
          </div>
          <div class="card-body">
            <div class="setting-item">
              <div class="setting-info">
                <div class="setting-label">Make Profile Public</div>
                <div class="setting-description">Allow recruiters and companies to view your profile</div>
              </div>
              <q-toggle 
                v-model="profilePublic" 
                color="primary"
                size="lg"
                @update:model-value="toggleStatus"
              />
            </div>
            <q-separator class="my-separator" />
            <div class="setting-item">
              <div class="setting-info full-width">
                <div class="setting-label">Display Name</div>
                <q-input
                  v-model="displayName"
                  outlined
                  dense
                  placeholder="Enter your display name"
                  class="modern-input"
                  :rules="[val => !!val || 'Display name is required']"
                >
                  <template v-slot:prepend>
                    <q-icon name="badge" />
                  </template>
                </q-input>
              </div>
            </div>
          </div>
        </div>

        <!-- Notification Settings Card -->
        <div class="settings-card">
          <div class="card-header">
            <div class="card-title">
              <q-icon name="notifications" class="header-icon" />
              <span>Notification Settings</span>
            </div>
          </div>
          <div class="card-body">
            <div class="setting-item">
              <div class="setting-info">
                <div class="setting-label">Email Notifications</div>
                <div class="setting-description">Receive job alerts and updates via email</div>
              </div>
              <q-toggle 
                v-model="emailNotifications" 
                color="primary"
                size="lg"
              />
            </div>
            <q-separator class="my-separator" />
            <div class="setting-item">
              <div class="setting-info">
                <div class="setting-label">Push Notifications</div>
                <div class="setting-description">Get instant updates on your device</div>
              </div>
              <q-toggle 
                v-model="pushNotifications" 
                color="primary"
                size="lg"
              />
            </div>
          </div>
        </div>

        <!-- Account Security Card -->
        <div class="settings-card full-width">
          <div class="card-header">
            <div class="card-title">
              <q-icon name="lock" class="header-icon" />
              <span>Account Security</span>
            </div>
          </div>
          <div class="card-body">
            <div class="security-section">
              <div class="setting-label">Email Address</div>
              <q-input
                v-model="email"
                outlined
                dense
                readonly
                class="modern-input"
                disable
              >
                <template v-slot:prepend>
                  <q-icon name="email" />
                </template>
              </q-input>
            </div>

            <q-separator class="my-separator" />

            <div class="security-section">
              <div class="setting-label">Change Password</div>
              <div class="password-inputs">
                <q-input
                  v-model="newPassword"
                  type="password"
                  outlined
                  dense
                  placeholder="New password (min. 6 characters)"
                  class="modern-input"
                  :rules="[val => !val || val.length >= 6 || 'Password must be at least 6 characters']"
                >
                  <template v-slot:prepend>
                    <q-icon name="lock_open" />
                  </template>
                </q-input>
                <q-input
                  v-model="confirmPassword"
                  type="password"
                  outlined
                  dense
                  placeholder="Confirm new password"
                  class="modern-input"
                  :rules="[val => !val || val === newPassword || 'Passwords must match']"
                >
                  <template v-slot:prepend>
                    <q-icon name="lock" />
                  </template>
                </q-input>
              </div>
              <q-btn
                unelevated
                label="Update Password"
                color="primary"
                icon="save"
                :disable="!canSavePassword"
                :loading="savingPassword"
                @click="savePassword"
                class="update-btn"
                no-caps
              />
            </div>

            <q-separator class="my-separator" />

            <div class="security-section">
              <div class="setting-label danger-label">Danger Zone</div>
              <div class="danger-zone">
                <div class="danger-info">
                  <q-icon name="warning" size="24px" color="negative" />
                  <div class="danger-text">
                    <div class="danger-title">Delete Account</div>
                    <div class="danger-description">Once you delete your account, there is no going back. Please be certain.</div>
                  </div>
                </div>
                <q-btn
                  outline
                  label="Delete Account"
                  color="negative"
                  icon="delete_forever"
                  @click="confirmDelete"
                  class="danger-btn"
                  no-caps
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Save Section -->
        <div class="save-section" v-if="hasChanges">
          <div class="save-card">
            <div class="save-info">
              <q-icon name="info" size="24px" color="primary" />
              <span>You have unsaved changes</span>
            </div>
            <div class="save-actions">
              <q-btn
                flat
                label="Discard"
                color="grey-7"
                @click="discardChanges"
                no-caps
              />
              <q-btn
                unelevated
                label="Save All Changes"
                color="primary"
                icon="save"
                @click="saveSettings"
                :loading="saving"
                no-caps
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Dialog -->
    <q-dialog v-model="showDeleteConfirm" persistent>
      <q-card class="delete-dialog">
        <q-card-section class="dialog-header">
          <q-icon name="warning_amber" color="negative" size="48px" />
        </q-card-section>
        
        <q-card-section class="dialog-content">
          <h3 class="dialog-title">Delete Account?</h3>
          <p class="dialog-text">
            This action cannot be undone. All your data, including your profile, applications, and saved jobs will be permanently deleted.
          </p>
        </q-card-section>
        
        <q-card-actions align="right" class="dialog-actions">
          <q-btn 
            flat 
            label="Cancel" 
            color="grey-7" 
            v-close-popup 
            no-caps
          />
          <q-btn 
            unelevated
            label="Yes, Delete My Account" 
            color="negative" 
            @click="deleteAccount" 
            v-close-popup 
            no-caps
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { passwordService } from '../services/password.service'
import { jobSeekerProfileService } from 'src/services/profile.service'
import { authHelpers } from 'src/services/auth.service'
import AppHeader from './HeaderPart.vue'

const $q = useQuasar()
const userId = authHelpers.getCurrentUser()?.id

// State
const profilePublic = ref(false)
const displayName = ref('')
const emailNotifications = ref(true)
const pushNotifications = ref(true)
const email = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const savingPassword = ref(false)
const saving = ref(false)
const showDeleteConfirm = ref(false)

// Original values for change detection
const originalSettings = ref({})

// Computed
const hasChanges = computed(() => {
  return (
    profilePublic.value !== originalSettings.value.profilePublic ||
    displayName.value !== originalSettings.value.displayName ||
    emailNotifications.value !== originalSettings.value.emailNotifications ||
    pushNotifications.value !== originalSettings.value.pushNotifications
  )
})

const canSavePassword = computed(() => {
  return (
    newPassword.value.length >= 6 &&
    confirmPassword.value.length >= 6 &&
    newPassword.value === confirmPassword.value
  )
})

// Load profile data
onMounted(async () => {
  try {
    const res = await jobSeekerProfileService.getProfile(userId)
    
    if (res.success) {
      email.value = res.data.email
      profilePublic.value = res.data.status === 'active'
      displayName.value = res.data.firstName + ' ' + res.data.lastName || ''
      
      // Store original values
      originalSettings.value = {
        profilePublic: profilePublic.value,
        displayName: displayName.value,
        emailNotifications: emailNotifications.value,
        pushNotifications: pushNotifications.value
      }
    } else {
      $q.notify({ type: 'negative', message: 'Failed to load profile info' })
    }
  } catch (error) {
    console.error('Error loading profile:', error)
    $q.notify({ type: 'negative', message: 'Failed to load settings' })
  }
})

// Toggle profile status
const toggleStatus = async () => {
  const newStatus = profilePublic.value ? 'active' : 'inactive'
  
  try {
    const res = await jobSeekerProfileService.updateStatus(userId, newStatus)
    
    if (res.success) {
      $q.notify({ 
        type: 'positive', 
        message: `Profile is now ${profilePublic.value ? 'public' : 'private'}` 
      })
    } else {
      throw new Error('Failed to update status')
    }
  } catch (err) {
    $q.notify({ 
      type: 'negative', 
      message: err.response?.data?.message || 'Failed to update profile status' 
    })
    profilePublic.value = !profilePublic.value // revert
  }
}

// Save all settings
const saveSettings = async () => {
  saving.value = true
  
  try {
    // Update profile status if changed
    if (profilePublic.value !== originalSettings.value.profilePublic) {
      await toggleStatus()
    }
    
    // Here you can add more save logic for notifications, etc.
    
    $q.notify({ 
      type: 'positive', 
      message: 'Settings saved successfully',
      icon: 'check_circle'
    })
    
    // Update original settings
    originalSettings.value = {
      profilePublic: profilePublic.value,
      displayName: displayName.value,
      emailNotifications: emailNotifications.value,
      pushNotifications: pushNotifications.value
    }
  } catch (error) {
    console.error('Error saving settings:', error)
    $q.notify({ type: 'negative', message: 'Failed to save settings' })
  } finally {
    saving.value = false
  }
}

// Discard changes
const discardChanges = () => {
  profilePublic.value = originalSettings.value.profilePublic
  displayName.value = originalSettings.value.displayName
  emailNotifications.value = originalSettings.value.emailNotifications
  pushNotifications.value = originalSettings.value.pushNotifications
  
  $q.notify({ 
    type: 'info', 
    message: 'Changes discarded',
    icon: 'undo'
  })
}

// Save password
const savePassword = async () => {
  if (!canSavePassword.value) return
  
  try {
    savingPassword.value = true
    
    const result = await passwordService.updatePassword(
      email.value,
      newPassword.value,
      confirmPassword.value
    )
    
    if (result.success) {
      $q.notify({ 
        type: 'positive', 
        message: 'Password updated successfully',
        icon: 'check_circle'
      })
      newPassword.value = ''
      confirmPassword.value = ''
    } else {
      throw new Error(result.message || 'Failed to update password')
    }
  } catch (err) {
    console.error('Error updating password:', err)
    $q.notify({
      type: 'negative',
      message: err.response?.data?.message || err.message || 'Failed to update password',
      icon: 'error'
    })
  } finally {
    savingPassword.value = false
  }
}

// Confirm delete
const confirmDelete = () => {
  showDeleteConfirm.value = true
}

// Delete account
const deleteAccount = () => {
  $q.notify({
    type: 'warning',
    message: 'Account deletion functionality will be implemented soon',
    icon: 'info'
  })
  // TODO: Implement account deletion API call
}
</script>

<style scoped>
.settings-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  padding-bottom: 40px;
}

.settings-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* Page Header */
.page-header {
  background: linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 100%);
  border-radius: 24px;
  padding: 40px;
  margin-bottom: 30px;
  box-shadow: 0 10px 40px rgba(14, 165, 233, 0.3);
  animation: fadeInDown 0.6s ease;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.header-content {
  display: flex;
  align-items: center;
  gap: 24px;
}

.back-btn {
  flex-shrink: 0;
}

.header-text {
  flex: 1;
}

.page-title {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 36px;
  font-weight: 700;
  color: white;
  margin: 0 0 8px 0;
}

.title-icon {
  font-size: 40px;
}

.page-subtitle {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
}

/* Content Grid */
.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 24px;
  animation: fadeIn 0.8s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.settings-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  animation: slideUp 0.6s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.settings-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.settings-card.full-width {
  grid-column: 1 / -1;
}

.card-header {
  background: linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 100%);
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 12px;
  color: white;
  font-size: 20px;
  font-weight: 600;
}

.header-icon {
  font-size: 24px;
}

.card-body {
  padding: 24px;
}

/* Setting Items */
.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.setting-info {
  flex: 1;
}

.setting-info.full-width {
  width: 100%;
}

.setting-label {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
}

.setting-description {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
}

.my-separator {
  margin: 20px 0;
}

/* Modern Input */
.modern-input {
  margin-top: 8px;
}

/* Security Section */
.security-section {
  margin-bottom: 24px;
}

.security-section:last-child {
  margin-bottom: 0;
}

.password-inputs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin: 16px 0;
}

.update-btn {
  margin-top: 8px;
  font-weight: 600;
}

/* Danger Zone */
.danger-label {
  color: #dc2626;
  display: flex;
  align-items: center;
  gap: 8px;
}

.danger-zone {
  background: #fef2f2;
  border: 2px solid #fecaca;
  border-radius: 12px;
  padding: 20px;
  margin-top: 16px;
}

.danger-info {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.danger-text {
  flex: 1;
}

.danger-title {
  font-size: 16px;
  font-weight: 600;
  color: #991b1b;
  margin-bottom: 4px;
}

.danger-description {
  font-size: 14px;
  color: #7f1d1d;
  line-height: 1.5;
}

.danger-btn {
  font-weight: 600;
  border-width: 2px;
}

/* Save Section */
.save-section {
  grid-column: 1 / -1;
  position: sticky;
  bottom: 20px;
  z-index: 100;
  animation: slideInUp 0.4s ease;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.save-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  border: 2px solid #0ea5e9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.save-info {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.save-actions {
  display: flex;
  gap: 12px;
}

/* Delete Dialog */
.delete-dialog {
  width: 500px;
  max-width: 90vw;
  border-radius: 16px;
  overflow: hidden;
}

.dialog-header {
  text-align: center;
  padding: 32px 24px 16px;
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
}

.dialog-content {
  padding: 24px;
  text-align: center;
}

.dialog-title {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 12px 0;
}

.dialog-text {
  font-size: 15px;
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
}

.dialog-actions {
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
}

/* Responsive */
@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .settings-container {
    padding: 16px;
  }

  .page-header {
    padding: 24px;
    border-radius: 16px;
  }

  .page-title {
    font-size: 28px;
  }

  .title-icon {
    font-size: 32px;
  }

  .page-subtitle {
    font-size: 14px;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .card-body {
    padding: 16px;
  }

  .setting-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .password-inputs {
    grid-template-columns: 1fr;
  }

  .save-card {
    flex-direction: column;
    align-items: stretch;
  }

  .save-actions {
    flex-direction: column;
  }

  .save-actions .q-btn {
    width: 100%;
  }

  .danger-info {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 24px;
  }

  .card-title {
    font-size: 18px;
  }

  .dialog-title {
    font-size: 20px;
  }
}
</style>