import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../../src/app.module';

describe('PlanController (e2e)', () => {
  let app: INestApplication;
  let createdPlanId: string;

  const planDto = {
    name: 'Premium Plan ' + Date.now(),
    price: 99.99,
    period: 'MONTHLY',
    isMain: false,
    isActive: true,
    isEnterprise: false,
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

  describe('/plans (POST)', () => {
    it('should create a plan', async () => {
      const response = await request(app.getHttpServer())
        .post('/plans')
        .send(planDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(planDto.name);
      expect(response.body.price).toBe(planDto.price);
      createdPlanId = response.body.id;
    });

    it('should return error for duplicate name', async () => {
      await request(app.getHttpServer())
        .post('/plans')
        .send(planDto)
        .expect(200)
        .then((res) => {
          expect(res.body).toHaveProperty('error');
        });
    });
  });

  describe('/plans (GET)', () => {
    it('should return all plans', async () => {
      const response = await request(app.getHttpServer())
        .get('/plans')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('/plans/:id (GET)', () => {
    it('should return a plan by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/plans/${createdPlanId}`)
        .expect(200);

      expect(response.body.id).toBe(createdPlanId);
    });

    it('should return error for non-existent plan', async () => {
      await request(app.getHttpServer())
        .get('/plans/00000000-0000-0000-0000-000000000000')
        .expect(200)
        .then((res) => {
          expect(res.body).toHaveProperty('error');
        });
    });
  });

  describe('/plans/:id (PUT)', () => {
    it('should update a plan', async () => {
      const response = await request(app.getHttpServer())
        .put(`/plans/${createdPlanId}`)
        .send({ price: 149.99 })
        .expect(200);

      expect(response.body.price).toBe(149.99);
    });
  });

  describe('/plans/:id (DELETE)', () => {
    it('should delete a plan', async () => {
      await request(app.getHttpServer())
        .delete(`/plans/${createdPlanId}`)
        .expect(204);

      const response = await request(app.getHttpServer())
        .get(`/plans/${createdPlanId}`)
        .expect(200);

      expect(response.body).toHaveProperty('error');
    });
  });
});
