<template>
  <div class="employer-sidebar">
    <div class="sidebar-section logo-section flex items-center q-gutter-sm q-pa-md">
      <q-avatar icon="business_center" color="white" text-color="primary" />
      <div>
        <div class="text-h6 text-white">JobHub</div>
        <div class="text-caption text-blue-grey-3">Employer Portal</div>
      </div>
    </div>
    
    <div class="sidebar-section q-pt-sm q-pb-none q-px-md">
      <div class="text-subtitle1 text-weight-medium text-white">{{ currentUser?.name || 'User' }}</div>
      <div class="text-caption text-blue-grey-4">{{ currentUser?.email || '' }}</div>
    </div>
    
    <div class="sidebar-section q-pt-md q-pb-none">
      <q-list class="nav-list">
        <q-item 
          v-for="link in links" 
          :key="link.label" 
          :active="activeLink === link.label"
          active-class="active-link" 
          clickable 
          v-ripple 
          @click="navigate(link)"
        >
          <q-item-section avatar>
            <q-icon :name="link.icon" />
          </q-item-section>
          <q-item-section>{{ link.label }}</q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { authHelpers } from 'src/services/auth.service';

const router = useRouter();
const currentUser = authHelpers.getCurrentUser();

// Define props to accept active link from parent
defineProps({
  activeLink: {
    type: String,
    default: 'Dashboard Overview'
  }
});

// Define emit for navigation events
const emit = defineEmits(['navigate']);

const links = [
  { label: 'Dashboard Overview', icon: 'dashboard', to: '/employer-portal' },
  { label: 'Posted Jobs', icon: 'work', to: '/posted-jobs' },
  { label: 'Post New Job', icon: 'add_box', to: '/post-job' },
  { label: 'Candidates', icon: 'groups', to: '/candidates' },
  { label: 'Messages', icon: 'mail', to: '/employer-messages' },
  { label: 'Company Profile', icon: 'domain', to: '/company-profile' },
  { label: 'Settings', icon: 'settings', to: '/employer-settings' }
];

const navigate = (link) => {
  if (link.to) {
    emit('navigate', link.label);
    router.push(link.to);
  }
};
</script>

<style scoped>
.employer-sidebar {
  width: 260px;
  min-width: 260px;
  background-color: #1565c0;
  color: #f0f4f8;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.sidebar-section {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo-section {
  border-bottom-color: transparent;
}

.nav-list .q-item {
  color: #BCCCDC;
  padding: 12px;
  margin: 4px 12px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.nav-list .q-item:hover {
  background-color: #243B55;
  color: #ffffff;
}

.active-link {
  background-color: #00529b !important;
  color: #ffffff !important;
  font-weight: 600;
}

/* Responsive */
@media (max-width: 1024px) {
  .employer-sidebar {
    width: 220px;
    min-width: 220px;
  }
}

@media (max-width: 768px) {
  .employer-sidebar {
    width: 200px;
    min-width: 200px;
  }
  
  .sidebar-section {
    padding: 12px;
  }
}
</style>
