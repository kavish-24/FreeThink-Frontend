<template>
  <q-page class="q-pa-md">
    <HeaderPart/>
    <div class="row q-col-gutter-md">
      
      <!-- Form Section -->
      <div class="col-12 col-md-6">
        <q-card flat bordered class="q-pa-md">
          
          <q-card-section>
            <h2 class="text-h5 text-primary">Resume Builder</h2>
           
            <q-form class="q-gutter-md">
              <!-- Template Selector -->
              <q-select
                v-model="selectedTemplate"
                :options="templateOptions"
                label="Select Template"
                filled
              />
              <q-file
  v-model="resumePhotoFile"
  accept="image/*"
  label="Upload Photo"
  filled
  use-chips
  prepend-icon="photo"
  @update:model-value="handlePhotoUpload"
/>
              <!-- Basic Info -->
              <q-input v-model="resumeData.name" label="Full Name" filled />
              <q-input v-model="resumeData.title" label="Title (e.g., Marketing Manager)" filled />
              <q-input v-model="resumeData.position" label="Position (e.g., Head of Digital Strategy)" filled />

              <q-input v-model="resumeData.email" label="Email" filled />
              <q-input v-model="resumeData.phone" label="Phone" filled />
              <q-input v-model="resumeData.address" label="Address" filled />
              

              <!-- Education -->
              <q-expansion-item label="Education" icon="school" expand-separator header-class="text-bold">
                <div v-for="(edu, index) in resumeData.education" :key="'edu-' + index" class="q-gutter-sm q-mb-sm">
                  <q-input v-model="edu.institution" label="Institution" filled />
                  <q-input v-model="edu.degree" label="Degree" filled />
                  <q-input v-model="edu.year" label="Year" filled />
                  <q-btn icon="delete" round dense flat color="negative" @click="removeEducation(index)" />
                </div>
                <q-btn label="Add Education" icon="add" flat color="primary" @click="addEducation" />
              </q-expansion-item>

              <!-- Experience -->
              <q-expansion-item label="Experience" icon="work" expand-separator header-class="text-bold">
                <div v-for="(exp, index) in resumeData.experience" :key="'exp-' + index" class="q-gutter-sm q-mb-sm">
                  <q-input v-model="exp.company" label="Company" filled />
                  <q-input v-model="exp.role" label="Role" filled />
                  <q-input v-model="exp.years" label="Years" filled />
                  <q-input v-model="exp.description" label="Description" type="textarea" filled />
                  <q-btn icon="delete" round dense flat color="negative" @click="removeExperience(index)" />
                </div>
                <q-btn label="Add Experience" icon="add" flat color="primary" @click="addExperience" />
              </q-expansion-item>

              <!-- Skills -->
              <q-expansion-item label="Skills" icon="psychology" expand-separator header-class="text-bold">
                <div v-for="(skill, index) in resumeData.skills" :key="'skill-' + index" class="row items-center q-gutter-sm q-mb-sm">
                  <q-input v-model="skill.name" label="Skill" filled class="col" />
                  <q-btn icon="delete" round dense flat color="negative" @click="removeSkill(index)" />
                </div>
                <q-btn label="Add Skill" icon="add" flat color="primary" @click="addSkill" />
              </q-expansion-item>

              <!-- Projects -->
              <q-expansion-item label="Projects" icon="rocket_launch" expand-separator header-class="text-bold">
                <div v-for="(project, index) in resumeData.projects" :key="'project-' + index" class="q-gutter-sm q-mb-sm">
                  <q-input v-model="project.name" label="Project Name" filled />
                  <q-input v-model="project.year" label="Year" filled />
                  <q-input v-model="project.description" label="Description" filled type="textarea" />
                  <q-btn icon="delete" round dense flat color="negative" @click="removeProject(index)" />
                </div>
                <q-btn label="Add Project" icon="add" flat color="primary" @click="addProject" />
              </q-expansion-item>
            <q-expansion-item label="Languages" icon="translate" expand-separator header-class="text-bold">
  <div v-for="(lang, index) in resumeData.languages" :key="'lang-' + index" class="row items-center q-gutter-sm q-mb-sm">
    <q-input v-model="lang.name" label="Language" filled class="col" />
    <q-input v-model="lang.level" label="Proficiency (e.g., Native, Fluent)" filled class="col" />
    <q-btn icon="delete" round dense flat color="negative" @click="removeLanguage(index)" />
  </div>
  <q-btn label="Add Language" icon="add" flat color="primary" @click="addLanguage" />
