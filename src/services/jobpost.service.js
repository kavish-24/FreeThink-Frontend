import api from './auth.service';

/**
 * Posts a new job listing
 * @param {Object} jobData - The job data to post
 * @returns {Promise<Object>} - Response object with success status and job details
 */
const postJob = async (jobData) => {
  try {
    // Get the auth token
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    // Format the data to exactly match the working curl request
    const formattedJobData = {
      title: jobData.title || '',
      description: jobData.description || '',
      location: jobData.location || '',
      type: jobData.type ? jobData.type.toLowerCase().replace(' ', '_') : 'full_time',
      salary: jobData.salary ? Number(jobData.salary) : 0,
      deadline: jobData.deadline || null,
      skills: Array.isArray(jobData.skills) ? jobData.skills : (jobData.skills ? [jobData.skills] : []),
      tags: Array.isArray(jobData.tags) ? jobData.tags : (jobData.tags ? [jobData.tags] : []),
      benefits: jobData.benefits || '',
      education: jobData.education || '',
      // Include company_id in the request body to match the curl example
      company_id: jobData.company_id
    };
    
    // Ensure type is one of the allowed values
    const allowedTypes = ['full_time', 'part_time', 'contract', 'internship', 'remote'];
    if (!allowedTypes.includes(formattedJobData.type)) {
      formattedJobData.type = 'full_time';
    }
    
    // Remove any undefined or null values
    Object.keys(formattedJobData).forEach(key => {
      if (formattedJobData[key] === undefined || formattedJobData[key] === null) {
        delete formattedJobData[key];
      }
    });

    console.log('Sending job data:', formattedJobData);
    const response = await api.post('/jobs/jobs', formattedJobData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    // Return the response data with success status
    return {
      success: true,
      ...response.data,
      // Ensure we have a default message if none provided
      message: response.data?.message || 'Job posted successfully',
      // Ensure status is one of the expected values
      status: response.data?.status || 'draft'
    };
  } catch (error) {
    console.error('Job posting error:', error);
    
    // More detailed error handling
    let errorMessage = 'Job submission failed';
    let errorStatus = error.response?.status;
    let errorData = error.response?.data;
    
    if (error.response) {
      // The request was made and the server responded with a status code
      console.error('Response data:', errorData);
      console.error('Response status:', errorStatus);
      console.error('Response headers:', error.response.headers);
      
      errorMessage = errorData?.message || 
                   errorData?.error || 
                   `Server responded with status ${errorStatus}`;
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
      errorMessage = 'No response from server. Please check your connection.';
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up request:', error.message);
      errorMessage = error.message || 'Error setting up job submission';
    }
    
    return {
      success: false,
      error: errorMessage,
      status: errorStatus,
      data: errorData
    };
  }
};

/**
 * Updates an existing job listing
 * @param {number} jobId - The ID of the job to update
 * @param {Object} jobData - The updated job data
 * @returns {Promise<Object>} - Response object with success status and updated job details
 */
const updateJob = async (jobId, jobData) => {
  try {
    const response = await api.put(`/jobs/${jobId}`, jobData);
    return {
      success: true,
      ...response.data
    };
  } catch (error) {
    console.error('Job update error:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to update job',
      status: error.response?.status
    };
  }
};

/**
 * Closes an existing job listing
 * @param {number} jobId - The ID of the job to close
 * @returns {Promise<Object>} - Response object with success status
 */
const closeJob = async (jobId) => {
  try {
    const response = await api.patch(`/jobs/${jobId}/close`);
    return {
      success: true,
      ...response.data
    };
  } catch (error) {
    console.error('Error closing job:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to close job',
      status: error.response?.status
    };
  }
};

/**
 * Fetches all jobs posted by the current employer
 * @returns {Promise<Object>} - Response object with success status and jobs array
 */
/**
 * Fetches all jobs posted by the current employer
 * @returns {Promise<Object>} - Response object with success status and jobs array
 */
const getEmployerJobs = async () => {
  console.log('Fetching jobs for current employer...');
  
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('No authentication token found');
      throw new Error('No authentication token found');
    }

    console.log('Sending request to /jobs/employer endpoint');
    const response = await api.get('/jobs/employer', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 10000 // 10 second timeout
    });

    console.log('Received response from /jobs/employer:', {
      status: response.status,
      data: response.data
    });

    // Ensure we have a valid response structure
    if (!response.data) {
      throw new Error('Invalid response format from server');
    }

    // Normalize the jobs data
    const jobs = Array.isArray(response.data.jobs) ? response.data.jobs : [];
    console.log(`Successfully fetched ${jobs.length} jobs`);
    
    return {
      success: true,
      jobs: jobs
    };
  } catch (error) {
    console.error('Error in getEmployerJobs:', {
      message: error.message,
      response: error.response ? {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      } : 'No response',
      config: error.config ? {
        url: error.config.url,
        method: error.config.method,
        headers: error.config.headers ? {
          ...error.config.headers,
          // Don't log the full auth token
          Authorization: error.config.headers.Authorization ? 'Bearer [REDACTED]' : undefined
        } : {}
      } : 'No config'
    });

    let errorMessage = 'Failed to fetch jobs';
    if (error.response) {
      errorMessage = error.response.data?.message || error.response.statusText || errorMessage;
    } else if (error.request) {
      errorMessage = 'No response received from server. Please check your connection.';
    } else {
      errorMessage = error.message || errorMessage;
    }

    return {
      success: false,
      error: errorMessage,
      jobs: []
    };
  }
};

export default {
  postJob,
  updateJob,
  closeJob,
  getEmployerJobs
};
