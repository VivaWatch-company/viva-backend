import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';

describe('NotificationController (e2e)', () => {
  let app: INestApplication;
  let createdNotificationId: string;
  let deviceId: string;
  let companyId: string;

  const notificationDto = {
    deviceId: '',
    caregiverId: '00000000-0000-0000-0000-000000000001',
    type: 'GENERIC',
    message: 'Test notification',
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
        name: 'Company for Notification Test',
        slug: 'company-notification-test-' + Date.now(),
        document: '12345678901237',
      });

    companyId = companyResponse.body.id;

    const deviceResponse = await request(app.getHttpServer())
      .post('/devices')
      .send({
        name: 'Device for Notification Test',
        serialNumber: 'NOTIF-' + Date.now(),
        companyId,
      });

    deviceId = deviceResponse.body.id;
    notificationDto.deviceId = deviceId;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/notifications (POST)', () => {
    it('should create a notification', async () => {
      const response = await request(app.getHttpServer())
        .post('/notifications')
        .send(notificationDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.message).toBe(notificationDto.message);
      createdNotificationId = response.body.id;
    });
  });

  describe('/notifications (GET)', () => {
    it('should return all notifications', async () => {
      const response = await request(app.getHttpServer())
        .get('/notifications')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('/notifications/:id (GET)', () => {
    it('should return a notification by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/notifications/${createdNotificationId}`)
        .expect(200);

      expect(response.body.id).toBe(createdNotificationId);
    });

    it('should return error for non-existent notification', async () => {
      await request(app.getHttpServer())
        .get('/notifications/00000000-0000-0000-0000-000000000000')
        .expect(200)
        .then((res) => {
          expect(res.body).toHaveProperty('error');
        });
    });
  });
});
