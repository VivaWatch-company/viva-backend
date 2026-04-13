import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';

describe('SubscriptionController (e2e)', () => {
  let app: INestApplication;
  let createdSubscriptionId: string;
  let planId: string;

  const subscriptionDto = {
    planId: '',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const planResponse = await request(app.getHttpServer())
      .post('/plans')
      .send({
        name: 'Plan for Subscription Test ' + Date.now(),
        price: 49.99,
        period: 'MONTHLY',
        isActive: true,
      });

    planId = planResponse.body.id;
    subscriptionDto.planId = planId;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/subscriptions (POST)', () => {
    it('should create a subscription', async () => {
      const response = await request(app.getHttpServer())
        .post('/subscriptions')
        .send(subscriptionDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.planId).toBe(planId);
      expect(response.body.status).toBe('INACTIVE');
      createdSubscriptionId = response.body.id;
    });
  });

  describe('/subscriptions (GET)', () => {
    it('should return all subscriptions', async () => {
      const response = await request(app.getHttpServer())
        .get('/subscriptions')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('/subscriptions/:id (GET)', () => {
    it('should return a subscription by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/subscriptions/${createdSubscriptionId}`)
        .expect(200);

      expect(response.body.id).toBe(createdSubscriptionId);
    });

    it('should return error for non-existent subscription', async () => {
      await request(app.getHttpServer())
        .get('/subscriptions/00000000-0000-0000-0000-000000000000')
        .expect(200)
        .then((res) => {
          expect(res.body).toHaveProperty('error');
        });
    });
  });

  describe('/subscriptions/:id (PUT)', () => {
    it('should update a subscription', async () => {
      const response = await request(app.getHttpServer())
        .put(`/subscriptions/${createdSubscriptionId}`)
        .send({ status: 'ACTIVE' })
        .expect(200);

      expect(response.body.status).toBe('ACTIVE');
    });
  });

  describe('/subscriptions/:id (DELETE)', () => {
    it('should delete a subscription', async () => {
      await request(app.getHttpServer())
        .delete(`/subscriptions/${createdSubscriptionId}`)
        .expect(204);

      const response = await request(app.getHttpServer())
        .get(`/subscriptions/${createdSubscriptionId}`)
        .expect(200);

      expect(response.body).toHaveProperty('error');
    });
  });
});
