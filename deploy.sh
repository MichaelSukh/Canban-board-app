
# Остановка при любой ошибке
set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW} Начинаем подготовка к запуску контейнеров...${NC}"

# Опрос данных для формирования корневого .env
echo -e "${YELLOW} Введите данные для конфигурации:${NC}"

read -p "Введите ваш домен (например, example.com): " DOMAIN
read -p "Введите имя пользователя БД (например, kanban_user): " DB_USER
read -p "Введите пароль для БД: " DB_PASSWORD
read -p "Введите название БД (например, kanban_db): " DB_NAME

# Формируем DATABASE_URL для внутреннего использования
DB_URL_DOCKER="postgresql://${DB_USER}:${DB_PASSWORD}@db:5432/${DB_NAME}"

# Формируем корневой .env
echo -e "${YELLOW} Формируем корневой .env файл...${NC}"
cat << EOF > .env
DOMAIN=$DOMAIN
POSTGRES_USER=$DB_USER
POSTGRES_PASSWORD=$DB_PASSWORD
POSTGRES_DB=$DB_NAME
EOF

# Генерируем SECRET_KEY и формируем /backend/.env
echo -e "${YELLOW} Генерируем секретный ключ и настраиваем бэкенд...${NC}"

# Генерируем случайную строку через openssl или через /dev/urandom
if command -v openssl >/dev/null 2>&1; then
    GEN_SECRET=$(openssl rand -hex 32)
else
    GEN_SECRET=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 64 | head -n 1)
fi

# На случай если папка еще не создана
mkdir -p backend

# Создаем .env для бэкенда
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

# Сборка и запуск
echo -e "${YELLOW} Собираем и запускаем контейнеры...${NC}"
docker compose up -d --build

# Проверка статуса
echo -e "\n${GREEN}====================================================${NC}"
echo -e "${GREEN} Деплой завершен!${NC}"
echo -e "Домен: ${DOMAIN}"
echo -e "Бэкенд подключен к БД: ${DB_NAME}"
echo -e "SECRET_KEY сгенерирован автоматически."
echo -e "${GREEN}====================================================${NC}"

docker compose ps