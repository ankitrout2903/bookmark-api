import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService) {}

  async signup(dto: AuthDto) {
    // generate password
    const hash = await argon.hash(dto.password);

    // save user to db
    const user = await this.prismaService.user.create({
      data: {
        email: dto.email,
        hash,
      },
      
    });

    delete user.hash;

    // return saved user
    return user;
  }

  signin() {
    return { msg: 'I am signin' };
  }
}
