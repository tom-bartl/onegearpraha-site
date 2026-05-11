# OneGear Praha site

Launch checklist for publishing this static site on GitHub Pages with custom domain onegearpraha.cc.

## Current status

- Static site files are ready.
- CNAME file is present and set to onegearpraha.cc.
- Git branch is main.
- Git remote is not configured yet.

## 1) Create and connect the GitHub repository

Create a public repository on GitHub, for example:

- onegearpraha-site

Then run:

```bash
cd ~/Sites/onegearpraha-site
git add .
git commit -m "Prepare launch"
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/onegearpraha-site.git
git push -u origin main
```

If you already have a remote with a different URL, update it with:

```bash
git remote set-url origin https://github.com/<YOUR_GITHUB_USERNAME>/onegearpraha-site.git
git push -u origin main
```

## 2) Enable GitHub Pages

In the GitHub repository:

1. Open Settings -> Pages.
2. In Build and deployment:
3. Source: Deploy from a branch.
4. Branch: main and /(root).
5. Save.

Because CNAME already exists in this repo, Pages should detect onegearpraha.cc automatically.

## 3) Configure DNS for onegearpraha.cc

At your domain registrar DNS panel, create these records:

- A record: Host @ -> 185.199.108.153
- A record: Host @ -> 185.199.109.153
- A record: Host @ -> 185.199.110.153
- A record: Host @ -> 185.199.111.153
- CNAME record: Host www -> <YOUR_GITHUB_USERNAME>.github.io

Remove any conflicting existing records for @ or www.

Optional IPv6 support (recommended):

- AAAA: @ -> 2606:50c0:8000::153
- AAAA: @ -> 2606:50c0:8001::153
- AAAA: @ -> 2606:50c0:8002::153
- AAAA: @ -> 2606:50c0:8003::153

## 4) Finish domain setup on GitHub

Back in Settings -> Pages:

1. Ensure Custom domain is onegearpraha.cc.
2. Wait until DNS check passes (can take minutes to a few hours).
3. Enable Enforce HTTPS.

## 5) Verify after propagation

Check in browser:

- https://onegearpraha.cc
- https://www.onegearpraha.cc

Both should resolve to the same site over HTTPS.

## Notes

- If you change DNS and nothing updates yet, wait for propagation and clear DNS cache in your browser/OS.
- Keep the CNAME file in the repository root.
