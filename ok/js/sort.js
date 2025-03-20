class SortManager {
    constructor() {
      this.currentSort = {
        field: 'relevance',
        direction: 'desc'
      };
      
      this.setupSortUI();
    }
  
    setupSortUI() {
      const sortContainer = document.getElementById('sortContainer');
      sortContainer.innerHTML = `
        <select id="sortSelect">
          <option value="relevance">Relevance</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name-asc">Name: A to Z</option>
          <option value="name-desc">Name: Z to A</option>
        </select>
      `;
  
      document.getElementById('sortSelect').addEventListener('change', (e) => {
        const [field, direction] = e.target.value.split('-');
        this.currentSort = {
          field: field,
          direction: direction || 'desc'
        };
        this.applySortToLaptops(laptopGrid.getCurrentLaptops());
      });
    }
  
    applySortToLaptops(laptops) {
      if (this.currentSort.field === 'relevance') {
        laptopGrid.renderLaptops(laptops);
        return;
      }
  
      const sortedLaptops = [...laptops].sort((a, b) => {
        const aValue = a[this.currentSort.field];
        const bValue = b[this.currentSort.field];
        const direction = this.currentSort.direction === 'asc' ? 1 : -1;
  
        if (typeof aValue === 'string') {
          return direction * aValue.localeCompare(bValue);
        }
        return direction * (aValue - bValue);
      });
  
      laptopGrid.renderLaptops(sortedLaptops);
    }
  }