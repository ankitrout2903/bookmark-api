import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';


describe('App e2e', () => {
  let app: INestApplication;
  let prisma : PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    await app.init();
    prisma = app.get(PrismaService)

    await prisma.cleanDb();
  });

  afterAll(async () => {
    await app.close();
  });
  describe('Auth', () => {
    describe('signup', () => {
      it.todo('should signup');
    });
    describe('signin', () => {
      it.todo('should signin');
    });
  });

  describe('Users', () => {
    describe('Get me', () => {});
    describe('edit user', () => {});
  });


  describe('Bookmarks', () => {
    describe('Create Bookmark', () => {});
    describe('Get bookmarks', () => {});
    describe('Get bookmarks by id', () => {});
    describe('Edit bookmarks', () => {});
    describe('Delete bookmarks', () => {});
    
  });

  
});
