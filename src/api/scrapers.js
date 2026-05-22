import { apiRequest } from './client';

export const scrapersApi = {
  list: () => apiRequest('/scrapers'),

  getById: (scraperId) => apiRequest(`/scrapers/${scraperId}`),

  trigger: (scraperId) =>
    apiRequest(`/scrapers/${scraperId}/trigger`, {
      method: 'POST',
    }),

  getJobs: (scraperId) => apiRequest(`/scrapers/${scraperId}/jobs`),

  getJobLogs: (jobId) => apiRequest(`/scrape-jobs/${jobId}/logs`),

  getDashboardMetrics: () => apiRequest('/admin/dashboard/metrics'),
};
