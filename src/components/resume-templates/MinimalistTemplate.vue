<template>
  <div class="minimalist-resume">
    <div class="resume-header">
      <h1 class="name">{{ resumeData.personalInfo.name || 'Your Name' }}</h1>
      <div class="contact-info">
        <span v-if="resumeData.personalInfo.email" class="contact-item">
          <q-icon name="mail" size="xs" />
          {{ resumeData.personalInfo.email }}
        </span>
        <span v-if="resumeData.personalInfo.phone" class="contact-item">
          <q-icon name="phone" size="xs" />
          {{ resumeData.personalInfo.phone }}
        </span>
        <span v-if="resumeData.personalInfo.address" class="contact-item">
          <q-icon name="location_on" size="xs" />
          {{ resumeData.personalInfo.address }}
        </span>
        <span v-if="resumeData.personalInfo.linkedin" class="contact-item">
          <q-icon name="link" size="xs" />
          LinkedIn
        </span>
      </div>
    </div>

    <div class="resume-body">
      <!-- Professional Summary -->
      <section v-if="resumeData.summary" class="section">
        <h2 class="section-title">PROFESSIONAL SUMMARY</h2>
        <div class="section-content">
          <p class="summary-text">{{ resumeData.summary }}</p>
        </div>
      </section>

      <!-- Skills -->
      <section v-if="resumeData.skills.length" class="section">
        <h2 class="section-title">CORE COMPETENCIES</h2>
        <div class="section-content">
          <div class="skills-grid">
            <span 
              v-for="skill in resumeData.skills" 
              :key="skill" 
              class="skill-item"
              :class="{ 'job-match': isJobMatch(skill) }"
            >
              {{ skill }}
            </span>
          </div>
        </div>
      </section>

      <!-- Professional Experience -->
      <section v-if="resumeData.experience.length" class="section">
        <h2 class="section-title">PROFESSIONAL EXPERIENCE</h2>
        <div class="section-content">
          <div v-for="exp in resumeData.experience" :key="exp.title" class="experience-item">
            <div class="exp-header">
              <div class="exp-title-company">
                <h3 class="exp-title">{{ exp.title }}</h3>
                <span class="exp-company">{{ exp.company }}</span>
              </div>
              <div class="exp-dates">
                {{ formatDuration(exp.startDate, exp.endDate || 'Present') }}
              </div>
            </div>
            <ul class="exp-bullets" v-if="exp.bullets && exp.bullets.length">
              <li v-for="bullet in exp.bullets.filter(b => b.trim())" :key="bullet">
                {{ bullet }}
              </li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Education -->
      <section v-if="resumeData.education.length" class="section">
        <h2 class="section-title">EDUCATION</h2>
        <div class="section-content">
          <div v-for="edu in resumeData.education" :key="edu.degree" class="education-item">
            <div class="edu-header">
              <div class="edu-degree-school">
                <h3 class="edu-degree">{{ edu.degree }}</h3>
                <span class="edu-institution">{{ edu.institution }}</span>
              </div>
              <div class="edu-year">{{ edu.graduationDate }}</div>
            </div>
            <div v-if="edu.gpa" class="edu-gpa">GPA: {{ edu.gpa }}</div>
          </div>
        </div>
      </section>
    </div>

    <!-- ATS Score Badge -->
    <div v-if="atsScore" class="ats-badge">
      ATS Score: {{ atsScore }}%
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  resumeData: {
    type: Object,
    required: true
  },
  atsScore: {
    type: Number,
    default: 0
  },
  jobKeywords: {
    type: Object,
    default: () => ({})
  }
})

const isJobMatch = (skill) => {
  return props.jobKeywords.technical?.some(jobSkill =>
    jobSkill.toLowerCase().includes(skill.toLowerCase()) ||
    skill.toLowerCase().includes(jobSkill.toLowerCase())
  )
}

const formatDuration = (start, end) => {
  if (!start) return ''
  const startDate = new Date(start + '-01')
  const endDate = end && end !== 'Present' ? new Date(end + '-01') : new Date()
  
  const startMonth = startDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  const endMonth = end === 'Present' ? 'Present' : endDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  
  return `${startMonth} - ${endMonth}`
}
</script>

<style scoped>
.minimalist-resume {
  font-family: 'Times New Roman', serif;
  font-size: 11pt;
  line-height: 1.4;
  color: #000;
  background: white;
  padding: 0.75in;
  max-width: 8.5in;
  margin: 0 auto;
  position: relative;
  min-height: 11in;
}

.resume-header {
  text-align: center;
  margin-bottom: 0.5in;
  border-bottom: 1px solid #000;
  padding-bottom: 0.25in;
}

.name {
  font-size: 18pt;
  font-weight: bold;
  margin: 0 0 0.1in 0;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.contact-info {
  display: flex;
  justify-content: center;
  gap: 0.3in;
  flex-wrap: wrap;
  font-size: 10pt;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.05in;
}

.resume-body {
  display: flex;
  flex-direction: column;
  gap: 0.25in;
}

.section {
  margin-bottom: 0.25in;
}

.section-title {
  font-size: 12pt;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 0.1in 0;
  border-bottom: 1px solid #ccc;
  padding-bottom: 0.05in;
}

.section-content {
  margin-left: 0;
}

.summary-text {
  margin: 0;
  text-align: justify;
  font-size: 11pt;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.05in 0.2in;
  margin: 0.1in 0;
}

.skill-item {
  font-size: 10pt;
  padding: 0.02in 0;
}

.skill-item.job-match {
  font-weight: bold;
}

.experience-item {
  margin-bottom: 0.2in;
}

.exp-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.05in;
}

.exp-title-company {
  flex: 1;
}

.exp-title {
  font-size: 11pt;
  font-weight: bold;
  margin: 0;
}

.exp-company {
  font-size: 11pt;
  font-style: italic;
}

.exp-dates {
  font-size: 10pt;
  white-space: nowrap;
}

.exp-bullets {
  margin: 0.05in 0 0 0.2in;
  padding: 0;
}

.exp-bullets li {
  font-size: 10pt;
  margin-bottom: 0.02in;
  text-align: justify;
}

.education-item {
  margin-bottom: 0.15in;
}

.edu-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.edu-degree-school {
  flex: 1;
}

.edu-degree {
  font-size: 11pt;
  font-weight: bold;
  margin: 0;
}

.edu-institution {
  font-size: 11pt;
  font-style: italic;
}

.edu-year {
  font-size: 10pt;
  white-space: nowrap;
}

.edu-gpa {
  font-size: 10pt;
  margin-top: 0.02in;
}

.ats-badge {
  position: absolute;
  top: 0.2in;
  right: 0.2in;
  background: #f0f9ff;
  border: 1px solid #3b82f6;
  border-radius: 4px;
  padding: 0.05in 0.1in;
  font-size: 8pt;
  color: #3b82f6;
  font-weight: bold;
}

/* Print optimizations */
@media print {
  .minimalist-resume {
    padding: 0.5in;
    box-shadow: none;
    border: none;
  }
  
  .ats-badge {
    display: none;
  }
}

/* ATS optimizations */
@page {
  size: 8.5in 11in;
  margin: 0.5in;
}

/* Ensure all text is selectable and readable by ATS */
.minimalist-resume * {
  color: #000 !important;
  background: transparent !important;
}

/* No decorative elements that confuse ATS */
.section-title::before,
.section-title::after {
  display: none;
}
</style>
