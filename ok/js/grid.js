class LaptopGrid {
  constructor() {
    this.laptopsPerPage = 20;
    this.currentPage = 1;
    this.currentLaptops = [...laptops];
    this.container = document.querySelector('.laptops-container');
    this.paginationContainer = document.querySelector('.pagination');
    this.setupGrid();
    this.setupEventListeners();
  }

  setupGrid() {
    this.renderLaptops(this.currentLaptops);
  }

  renderLaptops(laptopsToRender) {
    this.currentLaptops = laptopsToRender;
    this.currentPage = 1;
    this.renderPage();
  }

  renderPage() {
    const startIndex = (this.currentPage - 1) * this.laptopsPerPage;
    const endIndex = startIndex + this.laptopsPerPage;
    const laptopsToShow = this.currentLaptops.slice(startIndex, endIndex);

    this.container.innerHTML = laptopsToShow.map(laptop => this.createLaptopCard(laptop)).join('');
    this.setupCardActions();
    this.renderPagination();
  }

  createLaptopCard(laptop) {
    return `
      <div class="laptop-card" data-id="${laptop.id}">
        <img src="${laptop.image}" alt="${laptop.name}" class="laptop-image">
        <div class="laptop-info">
          <h3 class="laptop-name">${laptop.name}</h3>
          <p class="laptop-specs">
            ${laptop.processor} • ${laptop.ram}GB RAM • ${laptop.storage}GB Storage
          </p>
          <p class="laptop-category">${laptop.category.charAt(0).toUpperCase() + laptop.category.slice(1)}</p>
          <div class="laptop-price">$${laptop.price.toLocaleString()}</div>
          <div class="laptop-actions">
            <button class="action-btn wishlist-btn ${wishlist.isInWishlist(laptop.id) ? 'active' : ''}" data-id="${laptop.id}">
              <img src="images/heart.svg" alt="Add to wishlist">
            </button>
            <button class="action-btn cart-btn" data-id="${laptop.id}">
              <img src="images/cart.svg" alt="Add to cart">
            </button>
          </div>
        </div>
      </div>
    `;
  }

  setupCardActions() {
    // Wishlist button actions
    this.container.querySelectorAll('.wishlist-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const laptopId = parseInt(btn.dataset.id);
        const isInWishlist = wishlist.toggleItem(laptopId);
        btn.classList.toggle('active', isInWishlist);
        this.showNotification(isInWishlist ? 'Added to wishlist' : 'Removed from wishlist');
      });
    });

    // Cart button actions
    this.container.querySelectorAll('.cart-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const laptopId = parseInt(btn.dataset.id);
        const laptop = this.currentLaptops.find(l => l.id === laptopId);
        if (laptop) {
          cart.addItem(laptop);
          this.showNotification('Added to cart');
        }
      });
    });
  }

  renderPagination() {
    const totalPages = Math.ceil(this.currentLaptops.length / this.laptopsPerPage);
    
    let paginationHTML = '';
    if (totalPages > 1) {
      paginationHTML += `
        <button class="page-btn" ${this.currentPage === 1 ? 'disabled' : ''} data-page="${this.currentPage - 1}">
          Previous
        </button>
      `;

      for (let i = Math.max(1, this.currentPage - 2); i <= Math.min(totalPages, this.currentPage + 2); i++) {
        paginationHTML += `
          <button class="page-btn ${i === this.currentPage ? 'active' : ''}" data-page="${i}">
            ${i}
          </button>
        `;
      }

      paginationHTML += `
        <button class="page-btn" ${this.currentPage === totalPages ? 'disabled' : ''} data-page="${this.currentPage + 1}">
          Next
        </button>
      `;
    }

    this.paginationContainer.innerHTML = paginationHTML;
    this.setupPaginationEvents();
  }

  setupPaginationEvents() {
    this.paginationContainer.querySelectorAll('.page-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!btn.disabled) {
          this.currentPage = parseInt(btn.dataset.page);
          this.renderPage();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });
  }

  showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 10);

    // Remove notification after animation
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 2000);
  }

  setupEventListeners() {
    // Add keyboard navigation for pagination
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft' && this.currentPage > 1) {
        this.currentPage--;
        this.renderPage();
      } else if (e.key === 'ArrowRight' && this.currentPage < Math.ceil(this.currentLaptops.length / this.laptopsPerPage)) {
        this.currentPage++;
        this.renderPage();
      }
    });

    // Add resize handler for responsive adjustments
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.adjustGridLayout();
      }, 250);
    });
  }

  adjustGridLayout() {
    const width = window.innerWidth;
    if (width < 640) {
      this.container.style.gridTemplateColumns = '1fr';
    } else if (width < 1024) {
      this.container.style.gridTemplateColumns = 'repeat(2, 1fr)';
    } else {
      this.container.style.gridTemplateColumns = 'repeat(3, 1fr)';
    }
  }

  applyFilters(filters) {
    const filteredLaptops = this.currentLaptops.filter(laptop => {
      const matchesBrand = filters.brands.size === 0 || filters.brands.has(laptop.brand);
      const matchesPrice = laptop.price >= filters.priceRange[0] && laptop.price <= filters.priceRange[1];
      const matchesRam = filters.ram.size === 0 || filters.ram.has(laptop.ram);
      const matchesStorage = filters.storage.size === 0 || filters.storage.has(laptop.storage);
      const matchesCategory = filters.category.size === 0 || filters.category.has(laptop.category);

      return matchesBrand && matchesPrice && matchesRam && matchesStorage && matchesCategory;
    });

    this.renderLaptops(filteredLaptops);
  }

  applySorting(sortConfig) {
    const { field, direction } = sortConfig;
    
    const sortedLaptops = [...this.currentLaptops].sort((a, b) => {
      let comparison = 0;
      
      if (field === 'price') {
        comparison = a.price - b.price;
      } else if (field === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (field === 'brand') {
        comparison = a.brand.localeCompare(b.brand);
      }

      return direction === 'asc' ? comparison : -comparison;
    });

    this.renderLaptops(sortedLaptops);
  }

  getCurrentLaptops() {
    return this.currentLaptops;
  }
}

// Initialize the grid when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.laptopGrid = new LaptopGrid();
});