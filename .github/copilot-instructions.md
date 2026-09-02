# GitHub Copilot Instructions
# Baby Shower Giovanni

## 1. OBJETIVO DEL PROYECTO

Desarrollar una invitación web digital para el Baby Shower de Giovanni.

La aplicación será principalmente pública y estará diseñada para ser compartida mediante WhatsApp y utilizada principalmente desde teléfonos móviles.

La experiencia debe sentirse como una invitación digital elegante, cálida, delicada y moderna, y NO como un e-commerce ni como una aplicación empresarial.

La aplicación debe incluir:

- Portada con imagen y nombre del bebé.
- Información y fotografías de los padres.
- Fecha, hora y ubicación del evento.
- Mapa y botón para obtener indicaciones.
- Lista interactiva de regalos.
- Sistema multiusuario para reservar regalos.
- Actualización de disponibilidad en tiempo real.
- Panel administrativo protegido.
- Diseño responsive y mobile-first.
- Animaciones suaves y elegantes.

El nombre definitivo del bebé es:

GIOVANNI

Si alguna maqueta, imagen, dato de ejemplo o contenido anterior contiene otro nombre, NO utilizarlo como nombre definitivo.

---

# 2. REGLA PRIORITARIA: AHORRO DE TOKENS Y CONTEXTO

El consumo de tokens/contexto de GitHub Copilot debe minimizarse deliberadamente.

Esta es una prioridad ALTA.

Utilizar siempre el mínimo contexto necesario para resolver correctamente la tarea.

Antes de realizar cualquier modificación:

1. Identificar exactamente qué archivos están relacionados con la tarea.
2. Leer solamente esos archivos.
3. No analizar todo el repositorio innecesariamente.
4. No volver a leer archivos cuya información ya esté disponible.
5. No analizar `node_modules`.
6. No analizar `.next`.
7. No analizar caches ni archivos generados.
8. No analizar binarios o imágenes salvo que sean necesarios.
9. No analizar archivos `.env` que contengan secretos.
10. No realizar auditorías completas del proyecto para tareas pequeñas.

NO recorrer todo el proyecto antes de cada cambio.

NO regenerar código que ya existe.

NO repetir decisiones arquitectónicas ya establecidas.

NO generar funcionalidades futuras que todavía no fueron solicitadas.

El ahorro de tokens debe producirse reduciendo contexto, código y explicaciones innecesarias, pero nunca eliminando:

- seguridad
- validaciones
- tipado
- RLS
- manejo de errores
- concurrencia
- accesibilidad
- robustez

La regla fundamental es:

"Usar el mínimo contexto, el mínimo código y el mínimo número de archivos necesarios para producir una solución correcta."

---

# 3. COMUNICACIÓN CON EL USUARIO

Las respuestas de Copilot deben ser breves y orientadas a la acción.

NO:

- repetir estas instrucciones;
- explicar código obvio;
- explicar cada línea modificada;
- generar documentación extensa no solicitada;
- proponer alternativas innecesarias;
- repetir decisiones arquitectónicas;
- describir exhaustivamente el repositorio.

Después de realizar una tarea, informar únicamente:

- qué se modificó;
- archivos afectados;
- resultado de las comprobaciones;
- siguiente paso, si corresponde.

Ejemplo:

"Implementado `GiftCard`.

Archivos:
- components/gifts/GiftCard.tsx
- types/gift.ts

TypeScript: OK
Lint: OK

Siguiente paso: implementar GiftList."

No agregar explicaciones extensas salvo que sean necesarias.

---

# 4. STACK TECNOLÓGICO

Utilizar exclusivamente, salvo necesidad técnica justificada:

- Next.js
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- Supabase
- PostgreSQL
- Supabase Realtime
- Supabase Auth
- Vercel

Arquitectura:

Frontend:
React + Next.js + TypeScript

Backend:
Next.js

Base de datos:
Supabase + PostgreSQL

Realtime:
Supabase Realtime

Autenticación administrativa:
Supabase Auth

Hosting:
Vercel

No cambiar estas tecnologías por preferencias personales.

No introducir otro framework sin una necesidad técnica real.

Evitar dependencias innecesarias.

Antes de instalar una dependencia:

1. comprobar `package.json`;
2. verificar si ya existe una dependencia que resuelva el problema;
3. comprobar si puede resolverse razonablemente con las tecnologías existentes;
4. instalar solamente si aporta un beneficio real.

---

# 5. NEXT.JS

Utilizar Next.js con App Router.

Preferir Server Components por defecto.

Utilizar Client Components únicamente cuando sean necesarios para:

- interacción;
- estado local;
- eventos del navegador;
- animaciones;
- Supabase Realtime;
- APIs del navegador.

NO convertir toda la aplicación en `"use client"`.

Mantener la mayor cantidad posible de componentes como Server Components.

---

# 6. TYPESCRIPT

Utilizar TypeScript estrictamente.

Mantener:

`strict: true`

Evitar `any`.

No utilizar `any` salvo una situación excepcional y justificada.

Crear tipos reutilizables para las entidades principales.

Por ejemplo:

- Event
- Parent
- Gift
- GiftReservation
- Guest
- Admin

No duplicar interfaces o tipos en distintos archivos.

---

# 7. ESTRUCTURA DEL PROYECTO

Mantener una estructura simple, clara y modular.

Estructura conceptual:

app/
  (public)/
    page.tsx
  admin/
    page.tsx
  api/
  layout.tsx
  globals.css

components/
  ui/
  sections/
  gifts/
  layout/
  admin/

