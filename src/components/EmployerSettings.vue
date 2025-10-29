<template>
<div class="portal-layout">
<AppHeader class="sticky-header" />
  <div class="page-wrapper row no-wrap">
    <EmployerSidebar :active-link="selected" @navigate="(label) => selected = label" />

    <div class="content-area column q-pa-md q-pa-lg-lg">
      <div class="settings-container">
        <div class="row items-center justify-between q-mb-md q-px-sm">
          <div class="text-h5 text-weight-bold content-title">
            Settings
          </div>
          <q-btn
            unelevated
            label="Save Changes"
            color="primary"
            :disable="!hasChanges"
            :loading="isSaving"
            @click="saveSettings"
            padding="xs lg"
            icon="save"
          />
        </div>

        <div class="settings-card-container">
          <div class="row">
            <div class="col-12 col-md-3">
              <q-tabs v-model="tab" vertical class="settings-tabs" active-bg-color="blue-1" indicator-color="primary">
                <q-tab
                  v-for="settingTab in settingTabs"
                  :key="settingTab.name"
                  :name="settingTab.name"
                  :icon="settingTab.icon"
                  :label="settingTab.label"
                  align="left"
                  class="settings-tab-item"
                />
              </q-tabs>
            </div>

            <div class="col-12 col-md-9">
              <q-tab-panels v-model="tab" animated class="settings-panels">
                <q-tab-panel name="profile">
                  <div class="panel-header">
                    <div class="text-h6 panel-title">Profile Preferences</div>
                    <p class="panel-caption">Manage your profile visibility and public information.</p>
                  </div>
                  <q-separator class="q-mb-lg" />
                  <q-input v-model="settings.displayName" label="Company Display Name" filled class="q-mb-md" />
                  <q-toggle v-model="settings.profilePublic" label="Make my company profile public to job seekers" color="primary"/>
                </q-tab-panel>

                <q-tab-panel name="notifications">
                  <div class="panel-header">
                    <div class="text-h6 panel-title">Notification Settings</div>
                    <p class="panel-caption">Choose how you want to be notified about important activities.</p>
                  </div>
                  <q-separator class="q-mb-lg" />
                  <q-list separator>
                    <q-item v-for="pref in notificationPrefs" :key="pref.key" class="q-py-md">
                      <q-item-section>
                        <q-item-label class="list-item-title">{{ pref.label }}</q-item-label>
                        <q-item-label caption class="panel-caption">{{ pref.caption }}</q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <div class="row items-center q-gutter-x-sm">
                          <q-toggle dense v-model="settings.notifications[pref.key].email" color="primary" icon="email" title="Email"/>
                          <q-toggle dense v-model="settings.notifications[pref.key].sms" color="primary" icon="sms" title="SMS"/>
                          <q-toggle dense v-model="settings.notifications[pref.key].push" color="primary" icon="notifications_active" title="Push"/>
                        </div>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-tab-panel>

                <q-tab-panel name="account" class="q-gutter-y-xl">
                  <div>
                    <div class="text-h6 panel-title">Change Password</div>
                    <q-separator class="q-my-sm" />
                    <q-input v-model="newPassword" label="New Password" type="password" filled />
                    <q-input v-model="confirmPassword" label="Confirm Password" type="password" filled class="q-mt-sm" />
                    <q-btn unelevated color="primary" label="Update Password" class="q-mt-md" :disable="!canSavePassword" @click="savePassword" />
                  </div>
                  <div>
                     <div class="text-h6 panel-title">Manage Login Devices</div>
                     <q-separator class="q-my-sm" />
                     <q-list separator>
                       <q-item v-for="device in loginDevices" :key="device.id">
                         <q-item-section avatar>
                           <q-icon :name="device.icon" size="md" color="blue-grey-5" />
                         </q-item-section>
                         <q-item-section>
                           <q-item-label class="list-item-title">{{ device.name }}</q-item-label>
                           <q-item-label caption class="panel-caption">
                             {{ device.location }} | Last active: {{ device.lastActive }}
                             <q-badge v-if="device.isCurrent" color="positive" label="Current device" class="q-ml-sm" />
                           </q-item-label>
                         </q-item-section>
                         <q-item-section side>
                           <q-btn flat dense round icon="logout" color="negative" @click="logoutDevice(device.id)" :disable="device.isCurrent">
                             <q-tooltip>Log Out Device</q-tooltip>
                           </q-btn>
                         </q-item-section>
                       </q-item>
                     </q-list>
                  </div>
                  <q-card flat class="danger-zone">
                    <q-card-section>
                      <div class="text-h6 danger-title">Account Actions</div>
                      <div class="row items-center q-gutter-md q-mt-sm">
                        <q-btn outline color="orange-8" label="Deactivate Account" />
                      </div>
                    </q-card-section>
                  </q-card>
                </q-tab-panel>
              </q-tab-panels>
            </div>
          </div>
        </div>
      </div>

      <q-dialog v-model="showChangeEmailDialog">
        <q-card style="width: 450px">
          <q-card-section>
            <div class="text-h6">Change Email Address</div>
          </q-card-section>
          <q-card-section class="q-gutter-y-md">
            <p class="panel-caption">For security, please enter your current password to make this change.</p>
            <q-input v-model="newEmail" label="New Email Address" type="email" filled />
            <q-input v-model="currentPassword" label="Current Password" type="password" filled />
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cancel" v-close-popup />
            <q-btn unelevated label="Submit Change" color="primary" @click="changeEmail" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive, watch } from 'vue';
