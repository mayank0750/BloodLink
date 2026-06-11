import {
    authHeader,
    authHeaderToPost,
    handleResponse,
} from "./api2";

const API_URL = import.meta.env.ORGAN_URL || 'http://localhost:3000';

export const OrganService = {
    CreateOrganRequest,
    getAll,
    getById,
    updateData,
    deleteRequest,
};

function CreateOrganRequest(values) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  };

  return fetch(
    `${API_URL}/api/organ-requests`,
    requestOptions
  ).then(handleResponse);
}

function getAll(filters = {}) {
  const params = new URLSearchParams(filters).toString();

  const requestOptions = {
    method: "GET",
    headers: authHeaderToPost(),
  };

  return fetch(
    `${API_URL}/api/organ-requests?${params}`,
    requestOptions
  ).then(handleResponse);
}

// Get By Id
function getById(id) {
  const requestOptions = {
    method: "GET",
    headers: authHeaderToPost(),
  };

  return fetch(
    `${API_URL}/api/organ-requests/${id}`,
    requestOptions
  ).then(handleResponse);
}

// Update
function updateData(id, requestData) {
  const requestOptions = {
    method: "PUT",
    headers: {
      ...authHeaderToPost(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestData),
  };

  return fetch(
    `${API_URL}/api/organ-requests/${id}`,
    requestOptions
  ).then(handleResponse);
}

// Delete
function deleteRequest(id) {
  const requestOptions = {
    method: "DELETE",
    headers: authHeaderToPost(),
  };

  return fetch(
    `${API_URL}/api/organ-requests/${id}`,
    requestOptions
  ).then(handleResponse);
}
