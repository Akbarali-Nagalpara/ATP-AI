import { IsNotEmpty, IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ImportSwaggerDto {
  @ApiProperty({
    description: 'Name of the project',
    example: 'Ecommerce API',
  })
  @IsString()
  @IsNotEmpty()
  projectName: string;

  @ApiProperty({
    description: 'URL to the Swagger/OpenAPI JSON schema file',
    example: 'https://petstore.swagger.io/v2/swagger.json',
  })
  @IsUrl({ require_tld: false })
  @IsNotEmpty()
  swaggerUrl: string;
}
