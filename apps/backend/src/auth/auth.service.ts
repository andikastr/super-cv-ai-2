import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  // 1. SYNC (For Google Login) - Returns the DB User (with UUID)
  async syncUser(userDto: any) {
    const { email, name, picture } = userDto;
    
    // Find by email
    let user = await this.prisma.user.findUnique({ where: { email } });
    
    // If not found, Create new
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
          name,
          picture: picture,
          credits: 3,
        },
      });
    }
    return user; // Returns user with the correct UUID
  }

  // 2. REGISTER (For Password Login)
  async register(body: any) {
    const { email, password, name } = body;
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new BadRequestException('Email already in use');

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        picture: `https://ui-avatars.com/api/?name=${name}`,
        credits: 3,
      },
    });
    return user;
  }

  // 3. VALIDATE (For Password Login)
  async validateUser(body: any) {
    const { email, password } = body;
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    const { password: _, ...result } = user;
    return result;
  }
}