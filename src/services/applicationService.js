import api from './auth.service'

export const applicationService = {
  // Get user's job applications
  async getMyApplications() {
    try {
      const response = await api.get('/applications/my-applications')
      return response.data
    } catch (error) {
      console.error('Error fetching applications:', error)
      throw error
    }
  },

  // Apply to a job
  async applyToJob(jobId, coverLetter, resumeFile) {
    try {
      const formData = new FormData()
      formData.append('job_id', jobId)
      formData.append('cover_letter', coverLetter)
      if (resumeFile) {
        formData.append('resume', resumeFile)
      }

      const response = await api.post('/applications/apply', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    } catch (error) {
      console.error('Error applying to job:', error)
      throw error
    }
  }
}