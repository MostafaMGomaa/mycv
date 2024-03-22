import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Authentucation System (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request', async () => {
    const testCredentials = {
      email: 'mostaf1a@mailsac.com',
      password: 'passw@rd',
    };
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(testCredentials)
      .expect(201);
    const { id, email } = res.body;
    expect(id).toBeDefined();
    expect(email).toEqual(testCredentials.email);
  });

  it('signup as a new user then get the currently logged in user', async () => {
    const testCredentials = {
      email: 'mostaf1a@mailsac.com',
      password: 'passw@rd',
    };
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(testCredentials)
      .expect(201);

    const cookie = res.get('Set-Cookie');

    const { body } = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.email).toEqual(testCredentials.email);
  });
});
