const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

const paymentMessage = document.getElementById("payment-message");

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
