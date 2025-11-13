// Firebase configuration - Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyEXAMPLE1234567890",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();
const db = firebase.firestore();

// Utility function to show messages
function showMessage(message, type = 'error') {
  const messageDiv = document.getElementById('message');
  if (messageDiv) {
    messageDiv.textContent = message;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';
    
    setTimeout(() => {
      messageDiv.style.display = 'none';
    }, 5000);
  } else {
    alert(message);
  }
}

// ===== AUTH STATE OBSERVER =====
auth.onAuthStateChanged((user) => {
  const loginNav = document.getElementById("loginNav");
  const logoutBtn = document.getElementById("logoutBtn");
  
  if (user) {
    // User is signed in
    if (loginNav) loginNav.classList.add("hidden");
    if (logoutBtn) logoutBtn.classList.remove("hidden");
    console.log("User is signed in:", user.email);
  } else {
    // User is signed out
    if (loginNav) loginNav.classList.remove("hidden");
    if (logoutBtn) logoutBtn.classList.add("hidden");
    console.log("User is signed out");
  }
});

// ===== LOGIN =====
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    const loginBtn = document.getElementById("loginBtn");
    
    try {
      loginBtn.disabled = true;
      loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
      
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      showMessage("Login successful! Redirecting...", 'success');
      
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1000);
      
    } catch(error) {
      console.error("Login error:", error);
      showMessage("Login failed: " + error.message);
    } finally {
      loginBtn.disabled = false;
      loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
    }
  });
}

// ===== SIGNUP =====
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;
    const robotCheck = document.getElementById("robotCheck").checked;
    const signupBtn = document.getElementById("signupBtn");
    
    if (!robotCheck) {
      showMessage("Please confirm you're not a robot!");
      return;
    }
    
    if (password.length < 6) {
      showMessage("Password should be at least 6 characters");
      return;
    }
    
    try {
      signupBtn.disabled = true;
      signupBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
      
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      
      // Save user data to Firestore
      await db.collection("users").doc(user.uid).set({
        email: email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        role: "student"
      });
      
      showMessage("Account created successfully! Redirecting to login...", 'success');
      
      setTimeout(() => {
        window.location.href = "login.html";
      }, 2000);
      
    } catch(error) {
      console.error("Signup error:", error);
      showMessage("Signup failed: " + error.message);
    } finally {
      signupBtn.disabled = false;
      signupBtn.innerHTML = '<i class="fas fa-user-plus"></i> Create Account';
    }
  });
}

// ===== LOGOUT =====
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    try {
      await auth.signOut();
      showMessage("Logged out successfully!", 'success');
      window.location.href = "index.html";
    } catch(error) {
      console.error("Logout error:", error);
      showMessage("Logout failed: " + error.message);
    }
  });
}

// ===== JOIN X-ACADEMY =====
const joinAcademyBtns = document.querySelectorAll("#joinAcademyBtn");
joinAcademyBtns.forEach(btn => {
  if (btn) {
    btn.addEventListener("click", () => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          window.location.href = "test.html";
        } else {
          window.location.href = "login.html";
        }
      });
    });
  }
});

