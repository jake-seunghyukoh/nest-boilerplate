import { AppModule } from '@app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as helmet from 'helmet';

// import * as csurf from 'csurf';
// import * as session from 'express-session';
// import { env } from 'process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  app.enableCors();

  app.use(cookieParser());
  // app.use(
  //   session({
  //     secret: env.SESSION_SECRET,
  //     resave: false,
  //     saveUninitialized: false,
  //   }),
  // );
  // app.use(csurf());

  app.use(compression());
  app.use(helmet());

  await app.listen(3000);
}
bootstrap();
