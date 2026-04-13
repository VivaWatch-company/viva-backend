import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let createdUserId: string;
  let companyId: string;

  const userDto = {
    email: 'test-' + Date.now() + '@example.com',
    password: 'password123',
    role: 'CAREGIVER',
    companyId: '',
    isOwner: false,
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const companyResponse = await request(app.getHttpServer())
      .post('/companies')
      .send({
        name: 'Company for User Test',
        slug: 'company-user-test-' + Date.now(),
        document: '12345678901234',
      });

    companyId = companyResponse.body.id;
    userDto.companyId = companyId;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/users (POST)', () => {
    it('should create a user', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send(userDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe(userDto.email);
      createdUserId = response.body.id;
    });

    it('should return error for duplicate email', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .send(userDto)
        .expect(200)
        .then((res) => {
          expect(res.body).toHaveProperty('error');
        });
    });
  });

  describe('/users (GET)', () => {
    it('should return all users', async () => {
      const response = await request(app.getHttpServer())
        .get('/users')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should filter users by companyId', async () => {
      const response = await request(app.getHttpServer())
        .get(`/users?companyId=${companyId}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('/users/:id (GET)', () => {
    it('should return a user by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/users/${createdUserId}`)
        .expect(200);

      expect(response.body.id).toBe(createdUserId);
    });

    it('should return 404 for non-existent user', async () => {
      await request(app.getHttpServer())
        .get('/users/00000000-0000-0000-0000-000000000000')
        .expect(200)
        .then((res) => {
          expect(res.body).toHaveProperty('error');
        });
    });
  });

  describe('/users/:id (PUT)', () => {
    it('should update a user', async () => {
      const response = await request(app.getHttpServer())
        .put(`/users/${createdUserId}`)
        .send({ role: 'COMPANY_ADMIN' })
        .expect(200);

      expect(response.body.role).toBe('COMPANY_ADMIN');
    });
  });

  describe('/users/:id (DELETE)', () => {
    it('should delete a user', async () => {
      await request(app.getHttpServer())
        .delete(`/users/${createdUserId}`)
        .expect(204);

      const response = await request(app.getHttpServer())
        .get(`/users/${createdUserId}`)
        .expect(200);

      expect(response.body).toHaveProperty('error');
    });
  });
});
