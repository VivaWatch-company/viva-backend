import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../../src/app.module';

describe('DeviceController (e2e)', () => {
  let app: INestApplication;
  let createdDeviceId: string;
  let companyId: string;

  const deviceDto = {
    name: 'Test Device',
    serialNumber: 'DEV-' + Date.now(),
    companyId: '',
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
        name: 'Company for Device Test',
        slug: 'company-device-test-' + Date.now(),
        document: '12345678901235',
      });

    companyId = companyResponse.body.id;
    deviceDto.companyId = companyId;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/devices (POST)', () => {
    it('should create a device', async () => {
      const response = await request(app.getHttpServer())
        .post('/devices')
        .send(deviceDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(deviceDto.name);
      expect(response.body.serialNumber).toBe(deviceDto.serialNumber);
      createdDeviceId = response.body.id;
    });

    it('should return error for duplicate serialNumber', async () => {
      await request(app.getHttpServer())
        .post('/devices')
        .send(deviceDto)
        .expect(200)
        .then((res) => {
          expect(res.body).toHaveProperty('error');
        });
    });
  });

  describe('/devices (GET)', () => {
    it('should return all devices', async () => {
      const response = await request(app.getHttpServer())
        .get('/devices')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('/devices/:id (GET)', () => {
    it('should return a device by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/devices/${createdDeviceId}`)
        .expect(200);

      expect(response.body.id).toBe(createdDeviceId);
    });

    it('should return error for non-existent device', async () => {
      await request(app.getHttpServer())
        .get('/devices/00000000-0000-0000-0000-000000000000')
        .expect(200)
        .then((res) => {
          expect(res.body).toHaveProperty('error');
        });
    });
  });

  describe('/devices/:id (PUT)', () => {
    it('should update a device', async () => {
      const response = await request(app.getHttpServer())
        .put(`/devices/${createdDeviceId}`)
        .send({ name: 'Updated Device' })
        .expect(200);

      expect(response.body.name).toBe('Updated Device');
    });
  });

  describe('/devices/:id (DELETE)', () => {
    it('should delete a device', async () => {
      await request(app.getHttpServer())
        .delete(`/devices/${createdDeviceId}`)
        .expect(204);

      const response = await request(app.getHttpServer())
        .get(`/devices/${createdDeviceId}`)
        .expect(200);

      expect(response.body).toHaveProperty('error');
    });
  });
});
