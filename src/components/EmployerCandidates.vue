<template>
  <div class="portal-layout">
    <AppHeader class="sticky-header" />
    <div class="page-wrapper row no-wrap">
      <EmployerSidebar :active-link="selected" @navigate="(label) => selected = label" />

      <!-- Content -->
      <div class="content-area column q-pa-md">
      <!-- Enhanced Header with Gradient -->
      <div class="content-header q-mb-lg">
        <div class="header-content row justify-between items-center">
          <div class="header-text">
            <div class="text-h4 text-weight-bold content-title">
              <q-icon name="groups" class="q-mr-sm" color="primary" size="md" />
              Candidate Pipeline
            </div>
            <div class="text-subtitle1 subtitle-text">
              Review and manage your applicants with ease
            </div>
          </div>
          <div class="stats-cards row q-gutter-md">
            <div class="stat-card">
              <div class="stat-number">{{ activeCandidates.length }}</div>
              <div class="stat-label">Active</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">{{ rejectedCandidates.length }}</div>
              <div class="stat-label">Rejected</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Enhanced Filters with Glassmorphism -->
      <q-card flat class="q-mb-md control-bar glass-card">
        <div class="row items-center q-pa-md q-gutter-md">
          <div class="col-12 col-md-2">
            <q-select 
              filled 
              dense 
              v-model="selectedJobId" 
              :options="jobOptions" 
              label="Filter by Job"
              emit-value 
              map-options 
              options-dense 
              class="modern-select"
            >
              <template v-slot:prepend>
                <q-icon name="work" color="primary" />
              </template>
            </q-select>
          </div>
          <div class="col-12 col-md-2">
            <q-input 
              filled 
              dense 
              v-model="searchQuery" 
              placeholder="Search candidates..." 
              debounce="300"
              :disable="!selectedJobId" 
              clearable
              class="modern-input"
            >
              <template v-slot:prepend>
                <q-icon name="search" color="primary" />
              </template>
            </q-input>
          </div>
          <div class="col-12 col-md-2">
            <q-select 
              filled 
              dense 
              v-model="experienceFilter" 
              :options="experienceOptions" 
              label="Experience Level" 
              emit-value 
              map-options 
              options-dense 
              clearable
              :disable="!selectedJobId"
              class="modern-select"
            >
              <template v-slot:prepend>
                <q-icon name="trending_up" color="primary" />
              </template>
            </q-select>
          </div>
          <div class="col-12 col-md-2">
            <q-select 
              filled 
              dense 
              v-model="statusFilter" 
              :options="statusFilterOptions" 
              label="Status Filter" 
              emit-value 
              map-options 
              options-dense 
              clearable
              :disable="!selectedJobId"
              class="modern-select"
            >
              <template v-slot:prepend>
                <q-icon name="filter_list" color="primary" />
              </template>
            </q-select>
          </div>
          <div class="col-12 col-md-2">
            <q-select 
              filled 
              dense 
              v-model="sortOption" 
              :options="sortOptions" 
              label="Sort By" 
              emit-value 
              map-options 
              options-dense 
              clearable
              :disable="!selectedJobId"
              class="modern-select"
            >
              <template v-slot:prepend>
                <q-icon name="sort" color="primary" />
              </template>
            </q-select>
          </div>
        </div>
      </q-card>

      <!-- Enhanced Action Bar -->
      <div v-if="selectedCandidates.size > 0" class="action-bar-modern q-mb-md">
        <div class="action-content row items-center justify-between">
          <div class="selection-info">
            <q-icon name="check_circle" color="positive" class="q-mr-sm" />
            <span class="text-weight-medium">
              {{ selectedCandidates.size }} candidate{{ selectedCandidates.size > 1 ? 's' : '' }} selected
            </span>
          </div>
          <div class="action-buttons row q-gutter-sm">
            <q-btn 
              label="Send Email" 
              color="primary" 
              icon="mail" 
              @click="openEmailDialog"
              unelevated
              class="action-btn"
            />
            <q-btn 
              label="Reject Selected" 
              color="negative" 
              icon="close" 
              @click="rejectSelectedCandidates"
              unelevated
              class="action-btn"
            />
            <q-btn 
              label="Clear Selection" 
              color="grey-7" 
              outline 
              @click="clearSelection"
              class="action-btn"
            />
          </div>
        </div>
      </div>

      <!-- Enhanced Candidates Cards List -->
      <div v-if="selectedJobId" class="candidate-cards-wrapper column q-gutter-md">
        <!-- Active Candidates with Animation -->
        <div v-if="activeCandidates.length > 0">
          <div class="section-header-modern q-mb-md">
            <div class="section-title">
              <q-icon name="people" color="positive" class="q-mr-sm" />
              <span class="text-h6 text-weight-medium">Active Candidates</span>
              <q-badge rounded :label="activeCandidates.length" color="positive" class="q-ml-sm" />
            </div>
          </div>
          <div class="candidates-grid">
            <q-card 
              v-for="candidate in activeCandidates" 
              :key="candidate.id" 
              class="candidate-card-modern"
              :class="{ 'selected-card-modern': selectedCandidates.has(candidate.id) }"
              @click="viewCandidate(candidate)"
            >
              <div class="card-content">
                <div class="candidate-header">
                  <q-checkbox 
                    :model-value="selectedCandidates.has(candidate.id)" 
                    @update:model-value="val => toggleCandidateSelection(candidate, val)" 
                    dense
                    @click.stop
                    color="primary"
                    class="selection-checkbox"
                  />
                  <q-avatar size="56px" class="candidate-avatar">
                    <img v-if="candidateProfiles.get(candidate.id)?.photo" 
                         :src="candidateProfiles.get(candidate.id).photo" 
                         alt="Candidate" />
                    <div v-else class="avatar-text">{{ candidate.name.charAt(0) }}</div>
                  </q-avatar>
                  <div class="candidate-info">
                    <div class="candidate-name">{{ candidate.name }}</div>
                    <div class="candidate-details">
                      <q-icon name="schedule" size="xs" class="q-mr-xs" />
                      Applied {{ formatTimeAgo(candidate.appliedDate) }}
                    </div>
                    <div class="candidate-details">
                      <q-icon name="trending_up" size="xs" class="q-mr-xs" />
                      {{ getExperienceLevel(candidate.id) }}
                    </div>
                  </div>
                  <div class="candidate-actions">
                    <div class="ats-score">
                      <div class="score-circle" :style="{ background: `conic-gradient(#1976d2 ${candidate.atsScore * 3.6}deg, #e0e0e0 0deg)` }">
                        <div class="score-inner">
                          <span class="score-text">{{ candidate.atsScore }}%</span>
                        </div>
                      </div>
                      <div class="score-label">ATS Score</div>
                    </div>
                    <q-badge 
                      rounded 
                      :label="candidate.status" 
                      class="status-badge-modern" 
                      :color="getStatusColor(candidate.status)" 
                    />
                  </div>
                </div>
                <div class="hover-actions">
                  <q-btn icon="visibility" size="sm" color="primary" flat round @click.stop="viewCandidate(candidate)">
                    <q-tooltip>View Details</q-tooltip>
                  </q-btn>
                  <q-btn 
                    icon="mail" 
                    size="sm" 
                    color="primary" 
                    flat 
                    round 
                    @click.stop="selectAndOpenEmailDialog(candidate)"
                  >
                    <q-tooltip>Send Email</q-tooltip>
                  </q-btn>
                  <q-btn 
                    icon="check" 
                    size="sm" 
                    color="positive" 
                    flat 
                    round 
                    @click.stop="changeCandidateStatus(candidate, 'approved')"
                  >
                    <q-tooltip>Accept</q-tooltip>
                  </q-btn>
                  <q-btn 
                    icon="close" 
                    size="sm" 
                    color="negative" 
                    flat 
                    round 
                    @click.stop="changeCandidateStatus(candidate, 'rejected')"
                  >
                    <q-tooltip>Reject</q-tooltip>
                  </q-btn>
                </div>
              </div>
            </q-card>
          </div>
        </div>

        <!-- Enhanced Rejected Candidates Section -->
        <div v-if="rejectedCandidates.length > 0" class="rejected-section-modern q-mt-lg">
          <q-expansion-item
            v-model="showRejectedCandidates"
            icon="visibility_off"
            :label="`Rejected Candidates (${rejectedCandidates.length})`"
            class="rejected-expansion"
          >
            <div class="rejected-content q-pa-md">
              <div class="candidates-grid">
                <q-card 
                  v-for="candidate in rejectedCandidates" 
                  :key="candidate.id" 
                  class="candidate-card-modern rejected-card-modern"
                  @click="viewCandidate(candidate)"
                >
                  <div class="card-content">
                    <div class="candidate-header">
                      <q-avatar size="48px" class="candidate-avatar-rejected">
                        <div class="avatar-text">{{ candidate.name.charAt(0) }}</div>
                      </q-avatar>
                      <div class="candidate-info">
                        <div class="candidate-name rejected-name">{{ candidate.name }}</div>
                        <div class="candidate-details rejected-details">
                          Applied {{ formatTimeAgo(candidate.appliedDate) }} • {{ getExperienceLevel(candidate.id) }}
                        </div>
                      </div>
                      <q-badge 
                        rounded 
                        :label="candidate.status" 
                        class="status-badge-modern" 
                        :color="getStatusColor(candidate.status)" 
                      />
                    </div>
                  </div>
                </q-card>
              </div>
            </div>
          </q-expansion-item>
        </div>
      </div>
      <div v-else class="empty-state">
        <div class="empty-content">
          <div class="empty-icon">
            <q-icon name="work_outline" size="5rem" color="primary" />
          </div>
          <div class="empty-title">Select a Job to View Candidates</div>
          <div class="empty-subtitle">Choose from your posted jobs to see all applicants in your pipeline</div>
          <q-btn 
            v-if="jobs.length === 0"
            label="Post Your First Job" 
            color="primary" 
            unelevated 
            class="q-mt-md"
            @click="router.push('/post-job')"
          />
        </div>
      </div>

      <!-- Email Dialog -->
      <q-dialog v-model="showEmailDialog" persistent>
        <q-card class="email-dialog">
          <q-card-section class="dialog-header">
            <div class="text-h6">Send Email to Selected Candidates</div>
            <div class="text-subtitle2 q-mt-sm text-grey-6">
              Sending to {{ selectedCandidateEmails.length }} candidate{{ selectedCandidateEmails.length > 1 ? 's' : '' }}
            </div>
          </q-card-section>
          <q-card-section>
            <div class="q-mb-md">
              <div class="text-weight-medium q-mb-sm">Recipients:</div>
              <q-chip 
                v-for="email in selectedCandidateEmails" 
                :key="email" 
                :label="email"
                color="primary"
                text-color="white"
                dense
                class="q-mr-xs q-mb-xs"
              />
            </div>
            <q-input
              v-model="emailSubject"
              label="Subject *"
              filled
              dense
              class="q-mb-md modern-input"
              :rules="[val => !!val || 'Subject is required']"
            />
            <q-input
              v-model="emailBody"
              label="Message *"
              type="textarea"
              filled
              rows="8"
              class="modern-input"
              :rules="[val => !!val || 'Message is required']"
            />
          </q-card-section>
          <q-card-actions align="right" class="q-pa-md">
            <q-btn flat label="Cancel" color="grey" @click="closeEmailDialog" />
            <q-btn 
              label="Send Email" 
              color="primary" 
              @click="sendBulkEmail"
              :loading="sendingEmail"
              :disable="!emailSubject || !emailBody"
              unelevated
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Candidate Details Modal -->
      <q-dialog v-model="showCandidateDetail" @hide="resetModalState">
        <q-card v-if="selectedCandidate" class="candidate-detail-modal">
          <div class="modal-content">
            <!-- Header -->
            <q-card-section class="modal-header">
              <div class="row items-center justify-between">
                <q-item class="q-pa-none">
                  <q-item-section avatar>
                    <q-avatar size="60px" class="profile-avatar">
                      <img v-if="selectedCandidateProfile?.photo" :src="selectedCandidateProfile.photo" alt="Candidate Photo" />
                      <div v-else>{{ selectedCandidate?.name?.charAt(0) || '' }}</div>
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-h5 text-weight-bold">{{ selectedCandidate.name }}</q-item-label>
                    <q-item-label caption class="text-subtitle1">
                      Applied for {{ getJobTitle(selectedCandidate.jobId) }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
                <q-btn icon="close" flat round dense v-close-popup size="lg" />
              </div>
            </q-card-section>
            <q-separator />
            <!-- Tabs -->
            <q-tabs 
              v-model="detailTab" 
              dense 
              class="modern-tabs" 
              active-color="primary" 
              indicator-color="primary" 
              align="justify"
            >
              <q-tab name="profile" label="Profile" icon="person" />
              <q-tab name="application" label="Application" icon="description" />
              <q-tab name="ats_feedback" label="ATS Feedback" icon="assessment" />
              <q-tab name="notes" label="Notes" icon="notes" />
            </q-tabs>
            <q-separator />
            <!-- Tab Panels -->
            <q-tab-panels v-model="detailTab" animated class="tab-panels">
              <!-- Profile Tab -->
              <q-tab-panel name="profile" class="q-pa-md">
                <div v-if="selectedCandidateProfile" class="profile-content">
                  <!-- Contact Info -->
                  <div class="contact-info q-mb-lg">
                    <div class="section-title q-mb-md">Contact Information</div>
                    <div class="contact-item">
                      <q-icon name="email" class="contact-icon" />
                      <span>{{ selectedCandidateProfile.email }}</span>
                    </div>
                    <div class="contact-item">
                      <q-icon name="phone" class="contact-icon" />
                      <span>{{ selectedCandidateProfile.phoneNumber }}</span>
                    </div>
                  </div>
                  <!-- Documents -->
                  <div class="documents-section q-mb-lg">
                    <div class="section-title q-mb-md">Documents</div>
                    <div class="row q-gutter-sm">
                      <q-btn 
                        icon="description" 
                        label="View Resume" 
                        color="primary" 
                        outline 
                        @click="viewDocument(selectedCandidate.resumeUrl)"
                        class="document-btn"
                        :disable="!selectedCandidate.resumeUrl"
                      />
                      <q-btn 
                        icon="description" 
                        label="View Cover Letter" 
                        color="primary" 
                        outline 
                        @click="viewDocument(selectedCandidate.coverLetter)"
                        class="document-btn"
                        :disable="!selectedCandidate.coverLetter"
                      />
                      <q-btn 
                        icon="download" 
                        label="Download Resume" 
                        color="secondary" 
                        outline 
                        :href="selectedCandidate.resumeUrl" 
                        target="_blank"
                        class="document-btn"
                        :disable="!selectedCandidate.resumeUrl"
                      />
                    </div>
                  </div>
                  <!-- Skills -->
                  <div class="skills-section q-mb-lg">
                    <div class="section-title q-mb-md">Skills</div>
                    <div class="skills-container">
                      <q-chip 
                        v-for="skill in selectedCandidateProfile.skills || []" 
                        :key="skill" 
                        color="primary" 
                        text-color="white"
                        class="skill-chip"
                      >
                        {{ skill }}
                      </q-chip>
                    </div>
                  </div>
                  <!-- Experience -->
                  <div class="experience-section q-mb-lg">
                    <div class="section-title q-mb-md">Experience</div>
                    <div class="experience-timeline">
                      <div v-for="exp in selectedCandidateProfile.experience || []" :key="exp.id" class="experience-item">
                        <div class="timeline-dot"></div>
                        <div class="experience-content">
                          <div class="experience-title">{{ exp.title }}</div>
                          <div class="experience-company">{{ exp.company }}</div>
                          <div class="experience-dates">
                            {{ formatDate(exp.start_date) }} - {{ formatDate(exp.end_date) || 'Present' }}
                          </div>
                          <div class="experience-description">{{ exp.description }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- Education -->
                  <div class="education-section">
                    <div class="section-title q-mb-md">Education</div>
                    <div class="education-list">
                      <div v-for="edu in selectedCandidateProfile.education || []" :key="edu.id" class="education-item">
                        <div class="education-degree">{{ edu.degree }} - {{ edu.school }}</div>
                        <div class="education-dates">{{ formatDate(edu.start_date) }} - {{ formatDate(edu.end_date) }}</div>
                        <div class="education-field">{{ edu.field }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </q-tab-panel>
              <!-- Application Tab -->
              <q-tab-panel name="application" class="q-pa-md">
                <div v-if="selectedCandidate.resumeUrl || selectedCandidate.coverLetter">
                  <iframe v-if="showDocumentViewer && currentDocumentUrl" :src="currentDocumentUrl" class="document-viewer"></iframe>
                  <div class="q-mt-md row q-gutter-sm">
                    <q-btn 
                      icon="download" 
                      label="Download Resume" 
                      color="primary" 
                      outline 
                      :href="selectedCandidate.resumeUrl" 
                      target="_blank" 
                      :disable="!selectedCandidate.resumeUrl"
                    />
                    <q-btn 
                      icon="download" 
                      label="Download Cover Letter" 
                      color="primary" 
                      outline 
                      :href="selectedCandidate.coverLetter" 
                      target="_blank" 
                      :disable="!selectedCandidate.coverLetter"
                    />
                  </div>
                </div>
                <div v-else class="empty-message">No documents available.</div>
              </q-tab-panel>
              <!-- ATS Feedback Tab -->
              <q-tab-panel name="ats_feedback" class="q-pa-md">
                <div v-if="selectedCandidate.atsFeedback">
                  <div class="ats-header q-mb-lg">
                    <div class="ats-score-display">
                      <div class="score-circle-large" :style="{ background: `conic-gradient(#1976d2 ${selectedCandidate.atsScore * 3.6}deg, #e0e0e0 0deg)` }">
                        <div class="score-inner-large">
                          <span class="score-text-large">{{ selectedCandidate.atsScore }}%</span>
                        </div>
                      </div>
                      <div class="ats-title">ATS Compatibility Score</div>
                    </div>
                  </div>
                  <div class="feedback-content">
                    <div class="section-title q-mb-md">Feedback Points</div>
                    <ul class="feedback-list">
                      <li v-for="(point, index) in parseATSFeedback(selectedCandidate.atsFeedback)" :key="index" class="feedback-item">
                        <q-icon name="check_circle" color="positive" class="q-mr-sm" />
                        {{ point }}
                      </li>
                    </ul>
                  </div>
                </div>
                <div v-else class="empty-message">No ATS feedback available.</div>
              </q-tab-panel>
              <!-- Notes Tab -->
              <q-tab-panel name="notes" class="q-pa-md">
                <div v-if="loadingNotes" class="loading-message">
                  <q-spinner color="primary" size="2em" />
                  <span class="q-ml-sm">Loading notes...</span>
                </div>
                <div v-else class="notes-content">
                  <div v-if="notes.length === 0" class="empty-message q-mb-md">
                    No notes added yet. Add your first note below.
                  </div>
                  <div v-else class="notes-list q-mb-lg">
                    <div v-for="n in notes" :key="n.id" class="note-item">
                      <div class="note-content">{{ n.note }}</div>
                      <div class="note-date">{{ formatDate(n.created_at) }}</div>
                    </div>
                  </div>
                  <div class="add-note-section">
                    <div class="section-title q-mb-md">Add New Note</div>
                    <q-input
                      v-model="newNote"
                      type="textarea"
                      label="Write your note here..."
                      outlined
                      rows="4"
                      class="modern-input q-mb-md"
                    />
                    <q-btn
                      label="Save Note"
                      color="primary"
                      @click="addNote"
                      :disable="!newNote.trim()"
                      unelevated
                      icon="add"
                    />
                  </div>
                </div>
              </q-tab-panel>
            </q-tab-panels>
          </div>
          <!-- Actions -->
          <q-card-actions align="right" class="modal-actions q-pa-md">
            <q-btn 
              flat 
              label="Reject" 
              color="negative" 
              @click="changeCandidateStatus(selectedCandidate, 'rejected')"
            />
            <q-btn 
              flat 
              label="Accept" 
              color="positive" 
              @click="changeCandidateStatus(selectedCandidate, 'approved')"
              unelevated
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </div>
  </div>
  
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import api from 'src/services/auth.service.js';
import AppHeader from 'src/components/HeaderPart.vue';
import EmployerSidebar from 'src/components/EmployerSidebar.vue';
import { useQuasar } from 'quasar';
import { authHelpers } from 'src/services/auth.service.js';

const $q = useQuasar();
const router = useRouter();
const route = useRoute();

const selected = ref('Candidates');

const companyId = authHelpers.getCurrentUser()?.id;

// Selection and Email State
const selectedCandidates = ref(new Set());
const showEmailDialog = ref(false);
const emailSubject = ref('');
const emailBody = ref('');
const sendingEmail = ref(false);
const selectedCandidate = ref(null);

// Filter State
const experienceFilter = ref(null);
const statusFilter = ref(null);
const showRejectedCandidates = ref(false);
const sortOption = ref(null);

// API State
const jobs = ref([]);
const applications = ref([]);
const allCandidates = ref([]);
const selectedCandidateProfile = ref(null);
const candidateProfiles = ref(new Map());

// Page State
const selectedJobId = ref(null);
const searchQuery = ref('');
const showCandidateDetail = ref(false);
const detailTab = ref('profile');
const notes = ref([]);
const newNote = ref('');
const loadingNotes = ref(false);

// Document Viewer State
const showDocumentViewer = ref(false);
const currentDocumentUrl = ref('');

// Filter Options
const experienceOptions = [
  { label: 'Entry Level (0-2 years)', value: 'entry' },
  { label: 'Mid Level (3-5 years)', value: 'mid' },
  { label: 'Senior Level (6+ years)', value: 'senior' }
];

const statusFilterOptions = [
  { label: 'All Active', value: 'active' },
  { label: 'Applied', value: 'applied' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' }
];

const sortOptions = [
  { label: 'ATS Score (High to Low)', value: 'ats_score_desc' },
  { label: 'ATS Score (Low to High)', value: 'ats_score_asc' },
  { label: 'Applied Date (Newest First)', value: 'applied_date_desc' },
  { label: 'Applied Date (Oldest First)', value: 'applied_date_asc' },
  { label: 'Name (A-Z)', value: 'name_asc' },
  { label: 'Name (Z-A)', value: 'name_desc' }
];

// Selection Functions
const toggleCandidateSelection = (candidate, selected) => {
  if (selected) {
    selectedCandidates.value.add(candidate.id);
  } else {
    selectedCandidates.value.delete(candidate.id);
  }
};

const clearSelection = () => {
  selectedCandidates.value.clear();
};

// Email Functions
const openEmailDialog = () => {
  if (selectedCandidates.value.size === 0) {
    $q.notify({
      type: 'warning',
      message: 'Please select at least one candidate'
    });
    return;
  }
  emailSubject.value = '';
  emailBody.value = '';
  showEmailDialog.value = true;
};

// New function to handle email dialog from hover actions
const selectAndOpenEmailDialog = (candidate) => {
  selectedCandidates.value.clear();
  selectedCandidates.value.add(candidate.id);
  openEmailDialog();
};

const closeEmailDialog = () => {
  showEmailDialog.value = false;
  emailSubject.value = '';
  emailBody.value = '';
};

const sendBulkEmail = async () => {
  if (!emailSubject.value || !emailBody.value) {
    $q.notify({
      type: 'warning',
      message: 'Please fill in both subject and message'
    });
    return;
  }

  sendingEmail.value = true;
  try {
    const recipientEmails = selectedCandidateEmails.value;
    
    await api.post('/emails/bulk', {
      recipients: recipientEmails,
      subject: emailSubject.value,
      text: emailBody.value,
      companyId
    });

    $q.notify({
      type: 'positive',
      message: `Email sent successfully to ${recipientEmails.length} candidate${recipientEmails.length > 1 ? 's' : ''}!`
    });

    closeEmailDialog();
    clearSelection();
  } catch (error) {
    console.error('Error sending bulk email:', error.response?.data || error.message);
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Failed to send email. Please try again.'
    });
  } finally {
    sendingEmail.value = false;
  }
};

// Fetch Functions
const fetchJobs = async () => {
  try {
    const res = await api.get(`/jobs/jobs/company/${companyId}`);
    jobs.value = res.data.jobs || [];
  } catch (err) {
    console.error('Error fetching jobs:', err.response?.data || err.message);
    $q.notify({
      type: 'negative',
      message: err.response?.data?.message || 'Failed to fetch jobs'
    });
  }
};

const fetchCompanyCandidates = async () => {
  try {
    const res = await api.get(`/applications/company-candidates/${companyId}`);
    applications.value = res.data.applications || [];
    
    // Populate jobs from applications
    const jobMap = new Map();
    applications.value.forEach(app => {
      if (!jobMap.has(app.job.id)) {
        jobMap.set(app.job.id, {
          id: app.job.id,
          title: app.job.title,
          location: app.job.location,
          type: app.job.type,
          company_id: app.job.company_id
        });
      }
    });
    jobs.value = Array.from(jobMap.values());

    // Populate allCandidates
    allCandidates.value = applications.value.map(app => ({
      id: app.job_seeker_id,
      name: app.jobSeeker.name,
      email: app.jobSeeker.email,
      jobId: app.job_id,
      jobTitle: app.job.title,
      status: formatStatus(app.status),
      appliedDate: app.applied_at,
      resumeUrl: app.resume_link,
      coverLetter: app.cover_letter,
      atsScore: app.ats_score || 0,
      atsFeedback: app.ats_feedback,
      notes: '',
      applicationId: app.id
    }));

    // Populate candidateProfiles
   applications.value.forEach(app => {
  const profile = app.jobSeeker.jobSeekerProfile || {}; // safe guard
  candidateProfiles.value.set(app.job_seeker_id, {
    id: app.job_seeker_id,
    name: app.jobSeeker.name || 'N/A',
    email: app.jobSeeker.email || 'N/A',
    phoneNumber: profile.phone_number || 'Not provided',
    photo: profile.photo || '',
    skills: JSON.parse(profile.skills_json || '[]'),
    experience: profile.experience || [],
    education: profile.education || []
  });
});
  }
 catch (err) {
    console.error('Error fetching candidates:', err.response?.data || err.message);
    $q.notify({
      type: 'negative',
      message: err.response?.data?.message || 'Failed to fetch candidates'
    });
  }
};

const fetchNotes = async (jobId, userId) => {
  try {
    loadingNotes.value = true;
    const res = await api.get(`/notes/${jobId}/${userId}?companyId=${companyId}`);
    notes.value = res.data.notes || [];
  } catch (err) {
    console.error('Error fetching notes:', err.response?.data || err.message);
    notes.value = [];
    $q.notify({
      type: 'negative',
      message: err.response?.data?.message || 'Failed to fetch notes'
    });
  } finally {
    loadingNotes.value = false;
  }
};

const addNote = async () => {
  if (!newNote.value.trim()) return;
  try {
    const res = await api.post(
      `/notes/${selectedCandidate.value.jobId}/${selectedCandidate.value.id}`,
      { note: newNote.value, companyId }
    );
    notes.value.unshift(res.data.note);
    newNote.value = '';
    $q.notify({
      type: 'positive',
      message: 'Note added successfully'
    });
  } catch (err) {
    console.error('Error adding note:', err.response?.data || err.message);
    $q.notify({
      type: 'negative',
      message: err.response?.data?.message || 'Failed to add note'
    });
  }
};

// Parse ATS Feedback
const parseATSFeedback = (feedback) => {
  if (!feedback) return [];
  return feedback.split('. ').map(point => point.trim()).filter(point => point);
};

// View Document
const viewDocument = (url) => {
  if (!url) {
    $q.notify({
      type: 'warning',
      message: 'No document available'
    });
    return;
  }
  currentDocumentUrl.value = url;
  showDocumentViewer.value = true;
};

// Reset modal state
const resetModalState = () => {
  showCandidateDetail.value = false;
  selectedCandidate.value = null;
  selectedCandidateProfile.value = null;
  showDocumentViewer.value = false;
  currentDocumentUrl.value = '';
  notes.value = [];
  newNote.value = '';
};

// Helper Functions
const getExperienceLevel = (candidateId) => {
  const profile = candidateProfiles.value.get(candidateId);
  if (!profile || !profile.experience || profile.experience.length === 0) {
    return 'Not specified';
  }

  let totalYears = 0;
  profile.experience.forEach(exp => {
    const startDate = new Date(exp.start_date);
    const endDate = exp.end_date ? new Date(exp.end_date) : new Date();
    const years = (endDate - startDate) / (1000 * 60 * 60 * 24 * 365);
    totalYears += years;
  });

  if (totalYears < 2) return 'Entry Level (0-2 years)';
  if (totalYears < 6) return 'Mid Level (3-5 years)';
  return 'Senior Level (6+ years)';
};

// Computed Properties
const jobOptions = computed(() => jobs.value.map(job => ({ label: job.title, value: job.id })));

const selectedCandidateEmails = computed(() => {
  return Array.from(selectedCandidates.value)
    .map(id => allCandidates.value.find(c => c.id === id)?.email)
    .filter(Boolean);
});

const filteredCandidates = computed(() => {
  if (!selectedJobId.value) return [];
  
  let candidates = allCandidates.value.filter(c => c.jobId === selectedJobId.value);

  if (searchQuery.value) {
    candidates = candidates.filter(c => 
      c.name?.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  if (experienceFilter.value) {
    candidates = candidates.filter(c => {
      const expLevel = getExperienceLevel(c.id);
      const levelMap = { entry: 'Entry Level', mid: 'Mid Level', senior: 'Senior Level' };
      return expLevel.includes(levelMap[experienceFilter.value]);
    });
  }

  if (statusFilter.value && statusFilter.value !== 'active') {
    candidates = candidates.filter(c => c.status.toLowerCase() === statusFilter.value);
  }

  if (sortOption.value) {
    candidates = [...candidates].sort((a, b) => {
      switch (sortOption.value) {
        case 'ats_score_desc': return (b.atsScore || 0) - (a.atsScore || 0);
        case 'ats_score_asc': return (a.atsScore || 0) - (b.atsScore || 0);
        case 'applied_date_desc': return new Date(b.appliedDate) - new Date(a.appliedDate);
        case 'applied_date_asc': return new Date(a.appliedDate) - new Date(b.appliedDate);
        case 'name_asc': return a.name.localeCompare(b.name);
        case 'name_desc': return b.name.localeCompare(a.name);
        default: return 0;
      }
    });
  }

  return candidates;
});

const activeCandidates = computed(() => 
  filteredCandidates.value.filter(c => c.status.toLowerCase() !== 'rejected')
);

const rejectedCandidates = computed(() => 
  filteredCandidates.value.filter(c => c.status.toLowerCase() === 'rejected')
);


// Lifecycle
onMounted(async () => {
  await fetchJobs();
  await fetchCompanyCandidates();
  
  const jobIdFromQuery = parseInt(route.query.jobId);
  if (jobIdFromQuery && jobs.value.some(j => j.id === jobIdFromQuery)) {
    selectedJobId.value = jobIdFromQuery;
  }
});

watch(selectedJobId, () => { 
  searchQuery.value = '';
  experienceFilter.value = null;
  statusFilter.value = null;
  clearSelection();
});

// Helper Functions
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const options = { year: 'numeric', month: 'short' };
  return new Date(dateStr).toLocaleDateString(undefined, options);
};

const formatStatus = (s) => {
  const map = {
    applied: 'Applied',
    approved: 'Approved',
    rejected: 'Rejected'
  };
  return map[s] || s.charAt(0).toUpperCase() + s.slice(1);
};

const getStatusColor = (status) => {
  const colorMap = {
    'Applied': 'blue',
    'Approved': 'positive',
    'Rejected': 'negative'
  };
  return colorMap[status] || 'grey';
};

const getJobTitle = (jobId) => jobs.value.find(j => j.id === jobId)?.title || 'N/A';

const viewCandidate = async (candidate) => {
  selectedCandidate.value = { ...candidate };
  selectedCandidateProfile.value = candidateProfiles.value.get(candidate.id) || null;
  detailTab.value = 'profile';
  showDocumentViewer.value = false;
  currentDocumentUrl.value = '';
  await fetchNotes(candidate.jobId, candidate.id);
  showCandidateDetail.value = true;
};

const changeCandidateStatus = async (candidate, newStatus) => {
  if (!['applied', 'approved', 'rejected'].includes(newStatus.toLowerCase())) {
    $q.notify({
      type: 'negative',
      message: 'Invalid status'
    });
    return;
  }
  if (!candidate.applicationId) {
    $q.notify({
      type: 'negative',
      message: 'Missing application ID'
    });
    return;
  }
  try {
    await api.put(`/applications/${candidate.applicationId}/status`, { status: newStatus.toLowerCase(), companyId });
    const original = allCandidates.value.find(c => c.id === candidate.id);
    if (original) {
      original.status = formatStatus(newStatus.toLowerCase());
    }
    if (selectedCandidate.value?.id === candidate.id) {
      selectedCandidate.value.status = formatStatus(newStatus.toLowerCase());
    }
    $q.notify({
      type: 'positive',
      message: `Candidate status updated to ${formatStatus(newStatus.toLowerCase())}`
    });
    // Close modal after successful status update
    if (showCandidateDetail.value) {
      showCandidateDetail.value = false;
    }
  } catch (err) {
    console.error('Error updating status:', err.response?.data || err.message);
    $q.notify({
      type: 'negative',
      message: err.response?.data?.message || 'Failed to update candidate status'
    });
  }
};

const rejectSelectedCandidates = async () => {
  if (selectedCandidates.value.size === 0) {
    $q.notify({
      type: 'warning',
      message: 'No candidates selected'
    });
    return;
  }
  try {
    for (const candidateId of selectedCandidates.value) {
      const candidate = allCandidates.value.find(c => c.id === candidateId);
      if (candidate && candidate.applicationId) {
        await api.put(`/applications/${candidate.applicationId}/status`, { status: 'rejected', companyId });
        candidate.status = 'Rejected';
      }
    }
    $q.notify({
      type: 'positive',
      message: `Rejected ${selectedCandidates.value.size} candidate${selectedCandidates.value.size > 1 ? 's' : ''}`
    });
    clearSelection();
  } catch (err) {
    console.error('Error rejecting candidates:', err.response?.data || err.message);
    $q.notify({
      type: 'negative',
      message: err.response?.data?.message || 'Failed to reject candidates'
    });
  }
};

// Format time ago for applied date
const formatTimeAgo = (date) => {
  const now = new Date();
  const applied = new Date(date);
  const diffInDays = Math.floor((now - applied) / (1000 * 60 * 60 * 24));
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  return `${diffInDays} days ago`;
};
</script>

<style scoped>
/* Base Layout */
.portal-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.sticky-header {
  position: sticky;
  top: 0;
  z-index: 1000;
}

.page-wrapper {
  flex-grow: 1;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.sidebar, .content-area {
  height: 100%;
}

.content-area {
  flex: 1;
  overflow-y: auto;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

/* Enhanced Header */
.content-header {
  background: linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%);
  border-radius: 20px;
  padding: 24px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.2);
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
}

.header-content {
  align-items: center;
}

.content-title {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
}

.subtitle-text {
  color: #6b7280;
  font-size: 1.1rem;
}

.stats-cards {
  gap: 16px;
}

.stat-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-radius: 16px;
  text-align: center;
  min-width: 100px;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
}

.stat-number {
  font-size: 2rem;
  font-weight: bold;
  line-height: 1;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.9;
  margin-top: 4px;
}

/* Glassmorphism Filter Bar */
.glass-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.1);
}