lib/
  supabase/
  utils/
  validations/

types/

public/
  images/
  icons/

supabase/
  migrations/

No crear carpetas adicionales sin necesidad.

No crear capas arquitectónicas solamente para seguir patrones genéricos.

---

# 8. REUTILIZACIÓN DEL CÓDIGO

Antes de crear un componente, hook, utilidad o tipo nuevo:

1. buscar si ya existe;
2. comprobar si puede reutilizarse;
3. modificar el existente si corresponde.

No crear:

- componentes duplicados;
- hooks duplicados;
- funciones duplicadas;
- utilidades duplicadas;
- tipos duplicados.

Preferir componentes pequeños y reutilizables.

---

# 9. DISEÑO VISUAL

La referencia visual principal es la maqueta proporcionada para este proyecto.

La estética debe ser:

- elegante;
- cálida;
- delicada;
- moderna;
- minimalista;
- infantil sin ser excesivamente infantil;
- premium.

Paleta aproximada:

- crema;
- ivory;
- beige;
- verde salvia;
- verde suave;
- dorado muy sutil;
- marrón claro.

Evitar colores saturados.

Utilizar:

- mucho espacio negativo;
- bordes redondeados;
- sombras suaves;
- tipografías elegantes;
- composición limpia;
- elementos decorativos delicados.

La web debe parecer una invitación premium.

No debe parecer:

- una tienda online;
- un dashboard;
- una landing corporativa;
- una aplicación administrativa.

---

# 10. DISEÑO MOBILE-FIRST

La aplicación debe ser Mobile First.

Prioridad:

1. teléfonos;
2. tablets;
3. desktop.

La mayoría de los usuarios accederán desde WhatsApp mediante un teléfono.

Debe funcionar correctamente en:

- móviles pequeños;
- móviles grandes;
- tablets;
- notebooks;
- desktop.

No permitir:

- scroll horizontal;
- elementos cortados;
- texto fuera de pantalla;
- imágenes deformadas;
- botones demasiado pequeños;
- contenido superpuesto incorrectamente.

Los elementos interactivos deben ser cómodos para interacción táctil.

---

# 11. ESTRUCTURA DE LA INVITACIÓN

La página pública debe contener las siguientes secciones.

## HERO / PORTADA

Debe incluir:

- imagen de portada;
- Baby Shower;
- Giovanni;
- decoración;
- animaciones suaves.

El nombre Giovanni debe ser el elemento visual principal.

## PADRES

Debe incluir:

- fotografías;
- nombres;
- breve texto;
- composición elegante.

## EVENTO

Debe mostrar:

- fecha;
- hora;
- lugar;
- dirección;
- mapa;
- botón "Cómo llegar".

## REGALOS

Debe mostrar:

- imagen;
- nombre;
- descripción;
- cantidad total;
- cantidad disponible;
- progreso;
- estado;
- acción para reservar.

Estados:

- Disponible;
- Parcialmente reservado;
- Agotado.

## FOOTER

Debe incluir:

- mensaje de agradecimiento;
- decoración;
- información adicional si corresponde.

Cada sección debe ser un componente independiente cuando corresponda.

---

# 12. ANIMACIONES

Utilizar Framer Motion.

Las animaciones deben ser:

- suaves;
- elegantes;
- discretas;
- rápidas.

Utilizar cuando aporte valor:

- fade-in;
- slide-up;
- scale suave;
- aparición progresiva;
- animaciones al hacer scroll;
- hover;
- transición de tarjetas;
- progreso animado de regalos.

No abusar de las animaciones.

La página debe seguir siendo rápida.

Respetar:

`prefers-reduced-motion`

Si el usuario tiene reducidas las animaciones del sistema, reducirlas o deshabilitarlas.

---

# 13. SUPABASE

Utilizar Supabase como backend y PostgreSQL como base de datos.

Las credenciales deben provenir exclusivamente de variables de entorno.

Variables esperadas:

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

La `SUPABASE_SERVICE_ROLE_KEY` es exclusivamente server-side.

Nunca:

- exponerla al cliente;
- utilizarla en Client Components;
- incluirla en código público;
- incluirla en Git;
- enviarla innecesariamente al navegador.

Crear `.env.example`.

Nunca incluir secretos reales en `.env.example`.

`.env` debe estar en `.gitignore`.

---

# 14. BASE DE DATOS

Mantener la base de datos simple y normalizada.

Tablas principales:

- `events`
- `parents`
- `gifts`
- `gift_reservations`

## events

Campos sugeridos:

- id
- name
- baby_name
- date
- time
- venue
- address
- latitude
- longitude
- welcome_message
- cover_image
- created_at
- updated_at

## parents

Campos sugeridos:

- id
- event_id
- name
- photo
- description
- sort_order
- created_at

## gifts

Campos sugeridos:

- id
- event_id
- name
- description
- image
- quantity
- reserved_quantity
- sort_order
- active
- created_at
- updated_at

## gift_reservations

Campos sugeridos:

- id
- gift_id
- guest_name
- quantity
- created_at

Agregar:

- primary keys;
- foreign keys;
- constraints;
- índices necesarios.

No agregar campos que no sean necesarios.

---

# 15. RESERVAS DE REGALOS — REGLA CRÍTICA

La reserva de regalos es una funcionalidad crítica.

Debe funcionar correctamente con múltiples usuarios simultáneos.

NO confiar únicamente en el frontend.

NO utilizar una lógica como:

```typescript
if (available) {
  reserve();
}