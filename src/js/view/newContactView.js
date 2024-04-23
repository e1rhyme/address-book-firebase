import View from "./view.js";
import * as Elements from "../config.js";
import displayContactView from "./displayContactView.js";
import manageContactView from "./manageContactView.js";

class NewContactView extends View {
  _contactDetails;
  _landing = document.querySelector(".landing");
  _addRecordBtn = document.querySelector(".add-record");
  _newOverlay = document.querySelector(".new--overlay");
  _mediaQuery = window.matchMedia("(max-width: 1021px)");
  _addressBook = document.querySelector(".address-book");
  _parentEl = document.querySelector(".new--contact-window");
  _addContactLink = document.querySelector(".add-contact-link");
  _floatingMenu = document.querySelector(".mobile-side-bar-container");
  _newContactContainer = document.querySelector(".new-contact-container");
  _mobileAddContactLink = document.querySelector(".mobile-add-contact-link");
  // _btnCloseModal = document.querySelector(".btn--close-modal");

  constructor() {
    super();
    this._showMore();
    this._showLess();
    this._addContact();
    this._closeModal();
    this._expandMore();
    this._expandLess();
    this._profileImg();
    this._closeOverlay();
    this._createContact();
    this._newCloseOverlay();
    this._mobileCreateContact();
    this._profileImgContainer();
    // this._cancelMobileCreateContact();
  }

