<template>
  <div class="employer-portal">
    <AppHeader class="sticky-header" />
    <div class="page-wrapper row">
      <EmployerSidebar :active-link="selected" @navigate="(label) => selected = label" />

      <div class="content-area column q-pa-md q-pa-lg-lg">
        <q-banner v-if="verificationStatus === 'pending'" class="bg-blue-1 text-blue-9 q-mb-lg" rounded>
          <template v-slot:avatar>
            <q-icon name="pending" color="blue-7" size="2em" />
          </template>
          <div class="text-weight-medium">Your company is under review</div>
          <div>Your company profile is currently being reviewed by our team. This process typically takes 1-2 business
            days. You can still post jobs, but they will be marked as pending until your company is verified.</div>
        </q-banner>

        <q-banner v-else-if="verificationStatus === 'rejected'" class="bg-red-1 text-red-9 q-mb-lg" rounded>
          <template v-slot:avatar>
            <q-icon name="warning" color="red-7" size="2em" />
          </template>
          <div class="text-weight-medium">Company Verification Required</div>
          <div>Your company verification was rejected. Reason: {{ rejectionReason || 'Not specified' }}. Please update
            your company information and submit for review again.</div>
          <template v-slot:action>
            <q-btn flat color="red-8" label="Update Company Profile" to="/company-profile" />
          </template>
        </q-banner>

        <q-banner v-if="activeBroadcast" inline-actions rounded class="q-mb-lg broadcast-banner">
          <template v-slot:avatar>
            <q-icon name="campaign" color="white" />
          </template>
          <div class="text-weight-medium text-white">
            {{ activeBroadcast.text }}
            <div class="text-caption q-mt-xs opacity-8">(Expires on {{ new
              Date(activeBroadcast.expiry).toLocaleString() }})</div>
          </div>
        </q-banner>

        <div class="row justify-between items-center q-mb-lg">
          <div>
            <div class="text-h5 text-weight-bold content-title">Welcome, {{ employer.name }}!</div>
            <div class="text-subtitle1 subtitle-text">Here's your overview for {{ todaysDate }}.</div>
          </div>
        </div>

        <div class="row q-col-gutter-lg q-mb-lg">
          <div class="col-12 col-sm-6 col-md-3" v-for="stat in dashboardStats" :key="stat.label">
            <q-card class="stat-card full-height" flat bordered>
              <q-card-section class="flex items-center q-pa-md">
                <q-icon :name="stat.icon" :color="stat.iconColor" size="2.8em" class="q-mr-md" />
                <div>
                  <div class="text-h4 text-weight-bolder stat-value">{{ stat.value }}</div>
                  <div class="text-subtitle2 stat-label">{{ stat.label }}</div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <div class="row q-col-gutter-lg">
          <div class="col-12 col-lg-7">
            <q-card flat bordered class="q-mb-lg">
              <q-card-section class="row items-center justify-between">
                <div class="text-h6 content-title">Application Trends (Last 7 Days)</div>
                <q-btn 
                  flat 
                  round 
                  icon="refresh" 
                  color="primary" 
                  @click="refreshData"
                  :loading="isRefreshing"
                >
                  <q-tooltip>Refresh Data</q-tooltip>
                </q-btn>
              </q-card-section>
              <q-card-section>
                <div v-if="isChartLoading" class="flex justify-center items-center" style="height: 350px;">
                  <q-spinner-dots size="40px" color="primary" />
                  <span class="q-ml-sm">Loading chart data...</span>
                </div>
                <VueApexCharts 
                  v-else
                  type="bar" 
                  height="350" 
                  :options="chartOptions" 
                  :series="chartSeries"
                ></VueApexCharts>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-lg-5">
            <q-card flat bordered class="q-mb-lg">
              <q-card-section>
                <div class="text-h6 content-title">Action Required</div>
              </q-card-section>
              <q-list separator>
                <q-item v-for="item in actionItems" :key="item.title" clickable v-ripple @click="router.push(item.to)">
                  <q-item-section avatar>
                    <q-avatar :icon="item.icon" color="light-blue-1" text-color="primary" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-medium list-item-title">{{ item.title }}</q-item-label>
                    <q-item-label caption lines="1">{{ item.subtitle }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-icon name="chevron_right" class="subtitle-text" />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card>

            <q-card flat bordered class="q-mb-lg interview-card">
              <q-card-section>
                <div class="text-h6 content-title">Upcoming Interviews</div>
              </q-card-section>
              <q-list separator class="interview-list">
                <q-item v-for="interview in upcomingInterviews" :key="interview.id">
                  <q-item-section avatar>
                    <q-avatar color="cyan-1" text-color="cyan-8" icon="event" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-medium list-item-title">{{ interview.candidateName }}</q-item-label>
                    <q-item-label caption>For: {{ interview.jobTitle }}</q-item-label>
                  </q-item-section>
                  <q-item-section side class="text-right">
                    <q-item-label class="text-weight-medium text-cyan-9">{{ interview.date }}</q-item-label>
                    <q-item-label caption>{{ interview.time }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card>
          </div>
        </div>
      </div>
      </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import VueApexCharts from 'vue3-apexcharts';
import api  from 'src/services/auth.service';
import AppHeader from 'src/components/HeaderPart.vue';
import EmployerSidebar from 'src/components/EmployerSidebar.vue';
import { authHelpers } from 'src/services/auth.service';

const router = useRouter();
const $q = useQuasar();

// Initialize dashboard stats with loading state
const dashboardStats = ref([
  { value: '...', label: 'Total Applications', icon: 'summarize', iconColor: 'blue-5' },
  { value: '...', label: 'Active Jobs', icon: 'fact_check', iconColor: 'blue-6' },
  { value: '...', label: 'Under Review', icon: 'groups', iconColor: 'blue-7' },
  { value: '...', label: 'Rejected', icon: 'close', iconColor: 'red' }
]);

const fetchCompanyStats = async () => {
  try {
    const token = authHelpers.getToken();
    if (!token) {
      console.warn('No authentication token found');
      return;
    }
    console.log('Fetching company stats...');
    const response = await api.get('/applications/company-stats', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    console.log('Response received:', response.data);
    
    if (response.data && response.data.success) {
      const { stats, details } = response.data;
      console.log('Updating dashboard with stats:', stats);
      console.log('Details:', details);
      
      // Ensure all values are numbers and not undefined
      const totalApps = parseInt(stats.total) || 0;
      const activeJobs = parseInt(details.total_active_jobs) || 0;
      const underReview = parseInt(stats.under_review) || 0;
      const rejected = parseInt(stats.rejected) || 0;

      // Update dashboard stats with number values
      dashboardStats.value.forEach((stat, index) => {
        switch(index) {
          case 0:
            stat.value = totalApps;
            break;
          case 1:
            stat.value = activeJobs;
            break;
          case 2:
            stat.value = underReview;
            break;
          case 3:
            stat.value = rejected;
            break;
        }
      });

      // Update action items based on recent applications
      if (details.recent_applications && details.recent_applications.length > 0) {
        const newApplicants = details.recent_applications.filter(app => app.status === 'applied').length;
        if (newApplicants > 0) {
          actionItems.value[0] = {
            icon: 'person_add',
            title: `${newApplicants} New Applicant${newApplicants > 1 ? 's' : ''}`,
            subtitle: `For ${details.recent_applications[0].jobTitle}`,
            to: '/candidates'
          };
        }
      }

      // Most active job info can be used here as well
      if (details.most_active_job) {
        const { jobTitle, count } = details.most_active_job;
        actionItems.value.push({
          icon: 'trending_up',
          title: 'Most Active Job Posting',
          subtitle: `${jobTitle} (${count} application${count > 1 ? 's' : ''})`,
          to: '/posted-jobs'
        });
      }

      // Update chart data immediately when stats change
      await updateChartData(stats, details);
    }
  } catch (error) {
    console.error('Error fetching company stats:', error);
  }
};

// Separate function to update chart data
const updateChartData = async (stats, details) => {
  try {
    // Get the latest 7 days
    const last7Dates = getLastNDates(7);
    chartCategories.value = last7Dates.map(d => formatLabel(d));

    // Initialize with current data distributed across recent days
    const appliedData = new Array(7).fill(0);
    const underReviewData = new Array(7).fill(0);
    const approvedData = new Array(7).fill(0);
    const rejectedData = new Array(7).fill(0);

    // Distribute the current stats across the last few days for visualization
    if (details.recent_applications && details.recent_applications.length > 0) {
      // Group applications by status
      const statusCounts = {
        applied: 0,
        under_review: 0,
        approved: 0,
        rejected: 0
      };

      details.recent_applications.forEach(app => {
        if (app.status in statusCounts) {
          statusCounts[app.status] += parseInt(app.count) || 0;
        }
      });

      // Place the data in the most recent days (spread across last 3 days)
      appliedData[6] = Math.ceil(statusCounts.applied * 0.5);
      appliedData[5] = Math.ceil(statusCounts.applied * 0.3);
      appliedData[4] = Math.ceil(statusCounts.applied * 0.2);

      underReviewData[6] = statusCounts.under_review;
      approvedData[5] = statusCounts.approved;
      rejectedData[6] = Math.ceil(statusCounts.rejected * 0.7);
      rejectedData[5] = Math.ceil(statusCounts.rejected * 0.3);
    }

    // Update chart series
    chartSeries.value = [
      { name: 'Applied', data: appliedData },
      { name: 'Under Review', data: underReviewData },
      { name: 'Approved', data: approvedData },
      { name: 'Rejected', data: rejectedData }
    ];

    console.log('Chart updated with new data:', chartSeries.value);
  } catch (error) {
    console.error('Error updating chart data:', error);
  }
};

const actionItems = ref([
  { icon: 'person_add', title: '5 New Applicants', subtitle: 'For Senior Frontend Developer', to: '/candidates?jobId=1' },
  { icon: 'mark_email_unread', title: '3 Unread Messages', subtitle: 'From Priya, Vikram, and more', to: '/employer-messages' },
  { icon: 'rate_review', title: '1 New Query Reply', subtitle: 'Admin has replied to your support ticket', to: '/employer-queries' },
  { icon: 'pending', title: '2 Jobs Pending Review', subtitle: 'Awaiting admin approval', to: '/posted-jobs' },
  { icon: 'quiz', title: 'Add Screening Test', subtitle: 'Improve filtering by adding a test to your posted jobs', to: '/screening-test' },
]);

const upcomingInterviews = ref([
  { id: 1, candidateName: 'Priya Patel', jobTitle: 'UI/UX Designer', date: 'Aug 4, 2025', time: '11:00 AM' },
  { id: 2, candidateName: 'Rohan Mehta', jobTitle: 'UI/UX Designer', date: 'Aug 4, 2025', time: '02:30 PM' },
  { id: 3, candidateName: 'Sneha Verma', jobTitle: 'Senior Frontend Developer', date: 'Aug 5, 2025', time: '10:00 AM' },
]);

// Initialize chart with placeholder data that won't flicker
const chartSeries = ref([
  { name: 'Applied', data: [0, 0, 0, 0, 0, 0, 0] },
  { name: 'Under Review', data: [0, 0, 0, 0, 0, 0, 0] },
  { name: 'Approved', data: [0, 0, 0, 0, 0, 0, 0] },
  { name: 'Rejected', data: [0, 0, 0, 0, 0, 0, 0] }
]);

// Initialize with default categories - will be updated when data loads
const chartCategories = ref(['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7']);
const chartOptions = computed(() => ({
  chart: {
    type: 'bar',
    height: 350,
    toolbar: { show: false },
    stacked: true,
  },
  plotOptions: {
    bar: {
      borderRadius: 4,
      horizontal: false,
      columnWidth: '60%'
    }
  },
  dataLabels: { enabled: false },
  xaxis: {
    categories: chartCategories.value,
    labels: {
      rotate: -45,
      style: {
        fontSize: '12px'
      }
    }
  },
  yaxis: {
    title: {
      text: 'Number of Applications'
    }
  },
  colors: ['#4CAF50', '#2196F3', '#FFC107', '#F44336'],
  legend: {
    position: 'top',
    horizontalAlign: 'center'
  },
  theme: { mode: $q.dark.isActive ? 'dark' : 'light' },
  tooltip: {
    y: {
      formatter: function (val) {
        return val + ' applications'
      }
    }
  }
}));

const currentUser = authHelpers.getCurrentUser();

const employer = ref({
  name: currentUser?.name || 'Unknown Company',
  email: currentUser?.email || ''
});

const selected = ref('Dashboard Overview');
const activeBroadcast = ref(null);
const verificationStatus = ref('');
const rejectionReason = ref('');
const isLoading = ref(true);
const isRefreshing = ref(false);
const isChartLoading = ref(true);

// Manual refresh function
const refreshData = async () => {
  isRefreshing.value = true;
  try {
    await fetchCompanyStats();
    await fetchTrends(); // Only refresh trends when manually requested
    console.log('Data refreshed manually');
  } catch (error) {
    console.error('Error refreshing data:', error);
  } finally {
    isRefreshing.value = false;
  }
};

const fetchCompanyStatus = async () => {
  try {
    isLoading.value = true;
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found');
    }
    const response = await api.get('/company/status', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    if (response.data) {
      verificationStatus.value = response.data.status || '';
      rejectionReason.value = response.data.rejectionReason || '';
      const storedEmployer = localStorage.getItem('employerData');
      if (storedEmployer) {
        const employerData = JSON.parse(storedEmployer);
        employerData.status = verificationStatus.value;
        employerData.rejectionReason = rejectionReason.value;
        localStorage.setItem('employerData', JSON.stringify(employerData));
        employer.value = employerData;
      }
    }
  } catch (error) {
    console.error('Error fetching company status:', error);
    const storedEmployer = localStorage.getItem('employerData');
    if (storedEmployer) {
      const employerData = JSON.parse(storedEmployer);
      verificationStatus.value = employerData.status || '';
      rejectionReason.value = employerData.rejectionReason || '';
    }
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  try {
    // Initialize chart categories with proper dates now that helper functions are available
    const last7Dates = getLastNDates(7);
    chartCategories.value = last7Dates.map(d => formatLabel(d));
    
    // Start all data fetching immediately in parallel
    const statsPromise = fetchCompanyStats().catch(console.error);
    const trendsPromise = fetchTrends().catch(console.error);
    
    const storedEmployer = localStorage.getItem('employerData');
    if (storedEmployer) {
      const employerData = JSON.parse(storedEmployer);
      employer.value = employerData;
      verificationStatus.value = employerData.status || '';
      rejectionReason.value = employerData.rejectionReason || '';
    }
    
    const statusPromise = fetchCompanyStatus();
    
    const storedBroadcast = localStorage.getItem('jobhubBroadcast');
    if (storedBroadcast) {
      const broadcast = JSON.parse(storedBroadcast);
      if (new Date(broadcast.expiry) > new Date()) {
        activeBroadcast.value = broadcast;
      } else {
        localStorage.removeItem('jobhubBroadcast');
      }
    }

    // Wait for all initial data to load
    await Promise.all([statsPromise, trendsPromise, statusPromise]);

    // Set up periodic refresh of stats only (every 10 seconds for real-time updates)
    // Trends data is only fetched on page load and manual refresh
    const refreshInterval = setInterval(() => {
      fetchCompanyStats();
    }, 10000);

    // Clean up interval on component unmount
    return () => clearInterval(refreshInterval);
  } catch (error) {
    console.error('Error in onMounted:', error);
  }
});

// Helper: return array of Date objects for the last n days (oldest -> today)
const getLastNDates = (n) => {
  const dates = [];
  const today = new Date();
  // normalize to local midnight
  today.setHours(0, 0, 0, 0);
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    dates.push(d);
  }
  return dates;
};

// Date is now dynamic and shows the current date
const todaysDate = new Date().toLocaleDateString('en-IN', {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
});

const formatLabel = (isoDate) => {
  if (!isoDate) return '';
  const d = new Date(isoDate);
  const options = { month: 'short', day: '2-digit' };
  return d.toLocaleDateString('en-US', options);
};

const fetchTrends = async () => {
  try {
    const token = authHelpers.getToken();
    if (!token) {
      console.warn('No authentication token found');
      isChartLoading.value = true;
      return;
    }

    console.log('Fetching application trends...');
    
    // Fetch trends data from the new endpoint
    const response = await api.get('/applications/trends', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.data?.success && response.data.data) {
      const { data } = response.data;
      console.log('Trends data received:', data);

      // Only update if we have valid data
      if (data.categories && data.categories.length > 0) {
        // Update chart categories (dates)
        chartCategories.value = data.categories;

        // Update chart series data
        chartSeries.value = [
          { name: 'Applied', data: data.series.find(s => s.name === 'Applied')?.data || new Array(data.categories.length).fill(0) },
          { name: 'Under Review', data: data.series.find(s => s.name === 'Under Review')?.data || new Array(data.categories.length).fill(0) },
          { name: 'Approved', data: data.series.find(s => s.name === 'Approved')?.data || new Array(data.categories.length).fill(0) },
          { name: 'Rejected', data: data.series.find(s => s.name === 'Rejected')?.data || new Array(data.categories.length).fill(0) }
        ];

        console.log('Chart updated with trends data:', chartSeries.value);
      } else {
        console.warn('No valid categories in trends data');
      }
    } else {
      console.warn('No success in trends response or no data:', response.data);
    }
  } catch (err) {
    console.error('Error fetching application trends:', err);
    // Don't clear existing chart data on error - keep what we have
  } finally {
    isChartLoading.value = false;
  }
};
</script>

<style scoped>
/* Unchanged styles are kept */
.portal-layout { display: flex; flex-direction: column; height: 100vh; overflow: hidden; }
.sticky-header { position: sticky; top: 0; z-index: 1000; }
.page-wrapper { flex-grow: 1; display:flex; min-height: 100vh; overflow: hidden; background-color: #F0F7FF; }
.content-area { flex: 1; overflow-y: auto; height: 100%; }

.broadcast-banner { background-color: #1D3557 !important; border: 1px solid #457B9D; }
.opacity-8 { opacity: 0.8; }
.interview-card { background-color: #E0F7FA; border-color: #B2EBF2; }
.interview-list .q-item { border-top: 1px solid #B2EBF2; }
.interview-list .q-item:first-child { border-top: none; }
.q-list--separator>.q-item-type+.q-item-type { border-top: 1px solid #EDF2F7; }

/* #################### MODIFIED & NEW STYLES FOR CONTENT AREA #################### */

/* Responsive wrapper for mobile */
@media (max-width: 1023px) {
  .page-wrapper {
    flex-wrap: wrap;
    height: auto;
    overflow-y: auto;
  }
  .content-area {
    width: 100%;
    height: auto;
    overflow-y: visible;
  }
}

.content-title {
  color: #0D1B2A;
}

.subtitle-text {
  color: #5A7184;
}

.list-item-title {
  color: #0D1B2A;
}
.broadcast-banner {
  background-color: #1D3557 !important;
  border: 1px solid #457B9D;
}

.opacity-8 {
  opacity: 0.8;
}
/* Redesigned Stat Cards */
.stat-card {
  background: linear-gradient(145deg, #dfefff, #ffffff);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(29, 135, 255, 0.293) !important;
  transition: all 0.3s ease;
  border: 1px solid #cde3f7;
  height: 100%;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(29, 135, 255, 0.85) !important;
}

.stat-value {
  color: #0D1B2A;
}

.stat-label {
  color: #5A7184;
}
.interview-card {
  background-color: #E0F7FA;
  border-color: #B2EBF2;
}

.interview-list .q-item {
  border-top: 1px solid #B2EBF2;
}

.interview-list .q-item:first-child {
  border-top: none;
}

.q-list--separator>.q-item-type+.q-item-type {
  border-top: 1px solid #EDF2F7;
}
</style>