import { useQuasar } from 'quasar';
import AppHeader from 'src/components/HeaderPart.vue';
import EmployerSidebar from 'src/components/EmployerSidebar.vue';
const $q = useQuasar();
// --- SCRIPT IS UNCHANGED, ONLY STYLES HAVE BEEN MODIFIED ---
const employer = ref({});
const selected = ref('Settings');
const tab = ref('profile');

const settingTabs = [
    { name: 'profile', icon: 'person', label: 'Profile' },
    { name: 'notifications', icon: 'notifications', label: 'Notifications' },
    { name: 'account', icon: 'manage_accounts', label: 'Account' }
];
const settings = reactive({
  profilePublic: true,
  displayName: '',
  email: '',
  notifications: {
    newApplication: { email: true, sms: false, push: true },
    jobExpiry: { email: true, sms: true, push: false },
    interviewScheduled: { email: true, sms: true, push: true },
  }
});
const notificationPrefs = ref([
    { key: 'newApplication', label: 'New Application Received', caption: 'When a candidate applies to one of your jobs.'},
    { key: 'jobExpiry', label: 'Job Expiry Reminders', caption: 'A reminder 3 days before a job posting expires.'},
    { key: 'interviewScheduled', label: 'Interview Scheduled', caption: 'When a candidate confirms an interview time.'},
]);
const loginDevices = ref([
    { id: 1, name: 'Chrome on Windows', location: 'Pune, India', lastActive: 'Active now', icon: 'desktop_windows', isCurrent: true },
    { id: 2, name: 'iPhone 14 Pro', location: 'Mumbai, India', lastActive: '2 hours ago', icon: 'phone_iphone' },
]);
const originalSettings = reactive({});
const newPassword = ref('');
const confirmPassword = ref('');

const isSaving = ref(false);

const newEmail = ref('');
const currentPassword = ref('');

const hasChanges = computed(() => JSON.stringify(settings) !== JSON.stringify(originalSettings));
const canSavePassword = computed(() => newPassword.value.length >= 8 && newPassword.value === confirmPassword.value);

onMounted(() => {
  const stored = localStorage.getItem('employerData');
  if (stored) {
      employer.value = JSON.parse(stored);
      const storedSettings = localStorage.getItem('employerSettings');
      if (storedSettings) {
        Object.assign(settings, JSON.parse(storedSettings));
      }
      settings.displayName = employer.value.name;
      settings.email = employer.value.email;
      Object.assign(originalSettings, JSON.parse(JSON.stringify(settings)));
  }
});

const saveSettings = () => { isSaving.value = true; setTimeout(() => { Object.assign(originalSettings, JSON.parse(JSON.stringify(settings))); localStorage.setItem('employerSettings', JSON.stringify(settings)); $q.notify({ color: 'positive', message: 'Settings saved successfully!', icon: 'check_circle' }); isSaving.value = false; }, 1000); };
const savePassword = () => { $q.notify({ color: 'positive', message: 'Password changed successfully!', icon: 'lock' }); newPassword.value = ''; confirmPassword.value = ''; };


const logoutDevice = (id) => { loginDevices.value = loginDevices.value.filter(d => d.id !== id); $q.notify('Device has been logged out.'); };

watch(() => settings.displayName, (newName) => { if (newName) { employer.value.name = newName; }});
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
/* Page Wrapper & Content Area */
.page-wrapper { height: 100vh; background-color: #F0F7FF; }
.content-area { flex: 1; overflow-y: auto; }

/* UPDATED: Bluer Text Colors */
.content-title { color: #1E4267; }
.panel-title { color: #1E4267; }
.list-item-title { color: #10316B; }
.panel-caption,
:deep(.q-item__label--caption) {
  color: #4A6987;
}

.settings-container { max-width: 1000px; width: 100%; margin: 24px auto; }

/* Settings Card & Tabs */
.settings-card-container {
    background-color: #ffffff;
    border: 1px solid #DDE8F5;
    border-radius: 12px;
    box-shadow: 0 4px 25px rgba(13, 27, 42, 0.05);
    overflow: hidden;
}
.settings-tabs { background-color: #F8FBFF; }
.settings-tab-item {
    justify-content: flex-start;
    padding: 24px;
    font-weight: 500;
    color: #4A6987; /* Bluer inactive tab text */
}
:deep(.q-tab--active) .q-tab__label {
    color: #00529b; /* Primary blue active text */
    font-weight: 600;
}
:deep(.q-tab--active) .q-tab__indicator { background-color: #00529b; }

.settings-panels { padding: 24px; background-color: #ffffff; }

.q-list--separator > .q-item-type + .q-item-type { border-top: 1px solid #EDF2F7; }

/* Danger Zone */
.danger-zone { border: 1px solid #FFCDD2; background-color: #FFF8F8; border-radius: 8px; }
.danger-title { color: #C62828; }
</style>