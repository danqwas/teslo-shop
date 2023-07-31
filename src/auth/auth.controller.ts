/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import { GetUser, Auth } from './decorators';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoginResponseDto } from './dto/login-user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({
    status: 200,
    description: 'The user was successfully created',
    //return type of the response the token will be generated with the user data
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @ApiResponse({
    status: 200,
    description: 'The user was checked',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @Get('check-auth-status')
  @Auth()
  @ApiBearerAuth()
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }

  @ApiResponse({
    status: 200,
    description: 'The user was successfully created',
    //return type of the response the token will be generated with the user data
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }
  /* 
  @Get('private')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  testingPrivateRoute(
    // @Req() request: Express.Request
    @GetUser() user: User,
    @GetUser('email') email: string
    // @GetRawHeaders() rawHeaders: string
  ) {
    console.log({ user });
    return {
      ok: true,
      message: 'Testing Private Route',
      user,
      email,
      // rawHeaders,
    };
  }
  // @SetMetadata('roles', ['admin', 'super-user'])

  @Get('private2')
  @RoleProtected(ValidRoles.admin, ValidRoles.superUser)
  @UseGuards(AuthGuard(), UserRoleGuard)
  @ApiBearerAuth()
  PrivateRoute2(@GetUser() user: User) {
    return {
      ok: true,
      message: 'Testing Private Route 2',
      user,
    };
  }

  @Get('private3')
  @Auth(ValidRoles.admin)
  @ApiBearerAuth()
  PrivateRoute3(@GetUser() user: User) {
    return {
      ok: true,
      message: 'Testing Private Route 3',
      user,
    };
  }
 */
}
