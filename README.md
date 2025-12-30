## Overview

The Suggestion Box is a simple, modern, and interactive web application designed for collecting anonymous suggestions from visitors and providing an administrative interface to view them. It features a clean, minimalistic design with smooth animations and is built using HTML, CSS, and JavaScript. Firebase is utilized for secure user authentication and persistent real-time data storage, making it fully functional even when hosted on static platforms like GitHub Pages.

## Features

*   **Public Suggestion Submission:**
    *   Visitors can easily submit a suggestion via a dynamic input area.
    *   **One-time Submission:** Each visitor is restricted to submitting only one suggestion (enforced via client-side local storage).
    *   Dynamic "Submit" button appears only when text is entered.
    *   Confirmation message after successful submission.
*   **Admin Login:**
    *   Secure admin login page using Firebase Authentication (Email/Password).
    *   Credentials are securely handled by Firebase's backend.
*   **Admin Dashboard:**
    *   After logging in, administrators can view all submitted suggestions in a structured, real-time list.
    *   "Show More / Show Less" toggle for long suggestions to improve readability.
    *   Displays submission timestamp for each suggestion.
*   **Intuitive Navigation:**
    *   Hamburger menu (top-left) for easy access to "Admin Login" or "Admin Logout".
*   **Modern & Responsive UI:**
    *   Minimalistic design with a clean aesthetic.
    *   Smooth CSS animations and transitions.
    *   Utilizes Google Fonts for enhanced typography.
    *   Frosted glass (glassmorphism) effect for the navigation menu.
    *   Fully responsive, adapting to various screen sizes (desktop, tablet, mobile).
*   **Persistent Data Storage:**
    *   Leverages Firebase Realtime Database for storing suggestions persistently in the cloud.
    *   Firebase Authentication for secure admin login.

## Technologies Used

*   **Frontend:**
    *   HTML5
    *   CSS3 (with Google Fonts for 'Poppins')
    *   JavaScript (ES6+)
*   **Backend & Cloud Services:**
    *   **Firebase Authentication:** For secure user (admin) login.
    *   **Firebase Realtime Database:** For real-time, persistent storage of suggestions.
## How to Use

### For Visitors (Public)

1.  Open the web application in your browser.
2.  Click the "Admit Suggestion" button.
3.  A text area will appear. Type your suggestion.
4.  The "Submit" button will appear once you start typing.
5.  Click "Submit". A confirmation message will appear, and you will not be able to submit another suggestion from the same browser (due to local storage tracking).

### For Admin

1.  Open the web application in your browser.
2.  Click the **☰ (hamburger menu)** icon in the top-left corner.
3.  Click "Admin Login".
4.  Enter the admin username and password you configured in Firebase Authentication.
5.  Click "Login".
6.  Upon successful login, you will be redirected to the "All Suggestions" view, where you can see all submitted suggestions in real-time.
7.  For long suggestions, click "Show More" to expand and "Show Less" to truncate.
8.  To log out, open the hamburger menu again and click "Admin Logout".
## License

This project is open source and available under the [MIT License](LICENSE). *(You might want to create a `LICENSE` file in your repo with the MIT license text)*

---
