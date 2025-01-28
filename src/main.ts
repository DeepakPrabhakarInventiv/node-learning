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

  hbs.registerHelper('truncateWords', function (text, wordLimit) {
    if (!text) return '';
    const words = text.split(' ');
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(' ') + '...'
      : text;
  });

  // Register custom helper to compare two values
  hbs.registerHelper('ifNotEqual', function (value1, value2, options) {
    if (value1 !== value2) {
      return options.fn(this); // Render block if values are not equal
    } else {
      return options.inverse(this); // Render else block if values are equal
    }
  });

  // Register a date format helper
  const moment = require('moment');
  hbs.registerHelper('formatDate', function (dateString, format) {
    return moment(dateString).format(format || 'MMM DD, YYYY, hh:mm:ss A');
  });


  app.setViewEngine('hbs');

  await app.listen(process.env.PORT ?? 3000);

}
bootstrap();
