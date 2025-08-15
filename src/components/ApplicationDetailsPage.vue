<template>
  <div class="page-wrapper">
    <AppHeader v-if="isHeaderVisible" />
    <div v-else class="header-fallback">Header not loading (Check HeaderPart.vue)</div>
    <div class="container">
      <!-- Back to Dashboard -->
      <router-link to="/dashboard" class="back-link">
        ← Back to Dashboard
      </router-link>

      <!-- Header -->
      <div class="job-header">
        <div class="header-content">
          <h1 class="job-title">Senior Frontend Developer</h1>
          <div class="job-meta">
            <span class="meta-item"><q-icon name="business" size="16px" /> TechCorp Inc.</span>
            <span class="meta-item"><q-icon name="place" size="16px" /> San Francisco, CA</span>
            <span class="meta-item"><q-icon name="schedule" size="16px" /> Full-time</span>
            <span class="meta-item"><q-icon name="attach_money" size="16px" /> $120K - $150K</span>
          </div>
        </div>

        <!-- Status Badge -->
        <div class="status-section">
          <div class="status-badge">
            <q-icon name="schedule" size="14px" />
            Under Review
          </div>
          <p class="applied-date">Applied January 15, 2024</p>
        </div>
      </div>

      <!-- Tabs -->
      <div class="tabs-container">
        <div class="tabs">
          <button
            @click="activeTab = 'jobDetails'"
            :class="['tab-btn', activeTab === 'jobDetails' ? 'active' : '']"
          >
            Job Details
          </button>
          <button
            @click="activeTab = 'myApplication'"
            :class="['tab-btn', activeTab === 'myApplication' ? 'active' : '']"
          >
            My Application
          </button>
        </div>
      </div>

      <!-- Job Details Tab -->
      <div v-if="activeTab === 'jobDetails'" class="tab-content">
        <!-- Job Overview -->
        <section class="card">
          <div class="card-header">
            <h2>Job Overview</h2>
          </div>
          <div class="card-body">
            <p class="overview-text">
              We are seeking an experienced Senior Frontend Developer to join our growing engineering team.
              You will be responsible for building responsive, high-performance web applications using modern
              technologies and frameworks while maintaining the highest standards of code quality and user experience.
            </p>
            <div class="job-details-grid">
              <div class="detail-item">
                <div class="detail-label">Work Mode</div>
                <div class="detail-value">Hybrid</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Posted Date</div>
                <div class="detail-value">January 10, 2024</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Department</div>
                <div class="detail-value">Engineering</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Experience Level</div>
                <div class="detail-value">Senior</div>
              </div>
            </div>
          </div>
        </section>

        <!-- Key Responsibilities -->
        <section class="card">
          <div class="card-header">
            <h2>Key Responsibilities</h2>
          </div>
          <div class="card-body">
            <div class="responsibilities-grid">
              <div class="responsibility-item">
                <div class="responsibility-icon">
                  <q-icon name="code" size="20px" />
                </div>
                <div class="responsibility-content">
                  <h4>Development & Architecture</h4>
                  <p>Develop and maintain high-quality web applications using React, TypeScript, and modern CSS frameworks</p>
                </div>
              </div>
              <div class="responsibility-item">
                <div class="responsibility-icon">
                  <q-icon name="group" size="20px" />
                </div>
                <div class="responsibility-content">
                  <h4>Cross-functional Collaboration</h4>
                  <p>Collaborate with design and backend teams to implement user-facing features and ensure seamless integration</p>
                </div>
              </div>
              <div class="responsibility-item">
                <div class="responsibility-icon">
                  <q-icon name="speed" size="20px" />
                </div>
                <div class="responsibility-content">
                  <h4>Performance Optimization</h4>
                  <p>Optimize applications for maximum speed, scalability, and optimal user experience across all devices</p>
                </div>
              </div>
              <div class="responsibility-item">
                <div class="responsibility-icon">
                  <q-icon name="school" size="20px" />
                </div>
                <div class="responsibility-content">
                  <h4>Mentorship & Code Review</h4>
                  <p>Mentor junior developers and conduct thorough code reviews to maintain high development standards</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Requirements -->
        <section class="card">
          <div class="card-header">
            <h2>Requirements & Qualifications</h2>
          </div>
          <div class="card-body">
            <div class="requirements-sections">
              <!-- Education & Experience -->
              <div class="requirement-section">
                <h3 class="section-title">Education & Experience</h3>
                <div class="requirement-list">
                  <div class="requirement-item essential">
                    <q-icon name="check_circle" size="16px" />
                    <span>Bachelor's degree in Computer Science, Engineering, or related field</span>
                  </div>
                  <div class="requirement-item essential">
                    <q-icon name="check_circle" size="16px" />
                    <span>5+ years of professional frontend development experience</span>
                  </div>
                  <div class="requirement-item essential">
                    <q-icon name="check_circle" size="16px" />
                    <span>3+ years of hands-on experience with React and TypeScript</span>
                  </div>
                </div>
              </div>

              <!-- Technical Skills -->
              <div class="requirement-section">
                <h3 class="section-title">Technical Expertise</h3>
                <div class="skills-grid">
                  <div class="skill-category">
                    <h4>Core Technologies</h4>
                    <div class="skill-tags">
                      <span class="skill-tag primary">React</span>
                      <span class="skill-tag primary">TypeScript</span>
                      <span class="skill-tag primary">JavaScript ES6+</span>
                      <span class="skill-tag primary">HTML5</span>
                      <span class="skill-tag primary">CSS3/SCSS</span>
                    </div>
                  </div>
                  <div class="skill-category">
                    <h4>Tools & Frameworks</h4>
                    <div class="skill-tags">
                      <span class="skill-tag secondary">Git/GitHub</span>
                      <span class="skill-tag secondary">Webpack</span>
                      <span class="skill-tag secondary">Jest/Testing</span>
                      <span class="skill-tag secondary">REST APIs</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Soft Skills -->
              <div class="requirement-section">
                <h3 class="section-title">Professional Skills</h3>
                <div class="requirement-list">
                  <div class="requirement-item soft-skill">
                    <q-icon name="forum" size="16px" />
                    <span>Excellent written and verbal communication skills</span>
                  </div>
                  <div class="requirement-item soft-skill">
                    <q-icon name="people" size="16px" />
                    <span>Strong collaborative mindset and team leadership abilities</span>
                  </div>
                  <div class="requirement-item soft-skill">
                    <q-icon name="psychology" size="16px" />
                    <span>Analytical problem-solving approach and attention to detail</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Benefits & Compensation -->
        <section class="card">
          <div class="card-header">
            <h2>Benefits & Compensation</h2>
          </div>
          <div class="card-body">
            <div class="benefits-container">
              <div class="benefit-category">
                <h4>Health & Wellness</h4>
                <div class="benefit-list">
                  <div class="benefit-item">
                    <q-icon name="health_and_safety" size="16px" />
                    <span>Comprehensive health, dental, and vision insurance</span>
                  </div>
                  <div class="benefit-item">
                    <q-icon name="fitness_center" size="16px" />
                    <span>Gym membership reimbursement</span>
                  </div>
                </div>
              </div>
              
              <div class="benefit-category">
                <h4>Financial Benefits</h4>
                <div class="benefit-list">
                  <div class="benefit-item">
                    <q-icon name="account_balance" size="16px" />
                    <span>401(k) with company matching up to 6%</span>
                  </div>
                  <div class="benefit-item">
                    <q-icon name="trending_up" size="16px" />
                    <span>Annual performance bonuses</span>
                  </div>
                </div>
              </div>

              <div class="benefit-category">
                <h4>Work-Life Balance</h4>
                <div class="benefit-list">
                  <div class="benefit-item">
                    <q-icon name="schedule" size="16px" />
                    <span>Flexible working hours and remote work options</span>
                  </div>
                  <div class="benefit-item">
                    <q-icon name="flight" size="16px" />
                    <span>Generous PTO and paid holidays</span>
                  </div>
                </div>
              </div>

              <div class="benefit-category">
                <h4>Professional Development</h4>
                <div class="benefit-list">
                  <div class="benefit-item">
                    <q-icon name="school" size="16px" />
                    <span>$3,000 annual learning and development budget</span>
                  </div>
                  <div class="benefit-item">
                    <q-icon name="conference_room" size="16px" />
                    <span>Conference attendance and certification support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Action Buttons -->
        <div class="action-section">
          <q-btn 
            label="View Application Status" 
            icon="visibility"
            color="primary"
            unelevated
            class="primary-action-btn"
          />
          <q-btn 
            label="Contact Recruiter" 
            icon="mail"
            outline
            color="primary"
            class="secondary-action-btn"
          />
        </div>
      </div>

      <!-- My Application Tab -->
      <div v-if="activeTab === 'myApplication'" class="tab-content">
          
          <div class="card-body">
            <MyApplication />
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppHeader from '../components/HeaderPart.vue';
import MyApplication from '../components/FilledApplication.vue';

