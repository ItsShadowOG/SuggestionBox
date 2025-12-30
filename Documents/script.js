// =========================================================
// !!! IMPORTANT: YOUR FIREBASE CONFIGURATION GOES HERE !!!
// Replace the placeholder values with your actual Firebase project settings.
// You can find these in your Firebase project settings -> "General" -> "Your apps"
// =========================================================
const firebaseConfig = {
  apiKey: "AIzaSyCB3d4M3voHPZotTYcFQNQ5c_M50zO_Bfc",
  authDomain: "suggestion-wizard99.firebaseapp.com",
  databaseURL: "https://suggestion-wizard99-default-rtdb.firebaseio.com",
  projectId: "suggestion-wizard99",
  storageBucket: "suggestion-wizard99.firebasestorage.app",
  messagingSenderId: "718000511454",
  appId: "1:718000511454:web:9bc1e64710e59ace82a54f",
  measurementId: "G-56P32D719Z"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();


// =========================================================
// !!! IMPORTANT: Admin Credentials Setup !!!
// This user MUST be created in your Firebase Authentication console manually.
// Email: thewizard99@gmail.com
// Password: WIZARD242427
// Firebase handles the hashing securely. Do NOT hardcode password here.
// The username in the login form will map to the email for Firebase Auth.
// =========================================================
const ADMIN_USERNAME = "thewizard99"; // This will be used as the email prefix for Firebase Auth
const ADMIN_EMAIL_DOMAIN = "@gmail.com"; // Separate domain for clarity
const ADMIN_PASSWORD = "WIZARD242427"; // The password you set in Firebase Auth


// =========================================================
// DOM Elements
// =========================================================
const hamburgerMenu = document.getElementById('hamburger-menu');
const navMenu = document.getElementById('nav-menu');
const adminLoginLink = document.getElementById('admin-login-link');
const adminLogoutLinkContainer = document.getElementById('admin-logout-link-container');
const adminLogoutLink = document.getElementById('admin-logout-link');

const publicSuggestionSection = document.getElementById('public-suggestion-section');
const admitSuggestionBtn = document.getElementById('admit-suggestion-btn');
const suggestionInputArea = document.getElementById('suggestion-input-area');
const suggestionText = document.getElementById('suggestion-text');
const submitSuggestionBtn = document.getElementById('submit-suggestion-btn');
const submissionMessage = document.getElementById('submission-message');

const adminLoginSection = document.getElementById('admin-login-section');
const adminLoginForm = document.getElementById('admin-login-form');
const adminUsernameInput = document.getElementById('admin-username');
const adminPasswordInput = document.getElementById('admin-password');
const loginErrorMessage = document.getElementById('login-error-message');

const adminSuggestionsSection = document.getElementById('admin-suggestions-section');
const suggestionsList = document.getElementById('suggestions-list');
const noSuggestionsMessage = document.getElementById('no-suggestions-message');


// =========================================================
// UI State Management
// =========================================================
function showSection(sectionId) {
    // Hide all main sections
    publicSuggestionSection.classList.add('hidden');
    adminLoginSection.classList.add('hidden');
    adminSuggestionsSection.classList.add('hidden');

    // Show the requested section
    document.getElementById(sectionId).classList.remove('hidden');
    navMenu.classList.remove('open'); // Close menu after selection
    hamburgerMenu.classList.remove('open'); // Also remove hamburger animation
}

// Function to update UI based on admin login status
function updateAdminUI(user) {
    if (user) {
        // Admin is logged in
        adminLoginLink.parentElement.classList.add('hidden'); // Hide "Admin Login"
        adminLogoutLinkContainer.classList.remove('hidden'); // Show "Admin Logout"
        showSection('admin-suggestions-section');
        loadSuggestions(); // Load suggestions for admin
    } else {
        // Admin is logged out
        adminLoginLink.parentElement.classList.remove('hidden'); // Show "Admin Login"
        adminLogoutLinkContainer.classList.add('hidden'); // Hide "Admin Logout"
        showSection('public-suggestion-section'); // Show public section
    }
}

// Check auth state on page load
auth.onAuthStateChanged(updateAdminUI);


// =========================================================
// Hamburger Menu Logic
// =========================================================
hamburgerMenu.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    hamburgerMenu.classList.toggle('open'); // Toggle class for animation
});

