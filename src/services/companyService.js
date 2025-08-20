import api, { authHelpers } from './auth.service';

export const companyProfileService = {
  async getCompany(companyIdOverride) {
    const id = companyIdOverride || authHelpers.getCurrentUser()?.id;
    try {
      const res = await api.get(`company/${id}`);
      return { success: true, data: res.data };
    } catch (err) {
      console.error('Error loading company data:', err);
      return { success: false, error: err.response?.data?.message || err.message };
    }
  },

  async updateCompany(formValue, companyIdOverride) {
    const id = companyIdOverride || authHelpers.getCurrentUser()?.id;
    try {
    const payload = {
        companyName: formValue.Name?.trim(),
        contactNumber: formValue.contactNumber?.trim(),
        website: formValue.website?.trim(),
        description: formValue.description?.trim(),
        industry: formValue.industry?.trim(),
        location: formValue.location?.trim(),
        numberOfEmployees: formValue.numberOfEmployees
          ? parseInt(formValue.numberOfEmployees, 10)
          : null,
        positionsAvailable: formValue.positionsAvailable
          ? formValue.positionsAvailable.split(",").map(pos => pos.trim()).filter(Boolean)
          : []
      }; 
      let res;
      if (formValue.logoFile) {
        const formData = new FormData();
        Object.keys(payload).forEach(key => {
          if (Array.isArray(payload[key])) {
            payload[key].forEach((item, index) => formData.append(`${key}[${index}]`, item));
          } else if (payload[key] !== null && payload[key] !== undefined) {
            formData.append(key, payload[key]);
          }
        });
        formData.append('logo', formValue.logoFile);

        res = await api.put(`companies/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        if (formValue.logo) payload.logo = formValue.logo;
        res = await api.put(`companies/${id}`, payload);
      }

      return { success: res.data.success, data: res.data };
    } catch (err) {
      console.error('Error updating company profile:', err);
      return { success: false, error: err.response?.data?.message || err.message };
    }
  }
};
