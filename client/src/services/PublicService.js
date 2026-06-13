import {
    authHeader,
    authHeaderToPost,
    handleResponse,
} from "./HandleService";

const API_URL = import.meta.env.VITE_API_URL;

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
 