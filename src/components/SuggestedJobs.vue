<template>
  <q-card class="q-pa-md q-ma-md" style="max-width: 900px; margin: auto;">
    <div class="text-h6 q-mb-md">Suggested for You</div>

    <q-timeline color="primary" side="right" layout="dense" v-if="suggestedJobs.length">
      <q-timeline-entry
        v-for="job in suggestedJobs"
        :key="job.jobId"
        :title="job.title"
        :subtitle="`${job.company} · ${job.location}`"
        :icon="job.match > 0.5 ? 'check_circle' : 'work'"
        :color="job.match > 0.5 ? 'green' : 'grey'"
      >

        <q-linear-progress
          :value="job.match"
          size="xs"
          color="primary"
          class="q-mb-sm"
        />

        <div class="q-gutter-sm">
          <q-btn
            label="View"
            flat
            dense
            color="primary"
            @click="goToJob(job.jobId)"
          />
          <q-btn
            label="Apply"
            dense
            color="green"
            @click="applyToJob(job.jobId)"
          />
        </div>
      </q-timeline-entry>
    </q-timeline>

    <div v-else class="text-subtitle2 text-grey text-center q-mt-md">
      No job suggestions available.
    </div>
  </q-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import suggestService from '../services/suggest.service';
import { authHelpers } from '../services/auth.service';

const router = useRouter();
const suggestedJobs = ref([]);

const goToJob = (jobId) => {
  router.push(`/job/${jobId}`);
};

const applyToJob = (jobId) => {
  console.log(`Applying to job ID: ${jobId}`);
};

onMounted(async () => {
  const user = authHelpers.getCurrentUser();
  if (!user) return;

  const result = await suggestService.getSuggestions(user.id);
  console.log('Suggested jobs:', result);

  if (result.success && Array.isArray(result.data)) {
    suggestedJobs.value = result.data;
  } else {
    suggestedJobs.value = [];
  }
});
</script>