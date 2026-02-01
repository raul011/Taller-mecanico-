import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';
import { JwtAuthGuard } from '../auth/guards/roles.guard';
import { User } from './entities/user.entity';

// Decorator to get user from request
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
export const GetUserParam = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
        const req = ctx.switchToHttp().getRequest();
        const user = req.user;
        if (!user) return null;
        return data ? user[data] : user;
    },
);

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get('preferences')
    @UseGuards(JwtAuthGuard)
    async getPreferences(@GetUserParam() user: User) {
        return this.usersService.getPreferences(user.id);
    }

    @Patch('preferences')
    @UseGuards(JwtAuthGuard)
    async updatePreferences(
        @GetUserParam() user: User,
        @Body() dto: UpdatePreferencesDto
    ) {
        return this.usersService.updatePreferences(user.id, dto);
    }
}
