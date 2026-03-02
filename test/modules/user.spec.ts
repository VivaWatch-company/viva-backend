import { context } from 'test/utils/context';

context('User Module integration tests', () => {
  context('Company', () => {
    context('Company Admin', () => {
      it('should create a company admin user', async () => {});
    });

    context('Company Owner', () => {
      it('should create a company owner user', async () => {});
    });

    context('Caregiver', () => {
      it('should create a caregiver user', async () => {});
    });
  });

  context('System', () => {
    context('System Admin', () => {
      it('should create a system admin user', async () => {});
    });
    context('System owner', () => {});
  });
});
