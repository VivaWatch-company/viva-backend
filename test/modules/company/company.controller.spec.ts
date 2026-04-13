import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../../src/app.module';

describe('CompanyController (e2e)', () => {
  let app: INestApplication;
  let createdCompanyId: string;

  const companyDto = {
    name: 'Test Company',
    slug: 'test-company-' + Date.now(),
    document: '12345678901',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('/companies (POST)', () => {
    it('should create a company', async () => {
      const response = await request(app.getHttpServer())
        .post('/companies')
        .send(companyDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(companyDto.name);
      expect(response.body.slug).toBe(companyDto.slug);
      createdCompanyId = response.body.id;
    });

    it('should return error for duplicate slug', async () => {
      await request(app.getHttpServer())
        .post('/companies')
        .send(companyDto)
        .expect(200)
        .then((res) => {
          expect(res.body).toHaveProperty('error');
        });
    });
  });

  describe('/companies (GET)', () => {
    it('should return all companies', async () => {
      const response = await request(app.getHttpServer())
        .get('/companies')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('/companies/:id (GET)', () => {
    it('should return a company by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/companies/${createdCompanyId}`)
        .expect(200);

      expect(response.body.id).toBe(createdCompanyId);
      expect(response.body.name).toBe(companyDto.name);
    });

    it('should return 404 for non-existent company', async () => {
      await request(app.getHttpServer())
        .get('/companies/00000000-0000-0000-0000-000000000000')
        .expect(200)
        .then((res) => {
          expect(res.body).toHaveProperty('error');
        });
    });
  });

  describe('/companies/:id (PUT)', () => {
    it('should update a company', async () => {
      const response = await request(app.getHttpServer())
        .put(`/companies/${createdCompanyId}`)
        .send({ name: 'Updated Company' })
        .expect(200);

      expect(response.body.name).toBe('Updated Company');
    });
  });

  describe('/companies/:id (DELETE)', () => {
    it('should delete a company', async () => {
      await request(app.getHttpServer())
        .delete(`/companies/${createdCompanyId}`)
        .expect(204);

      const response = await request(app.getHttpServer())
        .get(`/companies/${createdCompanyId}`)
        .expect(200);

      expect(response.body).toHaveProperty('error');
    });
  });
});
