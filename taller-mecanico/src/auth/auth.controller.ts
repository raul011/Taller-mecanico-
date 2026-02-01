import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from '../users/dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../users/entities/user.entity';
// import { GetUser } from './decorators/get-user.decorator'; 
import { JwtAuthGuard } from './guards/roles.guard';

// Simple decorator stub if I don't want to make a file yet, but let's do it inline just in case
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
export const GetUserParam = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user;
    if (!user) return null;
    return data ? user[data] : user;
  },
);

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-status')
  @UseGuards(JwtAuthGuard)
  checkAuthStatus(@GetUserParam() user: User) {
    return this.authService.checkAuthStatus(user);
  }
}
