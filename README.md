# SĀKURĀ RETREAT — Immersive Retreat Booking Experience

The production website for SĀKURĀ RETREAT: a bilingual, mobile-first digital journey for 21 facial and body experiences.

Customer path: **Discover → Feel → Explore → Choose → Book → Arrive**.

## Experience system

- A scroll-scrubbed cinematic journey with reversible camera push, layered depth and pinned scenes.
- An adaptive motion system for full, lite and reduced-motion devices.
- A hospitality-led, image-first narrative shaped around privacy and quiet luxury.
- A responsive “Private Edit” that recommends three experiences instantly.
- Progressive service disclosure: listed price, direct rate, duration and detail appear in context.
- A six-step luxury booking flow that never reloads the page.
- Direct handoff to Zalo, Messenger, WhatsApp or telephone for personal confirmation.
- Vietnamese and English language versions in one interface.
- An exact 20% direct website privilege across the complete collection.
- Embedded directions plus separate Vietnam and International Concierge paths.

For an external Cloudflare deployment, read [CLOUDFLARE_DEPLOYMENT_GUIDE.md](./CLOUDFLARE_DEPLOYMENT_GUIDE.md).

## Technical foundation

Next.js, React and Vinext, prepared for Cloudflare Workers.

## Prerequisites

- Node.js `>=22.13.0`
- Linux with `flock`, `curl`, and GNU `timeout`

## Important project locations

- `app/SakuraExperience.tsx`: interaction, discovery, booking and Concierge journey
- `app/content.ts`: complete Vietnamese and English hospitality copy
- `app/services.ts`: the 21 approved services, durations and listed prices
- `app/globals.css`: visual system and responsive behaviour
- `public/brand`: official SĀKURĀ brand assets
- `public/concierge`: Zalo, KakaoTalk, Telegram and WeChat QR assets
- `public/images`: retreat and service imagery

## Diagnostic Commands

- `npm run install:ci`: perform the one bounded lockfile install
- `npm run dev`: start the Vite/Vinext development server
- `npm run build`: build the deployable Sites artifact
- `npm run start`: start the built Vinext application
- `npm test`: build and preflight the rendered page, bilingual catalog and exact direct rates
- `npm run db:generate`: generate Drizzle migrations after schema changes
