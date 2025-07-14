import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConsoleLogger, ValidationPipe, ValidationPipeOptions } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from "node:fs";
import * as path from "node:path";
import { SwaggerModule } from '@nestjs/swagger';
import { DocumentBuilder } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: new ConsoleLogger({
      json: true,
      colors: process.env.NODE_ENV !== 'production',
    })
  });

  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.getOrThrow<number>("port");
  const isProduction = configService.getOrThrow<boolean>("isProduction");
  const validationOption: ValidationPipeOptions = {
    whitelist: true,
    transform: true,
  };

  app.useGlobalPipes(new ValidationPipe(validationOption));

  // CORS
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || !isProduction) {
        return callback(null, true);
      }
      if (/^(https?:\/\/)?(([\w\d-\.]*)?\.)?071.kr/.test(origin)) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
    optionsSuccessStatus: 204,
  });


  // Swagger
  if (!isProduction) {
    const pkg = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, "../package.json"), "utf-8")
    );
    const swaggerConfig = new DocumentBuilder()
      .setTitle("Polinote API")
      .setDescription("Polinote API Documentation")
      .setVersion(pkg.version)
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup("api-docs", app, document);
  }

  await app.listen(port);
}
bootstrap();
