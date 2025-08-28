FROM python:3.12-slim

WORKDIR /prj/app/backend

RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV FLASK_APP app.py
ENV FLASK_RUN_HOST 0.0.0.0

CMD ["flask", "run"]
