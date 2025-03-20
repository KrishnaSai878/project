document.addEventListener('DOMContentLoaded', () => {
    const laptopGrid = document.getElementById('laptopGrid');

    function createLaptopCard(laptop) {
        const card = document.createElement('div');
        card.className = 'laptop-card';
        card.innerHTML = `
            <img src="${laptop.image}" alt="${laptop.name}" class="laptop-image">
            <div class="laptop-info">
                <h3 class="laptop-name">${laptop.name}</h3>
                <p class="laptop-description">${laptop.description}</p>
                <div class="laptop-price">₹${laptop.price}</div>
                <div class="laptop-actions">
                    <button class="action-btn wishlist-btn" data-id="${laptop.id}">
                        <img src="images/heart.svg" alt="Add to wishlist">
                    </button>
                    <button class="action-btn cart-btn" data-id="${laptop.id}">
                        <img src="images/cart.svg" alt="Add to cart">
                    </button>
                </div>
            </div>
        `;

        const wishlistBtn = card.querySelector('.wishlist-btn');
        const cartBtn = card.querySelector('.cart-btn');

        wishlistBtn.addEventListener('click', () => {
            const isInWishlist = wishlist.toggleItem(laptop.id);
            wishlistBtn.classList.toggle('active', isInWishlist);
        });

        cartBtn.addEventListener('click', () => {
            cart.addItem(laptop);
            showNotification(`${laptop.name} added to cart!`);
        });

        return card;
    }

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Render laptop cards
    laptops.forEach(laptop => {
        laptopGrid.appendChild(createLaptopCard(laptop));
    });
});