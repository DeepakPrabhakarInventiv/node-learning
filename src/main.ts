import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as hbs from 'hbs';
import * as cookieParser from 'cookie-parser';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);


  // Enable cookie parser middleware
  app.use(cookieParser());

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  // Register the partials directory
  hbs.registerPartials(join(__dirname, '..', 'views', 'partials'));
  hbs.registerHelper('json', function (context) {
    return JSON.stringify(context);
  });

  app.setViewEngine('hbs');

  await app.listen(process.env.PORT ?? 3000);

}
bootstrap();
