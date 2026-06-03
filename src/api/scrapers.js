import { apiRequest } from './client';
import { productsApi } from './products';
import { retailersApi } from './retailers';

function asArray(data) {
  return data ?? [];
}

function scraperPath(retailerId, suffix = '') {
  return `/retailers/${retailerId}/scraper${suffix}`;
}

export const scrapersApi = {
  getByRetailer: (retailerId) => apiRequest(scraperPath(retailerId)),

  save: (retailerId, scraper) =>
    apiRequest(scraperPath(retailerId), {
      method: 'PUT',
      body: JSON.stringify(scraper),
    }),

  delete: (retailerId) =>
    apiRequest(scraperPath(retailerId), { method: 'DELETE' }),

  list: async () => {
    const retailers = await retailersApi.list();
    const rows = await Promise.all(
      retailers.map(async (retailer) => {
        const scraper = await scrapersApi.getByRetailer(retailer.id);
        if (!scraper) return null;
        return { ...scraper, retailer, retailer_id: retailer.id };
      }),
    );
    return rows.filter(Boolean);
  },

  startJob: (retailerId) =>
    apiRequest(`${scraperPath(retailerId)}/jobs/start`, { method: 'POST' }),

  getJobs: async (retailerId) =>
    asArray(await apiRequest(`${scraperPath(retailerId)}/jobs`)),

  getJobLogs: async (retailerId, jobId) =>
    asArray(
      await apiRequest(`${scraperPath(retailerId)}/jobs/${jobId}/logs`),
    ),

  addJobLog: (retailerId, jobId, log) =>
    apiRequest(`${scraperPath(retailerId)}/jobs/${jobId}/logs`, {
      method: 'POST',
      body: JSON.stringify(log),
    }),

  getDashboardMetrics: async () => {
    const [products, retailers, scrapers] = await Promise.all([
      productsApi.list(),
      retailersApi.list(),
      scrapersApi.list(),
    ]);

    const jobLists = await Promise.all(
      scrapers.map((s) => scrapersApi.getJobs(s.retailer_id)),
    );
    const allJobs = jobLists.flat();
    const today = new Date().toDateString();

    const lastScrapeTime = scrapers.reduce((latest, s) => {
      if (!s.last_run) return latest;
      if (!latest || s.last_run > latest) return s.last_run;
      return latest;
    }, null);

    return {
      totalProducts: products.length,
      totalRetailers: retailers.length,
      activeScrapers: scrapers.filter((s) => s.status === 'RUNNING').length,
      failedScrapers: allJobs.filter((j) => j.status === 'FAILED').length,
      jobsToday: allJobs.filter(
        (j) => j.start_time && new Date(j.start_time).toDateString() === today,
      ).length,
      lastScrapeTime,
    };
  },
};
