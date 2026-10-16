// ==========================================================================
// ShipDecKK - Interactive Scripts & Form Validation
// ==========================================================================

document.addEventListener("DOMContentLoaded", function () {
  // 1. Sticky Header Scroll Effect
  const header = document.querySelector(".header");
  if (header) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 30) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    });
  }

  // 2. Mobile Navigation Toggle
  const navToggle = document.querySelector(".nav-toggle");
  const navigation = document.querySelector(".navigation");
  if (navToggle && navigation) {
    navToggle.addEventListener("click", function () {
      navigation.classList.toggle("show");
    });

    // Close mobile nav when clicking a link
    navigation.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navigation.classList.remove("show");
      });
    });
  }

  // 3. Highlight Current Active Nav Link
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".navigation a");
  navLinks.forEach(function (link) {
    const linkHref = link.getAttribute("href");
    if (linkHref === currentPath || (currentPath === "" && linkHref === "index.html")) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
});

// 4. Subscription Form Validation & Modal
function validation(event) {
  event.preventDefault();

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const ageInput = document.getElementById("age");
  const male = document.getElementById("male")?.checked;
  const female = document.getElementById("female")?.checked;
  const agree = document.getElementById("agree")?.checked;

  const name = nameInput ? nameInput.value.trim() : "";
  const email = emailInput ? emailInput.value.trim() : "";
  const password = passwordInput ? passwordInput.value : "";
  const age = ageInput ? parseInt(ageInput.value, 10) : 0;

  // Error validation checks
  if (name === "" || email === "" || password === "" || !ageInput || ageInput.value === "") {
    showToast("Please fill out all the fields in the form.", "error");
    return false;
  }
  
  if (/\d/.test(name)) {
    showToast("Full name cannot contain numeric digits.", "error");
    nameInput.focus();
    return false;
  }

  if (!email.includes("@") || !email.includes(".")) {
    showToast("Please enter a valid email address containing '@' and domain.", "error");
    emailInput.focus();
    return false;
  }

  if (isNaN(age) || age < 1 || age > 120) {
    showToast("Please provide a valid age between 1 and 120.", "error");
    ageInput.focus();
    return false;
  }

  if (password.length <= 5) {
    showToast("Password must be at least 6 characters long.", "error");
    passwordInput.focus();
    return false;
  }

  if (!male && !female) {
    showToast("Please select your gender.", "error");
    return false;
  }

  if (!agree) {
    showToast("Please agree to the terms and conditions before continuing.", "error");
    return false;
  }

  // Confirmation via custom modal
  openConfirmationModal(name);
  return false;
}

// Custom Confirmation Modal
function openConfirmationModal(userName) {
  let modal = document.getElementById("custom-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "custom-modal";
    modal.className = "modal-overlay";
    modal.innerHTML = `
      <div class="modal-box">
        <div class="modal-icon">⚓</div>
        <h3>Join ShipDecKK Family</h3>
        <p>Are you sure you want to subscribe with this information, <strong>${escapeHtml(userName)}</strong>?</p>
        <div class="modal-actions">
          <button type="button" class="modal-btn modal-btn-cancel" onclick="closeConfirmationModal()">Cancel</button>
          <button type="button" class="modal-btn modal-btn-confirm" onclick="confirmSubscription('${escapeHtml(userName)}')">Confirm & Subscribe</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  } else {
    const p = modal.querySelector("p");
    if (p) {
      p.innerHTML = `Are you sure you want to subscribe with this information, <strong>${escapeHtml(userName)}</strong>?`;
    }
  }

  modal.classList.add("active");
}

function closeConfirmationModal() {
  const modal = document.getElementById("custom-modal");
  if (modal) {
    modal.classList.remove("active");
  }
}

function confirmSubscription(userName) {
  closeConfirmationModal();
  showToast(`Welcome aboard, ${userName}! Your subscription is successful.`, "success");
  
  // Reset form
  const form = document.querySelector("form");
  if (form) form.reset();

  // Redirect to index.html after 1.8 seconds
  setTimeout(function () {
    window.location.href = "index.html";
  }, 1800);
}

// Toast notification helper
function showToast(message, type = "info") {
  let toast = document.getElementById("site-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "site-toast";
    toast.style.cssText = `
      position: fixed;
      bottom: 28px;
      right: 28px;
      background: #0A2540;
      color: #ffffff;
      padding: 14px 24px;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 600;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
      z-index: 3000;
      display: flex;
      align-items: center;
      gap: 10px;
      transition: all 0.3s ease;
      opacity: 0;
      transform: translateY(20px);
      max-width: 90%;
    `;
    document.body.appendChild(toast);
  }

  if (type === "error") {
    toast.style.background = "#dc2626";
    toast.innerHTML = `<span>⚠️</span> ${escapeHtml(message)}`;
  } else if (type === "success") {
    toast.style.background = "#059669";
    toast.innerHTML = `<span>✓</span> ${escapeHtml(message)}`;
  } else {
    toast.style.background = "#0A2540";
    toast.innerHTML = `<span>ℹ️</span> ${escapeHtml(message)}`;
  }

  toast.style.opacity = "1";
  toast.style.transform = "translateY(0)";

  setTimeout(function () {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(20px)";
  }, 3500);
}

function escapeHtml(string) {
  return String(string).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
