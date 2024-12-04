FROM mcr.microsoft.com/playwright:v1.49.0-jammy

WORKDIR /app

COPY package*.json .
COPY *config.js .

RUN npm install
RUN npm ci
RUN npx playwright install chromium

COPY . .

CMD ["sh", "-c", "npx playwright test && cp -r playwright-report /app/playwright-report"]