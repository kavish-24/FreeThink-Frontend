<template>
  <div class="portal-layout">
    <AppHeader class="sticky-header" />
    <div class="page-wrapper row no-wrap">
      <div class="sidebar">
        <div class="sidebar-section logo-section flex items-center q-gutter-sm q-pa-md">
          <q-avatar icon="business_center" color="white" text-color="primary" />
          <div>
            <div class="text-h6 text-white">JobHub</div>
            <div class="text-caption text-blue-grey-3">Employer Portal</div>
          </div>
        </div>
        <div class="sidebar-section q-pt-sm q-pb-none q-px-md">
          <div class="text-subtitle1 text-weight-medium text-white">{{ employer.name }}</div>
          <div class="text-caption text-blue-grey-4">{{ employer.email }}</div>
        </div>
        <div class="sidebar-section q-pt-md q-pb-none">
          <q-list class="nav-list">
            <q-item v-for="link in links" :key="link.label" :active="selected === link.label" active-class="active-link"
              clickable v-ripple @click="navigate(link)">
              <q-item-section avatar>
                <q-icon :name="link.icon" />
              </q-item-section>
              <q-item-section>
                {{ link.label }}
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>

      <div class="content-area screening-test-bg q-pa-md q-pa-lg-xl">
<div class="page-header">
  <q-icon name="science" color="primary" size="3rem" />
  <div class="page-header-text">
    <div class="text-h4 text-weight-bold">{{ isEditMode ? 'Edit Screening Test' : 'Create Screening Test' }}</div>
    <div class="text-subtitle1 text-grey-7">
      {{ isEditMode ? 'Modify the details and questions for this assessment.' : 'Design a custom assessment to identify top candidates.' }}
    </div>
  </div>
