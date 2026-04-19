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

// EmailJS Config
const EMAILJS_PUBLIC_KEY = "5G0fZV4btyBiuyidt";
const EMAILJS_SERVICE_ID = "service_82oceyp";
const EMAILJS_AUTOREPLY_TEMPLATE = "template_28q3mah";   // Auto-reply to user
const EMAILJS_CONTACT_TEMPLATE  = "template_hhblcmu";    // Notification to you

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

// Send emails via EmailJS
async function sendEmails(formData) {
  const templateParams = {
    from_name:  `${formData.firstName} ${formData.lastName}`,
    first_name: formData.firstName,
    last_name:  formData.lastName,
    from_email: formData.email,
    reply_to:   formData.email,
    service:    formData.service,
    message:    formData.message,
  };

  try {
    // 1. Send auto-reply to the user
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_AUTOREPLY_TEMPLATE,
      templateParams
    );
    console.log("Auto-reply sent to:", formData.email);

    // 2. Send contact notification to you
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_CONTACT_TEMPLATE,
      templateParams
    );
    console.log("Contact notification sent.");

  } catch (error) {
    console.error("EmailJS error:", error);
    throw error; // bubble up so submitContactForm can catch it
  }
}

// Function to submit contact form data to Firestore + send emails
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

    // 2. Send both emails
    await sendEmails(formData);

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

export { db, app };