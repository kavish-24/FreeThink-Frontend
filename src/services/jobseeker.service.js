import axios from 'axios';

const API_URL = 'http://localhost:3000/api/jobseeker'; // change to your backend URL

export default {
  getSuggestions(companyId) {
    return axios.get(`${API_URL}/suggestions/${companyId}`);
  },
  searchJobseekers(position) {
    return axios.get(`${API_URL}/search`, {
      params: { position }
    });
  }
};
