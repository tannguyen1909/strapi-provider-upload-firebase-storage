"use strict";

/**
 * Module dependencies
 */
const firebase = require("firebase/app");

// Add the Firebase services that you want to use
require("firebase/auth");
require("firebase/firestore");

module.exports = {
  provider: "storage",
  name: "Firebase Storage",
  auth: {
    serviceAccount: {
      label: "firebaseConfig JSON",
      type: "textarea"
    }
  },
  init: config => {
    const config = JSON.parse(config.serviceAccount);
    const storageRef = firebase.storage().ref();
    firebase.initializeApp(config);

    return {
      upload: async file => {
        try {
          const fileName = `${file.hash}-${file.name}`;
          const meta = { contentType: file.mime };
          const snapshot = await storageRef.child(`images/${fileName}`).put(file, meta);
          const url = snapshot.ref.getDownloadURL();

          file.url = url;
        } catch (error) {
          console.log(`Upload failed, try again: ${error}`);
        }
      },
      delete: async file => {
        const fileName = `${file.hash}-${file.name}`;

        try {
          await storageRef.child(`images/${fileName}`).delete();
        } catch (error) {
          console.log(`Could not delete: ${error}`);
        }
      }
    };
  }
};
