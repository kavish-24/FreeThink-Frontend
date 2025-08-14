<template>
  <q-page padding>
    <div class="q-pa-md">
      <div>
        <div class="text-h4 text-weight-bold">Dashboard Overview</div>
        <div class="text-subtitle1 text-grey-7">Here's the latest platform activity for {{ todaysDate }}.</div>
      </div>
      <q-separator class="q-my-lg" />

      <div class="row q-col-gutter-lg q-mb-lg">
        <div class="col-12 col-sm-6 col-md-4">
          <q-card flat bordered class="stat-card">
            <q-card-section class="row items-center no-wrap">
              <q-icon name="group" size="44px" color="blue-6" class="q-mr-md" />
              <div>
                <div class="text-subtitle1 text-grey-8">Total Users</div>
                <div class="text-h4 text-weight-bolder">{{ stats.totalUsers || 0 }}</div>
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-sm-6 col-md-4">
          <q-card flat bordered class="stat-card">
            <q-card-section class="row items-center no-wrap">
              <q-icon name="fact_check" size="44px" color="green-6" class="q-mr-md" />
              <div>
                <div class="text-subtitle1 text-grey-8">Active Jobs</div>
                <div class="text-h4 text-weight-bolder">{{ stats.activeJobs || 0 }}</div>
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-sm-6 col-md-4">
          <q-card flat bordered class="stat-card">
              <q-card-section class="row items-center no-wrap">
              <q-icon name="pending_actions" size="44px" color="orange-6" class="q-mr-md" />
              <div>
                <div class="text-subtitle1 text-grey-8">Pending Job Posts</div>
                <div class="text-h4 text-weight-bolder">{{ pendingJobs.length }}</div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <q-card flat bordered class="q-mt-xl">
        <q-card-section>
            <div class="row items-center q-mb-md">
            <div class="text-h5">Pending Job Approvals</div>
            <q-space />
            <q-btn
              flat
              round
              color="primary"
              icon="refresh"
              @click="fetchPendingJobs"
              :loading="loadingPendingJobs"
            >
              <q-tooltip>Refresh</q-tooltip>
            </q-btn>
          </div>
        </q-card-section>
        <q-separator />

        <q-card-section>
          <q-inner-loading :showing="loadingPendingJobs">
            <q-spinner-gears size="50px" color="primary" />
          </q-inner-loading>

          <div v-if="!loadingPendingJobs && pendingJobs.length === 0">
            <q-banner rounded class="bg-green-1 text-green-8">
              <template v-slot:avatar>
                <q-icon name="check_circle" color="green-5" />
              </template>
              No pending jobs for approval. All caught up! 👍
            </q-banner>
          </div>

          <div v-else class="q-gutter-y-md">
            <q-list separator>
              <q-expansion-item
                v-for="job in pendingJobs"
                :key="job.id"
                class="job-expansion-card"
                group="pending-jobs"
                icon="work_outline"
                :label="job.title"
                :caption="`from ${job.employer?.name || 'N/A'}`"
              >
                <q-card>
                  <q-card-section class="q-pt-none">
                      <div class="q-py-md text-body2 text-grey-8" v-html="job.description || 'No description provided.'"></div>
                      <q-separator spaced />
                      <div class="text-caption text-grey-7 q-mt-sm">
                        <q-icon name="schedule" size="14px" class="q-mr-xs" />
                        Submitted: {{ formatDate(job.submitted_at) }}
                      </div>
                      <div class="row q-mt-md q-gutter-sm justify-end">
                      <q-btn
                        unelevated
                        color="negative"
                        label="Reject"
                        icon="close"
                        @click="showRejectDialog(job)"
                        :loading="rejectingJobId === job.id"
                      />
                      <q-btn
                        unelevated
                        color="positive"
                        label="Approve"
                        icon="check"
                        @click="approveJob(job.id)"
                        :loading="approvingJobId === job.id"
                      />
                      </div>
                  </q-card-section>
                </q-card>
              </q-expansion-item>
            </q-list>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <q-dialog v-model="rejectDialog.show" persistent>
      <q-card style="min-width: 400px; border-radius: 12px;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Reject Job Posting</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <p>Please provide a clear reason for rejecting this job posting. This will be sent to the employer.</p>
          <q-input
            v-model="rejectDialog.reason"
            type="textarea"
            outlined
            autofocus
            :rules="[val => !!val || 'Reason is required']"
            label="Reason for rejection"
          />
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancel" color="grey-8" v-close-popup />
          <q-btn
            unelevated
            label="Submit Rejection"
            color="negative"
            @click="rejectJob"
            :disable="!rejectDialog.reason"
            :loading="rejectingJobId === rejectDialog.jobId"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { date } from 'quasar';