// Close nav menu if clicked outside (optional, but good UX)
document.addEventListener('click', (event) => {
    const isClickInsideNav = navMenu.contains(event.target);
    const isClickOnHamburger = hamburgerMenu.contains(event.target);
    if (!isClickInsideNav && !isClickOnHamburger && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        hamburgerMenu.classList.remove('open');
    }
});


// =========================================================
// Public Suggestion Logic - BUG FIX APPLIED HERE
// =========================================================
function initializePublicSuggestionSection() {
    if (localStorage.getItem('hasSubmittedSuggestion')) {
        admitSuggestionBtn.textContent = "Suggestion Submitted!"; // Change button text
        admitSuggestionBtn.disabled = true; // Disable button
        admitSuggestionBtn.style.cursor = 'default'; // Change cursor
        suggestionInputArea.classList.remove('hidden'); // Show input area
        suggestionText.classList.add('hidden'); // Hide textarea
        submitSuggestionBtn.classList.add('hidden'); // Hide submit button
        submissionMessage.textContent = "You have already submitted a suggestion. Thank you!";
        submissionMessage.classList.remove('hidden');
    } else {
        admitSuggestionBtn.textContent = "Admit Suggestion";
        admitSuggestionBtn.disabled = false;
        admitSuggestionBtn.style.cursor = 'pointer';
        submissionMessage.classList.add('hidden'); // Hide any previous messages
        suggestionInputArea.classList.add('hidden'); // Hide input area initially
        suggestionText.value = ''; // Clear textarea
        suggestionText.classList.remove('hidden'); // Ensure textarea is visible when input area is opened
        submitSuggestionBtn.classList.add('hidden'); // Ensure submit button is hidden initially
    }
}

admitSuggestionBtn.addEventListener('click', () => {
    if (admitSuggestionBtn.disabled) return; // Prevent action if disabled

    // Toggle visibility of the input area if not already submitted
    suggestionInputArea.classList.toggle('hidden');
    // Ensure the message is hidden and input is cleared when opening to type
    if (!suggestionInputArea.classList.contains('hidden')) {
        submissionMessage.classList.add('hidden');
        suggestionText.value = '';
        suggestionText.classList.remove('hidden');
        submitSuggestionBtn.classList.add('hidden');
    }
});


suggestionText.addEventListener('input', () => {
    if (suggestionText.value.trim().length > 0) {
        submitSuggestionBtn.classList.remove('hidden');
    } else {
        submitSuggestionBtn.classList.add('hidden');
    }
});

submitSuggestionBtn.addEventListener('click', async () => {
    const suggestionContent = suggestionText.value.trim();

    if (suggestionContent.length > 0) {
        try {
            await database.ref('suggestions').push({
                content: suggestionContent,
                timestamp: firebase.database.ServerValue.TIMESTAMP
            });

            localStorage.setItem('hasSubmittedSuggestion', 'true'); // Mark as submitted
            submissionMessage.textContent = "Thank you for your suggestion!";
            submissionMessage.classList.remove('hidden');
            suggestionText.classList.add('hidden');
            submitSuggestionBtn.classList.add('hidden');
            admitSuggestionBtn.textContent = "Suggestion Submitted!"; // Update button text
            admitSuggestionBtn.disabled = true; // Disable button
            admitSuggestionBtn.style.cursor = 'default';
            console.log("Suggestion submitted!");

        } catch (error) {
            console.error("Error submitting suggestion: ", error);
            submissionMessage.textContent = "Error submitting suggestion. Please try again.";
            submissionMessage.classList.remove('hidden');
        }
    }
});

// Initial setup of public suggestion section on page load
initializePublicSuggestionSection();


// =========================================================
// Admin Login/Logout Logic
// =========================================================
adminLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    showSection('admin-login-section');
    loginErrorMessage.classList.add('hidden'); // Clear any previous errors
    adminLoginForm.reset(); // Clear form fields
});

