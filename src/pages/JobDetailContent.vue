<template>
  <div class="row q-col-gutter-xl">
    <div class="col-12 col-md-8">
      <JobHeader :job="job" />
      <JobOverview v-if="job.description" :job="job" />
      <div v-else class="q-pa-md text-grey">No overview listed.</div>
      <KeyResponsibilities v-if="job.KeyResponsibilities" :job="job" />
      <RequiredSkills v-if="job.skills?.length" :job="job" />
      <div v-else class="q-pa-md text-grey">No skills required.</div>
      <ApplicationProcess :job="job" />
      <CompanyInfo :job="job" />
    </div>
    <div class="col-12 col-md-4">
      <SalaryBenefits :job="job" />
      <ReadyToApply v-if="!isSignedIn" :job="job" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import JobHeader from '../components/JobHeader.vue'
import JobOverview from '../components/JobOverview.vue'
import KeyResponsibilities from '../components/KeyResponsibilities.vue'
import RequiredSkills from '../components/RequiredSkills.vue'
import ApplicationProcess from '../components/ApplicationProcess.vue'
import CompanyInfo from '../components/CompanyInfo.vue'
import SalaryBenefits from '../components/SalaryBenefits.vue'
import ReadyToApply from '../components/ReadyToApply.vue'
import { useAuthStore } from 'src/stores/auth.store';
const { job } = defineProps({
  job: Object
})


const auth = useAuthStore();
const isSignedIn = computed(() => auth.isAuthenticated);
</script>
