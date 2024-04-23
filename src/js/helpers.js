import { TIMEOUT_SEC } from "./config";

// Timeout function for async functions
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};
// AJAX handler
export const AJAX = async function (url, contactData = undefined) {
  try {
    const getContact = contactData
      ? fetch(url, {
          method: "POST",
          body: JSON.stringify(contactData),
          headers: {
            "Content-Type": "application/json",
          },
        })
      : fetch(url);

    // Using Promise.race to prevent an infinite fetch call
    const res = await Promise.race([getContact, timeout(TIMEOUT_SEC)]);
    // Consume the proise
    const data = await res.json();
    // Check if fetch call was successful
    if (!res.ok) throw new Error(`${data.message} ${res.status}`);

    return data;
  } catch (err) {
    throw err;
  }
};
//Check if value is an object
export const isObject = function (value) {
  return value !== null && typeof value === "object";
};
