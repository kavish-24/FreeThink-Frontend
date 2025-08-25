<template>
  <div class="executive-resume">
    <div class="resume-header">
      <h1 class="name">{{ resumeData.personalInfo.name || 'Executive Name' }}</h1>
      <div class="executive-title">Senior Executive & Strategic Leader</div>
      <div class="contact-bar">
        <span v-if="resumeData.personalInfo.email">{{ resumeData.personalInfo.email }}</span>
        <span v-if="resumeData.personalInfo.phone">{{ resumeData.personalInfo.phone }}</span>
        <span v-if="resumeData.personalInfo.linkedin">LinkedIn</span>
      </div>
    </div>

    <div class="executive-summary" v-if="resumeData.summary">
      <h2 class="section-title">Executive Summary</h2>
      <p class="summary-content">{{ resumeData.summary }}</p>
    </div>

    <div class="core-competencies" v-if="resumeData.skills.length">
      <h2 class="section-title">Core Competencies</h2>
      <div class="competencies-grid">
        <div v-for="skill in resumeData.skills.slice(0, 12)" :key="skill" class="competency-item">
          {{ skill }}
        </div>
      </div>
    </div>

    <div class="professional-experience" v-if="resumeData.experience.length">
      <h2 class="section-title">Professional Experience</h2>
      <div v-for="exp in resumeData.experience" :key="exp.title" class="experience-item">
        <div class="exp-header">
          <div class="exp-left">
            <h3 class="exp-title">{{ exp.title }}</h3>
            <div class="exp-company">{{ exp.company }}</div>
          </div>
          <div class="exp-dates">{{ formatDuration(exp.startDate, exp.endDate || 'Present') }}</div>
        </div>
        <ul class="achievement-list" v-if="exp.bullets?.length">
          <li v-for="bullet in exp.bullets.filter(b => b.trim())" :key="bullet">{{ bullet }}</li>
        </ul>
      </div>
    </div>

    <div class="education-section" v-if="resumeData.education.length">
      <h2 class="section-title">Education & Credentials</h2>
      <div v-for="edu in resumeData.education" :key="edu.degree" class="education-item">
        <div class="edu-content">
          <h3 class="edu-degree">{{ edu.degree }}</h3>
          <div class="edu-institution">{{ edu.institution }} • {{ edu.graduationDate }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  resumeData: { type: Object, required: true },
  atsScore: { type: Number, default: 0 },
  jobKeywords: { type: Object, default: () => ({}) }
})

const formatDuration = (start, end) => {
  if (!start) return ''
  return `${start} - ${end === 'Present' ? 'Present' : end}`
}
</script>

<style scoped>
.executive-resume {
  font-family: 'Georgia', serif;
  background: white;
  padding: 1in;
  max-width: 8.5in;
  margin: 0 auto;
  min-height: 11in;
  color: #2c3e50;
}

.resume-header {
  text-align: center;
  margin-bottom: 0.8in;
  padding-bottom: 0.4in;
  border-bottom: 2px solid #34495e;
}

.name {
  font-size: 28pt;
  font-weight: bold;
  margin: 0;
  color: #2c3e50;
  letter-spacing: 1px;
}

.executive-title {
  font-size: 14pt;
  color: #7f8c8d;
  margin: 0.2in 0;
  font-style: italic;
}

.contact-bar {
  display: flex;
  justify-content: center;
  gap: 0.5in;
  font-size: 11pt;
  color: #34495e;
}

.section-title {
  font-size: 16pt;
  font-weight: bold;
  color: #2c3e50;
  margin: 0 0 0.3in 0;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 1px solid #bdc3c7;
  padding-bottom: 0.1in;
}

.executive-summary {
  margin-bottom: 0.6in;
}

.summary-content {
  font-size: 12pt;
  line-height: 1.7;
  text-align: justify;
  margin: 0;
  color: #34495e;
}

.core-competencies {
  margin-bottom: 0.6in;
}

.competencies-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.2in;
}

.competency-item {
  background: #ecf0f1;
  padding: 0.15in;
  text-align: center;
  border-radius: 5px;
  font-size: 10pt;
  font-weight: 600;
  color: #2c3e50;
}

.professional-experience {
  margin-bottom: 0.6in;
}

.experience-item {
  margin-bottom: 0.5in;
  padding-bottom: 0.3in;
  border-bottom: 1px solid #ecf0f1;
}

.exp-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 0.2in;
}

.exp-title {
  font-size: 14pt;
  font-weight: bold;
  margin: 0;
  color: #2c3e50;
}

.exp-company {
  font-size: 12pt;
  color: #7f8c8d;
  font-style: italic;
  margin-top: 0.05in;
}

.exp-dates {
  font-size: 11pt;
  color: #95a5a6;
  font-weight: 600;
}

.achievement-list {
  margin: 0 0 0 0.3in;
  padding: 0;
}

.achievement-list li {
  font-size: 11pt;
  line-height: 1.6;
  margin-bottom: 0.15in;
  text-align: justify;
}

.education-section {
  margin-bottom: 0.4in;
}

.education-item {
  margin-bottom: 0.3in;
}

.edu-degree {
  font-size: 12pt;
  font-weight: bold;
  margin: 0;
  color: #2c3e50;
}

.edu-institution {
  font-size: 11pt;
  color: #7f8c8d;
  margin-top: 0.05in;
}
</style>