export default {
  name: "ApplicationDetailPage",
  components: {
    AppHeader,
    MyApplication // Register the MyApplication component
  },
  data() {
    return {
      component: AppHeader,
      activeTab: "jobDetails",
      isHeaderVisible: true,
    };
  },
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.page-wrapper {
  position: relative;
  z-index: 1; /* Ensure it’s above other elements */
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px;
  background-color: #fafbfc;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Header Fallback */
.header-fallback {
  background: #fee2e2;
  color: #dc2626;
  padding: 10px;
  text-align: center;
  font-size: 14px;
  margin-bottom: 20px;
}

/* Back Link */
.back-link {
  display: inline-flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
  text-decoration: none;
  margin-bottom: 24px;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.back-link:hover {
  background-color: #f1f5f9;
  color: #1565c0;
  text-decoration: none;
  border-color: #e2e8f0;
}

/* Header */
.job-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.header-content {
  flex: 1;
}

.job-title {
  font-size: 32px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 16px 0;
  line-height: 1.2;
}

.job-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  margin-top: 16px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #475569;
  padding: 6px 0;
}

.meta-item .q-icon {
  color: #1565c0;
}

.status-section {
  text-align: right;
  flex-shrink: 0;
}

.status-badge {
  background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%);
  color: #92400e;
  padding: 10px 16px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1px solid #fbbf24;
}

.applied-date {
  font-size: 13px;
  color: #64748b;
  margin: 12px 0 0 0;
  font-weight: 500;
}

/* Tabs */
.tabs-container {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px 16px 0 0;
  padding: 0 32px;
}

.tabs {
  display: flex;
  gap: 48px;
  border-bottom: 1px solid #e2e8f0;
}

.tab-btn {
  padding: 20px 0;
  font-size: 15px;
  font-weight: 600;
  color: #64748b;
  border: none;
  background: none;
  cursor: pointer;
  position: relative;
  transition: color 0.2s ease;
}

.tab-btn:hover {
  color: #1565c0;
}

.tab-btn.active {
  color: #1565c0;
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 3px;
  background: #1565c0;
  border-radius: 2px;
}

.tab-content {
  background: white;
  border: 1px solid #e2e8f0;
  border-top: none;
  border-radius: 0 0 16px 16px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* Card Sections */
.card {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.card-header {
  background: #f8fafc;
  padding: 24px 32px;
  border-bottom: 1px solid #e2e8f0;
}

.card-header h2 {
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.card-body {
  padding: 32px;
  background: white;
}

.overview-text {
  font-size: 16px;
  color: #475569;
  line-height: 1.7;
  margin-bottom: 32px;
}

.job-details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
}

.detail-item {
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  border-left: 4px solid #1565c0;
}

.detail-label {
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.detail-value {
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
}

/* Responsibilities */
.responsibilities-grid {
  display: grid;
  gap: 24px;
}

.responsibility-item {
  display: flex;
  gap: 16px;
  padding: 24px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.responsibility-icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  background: #1565c0;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.responsibility-content h4 {
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 8px 0;
}

.responsibility-content p {
  font-size: 14px;
  color: #475569;
  line-height: 1.6;
  margin: 0;
}

/* Requirements */
.requirements-sections {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.requirement-section {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: white;
  background: #1565c0;
  margin: 0;
  padding: 16px 24px;
}

.requirement-list {
  padding: 24px;
  background: white;
}

.requirement-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  font-size: 14px;
  color: #374151;
  font-weight: 500;
}

.requirement-item:last-child {
  margin-bottom: 0;
}

.requirement-item.essential .q-icon {
  color: #10b981;
}

.requirement-item.soft-skill .q-icon {
  color: #1565c0;
}

.skills-grid {
  padding: 24px;
  background: white;
  display: grid;
  gap: 24px;
}

.skill-category h4 {
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 12px 0;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-tag {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.skill-tag.primary {
  background: #1565c0;
  color: white;
}

.skill-tag.secondary {
  background: #e2e8f0;
  color: #475569;
}

/* Benefits */
.benefits-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.benefit-category {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
}

.benefit-category h4 {
  font-size: 14px;
  font-weight: 600;
  color: white;
  background: #1565c0;
  margin: 0;
  padding: 16px 20px;
}

.benefit-list {
  padding: 20px;
  background: white;
}

.benefit-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
  font-size: 14px;
  color: #374151;
}

.benefit-item:last-child {
  margin-bottom: 0;
}

.benefit-item .q-icon {
  color: #1565c0;
  margin-top: 2px;
}

/* Action Section */
.action-section {
  display: flex;
  gap: 16px;
  justify-content: center;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
}

.primary-action-btn {
  background-color: #1565c0;
  font-weight: 600;
  padding: 12px 32px;
  border-radius: 8px;
  font-size: 14px;
}

.primary-action-btn:hover {
  background-color: #1976d2;
}

.secondary-action-btn {
  border-color: #1565c0;
  color: #1565c0;
  font-weight: 600;
  padding: 12px 32px;
  border-radius: 8px;
  font-size: 14px;
}

.secondary-action-btn:hover {
  background-color: #f0f7ff;
}

.placeholder-text {
  font-size: 15px;
  color: #64748b;
  line-height: 1.6;
  text-align: center;
  padding: 40px 20px;
  background: #f8fafc;
  border-radius: 8px;
  margin: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .container {
    padding: 20px 16px;
  }
  
  .job-header {
    flex-direction: column;
    gap: 24px;
    padding: 24px;
  }
  
  .job-title {
    font-size: 24px;
  }
  
  .job-meta {
    gap: 16px;
  }
  
  .status-section {
    text-align: left;
    width: 100%;
  }
  
  .tabs-container,
  .tab-content {
    padding: 20px;
  }
  
  .tabs {
    gap: 32px;
  }
  
  .card-header,
  .card-body {
    padding: 20px;
  }
  
  .job-details-grid {
    grid-template-columns: 1fr;
  }
  
  .benefits-container {
    grid-template-columns: 1fr;
  }
  
  .action-section {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .job-meta {
    flex-direction: column;
    gap: 12px;
  }
  
  .tabs {
    gap: 24px;
  }
  
  .responsibility-item {
    flex-direction: column;
    text-align: center;
  }
  
  .skills-grid {
    grid-template-columns: 1fr;
  }
}
</style>