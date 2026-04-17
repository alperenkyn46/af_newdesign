#!/bin/bash

# ===========================================
# Nginx Configuration Script
# ===========================================

set -e

# Check arguments
if [ -z "$1" ]; then
    echo "Usage: ./setup-nginx.sh yourdomain.com"
    exit 1
fi

DOMAIN=$1

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}🌐 Configuring Nginx for $DOMAIN...${NC}"

# Create Nginx config
cat > /etc/nginx/sites-available/betvip << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    # Redirect HTTP to HTTPS
    location / {
        return 301 https://\$server_name\$request_uri;
    }
}

server {
    listen 443 ssl http2;
    server_name $DOMAIN www.$DOMAIN;

    # SSL certificates (will be configured by Certbot)
    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;

    # SSL settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Max upload size (for deposit proofs)
    client_max_body_size 10M;

    # Proxy to Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Static files
    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 60m;
        add_header Cache-Control "public, immutable";
    }

    # Uploaded files
    location /uploads {
        alias /var/www/betvip/public/uploads;
        expires 30d;
        add_header Cache-Control "public";
    }
}
EOF

# Enable site
ln -sf /etc/nginx/sites-available/betvip /etc/nginx/sites-enabled/

# Remove default site
rm -f /etc/nginx/sites-enabled/default

# Test Nginx config
nginx -t

echo -e "${YELLOW}🔒 Getting SSL certificate...${NC}"

# Get SSL certificate
certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN --redirect

# Reload Nginx
systemctl reload nginx

echo -e "${GREEN}✅ Nginx configured with SSL for $DOMAIN${NC}"
