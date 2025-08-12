<template>
  <q-page padding class="bg-grey-2">
    <div class="q-pa-md">
      <div class="row items-center q-mb-md">
        <div class="col">
            <div class="row items-center q-mb-sm">
            <q-btn flat round icon="arrow_back" class="q-mr-sm" @click="$router.push('/admin/dashboard')" />
            <div class="text-h4 text-weight-bold">Job Seeker Management</div>
          </div>
            <div class="text-subtitle1 text-grey-7 q-pl-xl">Search, filter, and manage all job seeker accounts.</div>
        </div>
      </div>
      <q-separator class="q-my-lg" />

      <q-card flat bordered class="q-mb-lg">
        <q-card-section class="row q-gutter-md items-center">
          <q-input
            v-model="searchQuery"
            outlined
            dense
            placeholder="Search by name or email..."
            class="col-12 col-md-8"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
          <q-select
            v-model="statusFilter"
            :options="statusOptions"
            label="Filter by Status"
            outlined
            dense
            class="col-12 col-md-3"
            emit-value
            map-options
          />
        </q-card-section>
      </q-card>

      <div v-if="loading" class="row q-col-gutter-lg">
          <div v-for="n in 6" :key="n" class="col-12 col-md-6 col-lg-4">
            <q-card flat bordered><q-skeleton height="250px" square /></q-card>
          </div>
      </div>
      <div v-else-if="filteredUsers.length > 0" class="row q-col-gutter-lg">
        <div v-for="user in filteredUsers" :key="user.id" class="col-12 col-md-6 col-lg-4">
          <q-card flat bordered class="user-card">
            <q-card-section>
                <q-badge
                :color="user.status === 'Active' ? 'green' : 'red'"
                :label="user.status"
                floating
              />
              <div class="row items-center no-wrap">
                <q-avatar size="56px" color="primary" text-color="white" class="q-mr-md">
                  {{ user.firstName.charAt(0) }}{{ user.lastName.charAt(0) }}
                </q-avatar>
                <div>
                  <div class="text-h6 ellipsis">
                    {{ user.firstName }} {{ user.lastName }}
                  </div>
                  <div class="text-subtitle2 text-grey-7 ellipsis">{{ user.email }}</div>
                </div>
              </div>
            </q-card-section>
            <q-separator />

            <q-card-section>
                <q-list dense separator>
                  <q-item>
                    <q-item-section avatar><q-icon name="phone" color="grey-7" size="xs"/></q-item-section>
                    <q-item-section>{{ user.phone || 'Not provided' }}</q-item-section>
                  </q-item>
                    <q-item>
                    <q-item-section avatar><q-icon name="event" color="grey-7" size="xs"/></q-item-section>
                    <q-item-section>Joined on {{ formatDate(user.registered) }}</q-item-section>
                  </q-item>
                </q-list>
            </q-card-section>
            <q-separator />

            <q-card-actions align="around">
                <q-btn flat dense color="primary" label="View Details" icon="visibility" @click="viewUser(user)" />
                <q-btn
                v-if="user.status === 'Active'"
                flat
                dense
                color="orange"
                label="Suspend"
                icon="pause"
                @click="suspendUser(user)"
              />
                <q-btn v-else flat dense color="positive" label="Activate" icon="play_arrow" @click="activateUser(user)" />
                <q-btn flat dense color="negative" label="Delete" icon="delete" @click="deleteUser(user)" />
            </q-card-actions>
          </q-card>
        </div>
      </div>

        <div v-else class="text-center q-pa-xl">
        <q-icon name="search_off" color="grey-5" size="64px" class="q-mb-md" />
        <div class="text-h6">No Job Seekers Found</div>
        <div class="text-grey-7">No users match your current search and filter criteria.</div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useQuasar, date } from 'quasar';
import ViewUserDetailsDialog from 'src/components/admin/ViewUserDetailsDialog.vue'; // We will create this component next

const $q = useQuasar();
const loading = ref(true);

// --- Filter Data ---
const searchQuery = ref('');
const statusFilter = ref('all');
const allUsers = ref([]);

