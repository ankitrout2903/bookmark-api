import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';

@Injectable()
export class AuthService {
    constructor(private prismaService: PrismaService) {
    }
    signup(dto : AuthDto) {
        return { msg: 'I am signup' }
    }
    signin() {
        return { msg: 'I am signin' }
    }
   
} 
