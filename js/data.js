// ===== SAHARA — DATA STORE =====
// All data is saved in localStorage for persistence

const DEFAULT_CATEGORIES = [
  { id: "ropa-mujer",   name: "Ropa Mujer",   icon: "fas fa-female",    color: "#C9A96E" },
  { id: "ropa-hombre",  name: "Ropa Hombre",  icon: "fas fa-male",      color: "#8B6914" },
  { id: "ropa-ninos",   name: "Ropa Niños",   icon: "fas fa-child",     color: "#B8860B" },
  { id: "zapatos",      name: "Zapatos",       icon: "fas fa-shoe-prints", color: "#6B4C11" },
  { id: "jugetes",      name: "Juguetes",      icon: "fas fa-puzzle-piece", color: "#C9A96E" },
  { id: "accesorios",   name: "Accesorios",   icon: "fas fa-gem",       color: "#8B6914" }
];

const DEFAULT_PRODUCTS = [
  {
    id: "p1", catId: "ropa-mujer", name: "Vestido Boho Elegante",
    desc: "Vestido de corte bohemio en tela fluida, ideal para ocasiones especiales o salidas casuales. Disponible en varios colores.",
    image: "", tags: ["Nuevo", "Tendencia"], badge: "new", createdAt: Date.now() - 86400000*5
  },
  {
    id: "p2", catId: "ropa-mujer", name: "Blusa Francesa Off-Shoulder",
    desc: "Blusa moderna de hombros descubiertos, confeccionada en algodón premium. Perfecta para el verano.",
    image: "", tags: ["Verano"], badge: "", createdAt: Date.now() - 86400000*4
  },
  {
    id: "p3", catId: "ropa-hombre", name: "Camisa Oxford Slim Fit",
    desc: "Camisa de corte ajustado en tejido Oxford, ideal para ambiente casual y de negocios. Cuello button-down.",
    image: "", tags: ["Clásico", "Oficina"], badge: "", createdAt: Date.now() - 86400000*3
  },
  {
    id: "p4", catId: "ropa-hombre", name: "Chaqueta Bomber Premium",
    desc: "Chaqueta bomber de alta calidad con forro interior. Un básico imprescindible en todo guardarropa masculino.",
    image: "", tags: ["Invierno", "Premium"], badge: "new", createdAt: Date.now() - 86400000*2
  },
  {
    id: "p5", catId: "ropa-ninos", name: "Conjunto Escolar Niño",
    desc: "Conjunto completo escolar resistente y cómodo, fabricado en materiales duraderos pensados para la actividad infantil.",
    image: "", tags: ["Escolar"], badge: "", createdAt: Date.now() - 86400000*7
  },
  {
    id: "p6", catId: "zapatos", name: "Zapatillas Runner Pro",
    desc: "Zapatillas deportivas de última generación con suela amortiguada y superior transpirable. Aptas para running y uso diario.",
    image: "", tags: ["Deporte", "Running"], badge: "new", createdAt: Date.now() - 86400000*1
  },
  {
    id: "p7", catId: "zapatos", name: "Botines Cuero Artesanal",
    desc: "Botines de cuero genuino fabricados artesanalmente. Suela de goma antideslizante, ideales para otoño e invierno.",
    image: "", tags: ["Cuero", "Artesanal"], badge: "", createdAt: Date.now() - 86400000*6
  },
  {
    id: "p8", catId: "jugetes", name: "Set Construcción 500 Piezas",
    desc: "Set de bloques de construcción compatibles, con 500 piezas de colores vivos. Estimula la creatividad y el razonamiento espacial.",
    image: "", tags: ["Educativo", "+5 años"], badge: "", createdAt: Date.now() - 86400000*3
  },
  {
    id: "p9", catId: "jugetes", name: "Muñeca Articulada Deluxe",
    desc: "Muñeca articulada de alta calidad con 12 puntos de articulación, accesorios incluidos y ropa intercambiable.",
    image: "", tags: ["3-10 años"], badge: "new", createdAt: Date.now() - 86400000*1
  },
  {
    id: "p10", catId: "accesorios", name: "Bolso Tote Sahara",
    desc: "Bolso tote de piel vegana con asas reforzadas. Capacidad XL, perfecto para el trabajo o compras del día a día.",
    image: "", tags: ["Piel vegana", "XL"], badge: "", createdAt: Date.now() - 86400000*2
  },
  {
    id: "p11", catId: "accesorios", name: "Cinturón Tejido Boho",
    desc: "Cinturón de tela tejida a mano con hebilla dorada. Accesorio versátil que combina con vestidos, jeans y faldas.",
    image: "", tags: ["Artesanal"], badge: "", createdAt: Date.now() - 86400000*4
  },
  {
    id: "p12", catId: "ropa-ninos", name: "Vestido Fiesta Niña",
    desc: "Vestido de fiesta para niña en tul y encaje, perfecto para ocasiones especiales y celebraciones.",
    image: "", tags: ["Fiesta", "Niñas"], badge: "new", createdAt: Date.now()
  }
];

// ===== DATA ACCESS LAYER =====
const SaharaDB = {
  getCategories() {
    const raw = localStorage.getItem('sahara_cats');
    if (!raw) {
      this.saveCategories(DEFAULT_CATEGORIES);
      return DEFAULT_CATEGORIES;
    }
    return JSON.parse(raw);
  },
  saveCategories(cats) {
    localStorage.setItem('sahara_cats', JSON.stringify(cats));
  },
  getProducts() {
    const raw = localStorage.getItem('sahara_products');
    if (!raw) {
      this.saveProducts(DEFAULT_PRODUCTS);
      return DEFAULT_PRODUCTS;
    }
    return JSON.parse(raw);
  },
  saveProducts(products) {
    localStorage.setItem('sahara_products', JSON.stringify(products));
  },
  addCategory(cat) {
    const cats = this.getCategories();
    cats.push(cat);
    this.saveCategories(cats);
  },
  updateCategory(id, data) {
    const cats = this.getCategories().map(c => c.id === id ? { ...c, ...data } : c);
    this.saveCategories(cats);
  },
  deleteCategory(id) {
    const cats = this.getCategories().filter(c => c.id !== id);
    this.saveCategories(cats);
    // Also delete products in this category
    const products = this.getProducts().filter(p => p.catId !== id);
    this.saveProducts(products);
  },
  addProduct(product) {
    const products = this.getProducts();
    products.push(product);
    this.saveProducts(products);
  },
  updateProduct(id, data) {
    const products = this.getProducts().map(p => p.id === id ? { ...p, ...data } : p);
    this.saveProducts(products);
  },
  deleteProduct(id) {
    const products = this.getProducts().filter(p => p.id !== id);
    this.saveProducts(products);
  },
  generateId() {
    return 'id_' + Math.random().toString(36).substr(2, 9) + Date.now();
  }
};