const statusOptions = [
  { label: 'All Statuses', value: 'all' },
  { label: 'Active', value: 'Active' },
  { label: 'Suspended', value: 'Suspended' }
];

// --- Filtering Logic ---
const filteredUsers = computed(() => {
  return allUsers.value.filter(user => {
    const searchLower = searchQuery.value.toLowerCase();
    const searchMatch = user.firstName.toLowerCase().includes(searchLower) ||
                        user.lastName.toLowerCase().includes(searchLower) ||
                        user.email.toLowerCase().includes(searchLower);
    const statusMatch = statusFilter.value === 'all' || user.status === statusFilter.value;
    return searchMatch && statusMatch;
  });
});

// --- API and Actions ---
const fetchUsers = async () => {
  loading.value = true;
  // This would be an API call, e.g., await adminService.getJobSeekers()
  setTimeout(() => {
    allUsers.value = [
      { id: 1, firstName: 'Aarav', lastName: 'Sharma', email: 'aarav.sharma@example.com', phone: '(123) 456 - 7890', status: 'Active', registered: '2025-08-10T10:00:00Z', applications: [ { jobTitle: 'Frontend Developer', companyName: 'Innovate Inc.' }, { jobTitle: 'UI/UX Designer', companyName: 'Creative Solutions' } ] },
      { id: 3, firstName: 'Priya', lastName: 'Patel', email: 'priya.p@example.com', phone: '(345) 678 - 9012', status: 'Suspended', registered: '2025-08-08T14:00:00Z', applications: [] },
      { id: 5, firstName: 'Rohan', lastName: 'Mehta', email: 'rohan.mehta@example.com', phone: '(567) 890 - 1234', status: 'Active', registered: '2025-08-06T16:45:00Z', applications: [ { jobTitle: 'Backend Engineer', companyName: 'Tech Solutions Ltd.' } ] },
      { id: 6, firstName: 'Sneha', lastName: 'Verma', email: 'sneha.v@example.com', phone: '(678) 901-2345', status: 'Active', registered: '2025-07-22T11:00:00Z', applications: [] },
      { id: 7, firstName: 'Vikram', lastName: 'Singh', email: 'vikram.s@example.com', phone: '(789) 012-3456', status: 'Suspended', registered: '2025-07-19T09:20:00Z', applications: [ { jobTitle: 'DevOps Engineer', companyName: 'Innovate Inc.' } ] },
    ];
    loading.value = false;
  }, 1000);
};

const formatDate = (dateString) => date.formatDate(dateString, 'MMM D, YYYY');

const viewUser = (user) => {
  $q.dialog({
    component: ViewUserDetailsDialog,
    componentProps: {
      user: user
    }
  });
};

const suspendUser = (user) => {
  $q.dialog({
    title: 'Confirm Suspension',
    message: `Are you sure you want to suspend this user? They will lose access to their account.`,
    cancel: true,
    persistent: true,
    ok: { label: 'Suspend', color: 'orange' }
  }).onOk(() => {
    user.status = 'Suspended';
    $q.notify({ type: 'positive', message: `${user.firstName} ${user.lastName} has been suspended.` });
  });
};

const activateUser = (user) => {
    user.status = 'Active';
    $q.notify({ type: 'positive', message: `${user.firstName} ${user.lastName} has been re-activated.` });
};

const deleteUser = (user) => {
  $q.dialog({
    title: 'Confirm Deletion',
    message: `This action is irreversible. Are you sure you want to permanently delete this account?`,
    cancel: true,
    persistent: true,
    ok: { label: 'DELETE', color: 'negative' }
  }).onOk(() => {
    allUsers.value = allUsers.value.filter(u => u.id !== user.id);
    $q.notify({ type: 'info', message: `User account has been deleted.` });
  });
};

onMounted(() => {
  fetchUsers();
});
</script>

<style scoped>
.user-card {
  transition: transform 0.2s, box-shadow 0.2s;
  border-radius: 12px;
}
.user-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
}
</style>