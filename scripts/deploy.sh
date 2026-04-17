#!/bin/bash

# ===========================================
# BetVIP Deployment Script for Ubuntu Server
# ===========================================

set -e

echo "🚀 BetVIP Deployment Starting..."

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}Please run as root (sudo)${NC}"
  exit 1
fi

# ===========================================
# 1. System Update
# ===========================================
echo -e "${YELLOW}📦 Updating system packages...${NC}"
apt update && apt upgrade -y

# ===========================================
# 2. Install Docker
# ===========================================
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}🐳 Installing Docker...${NC}"
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    systemctl enable docker
    systemctl start docker
else
    echo -e "${GREEN}✓ Docker already installed${NC}"
fi

# ===========================================
# 3. Install Docker Compose
# ===========================================
if ! command -v docker-compose &> /dev/null; then
    echo -e "${YELLOW}🐳 Installing Docker Compose...${NC}"
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
else
    echo -e "${GREEN}✓ Docker Compose already installed${NC}"
fi

# ===========================================
# 4. Install Nginx
# ===========================================
if ! command -v nginx &> /dev/null; then
    echo -e "${YELLOW}🌐 Installing Nginx...${NC}"
    apt install -y nginx
    systemctl enable nginx
else
    echo -e "${GREEN}✓ Nginx already installed${NC}"
fi

# ===========================================
# 5. Install Certbot (SSL)
# ===========================================
if ! command -v certbot &> /dev/null; then
    echo -e "${YELLOW}🔒 Installing Certbot...${NC}"
    apt install -y certbot python3-certbot-nginx
else
    echo -e "${GREEN}✓ Certbot already installed${NC}"
fi

# ===========================================
# 6. Create app directory
# ===========================================
APP_DIR="/var/www/betvip"
echo -e "${YELLOW}📁 Setting up app directory...${NC}"
mkdir -p $APP_DIR
mkdir -p $APP_DIR/public/uploads/deposits
chown -R $SUDO_USER:$SUDO_USER $APP_DIR

echo ""
echo -e "${GREEN}✅ Server setup complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Copy your project files to $APP_DIR"
echo "2. Create .env file: cp .env.example .env"
echo "3. Edit .env with your settings"
echo "4. Run: docker-compose up -d"
echo "5. Run migrations: docker-compose exec app npx prisma db push"
echo "6. Seed database: docker-compose exec app npm run db:seed"
echo ""
