
const API_URL = 'https://codealpha-ecommerce-store-4cr7.onrender.com/api';
let isLoginMode = true;
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let token = localStorage.getItem('token') || null;

// === UI Functions ===
function showSection(sectionId) {
  document.getElementById('products-section').style.display = 'none';
  document.getElementById('cart-section').style.display = 'none';
  document.getElementById('login-section').style.display = 'none';
  document.getElementById('profile-section').style.display = 'none';
  
  document.getElementById(`${sectionId}-section`).style.display = 'block';
  
  if (sectionId === 'cart') renderCart();
  if (sectionId === 'profile') renderProfile();
}

function updateCartCount() {
  document.getElementById('cart-count').textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}

function checkAuth() {
  const authLink = document.getElementById('auth-link');
  const logoutBtn = document.getElementById('logout-btn');
  const profileLink = document.getElementById('profile-link');
  
  if (token) {
    authLink.style.display = 'none';
    logoutBtn.style.display = 'inline';
    if(profileLink) profileLink.style.display = 'inline';
  } else {
    authLink.style.display = 'inline';
    logoutBtn.style.display = 'none';
    if(profileLink) profileLink.style.display = 'none';
  }
}

// === Products Functions ===
async function fetchProducts() {
  try {
    const res = await fetch(`${API_URL}/products`);
    const products = await res.json();
    const list = document.getElementById('product-list');
    
    if (products.length === 0) {
      list.innerHTML = '<p style="text-align:center; width:100%;">No products available.</p>';
      return;
    }

    list.innerHTML = products.map(p => `
      <div class="product-card">
        <img src="${p.image || 'https://via.placeholder.com/300'}" alt="${p.name}">
        <div class="product-info">
          <div class="product-category">${p.category || 'General'}</div>
          <h3>${p.name}</h3>
          <p>${p.description || 'No description'}</p>
          <div class="product-price">₹${p.price.toLocaleString('en-IN')}</div>
          <button class="btn" onclick="addToCart('${p._id}', '${p.name}', ${p.price})">Add to Cart</button>
        </div>
      </div>
    `).join('');
  } catch (err) {
    console.error(err);
    document.getElementById('product-list').innerHTML = '<p>Error loading products.</p>';
  }
}

// === Cart Functions ===
function addToCart(id, name, price) {
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id, name, price, quantity: 1 });
  }
  saveCart();
  alert(`${name} added to cart!`);
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  if (document.getElementById('cart-section').style.display !== 'none') renderCart();
}

function renderCart() {
  const cartItems = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');
  
  if (cart.length === 0) {
    cartItems.innerHTML = '<p>Your cart is empty.</p>';
    totalEl.textContent = '';
    document.getElementById('checkout-btn').style.display = 'none';
    return;
  }

  document.getElementById('checkout-btn').style.display = 'block';
  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div>${item.name} (x${item.quantity})</div>
      <div>₹${(item.price * item.quantity).toLocaleString('en-IN')}</div>
    </div>
  `).join('');

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  totalEl.textContent = `Total: ₹${total.toLocaleString('en-IN')}`;
}

async function placeOrder() {
  if (!token) {
    alert('Please login first to place an order.');
    showSection('login');
    return;
  }
  if (cart.length === 0) return;
  alert('Order placed successfully! (Demo)');
  cart = [];
  saveCart();
  renderCart();
  showSection('products');
}

// === Auth Functions ===
function toggleAuthMode() {
  isLoginMode = !isLoginMode;
  document.getElementById('form-title').textContent = isLoginMode ? 'Login' : 'Register';
  document.getElementById('submit-btn').textContent = isLoginMode ? 'Login' : 'Register';
  document.getElementById('name').style.display = isLoginMode ? 'none' : 'block';
  document.getElementById('toggle-text').textContent = isLoginMode ? "Don't have an account? Register" : "Already have an account? Login";
}

async function handleAuth() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const name = document.getElementById('name').value;
  
  const endpoint = isLoginMode ? '/users/login' : '/users/register';
  const body = isLoginMode ? { email, password } : { name, email, password };

  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await res.json();

    if (res.ok) {
      if (isLoginMode) {
        token = data.token;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(data.user)); // ✅ యూజర్ డేటా సేవ్
        
        alert('Login successful!');
        checkAuth();
        showSection('products');
      } else {
        alert('Registration successful! Please login now.');
        toggleAuthMode();
      }
    } else {
      alert(data.message || 'Something went wrong');
    }
  } catch (err) {
    alert('Error connecting to server');
  }
}

function logout() {
  token = null;
  localStorage.removeItem('token');
  localStorage.removeItem('user'); // ✅ లాగ్ అవుట్ అయ్యాక క్లియర్
  checkAuth();
  alert('Logged out successfully');
  showSection('products');
}

// === Profile Functions ===
function renderProfile() {
  const profileCard = document.getElementById('profile-card');
  const userStr = localStorage.getItem('user');
  
  if (!userStr) {
    profileCard.innerHTML = '<p>Please login to view your profile.</p>';
    return;
  }
  
  const user = JSON.parse(userStr);
  const initial = user.name ? user.name.charAt(0).toUpperCase() : 'U';
  
  profileCard.innerHTML = `
    <div class="profile-avatar">${initial}</div>
    <h3>${user.name || 'User'}</h3>
    <p class="email">${user.email}</p>
    
    <div class="profile-details">
      <p><strong>Account Type:</strong> Customer</p>
      <p><strong>Status:</strong> Active</p>
      <p><strong>Member Since:</strong> ${new Date().toLocaleDateString()}</p>
    </div>
    
    <button class="btn" onclick="logout()" style="background: #ef4444; box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);">Logout</button>
  `;
}

// === Initialize ===
fetchProducts();
updateCartCount();
checkAuth();