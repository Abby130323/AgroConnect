# AgroConnect -- Plataforma Web de Comercio Agricola y Ganadero

> **Proyecto Academico de Ingenieria de Software y Desarrollo Web**  
> **Institucion:** Tecnologico de Antioquia (TdeA)  
> **Stack:** React 19, Vite, React Router 7, CSS Puro Modular (Tokens y Mobile-First), MockAPI REST Backend, React Hook Form, Zod, Sonner y Lucide React.

---

## 1. Descripcion del Proyecto

**AgroConnect** es un ecosistema web integral de marketplace agropecuario y de alimentos diseñado para conectar directamente a productores campesinos y ganaderos especializados con consumidores urbanos e institucionales en Colombia.

La plataforma implementa una arquitectura desacoplada por capas y un sistema robusto de autenticacion y control de acceso basado en roles (RBAC), abarcando:
- **Catalogo Agropecuario y Ganadero:** Mas de 30 productos reales clasificados en 9 categorias tecnicas, incluyendo cortes especializados de carne de res (Punta de Anca Angus, Lomo Fino, Costilla de Res, Entrecote), carne de cerdo (Costilla BBQ, Lomo de Cerdo, Panceta, Bondiola), productos avicolas de campo (Huevos AA, Pollo campesino entero, Pechuga, Perniles), lacteos artesanales, hortalizas, frutas y cafe de origen.
- **Fotografias Reales y Fichas Tecnicas:** Cada producto cuenta con fotografia comercial representativa y atributos tecnicos de corte (`cut`), presentacion (`presentation`), conservacion (`conservation`) y clasificacion ganadera (`meatType`).
- **Autenticacion y Matriz de Permisos (RBAC):** 10 perfiles predefinidos distribuidos entre Administrador, Clientes, Empleados Funcionales (Inventario, Pedidos, Atencion) y Ganaderos Especializados (Porcino, Bovino, Avicola).
- **Rutas Protegidas y Control de Acceso:** Componentes de enrutamiento guardian `ProtectedRoute` y `RoleRoute` con pantalla formal de rechazo de privilegios `/403` (Acceso Restringido).
- **Panel Dinamico de Control (Dashboard):** Interfaz centralizada `/dashboard` que renderiza widgets funcionales especificos segun los permisos del usuario autenticado (Inventario, Pedidos, Produccion Ganadera, Ventas, Promociones y Estadisticas).
- **Aislamiento Estricto de Dominios Ganaderos:**
  - El Ganadero Porcino ve y controla EXCLUSIVAMENTE cortes de carne de cerdo (NO MAS).
  - El Ganadero Bovino ve y controla EXCLUSIVAMENTE cortes de carne de res (NO MAS).
  - El Ganadero Avicola ve y controla EXCLUSIVAMENTE huevos y pollo campesino (NO MAS).
  - Clientes y Empleados no tienen acceso ni visualizan ningun panel o widget de produccion ganadera.
- **Motor de Promociones y Descuentos Escalonados:** Promociones por dia de la semana, barra interactiva de progreso hacia descuentos por volumen (10% en compras > $100.000, 15% > $200.000 y 20% > $300.000), temporizador de cuenta regresiva, banner comercial y modal publicitario con control de frecuencia diaria.
- **Canasta de Compras Campesina (Carrito):** Control estricto de existencias (stock), actualizacion inmutable del estado, liquidacion de descuentos, sincronizacion reactiva y persistencia segura en `localStorage`.
- **Checkout y Liquidacion de Ordenes:** Formulario validado con React Hook Form y Zod que crea ordenes de compra reales en el backend REST (`POST /orden`).
- **Panel Administrativo CRUD:** Gestion completa de productos, categorias y usuarios con comunicacion REST directa y mutaciones inmutables en memoria.

---

## 2. Tecnologias Empleadas

