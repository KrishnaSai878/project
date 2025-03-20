// Initialize FilterManager, SortManager, Wishlist, and Cart
const filterManager = new FilterManager();
const sortManager = new SortManager();
const wishlist = new Wishlist();
const cart = new Cart();

// Render laptops based on filters and sorting
function renderLaptops(laptops) {
  const laptopGrid = document.getElementById('laptopGrid');
  laptopGrid.innerHTML = laptops.map(laptop => `
    <div class="laptop-item">
      <img src="${laptop.image}" alt="${laptop.name}">
      <h3>${laptop.name}</h3>
      <p>Brand: ${laptop.brand}</p>
      <p>Price: $${laptop.price}</p>
      <p>RAM: ${laptop.ram}GB</p>
      <p>Storage: ${laptop.storage}GB</p>
      <p>Category: ${laptop.category}</p>
      <button onclick="addToWishlist(${laptop.id})">Add to Wishlist</button>
      <button onclick="addToCart(${laptop.id})">Add to Cart</button>
    </div>
  `).join('');
}

// Function to add a laptop to the wishlist
function addToWishlist(laptopId) {
  if (wishlist.toggleItem(laptopId)) {
    alert('Added to wishlist');
  } else {
    alert('Removed from wishlist');
  }
}

// Function to add a laptop to the cart
function addToCart(laptopId) {
  const laptop = laptops.find(l => l.id === laptopId);
  cart.addItem(laptop);
}

// Initial rendering of laptops
renderLaptops(laptops);
