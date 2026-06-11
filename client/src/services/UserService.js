import {
    authHeader,
    authHeaderToPost,
    handleResponse,
} from "./api2";

const API_URL = import.meta.env.VITE_MESSAGING_URL || 'http://localhost:3000';

export const UserService = {
    AddRoles,
};

function AddRoles(values) {
  const requestOptions = {
    method: "POST",
    headers: {
            ...authHeaderToPost(),
            "Content-Type": "application/json",
        },
    body: JSON.stringify(values),
  };

  return fetch(
    `${API_URL}/api/users/add-roles`,
    requestOptions
  ).then(handleResponse);
}


