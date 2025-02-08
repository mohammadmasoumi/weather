# Weather API

## Project structure

```text
weather-api/
│── src/
│   ├── controllers/
│   │   ├── weather.controller.ts
│   ├── entities/
│   │   ├── Weather.ts
│   ├── middlewares/
│   │   ├── errorHandler.ts
│   ├── routes/
│   │   ├── weather.routes.ts
│   ├── services/
│   │   ├── weather.service.ts
│   ├── utils/
│   │   ├── validateRequest.ts
│   ├── app.ts
│   ├── server.ts
│── .env
│── ormconfig.json
│── tsconfig.json
│── package.json
│── README.md
```

## 🛠 Setup

1. Install dependencies:
```shell
npm install
```
2. Run PostgresSQL and Redis (if using Docker):
```shell
cp deployments/local
docker compose up -d
```
3. Run migrations:
```shell
npm run migration:run
```
4. Start the server:
```shell
npm start
```
5. Access **Swagger Docs**:

[http://localhost:3000/api-docs](http://localhost:3000/api-docs)

