import { AJAX } from "./helpers";
import { DB_URL, RES_PER_PAGE, countryCode } from "/src/js/config.js";

let contacts = [],
  contactsPreEdit = [];

// State object: holds all contacts' info
export const state = {
  contacts: {},
  search: {
    query: "",
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  trash: {},
  special: [],
  userID: 1,
};

// Check if stored contacts exist
export const loadAddressBook = async function (handler) {
  try {
    const data = await AJAX(`${DB_URL}`);
    if (!data || Object.keys(data).length === 0) return handler(false);

    // Create an array of retrieved object
    for (let key in data) {
      contactsPreEdit.push({ ...data[key], key });
      for (let i = 0; i < contactsPreEdit.length; i++) {
        contacts[contactsPreEdit[i].id] = contactsPreEdit[i];
      }
    }
    // Get length of contacts object
    const objLength = Object.keys(contacts).length;

    // Get ID of last item in contacts object: update in state
    newUserID(Object.keys(contacts)[objLength - 1]);

    // Pass contacts object to the state
    state.contacts = contacts;

    handler(true);
  } catch (err) {
    throw err;
  }
};
// Resolves default international call code to user's IP
const getIp = function (callback) {
  fetch("https://ipinfo.io/json?token=5d4e92bd7304ea", {
    headers: { Accept: "application/json" },
  })
    .then((resp) => resp.json())
    .catch(() => {
      return {
        country: "us",
      };
    })
    .then((resp) => callback(resp.country));
};
// Load the international code list
function initializeTel() {
  const iti = window.intlTelInput(countryCode, {
    preferredCountries: ["ng", "gb", "us"],
    geoIpLookup: getIp,
    nationalMode: true,
    allowDropdown: false,
    formatOnDisplay: false,
    initialCountry: "auto",
    separateDialCode: false,
    utilsScript:
      "https://cdn.jsdelivr.net/npm/intl-tel-input@19.2.15/build/js/utils.js",
  });
  window.iti = iti;
}
export const getContactNumber = function (number) {
  // Set user account number
  if (window.iti != null || window.iti !== "") {
    window.iti.destroy();
  }
  iti = window.intlTelInput(countryCode, {
    preferredCountries: ["ng", "gb", "us"],
    geoIpLookup: getIp,
    nationalMode: true,
    allowDropdown: false,
    formatOnDisplay: false,
    initialCountry: "auto",
    separateDialCode: false,
    utilsScript:
      "https://cdn.jsdelivr.net/npm/intl-tel-input@19.2.15/build/js/utils.js",
  });
  setTimeout(() => {
    iti.setNumber(number);
  }, 2000);
};
// Set unique user IDs
function newUserID(id) {
  id = id.padStart(3, "0");

  state.userID = (+id + 1).toString();

  // return id;
}
// Save new contact to local storage
export const uploadNewContact = async function (newUser) {
  try {
    // Set user account number
    let phoneNumber = iti.getNumber();
    phoneNumber = phoneNumber ? phoneNumber : "";

    // Check compulsory field has content
    if (newUser.firstName === "" || newUser.firstName.length <= 1) return null;
    else {
      // Set user phone number and profile image path
      newUser.phoneNumber = phoneNumber;
      // Get unique userID
      const id = newUserID(state.userID.toString());

      state.contacts = { id, ...newUser };
      // state.contacts[id] = newUser;

      // Upload new contact to Firebase
      await AJAX(`${DB_URL}`, state.contacts);

      // Upload new contact to local storage
      // localStorage.setItem("myContacts", JSON.stringify(state.contacts));

      return state.contacts;
    }
  } catch (err) {
    throw err;
  }
};
export const updateExistingContact = function (id, contact) {
  // Retrieve contact's phone number
  let phoneNumber = iti.getNumber();
  phoneNumber = phoneNumber ? phoneNumber : "";

  // Add key/ value pair to contact object
  contact.phoneNumber = phoneNumber;

  Object.keys(state.contacts).forEach((key, index, rec) => {
    if (rec[index] === id) {
      state.contacts[rec[index]] = contact;
    } else return;

    // Update existing contact in local storage
    localStorage.setItem("myContacts", JSON.stringify(state.contacts));
  });
};
export const deleteSingleContact = function (id) {
  // Get updated contacts list
  const updatedContacts = Object.entries(state.contacts).filter((objKey) => {
    if (objKey[0] !== id) return objKey;
  });
  // Get deleted contact and store in state object
  const deletedContact = Object.entries(state.contacts).filter((objKey) => {
    if (objKey[0] == id) return objKey;
  });
  // Update contacts trash state object
  state.trash = Object.fromEntries(deletedContact);
  // Update contacts list state object
  state.contacts = Object.fromEntries(updatedContacts);
  // Check if this is last contact deleted
  if (Object.keys(state.contacts).length <= 0) {
    clearLocalStorage();
  }

  // Update contacts list in local storage
  localStorage.setItem("myContacts", JSON.stringify(state.contacts));
};
export const deleteAllContact = function () {
  // state.trash = state.contacts;
  for (var rec in state.contacts) {
    if (state.contacts.hasOwnProperty(rec)) {
      delete state.contacts[rec];
    }
  }

  state.userID = 1;
  clearLocalStorage();
};
// Temp fnx
function clearLocalStorage() {
  localStorage.clear();
}
// clearLocalStorage();

initializeTel();