  // Retrieve contacts object
  getThisData(data) {
    // Create array from object
    if (!Array.isArray(data))
      this._data = Object.entries(data).map((rec) => rec.slice(1));

    // Create array of contacts' IDs
    this._contactIdList = Object.entries(data).map((rec) => rec.shift());
  }
  // Display add new contact modal
  _addContact() {
    this._addRecordBtn.addEventListener("click", (e) => {
      e.stopImmediatePropagation();

      this._newContactContainer.classList.remove("hidden");
      document.querySelector(".upload__btn").classList.remove("hidden");
      document.querySelector(".update__btn").classList.add("hidden");
      this._resetFormElements();
      this._escKeyPress();
    });
  }
  // Handler to close modal on click of X
  _closeModal() {
    Elements.closeModal.addEventListener("click", (e) => {
      e.stopImmediatePropagation();

      this._newContactContainer.classList.toggle("hidden");
      this._resetFormElements();
    });
  }
  // Handler to close modal on click of overlay
  _closeOverlay() {
    Elements.overlay.addEventListener("click", (e) => {
      e.stopImmediatePropagation();

      this._newContactContainer.classList.toggle("hidden");
      this._resetFormElements();
    });
  }
  _newCloseOverlay() {
    this._newOverlay.addEventListener("click", (e) => {
      e.stopImmediatePropagation();

      this._newOverlay.classList.add("hidden");
      this._parentEl.classList.add("hidden");
    });
  }
  // Handlers to collapse/ expand name details
  _expandMore() {
    Elements.expandMore.addEventListener("click", (e) => {
      e.stopImmediatePropagation();

      Elements.prefixContainer.classList.toggle("extra");
      Elements.middleNameContainer.classList.toggle("extra");
      Elements.suffixContainer.classList.toggle("extra");
      Elements.expandMore.classList.toggle("hidden");
      Elements.expandLess.classList.toggle("hidden");
    });
  }
  _expandLess() {
    Elements.expandLess.addEventListener("click", (e) => {
      e.stopImmediatePropagation();

      Elements.prefixContainer.classList.toggle("extra");
      Elements.middleNameContainer.classList.toggle("extra");
      Elements.suffixContainer.classList.toggle("extra");
      Elements.expandMore.classList.toggle("hidden");
      Elements.expandLess.classList.toggle("hidden");
    });
  }
  // Handlers to collapse/ expand social details
  _showMore() {
    Elements.showMore.addEventListener("click", (e) => {
      e.stopImmediatePropagation();

      Elements.socialInfo.classList.toggle("extra");
      Elements.showMore.classList.toggle("hidden");
      Elements.showLess.classList.toggle("hidden");
    });
  }
  _showLess() {
    Elements.showLess.addEventListener("click", (e) => {
      e.stopImmediatePropagation();

      Elements.socialInfo.classList.toggle("extra");
      Elements.showMore.classList.toggle("hidden");
      Elements.showLess.classList.toggle("hidden");
    });
  }
  // Hanlders for upload of contact's profile image
  _profileImg() {
    Elements.profileImg.addEventListener("click", this._getImageDetails);
  }
  _profileImgContainer() {
    Elements.profileImgContainer.addEventListener(
      "click",
      this._getImageDetails
    );
  }
  _getImageDetails() {
    Elements.dialogBox.click();

    Elements.dialogBox.addEventListener("change", function () {
      Elements.profileImg.src = URL.createObjectURL(
        Elements.dialogBox?.files[0]
      );
      const reader = new FileReader();

      reader.addEventListener("load", () => {
        Elements.profileImg.src = reader.result;
      });
      reader.readAsDataURL(this.files[0]);
    });
  }
  // Set markup for display of contacts
  _getMarkup(status) {
    if (status === "new")
      this._contactId = this._contactIdList.slice(-1).toString();
    else {
      this._contactId = status;
    }

    this._contactDetails = displayContactView._getContactDetails(
      this._contactId,
      "Name"
    );

    return this._contactDetails;
  }
  // Set visibility of elements based on data
  _setElementsVisibility() {
    this._landing.classList.add("hidden");
    this._newContactContainer.classList.add("hidden");
    this._parentEl.classList.remove("hidden");
    this._newOverlay.classList.remove("hidden");
    this._addressBook.classList.remove("hidden");

    this._escKeyPress();
  }
  // Create new user from address-book interface
  _createContact() {
    this._addContactLink.addEventListener("click", (e) => {
      e.stopImmediatePropagation();

      this._createContactAction();
    });
  }
  _mobileCreateContact() {
    this._mediaQuery.addEventListener("change", () => {
      this._mobileAddContactLink.addEventListener("click", (e) => {
        e.stopImmediatePropagation();

        if (this._mediaQuery.matches === true) {
          this._createContactAction();
          this._floatingMenu.classList.add("hidden");
        }
      });
    });
  }
  _createContactAction() {
    this._newContactContainer.classList.remove("hidden");
    document.querySelector(".upload__btn").classList.remove("hidden");
    document.querySelector(".update__btn").classList.add("hidden");

    this._escKeyPress();
    this._resetFormElements();
    manageContactView._expandLessShowLess();
  }
  // _cancelMobileCreateContact() {
  //   this._btnCloseModal.addEventListener("click", (e) => {
  //     debugger;
  //     e.stopImmediatePropagation();

  //     this._newContactContainer.classList.add("hidden");

  //     const sideBar = document.querySelector(".mobile-side-bar-container");

  //     if (!sideBar.contains(".hidden")) sideBar.classList.add("hidden");
  //   });
  // }
  // Reset form elements
  _resetFormElements() {
    document.getElementById("contact-form").reset();
    // Elements.profileImg.src = "/src/img/profile.png";
    Elements.profileImg.src = require("/src/img/profile.png");
    Elements.countryCode.value = "";
    Elements.facebook.value = "";
    Elements.instagram.value = "";
    Elements.x.value = "";
    Elements.tiktok.value = "";
    Elements.linkedIn.value = "";
    Elements.youtube.value = "";
    Elements.pinterest.value = "";
    Elements.snapchat.value = "";
  }
  // Handler for upload contact click event
  addHandlerUploadContact(handler) {
    Elements.contactUpload.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();

      // Create an object of entered values
      const newContact = {
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

      // Find but and remove code to this hack
      const deleteContactContainer = document.querySelector(
        ".delete-contact-container"
      );
      deleteContactContainer.style.visibility = "hidden";
      deleteContactContainer.style.display = "none";

      document.querySelector("input[name='checkbox']").checked = false;
      // hack end

      handler(newContact);
    });
  }
}

export default new NewContactView();
