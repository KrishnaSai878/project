class FilterManager {
    constructor() {
      this.filters = {
        brands: new Set(),
        priceRange: [0, 5000],
        ram: new Set(),
        storage: new Set(),
        category: new Set()
      };
      
      this.setupFilterUI();
    }
  
    setupFilterUI() {
      // Get unique values for filter options
      const brands = new Set(laptops.map(l => l.brand));
      const ramOptions = new Set(laptops.map(l => l.ram));
      const storageOptions = new Set(laptops.map(l => l.storage));
      const categories = new Set(laptops.map(l => l.category));
  
      const filterContainer = document.getElementById('filterContainer');
      filterContainer.innerHTML = `
        <div class="filter-section">
          <h3>Brand</h3>
          <div class="filter-options">
            ${Array.from(brands).map(brand => `
              <label>
                <input type="checkbox" name="brand" value="${brand}">
                ${brand}
              </label>
            `).join('')}
          </div>
        </div>
  
        <div class="filter-section">
          <h3>Price Range</h3>
          <div class="price-range">
            <input type="range" id="priceMin" min="0" max="5000" value="0">
            <input type="range" id="priceMax" min="0" max="5000" value="5000">
            <div class="price-inputs">
              <input type="number" id="priceMinInput" min="0" max="5000" value="0">
              <span>to</span>
              <input type="number" id="priceMaxInput" min="0" max="5000" value="5000">
            </div>
          </div>
        </div>
  
        <div class="filter-section">
          <h3>RAM</h3>
          <div class="filter-options">
            ${Array.from(ramOptions).sort((a, b) => a - b).map(ram => `
              <label>
                <input type="checkbox" name="ram" value="${ram}">
                ${ram}GB
              </label>
            `).join('')}
          </div>
        </div>
  
        <div class="filter-section">
          <h3>Storage</h3>
          <div class="filter-options">
            ${Array.from(storageOptions).sort((a, b) => a - b).map(storage => `
              <label>
                <input type="checkbox" name="storage" value="${storage}">
                ${storage}GB
              </label>
            `).join('')}
          </div>
        </div>
  
        <div class="filter-section">
          <h3>Category</h3>
          <div class="filter-options">
            ${Array.from(categories).map(category => `
              <label>
                <input type="checkbox" name="category" value="${category}">
                ${category.charAt(0).toUpperCase() + category.slice(1)}
              </label>
            `).join('')}
          </div>
        </div>
      `;
  
      this.setupEventListeners();
    }
  
    setupEventListeners() {
      // Checkbox filters
      document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
          const filterType = checkbox.name;
          const value = checkbox.value;
          
          if (checkbox.checked) {
            this.filters[filterType].add(value);
          } else {
            this.filters[filterType].delete(value);
          }
          
          this.applyFilters();
        });
      });
  
      // Price range filters
      const priceMin = document.getElementById('priceMin');
      const priceMax = document.getElementById('priceMax');
      const priceMinInput = document.getElementById('priceMinInput');
      const priceMaxInput = document.getElementById('priceMaxInput');
  
      [priceMin, priceMax, priceMinInput, priceMaxInput].forEach(input => {
        input.addEventListener('input', (e) => {
          const min = Math.min(Number(priceMin.value), Number(priceMax.value));
          const max = Math.max(Number(priceMin.value), Number(priceMax.value));
          
          priceMin.value = min;
          priceMax.value = max;
          priceMinInput.value = min;
          priceMaxInput.value = max;
          
          this.filters.priceRange = [min, max];
          this.applyFilters();
        });
      });
    }
  
    applyFilters() {
      const filteredLaptops = laptops.filter(laptop => {
        const matchesBrand = this.filters.brands.size === 0 || this.filters.brands.has(laptop.brand);
        const matchesPrice = laptop.price >= this.filters.priceRange[0] && laptop.price <= this.filters.priceRange[1];
        const matchesRam = this.filters.ram.size === 0 || this.filters.ram.has(laptop.ram);
        const matchesStorage = this.filters.storage.size === 0 || this.filters.storage.has(laptop.storage);
        const matchesCategory = this.filters.category.size === 0 || this.filters.category.has(laptop.category);
  
        return matchesBrand && matchesPrice && matchesRam && matchesStorage && matchesCategory;
      });
  
      // Apply current sort
      sortManager.applySortToLaptops(filteredLaptops);
    }
  }