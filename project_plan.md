# Álbum de Boda — Fullmetal Alchemist Brotherhood

## 1. Project Description
Aplicación web para el álbum de fotos de una boda con temática de **Fullmetal Alchemist Brotherhood**.
Los invitados abren la app, activan la cámara del dispositivo, toman fotos y las suben a un álbum
compartido. No necesitan registrarse. El administrador de la boda inicia sesión y ve el álbum completo
con todas las fotos subidas, sin límite de cantidad.

**Usuarios objetivo:**
- Invitados de la boda (suben fotos desde el celular).
- Administradores (los novios / organizadores), que revisan y gestionan el álbum.

**Valor principal:** capturar recuerdos espontáneos en tiempo real, con una estética anime elegante
(carmesí alquímico, dorado, aire de hermandad).

## 2. Page Structure
- `/` — Landing: elegir entre "Soy invitado" (subir fotos) o "Soy administrador".
- `/guest` — Vista invitado: activar cámara, tomar fotos y subirlas (también desde galería).
- `/admin` — Vista administrador: login y álbum completo con todas las fotos.

## 3. Core Features
- [x] Vista invitado: activar cámara en el navegador (getUserMedia) y capturar fotos.
- [x] Vista invitado: subir fotos a la nube (con alternativa de subir desde el carrete/galería).
- [x] Vista invitado: nombre opcional y descripción breve por foto.
- [x] Vista administrador: inicio de sesión (usuario `admin` / contraseña `123456`).
- [x] Vista administrador: ver el álbum completo de todas las fotos subidas.
- [x] Vista administrador: ver foto ampliada (lightbox) y eliminar fotos.
- [ ] Álbumes múltiples (crear y separar álbumes).
- [ ] Descarga de fotos / exportar álbum.

## 4. Data Model Design

### Table: albums
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| name | text | Nombre del álbum |
| description | text | Descripción del álbum |
| created_at | timestamptz | Fecha de creación |

### Table: photos
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| album_id | uuid | Álbum al que pertenece (FK albums.id) |
| guest_name | text | Nombre del invitado (opcional) |
| caption | text | Comentario de la foto (opcional) |
| image_url | text | URL pública de la imagen |
| storage_path | text | Ruta del archivo en Storage |
| created_at | timestamptz | Fecha de subida |

### Storage
- Bucket `wedding-photos` (público): almacena las imágenes subidas.

## 5. Backend / Third-party Integration Plan
- Database: **SaaS Supabase** (conectado). Tablas `albums`, `photos` con RLS.
- Storage: **SaaS Supabase Storage**, bucket `wedding-photos`.
- Auth: **Supabase Auth** para el administrador (usuario `admin` → email interno, contraseña `123456`).
  Los invitados suben de forma anónima (sin registro).
- Shopify: no necesario.
- Stripe / pagos: no necesario.

## 6. Development Phase Plan

### Phase 1: Núcleo del álbum (infraestructura + invitado + admin)
- Goal: Infraestructura de datos y la app funcional de punta a punta.
- Deliverable:
  - Base de datos, storage y seguridad (RLS) configurados.
  - Landing con las dos entradas (invitado / admin).
  - Vista invitado con cámara, captura y subida real de fotos.
  - Vista admin con login y álbum completo de fotos.

### Phase 2: Álbumes y gestión avanzada
- Goal: soporte de múltiples álbumes, organización y exportación.
- Deliverable: crear/editar álbumes, filtrar fotos por álbum, descargar fotos.

### Phase 3: Detalles y pulido
- Goal: animaciones, ambientación temática extra y optimización móvil.
- Deliverable: microinteracciones, ajustes de diseño y rendimiento.