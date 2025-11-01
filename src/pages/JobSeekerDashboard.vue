<template>
  <div class="modern-dashboard">
    <!-- Modern Header -->
    <AppHeader />

    <!-- Dashboard Container -->
    <div class="dashboard-container">
      <!-- Welcome Section -->
      <div class="welcome-section">
        <div class="container-unstop">
          <div class="welcome-content">
            <div class="welcome-text">
              <h1 class="welcome-title">
                Welcome back, <span class="gradient-text">{{ userName }}</span>! 👋
              </h1>
              <p class="welcome-subtitle">
                Ready to take the next step in your career? Let's find your perfect opportunity.
              </p>
            </div>
            <div class="welcome-actions">
              <q-btn 
                class="btn-unstop btn-primary"
                icon="search"
                label="Browse Jobs"
                @click="$router.push('/')"
                no-caps
              />
              <q-btn 
                class="btn-unstop btn-outline"
                icon="description"
                label="Build Resume"
                @click="goToResume"
                no-caps
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Dashboard Stats -->
      <div class="stats-section">
        <div class="container-unstop">
          <div class="stats-grid">
            <div class="stat-card card-unstop">
              <div class="stat-icon applications">
                <q-icon name="work" />
              </div>
              <div class="stat-content">
                <div class="stat-number">{{ applicationCount }}</div>
                <div class="stat-label">Applications</div>
              </div>
            </div>
            <div class="stat-card card-unstop">
              <div class="stat-icon bookmarks">
                <q-icon name="bookmark" />
              </div>
              <div class="stat-content">
                <div class="stat-number">{{ bookmarkedJobs.length }}</div>
                <div class="stat-label">Saved Jobs</div>
              </div>
            </div>
            <div class="stat-card card-unstop">
              <div class="stat-icon interviews">
                <q-icon name="event" />
              </div>
              <div class="stat-content">
                <div class="stat-number">{{ interviewCount }}</div>
                <div class="stat-label">Interviews</div>
              </div>
            </div>
            <div class="stat-card card-unstop">
              <div class="stat-icon messages">
                <q-icon name="chat" />
              </div>
              <div class="stat-content">
                <div class="stat-number">{{ unreadMessageCount }}</div>
                <div class="stat-label">New Messages</div>
              </div>
            </div>
            <div class="stat-card card-unstop">
              <div class="stat-icon profile">
                <q-icon name="person" />
              </div>
              <div class="stat-content">
                <div class="stat-number">{{ profileCompletion }}%</div>
                <div class="stat-label">Profile Complete</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="main-section">
        <div class="container-unstop">
          <div class="dashboard-layout">
            <!-- Navigation Tabs -->
            <div class="nav-tabs">
              <q-btn
                v-for="tab in dashboardTabs"
                :key="tab.key"
                :class="['tab-btn', { 'tab-active': selectedSection === tab.key }]"
                :icon="tab.icon"
                :label="tab.label"
                @click="selectedSection = tab.key"
                no-caps
                flat
              />
            </div>

            <!-- Content Area -->
            <div class="content-area">
              <div class="content-wrapper">
                <template v-if="selectedSection === 'overview'">
                  <DashboardOverview 
                    :applications="applicationCount"
                    :bookmarks="bookmarkedJobs.length"
                    :interviews="interviewCount"
                    @open-profile="showProfileModal = true"
                  />
                </template>
                <template v-else-if="selectedSection === 'applications'">
                  <MyApplications @applications-loaded="updateApplicationCount" />
                </template>
                <template v-else-if="selectedSection === 'bookmarks'">
                  <BookmarkedJobs :jobs="bookmarkedJobs" @remove="handleRemove" />
                </template>
                <template v-else-if="selectedSection === 'messages'">
                  <JobSeekerMessages @message-sent="loadUnreadMessageCount" />
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modals -->
      <CompleteProfileModal v-model="showProfileModal" />
  </div>
  </div>
</template>

<script setup>
import AppHeader from '../components/HeaderPart.vue'
import CompleteProfileModal from 'components/CompleteProfileModal.vue';
import BookmarkedJobs from 'components/BookmarkedJobs.vue';
import MyApplications from 'components/MyApplications.vue';
import DashboardOverview from 'components/DashboardOverview.vue';
import JobSeekerMessages from 'components/JobSeekerMessages.vue';


import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { bookmarkService } from '../services/bookmarkService';
import { applicationService } from '../services/applicationService';
import { authHelpers } from '../services/auth.service';
import { useAuthStore } from '../stores/auth.store';
import messageService from '../services/message.service';

const authStore = useAuthStore();
const bookmarkedJobs = ref([]);
const showProfileModal = ref(false);
const selectedSection = ref('overview');
const router = useRouter();

const userId = authHelpers.getCurrentUser()?.id;
const userName = computed(() => authStore.userData?.name || 'User');

// Dashboard data
const applicationCount = ref(0);
const interviewCount = ref(2);
const profileCompletion = ref(85);
const unreadMessageCount = ref(0);

const dashboardTabs = computed(() => [
  { key: 'overview', label: 'Overview', icon: 'dashboard' },
  { key: 'applications', label: `Applications (${applicationCount.value})`, icon: 'work' },
  { key: 'bookmarks', label: `Saved Jobs (${bookmarkedJobs.value.length})`, icon: 'bookmark' }
]);
  

const goToResume = () => router.push('/resume-builder');

const fetchApplications = async () => {
  try {
    const response = await applicationService.getMyApplications();
    if (response.success) {
      applicationCount.value = response.applications.length;
    }
  } catch (error) {
    console.error('Error fetching applications:', error);
  }
};

const updateApplicationCount = (count) => {
  applicationCount.value = count;
};

