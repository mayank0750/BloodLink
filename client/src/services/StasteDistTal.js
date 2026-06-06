export const LocationService = {
  getStates,
  getDistricts,
  getTalukas
};

function getStates() {
  return fetch(
    'https://www.india-location-hub.in/api/locations/states'
  ).then(res => res.json());
}

function getDistricts(stateId) {
  return fetch(
    `https://www.india-location-hub.in/api/locations/districts?state_id=${stateId}`
  ).then(res => res.json());
}

function getTalukas(districtId) {
  return fetch(
    `https://www.india-location-hub.in/api/locations/talukas?district_id=${districtId}`
  ).then(res => res.json());
}