
// Get token from localStorage (or wherever you store it)
const getToken = () => {
    return localStorage.getItem("token");
};

// Header for GET / normal requests
export const authHeader = () => {
    const token = getToken();

    return {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
    };
};

// Header for POST / form-data requests
export const authHeaderToPost = () => {
    const token = getToken();

    return {
        Authorization: token ? `Bearer ${token}` : "",
    };
};

// Common API response handler
export const handleResponse = async (response) => {
    const contentType = response.headers.get("content-type");

    let data;

    if (contentType && contentType.includes("application/json")) {
        data = await response.json();
    } else {
        data = await response.text();
    }

    if (!response.ok) {
        const error = data?.message || response.statusText;
        return Promise.reject(error);
    }

    return data;
};