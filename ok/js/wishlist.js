class WishlistManager {
    constructor() {
        this.items = new Set(JSON.parse(localStorage.getItem('wishlist')) || []);
        this.wishlistGrid = document.getElementById('wishlistGrid');
        this.emptyWishlist = document.getElementById('emptyWishlist');
        this.wishlistCount = document.getElementById('wishlistCount');
        this.wishlistItemCount = document.getElementById('wishlistItemCount');
        
        this.init();
    }

    init() {
        this.render();
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.wishlistGrid.addEventListener('click', (e) => {
            const target = e.target;
            const wishlistItem = target.closest('.wishlist-item');
            if (!wishlistItem) return;

            const itemId = parseInt(wishlistItem.dataset.id);

            if (target.classList.contains('remove-btn')) {
                this.removeItem(itemId);
            } else if (target.classList.contains('add-to-cart-btn')) {
                this.addToCart(itemId);
            }
        });
    }

    addItem(itemId) {
        this.items.add(itemId);
        this.saveWishlist();
        this.render();
    }

    removeItem(itemId) {
        const wishlistItem = document.querySelector(`[data-id="${itemId}"]`);
        wishlistItem.classList.add('removing');
        
        setTimeout(() => {
            this.items.delete(itemId);
            this.saveWishlist();
            this.render();
        }, 300);
    }

    addToCart(itemId) {
        window.cart.addItem(itemId);
        this.showNotification('Item added to cart');
    }

    saveWishlist() {
        localStorage.setItem('wishlist', JSON.stringify(Array.from(this.items)));
        this.updateWishlistCount();
    }

    updateWishlistCount() {
        const count = this.items.size;
        this.wishlistCount.textContent = count;
        this.wishlistItemCount.textContent = `${count} item${count !== 1 ? 's' : ''}`;
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'wishlist-notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }

    render() {
        if (this.items.size === 0) {
            this.wishlistGrid.classList.add('hidden');
            this.emptyWishlist.classList.remove('hidden');
            return;
        }

        this.wishlistGrid.classList.remove('hidden');
        this.emptyWishlist.classList.add('hidden');

        this.wishlistGrid.innerHTML = Array.from(this.items).map(itemId => {
            const laptop = laptops.find(l => l.id === itemId);
            if (!laptop) return '';

            return `
                <div class="wishlist-item" data-id="${laptop.id}">
                    <img src="${laptop.image}" alt="${laptop.name}" class="wishlist-item-image">
                    <div class="wishlist-item-content">
                        <h3 class="wishlist-item-name">${laptop.name}</h3>
                        <p class="wishlist-item-specs">${laptop.description}</p>
                        <div class="wishlist-item-price">₹${laptop.price.toLocaleString()}</div>
                        <div class="wishlist-item-actions">
                            <button class="wishlist-action-btn add-to-cart-btn">
                                Add to Cart
                            </button>
                            <button class="wishlist-action-btn remove-btn">
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        this.updateWishlistCount();
    }
}

// Initialize wishlist when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.wishlist = new WishlistManager();
});