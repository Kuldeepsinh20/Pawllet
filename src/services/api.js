/**
 * Pawlet Centralized API Client
 * Connects frontend to FastAPI backend endpoints with JWT Bearer authentication.
 */

const DEFAULT_PROD_API_URL = 'https://pawlet-backend.onrender.com';
const rawApiUrl = import.meta.env.VITE_API_URL;
const VITE_API_URL = (
  import.meta.env.PROD
    ? (rawApiUrl && !rawApiUrl.includes('localhost') && !rawApiUrl.includes('127.0.0.1')
        ? rawApiUrl
        : DEFAULT_PROD_API_URL)
    : (rawApiUrl || 'http://127.0.0.1:8000')
).replace(/\/$/, '');
const API_BASE = `${VITE_API_URL}/api/v1`;

let currentAuthToken = null;

export function setAuthToken(token) {
  currentAuthToken = token;
}

export function getAuthToken() {
  return currentAuthToken;
}

function parseErrorMessage(errorJson, statusText) {
  if (!errorJson) return statusText || 'An error occurred';
  if (typeof errorJson === 'string') return errorJson;

  // Handle FastAPI / Pydantic validation error array
  if (Array.isArray(errorJson.detail)) {
    return errorJson.detail
      .map((e) => {
        const field = e.loc && e.loc.length > 1 ? e.loc.slice(1).join('.') : null;
        return field ? `${field}: ${e.msg}` : e.msg || JSON.stringify(e);
      })
      .join('; ');
  }

  if (typeof errorJson.detail === 'string') {
    return errorJson.detail;
  }

  if (errorJson.message) return errorJson.message;
  return JSON.stringify(errorJson);
}

