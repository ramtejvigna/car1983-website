# Car 1983 � Public Website

The public-facing marketing site for **Car 1983**, a premium taxi and ride service operating across CT, NY, NJ & TX.

Built with [Next.js 16](https://nextjs.org) (App Router, Turbopack), [React 19](https://react.dev), and [Tailwind CSS v4](https://tailwindcss.com). Part of the `car1983-website` Turborepo monorepo.

## Tech Stack

| Tool | Version |
|---|---|
| Next.js | 16.2.6 (App Router) |
| React | 19.2.4 |
| Tailwind CSS | v4 (CSS-first, no config file) |
| TypeScript | 5.x |
| Package manager | pnpm 9 |

## Project Structure

```
src/
+-- app/
    +-- layout.tsx      # Root layout with Geist font + metadata
    +-- page.tsx        # Homepage (all sections)
    +-- globals.css     # Tailwind v4 + shared UI theme
```

### Homepage Sections

- **Navbar** � Fixed, white, logo + Download Now CTA + mobile hamburger
- **Hero** � Full-width headline, floating app UI mockups, download + QR codes
- **Discover** � Feature cards (yellow / lavender / mint) + transportation solutions
- **App Features** � 6-item feature grid
- **Testimonials** � Dark background slider with star ratings
- **Blog** � 3 latest article cards
- **CTA** � Lime-green download call-to-action
- **Footer** � Brand, navigation, policy links, contact

## Getting Started

From the **monorepo root**:

```bash
# Install all dependencies
pnpm install

# Run only this app in dev mode
pnpm turbo run dev --filter=@car1983/public

# Build for production
pnpm turbo run build --filter=@car1983/public
```

The dev server starts at [http://localhost:8080](http://localhost:8080).

## Shared Packages

This app consumes the following workspace packages:

- **`@car1983/ui`** � Shared Radix UI component library
- **`@car1983/types`** � Domain TypeScript types (Rider, Driver, Trip, etc.)
- **`@car1983/utils`** � Utility functions (formatCents, formatPhone, etc.)

## Design Tokens

The primary accent color is **lime-green `#CCFF33`**. Defined via CSS variables in `packages/ui/src/globals.css` and available as Tailwind arbitrary values throughout the app (e.g., `bg-[#CCFF33]`).
