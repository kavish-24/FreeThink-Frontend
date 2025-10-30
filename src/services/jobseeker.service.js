import api from './auth.service.js';
 // change to your backend URL

export default {
  getSuggestions(companyId) {
    return api.get(`${API_URL}/suggestions/${companyId}`);
  },
  searchJobseekers(position) {
    return api.get(`${API_URL}/search`, {
      params: { position }
    });
  }
};
