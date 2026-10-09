# benschou.com

Minimal academic site using the Anatole Hugo theme.

## Update content
1. Update the tracked website resume source: `data/resume.yaml`. The one-page PDF is generated separately from `/Users/Ben/Code/ben_resume/resume.yaml`.
2. Regenerate site pages:
   ```bash
   ruby scripts/sync_resume.rb
   ```
   To regenerate selected pages, use `RESUME_PAGES=experience,education,about ruby scripts/sync_resume.rb`. `RESUME_SOURCE` optionally imports another YAML file; otherwise the tracked source is used.
3. To publish a rebuilt PDF, replace `static/resume.pdf`, add a `static/resume-<first-eight-SHA256-digits>.pdf` copy, and update the resume URLs in `config/_default/menus.en.toml`, `config/_default/params.toml`, and `content/english/_index.md`.

## Local preview
```bash
./scripts/dev.sh
```

## Deploy
GitHub Actions builds and publishes to GitHub Pages on every push to `main`.