// ===== TEST QUESTIONS =====
if (document.getElementById("questions")) {
  const questions = [
    {
      q: "Why do you want to learn programming?",
      a: ["Want to gain money", "Just for fun", "I need a nice job", "I want to try"]
    },
    {
      q: "Do you have an app on Google Play or a website?",
      a: ["No, beginner", "Yes, AI made", "Yes, self-made", "No, making projects only"]
    },
    {
      q: "Who are you working for now?",
      a: ["Programming company", "Community with friends", "Freelancer", "Never worked before"]
    },
    {
      q: "Arrange languages (descending):",
      a: ["Python", "Java", "C++", "JavaScript", "C#", "None, here to start my journey"]
    },
    {
      q: "Which apps/websites you want to make?",
      a: ["Games apps", "Learning apps", "Games on Roblox/Unity", "Websites for gaming or programming"]
    },
    {
      q: "How many hours per week can you learn?",
      a: ["1-3", "4-6", "7-10", "10+"]
    },
    {
      q: "What platform do you prefer?",
      a: ["Mobile", "PC", "Web", "All of them"]
    },
    {
      q: "Do you like team projects?",
      a: ["Yes", "No", "Maybe", "Not sure yet"]
    },
    {
      q: "Do you know Git/GitHub?",
      a: ["No", "A bit", "Yes, I use it often", "I'm expert"]
    },
    {
      q: "What do you expect from X-Academy?",
      a: ["Learning", "Collaboration", "Certification", "Fun challenges"]
    }
  ];

  const qDiv = document.getElementById("questions");
  
  questions.forEach((item, i) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <p><strong>${i + 1}. ${item.q}</strong></p>
      ${item.a.map(opt => `
        <label>
          <input type='radio' name='q${i}' value='${opt}' required> 
          ${opt}
        </label>
      `).join("")}
    `;
    qDiv.appendChild(div);
  });

  document.getElementById("testForm").addEventListener("submit", (e) => {
    e.preventDefault();
    
    // Collect answers
    const answers = {};
    let allAnswered = true;
    
    questions.forEach((_, i) => {
      const selected = document.querySelector(`input[name="q${i}"]:checked`);
      if (selected) {
        answers[`q${i + 1}`] = selected.value;
      } else {
        allAnswered = false;
      }
    });
    
    if (!allAnswered) {
      alert("Please answer all questions before submitting.");
      return;
    }
    
    // In a real app, you would save these answers to Firebase
    console.log("Test answers:", answers);
    
    // Show thank you message
    document.getElementById("testForm").classList.add("hidden");
    document.getElementById("thankYou").classList.remove("hidden");
  });
}

// ===== MOBILE MENU TOGGLE =====
document.addEventListener('DOMContentLoaded', function() {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      hamburger.classList.toggle('active');
    });
  }
});

// Add message styles to CSS
const style = document.createElement('style');
style.textContent = `
  .message {
    padding: 12px;
    border-radius: var(--border-radius);
    margin: 15px 0;
    text-align: center;
    display: none;
  }
  
  .message.error {
    background: rgba(255, 101, 132, 0.2);
    border: 1px solid var(--secondary);
    color: #ff6584;
  }
  
  .message.success {
    background: rgba(40, 167, 69, 0.2);
    border: 1px solid var(--success);
    color: #28a745;
  }
  
  .nav-menu.active {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background: var(--darker);
    padding: 1rem;
  }
  
  @media (max-width: 768px) {
    .nav-menu {
      display: none;
    }
    
    .hamburger.active span:nth-child(1) {
      transform: rotate(45deg) translate(5px, 5px);
    }
    
    .hamburger.active span:nth-child(2) {
      opacity: 0;
    }
    
    .hamburger.active span:nth-child(3) {
      transform: rotate(-45deg) translate(7px, -6px);
    }
  }
`;
document.head.appendChild(style);
// Add these functions to your existing app.js file

// ===== GOOGLE LOGIN =====
function setupGoogleLogin() {
  const googleLoginBtn = document.getElementById('googleLoginBtn');
  const googleSignupBtn = document.getElementById('googleSignupBtn');
  
  if (googleLoginBtn) {
    googleLoginBtn.addEventListener('click', signInWithGoogle);
  }
  
  if (googleSignupBtn) {
    googleSignupBtn.addEventListener('click', signInWithGoogle);
  }
}

async function signInWithGoogle() {
  try {
    const result = await auth.signInWithPopup(googleProvider);
    const user = result.user;
    
    // Check if user exists in Firestore, if not create a record
    const userDoc = await db.collection('users').doc(user.uid).get();
    if (!userDoc.exists) {
      await db.collection('users').doc(user.uid).set({
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        provider: 'google',
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        role: 'student'
      });
    }
    
    showMessage('Google login successful! Redirecting...', 'success');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
    
  } catch (error) {
    console.error('Google login error:', error);
    showMessage('Google login failed: ' + error.message);
  }
}

// ===== FACEBOOK LOGIN =====
function setupFacebookLogin() {
  const facebookLoginBtn = document.getElementById('facebookLoginBtn');
  const facebookSignupBtn = document.getElementById('facebookSignupBtn');
  
  if (facebookLoginBtn) {
    facebookLoginBtn.addEventListener('click', signInWithFacebook);
  }
  
  if (facebookSignupBtn) {
    facebookSignupBtn.addEventListener('click', signInWithFacebook);
  }
}

async function signInWithFacebook() {
  try {
    // Add additional scopes if needed
    facebookProvider.addScope('email');
    facebookProvider.addScope('public_profile');
    
    const result = await auth.signInWithPopup(facebookProvider);
    const user = result.user;
    
    // Check if user exists in Firestore, if not create a record
    const userDoc = await db.collection('users').doc(user.uid).get();
    if (!userDoc.exists) {
      await db.collection('users').doc(user.uid).set({
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        provider: 'facebook',
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        role: 'student'
      });
    }
    
    showMessage('Facebook login successful! Redirecting...', 'success');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
    
  } catch (error) {
    console.error('Facebook login error:', error);
    showMessage('Facebook login failed: ' + error.message);
  }
}

// Initialize social login buttons when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  setupGoogleLogin();
  setupFacebookLogin();
  
  // Your existing DOM loaded code...
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      hamburger.classList.toggle('active');
    });
  }
});