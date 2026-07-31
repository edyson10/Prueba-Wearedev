jest.mock('../src/config/database', () => {
  const { Sequelize } = require('sequelize');
  return new Sequelize({ dialect: 'sqlite', storage: ':memory:', logging: false });
});

const { sequelize } = require('../src/models');
const authService = require('../src/services/auth.service');

beforeAll(async () => {
  await sequelize.sync();
  await authService.createUser('testuser', 'Password123!');
});

afterAll(async () => {
  await sequelize.close();
});

describe('auth.service', () => {
  it('login retorna un token JWT con credenciales válidas', async () => {
    const result = await authService.login('testuser', 'Password123!');

    expect(result.token).toBeDefined();
    expect(result.user.username).toBe('testuser');
  });

  it('login lanza ApiError 401 si la contraseña es incorrecta', async () => {
    await expect(authService.login('testuser', 'wrong-password')).rejects.toMatchObject({
      statusCode: 401,
    });
  });

  it('login lanza ApiError 401 si el usuario no existe', async () => {
    await expect(authService.login('no-existe', 'Password123!')).rejects.toMatchObject({
      statusCode: 401,
    });
  });
});