async function request(url, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Automatically attach Bearer token if available
  if (currentAuthToken) {
    headers['Authorization'] = `Bearer ${currentAuthToken}`;
  }

  const config = {
    ...options,
    headers,
  };

  let response;
  try {
    response = await fetch(url, config);
  } catch (netErr) {
    throw new Error(
      `Unable to reach backend server at ${url}. Please ensure the FastAPI server is running.`
    );
  }

  if (!response.ok) {
    let errorDetail = 'An error occurred';
    try {
      const errorJson = await response.json();
      errorDetail = parseErrorMessage(errorJson, response.statusText);
    } catch {
      errorDetail = response.statusText;
    }
    const err = new Error(errorDetail);
    err.status = response.status;
    throw err;
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

/**
 * Format frontend petData into PetCreate schema payload for backend
 */
export function formatPetForApi(petData) {
  return {
    owner: {
      name: (petData.ownerName || '').trim(),
      contact: (petData.ownerContact || '').trim(),
      aadhar: petData.ownerAadhar ? petData.ownerAadhar.trim() || null : null,
      address: (petData.address || '').trim(),
    },
    species: petData.species,
    name: (petData.name || '').trim(),
    breed: (petData.breed || '').trim(),
    dob: petData.dob,
    place: (petData.place || '').trim(),
    height: parseFloat(petData.height) || 0,
    weight: parseFloat(petData.weight) || 0,
    gender: petData.gender,
    health: {
      grooming: (petData.grooming || '').trim() || null,
      routine: (petData.checkupRoutine || '').trim() || null,
      last_visit: petData.lastVisit ? petData.lastVisit.trim() || null : null,
    },
    vaccines: Array.isArray(petData.vaccines) ? petData.vaccines : [],
    allergies: Array.isArray(petData.allergies) ? petData.allergies : [],
    diseases: Array.isArray(petData.diseases) ? petData.diseases : [],
    medications: Array.isArray(petData.medications) ? petData.medications : [],
    food: Array.isArray(petData.food) ? petData.food : [],
  };
}

/**
 * Format backend PetDetailResponse into frontend petData form state
 */
export function formatApiForPet(apiPet) {
  return {
    species: apiPet.species || '',
    name: apiPet.name || '',
    breed: apiPet.breed || '',
    dob: apiPet.dob ? String(apiPet.dob).split('T')[0] : '',
    place: apiPet.place || '',
    gender: apiPet.gender || '',
    height: apiPet.height != null ? String(apiPet.height) : '',
    heightUnit: 'cm',
    weight: apiPet.weight != null ? String(apiPet.weight) : '',
    weightUnit: 'kg',
    ownerName: apiPet.owner?.name || '',
    ownerContact: apiPet.owner?.contact || '',
    ownerAadhar: apiPet.owner?.aadhar || '',
    address: apiPet.owner?.address || '',
    vaccines: Array.isArray(apiPet.vaccines) ? [...apiPet.vaccines] : [],
    allergies: Array.isArray(apiPet.allergies) ? [...apiPet.allergies] : [],
    diseases: Array.isArray(apiPet.diseases) ? [...apiPet.diseases] : [],
    medications: Array.isArray(apiPet.medications) ? [...apiPet.medications] : [],
    food: Array.isArray(apiPet.food) ? [...apiPet.food] : [],
    grooming: apiPet.health?.grooming || '',
    checkupRoutine: apiPet.health?.routine || '',
    lastVisit: apiPet.health?.last_visit ? String(apiPet.health.last_visit).split('T')[0] : '',
    documents: Array.isArray(apiPet.documents)
      ? apiPet.documents.map((d) => ({
          id: d.id,
          key:
            d.document_type === 'Birth Certificate'
              ? 'birthCert'
              : d.document_type === 'Vaccination Record'
              ? 'vaccinationRecord'
              : d.document_type === 'Insurance Policy'
              ? 'insurancePolicy'
              : d.id,
          title: d.document_type,
          name: d.original_filename,
          size:
            d.file_size > 1024 * 1024
              ? `${(d.file_size / (1024 * 1024)).toFixed(1)} MB`
              : `${Math.round(d.file_size / 1024)} KB`,
          uploaded: true,
          previewUrl: null,
        }))
      : [],
  };
}

export const api = {
  setAuthToken,
  getAuthToken,

  // ── Auth Endpoints ─────────────────────────────────────────────────────────
  async loginAdmin(username, password) {
    return request(`${API_BASE}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  async getCurrentAdmin() {
    return request(`${API_BASE}/auth/me`);
  },

  // ── Public Pet Creation ───────────────────────────────────────────────────
  async createPet(petData) {
    const payload = formatPetForApi(petData);
    return request(`${API_BASE}/pets`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // ── Protected Pet CRUD ────────────────────────────────────────────────────
  async getPets({ search = '', species = '', gender = '', limit = 50, offset = 0 } = {}) {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (species) params.append('species', species);
    if (gender) params.append('gender', gender);
    if (limit) params.append('limit', limit);
    if (offset) params.append('offset', offset);

    const query = params.toString();
    const url = `${API_BASE}/pets${query ? `?${query}` : ''}`;
    return request(url);
  },

  async getPet(petId) {
    return request(`${API_BASE}/pets/${petId}`);
  },

  async updatePet(petId, petData) {
    const payload = formatPetForApi(petData);
    return request(`${API_BASE}/pets/${petId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  async deletePet(petId) {
    return request(`${API_BASE}/pets/${petId}`, {
      method: 'DELETE',
    });
  },

  // ── Documents ─────────────────────────────────────────────────────────────
  async uploadDocument(petId, documentType, file) {
    const formData = new FormData();
    formData.append('document_type', documentType);
    formData.append('file', file);

    const headers = {};
    if (currentAuthToken) {
      headers['Authorization'] = `Bearer ${currentAuthToken}`;
    }

    let response;
    try {
      response = await fetch(`${API_BASE}/pets/${petId}/documents`, {
        method: 'POST',
        headers,
        body: formData,
      });
    } catch (netErr) {
      throw new Error(
        `Unable to reach backend server for upload. Please ensure the FastAPI server is running.`
      );
    }

    if (!response.ok) {
      let errorDetail = 'Upload failed';
      try {
        const errorJson = await response.json();
        errorDetail = parseErrorMessage(errorJson, response.statusText);
      } catch {
        errorDetail = response.statusText;
      }
      const err = new Error(errorDetail);
      err.status = response.status;
      throw err;
    }

    return response.json();
  },

  async deleteDocument(documentId) {
    return request(`${API_BASE}/documents/${documentId}`, {
      method: 'DELETE',
    });
  },

  getDocumentUrl(documentId) {
    return `${API_BASE}/documents/${documentId}`;
  },

  async getDocumentBlob(documentId) {
    const headers = {};
    if (currentAuthToken) {
      headers['Authorization'] = `Bearer ${currentAuthToken}`;
    }
    const response = await fetch(`${API_BASE}/documents/${documentId}`, { headers });
    if (!response.ok) {
      throw new Error(`Failed to load document (${response.statusText})`);
    }
    return response.blob();
  },

  // ── Protected Admin Endpoints ─────────────────────────────────────────────
  async getAdminDashboard() {
    return request(`${API_BASE}/admin/dashboard`);
  },

  async getAdminSegments() {
    return request(`${API_BASE}/admin/segments`);
  },

  async getAdminPets({
    search = '',
    species = '',
    gender = '',
    category_type = '',
    category_value = '',
    limit = 20,
    offset = 0,
  } = {}) {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (species) params.append('species', species);
    if (gender) params.append('gender', gender);
    if (category_type) params.append('category_type', category_type);
    if (category_value) params.append('category_value', category_value);
    if (limit) params.append('limit', limit);
    if (offset != null) params.append('offset', offset);

    const query = params.toString();
    const url = `${API_BASE}/admin/pets${query ? `?${query}` : ''}`;
    return request(url);
  },
};

export default api;
