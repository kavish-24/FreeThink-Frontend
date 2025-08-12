<template>
  <q-page padding class="bg-grey-2">
    <div class="q-pa-md">
      <div class="row items-center q-mb-md">
        <div class="col">
          <div class="row items-center q-mb-sm">
            <q-btn flat round icon="arrow_back" class="q-mr-sm" @click="$router.push('/admin/dashboard')" />
            <div class="text-h4 text-weight-bold">Companies Management</div>
          </div>
          <div class="text-subtitle1 text-grey-7 q-pl-xl">Approve, reject, and manage all company accounts.</div>
        </div>
        <div class="col-auto">
          <q-btn unelevated color="primary" icon="refresh" label="Refresh" @click="fetchCompanies" :loading="refreshing" />
        </div>
      </div>
      <q-separator class="q-my-lg" />

      <q-card flat bordered>
        <q-inner-loading :showing="loading">
          <q-spinner-gears size="50px" color="primary" />
        </q-inner-loading>

        <div v-if="!loading">
          <q-tabs v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary" align="justify" narrow-indicator>
            <q-tab name="unverified" label="Pending Verification">
              <q-badge v-if="unverifiedCompanies.length" color="orange" floating>{{ unverifiedCompanies.length }}</q-badge>
            </q-tab>
            <q-tab name="verified" label="Verified Companies" />
            <q-tab name="rejected" label="Rejected Companies" />
          </q-tabs>
          <q-separator />

          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="unverified">
              <div v-if="unverifiedCompanies.length === 0" class="text-center q-pa-xl">
                <q-icon name="check_circle_outline" color="positive" size="64px" class="q-mb-md" />
                <div class="text-h6">No companies are pending verification.</div>
                <div class="text-grey-7">You're all caught up!</div>
              </div>
              <q-list v-else separator>
                <q-expansion-item
                  v-for="company in unverifiedCompanies"
                  :key="company.user_id"
                  group="pending-companies"
                  header-class="q-pa-md"
                >
                  <template v-slot:header>
                    <q-item-section avatar>
                      <q-avatar color="orange-1" text-color="orange-8" icon="pending_actions" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="text-body1 text-weight-medium">{{ company.company_name || 'Unnamed Company' }}</q-item-label>
                      <q-item-label caption><q-icon name="email" size="xs" class="q-mr-xs"/>{{ company.user?.email || 'No email' }}</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <div class="text-caption text-grey-7">
                        Registered: {{ formatDate(company.createdAt) }}
                      </div>
                    </q-item-section>
                  </template>

                  <q-card>
                    <q-card-section class="bg-grey-1">
                      <div class="text-subtitle2 text-grey-8 q-mb-sm">COMPANY DETAILS</div>
                      <div class="row q-col-gutter-x-lg q-col-gutter-y-md">
                        <div class="col-12 col-md-6">
                          <q-list dense>
                            <q-item><q-item-section avatar><q-icon color="grey-7" name="phone"/></q-item-section><q-item-section>{{ company.contact_number || 'Not provided' }}</q-item-section></q-item>
                            <q-item><q-item-section avatar><q-icon color="grey-7" name="location_on"/></q-item-section><q-item-section>{{ company.location || 'Not provided' }}</q-item-section></q-item>
                          </q-list>
                        </div>
                        <div class="col-12 col-md-6">
                          <q-list dense>
                            <q-item v-if="company.website"><q-item-section avatar><q-icon color="grey-7" name="public"/></q-item-section><q-item-section><a :href="company.website" target="_blank" class="text-primary">{{ company.website }}</a></q-item-section></q-item>
                            <q-item v-if="company.linkedinUrl"><q-item-section avatar><q-icon color="grey-7" name="mdi-linkedin"/></q-item-section><q-item-section><a :href="company.linkedinUrl" target="_blank" class="text-primary">View LinkedIn Profile</a></q-item-section></q-item>
                          </q-list>
                        </div>
                        <div v-if="company.description" class="col-12">
                          <div class="text-caption text-grey-7 q-mt-sm">DESCRIPTION</div>
                          <p class="text-body2 q-mt-xs">{{ company.description }}</p>
                        </div>
                      </div>
                      <q-separator spaced/>
                      <div class="row justify-end q-gutter-sm q-mt-md">
                        <q-btn
                          outline
                          color="negative"
                          icon="cancel"
                          label="Reject"
                          @click="confirmReject(company)"
                          :loading="rejectingId === company.user_id"
                          :disable="approvingId === company.user_id"
                        />
                        <q-btn
                          unelevated
                          color="positive"
                          icon="check_circle"
                          label="Approve"
                          @click="approveCompany(company)"
                          :loading="approvingId === company.user_id"
                          :disable="rejectingId === company.user_id"
                        />
                      </div>
                    </q-card-section>
                  </q-card>
                </q-expansion-item>
              </q-list>
            </q-tab-panel>

            <q-tab-panel name="verified">
              <div v-if="verifiedCompanies.length === 0" class="text-center q-pa-xl">
                <q-icon name="domain_disabled" color="grey-5" size="64px" class="q-mb-md" />
                <div class="text-h6">No verified companies found.</div>
                <div class="text-grey-7">Approved companies will appear here.</div>
              </div>
              <q-list v-else separator>
                <q-item v-for="company in verifiedCompanies" :key="company.user_id" class="q-pa-md">
                  <q-item-section avatar>
                    <q-avatar color="positive" text-color="white" icon="verified_user" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-body1">{{ company.company_name || 'Unnamed Company' }}</q-item-label>
                    <q-item-label caption>{{ company.user?.email }}</q-item-label>
                  </q-item-section>
                  <q-item-section side top>
                    <q-item-label caption>Verified on {{ formatDate(company.verified_at) }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-tab-panel>

            <q-tab-panel name="rejected">
              <div class="text-center q-pa-xl">
                <q-icon name="block" color="grey-5" size="64px" class="q-mb-md" />
                <div class="text-h6">Rejected Companies List</div>
                <div class="text-grey-7">This feature is under construction.</div>
              </div>
            </q-tab-panel>

          </q-tab-panels>
        </div>
      </q-card>
    </div>

    <q-dialog v-model="showRejectDialog" persistent>
      <q-card style="min-width: 400px; border-radius: 12px;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Reject Company</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <p>Provide a reason for rejecting <span class="text-weight-bold">{{ currentCompany.company_name }}</span>. This will be sent to the employer.</p>
          <q-input
            v-model="rejectReason"
            label="Reason for rejection"
            type="textarea"
            outlined
            autofocus
            :rules="[val => !!val || 'A reason is required to reject a company.']"
          />
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md bg-grey-1">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn
            unelevated
            label="Submit Rejection"
            color="negative"
            @click="rejectCompany"
            :disable="!rejectReason"
            :loading="rejectingId === currentCompany.user_id"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useQuasar, date } from 'quasar';
