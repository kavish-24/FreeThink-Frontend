<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin" style="width: 600px; max-width: 90vw;">
      <q-card-section class="bg-primary text-white row items-center">
        <q-avatar size="64px" color="white" text-color="primary" class="q-mr-md">
          {{ user.firstName.charAt(0) }}{{ user.lastName.charAt(0) }}
        </q-avatar>
        <div>
          <div class="text-h6">{{ user.firstName }} {{ user.lastName }}</div>
          <div class="text-subtitle2 opacity-8">{{ user.email }}</div>
        </div>
        <q-space />
        <q-btn icon="close" flat round dense @click="onDialogCancel" />
      </q-card-section>

      <q-tabs
        v-model="tab"
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="details" icon="person" label="Personal Details" />
        <q-tab name="applications" icon="work" label="Recent Applications">
           <q-badge v-if="user.applications && user.applications.length" color="orange" floating>{{ user.applications.length }}</q-badge>
        </q-tab>
      </q-tabs>
      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="details">
          <q-list bordered separator>
            <q-item>
              <q-item-section avatar><q-icon color="grey-7" name="badge" /></q-item-section>
              <q-item-section><q-item-label overline>Full Name</q-item-label></q-item-section>
              <q-item-section side>{{ user.firstName }} {{ user.lastName }}</q-item-section>
            </q-item>
            <q-item>
              <q-item-section avatar><q-icon color="grey-7" name="phone" /></q-item-section>
              <q-item-section><q-item-label overline>Phone</q-item-label></q-item-section>
              <q-item-section side>{{ user.phone }}</q-item-section>
            </q-item>
            <q-item>
              <q-item-section avatar><q-icon color="grey-7" name="event" /></q-item-section>
              <q-item-section><q-item-label overline>Date Joined</q-item-label></q-item-section>
              <q-item-section side>{{ formatDate(user.registered) }}</q-item-section>
            </q-item>
             <q-item>
              <q-item-section avatar><q-icon color="grey-7" :name="user.status === 'Active' ? 'toggle_on' : 'toggle_off'" /></q-item-section>
              <q-item-section><q-item-label overline>Account Status</q-item-label></q-item-section>
              <q-item-section side>
                 <q-chip
                  :color="user.status === 'Active' ? 'green-2' : 'red-2'"
                  :text-color="user.status === 'Active' ? 'green-9' : 'red-9'"
                  size="md"
                >
                  {{ user.status }}
                </q-chip>
              </q-item-section>
            </q-item>
          </q-list>
        </q-tab-panel>

        <q-tab-panel name="applications">
          <div v-if="!user.applications || user.applications.length === 0" class="text-center text-grey-7 q-pa-lg">
            <q-icon name="info_outline" size="3em" class="q-mb-sm" />
            <div>This user has not submitted any applications yet.</div>
          </div>
          <q-list v-else bordered separator>
            <q-item v-for="(app, index) in user.applications" :key="index">
              <q-item-section avatar>
                <q-avatar color="grey-2" text-color="primary" icon="work_outline" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-medium">{{ app.jobTitle }}</q-item-label>
                <q-item-label caption><q-icon name="business" size="xs" class="q-mr-xs"/>{{ app.companyName }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-tab-panel>
      </q-tab-panels>

      <q-card-actions align="right" class="q-pa-md bg-grey-1">
        <q-btn color="primary" label="Close" @click="onDialogCancel" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent } from 'quasar';
import { ref } from 'vue';
import { date } from 'quasar';

// This defines the `user` object that gets passed into the component
defineProps({
  user: {
    type: Object,
    required: true
  }
});

const tab = ref('details');

const formatDate = (dateString) => date.formatDate(dateString, 'dddd, MMMM D, YYYY');

// Standard Quasar setup for a dialog component
defineEmits([
  ...useDialogPluginComponent.emits
]);

// 'onDialogOK' has been removed from this line
const { dialogRef, onDialogHide, onDialogCancel } = useDialogPluginComponent();
</script>

<style scoped>
.opacity-8 {
  opacity: 0.8;
}
.q-dialog-plugin {
  border-radius: 12px;
  overflow: hidden;
}
</style>