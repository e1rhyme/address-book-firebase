import View from "./view.js";
import manageContactView from "./manageContactView.js";
import displayContactView from "./displayContactView.js";

class ContactsView extends View {
  _contactDetails;
  _menu = document.querySelector(".menu");
  _overlay = document.querySelector(".overlay");
  _landing = document.querySelector(".landing");
  _parentEl = document.querySelector(".contacts");
  _addressBook = document.querySelector(".address-book");
  _sidebar = document.querySelector(".side-bar-container");
  _contactsContainer = document.querySelector(".contacts-container");
  _mediaQuery = window.matchMedia("(max-width: 1021px)");
  _floatingMenu = document.querySelector(".mobile-side-bar-container");

  // Call fnxs on page load
  constructor() {
    super();
    this._hideFloadtingMenu();
    this._showMenu(true);
    this._setElementsVisibility();
  }

  // Retrieve contacts object
  getThisData(data) {
    // Remove objects'reference IDs
    this._data = Object.entries(data).map((rec) => rec.slice(1));
    // Create array of contacts' IDs
    this._contactIdList = Object.keys(this._data);
  }
  // Set markup for display of contacts
  _getMarkup() {
    return this._data
      .map((rec, i) => this._generateMarkupPreview(rec, i, this._contactIdList))
      .join("");
  }
  // Contacts listing of brief profile
  _generateMarkupPreview(rec, i, contactId) {
    return `
      <tr id="${contactId[i]}">
        <td data-title="SN">${i + 1}.</td>
        <td data-title="Checkbox">
           <input class="icon--checkbox hidden" type="checkbox" />
        </td>
        <td>
          <div class="contact-name">
            <img class="contact--profile-img" data-title="Image" src="${
              rec[0].profileImage
            }"/>
              <p data-title="Name">${rec[0].firstName} ${rec[0].lastName}</p>
          </div>
        </td>
        <td data-title="Phone Number">${rec[0].phoneNumber}</td>
        <td data-title="Email Address">${rec[0].emailAddress}</td>
        <td data-title="Action">
            <div class="manage-contact">
              <div class="edit-delete-icons">
                <svg class="contacts--edit-icon" data-action="edit"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 -960 960 960">
                <path
                  d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h357l-80 80H200v560h560v-278l80-80v358q0 33-23.5 56.5T760-120H200Zm280-360ZM360-360v-170l367-367q12-12 27-18t30-6q16 0 30.5 6t26.5 18l56 57q11 12 17 26.5t6 29.5q0 15-5.5 29.5T897-728L530-360H360Zm481-424-56-56 56 56ZM440-440h56l232-232-28-28-29-28-231 231v57Zm260-260-29-28 29 28 28 28-28-28Z"
                  />
                </svg>
                <svg class="contacts--delete-icon" data-action="delete" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="m376-300 104-104 104 104 56-56-104-104 104-104-56-56-104 104-104-104-56 56 104 104-104 104 56 56Zm-96 180q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520Zm-400 0v520-520Z"/></svg>
              </div>
              <div class="delete-contact-container-${contactId[i]} hidden" 
              data-id="${contactId[i]}">
                <button class="confirm-btn-${
                  contactId[i]
                }">Confrim delete</button>
                <button class="cancel-btn-${contactId[i]}">Cancel</button>
              </div>
            </div>
	        </td>
        </tr>
      `;
  }
  // Hide floating menu if visible and media width > 1021px
  _hideFloadtingMenu() {
    if (!this._mediaQuery.matches) {
      this._floatingMenu.classList.add("hidden");
    }
  }
  // Show or hide sidebar
  _showMenu(state) {
    this._menu.addEventListener("click", (e) => {
      e.stopImmediatePropagation();

      if (!this._mediaQuery.matches) {
        if (state) {
          this._sidebar.classList.add("hidden");
          this._contactsContainer.style.gridColumn = "span 2";
          state = false;
        } else {
          this._sidebar.classList.remove("hidden");
          this._contactsContainer.style.gridColumn = "span 1";

          state = true;
        }
      } else {
        this._floatingMenu.classList.remove("hidden");

        document.addEventListener("click", (e) => {
          e.stopImmediatePropagation();
          if (
            !this._floatingMenu.contains(e.target) &&
            !this._menu.contains(e.target)
          ) {
            this._floatingMenu.classList.add("hidden");
          }
        });
      }
    });
  }
  // Set elements visiblity via toggle property
  _setElementsVisibility(condition, status) {
    // Element visibility request from load contacts
    if (status === "load") this._setElVisibilityOnLoad(condition);
    // Element visibility request from create contact
    else if (status === "create") this._setElVisibilityOnCreateContact();
  }
  // Set element visibility for contact load request
  _setElVisibilityOnLoad(condition) {
    // No contact exists
    if (!condition) {
      this._landing.classList.remove("hidden");
      this._addressBook.classList.add("hidden");
    } // Contacts exist
    else if (condition) {
      this._landing.classList.add("hidden");
      this._addressBook.classList.remove("hidden");
    }
  }
  // Set element visiblity for create contact request
  _setElVisibilityOnCreateContact() {
    this._landing.classList.add("hidden");
    this._addressBook.classList.remove("hidden");
  }
  // Extract contact's details from object using the ID
  _getContactDetails(id) {
    const dataObj = Object.entries(this._contactsObject);
    console.log(dataObj);

    for (let i = 0; i < dataObj.length; i++) {
      if (dataObj[i][0] === id) {
        // Parse contact details to generate markup
        this._contactDetails = displayContactView._getMarkup(dataObj[i][1]);
        // Display selected contact's details
        manageContactView._displayContactDetails(dataObj[i][1], id);
        return;
      }
    }
  }
}

export default new ContactsView();
