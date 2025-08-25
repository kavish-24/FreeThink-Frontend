<template>
  <div class="creative-resume">
    <div class="resume-layout">
      <div class="left-column">
        <div class="profile-section">
          <div class="name-block">
            <h1 class="creative-name">{{ resumeData.personalInfo.name || 'Creative Professional' }}</h1>
            <div class="creative-title">{{ resumeData.personalInfo.title || 'Creative Designer' }}</div>
          </div>
        </div>

        <div class="contact-section">
          <h3 class="sidebar-title">Contact</h3>
          <div class="contact-item" v-if="resumeData.personalInfo.email">
            <span class="contact-icon">@</span>
            {{ resumeData.personalInfo.email }}
          </div>
          <div class="contact-item" v-if="resumeData.personalInfo.phone">
            <span class="contact-icon">📞</span>
            {{ resumeData.personalInfo.phone }}
          </div>
          <div class="contact-item" v-if="resumeData.personalInfo.website">
            <span class="contact-icon">🌐</span>
            Portfolio
          </div>
        </div>

        <div class="skills-section" v-if="resumeData.skills.length">
          <h3 class="sidebar-title">Skills</h3>
          <div class="creative-skills">
            <div v-for="skill in resumeData.skills.slice(0, 10)" :key="skill" 
                 class="skill-tag"
                 :class="{ 'highlighted': isSkillHighlighted(skill) }">
              {{ skill }}
            </div>
          </div>
        </div>

        <div class="education-sidebar" v-if="resumeData.education.length">
          <h3 class="sidebar-title">Education</h3>
          <div v-for="edu in resumeData.education" :key="edu.degree" class="edu-item">
            <div class="edu-degree">{{ edu.degree }}</div>
            <div class="edu-school">{{ edu.institution }}</div>
            <div class="edu-year">{{ edu.graduationDate }}</div>
          </div>
        </div>
      </div>

      <div class="right-column">
        <div class="about-section" v-if="resumeData.summary">
          <h2 class="main-section-title">About</h2>
          <p class="creative-summary">{{ resumeData.summary }}</p>
        </div>

        <div class="experience-section" v-if="resumeData.experience.length">
          <h2 class="main-section-title">Experience</h2>
          <div v-for="exp in resumeData.experience" :key="exp.title" class="creative-exp-item">
            <div class="exp-timeline">
              <div class="timeline-dot"></div>
              <div class="timeline-line"></div>
            </div>
            <div class="exp-content">
              <h3 class="creative-exp-title">{{ exp.title }}</h3>
              <div class="creative-exp-company">{{ exp.company }} • {{ formatDuration(exp.startDate, exp.endDate || 'Present') }}</div>
              <ul class="creative-bullets" v-if="exp.bullets?.length">
                <li v-for="bullet in exp.bullets.filter(b => b.trim())" :key="bullet">{{ bullet }}</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="projects-section" v-if="resumeData.projects?.length">
          <h2 class="main-section-title">Projects</h2>
          <div class="projects-grid">
            <div v-for="project in resumeData.projects" :key="project.name" class="project-card">
              <h4 class="project-name">{{ project.name }}</h4>
              <p class="project-desc">{{ project.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  resumeData: { type: Object, required: true },
  atsScore: { type: Number, default: 0 },
  jobKeywords: { type: Object, default: () => ({}) }
})

const formatDuration = (start, end) => {
  if (!start) return ''
  return `${start} - ${end === 'Present' ? 'Present' : end}`
}

const isSkillHighlighted = (skill) => {
  return Object.values(props.jobKeywords).flat().some(keyword => 
    skill.toLowerCase().includes(keyword.toLowerCase())
  )
}
</script>

<style scoped>
.creative-resume {
  font-family: 'Inter', 'Helvetica Neue', sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 0.4in;
  max-width: 8.5in;
  margin: 0 auto;
  min-height: 11in;
}

.resume-layout {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 0.5in;
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
}

.left-column {
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  padding: 1in 0.5in;
  color: white;
}

.right-column {
  padding: 1in 0.7in;
}

.profile-section {
  margin-bottom: 1in;
}

.name-block {
  text-align: center;
}

.creative-name {
  font-size: 24pt;
  font-weight: 700;
  margin: 0;
  color: white;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.creative-title {
  font-size: 12pt;
  color: rgba(255,255,255,0.9);
  margin-top: 0.2in;
  font-weight: 300;
}

.sidebar-title {
  font-size: 14pt;
  font-weight: 600;
  margin: 0 0 0.3in 0;
  color: white;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.contact-section {
  margin-bottom: 0.8in;
}

.contact-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.2in;
  font-size: 10pt;
  color: rgba(255,255,255,0.9);
}

.contact-icon {
  margin-right: 0.2in;
  font-size: 12pt;
}

.skills-section {
  margin-bottom: 0.8in;
}

.creative-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.1in;
}

.skill-tag {
  background: rgba(255,255,255,0.2);
  color: white;
  padding: 0.1in 0.15in;
  border-radius: 15px;
  font-size: 9pt;
  font-weight: 500;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.3);
}

.skill-tag.highlighted {
  background: rgba(255,215,0,0.3);
  color: #fff;
  border-color: rgba(255,215,0,0.5);
}

.education-sidebar {
  margin-bottom: 0.6in;
}

.edu-item {
  margin-bottom: 0.4in;
}

.edu-degree {
  font-size: 11pt;
  font-weight: 600;
  color: white;
}

.edu-school {
  font-size: 10pt;
  color: rgba(255,255,255,0.8);
  margin-top: 0.05in;
}

.edu-year {
  font-size: 9pt;
  color: rgba(255,255,255,0.7);
  margin-top: 0.05in;
}

.main-section-title {
  font-size: 18pt;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 0.4in 0;
  position: relative;
}

.main-section-title::after {
  content: '';
  position: absolute;
  bottom: -0.1in;
  left: 0;
  width: 1in;
  height: 3px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 2px;
}

.about-section {
  margin-bottom: 0.8in;
}

.creative-summary {
  font-size: 11pt;
  line-height: 1.6;
  color: #34495e;
  text-align: justify;
  margin: 0;
}

.experience-section {
  margin-bottom: 0.8in;
}

.creative-exp-item {
  display: flex;
  margin-bottom: 0.6in;
  position: relative;
}

.exp-timeline {
  margin-right: 0.3in;
  position: relative;
}

.timeline-dot {
  width: 12px;
  height: 12px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  margin-top: 0.1in;
}

.timeline-line {
  width: 2px;
  height: 100%;
  background: linear-gradient(180deg, #667eea, transparent);
  position: absolute;
  left: 5px;
  top: 12px;
}

.exp-content {
  flex: 1;
}

.creative-exp-title {
  font-size: 13pt;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.creative-exp-company {
  font-size: 10pt;
  color: #7f8c8d;
  margin: 0.1in 0 0.2in 0;
  font-weight: 500;
}

.creative-bullets {
  margin: 0;
  padding-left: 0.3in;
}

.creative-bullets li {
  font-size: 10pt;
  line-height: 1.5;
  margin-bottom: 0.1in;
  color: #34495e;
}

.projects-section {
  margin-bottom: 0.6in;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.3in;
}

.project-card {
  background: linear-gradient(135deg, rgba(102,126,234,0.1), rgba(118,75,162,0.1));
  padding: 0.3in;
  border-radius: 10px;
  border: 1px solid rgba(102,126,234,0.2);
}

.project-name {
  font-size: 11pt;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 0.1in 0;
}

.project-desc {
  font-size: 9pt;
  color: #7f8c8d;
  margin: 0;
  line-height: 1.4;
}
</style>
