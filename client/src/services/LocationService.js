import {
    authHeader,
    authHeaderToPost,
    handleResponse,
} from "./api2";

const API_URL = import.meta.env.ORGAN_URL || 'http://localhost:3000';

export const LocationService = {
    getAll,
    getDonorsByLocation,
    getStats,
    add,
    update,
    deleteLocation
};

function getAll(filters = {}) {
  const params = new URLSearchParams(filters).toString();

  const requestOptions = {
    method: "GET",
    headers: authHeaderToPost(),
  };

  return fetch(
    `${API_URL}/api/locations`,
    requestOptions
  ).then(handleResponse);
}

function getDonorsByLocation(city, filters = {}) {
  const params = new URLSearchParams(filters).toString();

  const requestOptions = {
    method: "GET",
    headers: authHeaderToPost(),
  };

  return fetch(
    `${API_URL}/api/locations/${city}/donors?${params}`,
    requestOptions
  ).then(handleResponse);
}

function getStats() {
    const requestOptions = {
        method: "GET",
        headers: authHeaderToPost(),
    };

    return fetch(
        `${API_URL}/api/locations/stats`,
        requestOptions
    ).then(handleResponse);
}

function add(locationData) {
  const requestOptions = {
    method: "POST",
    headers: authHeaderToPost(),
    body: JSON.stringify(locationData),
  };

  return fetch(
    `${API_URL}/api/locations`,
    requestOptions
  ).then(handleResponse);
}

function update(id, locationData) {
  const requestOptions = {
    method: "PUT",
    headers: authHeaderToPost(),
    body: JSON.stringify(locationData),
  };

  return fetch(
    `${API_URL}/api/locations/${id}`,
    requestOptions
  ).then(handleResponse);
}

function deleteLocation(id) {
  const requestOptions = {
    method: "DELETE",
    headers: authHeaderToPost(),
  };

  return fetch(
    `${API_URL}/api/locations/${id}`,
    requestOptions
  ).then(handleResponse);
}
