import axios from 'axios';

// Base URL configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Donor API
export const donorAPI = {
  register: async (donorData) => {
    const response = await axios.post(`${API_URL}/donors`, donorData);
    return response.data;
  },

  getBloodDonors: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await axios.get(`${API_URL}/donors/blood?${params}`);
    return response.data;
  },

  getOrganDonors: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await axios.get(`${API_URL}/donors/organ?${params}`);
    return response.data;
  },

  getDonorById: async (id) => {
    const response = await axios.get(`${API_URL}/donors/${id}`);
    return response.data;
  },

  updateDonor: async (id, donorData) => {
    const response = await axios.put(`${API_URL}/donors/${id}`, donorData);
    return response.data;
  },

  deleteDonor: async (id) => {
    const response = await axios.delete(`${API_URL}/donors/${id}`);
    return response.data;
  }
};

// Admin API
export const adminAPI = {
  getAllDonors: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await axios.get(`${API_URL}/admin/donors?${params}`);
    return response.data;
  },

  getAllUsers: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await axios.get(`${API_URL}/admin/users?${params}`);
    return response.data;
  },

  getStats: async () => {
    const response = await axios.get(`${API_URL}/admin/stats`);
    return response.data;
  },

  updateUserRole: async (userId, role) => {
    const response = await axios.put(`${API_URL}/admin/users/${userId}/role`, { role });
    return response.data;
  }
};

// Blood groups
export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// Organs
export const ORGANS = [
  'Kidney',
  'Liver',
  'Heart',
  'Lungs',
  'Pancreas',
  'Cornea',
  'Skin',
  'Bone Marrow'
];

// Urgency levels
export const URGENCY_LEVELS = [
  { value: 'Critical', label: 'Critical', color: '#dc2626' },
  { value: 'Urgent', label: 'Urgent', color: '#ea580c' },
  { value: 'Moderate', label: 'Moderate', color: '#ca8a04' },
  { value: 'Low', label: 'Low', color: '#16a34a' }
];

// Organ request status
export const REQUEST_STATUS = [
  'Pending',
  'In Progress',
  'Matched',
  'Completed',
  'Cancelled'
];

// Donor types
export const DONOR_TYPES = [
  { value: 'blood', label: 'Blood Donor' },
  { value: 'organ', label: 'Organ Donor' },
  { value: 'both', label: 'Both' }
];

// Genders
export const GENDERS = ['Male', 'Female', 'Transgender'];

// Organ Request API
export const organRequestAPI = {
  create: async (requestData) => {
    const response = await axios.post(`${API_URL}/organ-requests`, requestData);
    return response.data;
  },

  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await axios.get(`${API_URL}/organ-requests?${params}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await axios.get(`${API_URL}/organ-requests/${id}`);
    return response.data;
  },

  update: async (id, requestData) => {
    const response = await axios.put(`${API_URL}/organ-requests/${id}`, requestData);
    return response.data;
  },

  delete: async (id) => {
    const response = await axios.delete(`${API_URL}/organ-requests/${id}`);
    return response.data;
  },

  getStats: async () => {
    const response = await axios.get(`${API_URL}/organ-requests/stats`);
    return response.data;
  }
};

// Location API
export const locationAPI = {
  getAll: async () => {
    const response = await axios.get(`${API_URL}/locations`);
    return response.data;
  },

  getDonorsByLocation: async (city, filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await axios.get(`${API_URL}/locations/${city}/donors?${params}`);
    return response.data;
  },

  getStats: async () => {
    const response = await axios.get(`${API_URL}/locations/stats`);
    return response.data;
  },

  add: async (locationData) => {
    const response = await axios.post(`${API_URL}/locations`, locationData);
    return response.data;
  },

  update: async (id, locationData) => {
    const response = await axios.put(`${API_URL}/locations/${id}`, locationData);
    return response.data;
  },

  delete: async (id) => {
    const response = await axios.delete(`${API_URL}/locations/${id}`);
    return response.data;
  }
};

// Geolocation utilities
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  });
};

// Calculate distance between two coordinates
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of Earth in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
};

const toRad = (value) => {
  return value * Math.PI / 180;
};
