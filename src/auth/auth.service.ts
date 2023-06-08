import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { Prisma, User } from '@prisma/client'; 
// Import User model from Prisma client

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService) {}

  async signup(dto: AuthDto): Promise<User> {
    // generate password
    const hash = await argon.hash(dto.password);

    // save user to db
    try {
      const user = await this.prismaService.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });

      delete user.hash;

      // return saved user
      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email already exists');
        }
      }
      throw error;
    }
  }

  async signin(dto: AuthDto): Promise<User> {
    //find the user by email
    const user = await this.prismaService.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    //if user not found throw error
    if (!user) throw new ForbiddenException('Invalid credentials');

    //compare password
    const pwMatches = await argon.verify(user.hash, dto.password);

    //if password not match throw error
    if (!pwMatches) throw new ForbiddenException('Invalid credentials');

    //send back user
    delete user.hash;
    return user;
  }
}
