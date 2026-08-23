# SĀKURĀ RETREAT — Cloudflare deployment

This package contains the complete bilingual SĀKURĀ RETREAT website built with Next.js, React and Vinext for Cloudflare Workers.

## Requirements

- Node.js 22.13 or newer
- A Cloudflare account
- A domain added to Cloudflare, if a custom domain will be used

## Deploy from a local computer

1. Extract the archive into a new folder.
2. Open a terminal in that folder.
3. Install the locked dependencies:

   ```bash
   npm ci
   ```

4. Sign in to Cloudflare:

   ```bash
   npx wrangler login
   ```

5. Build the production Worker:

   ```bash
   npm run build
   ```

6. Deploy the generated Worker and static assets:

   ```bash
   npx wrangler deploy --config dist/server/wrangler.json
   ```

Wrangler will return the public `workers.dev` URL after a successful deployment.

## Connect a custom domain

In Cloudflare Dashboard, open **Workers & Pages → sakura-retreat → Settings → Domains & Routes → Add → Custom Domain**, then enter the intended domain.

## Update the website later

Replace the relevant source files, then repeat:

```bash
npm ci
npm run build
npx wrangler deploy --config dist/server/wrangler.json
```

## Important project locations

- `app/SakuraExperience.tsx`: immersive interface and app-like booking journey
- `app/content.ts`: complete Vietnamese and English interface copy
- `app/services.ts`: the 21 menu services and listed prices
- `app/globals.css`: visual system and responsive layouts
- `public/brand`: official SĀKURĀ brand assets
- `public/concierge`: Zalo, KakaoTalk, Telegram and WeChat QR assets
- `public/images`: retreat and service imagery

## Direct website privilege

The direct website price is calculated in code as exactly 80% of each listed menu price. To change this rule later, update `webPrice()` in `app/services.ts` and preflight every displayed price before deployment.

## Contact information currently configured

- Hotline / Zalo / WhatsApp: `09123 555 03`
- Messenger: `m.me/111809981268423`
- Address: `05 Đường số 4A, Khu dân cư Trung Sơn, Bình Hưng, Hồ Chí Minh`

