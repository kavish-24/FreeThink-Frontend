import api from './auth.service' // your configured axios instance

export const jobSeekerProfileService = {
  async getProfile(userId) {
    try {
      const res = await api.get(`/profile/${userId}`)
      return { success: true, data: res.data }
    } catch (err) {
      console.error('Error fetching profile:', err)
      return {
        success: false,
        error: err.response?.data?.error || err.response?.data?.message || 'Failed to fetch profile',
      }
    }
  },

  async getPublicProfile(userId) {
    try {
      const res = await api.get(`/profile/${userId}/public`)
      return { success: true, data: res.data }
    } catch (err) {
      console.error('Error fetching public profile:', err)
      return {
        success: false,
        error: err.response?.data?.error || err.response?.data?.message || 'Failed to fetch public profile',
      }
    }
  },

  async updateProfile(userId, profileData) {
    try {
      const res = await api.put(`/profile/${userId}`, profileData)
      return { success: true, data: res.data }
    } catch (err) {
      console.error('Error updating profile:', err)
      return {
        success: false,
        error: err.response?.data?.error || err.response?.data?.message || 'Failed to update profile',
      }
    }
  },

  async updateStatus(userId, status) {
    try {
      const res = await api.put(`/profile/${userId}/status`, { status })
      return { success: true, data: res.data }
    } catch (error) {
      console.error('Error updating profile status:', error)
      return { 
        success: false, 
        error: error.response?.data?.error || error.response?.data?.message || error.message 
      }
    }
  },

  // Upload new photo (replaces old)
  uploadPhoto: async (userId, file) => {
    try {
      const formData = new FormData()
      formData.append('photo', file)
      const { data } = await api.post(`/photo/${userId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      // No need to call GET; just return URL from upload
      return { success: true, url: data.url }
    } catch (err) {
      console.error('Error uploading photo:', err)
      return { 
        success: false, 
        error: err.response?.data?.error || err.response?.data?.message || err.message 
      }
    }
  },

  // Upload new resume (replaces old)
  uploadResume: async (userId, file) => {
    try {
      const formData = new FormData()
      formData.append('resume', file)
      const { data } = await api.post(`/resume/${userId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      // No need to call GET; just return URL from upload
      return { success: true, url: data.url }
    } catch (err) {
      console.error('Error uploading resume:', err)
      return { 
        success: false, 
        error: err.response?.data?.error || err.response?.data?.message || err.message 
      }
    }
  }
}
