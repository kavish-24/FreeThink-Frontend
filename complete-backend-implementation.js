// Complete backend implementation example
// This assumes you're using Express.js with a MySQL/PostgreSQL database

// 1. Add this to your applications controller (e.g., applicationsController.js)

const checkApplicationStatus = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.id; // From JWT middleware

    // Validate inputs
    if (!jobId || !userId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters'
      });
    }

    // Check if job exists
    const jobExists = await db.query(
      'SELECT id FROM jobs WHERE id = ?',
      [jobId]
    );

    if (jobExists.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check for existing application
    const applicationQuery = `
      SELECT 
        id, 
        status, 
        applied_at,
        resume_link,
        cover_letter
      FROM applications 
      WHERE job_seeker_id = ? AND job_id = ?
    `;

    const existingApplication = await db.query(applicationQuery, [userId, jobId]);
    const hasApplied = existingApplication.length > 0;

    if (hasApplied) {
      const application = existingApplication[0];
      return res.status(200).json({
        success: true,
        hasApplied: true,
        application: {
          id: application.id,
          status: application.status,
          appliedAt: application.applied_at,
          hasResume: !!application.resume_link,
          hasCoverLetter: !!application.cover_letter
        },
        message: 'User has already applied for this job'
      });
    }

    res.status(200).json({
      success: true,
      hasApplied: false,
      application: null,
      message: 'User has not applied for this job'
    });

  } catch (error) {
    console.error('Error checking application status:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while checking application status',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// 2. Add this to your routes file (e.g., applications.js)

const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { checkApplicationStatus } = require('../controllers/applicationsController');

// Check application status for a specific job
router.get('/check/:jobId', authenticateToken, checkApplicationStatus);

// Your existing routes...
router.post('/apply', authenticateToken, applyForJob);
router.get('/my-applications', authenticateToken, getMyApplications);

module.exports = router;

// 3. Make sure your auth middleware is properly set up
// Example auth middleware (middleware/auth.js):

const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };

// 4. Database schema assumption:
/*
CREATE TABLE applications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  job_seeker_id INT NOT NULL,
  job_id INT NOT NULL,
  status ENUM('applied', 'reviewed', 'interview', 'accepted', 'rejected') DEFAULT 'applied',
  resume_link VARCHAR(500),
  cover_letter TEXT,
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (job_seeker_id) REFERENCES users(id),
  FOREIGN KEY (job_id) REFERENCES jobs(id),
  UNIQUE KEY unique_application (job_seeker_id, job_id)
);
*/