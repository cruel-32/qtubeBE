FROM node:24

# 타임존 설정 추가



WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8081

CMD ["npm", "run", "dev"]