</div>
        <q-card class="form-card">
          <q-form @submit.prevent="confirmAndSaveTest">
            <q-card-section>
              <div class="text-h6 q-mb-md text-primary">Test Details</div>
              <div class="row q-col-gutter-lg">
                <div class="col-12 col-md-5">
                  <q-select filled v-model="test.jobId" :options="jobOptions" label="Select Associated Job" emit-value map-options :loading="loadingJobs" :rules="[val => !!val || 'Please select a job']" options-dense>
                    <template v-slot:prepend><q-icon name="work_outline" /></template>
                  </q-select>
                </div>
                <div class="col-12 col-md-5">
                  <q-input filled v-model="test.title" label="Test Title" hint="e.g., 'Frontend Skills Assessment'" :rules="[val => val && val.length > 0 || 'Test title is required']">
                  <template v-slot:prepend><q-icon name="title" /></template>
                  </q-input>
                </div>
                <div class="col-12 col-md-2">
                    <q-input filled v-model.number="test.duration" type="number" label="Duration" suffix="min" :rules="[val => val > 0 || 'Must be > 0']" />
                </div>
              </div>
            </q-card-section>

            <q-separator spaced="lg" />

            <q-card-section>
              <div class="row justify-between items-center q-mb-md">
                <div class="text-h6 text-primary">Questions ({{ test.questions.length }}) - Total Points: {{ totalPoints }}</div>
                <div class="q-gutter-sm">
                   <q-btn unelevated icon="playlist_add" label="Bulk Add" @click="showBulkAddDialog = true" color="secondary" padding="xs md" />
                   <q-btn unelevated icon="inventory_2" label="Add from Bank" @click="openQuestionBank" color="teal" padding="xs md" />
                   <q-btn unelevated icon="add_circle" label="Add Question" @click="addQuestion" color="primary" padding="xs md" />
                </div>
              </div>

              <q-banner v-if="validationErrors.length > 0" rounded class="bg-red-1 text-red-8 q-mb-md">
                  <template v-slot:avatar><q-icon name="warning" /></template>
                  Please fix the following issues before publishing:
                  <ul class="q-pl-lg q-mt-sm">
                      <li v-for="error in validationErrors" :key="error">{{ error }}</li>
                  </ul>
              </q-banner>

              <q-banner v-if="test.questions.length === 0" rounded class="bg-indigo-1 text-indigo-8">
                <template v-slot:avatar><q-icon name="quiz" color="indigo-5" /></template>
                Your test is empty! Click "Add Question" to start building your assessment.
              </q-banner>

              <draggable v-model="test.questions" item-key="id" class="q-mt-md" handle=".drag-handle">
                <template #item="{ element: q, index }">
                  <q-card flat bordered class="question-card q-my-md">
                    <q-card-section class="question-header-section">
                      <div class="question-header">
                        <div class="row items-center q-gutter-x-sm">
                            <q-icon name="drag_indicator" class="drag-handle cursor-grab" color="grey-6" />
                            <div class="text-subtitle1 text-weight-bold">Question {{ index + 1 }}</div>
                        </div>
                        <div class="row items-center q-gutter-x-sm">
                          <q-btn flat dense round :icon="q.isBanked ? 'bookmark' : 'bookmark_border'" :color="q.isBanked ? 'amber' : 'grey-7'" @click="toggleBankStatus(q)">
                              <q-tooltip>{{ q.isBanked ? 'Saved in Bank' : 'Save to Question Bank' }}</q-tooltip>
                          </q-btn>
                          <q-input dense outlined v-model.number="q.points" type="number" label="Points" style="width: 80px;" />
                          <q-btn flat dense round icon="delete_sweep" color="negative" @click="removeQuestion(index)" aria-label="Remove Question">
                            <q-tooltip>Remove Question</q-tooltip>
                          </q-btn>
                        </div>
                      </div>
                    </q-card-section>
                    <q-card-section class="q-pt-none">
                      <div class="q-gutter-y-md q-mt-md">
                        <q-input v-model="q.text" label="Question Text" filled stack-label type="textarea" />
                        <q-select v-model="q.type" :options="['Multiple Choice', 'True/False', 'Short Answer']" label="Question Type" filled stack-label options-dense />
                        <div v-if="q.type === 'Multiple Choice'" class="q-gutter-y-sm q-mt-md options-container">
                          <div class="text-caption text-weight-medium">Options & Correct Answer (Select one)</div>
                          <q-input v-for="optIndex in 4" :key="optIndex" v-model="q.options[optIndex - 1]" :label="`Option ${String.fromCharCode(64 + optIndex)}`" dense filled>
                            <template v-slot:prepend>
                              <q-radio v-model="q.correctAnswer" :val="q.options[optIndex - 1]" />
                            </template>
                          </q-input>
                        </div>
                        <div v-if="q.type === 'True/False'" class="q-mt-md options-container">
                          <div class="text-caption text-weight-medium">Correct Answer</div>
                          <q-option-group v-model="q.correctAnswer" :options="[{label: 'True', value: 'True'}, {label: 'False', value: 'False'}]" inline />
                        </div>
                        <div v-if="q.type === 'Short Answer'" class="q-mt-md options-container">
                          <q-input v-model="q.correctAnswer" label="Expected Answer (Case-sensitive)" filled stack-label hint="The candidate's answer must match this exactly."/>
                        </div>
                      </div>
                    </q-card-section>
                  </q-card>
                </template>
              </draggable>
            </q-card-section>

<q-card-actions align="right" class="q-pa-lg bg-grey-1">
  <q-btn label="Preview Test" flat color="primary" @click="showPreviewDialog = true" icon="visibility" />
  <q-space />
  <q-btn v-if="!isEditMode" label="Save Test as Draft" flat color="grey-8" @click="saveDraft" icon="save" />
  <q-btn 
    :label="isEditMode ? 'Save Changes' : 'Create & Publish Test'" 
    type="submit" 
    color="primary" 
    glossy 
    padding="sm xl" 
    :loading="isSaving" 
    :icon-right="isEditMode ? 'save' : 'publish'"
  />
