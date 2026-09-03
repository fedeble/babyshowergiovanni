This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Supabase

Las migraciones de Supabase están en `supabase/migrations/`.

Para aplicarlo con Supabase CLI, vinculá el proyecto y ejecutá:

```bash
supabase link --project-ref TU_PROJECT_REF
supabase db push
```

También podés ejecutar los archivos una sola vez desde el SQL Editor de Supabase, respetando el orden de sus nombres. La segunda migración habilita Realtime únicamente para `gifts`.

Requisitos en Supabase:

- Aplicar la migración con el propietario del proyecto desde CLI o SQL Editor.
- Mantener el esquema `public` expuesto en Data API para consultar eventos, regalos y ejecutar la RPC.
- Invocar `reserve_gift` con `p_gift_id`, `p_guest_name` y `p_requested_quantity`.
- No otorgar permisos de escritura directa sobre las tablas a `anon` ni `authenticated`; las reservas públicas deben pasar exclusivamente por la RPC.

### Prueba funcional de reservas

Con las tres variables de `.env.example` cargadas en el entorno, ejecutá `npm run test:reservations`. La service role se usa exclusivamente para crear y limpiar datos temporales de prueba; nunca debe exponerse al navegador.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
