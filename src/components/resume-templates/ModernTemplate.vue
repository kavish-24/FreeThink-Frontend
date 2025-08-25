<template>
  <div class="modern-resume">
    <div class="resume-sidebar">
      <div class="profile-section">
        <div class="profile-image">
          <q-icon name="person" size="4rem" />
        </div>
        <h1 class="name">{{ resumeData.personalInfo.name || 'Your Name' }}</h1>
        <div class="title">Professional</div>
      </div>

      <div class="contact-section">
        <h3 class="sidebar-title">Contact</h3>
        <div class="contact-item" v-if="resumeData.personalInfo.email">
          <q-icon name="mail" />
          <span>{{ resumeData.personalInfo.email }}</span>
        </div>
        <div class="contact-item" v-if="resumeData.personalInfo.phone">
          <q-icon name="phone" />
          <span>{{ resumeData.personalInfo.phone }}</span>
        </div>
        <div class="contact-item" v-if="resumeData.personalInfo.address">
          <q-icon name="location_on" />
          <span>{{ resumeData.personalInfo.address }}</span>
        </div>
      </div>

      <div class="skills-section" v-if="resumeData.skills.length">
        <h3 class="sidebar-title">Skills</h3>
        <div class="skill-items">
          <div v-for="skill in resumeData.skills.slice(0, 12)" :key="skill" class="skill-item">
            {{ skill }}
          </div>
        </div>
      </div>
    </div>

    <div class="resume-main">
      <section v-if="resumeData.summary" class="section">
        <h2 class="section-title">Professional Summary</h2>
        <p class="summary-text">{{ resumeData.summary }}</p>
      </section>

      <section v-if="resumeData.experience.length" class="section">
        <h2 class="section-title">Experience</h2>
        <div v-for="exp in resumeData.experience" :key="exp.title" class="experience-item">
          <div class="exp-header">
            <h3 class="exp-title">{{ exp.title }}</h3>
            <div class="exp-duration">{{ formatDuration(exp.startDate, exp.endDate || 'Present') }}</div>
          </div>
          <div class="exp-company">{{ exp.company }}</div>
          <ul class="exp-bullets" v-if="exp.bullets?.length">
            <li v-for="bullet in exp.bullets.filter(b => b.trim())" :key="bullet">{{ bullet }}</li>
          </ul>
        </div>
      </section>

      <section v-if="resumeData.education.length" class="section">
        <h2 class="section-title">Education</h2>
        <div v-for="edu in resumeData.education" :key="edu.degree" class="education-item">
          <h3 class="edu-degree">{{ edu.degree }}</h3>
          <div class="edu-details">
            <span class="edu-institution">{{ edu.institution }}</span>
            <span class="edu-year">{{ edu.graduationDate }}</span>
          </div>
        </div>
      </section>
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
.modern-resume {
  display: flex;
  font-family: 'Segoe UI', sans-serif;
  background: white;
  min-height: 11in;
  max-width: 8.5in;
  margin: 0 auto;
}

.resume-sidebar {
  width: 2.5in;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1in 0.5in;
}

.profile-section {
  text-align: center;
  margin-bottom: 1in;
}

.profile-image {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: rgba(255,255,255,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 0.5in;
}

.name {
  font-size: 18pt;
  font-weight: bold;
  margin: 0;
  line-height: 1.2;
}

.title {
  font-size: 12pt;
  opacity: 0.9;
  margin-top: 0.2in;
}

.sidebar-title {
  font-size: 14pt;
  font-weight: bold;
  margin: 0 0 0.3in 0;
  padding-bottom: 0.1in;
  border-bottom: 2px solid rgba(255,255,255,0.3);
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.2in;
  margin-bottom: 0.2in;
  font-size: 10pt;
}

.skills-section {
  margin-top: 0.8in;
}

.skill-items {
  display: flex;
  flex-direction: column;
  gap: 0.15in;
}

.skill-item {
  background: rgba(255,255,255,0.2);
  padding: 0.1in 0.2in;
  border-radius: 15px;
  font-size: 9pt;
  text-align: center;
}

.resume-main {
  flex: 1;
  padding: 1in 0.8in;
}

.section {
  margin-bottom: 0.8in;
}

.section-title {
  font-size: 16pt;
  font-weight: bold;
  color: #667eea;
  margin: 0 0 0.3in 0;
  padding-bottom: 0.1in;
  border-bottom: 2px solid #667eea;
}

.summary-text {
  font-size: 11pt;
  line-height: 1.6;
  text-align: justify;
  margin: 0;
}

.experience-item {
  margin-bottom: 0.5in;
}

.exp-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 0.1in;
}

.exp-title {
  font-size: 13pt;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.exp-duration {
  font-size: 10pt;
  color: #666;
  font-style: italic;
}

.exp-company {
  font-size: 11pt;
  color: #667eea;
  font-weight: 600;
  margin-bottom: 0.15in;
}

.exp-bullets {
  margin: 0 0 0 0.3in;
  padding: 0;
}

.exp-bullets li {
  font-size: 10pt;
  line-height: 1.5;
  margin-bottom: 0.1in;
}

.education-item {
  margin-bottom: 0.3in;
}

.edu-degree {
  font-size: 12pt;
  font-weight: bold;
  margin: 0 0 0.05in 0;
}

.edu-details {
  display: flex;
  justify-content: space-between;
  font-size: 10pt;
  color: #666;
}
</style>
