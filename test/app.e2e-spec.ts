import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as pactum from 'pactum';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from '../src/auth/dto/auth.dto';
import { EditUserDto } from '../src/user/dto/edit-user.dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    await app.init();
    await app.listen(3333);
    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'ankitrout@mail.com',
      password: '123456',
    };

    describe('signup', () => {
      it('should throw an error if email is empty', () => {
        return pactum.spec()
          .post('/auth/signup')
          .withBody({ password: dto.password })
          .expectStatus(400);
      });

      it('should throw an error if password is empty', () => {
        return pactum.spec()
          .post('/auth/signup')
          .withBody({ email: dto.email })
          .expectStatus(400);
      });

      it('should throw an error if no body', () => {
        return pactum.spec()
          .post('/auth/signup')
          .expectStatus(400);
      });

      it('should signup', () => {
        return pactum.spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
    });

    describe('signin', () => {

      it('should throw an error if email is empty', () => {
        return pactum.spec()
          .post('/auth/signin')
          .withBody({ password: dto.password })
          .expectStatus(400);
      });

      it('should throw an error if password is empty', () => {
        return pactum.spec()
          .post('/auth/signin')
          .withBody({ email: dto.email })
          .expectStatus(400);
      });

      it('should throw an error if no body', () => {
        return pactum.spec()
          .post('/auth/signin')
          .expectStatus(400);
      });

      it('should signin', () => {
        return pactum.spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAt', 'access_token');
      });
    });
  });

  describe('Users', () => {
    describe('Get me', () => {
      it('should get current user', () => {

        return pactum.spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .inspect()
          .expectStatus(200)
      });
    });
    describe('edit user', () => { 
      it('should edit current user', () => {
        const dto : EditUserDto = {
          firstName: 'Anky',
          email: 'ankir@hello.com',
          lastName: 'Rout',
        }
        return pactum.spec()
                 .patch('/users')
                 .withHeaders({
                   Authorization:'Bearer $S{userAt}'
                 })
                 .inspect()
                 .withBody(dto)
                 .expectStatus(200)
                 .expectBodyContains(dto.firstName)
                  .expectBodyContains(dto.lastName)
                  .expectBodyContains(dto.email)
           });
    });
  });

  describe('Bookmarks', () => {
    describe('Create Bookmark', () => { });
    describe('Get bookmarks', () => { });
    describe('Get bookmarks by id', () => { });
    describe('Edit bookmarks by id ', () => { });
    describe('Delete bookmarks by id ', () => { });
  });
});
