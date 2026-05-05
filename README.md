# ☽ SAHARA — Tienda Virtual por Departamentos

![Sahara](https://img.shields.io/badge/Sahara-Tienda%20Virtual-C9A96E?style=for-the-badge)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Listo-27AE60?style=for-the-badge)

Tienda virtual de exhibición de productos por departamentos — **Ropa, Zapatos y Juguetes** — sin sistema de venta en línea. Diseñada para alojar en GitHub Pages.

---

## 🚀 Cómo publicar en GitHub Pages

1. Sube todos los archivos a tu repositorio `lhamat123/Sahara`
2. Ve a **Settings → Pages**
3. En *Source*, selecciona la rama `main` y carpeta `/ (root)`
4. Guarda. En unos minutos estará en: `https://lhamat123.github.io/Sahara/`

---

## 📁 Estructura del Proyecto

```
Sahara/
├── index.html          ← Tienda principal (clientes)
├── css/
│   └── style.css       ← Estilos de la tienda
├── js/
│   ├── data.js         ← Base de datos (localStorage)
│   └── app.js          ← Lógica de la tienda
└── admin/
    ├── index.html      ← Panel de administración
    ├── admin.css       ← Estilos del panel
    └── admin.js        ← Lógica del administrador
```

---

## ✨ Características

### Tienda (index.html)
- Navegación por departamentos con barra superior y sidebar móvil
- Hero section con llamada a la acción
- Grid de departamentos con conteo de productos
- Catálogo de productos con tarjetas interactivas
- Modal de detalle de producto
- Búsqueda en tiempo real
- Filtros y ordenamiento
- 100% responsive (móvil, tablet, escritorio)

### Panel de Administración (admin/index.html)
- **Dashboard** con estadísticas generales y productos recientes
- **Gestión de Categorías**: crear, editar, eliminar; selector de iconos FontAwesome
- **Gestión de Productos**: crear, editar, eliminar; subida de imagen por archivo o URL; tags; etiquetas destacadas
- Búsqueda y filtros en tiempo real
- Persistencia total con `localStorage` (sin servidor)

---

## 🎨 Tecnologías

- HTML5, CSS3 (variables, grid, flexbox, animaciones)
- JavaScript vanilla (sin frameworks)
- [Font Awesome 6](https://fontawesome.com/) — iconos
- [Google Fonts](https://fonts.google.com/) — Cormorant Garamond + DM Sans
- `localStorage` — almacenamiento de datos

---

## 📦 Sin instalación

No requiere Node.js, npm ni ningún servidor. Abre `index.html` directamente en el navegador o despliega en GitHub Pages.

---

## 🔑 Acceder al Admin

Haz clic en el ícono ⚙️ en la barra de navegación de la tienda, o accede directamente a `/admin/index.html`.

> **Nota:** Los datos se guardan en el `localStorage` del navegador. Son independientes por dispositivo.

---

© 2025 Sahara. Todos los derechos reservados.
