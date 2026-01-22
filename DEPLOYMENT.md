# Cloudflare Pages + Porkbun DNS (Anatole Hugo)

This repo uses the Anatole Hugo theme.

## 1) Create the Cloudflare Pages project
1. Log in to Cloudflare.
2. Go to **Workers & Pages → Pages → Create a project**.
3. Connect your GitHub account and select this repo.
4. Set build settings:
   - Framework preset: **Hugo**
   - Build command:
     ```bash
     ./scripts/build.sh
     ```
   - Build output directory: `public`
   - Environment variables:
     - `HUGO_VERSION` = `0.154.5`
     - `HUGO_ENV` = `production`

## 2) Add the custom domain in Cloudflare Pages
1. Open your Pages project.
2. Go to **Custom domains → Set up a custom domain**.
3. Add both:
   - `benschou.com`
   - `www.benschou.com`

Cloudflare will show the DNS records it expects.

## 3) Move DNS to Cloudflare (no extra cost)
Moving DNS does **not** change your registrar (Porkbun) or what you pay; it only changes the nameservers.

1. In Cloudflare, create a new site for `benschou.com` (free plan is fine).
2. Cloudflare will give you **two nameservers**.
3. In Porkbun, go to **Domain Management → Nameservers** and set **Custom** nameservers to the two Cloudflare nameservers.
4. Wait for DNS to propagate (usually minutes, sometimes up to 24 hours).

Once the nameservers are active, Cloudflare will automatically create the needed DNS records for your Pages custom domain.

## 4) Verify
- Visit `https://benschou.com` and `https://www.benschou.com`.
- Cloudflare Pages will provision HTTPS certificates automatically.

## Local preview
```bash
./scripts/dev.sh
```
