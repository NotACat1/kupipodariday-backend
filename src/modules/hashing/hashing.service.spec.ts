import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { HashingService } from './hashing.service';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('HashingService', () => {
  let service: HashingService;
  const mockHash = bcrypt.hash as jest.Mock;
  const mockCompare = bcrypt.compare as jest.Mock;

  beforeEach(async () => {
    jest.resetAllMocks();

    mockHash.mockImplementation((password: string, saltRounds: number) => {
      return Promise.resolve(`hashed_${password}`);
    });
    mockCompare.mockImplementation(
      (password: string, hashedPassword: string) => {
        return Promise.resolve(
          password === hashedPassword.replace('hashed_', ''),
        );
      },
    );

    const module: TestingModule = await Test.createTestingModule({
      providers: [HashingService],
    }).compile();

    service = module.get<HashingService>(HashingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('hashPassword', () => {
    it('should hash the password', async () => {
      const password = 'password123';
      const hashedPassword = await service.hashPassword(password);

      expect(hashedPassword).toBe(`hashed_${password}`);
      expect(mockHash).toHaveBeenCalledWith(password, expect.any(Number));
    });
  });

  describe('comparePasswords', () => {
    it('should return true if passwords match', async () => {
      const password = 'password123';
      const hashedPassword = `hashed_${password}`;

      const result = await service.comparePasswords(password, hashedPassword);

      expect(result).toBe(true);
      expect(mockCompare).toHaveBeenCalledWith(password, hashedPassword);
    });

    it('should return false if passwords do not match', async () => {
      const password = 'password123';
      const hashedPassword = `hashed_differentpassword`;

      const result = await service.comparePasswords(password, hashedPassword);

      expect(result).toBe(false);
      expect(mockCompare).toHaveBeenCalledWith(password, hashedPassword);
    });
  });
});