import { useQuasar } from 'quasar';
import adminService from 'src/services/admin.service';

export default {
  name: 'AdminDashboard',

  setup() {
    const $q = useQuasar();
    const router = useRouter();

    const stats = ref({
      totalUsers: 0,
      activeJobs: 0,
      totalCompanies: 0,
      unverifiedCompanies: 0
    });

    const loading = ref(true);
    const loadingPendingJobs = ref(false);
    const pendingJobs = ref([]);
    const approvingJobId = ref(null);
    const rejectingJobId = ref(null);
    const pendingApprovals = ref(0);

    const todaysDate = ref(date.formatDate(Date.now(), 'MMMM D, YYYY'));

    const rejectDialog = ref({
      show: false,
      jobId: null,
      reason: ''
    });

    const formatDate = (dateString) => {
      return date.formatDate(dateString, 'MMM D, YYYY [at] h:mm A');
    };

    const fetchStats = async () => {
      loading.value = true;
      try {
        const [statsResult, companiesResult] = await Promise.all([
          adminService.getDashboardStats(),
          adminService.getUnverifiedCompanies()
        ]);

        if (statsResult.success) {
          stats.value = statsResult.data;
        } else {
          throw new Error(statsResult.error || 'Failed to load dashboard stats');
        }

        if (companiesResult.success) {
          pendingApprovals.value = companiesResult.data.length;
          stats.value.unverifiedCompanies = companiesResult.data.length;
        }
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: error.message,
          position: 'top'
        });
      } finally {
        loading.value = false;
      }
    };

    const fetchPendingJobs = async () => {
      loadingPendingJobs.value = true;
      try {
        const result = await adminService.getPendingJobs();
        if (result.success) {
          pendingJobs.value = result.data;
        } else {
          throw new Error(result.error || 'Failed to fetch pending jobs');
        }
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: error.message,
          position: 'top'
        });
      } finally {
        loadingPendingJobs.value = false;
      }
    };

    const approveJob = async (jobId) => {
      approvingJobId.value = jobId;
      try {
        const result = await adminService.approveJob(jobId);
        if (result.success) {
          $q.notify({
            type: 'positive',
            message: 'Job approved successfully',
            position: 'top'
          });
          await Promise.all([fetchPendingJobs(), fetchStats()]);
        } else {
          throw new Error(result.error || 'Failed to approve job');
        }
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: error.message,
          position: 'top'
        });
      } finally {
        approvingJobId.value = null;
      }
    };

    const showRejectDialog = (job) => {
      rejectDialog.value = {
        show: true,
        jobId: job.id,
        reason: ''
      };
    };

    const rejectJob = async () => {
      if (!rejectDialog.value.reason) return;

      rejectingJobId.value = rejectDialog.value.jobId;
      try {
        const result = await adminService.rejectJob(
          rejectDialog.value.jobId,
          rejectDialog.value.reason
        );

        if (result.success) {
          $q.notify({
            type: 'positive',
            message: 'Job rejected successfully',
            position: 'top'
          });
          rejectDialog.value.show = false;
          await Promise.all([fetchPendingJobs(), fetchStats()]);
        } else {
          throw new Error(result.error || 'Failed to reject job');
        }
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: error.message,
          position: 'top'
        });
      } finally {
        rejectingJobId.value = null;
      }
    };

    const checkAuth = () => {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        router.push('/admin/login');
      }
    };

    onMounted(async () => {
      checkAuth();
      await Promise.all([fetchStats(), fetchPendingJobs()]);
    });

    return {
      stats,
      loading,
      loadingPendingJobs,
      pendingJobs,
      approvingJobId,
      rejectingJobId,
      rejectDialog,
      pendingApprovals,
      todaysDate,
      formatDate,
      fetchPendingJobs,
      approveJob,
      showRejectDialog,
      rejectJob,
    };
  }
};
</script>

<style scoped>
.admin-active-link {
  background-color: #e3f2fd; /* A light blue */
  color: #1976d2; /* Primary color */
  font-weight: 500;
}

.stat-card {
  border-radius: 12px;
  transition: transform 0.3s, box-shadow 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
}

.job-expansion-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 8px;
}

.q-expansion-item--expanded {
  background: #fafafa;
}
</style>