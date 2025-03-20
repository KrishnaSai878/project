export class CartPage {
    constructor() {
        this.cartItems = document.getElementById('cartItems');
        this.cartContent = document.getElementById('cartContent');
        this.emptyCart = document.getElementById('emptyCart');
        this.subtotalEl = document.getElementById('subtotal');
        this.shippingEl = document.getElementById('shipping');
        this.totalEl = document.getElementById('total');
        this.checkoutBtn = document.getElementById('checkoutBtn');

        this.setupEventListeners();
        this.render();
    }

    setupEventListeners() {
        this.cartItems.addEventListener('click', (e) => {
            const target = e.target;
            if (target.matches('.quantity-btn')) {
                const itemId = parseInt(target.closest('.cart-item').dataset.id);
                const isIncrease = target.dataset.action === 'increase';
                window.cart.updateQuantity(itemId, isIncrease);
                this.render();
            } else if (target.matches('.remove-btn')) {
                const itemId = parseInt(target.closest('.cart-item').dataset.id);
                this.handleRemoveItem(itemId);
            }
        });

        this.checkoutBtn.addEventListener('click', () => {
            alert('Checkout functionality coming soon!');
        });
    }

    handleRemoveItem(itemId) {
        const item = this.cartItems.querySelector(`[data-id="${itemId}"]`);
        item.classList.add('removing');
        
        setTimeout(() => {
            window.cart.removeItem(itemId);
            this.render();
        }, 300);
    }

    render() {
        const items = window.cart.getItems();
        
        if (items.length === 0) {
            this.cartContent.classList.add('hidden');
            this.emptyCart.classList.remove('hidden');
            return;
        }

        this.cartContent.classList.remove('hidden');
        this.emptyCart.classList.add('hidden');

        this.renderCartItems(items);
        this.renderSummary();
    }

    renderCartItems(items) {
        this.cartItems.innerHTML = items.map(item => {
            const laptop = laptops.find(l => l.id === item.id);
            if (!laptop) return '';

            return `
                <div class="cart-item" data-id="${laptop.id}">
                    <img src="${laptop.image}" alt="${laptop.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <h3>${laptop.name}</h3>
                        <p class="cart-item-specs">${laptop.description}</p>
                        <div class="cart-item-actions">
                            <div class="quantity-control">
                                <button class="quantity-btn" data-action="decrease">-</button>
                                <span class="quantity-input">${item.quantity}</span>
                                <button class="quantity-btn" data-action="increase">+</button>
                            </div>
                            <button class="remove-btn">Remove</button>
                        </div>
                    </div>
                    <div class="cart-item-total">
                        $${(laptop.price * item.quantity).toLocaleString()}
                    </div>
                </div>
            `;
        }).join('');
    }

    renderSummary() {
        const { subtotal, shipping, total } = window.cart.calculateTotals();
        this.subtotalEl.textContent = `$${subtotal.toLocaleString()}`;
        this.shippingEl.textContent = `$${shipping.toLocaleString()}`;
        this.totalEl.textContent = `$${total.toLocaleString()}`;
    }
}