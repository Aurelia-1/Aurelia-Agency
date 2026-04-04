# Firestore Integration Guide

## Overview
Your contact form is now integrated with Firebase Firestore. All contact submissions are automatically saved to the database.

## Files Created
- **firestore.js** - Firebase & Firestore configuration and contact form handler functions

## Firebase Configuration
The following Firebase credentials are configured in `firestore.js`:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyCA_d7YsBrtqWZI6Z676_PR5t3qPbZcASc",
  authDomain: "aurelia-41b22.firebaseapp.com",
  projectId: "aurelia-41b22",
  storageBucket: "aurelia-41b22.firebasestorage.app",
  messagingSenderId: "1022761250385",
  appId: "1:1022761250385:web:f80491800fb2fcbea11270"
};
```

## How It Works

### Contact Form Submission
When a user submits the contact form in `index.html`:

1. Form data is collected (firstName, lastName, email, service, message)
2. Data is sent to Firestore's `contacts` collection
3. A server timestamp is automatically added
4. Each submission gets a unique document ID
5. Status is set to "new" for new inquiries

### Data Structure
Each contact submission in Firestore has this structure:

```javascript
{
  firstName: "John",
  lastName: "Smith",
  email: "john@example.com",
  service: "Web Development",
  message: "I'm interested in your services...",
  timestamp: 2026-04-03T10:30:45.123Z,
  status: "new"
}
```

## Available Functions

### `submitContactForm(formData)`
Submits contact form data to Firestore.

**Parameters:**
- `formData` (Object): Form data with firstName, lastName, email, service, message

**Returns:**
```javascript
{
  success: true,          // or false on error
  id: "document-id",      // Firestore document ID
  error: "error message"  // Only present if success is false
}
```

**Example:**
```javascript
import { submitContactForm } from './firestore.js';

const result = await submitContactForm({
  firstName: "John",
  lastName: "Smith",
  email: "john@example.com",
  service: "Web Development",
  message: "Your message here"
});

if (result.success) {
  console.log("Form submitted with ID:", result.id);
}
```

### `getAllContacts()`
Retrieves all contacts from Firestore (for admin use).

**Returns:**
Array of contact objects with their document IDs.

### `updateContactStatus(docId, status)`
Updates the status of a contact (for admin use).

**Parameters:**
- `docId` (String): Firestore document ID
- `status` (String): New status (e.g., "replied", "resolved")

## Firestore Console Access

To view and manage your contacts:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project **"aurelia-41b22"**
3. Navigate to **Firestore Database**
4. View the **"contacts"** collection

## Form Feature Updates

The contact form now includes:
- ✅ Real-time form validation (required fields)
- ✅ Loading state while submitting
- ✅ Success/error feedback
- ✅ Automatic form clearing on success
- ✅ Server timestamp for all submissions
- ✅ Unique document IDs for tracking

## Security Notes

⚠️ **Important**: Your Firebase credentials are exposed in the frontend code. For production, you should:

1. Set up Firestore Security Rules to restrict write access
2. Consider using Firebase Authentication
3. Implement rate limiting on the contact endpoint
4. Use environment variables instead of hardcoding credentials

### Recommended Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only allow writes to contacts collection
    match /contacts/{document=**} {
      allow create: if request.resource.data.size() > 0 
                    && request.resource.data.email is string
                    && request.resource.data.firstName is string;
      allow read, update, delete: if false;
    }
  }
}
```

## Testing

To test the integration:

1. Open your website in a browser
2. Scroll to the Contact section
3. Fill out the form with test data
4. Click "Send Message"
5. Check your Firebase Console for the new document in the contacts collection

## Support

For issues or questions:
- Check the browser console for error messages (F12 → Console)
- Verify Firebase credentials are correct
- Ensure Firestore database is active in Firebase Project
- Check Firestore Security Rules allow write access