</q-expansion-item>
              <!-- Download Button -->
              <q-btn label="Download PDF" icon="download" color="primary" @click="downloadPDF" class="q-mt-md" />
            </q-form>
          </q-card-section>
        </q-card>
      </div>

      <!-- Preview Section -->
      <div class="col-12 col-md-6">
        <q-card flat bordered class="q-pa-md" style="max-height: calc(100vh - 100px); overflow: auto;">
          <q-card-section>
            <h2 class="text-h6 text-center text-primary">Live Preview</h2>
            <div id="resume-preview">
              <component :is="templateComponents[selectedTemplate]" :resumeData="resumeData" />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  <footer-part/>
  </q-page>
</template>

<script setup>
import HeaderPart from './HeaderPart.vue';
import FooterPart from './FooterPart.vue';
import { ref } from 'vue';
import { jsPDF } from 'jspdf';
import ModernTemplate from '../components/templates/ModernTemplate.vue';
import ClassicTemplate from '../components/templates/ClassicTemplate.vue';
import ProfessionalTemplate from '../components/templates/ProfessionalTemplate.vue';
import CreativeTemplate from '../components/templates/CreativeTemplate.vue';

// Resume data state
const resumeData = ref({
  name: '',
    title: '',        
  position: '',  
  email: '',
  phone: '',
  address:'',
  education: [],
  experience: [],
  skills: [],
  projects: [],
   languages: [] 
});
const resumePhotoFile = ref(null);

const handlePhotoUpload = async (file) => {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    resumeData.value.photo = reader.result; // base64 image string
  };
  reader.readAsDataURL(file);
};

// Template selection
const selectedTemplate = ref('Modern');
const templateOptions = ['Modern', 'Creative'];
const templateComponents = {
  Modern: ModernTemplate,
  Classic: ClassicTemplate,
  Professional: ProfessionalTemplate,
  Creative : CreativeTemplate
};

// Add/Remove education, experience, skills, and projects
const addEducation = () => {
  resumeData.value.education.push({ institution: '', degree: '', year: '' });
};
const removeEducation = (index) => {
  resumeData.value.education.splice(index, 1);
};
const addExperience = () => {
  resumeData.value.experience.push({ company: '', role: '', years: '', description: '' });
};
const removeExperience = (index) => {
  resumeData.value.experience.splice(index, 1);
};
const addSkill = () => {
  resumeData.value.skills.push({ name: '' });
};
const removeSkill = (index) => {
  resumeData.value.skills.splice(index, 1);
};
const addProject = () => {
  resumeData.value.projects.push({ name: '', year: '', description: '' });
};
const removeProject = (index) => {
  resumeData.value.projects.splice(index, 1);
};
// Add/Remove languages
const addLanguage = () => {
  if (!resumeData.value.languages) resumeData.value.languages = [];
  resumeData.value.languages.push({ name: '', level: '' });
};
const removeLanguage = (index) => {
  resumeData.value.languages.splice(index, 1);
};

// Download PDF
const downloadPDF = () => {
  const doc = new jsPDF();
  const preview = document.getElementById('resume-preview');
  doc.html(preview, {
    callback: (pdf) => {
      pdf.save('resume.pdf');
    },
    x: 10,
    y: 10,
    width: 190,
    windowWidth: 800,
  });
};
</script>

<style scoped>
#resume-preview {
  font-family: Arial, sans-serif;
  font-size: 12px;
}
</style>