</q-card-actions>
          </q-form>
        </q-card>
      </div>
    </div>

    <q-dialog v-model="showBulkAddDialog">
        <q-card style="width: 500px">
            <q-card-section class="row items-center q-pb-none">
                <div class="text-h6">Bulk Add Questions</div>
                <q-space />
                <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>
            <q-card-section>
                <p>Choose how many new, empty question blocks you would like to add to the test.</p>
                <q-slider v-model="bulkAddCount" :min="1" :max="20" label-always :label-value="`${bulkAddCount} questions`" class="q-mt-lg" />
            </q-card-section>
            <q-card-actions align="right">
                <q-btn flat label="Cancel" v-close-popup />
                <q-btn unelevated label="Add Questions" color="secondary" @click="handleBulkAdd" />
            </q-card-actions>
        </q-card>
    </q-dialog>

    <q-dialog v-model="showBankDialog">
        <q-card style="width: 700px; max-width: 90vw;">
            <q-card-section class="row items-center q-pb-none">
                <div class="text-h6">Question Bank</div>
                <q-space />
                <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>
            <q-card-section>
                <div v-if="questionBank.length === 0" class="text-center text-grey-6 q-pa-lg">
                    <q-icon name="inventory_2" size="4em" />
                    <div>Your question bank is empty.</div>
                    <div class="text-caption">Save questions from the editor to add them here.</div>
                </div>
                <q-list v-else bordered separator>
                    <q-item v-for="q_bank in questionBank" :key="q_bank.id">
                        <q-item-section>
                            <q-item-label>{{ q_bank.text }}</q-item-label>
                            <q-item-label caption>{{ q_bank.type }} - {{ q_bank.points }} pts</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                           <div class="row no-wrap">
                               <q-btn unelevated size="sm" color="primary" label="Add" @click="addFromBank(q_bank)" class="q-mr-sm" />
                               <q-btn flat round dense color="negative" icon="delete" @click="removeFromBank(q_bank.id, q_bank.text)">
                                   <q-tooltip>Remove from Bank</q-tooltip>
                               </q-btn>
                           </div>
                        </q-item-section>
                    </q-item>
                </q-list>
            </q-card-section>
        </q-card>
    </q-dialog>

    <q-dialog v-model="showPreviewDialog" full-width>
        <q-card>
            <q-card-section class="bg-primary text-white row items-center q-pb-none">
                <div class="text-h6">Test Preview: {{ test.title }}</div>
                <q-space />
                <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>
            <q-card-section class="q-pa-lg">
                <div class="text-center text-grey-8 q-mb-md">
                    <q-icon name="timer" /> {{ test.duration }} Minutes | <q-icon name="functions" /> {{ totalPoints }} Total Points
                </div>
                <div v-for="(q_preview, index) in test.questions" :key="q_preview.id" class="q-mb-lg">
                    <p><strong>Question {{ index + 1 }}:</strong> {{ q_preview.text }} ({{ q_preview.points }} pts)</p>
                    <div v-if="q_preview.type === 'Multiple Choice'">
                        <q-option-group type="radio" :options="q_preview.options.map(opt => ({label: opt, value: opt}))" />
                    </div>
                    <div v-if="q_preview.type === 'True/False'">
                        <q-option-group type="radio" :options="[{label: 'True', value: 'True'}, {label: 'False', value: 'False'}]" />
                    </div>
                    <div v-if="q_preview.type === 'Short Answer'">
                        <q-input outlined label="Your Answer" />
                    </div>
                    <q-separator class="q-mt-lg" />
                </div>
            </q-card-section>
        </q-card>
    </q-dialog>

  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter, useRoute } from 'vue-router';
import AppHeader from 'src/components/HeaderPart.vue';
import draggable from 'vuedraggable';

const router = useRouter();
const route = useRoute();
const $q = useQuasar();

// A computed property to detect if we are in "edit" mode
const isEditMode = computed(() => !!route.params.testId);

