// Firebase configuration - Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "phinex-b5823.firebaseapp.com",
  projectId: "phinex-b5823",
  storageBucket: "phinex-b5823.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Get auth and firestore instances
const auth = firebase.auth();
const db = firebase.firestore();

// Define providers AFTER Firebase is initialized
const googleProvider = new firebase.auth.GoogleAuthProvider();
const facebookProvider = new firebase.auth.FacebookAuthProvider();