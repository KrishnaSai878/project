import laptops from './js/data.js';
class CartManager {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.cartCount = document.getElementById('cartCount');
        this.updateCartCount();
        
        // Setup cart button click handler
        const cartBtn = document.getElementById('cartBtn');
        if (cartBtn) {
            cartBtn.addEventListener('click', () => {
                // If we're not on the cart page, show the modal
                if (!window.location.pathname.includes('cart.html')) {
                    this.showCartModal();
                }
            });
        }
    }

    getItems() {
        return this.items;
    }

    addItem(itemId) {
        const existingItem = this.items.find(item => item.id === itemId);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            this.items.push({ id: itemId, quantity: 1 });
        }
        this.saveCart();
        this.showNotification('Item added to cart');
    }

    removeItem(itemId) {
        const index = this.items.findIndex(item => item.id === itemId);
        if (index !== -1) {
            this.items.splice(index, 1);
            this.saveCart();
            this.showNotification('Item removed from cart');
        }
    }

    updateQuantity(itemId, isIncrease) {
        const item = this.items.find(item => item.id === itemId);
        if (item) {
            if (isIncrease) {
                item.quantity++;
            } else if (item.quantity > 1) {
                item.quantity--;
            }
            this.saveCart();
        }
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
        this.updateCartCount();
        
        // Update modal if it exists
        const modal = document.getElementById('cartModal');
        if (modal && modal.style.display === 'block') {
            this.updateCartModal();
        }
    }

    updateCartCount() {
        const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
        const cartCountElements = document.querySelectorAll('#cartCount');
        cartCountElements.forEach(element => {
            element.textContent = totalItems;
        });
    }

    calculateTotals() {
        const subtotal = this.items.reduce((sum, item) => {
            const laptop = laptops.find(l => l.id === item.id);
            return sum + (laptop ? laptop.price * item.quantity : 0);
        }, 0);

        const shipping = subtotal > 0 ? 10 : 0;
        const total = subtotal + shipping;

        return { subtotal, shipping, total };
    }

    showCartModal() {
        // Import and show cart modal
        import('./components/CartModal.js').then(module => {
            const modal = new module.CartModal();
            modal.open();
        });
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        // Trigger animation
        setTimeout(() => notification.classList.add('show'), 10);

        // Remove notification
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }

    updateCartModal() {
        const modal = document.querySelector('#cartModal');
        if (modal) {
            const modalCartItems = modal.querySelector('#modalCartItems');
            const modalSubtotal = modal.querySelector('#modalSubtotal');
            const modalShipping = modal.querySelector('#modalShipping');
            const modalTotal = modal.querySelector('#modalTotal');

            if (this.items.length === 0) {
                modalCartItems.innerHTML = `
                    <div class="empty-cart-message">
                        <p>Your cart is empty</p>
                        <a href="laptops.html" class="browse-btn">Browse Laptops</a>
                    </div>
                `;
                modalSubtotal.textContent = '$0';
                modalShipping.textContent = '$0';
                modalTotal.textContent = '$0';
                return;
            }

            modalCartItems.innerHTML = this.items.map(item => {
                const laptop = laptops.find(l => l.id === item.id);
                if (!laptop) return '';

                return `
                    <div class="modal-cart-item" data-id="${laptop.id}">
                        <img src="${laptop.image}" alt="${laptop.name}" class="cart-item-image">
                        <div class="cart-item-details">
                            <h3>${laptop.name}</h3>
                            <p class="cart-item-price">$${laptop.price.toLocaleString()} × ${item.quantity}</p>
                        </div>
                        <button class="remove-btn" data-id="${laptop.id}">×</button>
                    </div>
                `;
            }).join('');

            const { subtotal, shipping, total } = this.calculateTotals();
            modalSubtotal.textContent = `$${subtotal.toLocaleString()}`;
            modalShipping.textContent = `$${shipping.toLocaleString()}`;
            modalTotal.textContent = `$${total.toLocaleString()}`;
        }
    }
}

// Initialize cart when DOM is loaded

document.addEventListener('DOMContentLoaded', function () {
    // This ensures the code inside this block only runs once the DOM is fully loaded.
    
    const removeBtns = document.querySelectorAll('.remove-btn'); // Example selector, change according to your case
    removeBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            // Code to handle the button click event, e.g. removing an item from the cart
            const itemId = btn.dataset.id;
            console.log('Removing item with ID:', itemId);
        });
    });
});

