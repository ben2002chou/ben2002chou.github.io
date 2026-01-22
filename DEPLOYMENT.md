# GitHub Pages Deployment (Anatole Hugo)

This repo deploys to **GitHub Pages** via GitHub Actions.

## 1) Enable GitHub Pages
1. Go to **GitHub → Repo → Settings → Pages**.
2. Under **Build and deployment**, select **GitHub Actions**.

## 2) DNS setup for benschou.com (Porkbun or Cloudflare DNS)
Point your domain to GitHub Pages:

**A records (apex / root):**
- 185.199.108.153
- 185.199.109.153
- 185.199.110.153
- 185.199.111.153

**CNAME (www):**
- `www` → `ben2002chou.github.io`

## 3) Custom domain in GitHub
1. In **Settings → Pages**, set **Custom domain** to `benschou.com`.
2. Ensure the repo has `static/CNAME` with `benschou.com` (already included).

## 4) Deploy
Push to `main` and GitHub Actions will build and publish automatically.

## Local preview
```bash
./scripts/dev.sh
```
