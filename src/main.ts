import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('VivaWatch API')
    .setDescription(
      `
## Overview
VivaWatch is a health monitoring API designed for elderly care. It provides endpoints to manage companies, devices, users, elderly people, measurements, notifications, plans, and subscriptions.

## Authentication
This API uses JWT authentication. Include the token in the Authorization header:
\`Authorization: Bearer <token>\`

## Rate Limiting
Rate limiting is applied based on IP address. Default limits:
- Global: 100 requests per minute
- POST endpoints: 10 requests per minute

## Error Handling
All endpoints return errors in the following format:
\`\`\`json
{
  "error": "ErrorName",
  "message": "Error message"
}
\`\`\`

## Common Status Codes
- 200: Success
- 201: Created
- 204: No Content
- 400: Bad Request
- 404: Not Found
- 429: Too Many Requests
- 500: Internal Server Error
    `,
    )
    .setVersion('1.0')
    .addTag('Companies', 'Company management endpoints')
    .addTag('Users', 'User management endpoints')
    .addTag('Devices', 'Device management endpoints')
    .addTag('Elderly', 'Elderly person management endpoints')
    .addTag('Measurements', 'Health measurement endpoints')
    .addTag('Notifications', 'Notification management endpoints')
    .addTag('Plans', 'Subscription plan endpoints')
    .addTag('Subscriptions', 'Subscription management endpoints')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log(
    `Application is running on: http://localhost:${process.env.PORT ?? 3000}`,
  );
  console.log(
    `Swagger documentation: http://localhost:${process.env.PORT ?? 3000}/api`,
  );
}
bootstrap();
