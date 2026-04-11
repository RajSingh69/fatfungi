const cartToggle = document.getElementById("cartToggle");
const cartClose = document.getElementById("cartClose");
const cartDrawer = document.getElementById("cartDrawer");
const cartItemsContainer = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const addCartButtons = document.querySelectorAll(".add-cart");

let cart = [];

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

updateCartUI();
