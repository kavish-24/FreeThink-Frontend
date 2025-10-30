import api from './auth.service.js';
 // change to your backend URL

export default {
  getSuggestions(companyId) {
    return api.get(`/jobseeker/suggestions/${companyId}`);
  },
  searchJobseekers(position) {
    return api.get(`/jobseeker/search`, {
      params: { position }
    });
  }
};
