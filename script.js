// ===== Year Population =====
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// ===== Scroll Reveals =====
const revealItems = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

revealItems.forEach((item) => observer.observe(item));

// ===== Payment Message from Query Params =====
const paymentMessage = document.getElementById("payment-message");

function showPaymentMessageFromQuery() {
  if (!paymentMessage) return;
  const query = new URLSearchParams(window.location.search);
  const paymentState = query.get("payment");

  if (paymentState === "success") {
    paymentMessage.textContent = "Payment confirmed. Thank you for registering.";
    paymentMessage.classList.add("notice-success");
  } else if (paymentState === "cancel") {
    paymentMessage.textContent = "Payment was not completed. You can submit the form and try again.";
    paymentMessage.classList.add("notice-warning");
  } else {
    paymentMessage.textContent = "";
  }
}

showPaymentMessageFromQuery();

// ===== Smooth Scroll Navigation =====
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (href === "#" || href === "#top") return;
    
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// ===== Form Validation & UX =====
const form = document.getElementById("registration-form");
const submitBtn = document.getElementById("submit-button");

if (form) {
  const formFields = form.querySelectorAll("input, select, textarea");

  // Add error message container after labels
  formFields.forEach((field) => {
    if (field.type !== "hidden" && field.type !== "checkbox") {
      const label = field.closest("label");
      if (label && !label.querySelector(".error-message")) {
        const errorDiv = document.createElement("div");
        errorDiv.className = "error-message";
        errorDiv.setAttribute("aria-live", "polite");
        errorDiv.setAttribute("role", "alert");
        label.appendChild(errorDiv);
      }
    }
  });

  // Real-time validation
  formFields.forEach((field) => {
    if (field.type === "hidden") return;

    const checkValidity = () => {
      const isValid = field.checkValidity();
      const errorDiv = field.closest("label")?.querySelector(".error-message");
      const phoneContainer = field.closest(".phone-fields");

      if (!isValid && field.value) {
        field.classList.add("is-invalid");
        if (errorDiv) {
          errorDiv.textContent = getErrorMessage(field);
        }
      } else {
        field.classList.remove("is-invalid");
        if (errorDiv) {
          errorDiv.textContent = "";
        }
      }
    };

    field.addEventListener("blur", checkValidity);
    field.addEventListener("change", checkValidity);
    field.addEventListener("input", () => {
      if (field.classList.contains("is-invalid")) {
        checkValidity();
      }
    });
  });

  // Get appropriate error message
  function getErrorMessage(field) {
    if (field.type === "email") {
      return "Please enter a valid email address";
    } else if (field.type === "tel") {
      return "Please enter a valid phone number";
    } else if (field.type === "date") {
      return "Please select a valid date";
    } else if (field.hasAttribute("required") && !field.value) {
      return "This field is required";
    }
    return "Invalid input";
  }

  // Form submission with loading state
  form.addEventListener("submit", function (e) {
    const isValid = form.checkValidity();

    if (!isValid) {
      e.preventDefault();
      // Show all validation errors
      formFields.forEach((field) => {
        if (field.type !== "hidden" && field.type !== "checkbox") {
          if (!field.checkValidity()) {
            field.classList.add("is-invalid");
            const errorDiv = field.closest("label")?.querySelector(".error-message");
            if (errorDiv) {
              errorDiv.textContent = getErrorMessage(field);
            }
            field.focus();
          }
        }
      });
      return false;
    }

    // Valid form - add loading state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.classList.add("is-loading");
      submitBtn.innerHTML = '<span class="spinner"></span> Processing...';
    }
  });

  // Checkbox styling
  const consentCheckbox = form.querySelector('input[name="consent"]');
  if (consentCheckbox) {
    consentCheckbox.addEventListener("change", function () {
      const checkboxLabel = this.closest(".checkbox-row");
      if (checkboxLabel) {
        if (this.checked) {
          checkboxLabel.classList.add("is-checked");
        } else {
          checkboxLabel.classList.remove("is-checked");
        }
      }
    });
  }
}

// ===== Field Focus Animations =====
document.querySelectorAll("input, select, textarea").forEach((field) => {
  field.addEventListener("focus", function () {
    const label = this.closest("label");
    if (label) {
      label.classList.add("is-focused");
    }
  });

  field.addEventListener("blur", function () {
    const label = this.closest("label");
    if (label) {
      label.classList.remove("is-focused");
    }
  });
});
