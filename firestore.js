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

// Initialize EmailJS
emailjs.init("5G0fZV4btyBiuyidt");

// Function to submit contact form data to Firestore + EmailJS
export async function submitContactForm(formData) {
  try {
    // 1. Save to Firestore
    const docRef = await addDoc(collection(db, "contacts"), {
      firstName: formData.firstName,
      lastName:  formData.lastName,
      email:     formData.email,
      service:   formData.service,
      message:   formData.message,
      timestamp: serverTimestamp(),
      status:    "new"
    });
    console.log("Firestore saved, ID:", docRef.id);

    // 2. EmailJS template params
    const templateParams = {
      from_name:  `${formData.firstName} ${formData.lastName}`,
      first_name: formData.firstName,
      last_name:  formData.lastName,
      from_email: formData.email,
      reply_to:   formData.email,
      service:    formData.service,
      message:    formData.message,
    };

    // 3. Auto-reply to user
    await emailjs.send("service_82oceyp", "template_28q3mah", templateParams);
    console.log("Auto-reply sent.");

    // 4. Contact notification to you
    await emailjs.send("service_82oceyp", "template_hhblcmu", templateParams);
    console.log("Contact notification sent.");

    return { success: true, id: docRef.id };

  } catch (error) {
    console.error("Error submitting contact form:"  , error);
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

export { db, app };