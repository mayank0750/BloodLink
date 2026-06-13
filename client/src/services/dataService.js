// Blood groups
export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

// Organs
export const ORGANS = [
  "Kidney",
  "Liver",
  "Heart",
  "Lungs",
  "Pancreas",
  "Cornea",
  "Skin",
  "Bone Marrow",
];

// Urgency levels
export const URGENCY_LEVELS = [
  { value: "Critical", label: "Critical", color: "#dc2626" },
  { value: "Urgent", label: "Urgent", color: "#ea580c" },
  { value: "Moderate", label: "Moderate", color: "#ca8a04" },
  { value: "Low", label: "Low", color: "#16a34a" },
];

// Organ request status
export const REQUEST_STATUS = [
  "Pending",
  "In Progress",
  "Matched",
  "Completed",
  "Cancelled",
];

// Donor types
export const DONOR_TYPES = [
  { value: "blood", label: "Blood Donor" },
  { value: "organ", label: "Organ Donor" },
  { value: "both", label: "Both" },
];

// Genders
export const GENDERS = ["Male", "Female", "Transgender"];

// Geolocation utilities
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      },
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
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
};

const toRad = (value) => {
  return (value * Math.PI) / 180;
};