// --- Sidebar Logic ---
const employer = ref({ name: 'Innovate Inc.', email: 'hr@innovate.com' });
const selected = ref('Create Screening Test');
const links = [
  { label: 'Dashboard', icon: 'dashboard', to: '/employer-portal' },
  { label: 'Posted Jobs', icon: 'work', to: '/posted-jobs' },
  { label: 'Post New Job', icon: 'add_box', to: '/post-job' },
  { label: 'Screening Tests', icon: 'playlist_add_check', to: '/view-tests' },
  { label: 'Create Screening Test', icon: 'science', to: '/screening-test' },
  { label: 'Candidates', icon: 'groups', to: '/candidates' },
  { label: 'Messages', icon: 'mail', to: '/employer-messages' },
  { label: 'Company Profile', icon: 'domain', to: '/company-profile' },
  { label: 'Settings', icon: 'settings', to: '/employer-settings' }
];
const navigate = (link) => {
  selected.value = link.label;
  if (link.to) router.push(link.to);
};

// --- Screening Test Form Logic ---
const test = ref({
  jobId: null,
  title: '',
  duration: 30,
  questions: [],
});
const jobOptions = ref([]);
const loadingJobs = ref(false);
const isSaving = ref(false);
let questionIdCounter = 0;
const showBulkAddDialog = ref(false);
const bulkAddCount = ref(5);
const showBankDialog = ref(false);
const questionBank = ref([]);
const showPreviewDialog = ref(false);
const validationErrors = ref([]);

const totalPoints = computed(() => {
  return test.value.questions.reduce((total, q) => total + (Number(q.points) || 0), 0);
});

watch(() => test.value.questions, (newQuestions) => {
  newQuestions.forEach(q => {
    if (!q.watcherAttached) {
      watch(() => q.type, (newType) => {
        q.correctAnswer = null;
        q.options = (newType === 'Multiple Choice') ? ['', '', '', ''] : [];
      });
      q.watcherAttached = true;
    }
  });
}, { deep: true });

// MODIFIED: onMounted now checks the mode
onMounted(() => {
  const stored = localStorage.getItem('employerData');
  if (stored) employer.value = JSON.parse(stored);
  fetchJobs();
  loadQuestionBank();

  if (isEditMode.value) {
    // If we have a testId in the URL, load that test for editing
    loadTestForEditing(route.params.testId);
    selected.value = 'Screening Tests'; // Update sidebar active state
  } else {
    // Otherwise, look for a draft (for creating a new test)
    loadDraft();
  }
});

// NEW: Function to load existing test data into the form
const loadTestForEditing = (testId) => {
  const allTests = JSON.parse(localStorage.getItem('jobhub_published_tests') || '[]');
  const testToEdit = allTests.find(t => t.testId === testId);

  if (testToEdit) {
    test.value = JSON.parse(JSON.stringify(testToEdit)); // Load a deep copy
    const maxId = Math.max(0, ...test.value.questions.map(q => q.id));
    questionIdCounter = maxId + 1;
  } else {
    $q.notify({ type: 'negative', message: 'The requested test could not be found.' });
    router.push('/view-tests'); // Redirect if test doesn't exist
  }
};

const fetchJobs = async () => {
  loadingJobs.value = true;
  setTimeout(() => {
    jobOptions.value = [
      { label: 'Senior Frontend Developer', value: 101 }, { label: 'UI/UX Designer', value: 102 },
      { label: 'Lead Backend Engineer (Python)', value: 103 }, { label: 'DevOps Specialist', value: 104 },
    ];
    loadingJobs.value = false;
  }, 1000);
};

const addQuestion = () => {
  test.value.questions.push({
    id: questionIdCounter++, text: '', type: 'Multiple Choice', points: 10,
    options: ['', '', '', ''], correctAnswer: null, isBanked: false,
  });
};

const removeQuestion = (index) => {
  test.value.questions.splice(index, 1);
};