.modern-select,
.modern-input {
  border-radius: 12px;
}

.modern-select .q-field__control,
.modern-input .q-field__control {
  border-radius: 12px;
}

/* Enhanced Action Bar */
.action-bar-modern {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  border-radius: 16px;
  padding: 0;
  box-shadow: 0 4px 15px rgba(79, 172, 254, 0.3);
  animation: slideInDown 0.5s ease;
}

.action-content {
  padding: 16px 20px;
  color: white;
}

.selection-info {
  display: flex;
  align-items: center;
  font-size: 1.1rem;
}

.action-buttons {
  gap: 12px;
}

.action-btn {
  border-radius: 10px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}

/* Section Headers */
.section-header-modern {
  padding: 16px 0;
  border-bottom: 2px solid rgba(102, 126, 234, 0.2);
}

.section-title {
  display: flex;
  align-items: center;
  color: #374151;
  font-weight: 600;
}

/* Modern Candidates Grid */
.candidates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 20px;
}

.candidate-card-modern {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(20px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.candidate-card-modern:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.candidate-card-modern:hover .hover-actions {
  opacity: 1;
  transform: translateY(0);
}

.selected-card-modern {
  border: 2px solid #667eea;
  box-shadow: 0 8px 30px rgba(102, 126, 234, 0.3);
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
}

.card-content {
  padding: 24px;
}

.candidate-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.selection-checkbox {
  flex-shrink: 0;
}

.candidate-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 1.2rem;
  flex-shrink: 0;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.avatar-text {
  font-weight: 600;
}

.candidate-info {
  flex-grow: 1;
  min-width: 0;
}

.candidate-name {
  font-size: 1.2rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.candidate-details {
  font-size: 0.9rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  margin-bottom: 2px;
}

.candidate-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

/* ATS Score Circle */
.score-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.score-inner {
  width: 46px;
  height: 46px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.score-text {
  font-size: 0.8rem;
  font-weight: 600;
  color: #1976d2;
}

.score-label {
  font-size: 0.7rem;
  color: #6b7280;
  text-align: center;
}

.status-badge-modern {
  font-weight: 600;
  text-transform: capitalize;
  padding: 6px 12px;
  font-size: 0.8rem;
}

/* Hover Actions */
.hover-actions {
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  gap: 8px;
  opacity: 0;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.9);
  padding: 8px;
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

/* Rejected Cards */
.rejected-card-modern {
  opacity: 0.7;
  background: rgba(250, 250, 250, 0.9);
  border-color: #e5e7eb;
}

.candidate-avatar-rejected {
  background: #9ca3af;
  color: white;
}

.rejected-name {
  color: #6b7280;
}

.rejected-details {
  color: #9ca3af;
}

.rejected-section-modern {
  background: rgba(248, 250, 252, 0.9);
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  backdrop-filter: blur(10px);
}

.rejected-expansion {
  border-radius: 16px;
}

.rejected-content {
  background: rgba(255, 255, 255, 0.5);
}

/* Empty State */
.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  margin: 20px 0;
}

.empty-content {
  text-align: center;
  padding: 40px;
}

.empty-icon {
  margin-bottom: 20px;
  opacity: 0.6;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.empty-subtitle {
  font-size: 1rem;
  color: #6b7280;
  margin-bottom: 20px;
}

/* Dialog Enhancements */
.email-dialog {
  border-radius: 20px;
  overflow: hidden;
  max-width: 600px;
  width: 90vw;
}

.dialog-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.candidate-detail-modal {
  border-radius: 20px;
  overflow: hidden;
  width: 800px;
  height: 90vh;
  max-width: 95vw;
  max-height: 90vh;
}

.modal-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.modal-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.profile-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 1.5rem;
  border: 3px solid white;
}

.modern-tabs {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
}

.tab-panels {
  flex: 1;
  overflow-y: auto;
  background: rgba(255, 255, 255, 0.95);
}

/* Profile Content */
.profile-content {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.contact-info, .documents-section, .skills-section, .experience-section, .education-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #374151;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: #6b7280;
  margin-bottom: 8px;
}

.contact-icon {
  color: #667eea;
}

.document-btn {
  border-radius: 10px;
}

.skills-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-chip {
  font-size: 0.8rem;
}

.experience-timeline {
  position: relative;
  padding-left: 20px;
}

.experience-item {
  position: relative;
  margin-bottom: 20px;
}

.timeline-dot {
  position: absolute;
  left: -20px;
  top: 8px;
  width: 12px;
  height: 12px;
  background: #667eea;
  border-radius: 50%;
}

.experience-content {
  background: rgba(255, 255, 255, 0.9);
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.experience-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
}

.experience-company {
  font-size: 0.9rem;
  color: #6b7280;
}

.experience-dates {
  font-size: 0.8rem;
  color: #9ca3af;
}

.experience-description {
  font-size: 0.9rem;
  color: #6b7280;
  margin-top: 8px;
}

.education-item {
  margin-bottom: 16px;
}

.education-degree {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
}

.education-dates {
  font-size: 0.8rem;
  color: #9ca3af;
}

.education-field {
  font-size: 0.9rem;
  color: #6b7280;
}

.document-viewer {
  width: 100%;
  height: 400px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
}

.ats-score-display {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.score-circle-large {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.score-inner-large {
  width: 80px;
  height: 80px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.score-text-large {
  font-size: 1.2rem;
  font-weight: 600;
  color: #1976d2;
}

.ats-title {
  font-size: 1rem;
  color: #374151;
  margin-top: 8px;
}

.feedback-list {
  list-style: none;
  padding: 0;
}

.feedback-item {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: #6b7280;
  margin-bottom: 8px;
}

.notes-list {
  max-height: 300px;
  overflow-y: auto;
}

.note-item {
  background: rgba(255, 255, 255, 0.9);
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.note-content {
  font-size: 0.9rem;
  color: #374151;
}

.note-date {
  font-size: 0.8rem;
  color: #9ca3af;
  margin-top: 4px;
}

.empty-message {
  text-align: center;
  color: #6b7280;
  font-size: 1rem;
}

.loading-message {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
}
</style>