adminLogoutLink.addEventListener('click', async (e) => {
    e.preventDefault();
    try {
        await auth.signOut();
        console.log("Admin logged out.");
        // updateAdminUI will be called by onAuthStateChanged listener
    } catch (error) {
        console.error("Error logging out: ", error);
    }
});

adminLoginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = adminUsernameInput.value.trim();
    const password = adminPasswordInput.value;

    if (username === ADMIN_USERNAME) {
        try {
            await auth.signInWithEmailAndPassword(username + ADMIN_EMAIL_DOMAIN, password);
            loginErrorMessage.classList.add('hidden');
            console.log("Admin logged in successfully!");
        } catch (error) {
            loginErrorMessage.textContent = "Login failed: Invalid username or password.";
            loginErrorMessage.classList.remove('hidden');
            console.error("Admin login error: ", error.message);
        }
    } else {
        loginErrorMessage.textContent = "Login failed: Invalid username or password.";
        loginErrorMessage.classList.remove('hidden');
    }
});


// =========================================================
// Admin Suggestions Display Logic
// =========================================================
function renderSuggestion(suggestionId, suggestionData) {
    const card = document.createElement('div');
    card.classList.add('suggestion-card');
    card.setAttribute('data-id', suggestionId);

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('suggestion-content');
    contentDiv.textContent = suggestionData.content;

    const metaDiv = document.createElement('div');
    metaDiv.classList.add('meta');
    const date = suggestionData.timestamp ? new Date(suggestionData.timestamp).toLocaleString() : 'N/A';
    metaDiv.textContent = `Submitted: ${date}`;

    card.appendChild(contentDiv);
    card.appendChild(metaDiv);

    // Add Show More/Less functionality if content is long
    requestAnimationFrame(() => {
        if (contentDiv.scrollHeight > contentDiv.clientHeight) {
            contentDiv.classList.add('truncated');
            const readMoreBtn = document.createElement('button');
            readMoreBtn.classList.add('read-more-btn');
            readMoreBtn.textContent = 'Show More';
            readMoreBtn.addEventListener('click', () => {
                contentDiv.classList.remove('truncated');
                readMoreBtn.classList.add('hidden');
                readLessBtn.classList.remove('hidden');
            });

            const readLessBtn = document.createElement('button');
            readLessBtn.classList.add('read-less-btn', 'hidden');
            readLessBtn.textContent = 'Show Less';
            readLessBtn.addEventListener('click', () => {
                contentDiv.classList.add('truncated');
                readLessBtn.classList.add('hidden');
                readMoreBtn.classList.remove('hidden');
            });

            card.appendChild(readMoreBtn);
            card.appendChild(readLessBtn);
        }
    });

    return card;
}

// Keep track of the listener so we can detach it if needed
let suggestionsListener = null;

function loadSuggestions() {
    if (suggestionsListener) {
        database.ref('suggestions').off('value', suggestionsListener);
    }

    suggestionsList.innerHTML = ''; // Clear existing suggestions
    noSuggestionsMessage.classList.add('hidden');

    suggestionsListener = database.ref('suggestions').orderByChild('timestamp').on('value', (snapshot) => {
        suggestionsList.innerHTML = '';
        const suggestions = [];

        snapshot.forEach((childSnapshot) => {
            suggestions.push({
                id: childSnapshot.key,
                ...childSnapshot.val()
            });
        });

        if (suggestions.length === 0) {
            noSuggestionsMessage.classList.remove('hidden');
            return;
        }
        noSuggestionsMessage.classList.add('hidden');

        // Reverse the array to show newest first, as orderByChild('timestamp') orders oldest first
        suggestions.reverse().forEach((suggestion, index) => {
            const suggestionCard = renderSuggestion(suggestion.id, suggestion);
            // Apply animation delay based on index
            suggestionCard.style.animationDelay = `${index * 0.05}s`;
            suggestionsList.appendChild(suggestionCard);
        });

    }, (error) => {
        console.error("Error fetching suggestions from Realtime DB: ", error);
        suggestionsList.innerHTML = '<p class="error-message">Error loading suggestions.</p>';
    });
}


// =========================================================
// Initial Load & Navigation
// =========================================================
// Default to public view if not logged in
if (!auth.currentUser) {
    showSection('public-suggestion-section');
}