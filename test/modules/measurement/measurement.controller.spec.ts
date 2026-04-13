import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../../src/app.module';

describe('MeasurementController (e2e)', () => {
  let app: INestApplication;
  let createdMeasurementId: string;
  let deviceId: string;
  let companyId: string;

  const measurementDto = {
    deviceId: '',
    bpm: 72,
    spo2: 98,
    fallDetected: false,
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
        name: 'Company for Measurement Test',
        slug: 'company-measurement-test-' + Date.now(),
        document: '12345678901236',
      });

    companyId = companyResponse.body.id;

    const deviceResponse = await request(app.getHttpServer())
      .post('/devices')
      .send({
        name: 'Device for Measurement Test',
        serialNumber: 'MEAS-' + Date.now(),
        companyId,
      });

    deviceId = deviceResponse.body.id;
    measurementDto.deviceId = deviceId;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/measurements (POST)', () => {
    it('should create a measurement', async () => {
      const response = await request(app.getHttpServer())
        .post('/measurements')
        .send(measurementDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.bpm).toBe(measurementDto.bpm);
      expect(response.body.spo2).toBe(measurementDto.spo2);
      createdMeasurementId = response.body.id;
    });
  });

  describe('/measurements (GET)', () => {
    it('should return all measurements', async () => {
      const response = await request(app.getHttpServer())
        .get('/measurements')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should filter measurements by deviceId', async () => {
      const response = await request(app.getHttpServer())
        .get(`/measurements?deviceId=${deviceId}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('/measurements/:id (GET)', () => {
    it('should return a measurement by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/measurements/${createdMeasurementId}`)
        .expect(200);

      expect(response.body.id).toBe(createdMeasurementId);
    });

    it('should return error for non-existent measurement', async () => {
      await request(app.getHttpServer())
        .get('/measurements/00000000-0000-0000-0000-000000000000')
        .expect(200)
        .then((res) => {
          expect(res.body).toHaveProperty('error');
        });
    });
  });

  describe('/measurements/:id (DELETE)', () => {
    it('should delete a measurement', async () => {
      await request(app.getHttpServer())
        .delete(`/measurements/${createdMeasurementId}`)
        .expect(204);

      const response = await request(app.getHttpServer())
        .get(`/measurements/${createdMeasurementId}`)
        .expect(200);

      expect(response.body).toHaveProperty('error');
    });
  });
});
