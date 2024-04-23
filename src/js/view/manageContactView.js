import View from "./view.js";
import * as Elements from "../config.js";
import contactsView from "./contactsView.js";
import newContactView from "./newContactView.js";

class ManageContactView extends View {
  _target;
  _editBtn;
  _editIcon;
  _targetEl;
  _contentEl;
  _datasetTarget;
  _editBtnParent;
  _targetContainer;
  _parentEl = document.querySelector(".contacts");
  _addContactWindow = document.querySelector(".add-contact-window");

  constructor() {
    super();
    this._readEl();
    this._readEditIcon();
    this._contactsEditIcon();
  }

  // Retrieve contacts object
  getThisData(data) {
    // Create array from object
    if (!Array.isArray(data)) this._data = Object.entries(data);
    // this._data = Object.entries(data).map((rec) => rec.slice(1));

    // Create array of contacts' IDs
    this._contactIdList = Object.entries(data).map((rec) => rec.shift());
  }
  // Read in element to get contact number
  _readEl() {
    this._contentEl = document.querySelector(".contacts");
  }
  // Store required element's detail for future use
  _readEditIcon() {
    this._editBtnParent = document.querySelector(".new--contact-window");

    this._editBtnParent.addEventListener("mouseover", () => {
      this._editIcon = document.querySelector("#display-edit--icon");
    });
  }
  // Display selected contact details for editing
  _editContact(id, contact) {
    this._editBtnParent.addEventListener("mouseover", () => {
      this._editIcon.addEventListener("click", (e) => {
        e.stopImmediatePropagation();

        const targetEl = e.target.closest("contact--profile-img");

        newContactView._newContactContainer.classList.remove("hidden");
        document.querySelector(".upload__btn").classList.add("hidden");
        document.querySelector(".update__btn").classList.remove("hidden");

        // If the expandLess/ showLess icons are active, reset them on contact edit load
        this._expandLessShowLess();

        newContactView._escKeyPress();
      });
      this._contactId = id;

      this._displayContactDetails(contact, this._contactId);
    });
  }
  // Display selected contact details for editing
  _contactsEditIcon() {
    this._parentEl.addEventListener("mouseover", (e) => {
      this._targetContainer = e.target.closest("tr");
      this._contactId = this._targetContainer.id;

      this._targetContainer
        ? this._targetContainer.addEventListener("mouseover", (e) => {
            this._targetEl = e.target.closest(".contacts--edit-icon");

            if (!this._targetEl) return;
            else {
              const identifier = this._targetEl.dataset["action"];
              identifier === "edit"
                ? this._targetEl.addEventListener("click", (e) => {
                    e.stopImmediatePropagation();

                    newContactView._newContactContainer.classList.remove(
                      "hidden"
                    );
                    document
                      .querySelector(".upload__btn")
                      .classList.add("hidden");
                    document
                      .querySelector(".update__btn")
                      .classList.remove("hidden");

                    newContactView._escKeyPress();
                    this._expandLessShowLess();

                    contactsView._getContactDetails(this._contactId);
                  })
                : null;
            }
          })
        : null;
    });
  }
  _contactsDeleteAll() {}
  // Cancel delete action
  _cancleDeleteAction(id, target) {
    this._parentEl.addEventListener("mouseover", (e) => {
      e.stopImmediatePropagation();

      this._cancelDelete = document.querySelector(`.cancel-btn-${id}`);

      this._cancelDelete
        ? this._cancelDelete.addEventListener("click", (e) => {
            e.stopImmediatePropagation();
            target.style.display = "none";
            // Make edit and delete icon container visible
            document.querySelector(".edit-delete-icons").style.display = "flex";
          })
        : null;

      return;
    });
    return;
  }
  // Dynyamicall set elmeents styles when needed
  _setButtonsElementStyle(confirm, cancel) {
    confirm.addEventListener("mouseover", () => {
      confirm.style.transform = "scale(1.1)";
    });
    confirm.addEventListener("mouseout", () => {
      confirm.style.transform = "scale(1)";
    });

    cancel.addEventListener("mouseover", () => {
      cancel.style.transform = "scale(1.1)";
    });
    cancel.addEventListener("mouseout", () => {
      cancel.style.transform = "scale(1)";
    });

    if (!confirm) return;
    else {
      confirm.style.width = "5rem";
      confirm.style.color = "#fff";
      confirm.style.height = "3.5rem";
      confirm.style.borderRadius = "0.5rem";
      confirm.style.boxShadow = "2px 3px 5px rgba(0, 0, 0, 0.25)";
      confirm.style.border = "1px solid var(--color-accent)";
      confirm.style.backgroundColor = "var(--color-accent)";
    }
    if (!cancel) return;
    else {
      cancel.style.width = "5rem";
      cancel.style.color = "#fff";
      cancel.style.height = "3.5rem";
      cancel.style.borderRadius = "0.5rem";
      cancel.style.boxShadow = "2px 3px 5px rgba(0, 0, 0, 0.25)";
      cancel.style.border = "1px solid var(--color-secondary)";
      cancel.style.backgroundColor = "var(--color-secondary)";
    }
  }
  _setDeleteContactContainerStyle(el) {
    el.style.gap = "1rem";
    el.style.display = "flex";
    el.style.padding = "1.5rem";
    el.style.fontSize = "1rem";
    el.style.position = "relative";
    el.style.alignItems = "center";
    el.style.borderRadius = "0.5rem";
    el.style.justifyContent = "center";
  }
  _setTrMouseoverState(id, tr) {
    const target = document.querySelector(`.delete-contact-container-${id}`);

    if (tr.id === id) {
      tr.addEventListener("mouseleave", () => {
        if (target.classList.contains("hidden")) return;
        else {
          target.style.display = "none";
          // Make edit and delete icon container visible
          document.querySelector(".edit-delete-icons").style.display = "flex";
        }
      });
    }
  }
  // Parse the contact's records into the input fields
  _displayContactDetails(profile, id) {
    Elements.prefix.value = profile.prefix;
    Elements.firstName.value = profile.firstName;
    Elements.middleName.value = profile.middleName;
    Elements.lastName.value = profile.lastName;
    Elements.suffix.value = profile.suffix;
    Elements.dateOfBirth.value = profile.dateOfBirth;
    Elements.emailAddress.value = profile.emailAddress;
    Elements.website.value = profile.website;
    Elements.facebook.value = profile.facebook;
    Elements.instagram.value = profile.instagram;
    Elements.x.value = profile.x;
    Elements.tiktok.value = profile.tiktok;
    Elements.pinterest.value = profile.pinterest;
    Elements.linkedIn.value = profile.linkedIn;
    Elements.youtube.value = profile.youtube;
    Elements.snapchat.value = profile.snapchat;
    Elements.prefix.value = profile.prefix;
    Elements.profileImg.src = profile.profileImage;

    this._addContactWindow.dataset.contactid = id;
  }
  // Set visiblity of elements if already active
  _expandLessShowLess() {
    if (!Elements.expandLess.classList.contains("hidden")) {
      Elements.prefixContainer.classList.toggle("extra");
      Elements.middleNameContainer.classList.toggle("extra");
      Elements.suffixContainer.classList.toggle("extra");
      Elements.expandMore.classList.toggle("hidden");
      Elements.expandLess.classList.toggle("hidden");
    }

    if (!Elements.showLess.classList.contains("hidden")) {
      Elements.socialInfo.classList.toggle("extra");
      Elements.showMore.classList.toggle("hidden");
      Elements.showLess.classList.toggle("hidden");
    }
  }
  // Listen to click event of select contact and retrieve phone number
  addHandlerGetNumber(handler, number) {
    this._contentEl.addEventListener("click", (e) => {
      e.stopImmediatePropagation();

      const targetEl = e.target.closest("tr");

      for (let i = 0; i < this._data.length; i++) {
        if (
          this._data[i][1].phoneNumber === null ||
          this._data[i][1].phoneNumber === undefined
        )
          return;
        else if (this._data[i][0] === targetEl.id) {
          number = this._data[i][1].phoneNumber;

          return handler(number);
        }
      }
    });
  }
  addHandlerUpdateContact(handler) {
    document.querySelector(".update__btn").addEventListener("click", (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();

      // Create an object of entered values
      const contactUpdate = {
        profileImage: Elements.profileImg.src,
        prefix: Elements.prefix.value ? Elements.prefix.value : "",
        firstName: Elements.firstName.value,
        middleName: Elements.middleName.value ? Elements.middleName.value : "",
        lastName: Elements.lastName.value,
        suffix: Elements.suffix.value ? Elements.suffix.value : "",
        dateOfBirth: Elements.dateOfBirth.value,
        emailAddress: Elements.emailAddress.value
          ? Elements.emailAddress.value
          : "",
        website: Elements.website.value ? Elements.website.value : "",
        facebook: Elements.facebook.value ? Elements.facebook.value : "",
        instagram: Elements.instagram.value ? Elements.instagram.value : "",
        x: Elements.x.value ? Elements.x.value : "",
        tiktok: Elements.tiktok.value ? Elements.tiktok.value : "",
        pinterest: Elements.pinterest.value ? Elements.pinterest.value : "",
        linkedIn: Elements.linkedIn.value ? Elements.linkedIn.value : "",
        youtube: Elements.youtube.value ? Elements.youtube.value : "",
        snapchat: Elements.snapchat.value ? Elements.snapchat.value : "",
      };
      const id = document.querySelector(".add-contact-window").dataset
        .contactid;

      handler(id, contactUpdate);
    });
  }
}

export default new ManageContactView();
