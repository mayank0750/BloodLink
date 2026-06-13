import {
    authHeader,
    authHeaderToPost,
    handleResponse,
} from "./HandleService";

const API_URL = import.meta.env.VITE_MESSAGING_URL;

export const MessageService = {
    sendMessage,
    getAllMessages,
    deleteMessage
};

function sendMessage(values) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  };

  return fetch(
    `${API_URL}/api/messaging`,
    requestOptions
  ).then(handleResponse);
}

function getAllMessages() {
    const requestOptions = {
        method: "GET",
        headers: authHeader(),
    };

    return fetch(
        `${API_URL}/api/messaging/all`,
        requestOptions
    ).then(handleResponse);
}

function deleteMessage(id) {
    const requestOptions = {
        method: "DELETE",
        headers: authHeader(),
    };

    return fetch(
        `${API_URL}/api/messaging/delete/${id}`,
        requestOptions
    ).then(handleResponse);
    };  