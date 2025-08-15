<template>
  <div class="q-pa-md">
    <div class="row justify-between items-center q-mb-md">
      <h4 class="q-mt-none q-mb-none">My Applications</h4>
      <div class="text-grey">
        <q-icon name="description" class="q-mr-xs" />
        <span>{{ applications.length }} applications</span>
      </div>
    </div>

    <q-card
      v-for="(app, index) in applications"
      :key="index"
      class="q-mb-md q-pa-md application-card"
      flat
      bordered
      @click="viewApplication(app.id)"
    >
      <div class="row justify-between items-start">
        <div class="col-10">
          <div class="text-subtitle1 text-bold">{{ app.position }}</div>
          <div class="row items-center q-gutter-sm q-mt-xs text-grey-7">
            <q-icon name="business" />
            <span>{{ app.company }}</span>

            <q-icon name="place" />
            <span>{{ app.location }}</span>

            <q-icon name="attach_money" />
            <span>{{ app.salary }}</span>
          </div>
          <div class="text-caption text-grey q-mt-xs">
            Applied on {{ app.date }}
          </div>
        </div>

        <div class="col-auto flex column items-end q-gutter-sm">
          <q-badge
            :label="app.status"
            :color="getStatusColor(app.status)"
            outline
            class="q-mb-xs"
          />
          <q-btn
            flat
            round
            icon="visibility"
            color="primary"
            size="sm"
            label="View"
            class="q-pa-xs"
            @click.stop="viewApplication(app.id)"
          />
        </div>
      </div>
    </q-card>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const applications = [
  {
    id: 'app-001', // Unique ID for each application
    position: 'Senior Frontend Developer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    salary: '$120k - $150k',
    date: '1/15/2024',
    status: 'Under Review'
  },
  {
    id: 'app-002', // Unique ID for each application
    position: 'Product Manager',
    company: 'StartupXYZ',
    location: 'Remote',
    salary: '$100k - $130k',
    date: '1/12/2024',
    status: 'Interview Scheduled'
  },
  {
    id: 'app-003', // Unique ID for each application
    position: 'UX Designer',
    company: 'DesignStudio',
    location: 'New York, NY',
    salary: '$80k - $110k',
    date: '1/10/2024',
    status: 'Rejected'
  }
];

const getStatusColor = (status) => {
  switch (status) {
    case 'Under Review':
      return 'orange';
    case 'Interview Scheduled':
      return 'blue';
    case 'Rejected':
      return 'red';
    default:
      return 'grey';
  }
};

const viewApplication = (id) => {
  router.push({ name: 'ApplicationDetails', params: { applicationId: id } });
};
</script>

<style scoped>
.text-bold {
  font-weight: 600;
}

.application-card {
  border-radius: 14px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  transition: all 0.25s ease;
  cursor: pointer;
}

.application-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  border-color: #409eff;
}
</style>