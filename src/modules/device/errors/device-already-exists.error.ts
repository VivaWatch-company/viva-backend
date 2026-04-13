export class DeviceAlreadyExistsError extends Error {
  constructor(serialNumber: string) {
    super(`Device with serial number "${serialNumber}" already exists`);
    this.name = 'DeviceAlreadyExistsError';
  }
}
