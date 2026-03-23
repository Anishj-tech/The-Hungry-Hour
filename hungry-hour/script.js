// ── CART ──
let cart = {};

function toggleCart() {
  document.getElementById("cart-drawer").classList.toggle("open");
  document.getElementById("cart-overlay").classList.toggle("open");
}

function addToCart(name, price) {
  if (cart[name]) {
    cart[name].qty++;
  } else {
    cart[name] = { price, qty: 1 };
  }
  renderCart();
  showToast(`✅ ${name} added to cart!`);
}

function changeQty(name, delta) {
  cart[name].qty += delta;
  if (cart[name].qty <= 0) delete cart[name];
  renderCart();
}

function removeItem(name) {
  delete cart[name];
  renderCart();
}

function renderCart() {
  const keys = Object.keys(cart);
  const countEl = document.getElementById("cart-count");
  const itemsEl = document.getElementById("cart-items");
  const footerEl = document.getElementById("cart-footer");
  const totalEl = document.getElementById("cart-total");

  const totalQty = keys.reduce((s, k) => s + cart[k].qty, 0);
  countEl.textContent = totalQty;

  if (keys.length === 0) {
    itemsEl.innerHTML = '<p class="cart-empty">Your cart is empty 🛒</p>';
    footerEl.style.display = "none";
    return;
  }

  footerEl.style.display = "block";
  itemsEl.innerHTML = keys
    .map((name) => {
      const { price, qty } = cart[name];
      return `
      <div class="cart-item">
        <div class="cart-item-left">
          <h6>${name}</h6>
          <span>₹${price * qty}</span>
        </div>
        <div class="cart-item-right">
          <button class="qty-btn" onclick="changeQty('${name}',-1)">−</button>
          <span class="qty-val">${qty}</span>
          <button class="qty-btn" onclick="changeQty('${name}',1)">+</button>
          <button class="del-btn" onclick="removeItem('${name}')">✕</button>
        </div>
      </div>
    `;
    })
    .join("");

  const total = keys.reduce((s, k) => s + cart[k].price * cart[k].qty, 0);
  totalEl.textContent = `₹${total}`;
}

// ── MENU FILTER ──
document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".filter-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const cat = btn.dataset.cat;
    document.querySelectorAll(".menu-card").forEach((card) => {
      if (cat === "all" || card.dataset.cat === cat) {
        card.classList.remove("hidden");
      } else {
        card.classList.add("hidden");
      }
    });
  });
});

// ── MOBILE MENU ──
function toggleMenu() {
  document.getElementById("nav-links").classList.toggle("open");
}

// ── CONTACT FORM ──
function submitForm(e) {
  e.preventDefault();
  e.target.reset();
  showToast("✅ Message sent! We'll get back to you soon.");
}

// ── TOAST ──
let toastTimer;
function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3000);
}

// ── NAVBAR SCROLL ──
window.addEventListener("scroll", () => {
  const nav = document.querySelector(".navbar");
  nav.style.boxShadow =
    window.scrollY > 40 ? "0 4px 20px rgba(0,0,0,0.4)" : "none";
});

// ── CLOSE CART ON ESC ──
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.getElementById("cart-drawer").classList.remove("open");
    document.getElementById("cart-overlay").classList.remove("open");
  }
});

// ── TABLE BOOKING ──
function goToStep2(e) {
  e.preventDefault();
  const name = document.getElementById("b-name").value;
  const phone = document.getElementById("b-phone").value;
  const date = document.getElementById("b-date").value;
  const time = document.getElementById("b-time").value;
  const guests = document.getElementById("b-guests").value;
  const seat = document.getElementById("b-seat").value;
  const note = document.getElementById("b-note").value;

  // Format date nicely
  const dateObj = new Date(date);
  const formatted = dateObj.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Format time
  const [h, m] = time.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  const timeStr = `${hour12}:${m} ${ampm}`;

  // Build summary
  const rows = [
    ["Name", name],
    ["Phone", phone],
    ["Date", formatted],
    ["Time", timeStr],
    ["Guests", guests],
    ["Seating", seat],
  ];
  if (note.trim()) rows.push(["Requests", note]);

  document.getElementById("booking-summary").innerHTML = rows
    .map(
      ([k, v]) =>
        `<div class="summary-row"><span>${k}</span><span>${v}</span></div>`,
    )
    .join("");

  // Show step 2
  document.getElementById("step-1").style.display = "none";
  document.getElementById("step-2").style.display = "block";
  document.getElementById("step-dot-2").classList.add("active");
}

