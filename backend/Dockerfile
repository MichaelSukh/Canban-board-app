
FROM python:3.12-slim

WORKDIR /app

# отключаем буферизацию для более оперативного отображения логов
ENV PYTHONUNBUFFERED=1

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN mkdir -p static/images static/user_icons

RUN chmod -R 755 static

EXPOSE 8000

CMD ["python", "run.py"]


