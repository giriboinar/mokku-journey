# Raja's Tirumala Journey — 16-stage devotional site served by nginx
# Build:  docker build -t giriboinar/raja-tirumala-journey:latest .
# Run:    docker run --rm -p 8080:8080 giriboinar/raja-tirumala-journey:latest
FROM nginx:1.29-alpine

LABEL org.opencontainers.image.title="Raja's Tirumala Journey" \
      org.opencontainers.image.description="16-stage Tirumala Mokku journey static site" \
      org.opencontainers.image.source="https://github.com/giriboinar/raja-tirumala-journey"

# Patch OS packages to latest (alpine 3.23) to clear HIGH/CRITICAL CVEs
RUN apk upgrade --no-cache

# Serve on unprivileged port 8080 so the container runs as non-root
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Static site content (CSS, JS, images, audio)
COPY --chown=nginx:nginx index.html styles.css app.js journey.js om-namo-venkatesaya.mp3 /usr/share/nginx/html/
COPY --chown=nginx:nginx stage-*.jpg /usr/share/nginx/html/

EXPOSE 8080
USER nginx

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:8080/ || exit 1