import adminService from 'src/services/admin.service';

export default {
  name: 'CompaniesManagement',

  setup() {
    const $q = useQuasar();
    const loading = ref(true);
    const refreshing = ref(false);
    const tab = ref('unverified');
    const unverifiedCompanies = ref([]);
    const verifiedCompanies = ref([]);
    const showRejectDialog = ref(false);
    const currentCompany = ref(null);
    const rejectReason = ref('');
    const approvingId = ref(null);
    const rejectingId = ref(null);
    
    // You are missing the setup for the drawer and logout here. 
    // This is correct, as they belong in AdminLayout.vue, not here.

    const fetchCompanies = async () => {
      if(loading.value) refreshing.value = false;
      else refreshing.value = true;

      try {
        const unverifiedRes = await adminService.getUnverifiedCompanies();
        unverifiedCompanies.value = unverifiedRes.data || [];

        const verifiedRes = await adminService.getVerifiedCompanies();
        verifiedCompanies.value = verifiedRes.data || [];

      } catch (error) {
        console.error('Error fetching companies:', error);
        $q.notify({
          type: 'negative',
          message: 'Failed to load companies. Please try again.'
        });
      } finally {
        loading.value = false;
        refreshing.value = false;
      }
    };

    const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      return date.formatDate(dateString, 'MMM D, YYYY');
    };

    const approveCompany = async (company) => {
      if (!company) return;
      approvingId.value = company.user_id;
      try {
        const result = await adminService.approveCompany(company.user_id);
        if (result.success) {
          $q.notify({
            type: 'positive',
            message: `${company.company_name} has been approved.`,
            icon: 'check_circle'
          });
          // Optimistic UI update
          const index = unverifiedCompanies.value.findIndex(c => c.user_id === company.user_id);
          if (index !== -1) {
            const [approvedCompany] = unverifiedCompanies.value.splice(index, 1);
            approvedCompany.verified_at = new Date().toISOString();
            verifiedCompanies.value.unshift(approvedCompany);
          }
        } else {
          throw new Error(result.error || 'Failed to approve company');
        }
      } catch (error) {
        $q.notify({ type: 'negative', message: error.message });
      } finally {
        approvingId.value = null;
      }
    };

    const confirmReject = (company) => {
      currentCompany.value = company;
      rejectReason.value = '';
      showRejectDialog.value = true;
    };

    const rejectCompany = async () => {
      if (!currentCompany.value || !rejectReason.value) return;
      rejectingId.value = currentCompany.value.user_id;
      try {
        const result = await adminService.rejectCompany(currentCompany.value.user_id, rejectReason.value);
        if (result.success) {
          $q.notify({
            type: 'warning',
            message: `${currentCompany.value.company_name} has been rejected.`,
            icon: 'warning'
          });
          // Optimistic UI update
          const index = unverifiedCompanies.value.findIndex(c => c.user_id === currentCompany.value.user_id);
          if (index !== -1) {
            unverifiedCompanies.value.splice(index, 1);
          }
          showRejectDialog.value = false;
        } else {
          throw new Error(result.error || 'Failed to reject company');
        }
      } catch (error) {
        $q.notify({ type: 'negative', message: error.message });
      } finally {
        rejectingId.value = null;
      }
    };

    onMounted(() => {
      fetchCompanies();
    });

    return {
      loading,
      refreshing,
      tab,
      unverifiedCompanies,
      verifiedCompanies,
      showRejectDialog,
      currentCompany,
      rejectReason,
      approvingId,
      rejectingId,
      fetchCompanies,
      formatDate,
      approveCompany,
      confirmReject,
      rejectCompany,
    };
  }
};
</script>

<style scoped>
a {
  text-decoration: none;
  color: var(--q-primary);
}
a:hover {
  text-decoration: underline;
}
</style>