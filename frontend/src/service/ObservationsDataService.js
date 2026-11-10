// Sahith Thopucherla | st944@njit.edu | November 9, 2026
// IT-302 Advanced Internet Applications, Section 451
// Phase 4 Read Node.js Data using React.js Assignment

import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL + '/api/v1/st944/observations',
  timeout: 60000,
});

export default class ObservationsDataService {
  static async getAll(name, pageNumber, signal) {
    // The same endpoint handles both the unfiltered and filtered lists.
    const { data } = await api.get('', {
      params: { name: name || undefined, pageNumber, itemsPerPage: 9 },
      signal,
    });
    return data;
  }

  static async getById(id, signal) {
    const { data } = await api.get('/id/' + encodeURIComponent(id), { signal });
    return data;
  }
}
