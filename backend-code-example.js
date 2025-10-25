// Backend API endpoint to check if user has applied for a job
// Add this to your applications router/controller

// Example using Express.js and your existing database setup

// GET /applications/check/:jobId
const checkApplicationStatus = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.id; // Assuming you have middleware that sets req.user from JWT token

    // Check if application exists for this user and job
    const existingApplication = await db.query(
      'SELECT id FROM applications WHERE job_seeker_id = ? AND job_id = ?',
      [userId, jobId]
    );

    const hasApplied = existingApplication.length > 0;

    res.status(200).json({
      success: true,
      hasApplied: hasApplied,
      message: hasApplied ? 'User has already applied for this job' : 'User has not applied for this job'
    });

  } catch (error) {
    console.error('Error checking application status:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while checking application status',
      error: error.message
    });
  }
};

// If using Sequelize ORM, here's an alternative implementation:
const checkApplicationStatusSequelize = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.id;

    const existingApplication = await Application.findOne({
      where: {
        job_seeker_id: userId,
        job_id: jobId
      }
    });

    const hasApplied = !!existingApplication;

    res.status(200).json({
      success: true,
      hasApplied: hasApplied,
      applicationId: existingApplication?.id || null,
      appliedAt: existingApplication?.applied_at || null,
      status: existingApplication?.status || null,
      message: hasApplied ? 'User has already applied for this job' : 'User has not applied for this job'
    });

  } catch (error) {
    console.error('Error checking application status:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while checking application status',
      error: error.message
    });
  }
};

// Add this route to your applications router
// router.get('/check/:jobId', authenticateToken, checkApplicationStatus);

// Example of how to add it to your router file:
/*
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth'); // Your auth middleware

// Check if user has applied for a specific job
router.get('/check/:jobId', authenticateToken, checkApplicationStatus);

module.exports = router;
*/