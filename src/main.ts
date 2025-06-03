import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(new ValidationPipe(
    {
      whitelist:true,
      forbidNonWhitelisted:true,
      transform:true,
    }
  ));

  // Enhanced Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('WebManager SEPPAT API')
    .setDescription(`
      ## API Documentation for WebManager SEPPAT Backend
      
      This API provides comprehensive maintenance management functionality for SEPPAT (Sistema de Gestión de Mantenimiento).
      
      ### Features:
      - **SAP Integration**: Synchronization with SAP systems
      - **Maintenance Management**: Complete CRUD operations for maintenance notices and orders
      - **User Management**: Master users and reporter users with role-based access
      - **Equipment Management**: Equipment registry and technical specifications
      - **Inspection Management**: Inspection catalogs and procedures
      - **Material Management**: Material and parts management
      
      ### Base URL: \`/api/v1\`
      ### Documentation URL: \`/api/docs\`
    `)
    .setVersion('1.0.0')
    .setContact(
      'SEPPAT Development Team',
      'https://seppat.com',
      'dev@seppat.com'
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addServer('http://localhost:3000', 'Development Server')
    .addServer('https://api.seppat.com', 'Production Server')
    .addTag('sap', 'SAP Integration - Synchronization and data exchange with SAP systems')
    .addTag('avisos_mantenimiento', 'Maintenance Notices - Create, manage and track maintenance notices')
    .addTag('ordenes_mantenimiento', 'Maintenance Orders - Maintenance order lifecycle management')
    .addTag('reporter_user', 'Reporter Users - Field users who report maintenance issues')
    .addTag('puesto_trabajo', 'Work Positions - Job positions and work center management')
    .addTag('equipos', 'Equipment Management - Equipment registry and technical specifications')
    .addTag('tipo_avisos', 'Notice Types - Classification and categorization of maintenance notices')
    .addTag('master_user', 'Master Users - Administrative users with full system access')
    .addTag('material', 'Material Management - Materials, parts and inventory management')
    .addTag('inspeccion', 'Inspection Management - Inspection procedures and catalogs')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'none',
      filter: true,
      showRequestHeaders: true,
      tryItOutEnabled: true,
    },
    customSiteTitle: 'WebManager SEPPAT API Documentation',
    customfavIcon: '/favicon.ico',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info .title { color: #2c3e50; }
      .swagger-ui .scheme-container { background: #f8f9fa; padding: 15px; border-radius: 5px; }
    `,
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log(`🚀 Application is running on: http://localhost:${process.env.PORT ?? 3000}`);
  console.log(`📚 Swagger documentation available at: http://localhost:${process.env.PORT ?? 3000}/api/docs`);
}
bootstrap();
