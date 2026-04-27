# 🌶️ Club del Picante — Web App

Sitio web completo con tienda online, integración MercadoPago y panel de administración.

---

## 🚀 Cómo arrancar

### 1. Instalar dependencias
```bash
cd club-del-picante
npm install
```

### 2. Configurar variables de entorno
```bash
# Copiá el archivo de ejemplo
cp .env.example .env

# Editá el .env con tus datos reales (ver instrucciones abajo)
```

### 3. Iniciar el servidor
```bash
# Modo desarrollo (con auto-reload)
npm run dev

# Modo producción
npm start
```

### 4. Abrir en el navegador
```
http://localhost:3000
```

---

## ⚙️ Configuración del .env

### MercadoPago (OBLIGATORIO para cobros reales)
1. Entrá a https://www.mercadopago.com.ar/developers
2. Creá una aplicación
3. Copiá el **Access Token** y la **Public Key**
4. Pegálos en el `.env`:
```
MP_ACCESS_TOKEN=APP_USR-xxxxxxxxxx
MP_PUBLIC_KEY=APP_USR-xxxxxxxxxx
```

> ⚠️ Sin estas claves, el sitio funciona en **modo demo** (simula el pago sin cobrar)

### Credenciales del admin
```
ADMIN_EMAIL=tu@email.com
ADMIN_PASSWORD=TuPasswordSegura123!
```

### URL del sitio (para producción)
```
SITE_URL=https://tudominio.com.ar
```

---

## 📂 Estructura del proyecto

```
club-del-picante/
├── server.js              # Servidor Express principal
├── .env.example           # Template de variables de entorno
├── package.json
│
├── routes/
│   ├── products.js        # API de productos
│   ├── orders.js          # API de pedidos
│   ├── auth.js            # Login admin
│   ├── payment.js         # MercadoPago
│   └── admin.js           # Panel admin (protegido)
│
├── data/
│   ├── products.json      # Base de datos de productos
│   └── orders.json        # Base de datos de pedidos
│
└── public/
    ├── index.html         # SPA principal
    ├── images/            # 👈 ACÁ VAN TUS FOTOS
    │   ├── miel-chica.jpg
    │   ├── miel-mediana.jpg
    │   ├── miel-grande.jpg
    │   └── miel-kit.jpg
    ├── css/
    │   ├── main.css       # Estilos principales
    │   ├── components.css # Panel admin
    │   └── animations.css # Animaciones
    └── js/
        ├── app.js         # App principal + router
        ├── cart.js        # Carrito
        ├── products.js    # Renderizado de productos
        └── checkout.js    # Proceso de compra
```

---

## 🖼️ Agregar las fotos reales

Copiá tus fotos a la carpeta `/public/images/` con estos nombres:
- `miel-chica.jpg` — Frasco 150g
- `miel-mediana.jpg` — Frasco 300g
- `miel-grande.jpg` — Frasco 500g
- `miel-kit.jpg` — Kit degustación x3

También podés agregar el logo como:
- `logo.png` — Logo principal

---

## 🔐 Panel de administración

Accedé al panel en: `http://localhost:3000/admin`

O desde el footer del sitio → "Panel admin"

**Desde el panel podés:**
- 📊 Ver estadísticas y ventas de los últimos 7 días
- 📦 Ver y gestionar todos los pedidos
- 🍯 Actualizar precios, stock y activar/desactivar productos
- ✅ Cambiar el estado de los pedidos (confirmado, enviado, entregado, etc.)

---

## 🛒 Flujo de compra

```
Tienda → Producto → Carrito → Checkout → MercadoPago → Confirmación
```

1. Usuario elige producto y cantidad
2. Agrega al carrito (guardado en localStorage)
3. Completa sus datos en el checkout
4. Elige envío (CABA/GBA) o retiro en punto
5. Paga con MercadoPago (tarjeta, débito, transferencia, etc.)
6. El pedido queda registrado en `data/orders.json`
7. Admin ve el pedido en el panel

---

## 📱 Páginas del sitio

| Ruta | Descripción |
|------|-------------|
| `/` | Inicio / Landing |
| Sección Productos | Catálogo completo |
| Sección Nosotros | Quiénes somos + timeline |
| Sección Locales | Puntos de venta + delivery |
| Sección Contacto | Formulario + WhatsApp + IG |
| `/admin` | Panel de administración |
| `/pago-exitoso` | Confirmación de pago |
| `/pago-fallido` | Pago rechazado |
| `/pago-pendiente` | Pago en proceso |

---

## 🔧 Personalización

### Cambiar precios y productos
Editá directamente el archivo `data/products.json` o usá el panel admin.

### Cambiar datos de contacto
Buscá en `public/index.html`:
- WhatsApp: `wa.me/5491100000000` → cambiá el número
- Instagram: `instagram.com/clubdelpicante` → cambiá el usuario
- Email: `hola@clubdelpicante.com.ar` → cambiá el email

### Cambiar puntos de venta
Editá la sección `page-stores` en `public/index.html`.

### Cambiar testimonios
Editá la sección `testimonials-slider` en `public/index.html`.

---

## 🚀 Deploy a producción

### Opciones recomendadas:
- **Railway** (gratis con límites): `railway.app`
- **Render** (gratis con límites): `render.com`
- **VPS propio**: cualquier servidor Linux con Node.js

### Pasos básicos:
1. Subir el código a GitHub
2. Conectar con Railway/Render
3. Configurar las variables de entorno en la plataforma
4. ¡Listo!

---

## ❓ Preguntas frecuentes

**¿Cómo pruebo MercadoPago sin cobrar?**
Sin configurar el `.env` con las claves reales, el sitio funciona en modo demo y simula el pago.

**¿Puedo agregar más productos?**
Sí, editá `data/products.json` siguiendo el formato existente, o pedile al desarrollador que agregue un formulario de creación en el panel admin.

**¿Dónde quedan guardados los pedidos?**
En `data/orders.json`. Para producción seria recomendable migrar a una base de datos real (PostgreSQL, MongoDB, etc.).

**¿Cómo cambio la contraseña del admin?**
Editá `ADMIN_PASSWORD` en el archivo `.env`.

---

Hecho con 🔥 en Buenos Aires · Club del Picante 2024
