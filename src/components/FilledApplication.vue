<template>
  <div class="application-container">
    <!-- Application Summary -->
    <section class="card">
      <div class="card-header">
        <h2>Application Summary</h2>
      </div>
      <div class="card-body">
        <div class="summary-grid">
          <div class="summary-item">
            <div class="summary-icon">
              <q-icon name="description" size="20px" />
            </div>
            <div class="summary-content">
              <div class="summary-label">Application ID</div>
              <div class="summary-value">APP-2024-001</div>
            </div>
          </div>
          <div class="summary-item">
            <div class="summary-icon">
              <q-icon name="calendar_today" size="20px" />
            </div>
            <div class="summary-content">
              <div class="summary-label">Submitted Date</div>
              <div class="summary-value">January 15, 2024</div>
            </div>
          </div>
          <div class="summary-item">
            <div class="summary-icon">
              <q-icon name="check_circle" size="20px" />
            </div>
            <div class="summary-content">
              <div class="summary-label">Current Status</div>
              <div class="summary-value status-under-review">Under Review</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Personal Information -->
    <section class="card">
      <div class="card-header">
        <h2>Personal Information</h2>
      </div>
      <div class="card-body">
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Full Name</div>
            <div class="info-value">John Doe</div>
          </div>
          <div class="info-item">
            <div class="info-label">Email Address</div>
            <div class="info-value">ani@gmail.com</div>
          </div>
          <div class="info-item">
            <div class="info-label">Phone Number</div>
            <div class="info-value">+1 (555) 123-4567</div>
          </div>
          <div class="info-item">
            <div class="info-label">Address</div>
            <div class="info-value">123 Main Street, San Francisco, CA 94105</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Professional Information -->
    <section class="card">
      <div class="card-header">
        <h2>Professional Information</h2>
      </div>
      <div class="card-body">
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Current Job Title</div>
            <div class="info-value">Software Engineer</div>
          </div>
          <div class="info-item">
            <div class="info-label">Current Company</div>
            <div class="info-value">Tech Solutions Inc.</div>
          </div>
          <div class="info-item">
            <div class="info-label">Total Experience</div>
            <div class="info-value">3+ years</div>
          </div>
          <div class="info-item">
            <div class="info-label">Expected Salary</div>
            <div class="info-value">$80,000 - $100,000</div>
          </div>
          <div class="info-item">
            <div class="info-label">Notice Period</div>
            <div class="info-value">2 weeks</div>
          </div>
          <div class="info-item">
            <div class="info-label">Preferred Work Mode</div>
            <div class="info-value">Remote</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Application Timeline -->
    <section class="card">
      <div class="card-header">
        <h2>Application Timeline</h2>
      </div>
      <div class="card-body">
        <div class="timeline-container">
          <div class="timeline-item completed">
            <div class="timeline-icon">
              <q-icon name="check" size="16px" />
            </div>
            <div class="timeline-content">
              <h4>Application Submitted</h4>
              <p>January 15, 2024 at 2:30 PM</p>
              <span class="timeline-description">Your application has been successfully submitted and is being processed.</span>
            </div>
          </div>
          <div class="timeline-item active">
            <div class="timeline-icon">
              <q-icon name="schedule" size="16px" />
            </div>
            <div class="timeline-content">
              <h4>Under Review</h4>
              <p>January 16, 2024</p>
              <span class="timeline-description">Our hiring team is currently reviewing your application materials.</span>
            </div>
          </div>
          <div class="timeline-item pending">
            <div class="timeline-icon">
              <q-icon name="people" size="16px" />
            </div>
            <div class="timeline-content">
              <h4>Interview Scheduling</h4>
              <p>Pending</p>
              <span class="timeline-description">We'll contact you to schedule an interview if your profile matches our requirements.</span>
            </div>
          </div>
          <div class="timeline-item pending">
            <div class="timeline-icon">
              <q-icon name="how_to_reg" size="16px" />
            </div>
            <div class="timeline-content">
              <h4>Final Decision</h4>
              <p>Pending</p>
              <span class="timeline-description">We'll notify you of our final decision regarding your application.</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Action Buttons -->
    <div class="action-section">
      <q-btn 
        label="Withdraw Application" 
        icon="cancel"
        outline
        color="negative"
        class="withdraw-btn"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'MyApplication'
}
</script>

<style scoped>
.application-container {
  display: flex;
  flex-direction: column;
  gap: 32px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Card Sections - matching main page */
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

/* Summary Grid */
.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}

.summary-item {
  display: flex;
  gap: 16px;
  padding: 24px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.summary-icon {
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

.summary-content {
  flex: 1;
}

.summary-label {
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.summary-value {
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
}

.status-under-review {
  color: #92400e;
  background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%);
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 14px;
  display: inline-block;
}

/* Information Grid */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.info-item {
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  border-left: 4px solid #1565c0;
}

.info-label {
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.info-value {
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
}

/* Timeline */
.timeline-container {
  position: relative;
}

.timeline-item {
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
  position: relative;
}

.timeline-item:last-child {
  margin-bottom: 0;
}

.timeline-item::after {
  content: '';
  position: absolute;
  left: 23px;
  top: 48px;
  bottom: -32px;
  width: 2px;
  background: #e2e8f0;
}

.timeline-item:last-child::after {
  display: none;
}

.timeline-icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  position: relative;
  z-index: 1;
}

.timeline-item.completed .timeline-icon {
  background: #10b981;
}

.timeline-item.active .timeline-icon {
  background: #1565c0;
}

.timeline-item.pending .timeline-icon {
  background: #64748b;
}

.timeline-content {
  flex: 1;
  padding-top: 4px;
}

.timeline-content h4 {
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 4px 0;
}

.timeline-content p {
  font-size: 14px;
  font-weight: 500;
  color: #1565c0;
  margin: 0 0 8px 0;
}

.timeline-description {
  font-size: 14px;
  color: #475569;
  line-height: 1.5;
}

/* Action Section */
.action-section {
  display: flex;
  gap: 16px;
  justify-content: center;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
}

.withdraw-btn,
.update-btn {
  font-weight: 600;
  padding: 12px 32px;
  border-radius: 8px;
  font-size: 14px;
}

.withdraw-btn:hover {
  background-color: #fef2f2;
}

.update-btn:hover {
  background-color: #f0f7ff;
}

/* Responsive Design */
@media (max-width: 768px) {
  .card-header,
  .card-body {
    padding: 20px;
  }
  
  .summary-grid {
    grid-template-columns: 1fr;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .action-section {
    flex-direction: column;
  }
  
  .timeline-item {
    margin-bottom: 24px;
  }
  
  .timeline-item::after {
    bottom: -24px;
  }
}

@media (max-width: 480px) {
  .application-container {
    gap: 20px;
  }
  
  .summary-item {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
  
  .timeline-item {
    gap: 12px;
  }
  
  .timeline-icon {
    width: 40px;
    height: 40px;
  }
  
  .timeline-item::after {
    left: 19px;
  }
}
</style>