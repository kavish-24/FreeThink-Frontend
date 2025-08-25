<template>
  <div class="technical-resume">
    <div class="resume-header">
      <h1 class="name">{{ resumeData.personalInfo.name || 'Your Name' }}</h1>
      <div class="title-line">Software Engineer & Technical Professional</div>
      <div class="contact-grid">
        <span v-if="resumeData.personalInfo.email">{{ resumeData.personalInfo.email }}</span>
        <span v-if="resumeData.personalInfo.phone">{{ resumeData.personalInfo.phone }}</span>
        <span v-if="resumeData.personalInfo.linkedin">LinkedIn Profile</span>
        <span v-if="resumeData.personalInfo.website">Portfolio</span>
      </div>
    </div>

    <div class="resume-body">
      <!-- Technical Summary -->
      <section v-if="resumeData.summary" class="section">
        <h2 class="section-title">
          <q-icon name="code" size="sm" />
          TECHNICAL SUMMARY
        </h2>
        <div class="section-content">
          <p class="summary-text">{{ resumeData.summary }}</p>
        </div>
      </section>

      <!-- Technical Skills -->
      <section v-if="resumeData.skills.length" class="section">
        <h2 class="section-title">
          <q-icon name="build" size="sm" />
          TECHNICAL SKILLS
        </h2>
        <div class="section-content">
          <div class="skills-categories">
            <div class="skill-category">
              <h4 class="skill-category-title">Programming Languages</h4>
              <div class="skill-tags">
                <span 
                  v-for="skill in getSkillsByCategory('programming')" 
                  :key="skill" 
                  class="skill-tag programming"
                  :class="{ 'job-match': isJobMatch(skill) }"
                >
                  {{ skill }}
                </span>
              </div>
            </div>
            
            <div class="skill-category">
              <h4 class="skill-category-title">Frameworks & Libraries</h4>
              <div class="skill-tags">
                <span 
                  v-for="skill in getSkillsByCategory('frameworks')" 
                  :key="skill" 
                  class="skill-tag frameworks"
                  :class="{ 'job-match': isJobMatch(skill) }"
                >
                  {{ skill }}
                </span>
              </div>
            </div>

            <div class="skill-category">
              <h4 class="skill-category-title">Tools & Technologies</h4>
              <div class="skill-tags">
                <span 
                  v-for="skill in getSkillsByCategory('tools')" 
                  :key="skill" 
                  class="skill-tag tools"
                  :class="{ 'job-match': isJobMatch(skill) }"
                >
                  {{ skill }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Professional Experience -->
      <section v-if="resumeData.experience.length" class="section">
        <h2 class="section-title">
          <q-icon name="work" size="sm" />
          PROFESSIONAL EXPERIENCE
        </h2>
        <div class="section-content">
          <div v-for="exp in resumeData.experience" :key="exp.title" class="experience-item">
            <div class="exp-header">
              <div class="exp-left">
                <h3 class="exp-title">{{ exp.title }}</h3>
                <div class="exp-company">{{ exp.company }}</div>
              </div>
              <div class="exp-right">
                <div class="exp-dates">
                  {{ formatDuration(exp.startDate, exp.endDate || 'Present') }}
                </div>
              </div>
            </div>
            
            <!-- Technical Achievements -->
            <div class="tech-highlights" v-if="getTechAchievements(exp.bullets).length">
              <h5 class="tech-highlights-title">Key Technical Achievements:</h5>
              <ul class="tech-bullets">
                <li v-for="bullet in getTechAchievements(exp.bullets)" :key="bullet">
                  {{ bullet }}
                </li>
              </ul>
            </div>

            <!-- Regular Bullets -->
            <ul class="exp-bullets" v-if="exp.bullets && exp.bullets.length">
              <li v-for="bullet in exp.bullets.filter(b => b.trim())" :key="bullet">
                {{ bullet }}
              </li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Projects Section -->
      <section class="section" v-if="hasProjects">
        <h2 class="section-title">
          <q-icon name="folder" size="sm" />
          KEY PROJECTS
        </h2>
        <div class="section-content">
          <div class="project-item">
            <h4 class="project-title">Portfolio & GitHub Projects</h4>
            <p class="project-description">
              Developed multiple full-stack applications showcasing proficiency in modern web technologies.
              Implemented responsive designs, RESTful APIs, and database integrations.
            </p>
            <div class="project-tech">
              <span class="tech-tag">React</span>
              <span class="tech-tag">Node.js</span>
              <span class="tech-tag">MongoDB</span>
              <span class="tech-tag">TypeScript</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Education -->
      <section v-if="resumeData.education.length" class="section">
        <h2 class="section-title">
          <q-icon name="school" size="sm" />
          EDUCATION & CERTIFICATIONS
        </h2>
        <div class="section-content">
          <div v-for="edu in resumeData.education" :key="edu.degree" class="education-item">
            <div class="edu-header">
              <div class="edu-left">
                <h3 class="edu-degree">{{ edu.degree }}</h3>
                <div class="edu-institution">{{ edu.institution }}</div>
              </div>
              <div class="edu-right">
                <div class="edu-year">{{ edu.graduationDate }}</div>
                <div v-if="edu.gpa" class="edu-gpa">GPA: {{ edu.gpa }}</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Tech Stack Badge -->
    <div class="tech-stack-badge">
      <div class="badge-title">Tech Stack Proficiency</div>
      <div class="proficiency-meter">
        <div class="meter-bar" :style="{ width: getTechProficiency() + '%' }"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

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

const programmingLanguages = ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Go', 'Rust', 'Swift', 'Kotlin']
const frameworks = ['React', 'Vue.js', 'Angular', 'Node.js', 'Express', 'Django', 'Flask', 'Spring', 'Laravel', 'Next.js', 'Nuxt.js']
const tools = ['Git', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Jenkins', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis']

const isJobMatch = (skill) => {
  return props.jobKeywords.technical?.some(jobSkill =>
    jobSkill.toLowerCase().includes(skill.toLowerCase()) ||
    skill.toLowerCase().includes(jobSkill.toLowerCase())
  )
}

const getSkillsByCategory = (category) => {
  const skills = props.resumeData.skills || []
  let categoryKeywords = []
  
  switch (category) {
    case 'programming':
      categoryKeywords = programmingLanguages
      break
    case 'frameworks':
      categoryKeywords = frameworks
      break
    case 'tools':
      categoryKeywords = tools
      break
  }
  
  return skills.filter(skill => 
    categoryKeywords.some(keyword => 
      skill.toLowerCase().includes(keyword.toLowerCase()) ||
      keyword.toLowerCase().includes(skill.toLowerCase())
    )
  )
}

const getTechAchievements = (bullets) => {
  if (!bullets) return []
  const techKeywords = ['developed', 'built', 'implemented', 'designed', 'architected', 'optimized', 'automated']
  return bullets.filter(bullet => 
    techKeywords.some(keyword => bullet.toLowerCase().includes(keyword))
  ).slice(0, 3)
}

const hasProjects = computed(() => {
  return props.resumeData.personalInfo.website || props.resumeData.personalInfo.linkedin
})

const getTechProficiency = () => {
  const totalSkills = props.resumeData.skills?.length || 0
  const techSkills = getSkillsByCategory('programming').length + 
                   getSkillsByCategory('frameworks').length + 
                   getSkillsByCategory('tools').length
  return Math.min(90, (techSkills / totalSkills) * 100)
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
.technical-resume {
  font-family: 'Segoe UI', 'Arial', sans-serif;
  font-size: 10pt;
  line-height: 1.5;
  color: #2c3e50;
  background: white;
  padding: 0.75in;
  max-width: 8.5in;
  margin: 0 auto;
  position: relative;
  min-height: 11in;
}

.resume-header {
  text-align: center;
  margin-bottom: 0.4in;
  padding-bottom: 0.3in;
  border-bottom: 2px solid #3498db;
  background: linear-gradient(90deg, #f8f9fa 0%, #e9ecef 100%);
  margin: -0.75in -0.75in 0.4in -0.75in;
  padding: 0.5in 0.75in 0.3in 0.75in;
}

.name {
  font-size: 22pt;
  font-weight: bold;
  margin: 0 0 0.1in 0;
  color: #2c3e50;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.title-line {
  font-size: 12pt;
  color: #3498db;
  font-weight: 600;
  margin-bottom: 0.2in;
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.1in;
  font-size: 9pt;
  color: #5a6c7d;
}

.resume-body {
  display: flex;
  flex-direction: column;
  gap: 0.3in;
}

.section {
  margin-bottom: 0.3in;
}

.section-title {
  font-size: 13pt;
  font-weight: bold;
  color: #2c3e50;
  margin: 0 0 0.15in 0;
  padding: 0.1in 0;
  border-bottom: 1px solid #3498db;
  display: flex;
  align-items: center;
  gap: 0.1in;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.section-content {
  margin-left: 0;
}

.summary-text {
  margin: 0;
  text-align: justify;
  font-size: 10pt;
  background: #f8f9fa;
  padding: 0.15in;
  border-left: 3px solid #3498db;
}

.skills-categories {
  display: flex;
  flex-direction: column;
  gap: 0.2in;
}

.skill-category {
  margin-bottom: 0.15in;
}

.skill-category-title {
  font-size: 11pt;
  font-weight: bold;
  color: #2c3e50;
  margin: 0 0 0.08in 0;
  border-left: 3px solid #e74c3c;
  padding-left: 0.1in;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.08in;
}

.skill-tag {
  background: #ecf0f1;
  color: #2c3e50;
  padding: 0.04in 0.08in;
  border-radius: 3px;
  font-size: 9pt;
  font-weight: 500;
  border: 1px solid #bdc3c7;
}

.skill-tag.programming {
  background: #e8f4fd;
  border-color: #3498db;
  color: #2980b9;
}

.skill-tag.frameworks {
  background: #eef7ed;
  border-color: #27ae60;
  color: #229954;
}

.skill-tag.tools {
  background: #fdf2e8;
  border-color: #f39c12;
  color: #d68910;
}

.skill-tag.job-match {
  background: #d5f4e6;
  border-color: #27ae60;
  color: #27ae60;
  font-weight: bold;
  box-shadow: 0 1px 3px rgba(39, 174, 96, 0.3);
}

.experience-item {
  margin-bottom: 0.25in;
  padding: 0.15in;
  border: 1px solid #ecf0f1;
  border-radius: 5px;
  background: #fdfdfd;
}

.exp-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.1in;
}

.exp-title {
  font-size: 12pt;
  font-weight: bold;
  margin: 0;
  color: #2c3e50;
}

.exp-company {
  font-size: 11pt;
  color: #3498db;
  font-weight: 600;
}

.exp-dates {
  font-size: 9pt;
  color: #7f8c8d;
  text-align: right;
  white-space: nowrap;
}

.tech-highlights {
  background: #f0f8ff;
  padding: 0.1in;
  border-left: 3px solid #3498db;
  margin: 0.1in 0;
}

.tech-highlights-title {
  font-size: 10pt;
  font-weight: bold;
  color: #2980b9;
  margin: 0 0 0.05in 0;
}

.tech-bullets {
  margin: 0;
  padding-left: 0.2in;
}

.tech-bullets li {
  font-size: 9pt;
  color: #2c3e50;
  margin-bottom: 0.03in;
}

.exp-bullets {
  margin: 0.1in 0 0 0.2in;
  padding: 0;
}

.exp-bullets li {
  font-size: 10pt;
  margin-bottom: 0.05in;
  text-align: justify;
}

.project-item {
  background: #f8f9fa;
  padding: 0.15in;
  border-radius: 5px;
  border: 1px solid #dee2e6;
}

.project-title {
  font-size: 11pt;
  font-weight: bold;
  color: #2c3e50;
  margin: 0 0 0.08in 0;
}

.project-description {
  font-size: 10pt;
  margin: 0 0 0.1in 0;
  text-align: justify;
}

.project-tech {
  display: flex;
  gap: 0.05in;
  flex-wrap: wrap;
}

.tech-tag {
  background: #3498db;
  color: white;
  padding: 0.03in 0.06in;
  border-radius: 3px;
  font-size: 8pt;
  font-weight: 500;
}

.education-item {
  margin-bottom: 0.15in;
}

.edu-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.edu-degree {
  font-size: 11pt;
  font-weight: bold;
  margin: 0;
  color: #2c3e50;
}

.edu-institution {
  font-size: 10pt;
  color: #3498db;
  font-weight: 500;
}

.edu-year {
  font-size: 9pt;
  color: #7f8c8d;
  white-space: nowrap;
}

.edu-gpa {
  font-size: 9pt;
  color: #27ae60;
  font-weight: 600;
}

.tech-stack-badge {
  position: absolute;
  top: 0.2in;
  right: 0.2in;
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  color: white;
  padding: 0.1in;
  border-radius: 5px;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

.badge-title {
  font-size: 8pt;
  font-weight: bold;
  margin-bottom: 0.05in;
}

.proficiency-meter {
  width: 80px;
  height: 8px;
  background: rgba(255,255,255,0.3);
  border-radius: 4px;
  overflow: hidden;
}

.meter-bar {
  height: 100%;
  background: #27ae60;
  transition: width 0.3s ease;
}

/* Print optimizations */
@media print {
  .technical-resume {
    padding: 0.5in;
    box-shadow: none;
  }
  
  .tech-stack-badge {
    display: none;
  }
  
  .resume-header {
    background: white !important;
    color: black !important;
  }
}

/* Responsive adjustments */
@media (max-width: 8.5in) {
  .contact-grid {
    grid-template-columns: 1fr 1fr;
  }
  
  .skills-categories {
    flex-direction: column;
  }
  
  .skill-tags {
    justify-content: flex-start;
  }
}
</style>
