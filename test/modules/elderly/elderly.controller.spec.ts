import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';

describe('ElderlyController (e2e)', () => {
  let app: INestApplication;
  let createdElderlyId: string;

  const elderlyDto = {
    name: 'John Doe',
    age: '75',
    document: '12345678901',
    birthDate: '1951-01-01',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/elderly (POST)', () => {
    it('should create an elderly', async () => {
      const response = await request(app.getHttpServer())
        .post('/elderly')
        .send(elderlyDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(elderlyDto.name);
      expect(response.body.age).toBe(elderlyDto.age);
      createdElderlyId = response.body.id;
    });
  });

  describe('/elderly (GET)', () => {
    it('should return all elderly', async () => {
      const response = await request(app.getHttpServer())
        .get('/elderly')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('/elderly/:id (GET)', () => {
    it('should return an elderly by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/elderly/${createdElderlyId}`)
        .expect(200);

      expect(response.body.id).toBe(createdElderlyId);
      expect(response.body.name).toBe(elderlyDto.name);
    });

    it('should return error for non-existent elderly', async () => {
      await request(app.getHttpServer())
        .get('/elderly/00000000-0000-0000-0000-000000000000')
        .expect(200)
        .then((res) => {
          expect(res.body).toHaveProperty('error');
        });
    });
  });

  describe('/elderly/:id (PUT)', () => {
    it('should update an elderly', async () => {
      const response = await request(app.getHttpServer())
        .put(`/elderly/${createdElderlyId}`)
        .send({ name: 'Updated Name' })
        .expect(200);

      expect(response.body.name).toBe('Updated Name');
    });
  });

  describe('/elderly/:id (DELETE)', () => {
    it('should delete an elderly', async () => {
      await request(app.getHttpServer())
        .delete(`/elderly/${createdElderlyId}`)
        .expect(204);

      const response = await request(app.getHttpServer())
        .get(`/elderly/${createdElderlyId}`)
        .expect(200);

      expect(response.body).toHaveProperty('error');
    });
  });
});