- **Libreria Principal:** React 19 (Hooks: `useState`, `useEffect`, `useMemo`, `useCallback`, `useContext`).
- **Empaquetador y Build Tool:** Vite 8.
- **Enrutamiento:** React Router DOM v7 (Rutas anidadas, parametros `:id`, query params `useSearchParams`).
- **Formularios y Validacion:** React Hook Form v7 integrado con Zod v3 mediante `@hookform/resolvers`.
- **Iconografia:** Lucide React (100% iconos vectoriales SVG, estrictamente cero emojis).
- **Notificaciones:** Sonner (Toaster reactivo y accesible).
- **Micro-Animaciones:** Motion (animaciones fluidas para modales, banners y transiciones).
- **Estilos:** CSS Puro Modular Mobile-First (`variables.css`, `global.css`, `components.css`) basado en variables CSS nativas, CSS Grid, Flexbox y diseno responsivo adaptativo.
- **Backend REST:** [MockAPI.io](https://mockapi.io).

---

## 3. Arquitectura del Sistema

### 3.1. Flujo Unidireccional por Capas

```
[ MockAPI REST Backend (https://6aa6bb5ad7765db985078f3b.mockapi.io) ]
                                |
                                v
               [ Cliente HTTP Generico (httpClient.js) ]
               - URL Base centralizada
               - Headers JSON (Content-Type)
               - Manejo y transformacion de errores HTTP
                                |
                                v
                   [ Capa de Servicios REST ]
        - productService.js     - categoryService.js
        - farmerService.js      - authService.js
        - orderService.js       - promotionService.js
                                |
                                v
                [ Hooks Personalizados y Context ]
        - useAuth / AuthContext (Sesion y Permisos RBAC)
        - useCart / CartContext (Carrito y Descuentos)
        - useAgroCatalog (Orquestacion paralela en O(1))
        - useProducts, useCategories, useFarmers
                                |
                                v
                 [ Componentes y Vistas React ]
  - Catalogo & Detalle      - Carrito & Checkout
  - Dashboard Dinamico      - Modales CRUD & Promociones
  - Header & Navegacion     - Pantallas 403 y 404
```

### 3.2. Mapeo de Endpoints REST en MockAPI

| Recurso REST | Endpoint | Metodos Utilizados | Descripcion de la Operacion |
| :--- | :--- | :--- | :--- |
| **Productos** | `/producto` | `GET`, `POST`, `PUT`, `DELETE` | Gestion del catalogo agropecuario y carnico |
| **Categorias** | `/categoria` | `GET`, `POST` | Clasificacion tecnica de productos |
| **Productores** | `/cliente` | `GET`, `POST` | Fichas de productores y ganaderos asociados |
| **Usuarios** | `/usuario` | `GET`, `POST`, `PUT` | Credenciales y perfiles de los 10 roles del sistema |
| **Ordenes** | `/orden` | `GET`, `POST` | Registro de pedidos liquidados en el checkout |
| **Promociones** | Local / REST | `GET`, `POST`, `PUT`, `DELETE` | Descuentos por dia y volumen con persistencia desacoplada |

---

## 4. Matriz de Usuarios y Control de Acceso (RBAC)

El sistema cuenta con **10 cuentas de usuario predefinidas** para evaluar y demostrar la autorizacion basada en roles en la sustentacion academica:

### 4.1. Tabla de Credenciales de Demostracion

| Rol | Nombre | Correo Electronico | Clave de Acceso | Especialidad / Dominio |
| :--- | :--- | :--- | :--- | :--- |
| **Administrador** | Carlos Gomez | `admin@agroconnect.com` | `Admin2026*` | Acceso global a todo el sistema |
| **Cliente 1** | Maria Lopez | `cliente1@agroconnect.com` | `Cliente2026*` | Consumidor particular urbano |
| **Cliente 2** | Juan Perez | `cliente2@agroconnect.com` | `Cliente2026*` | Comprador institucional restaurante |
| **Cliente 3** | Laura Torres | `cliente3@agroconnect.com` | `Cliente2026*` | Compradora minorista de alimentos |
| **Empleado 1** | Andres Ramirez | `empleado.inventario@agroconnect.com` | `Empleado2026*` | Responsable de bodega y stock |
| **Empleado 2** | Diana Morales | `empleado.pedidos@agroconnect.com` | `Empleado2026*` | Despacho y logistica de pedidos |
| **Empleado 3** | Felipe Castro | `empleado.atencion@agroconnect.com` | `Empleado2026*` | Soporte al cliente y PQRS |
| **Ganadero Porcino** | Gonzalo Mejia | `porcino@agroconnect.com` | `Ganadero2026*` | Productor porcicola (farmerId: 6) |
| **Ganadero Bovino** | Javier Tamayo | `bovino@agroconnect.com` | `Ganadero2026*` | Criador ganado vacuno (farmerId: 3) |
| **Ganadero Avicola** | Marta Sanchez | `avicola@agroconnect.com` | `Ganadero2026*` | Productora de pollo y huevo (farmerId: 4) |

### 4.2. Matriz Declarativa de Permisos

| Permiso / Accion | Admin | Clientes | Emp. Inventario | Emp. Pedidos | Emp. Atencion | Ganaderos |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Comprar en Tienda / Checkout** | Si | Si | No | No | No | No |
| **Ver Catalogo y Detalle** | Si | Si | Si | Si | Si | Si |
| **Acceso a Dashboard General** | Si | Si (sus compras) | Si | Si | Si | Si (su granja) |
| **Gestion de Usuarios** | Si | No | No | No | No | No |
| **Gestion Global de Inventario** | Si | No | Si | No | No | No |
| **Gestion Global de Pedidos** | Si | No | No | Si | Si | No |
| **Gestion de Promociones** | Si | No | No | No | No | No |
| **Gestion de Productos Propios** | Si | No | Si (todos) | No | No | Si (solo su dominio) |
| **Panel Administrativo Global** | Si | No | No | No | No | No |

---

## 5. Motor de Promociones y Descuentos

Ubicado de forma desacoplada en `src/features/promotions/`, el motor aplica politicas comerciales dinamicas:

1. **Descuentos Escalonados por Volumen:**
   - Compras mayores a **$100.000 COP**: 10% de descuento automatico.
   - Compras mayores a **$200.000 COP**: 15% de descuento automatico.
   - Compras mayores a **$300.000 COP**: 20% de descuento automatico.
2. **Barra de Progreso Interactiva:** En la canasta de compras (`CartSummary`), la barra indica al usuario cuanto dinero le falta para alcanzar el siguiente nivel de descuento.
3. **Temporizador de Cuenta Regresiva (`PromotionCountdown`):** Indica los minutos y segundos restantes para el cierre de ofertas especiales.
4. **Banner Comercial Dinamico (`PromotionBanner`):** Muestra ofertas destacadas en el encabezado o pagina principal.
5. **Modal de Ofertas con Control de Frecuencia (`PromotionalModal`):** Ventana emergente con la opcion *"No mostrar mas hoy"*, guardada en `localStorage` mediante marca de tiempo por fecha.

---

## 6. Proceso de Compra y Liquidacion de Ordenes

1. El usuario selecciona productos respetando el **stock maximo**.
2. El carrito calcula inmutablemente subtotal, descuento aplicado segun las politicas activas y costo de envio.
3. En `/checkout`, el formulario valida los datos de envio y facturacion mediante **React Hook Form + Zod**. Si el usuario esta autenticado, el sistema autocompleta su informacion de perfil.
4. Al confirmar la compra, se ejecuta una peticion HTTP `POST /orden` en MockAPI, registrando:
   - Numero de orden generado.
   - Items adquiridos con cantidades y precios unitarios.
   - Subtotal, porcentaje de descuento, ahorro total y neto pagado.
   - Informacion del cliente, direccion de entrega y metodo de pago.
   - Estado de la orden (`pendiente`, `en preparacion`, `despachado`).
5. Se limpia el carrito de compras y se redirige a la pantalla de confirmacion.

---

## 7. Instalacion y Ejecucion

### Prerrequisitos
- Node.js version 18+ (probado exitosamente en Node.js v22).
- npm version 9+.

### Paso 1: Instalar dependencias
```bash
npm install
```

### Paso 2: Verificar Variables de Entorno
Asegurate de que el archivo `.env` contenga la URL base del backend:
```env
VITE_API_BASE_URL=https://6aa6bb5ad7765db985078f3b.mockapi.io
```

### Paso 3: Ejecutar Suite de Pruebas de Arquitectura
```bash
npm test
```
El script `scripts/verifyApp.js` evalua 66 verificaciones automaticas:
- Integridad referencial de productos con categorias y productores.
- Fichas tecnicas de carnes de res, cerdo y avicolas.
- Disponibilidad derivada de existencias fisicas (`isAvailable = stock > 0`).
- Resolucion en $O(1)$ con estructuras Map concurrentes.
- Validacion de las 10 cuentas de usuario predefinidas.
- Matriz RBAC de permisos.
- Aislamiento estricto de dominios ganaderos (Cerdo, Res, Avicola - NO MAS).
- Liquidacion del motor de promociones y descuentos por volumen.
- Ausencia estricta de emojis en modelos, catalogo y perfiles.

### Paso 4: Iniciar el Servidor de Desarrollo
```bash
npm run dev
```
Abre la aplicacion en el navegador en la direccion indicada por la consola (usualmente `http://localhost:5173` o `http://localhost:5174`).

### Paso 5: Compilar para Produccion
```bash
npm run build
```
Genera los archivos optimizados y minificados en el directorio `/dist`.

---

## 8. Guia de Sustentacion Academica (Preguntas Clave y Rubrica)

A continuacion se presenta la explicacion tecnica de los conceptos evaluados en la materia:

### 1. ¿Que es un Endpoint y que protocolo se utiliza?
Un endpoint es una ruta URI expuesta por un servidor REST (por ejemplo `/producto` o `/orden`) para ejecutar operaciones sobre un recurso informatico. Se utiliza el protocolo **HTTP (Hypertext Transfer Protocol)**, un protocolo cliente-servidor sin estado que intercambia metadatos mediante encabezados (headers) y cuerpos de mensaje serializados comunmente en JSON.

### 2. ¿Cuales metodos HTTP se implementaron y como se asegura la idempotencia?
- `GET`: Obtencion de recursos sin efectos secundarios en el servidor (Lectura pura, idempotente).
- `POST`: Creacion de nuevos recursos (`/producto`, `/usuario`, `/orden`). No es idempotente porque cada envio crea un nuevo registro.
- `PUT`: Actualizacion total de un recurso existente (`/producto/:id`). Es idempotente porque múltiples llamadas con los mismos datos dejan el recurso en el mismo estado final.
- `DELETE`: Eliminacion de un recurso por su ID. Es idempotente en cuanto al estado del recurso (queda eliminado).

### 3. ¿Por que existe una capa HTTP desacoplada (`httpClient.js`)?
Centraliza en un unico punto:
- La URL base de la API.
- La configuracion de encabezados (`Content-Type: application/json`).
- La serializacion y deserializacion JSON.
- El manejo uniforme de errores de red y codigos de estado HTTP (`response.ok`).
Si en el futuro se migra de MockAPI a un backend en Express, NestJS, Spring Boot o Django, **ningun componente de React se modifica**; solo se ajusta la implementacion de la capa HTTP.

### 4. ¿Como se resuelven las relaciones entre entidades en $O(1)$?
En lugar de anidar objetos pesados en el backend, los productos almacenan unicamente claves foraneas (`categoryId` y `farmerId`). Al cargar la pagina, `useAgroCatalog` descarga las colecciones en paralelo con `Promise.all()` y transforma las categorias y agricultores en estructuras `Map(id => Objeto)`. Al iterar los productos, la asociacion se realiza en **tiempo constante $O(1)$**, evitando búsquedas secuenciales anidadas de orden cuadratico $O(N \times M)$.

### 5. ¿Por que la actualizacion del estado en React debe ser inmutable?
React utiliza la tecnica del Virtual DOM y compara referencias de memoria para determinar cuando un componente debe re-renderizarse. Si se modifica un array directamente (con `.push()`, `.splice()`, o reasignando una propiedad de un objeto), la referencia del objeto en memoria no cambia, provocando que la interfaz no se actualice o presente fallos de sincronizacion. Por ello, se utilizan metodos inmutables:
- Agregar: `[...prev, nuevoItem]`
- Modificar: `prev.map(item => item.id === targetId ? nuevoItem : item)`
- Eliminar: `prev.filter(item => item.id !== targetId)`

### 6. ¿Que diferencia hay entre Autenticacion y Autorizacion?
- **Autenticacion:** Proceso de verificar la identidad del usuario (¿Quien eres?). En el proyecto, se valida correo y contrasena contra el servicio `authService`.
- **Autorizacion:** Proceso de verificar que acciones y recursos tiene permitido ejecutar o acceder dicho usuario (¿Que tienes permiso de hacer?). En el proyecto se modela mediante la **Matriz RBAC** en `permissions.js` y las rutas `RoleRoute`.

### 7. Aclaracion Academica sobre Seguridad de Credenciales
> **Nota Academica:** En este proyecto academico, el backend REST corre sobre MockAPI (servicio REST mock para desarrollo frontend), el cual almacena el campo `password` en texto plano para facilitar la evaluacion y verificacion directa de los 10 usuarios de prueba. En un entorno corporativo de produccion, las contrasenas nunca viajan ni se almacenan en texto plano: deben ser procesadas con algoritmos de hashing criptografico unidireccional con sal (como **BCrypt** o **Argon2**), y la sesion se gestiona mediante tokens firmados criptograficamente (**JWT**) o cookies seguras con atributo `HttpOnly`.

---

## 9. Creditos y Responsabilidad Academica

- **Proyecto:** AgroConnect -- Ecosistema Digital de Comercio Agropecuario y Ganadero.
- **Institucion Universitaria:** Tecnologico de Antioquia (TdeA).
- **Facultad:** Ingenieria de Software y Telecomunicaciones.
- **Asignatura:** Desarrollo Web / Arquitectura de Software.
