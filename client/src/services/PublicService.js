import {
    authHeader,
    authHeaderToPost,
    handleResponse,
} from "./api2";

const API_URL = import.meta.env.VITE_MESSAGING_URL || 'http://localhost:3000';

export const PublicService = {
    GetDonorNumber,
    GetDonorReqNumber
};

function GetDonorNumber() {
    const requestOptions = {
        method: "GET",
        headers: {
      "Content-Type": "application/json",
    }
    };

    return fetch(
        `${API_URL}/api/donors/public`,
        requestOptions
    ).then(handleResponse);
}

function GetDonorReqNumber() {
    const requestOptions = {
        method: "GET",
        headers: {
      "Content-Type": "application/json",
    }
    };

    return fetch(
        `${API_URL}/api/organ-requests/public-stats`,
        requestOptions
    ).then(handleResponse);
}
 