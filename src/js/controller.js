import * as model from "./model.js";
import contactsView from "./view/contactsView.js";
import newContactView from "./view/newContactView.js";
import displayContactView from "./view/displayContactView.js";
import manageContactView from "./view/manageContactView.js";
import deleteContactView from "./view/deleteContactView.js";

// Handles loading of contacts in the view
function controlLoadContacts(condition) {
  // debugger;
  // No contact exist
  if (!condition) contactsView.render(undefined, condition, "load");
  // contacts exist
  else {
    getThisData();
    contactsView.render(model.state.contacts, condition, "load");
  }
}
// Handles upload of a new contact
function controlUploadContact(contact) {
  const val = model.uploadNewContact(contact);
  if (val === null) alert("Add a name for your contact");
  else {
    getThisData();
    contactsView.render(model.state.contacts, true, "create");
    newContactView.render(model.state.contacts, false, "view", "new");
  }
}
// Pushes contact object for content render
function getThisData() {
  contactsView.getThisData(model.state.contacts);
  manageContactView.getThisData(model.state.contacts);
  newContactView.getThisData(model.state.contacts);
  displayContactView.getThisData(model.state.contacts);
}
function controlGetContactNumber(number) {
  model.getContactNumber(number);
}
function controlUpdateContact(id, contact) {
  model.updateExistingContact(id, contact);
  getThisData();
  contactsView.render(model.state.contacts, true, "create");
  newContactView.render(model.state.contacts, false, "view", id);
}
function controlDeleteContact(id) {
  model.deleteSingleContact(id);
  getThisData();
  if (Object.keys(model.state.contacts).length <= 0)
    contactsView.render(undefined, false, "load");
  else contactsView.render(model.state.contacts, true, "load");
}
function controlDeleteAllContacts() {
  model.deleteAllContact();
  contactsView.render(undefined, false, "load");
}

// App initialization function
const init = function () {
  model.loadAddressBook(controlLoadContacts);
  newContactView.addHandlerUploadContact(controlUploadContact);
  manageContactView.addHandlerGetNumber(controlGetContactNumber);
  manageContactView.addHandlerUpdateContact(controlUpdateContact);
  deleteContactView.addHandlerDeleteContact(controlDeleteContact);
  deleteContactView.addHandlerDeleteAllContacts(controlDeleteAllContacts);
};

// App initialization call
init();
