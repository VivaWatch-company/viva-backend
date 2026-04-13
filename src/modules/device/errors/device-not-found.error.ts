export class DeviceNotFoundError extends Error {
  constructor(id: string) {
    super(`Device not found: ${id}`);
    this.name = 'DeviceNotFoundError';
  }
}
