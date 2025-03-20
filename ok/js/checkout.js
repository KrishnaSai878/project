class CheckoutManager {
    constructor() {
        this.form = document.getElementById('checkoutForm');
        this.modal = document.getElementById('successModal');
        this.summaryItems = document.getElementById('summaryItems');
        this.subtotalEl = document.getElementById('subtotal');
        this.shippingEl = document.getElementById('shipping');
        this.totalEl = document.getElementById('total');
        
        this.laptops = JSON.parse(localStorage.getItem('laptops')) || []; // Assuming laptop data is in localStorage
        this.cartItems = JSON.parse(localStorage.getItem('cart')) || []; // Load cart items
        
        this.init();
    }

    init() {
        this.loadCartItems();
        this.setupFormValidation();
        this.setupPaymentValidation();
    }

    loadCartItems() {
        if (this.cartItems.length === 0) {
            window.location.href = 'cart.html'; // Redirect if cart is empty
            return;
        }

        // Render the cart items in the summary
        this.summaryItems.innerHTML = this.cartItems.map(item => {
            const laptop = this.laptops.find(l => l.id === item.id); // Find the laptop in the laptops data
            if (!laptop) return ''; // Skip if laptop not found

            return `
                <div class="summary-item">
                    <img src="${laptop.image}" alt="${laptop.name}">
                    <div class="summary-item-details">
                        <h3>${laptop.name}</h3>
                        <p>Quantity: ${item.quantity}</p>
                    </div>
                    <div class="summary-item-price">
                        ₹${(laptop.price * item.quantity).toLocaleString()} <!-- Display price for each item -->
                    </div>
                </div>
            `;
        }).join('');

        // Calculate totals and update the summary
        const { subtotal, shipping, total } = this.calculateTotals();
        this.subtotalEl.textContent = `₹${subtotal.toLocaleString()}`; // Update subtotal
        this.shippingEl.textContent = `₹${shipping.toLocaleString()}`; // Update shipping cost
        this.totalEl.textContent = `₹${total.toLocaleString()}`; // Update total
    }

    calculateTotals() {
        const subtotal = this.cartItems.reduce((sum, item) => {
            const laptop = this.laptops.find(l => l.id === item.id);
            return sum + (laptop ? laptop.price * item.quantity : 0);
        }, 0);

        // You can modify the shipping cost logic if needed
        const shipping = subtotal > 0 ? 50 : 0; // Example: flat shipping cost of ₹50
        const total = subtotal + shipping;

        return { subtotal, shipping, total };
    }

    setupFormValidation() {
        const inputs = this.form.querySelectorAll('input[required], textarea[required]');
        
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.validateInput(input);
            });

            input.addEventListener('blur', () => {
                this.validateInput(input);
            });
        });

        this.form.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent form submission

            let isValid = true;
            inputs.forEach(input => {
                if (!this.validateInput(input)) {
                    isValid = false;
                }
            });

            if (!this.validatePayment()) {
                isValid = false;
            }

            if (isValid) {
                this.processOrder();
            }
        });
    }

    validateInput(input) {
        const formGroup = input.closest('.form-group');
        const errorMessage = formGroup.querySelector('.error-message');
        
        let isValid = true;
        let message = '';

        if (!input.value.trim()) {
            isValid = false;
            message = 'This field is required'; // Message for empty field
        } else if (input.pattern) {
            const regex = new RegExp(input.pattern);
            if (!regex.test(input.value)) {
                isValid = false;
                switch (input.name) {
                    case 'number':
                        message = 'Please enter a valid 10-digit phone number';
                        break;
                    case 'pin':
                        message = 'Please enter a valid 6-digit PIN code';
                        break;
                    default:
                        message = 'Please enter a valid value';
                }
            }
        }

        formGroup.classList.toggle('error', !isValid);
        errorMessage.textContent = message;
        return isValid;
    }

    setupPaymentValidation() {
        const paymentOptions = this.form.querySelectorAll('input[name="payment"]');
        const errorMessage = document.getElementById('payment-error');

        paymentOptions.forEach(option => {
            option.addEventListener('change', () => {
                errorMessage.style.display = 'none'; // Hide the error message when user selects a payment option
            });
        });
    }

    validatePayment() {
        const selectedPayment = this.form.querySelector('input[name="payment"]:checked');
        const errorMessage = document.getElementById('payment-error');

        if (!selectedPayment) {
            errorMessage.textContent = 'Please select a payment method'; // Show error if no payment method selected
            errorMessage.style.display = 'block';
            return false;
        }

        errorMessage.style.display = 'none'; // Hide error if a payment method is selected
        return true;
    }

    processOrder() {
        // Generate random order number
        const orderNumber = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
        document.getElementById('orderNumber').textContent = orderNumber;

        // Clear cart
        localStorage.removeItem('cart');
        document.getElementById('cartCount').textContent = '0';

        // Show success modal
        this.modal.style.display = 'block';
        setTimeout(() => {
            this.modal.classList.add('show');
        }, 10);

        // Redirect after delay
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 5000);
    }
}

// Initialize checkout when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CheckoutManager();
});
