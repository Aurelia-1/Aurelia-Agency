// Firebase Configuration & Firestore Integration
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  serverTimestamp,
  getDocs,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAItNjmC0MNRyE4t-18qP3t3BafZ9gJOcI",
  authDomain: "my-pro-e376d.firebaseapp.com",
  projectId: "my-pro-e376d",
  storageBucket: "my-pro-e376d.firebasestorage.app",
  messagingSenderId: "617685781092",
  appId: "1:617685781092:web:f8a87905e325323b46ad71"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Function to submit contact form data to Firestore
export async function submitContactForm(formData) {
  try {
    // Add document to 'contacts' collection
    const docRef = await addDoc(collection(db, "contacts"), {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      service: formData.service,
      message: formData.message,
      timestamp: serverTimestamp(),
      status: "new"
    });
    
    console.log("Contact form submitted successfully with ID:", docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error submitting contact form:", error);
    return { success: false, error: error.message };
  }
}

// Function to get all contacts (for admin use)
export async function getAllContacts() {
  try {
    const querySnapshot = await getDocs(collection(db, "contacts"));
    const contacts = [];
    querySnapshot.forEach((doc) => {
      contacts.push({ id: doc.id, ...doc.data() });
    });
    return contacts;
  } catch (error) {
    console.error("Error getting contacts:", error);
    return [];
  }
}

// Function to update contact status (for admin use)
export async function updateContactStatus(docId, status) {
  try {
    const docRef = doc(db, "contacts", docId);
    await updateDoc(docRef, { status: status });
    console.log("Contact status updated:", docId);
    return true;
  } catch (error) {
    console.error("Error updating contact:", error);
    return false;
  }
}

 