# OneGear Praha website

Static website starter for GitHub Pages with custom domain `onegearpraha.cc`.

## Files

- `index.html` - page content
- `styles.css` - visual style and responsive layout
- `script.js` - reveal-on-scroll animation + footer year
- `CNAME` - GitHub Pages custom domain

## Publish on GitHub Pages

1. Create a public repository on GitHub (recommended name: `<your-github-username>.github.io`).
2. In terminal, run:

```bash
cd ~/Sites/onegearpraha-site
git init
git add .
git commit -m "Initial OneGear Praha site"
git branch -M main
git remote add origin https://github.com/<your-github-username>/<your-repo-name>.git
git push -u origin main
```

3. On GitHub: `Settings -> Pages`
4. Under `Build and deployment`:
   - `Source`: `Deploy from a branch`
   - `Branch`: `main` and `/(root)`
5. Confirm custom domain is set to `onegearpraha.cc`.
6. Enable `Enforce HTTPS` when available.

## DNS setup in Namecheap

In `Advanced DNS`, set:

- `A` record: Host `@` -> `185.199.108.153`
- `A` record: Host `@` -> `185.199.109.153`
- `A` record: Host `@` -> `185.199.110.153`
- `A` record: Host `@` -> `185.199.111.153`
- `CNAME` record: Host `www` -> `<your-github-username>.github.io`

Remove conflicting old records for `@` or `www`.
