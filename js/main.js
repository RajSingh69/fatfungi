const cartToggle = document.getElementById("cartToggle");
const cartClose = document.getElementById("cartClose");
const cartDrawer = document.getElementById("cartDrawer");
const cartItemsContainer = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const addCartButtons = document.querySelectorAll(".add-cart");
const cursorGlow = document.querySelector(".cursor-glow");
const rippleTargets = document.querySelectorAll(".ripple-target");
const hoverSporeTargets = document.querySelectorAll(".hover-spores");
const ambientToggle = document.getElementById("ambientToggle");
const ambientAudio = document.getElementById("ambientAudio");

const layerBack = document.querySelector(".layer-back");
const layerMid = document.querySelector(".layer-mid");
const layerFront = document.querySelector(".layer-front");

let cart = [];
let ambientOn = false;

function openCart() {
  if (cartDrawer) {
    cartDrawer.classList.add("open");
  }
}

function closeCart() {
  if (cartDrawer) {
    cartDrawer.classList.remove("open");
  }
}

function formatPrice(value) {
  return `£${value.toFixed(2)}`;
}

function updateCartUI() {
  if (!cartItemsContainer || !cartCount || !cartTotal) return;

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  cartCount.textContent = totalItems;
  cartTotal.textContent = formatPrice(totalPrice);

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `<p class="empty-cart">Your cart is empty.</p>`;
    return;
  }

  cartItemsContainer.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item">
          <h4>${item.name}</h4>
          <p>${formatPrice(item.price)} × ${item.quantity}</p>
        </div>
      `
    )
    .join("");
}

function addToCart(name, price) {
  const existingItem = cart.find((item) => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name,
      price,
      quantity: 1,
    });
  }

  updateCartUI();
  openCart();
}

if (cartToggle) {
  cartToggle.addEventListener("click", openCart);
}

if (cartClose) {
  cartClose.addEventListener("click", closeCart);
}

document.addEventListener("click", (event) => {
  if (
    cartDrawer &&
    cartToggle &&
    cartDrawer.classList.contains("open") &&
    !cartDrawer.contains(event.target) &&
    !cartToggle.contains(event.target)
  ) {
    closeCart();
  }
});

addCartButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const name = button.dataset.name;
    const price = parseFloat(button.dataset.price);

    if (!name || Number.isNaN(price)) return;

    addToCart(name, price);
  });
});

if (cursorGlow) {
  document.addEventListener("mousemove", (e) => {
    cursorGlow.style.left = `${e.clientX}px`;
    cursorGlow.style.top = `${e.clientY}px`;
  });
}

window.addEventListener("scroll", () => {
  const y = window.scrollY;

  if (layerBack) {
    layerBack.style.transform = `translateY(${y * 0.08}px)`;
  }

  if (layerMid) {
    layerMid.style.transform = `translateY(${y * 0.16}px)`;
  }

  if (layerFront) {
    layerFront.style.transform = `translateY(${y * 0.24}px)`;
  }
});

rippleTargets.forEach((target) => {
  target.addEventListener("click", function (e) {
    const rect = this.getBoundingClientRect();
    const ripple = document.createElement("span");
    const size = Math.max(rect.width, rect.height);

    ripple.classList.add("ripple");
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

    this.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 700);
  });
});

function createHoverSporeBurst(target) {
  for (let i = 0; i < 6; i++) {
    const spore = document.createElement("span");
    spore.classList.add("hover-spore");

    const left = 20 + Math.random() * 60;
    const bottom = 10 + Math.random() * 30;
    const delay = Math.random() * 0.4;
    const size = 4 + Math.random() * 6;

    spore.style.left = `${left}%`;
    spore.style.bottom = `${bottom}px`;
    spore.style.width = `${size}px`;
    spore.style.height = `${size}px`;
    spore.style.animationDelay = `${delay}s`;

    target.appendChild(spore);

    setTimeout(() => {
      spore.remove();
    }, 1800);
  }
}

hoverSporeTargets.forEach((target) => {
  let lastBurst = 0;

  target.addEventListener("mouseenter", () => {
    const now = Date.now();
    if (now - lastBurst > 500) {
      createHoverSporeBurst(target);
      lastBurst = now;
    }
  });
});

if (ambientToggle) {
  ambientToggle.addEventListener("click", async () => {
    ambientOn = !ambientOn;
    document.body.classList.toggle("ambient-mode", ambientOn);
    ambientToggle.classList.toggle("active", ambientOn);
    ambientToggle.textContent = ambientOn ? "Ambient On" : "Ambient Mode";

    if (ambientAudio) {
      try {
        if (ambientOn) {
          await ambientAudio.play();
        } else {
          ambientAudio.pause();
          ambientAudio.currentTime = 0;
        }
      } catch (error) {
        console.log("Ambient audio file not found yet. Add audio/ambient.mp3 later.");
      }
    }
  });
}

updateCartUI();
