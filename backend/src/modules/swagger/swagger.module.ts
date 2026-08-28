import { Module } from '@nestjs/common';
import { SwaggerService } from './services/swagger.service';
import { SwaggerController } from './controllers/swagger.controller';
import { OpenAPIParser } from './parsers/openapi-parser';
import { SwaggerValidator } from './validators/swagger.validator';

@Module({
  controllers: [SwaggerController],
  providers: [SwaggerService, OpenAPIParser, SwaggerValidator],
  exports: [SwaggerService, OpenAPIParser, SwaggerValidator],
})
export class SwaggerModule {}
