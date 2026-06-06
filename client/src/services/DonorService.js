import {
    authHeader,
    authHeaderToPost,
    handleResponse,
} from "./api2";

const API_URL = import.meta.env.DONOR_URL || 'http://localhost:3000';

export const DonorService = {
    SaveDonor,
    getBloodDonors,
    getOrganDonors,
    getDonorById,
    updateDonor,
    deleteDonor,
};

function SaveDonor(values) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  };

  return fetch(
    `${API_URL}/api/donors`,
    requestOptions
  ).then(handleResponse);
}

function getBloodDonors(filters = {}) {
    const params = new URLSearchParams(filters).toString();

    const requestOptions = {
        method: "GET",
        headers: authHeaderToPost(),
    };

    return fetch(
        `${API_URL}/api/donors/blood${params ? `?${params}` : ""}`,
        requestOptions
    ).then(handleResponse);
}

function getOrganDonors(filters = {}) {
    const params = new URLSearchParams(filters).toString();

    const requestOptions = {
        method: "GET",
        headers: authHeaderToPost(),
    };

    return fetch(
        `${API_URL}/api/donors/organ${params ? `?${params}` : ""}`,
        requestOptions
    ).then(handleResponse);
}

function getDonorById(id) {
    const requestOptions = {
        method: "GET",
        headers: authHeaderToPost(),
    };

    return fetch(
        `${API_URL}/api/donors/${id}`,
        requestOptions
    ).then(handleResponse);
}

function updateDonor(id, donorData) {
    const requestOptions = {
        method: "PUT",
        headers: authHeaderToPost(),
        body: JSON.stringify(donorData),
    };

    return fetch(
        `${API_URL}/api/donors/${id}`,
        requestOptions
    ).then(handleResponse);
}

function deleteDonor(id) {
    const requestOptions = {
        method: "DELETE",
        headers: authHeaderToPost(),
    };

    return fetch(
        `${API_URL}/api/donors/${id}`,
        requestOptions
    ).then(handleResponse);
}