const handleBulkAdd = () => {
  for (let i = 0; i < bulkAddCount.value; i++) { addQuestion(); }
  $q.notify({ type: 'positive', message: `${bulkAddCount.value} new question blocks added.`, icon: 'check' });
  showBulkAddDialog.value = false;
  bulkAddCount.value = 5;
};

const saveDraft = () => {
  localStorage.setItem('screening_test_draft', JSON.stringify(test.value));
  $q.notify({ color: 'grey-8', textColor: 'white', icon: 'save', message: 'Draft saved successfully!', position: 'top' });
};

const loadDraft = () => {
  const draft = localStorage.getItem('screening_test_draft');
  if (draft) {
    $q.dialog({
      title: 'Unsaved Draft Found', message: 'You have a previously saved draft. Would you like to resume editing it?',
      cancel: { label: 'Start New', color: 'negative', flat: true }, ok: { label: 'Resume Draft', color: 'primary', unelevated: true },
      persistent: true
    }).onOk(() => {
      test.value = JSON.parse(draft);
      const maxId = Math.max(0, ...test.value.questions.map(q => q.id));
      questionIdCounter = maxId + 1;
      $q.notify({ type: 'info', message: 'Draft loaded.' });
    }).onCancel(() => { localStorage.removeItem('screening_test_draft'); });
  }
};

// --- Question Bank Logic ---
const loadQuestionBank = () => {
  const storedBank = localStorage.getItem('jobhub_question_bank');
  if (storedBank) questionBank.value = JSON.parse(storedBank);
};
const saveQuestionBank = () => {
  localStorage.setItem('jobhub_question_bank', JSON.stringify(questionBank.value));
};
const toggleBankStatus = (question) => {
  question.isBanked = !question.isBanked;
  if (question.isBanked) {
    if (!questionBank.value.find(q => q.id === question.id)) {
      questionBank.value.push(JSON.parse(JSON.stringify(question)));
    }
    $q.notify({ message: 'Question saved to bank.', icon: 'bookmark', color: 'amber-8' });
  } else {
    const index = questionBank.value.findIndex(q => q.id === question.id);
    if (index > -1) questionBank.value.splice(index, 1);
    $q.notify({ message: 'Question removed from bank.', icon: 'bookmark_border' });
  }
  saveQuestionBank();
};
const openQuestionBank = () => {
  loadQuestionBank();
  showBankDialog.value = true;
};
const addFromBank = (bankQuestion) => {
  const newQ = JSON.parse(JSON.stringify(bankQuestion));
  newQ.id = questionIdCounter++;
  test.value.questions.push(newQ);
  $q.notify({ message: 'Question added from bank.' });
};
const removeFromBank = (questionId, questionText) => {
  $q.dialog({
    title: 'Confirm Deletion',
    message: `Are you sure you want to permanently remove this question from your bank?<br/><br/><em>"${questionText}"</em>`,
    html: true, cancel: true, persistent: true,
    ok: { label: 'Delete', color: 'negative', unelevated: true },
  }).onOk(() => {
    const index = questionBank.value.findIndex(q => q.id === questionId);
    if (index > -1) {
      questionBank.value.splice(index, 1);
      saveQuestionBank();
      test.value.questions.forEach(q => {
        if (q.id === questionId) { q.isBanked = false; }
      });
      $q.notify({ type: 'positive', message: 'Question removed from bank.' });
    }
  });
};

// --- Validation and Publish Logic ---
const validateTest = () => {
  validationErrors.value = [];
  if (!test.value.jobId) validationErrors.value.push('A job must be selected for the test.');
  if (test.value.questions.length === 0) validationErrors.value.push('The test must have at least one question.');
  test.value.questions.forEach((q, index) => {
    if (!q.text.trim()) validationErrors.value.push(`Question #${index + 1} text is empty.`);
    if (!q.correctAnswer) validationErrors.value.push(`Question #${index + 1} does not have a correct answer selected.`);
    if (q.type === 'Multiple Choice' && q.options.filter(opt => opt && opt.trim()).length < 2) {
      validationErrors.value.push(`Question #${index + 1} must have at least two options.`);
    }
  });
  return validationErrors.value.length === 0;
};

