<template>
  <div class="job-description-page">
    <AppHeader />
    <q-page padding class="bg-grey-1">
      <div class="row justify-center">
        <div class="col-12 col-md-10">
          <div v-if="loading" class="q-my-xl text-center">
            <q-spinner-dots size="40px" color="primary" />
            <div>Loading job details...</div>
          </div>

          <div v-else-if="job" class="row q-col-gutter-xl">
            <!-- Main Content -->
            <div class="col-12 col-md-8">
              <JobHeader :job="job" />
              <JobOverview v-if="job.description" :job="job" />
              <div v-else class="q-pa-md text-grey">No overview listed.</div>
              <KeyResponsibilities  v-if="job.KeyResponsibilities" :job="job" />
              
              <RequiredSkills v-if="job.skills.length" :job="job" />
              <div v-else class="q-pa-md text-grey">No skills required.</div>
              <ApplicationProcess :job="job" />
              <CompanyInfo :job="job" />
            </div>

            <!-- Sidebar -->
            <div class="col-12 col-md-4">
              <SalaryBenefits :job="job" />
              <ReadyToApply v-if="!isSignedIn" :job="job" />
            </div>
          </div>

          <div v-else class="text-negative text-center q-mt-lg">
            <q-icon name="error" size="2em" />
            <p>Failed to load job data. Please try again later.</p>
          </div>
        </div>
      </div>
    </q-page>
    <AppFooter />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import jobService from '../services/job.service.js'
// Components

import JobHeader from '../components/JobHeader.vue'
import JobOverview from '../components/JobOverview.vue'
import KeyResponsibilities from '../components/KeyResponsibilities.vue'
import RequiredSkills from '../components/RequiredSkills.vue'
import ApplicationProcess from '../components/ApplicationProcess.vue'
import CompanyInfo from '../components/CompanyInfo.vue'
import SalaryBenefits from '../components/SalaryBenefits.vue'
import ReadyToApply from '../components/ReadyToApply.vue'
import { useAuthStore } from 'src/stores/auth.store'; // ✅ import your store

const route = useRoute()
const job = ref(null)
const loading = ref(true)
const auth = useAuthStore();
const isSignedIn = ref(auth.isAuthenticated);

 // adjust path as needed

onMounted(async () => {
  try {
    job.value = await jobService.getJobById(route.params.id)
  } catch (err) {
    console.error('Failed to load job:', err)
  } finally {
    loading.value = false
  }
})

</script>


<style scoped>
.job-description-page {
  font-family: 'Inter', sans-serif;
  background-color: #f5f7fa;
}

.q-page {
  min-height: 100vh;
}
</style>

