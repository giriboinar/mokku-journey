# Raja's Tirumala Journey

A 16-stage devotional journey site — an interactive walk through the Tirumala
pilgrimage with stage artwork, Telugu/English toggle, route map, timeline,
progress tracker, and devotional music.

Live site: https://giriboinar.github.io/raja-tirumala-journey/

## Run locally

Just open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8080
# open http://localhost:8080
```

## Run with Docker

```bash
docker build -t giriboinar/raja-tirumala-journey:latest .
docker run --rm -p 8080:8080 giriboinar/raja-tirumala-journey:latest
# open http://localhost:8080
```

The image serves the static site with nginx on port 8080 as a non-root user,
with a healthcheck and long-lived caching for static assets.

## CI/CD

`.github/workflows/docker-build-push.yml` builds the image on every push/PR,
scans it with Trivy (fails on HIGH/CRITICAL vulnerabilities), and pushes
`giriboinar/raja-tirumala-journey` (`:latest` + commit-SHA tags) to Docker Hub
on main-branch pushes. The push step needs the `DOCKERHUB_USERNAME` and
`DOCKERHUB_TOKEN` repository secrets.

## Project structure

| File | Purpose |
| ---- | ------- |
| `index.html` | Page shell |
| `styles.css` | Styling |
| `app.js`, `journey.js` | Journey logic and interactivity |
| `stage-01.jpg` … `stage-16.jpg` | Stage artwork |
| `om-namo-venkatesaya.mp3` | Devotional chant (music toggle) |
| `Dockerfile`, `nginx.conf`, `.dockerignore` | Container build |