const confirmAndSaveTest = () => {
  if (!validateTest()) {
    $q.notify({ type: 'negative', message: 'Please fix the errors before publishing.' });
    return;
  }

  if (isEditMode.value) {
    updateTest();
  } else {
    $q.dialog({
      title: 'Confirm Publish',
      message: 'Are you sure you want to create and publish this test? It will become available to candidates applying for the selected job.',
      cancel: true, persistent: true
    }).onOk(() => {
      createTest();
    });
  }
};

// NEW: Function to handle the update logic
const updateTest = async () => {
    isSaving.value = true;
    
    let allPublishedTests = JSON.parse(localStorage.getItem('jobhub_published_tests') || '[]');
    const testIndex = allPublishedTests.findIndex(t => t.testId === test.value.testId);

    if (testIndex !== -1) {
        allPublishedTests[testIndex] = JSON.parse(JSON.stringify(test.value));
        localStorage.setItem('jobhub_published_tests', JSON.stringify(allPublishedTests));

        $q.notify({ type: 'positive', message: 'Test updated successfully!', icon: 'check_circle', position: 'top' });
        router.push('/view-tests');
    } else {
        $q.notify({ type: 'negative', message: 'Error finding test to update.' });
    }
    
    isSaving.value = false;
};

const createTest = async () => {
  isSaving.value = true;

  const allPublishedTests = JSON.parse(localStorage.getItem('jobhub_published_tests') || '[]');

  const newPublishedTest = {
    ...JSON.parse(JSON.stringify(test.value)),
    testId: `test_${Date.now()}`,
    publishedAt: new Date().toISOString(),
    status: 'Published'
  };

  allPublishedTests.unshift(newPublishedTest);

  localStorage.setItem('jobhub_published_tests', JSON.stringify(allPublishedTests));
  localStorage.removeItem('screening_test_draft');

  setTimeout(() => {
    $q.notify({ type: 'positive', message: 'Screening test created and linked to job!', icon: 'check_circle', position: 'top' });
    isSaving.value = false;
    router.push('/view-tests');
  }, 1500);
};
</script>

<style scoped>
/* All styles remain the same */
.portal-layout { display: flex; flex-direction: column; height: 100vh; overflow: hidden; }
.sticky-header { position: sticky; top: 0; z-index: 1000; }
.page-wrapper { flex-grow: 1; overflow: hidden; }
.sidebar, .content-area { height: 100%; }
.sidebar { width: 260px; background-color: #1565c0; color: #f0f4f8; display: flex; flex-direction: column; }
.sidebar-section { border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
.nav-list .q-item { color: #BCCCDC; padding: 12px; margin: 4px 12px; border-radius: 8px; }
.nav-list .q-item:hover { background-color: rgba(255, 255, 255, 0.1); }
.active-link { background-color: #0052be !important; color: #ffffff !important; font-weight: 600; }
.content-area { flex: 1; overflow-y: auto; }
.screening-test-bg { background-color: #f0f4f8; }
.page-header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
.form-card { background: #ffffff; border-radius: 16px; box-shadow: 0 6px 20px rgba(0, 0, 0, 0.07); border: 1px solid #e0e0e0; }
.question-card { border-radius: 12px; transition: all 0.3s ease; overflow: hidden; }
.question-header-section { background-color: #f5f7fa; border-bottom: 1px solid #e0e0e0; }
.question-header { display: flex; justify-content: space-between; align-items: center; }
.options-container { padding: 16px; border: 1px dashed #ccc; border-radius: 8px; background-color: #fdfdff; }
.drag-handle { cursor: grab; }
.drag-handle:active { cursor: grabbing; }
</style>