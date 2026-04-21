# property-bot

Production-ready Node.js (Express) microservice for WhatsApp property lookups via webhook.

## Features

- Clean MVC-style architecture
- MongoDB with Mongoose
- Input sanitization and validation
- Request logging
- Health check endpoint
- Seed script for sample properties
- Render deployment guidance

## Project structure

```text
.
|-- server.js
|-- package.json
|-- .env
`-- src
    |-- config
    |   `-- db.js
    |-- controllers
    |   `-- propertyController.js
    |-- middleware
    |   |-- errorHandler.js
    |   |-- notFoundHandler.js
    |   |-- requestLogger.js
    |   `-- sanitizePropertyId.js
    |-- models
    |   `-- Property.js
    |-- routes
    |   |-- healthRoutes.js
    |   `-- propertyRoutes.js
    |-- services
    |   `-- propertyService.js
    `-- utils
        `-- seedProperties.js
```

## Installation

1. Install Node.js 18+ and MongoDB.
2. Install dependencies:

```bash
npm install
```

3. Create `.env` from `.env.example`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/property-bot
```

## Run locally

```bash
npm run dev
```

or

```bash
npm start
```

API will be available at `http://localhost:5000`.

## Seed sample data

```bash
npm run seed
```

This inserts sample properties `P101`, `P102`, and `P103`.

## API endpoints

### Health check

`GET /`

Example response:

```json
{
  "status": "success",
  "message": "property-bot service is running"
}
```

### Property webhook

`POST /api/property/get`

Request body:

```json
{
  "propertyId": " P101 "
}
```

Success response:

```json
{
  "status": "success",
  "title": "Modern Family Apartment",
  "location": "Lekki, Lagos",
  "price": "$120,000",
  "bedrooms": 3,
  "pdfLink": "https://example.com/pdfs/p101.pdf"
}
```

Not found response:

```json
{
  "status": "error",
  "message": "Property not found"
}
```

Validation response:

```json
{
  "status": "error",
  "message": "propertyId is required"
}
```

## Postman example

- Method: `POST`
- URL: `http://localhost:5000/api/property/get`
- Headers: `Content-Type: application/json`
- Body:

```json
{
  "propertyId": "P101"
}
```

## Render deployment

1. Push the project to GitHub.
2. Create a new Web Service on Render.
3. Connect your repository.
4. Configure:
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add environment variables in Render:
   - `PORT=10000`
   - `MONGO_URI=<your-mongodb-connection-string>`
6. Deploy the service.
7. Use the deployed URL for your Zephyr webhook, for example:
   `https://your-service.onrender.com/api/property/get`

## Zephyr webhook flow

WhatsApp -> Zephyr -> `POST /api/property/get` -> MongoDB -> JSON response -> Zephyr reply
