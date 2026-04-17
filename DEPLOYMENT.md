# BetVIP - Hetzner Ubuntu Deployment Guide

## Gereksinimler
- Ubuntu 22.04 LTS
- Minimum 2GB RAM
- Domain adı (DNS ayarları yapılmış)

---

## 1. Sunucuya Bağlanma

```bash
ssh root@SUNUCU_IP_ADRESI
```

---

## 2. Proje Dosyalarını Yükleme

### Seçenek A: Git ile (Önerilen)
```bash
cd /var/www
git clone https://github.com/KULLANICI/betvip.git
cd betvip
```

### Seçenek B: SCP ile
```bash
# Yerel bilgisayarınızdan
scp -r ./bahisYeni root@SUNUCU_IP:/var/www/betvip
```

---

## 3. Sunucu Kurulumu

```bash
cd /var/www/betvip

# Kurulum scriptini çalıştır
chmod +x scripts/deploy.sh
sudo ./scripts/deploy.sh
```

Bu script otomatik olarak kurar:
- Docker & Docker Compose
- Nginx
- Certbot (SSL)

---

## 4. Environment Ayarları

```bash
# .env dosyası oluştur
cp .env.example .env

# Düzenle
nano .env
```

**.env içeriği:**
```env
# PostgreSQL şifresi (güçlü bir şifre seçin)
POSTGRES_PASSWORD="GucluSifre123!@#"

# Database URL (şifreyi yukarıdakiyle aynı yapın)
DATABASE_URL="postgresql://betvip:GucluSifre123!@#@postgres:5432/betvip_db"

# NextAuth Secret (aşağıdaki komutla oluşturun)
# openssl rand -base64 32
NEXTAUTH_SECRET="BURAYA_OLUSTURULAN_KEY"

# Domain adresiniz
NEXTAUTH_URL="https://yourdomain.com"
```

**Secret key oluşturma:**
```bash
openssl rand -base64 32
```

---

## 5. Docker ile Başlatma

```bash
# Uygulamayı başlat
docker-compose up -d --build

# Logları kontrol et
docker-compose logs -f

# Veritabanını oluştur
docker-compose exec app npx prisma db push

# Başlangıç verilerini ekle
docker-compose exec app npm run db:seed
```

---

## 6. Nginx & SSL Kurulumu

```bash
# Domain adınızı yazın
chmod +x scripts/setup-nginx.sh
sudo ./scripts/setup-nginx.sh yourdomain.com
```

---

## 7. Kontrol

```bash
# Docker durumu
docker-compose ps

# Uygulama logları
docker-compose logs app

# PostgreSQL logları
docker-compose logs postgres

# Nginx durumu
systemctl status nginx
```

---

## Yönetim Komutları

### Uygulamayı Yeniden Başlatma
```bash
docker-compose restart app
```

### Güncelleme Yapma
```bash
git pull
docker-compose up -d --build
docker-compose exec app npx prisma db push
```

### Veritabanı Yedekleme
```bash
docker-compose exec postgres pg_dump -U betvip betvip_db > backup_$(date +%Y%m%d).sql
```

### Veritabanı Geri Yükleme
```bash
cat backup.sql | docker-compose exec -T postgres psql -U betvip betvip_db
```

### Logları Görüntüleme
```bash
# Tüm loglar
docker-compose logs -f

# Sadece uygulama
docker-compose logs -f app

# Son 100 satır
docker-compose logs --tail=100 app
```

---

## Sorun Giderme

### Port 3000 kullanımda
```bash
# Portu kullanan işlemi bul
lsof -i :3000
# veya
netstat -tlnp | grep 3000
```

### Docker container başlamıyor
```bash
# Logları kontrol et
docker-compose logs app

# Container'ı yeniden oluştur
docker-compose down
docker-compose up -d --build
```

### Veritabanı bağlantı hatası
```bash
# PostgreSQL çalışıyor mu?
docker-compose ps postgres

# Bağlantıyı test et
docker-compose exec postgres psql -U betvip -d betvip_db -c "SELECT 1"
```

### SSL sertifikası yenileme
```bash
certbot renew --dry-run  # Test
certbot renew            # Gerçek yenileme
```

---

## Güvenlik Önerileri

1. **Firewall ayarları:**
```bash
ufw allow 22/tcp   # SSH
ufw allow 80/tcp   # HTTP
ufw allow 443/tcp  # HTTPS
ufw enable
```

2. **SSH key authentication kullanın**

3. **Root login'i kapatın:**
```bash
nano /etc/ssh/sshd_config
# PermitRootLogin no
systemctl restart sshd
```

4. **Fail2ban kurun:**
```bash
apt install fail2ban
systemctl enable fail2ban
```

---

## Admin Girişi

Deployment sonrası admin hesabı:
- **Email:** admin@betvip.com
- **Şifre:** admin123

⚠️ **ÖNEMLİ:** İlk girişten sonra şifreyi değiştirin!