function goBackStep1() {
  document.getElementById("step-2").style.display = "none";
  document.getElementById("step-1").style.display = "block";
  document.getElementById("step-dot-2").classList.remove("active");
}

function confirmBooking() {
  const name = document.getElementById("b-name").value;
  const date = document.getElementById("b-date").value;
  const time = document.getElementById("b-time").value;
  const guests = document.getElementById("b-guests").value;

  const dateObj = new Date(date);
  const dateStr = dateObj.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const [h, m] = time.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const timeStr = `${hour % 12 || 12}:${m} ${ampm}`;

  document.getElementById("success-msg").textContent =
    `Hey ${name}! Your table for ${guests} is booked on ${dateStr} at ${timeStr}. We'll send a confirmation to your phone. See you soon! 🍔`;

  document.getElementById("step-2").style.display = "none";
  document.getElementById("booking-success").style.display = "block";
  showToast("🎉 Table booked successfully!");
}

function resetBooking() {
  document.getElementById("booking-form").reset();
  document.getElementById("booking-success").style.display = "none";
  document.getElementById("step-1").style.display = "block";
  document.getElementById("step-dot-2").classList.remove("active");
}

// ── STAR RATING PICKER ──
let selectedStars = 0;

document.querySelectorAll(".star-pick").forEach((star) => {
  star.addEventListener("mouseenter", () => {
    const val = parseInt(star.dataset.val);
    document.querySelectorAll(".star-pick").forEach((s) => {
      s.classList.toggle("active", parseInt(s.dataset.val) <= val);
    });
  });
  star.addEventListener("mouseleave", () => {
    document.querySelectorAll(".star-pick").forEach((s) => {
      s.classList.toggle("active", parseInt(s.dataset.val) <= selectedStars);
    });
  });
  star.addEventListener("click", () => {
    selectedStars = parseInt(star.dataset.val);
    const labels = [
      "",
      "Poor 😕",
      "Fair 😐",
      "Good 🙂",
      "Great 😄",
      "Amazing! 🤩",
    ];
    document.getElementById("star-label").textContent = labels[selectedStars];
    document.querySelectorAll(".star-pick").forEach((s) => {
      s.classList.toggle("active", parseInt(s.dataset.val) <= selectedStars);
    });
  });
});

// ── SUBMIT REVIEW ──
function submitReview(e) {
  e.preventDefault();
  if (selectedStars === 0) {
    showToast("⚠️ Please select a star rating first!");
    return;
  }
  const name = document.getElementById("rev-name").value.trim();
  const loc = document.getElementById("rev-loc").value.trim() || "Mumbai";
  const text = document.getElementById("rev-text").value.trim();
  const stars = "⭐".repeat(selectedStars);

  // Color pool for avatars
  const colors = [
    "#ff4d4d",
    "#7c3aed",
    "#22c55e",
    "#f59e0b",
    "#0ea5e9",
    "#ec4899",
    "#14b8a6",
  ];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const initial = name.charAt(0).toUpperCase();

  const card = document.createElement("div");
  card.className = "review-card";
  card.style.animation = "fadeInUp 0.4s ease";
  card.innerHTML = `
    <div class="rev-header">
      <div class="rev-avatar" style="background:${color}">${initial}</div>
      <div><strong>${name}</strong><span>${loc}</span></div>
      <div class="rev-stars">${stars}</div>
    </div>
    <p>"${text}"</p>
    <span class="rev-date">Just now</span>
  `;

  // Prepend to grid
  const grid = document.getElementById("reviews-grid");
  grid.insertBefore(card, grid.firstChild);

  // Reset form
  e.target.reset();
  selectedStars = 0;
  document
    .querySelectorAll(".star-pick")
    .forEach((s) => s.classList.remove("active"));
  document.getElementById("star-label").textContent = "Click to rate";
  showToast("✅ Your review has been posted!");
}

// Add fadeInUp keyframe if not present
const kf = document.createElement("style");
kf.textContent =
  "@keyframes fadeInUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }";
document.head.appendChild(kf);

// Set min date for booking to today
const dateInput = document.getElementById("b-date");
if (dateInput) {
  const today = new Date().toISOString().split("T")[0];
  dateInput.min = today;
}