const loadUnreadMessageCount = async () => {
  try {
    const result = await messageService.getUnreadCount();
    if (result.success) {
      unreadMessageCount.value = result.count;
    } else {
      console.error('Failed to load unread message count:', result.error);
      unreadMessageCount.value = 0;
    }
  } catch (error) {
    console.error('Error loading unread message count:', error);
    unreadMessageCount.value = 0;
  }
};

const fetchBookmarks = async () => {
  try {
    if (!userId) return;
    const jobs = await bookmarkService.getBookmarkedJobs(userId);
    bookmarkedJobs.value = jobs.map(b => ({
      id: b.id,
      title: b.title,
      company: b.company,
      location: b.location,
      salary: b.salary,
      skills: Array.isArray(b.skills) ? b.skills : JSON.parse(b.skills),
      posted: b.posted,
      type: b.type
    }));
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
  }
};

const handleRemove = async (jobId) => {
  const original = [...bookmarkedJobs.value];
  bookmarkedJobs.value = bookmarkedJobs.value.filter(job => job.id !== jobId);
  try {
    await bookmarkService.removeBookmark(userId, jobId);
    console.log('Bookmark removed');
  } catch (error) {
    console.error("Failed to remove bookmark:", error);
    bookmarkedJobs.value = original; // rollback
  }
};

onMounted(() => {
  fetchApplications();
  fetchBookmarks();
  loadUnreadMessageCount();
  
  // Refresh unread count every 30 seconds
  setInterval(loadUnreadMessageCount, 30000);
});
</script>

<style scoped>
.modern-dashboard {
  min-height: 100vh;
  background: #f8fafc;
  font-family: var(--font-family-primary, 'Inter', sans-serif);
}

/* Welcome Section */
.welcome-section {
  background: linear-gradient(135deg, 
    rgba(59, 130, 246, 0.05) 0%, 
    rgba(139, 92, 246, 0.05) 50%, 
    rgba(236, 72, 153, 0.05) 100%);
  padding: 3rem 0;
  margin-top: 0;
}

.container-unstop {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.welcome-section .container-unstop {
  background: #ffffff;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  padding: 2rem;
}

.welcome-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.welcome-text {
  flex: 1;
  min-width: 300px;
  text-align: center;
}

.welcome-title {
  font-size: 2.5rem;
  font-weight: 800;
  font-family: var(--font-family-display, 'Inter', sans-serif);
  color: #1f2937;
  margin: 0 0 1rem 0;
  line-height: 1.2;
}

.welcome-subtitle {
  font-size: 1.125rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.6;
}

.welcome-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.btn-unstop.btn-primary {
  background: #3b82f6;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.btn-unstop.btn-primary:hover {
  background: #2563eb;
  transform: translateY(-2px);
}

.btn-unstop.btn-outline {
  border: 2px solid #3b82f6;
  color: #3b82f6;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.btn-unstop.btn-outline:hover {
  background: #3b82f6;
  color: white;
  transform: translateY(-2px);
}

/* Stats Section */
.stats-section {
  padding: 3rem 0;
  background: #ffffff;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: #ffffff;
  border-radius: 1rem;
  border: 1px solid #0b0b0b;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stat-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(180deg, #3b82f6 0%, #8b5cf6 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.stat-card:hover::before {
  opacity: 1;
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

.stat-card:hover .stat-icon {
  transform: scale(1.1);
}

.stat-icon.applications {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
}

.stat-icon.bookmarks {
  background: linear-gradient(135deg, #ec4899 0%, #db2777 100%);
}

.stat-icon.interviews {
  background: linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%);
}

.stat-icon.messages {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.stat-icon.profile {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.stat-icon .q-icon {
  font-size: 1.75rem;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 2rem;
  font-weight: 800;
  color: #1f2937;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Main Section */
.main-section {
  padding: 3rem 0;
}

.dashboard-layout {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Navigation Tabs */
.nav-tabs {
  display: flex;
  gap: 0.5rem;
  background: #ffffff;
  padding: 0.75rem;
  border-radius: 1rem;
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
  overflow-x: auto;
}

.tab-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  color: #6b7280;
  font-weight: 600;
  transition: all 0.3s ease;
  white-space: nowrap;
  position: relative;
  overflow: hidden;
}

.tab-btn:hover {
  background: #f1f5f9;
  color: #1f2937;
  transform: translateY(-2px);
}

.tab-btn::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: #3b82f6;
  transform: scaleX(0);
  transform-origin: bottom right;
  transition: transform 0.3s ease;
}

.tab-btn:hover::after {
  transform: scaleX(1);
  transform-origin: bottom left;
}

.tab-active {
  background: #3b82f6 !important;
  color: white !important;
}

.tab-active::after {
  transform: scaleX(1);
  transform-origin: bottom left;
}

/* Content Area */
.content-area {
  background: #ffffff;
  border-radius: 1.25rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

.content-wrapper {
  padding: 2rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .welcome-section {
    padding: 2rem 0;
  }
  
  .welcome-content {
    flex-direction: column;
    text-align: center;
  }
  
  .welcome-title {
    font-size: 2rem;
  }
  
  .welcome-actions {
    justify-content: center;
  }
  
  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1rem;
  }
  
  .stat-card {
    padding: 1rem;
  }
  
  .nav-tabs {
    padding: 0.5rem;
  }
  
  .tab-btn {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }
  
  .content-wrapper {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .welcome-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .welcome-actions .btn-unstop {
    width: 100%;
  }
}

/* Scrollbar Styling */
.nav-tabs::-webkit-scrollbar {
  height: 6px;
}

.nav-tabs::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 9999px;
}

.nav-tabs::-webkit-scrollbar-track {
  background: #f1f5f9;
}
</style>