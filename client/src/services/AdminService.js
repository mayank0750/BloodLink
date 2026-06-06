import {
    authHeader,
    authHeaderToPost,
    handleResponse,
} from "./api2";

const API_URL = import.meta.env.ORGAN_URL || 'http://localhost:3000';

export const AdminService = {
    getAllDonors,
    getAllUsers,
    getStats,
};

function getAllDonors(filters = {}) {
  const params = new URLSearchParams(filters).toString();

  const requestOptions = {
    method: "GET",
    headers: authHeaderToPost(),
  };

  return fetch(
    `${API_URL}/api/admin/donors?${params}`,
    requestOptions
  ).then(handleResponse);
}

function getAllUsers(filters = {}) {
  const params = new URLSearchParams(filters).toString();

  const requestOptions = {
    method: "GET",
    headers: authHeaderToPost(),
  };

  return fetch(
    `${API_URL}/api/admin/users?${params}`,
    requestOptions
  ).then(handleResponse);
}

function getStats() {
    const requestOptions = {
        method: "GET",
        headers: authHeaderToPost(),
    };

    return fetch(
        `${API_URL}/api/admin/stats`,
        requestOptions
    ).then(handleResponse);
}
