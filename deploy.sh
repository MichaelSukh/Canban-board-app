
# Останавливаем выполнение при любой ошибке
set -e

# --- Цвета для вывода ---
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW} Начинаем настройку и развертывание...${NC}"

# Проверка и автоматическая установка Docker
echo -e "${YELLOW} Проверяем наличие Docker...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW} Docker не найден. Начинаем автоматическую установку...${NC}"
    echo -e " Это может занять пару минут, пожалуйста, подождите."
    
    # Скачиваем и запускаем официальный скрипт установки Docker
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh # Удаляем установочный файл за собой
    
    echo -e "${GREEN} Docker успешно установлен!${NC}"
else
    echo -e "${GREEN} Docker уже установлен.${NC}"
fi

# Проверяем, установился ли плагин Docker Compose
if ! docker compose version &> /dev/null; then
    echo -e "${RED} Ошибка: Docker Compose не установлен. Проверьте логи установки.${NC}"
    exit 1
fi

# Опрос данных для формирования корневого .env
echo -e "\n${YELLOW} Введите данные для конфигурации:${NC}"

read -p "Введите ваш домен (например, example.com): " DOMAIN
read -p "Введите имя пользователя БД (например, kanban_user): " DB_USER
read -p "Введите пароль для БД: " DB_PASSWORD
read -p "Введите название БД (например, kanban_db): " DB_NAME

DB_URL_DOCKER="postgresql://${DB_USER}:${DB_PASSWORD}@db:5432/${DB_NAME}"

# Формируем корневой .env
echo -e "\n${YELLOW} Формируем корневой .env файл...${NC}"
cat << EOF > .env
DOMAIN=$DOMAIN
POSTGRES_USER=$DB_USER
POSTGRES_PASSWORD=$DB_PASSWORD
POSTGRES_DB=$DB_NAME
EOF

# Генерируем SECRET_KEY и формируем /backend/.env
echo -e "${YELLOW}🔑 Генерируем секретный ключ и настраиваем бэкенд...${NC}"

if command -v openssl >/dev/null 2>&1; then
    GEN_SECRET=$(openssl rand -hex 32)
else
    GEN_SECRET=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 64 | head -n 1)
fi

mkdir -p backend

cat << EOF > ./backend/.env
DEBUG=false
DATABASE_URL=$DB_URL_DOCKER
SERVER_HOST=0.0.0.0
SERVER_PORT=8000
SECRET_KEY=$GEN_SECRET
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRES_IN=360
EOF

echo -e "${GREEN} Файлы конфигурации успешно созданы.${NC}"

if [ ! -d "/etc/letsencrypt/live/$DOMAIN" ]; then
    echo -e "\n${YELLOW} Получаем первый SSL сертификат для ${DOMAIN}...${NC}"
    # Запускаем временный контейнер Certbot, который сам займет 80 порт
    docker run --rm -p 80:80 -v /etc/letsencrypt:/etc/letsencrypt certbot/certbot certonly \
        --standalone -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos -m $EMAIL
    echo -e "${GREEN} Сертификаты получены!${NC}"
else
    echo -e "\n${GREEN} SSL сертификаты для ${DOMAIN} уже существуют.${NC}"
fi

# Сборка и запуск
echo -e "\n${YELLOW} Собираем и запускаем контейнеры...${NC}"
docker compose up -d --build

# Проверка статуса
echo -e "\n${GREEN}====================================================${NC}"
echo -e "${GREEN} Развертывание успешно завершено!${NC}"
echo -e "Домен: ${DOMAIN}"
echo -e "Бэкенд подключен к БД: ${DB_NAME}"
echo -e "${GREEN}====================================================${NC}"

docker compose ps