const laptops = [
  {
    id: 1,
    name: "MacBook Pro 16\"",
    brand: "Apple",
    processor: "M2 Pro",
    ram: 16,
    storage: 512,
    category: "creator",
    description: "Apple M2 Pro chip, 16GB RAM, 512GB SSD",
    price: 90000,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80"
  },
  {
    id: 2,
    name: "Dell XPS 15",
    brand: "Dell",
    processor: "Intel i9-12900H",
    ram: 32,
    storage: 1000,
    category: "creator",
    description: "Intel i9, 32GB RAM, 1TB SSD, RTX 3050 Ti",
    price: 85000,
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80"
  },
  {
    id: 3,
    name: "Lenovo ThinkPad X1",
    brand: "Lenovo",
    processor: "Intel i7-1260P",
    ram: 16,
    storage: 512,
    category: "business",
    description: "Intel i7, 16GB RAM, 512GB SSD",
    price: 75000,
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80"
  },
  {
    id: 4,
    name: "ASUS ROG Zephyrus",
    brand: "ASUS",
    processor: "AMD Ryzen 9",
    ram: 32,
    storage: 1000,
    category: "gaming",
    description: "AMD Ryzen 9, 32GB RAM, 1TB SSD, RTX 4080",
    price: 100000,
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80"
  },
  {
    id: 5,
    name: "HP Spectre x360",
    brand: "HP",
    processor: "Intel i7-1165G7",
    ram: 16,
    storage: 512,
    category: "business",
    description: "Intel i7, 16GB RAM, 512GB SSD",
    price: 85000,
    image: "https://images.unsplash.com/photo-1544731612-de7f96afe55f?auto=format&fit=crop&q=80"
  },
  {
    id: 6,
    name: "Razer Blade 15",
    brand: "Razer",
    processor: "Intel i9-12900H",
    ram: 32,
    storage: 1000,
    category: "gaming",
    description: "Intel i9, 32GB RAM, 1TB SSD, RTX 3080",
    price: 65000,
    image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&q=80"
  }
];

// Generate more laptops for the catalog page
for (let i = 7; i <= 2000; i++) {
  const brands = ['Apple', 'Dell', 'Lenovo', 'HP', 'ASUS', 'Acer', 'MSI'];
  const processors = ['Intel i5', 'Intel i7', 'Intel i9', 'AMD Ryzen 5', 'AMD Ryzen 7', 'AMD Ryzen 9', 'M1', 'M2'];
  const ramOptions = [8, 16, 32, 64];
  const storageOptions = [256, 512, 1000, 2000];
  const categories = ['gaming', 'business', 'student', 'creator'];
  
  laptops.push({
    id: i,
    name: `${brands[i % brands.length]} Laptop ${i}`,
    brand: brands[i % brands.length],
    processor: processors[i % processors.length],
    ram: ramOptions[i % ramOptions.length],
    storage: storageOptions[i % storageOptions.length],
    category: categories[i % categories.length],
    description: `${processors[i % processors.length]}, ${ramOptions[i % ramOptions.length]}GB RAM, ${storageOptions[i % storageOptions.length]}GB Storage`,
    price: Math.floor(Math.random() * (75000 - 30000 + 1) + 30000),
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80"
  });
}