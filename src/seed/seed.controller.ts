import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @ApiResponse({
    status: 200,
    description: 'Seed Executed.',
    //return type of the response the token will be generated with the user data
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @Get()
  @Auth(ValidRoles.admin)
  @ApiBearerAuth()
  executeSeed() {
    return this.seedService.runSeed();
  }
}
