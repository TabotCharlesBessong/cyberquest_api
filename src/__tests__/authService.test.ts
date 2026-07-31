import { AuthService } from '../services/authService';

jest.mock('../db/models/User', () => ({
  User: { 
    findByPk: jest.fn(), 
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock('../utils/email', () => ({
  sendVerificationEmail: jest.fn(),
  sendWelcomeEmail: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
}));

jest.mock('../utils/token', () => ({
  signToken: jest.fn(() => 'mock-token'),
}));

describe('AuthService', () => {
  const mockUser = {
    id: 'user-1',
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashed-password',
    age: 10,
    avatar: '🦊',
    isVerified: true,
    verificationCode: null,
    verificationCodeExpires: null,
    resetPasswordCode: null,
    resetPasswordExpires: null,
    save: jest.fn(),
    comparePassword: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    const { User } = require('../db/models/User');
    const { signToken } = require('../utils/token');
    
    (User.findByPk as jest.Mock).mockResolvedValue(mockUser);
    (User.findOne as jest.Mock).mockResolvedValue(null);
    (User.create as jest.Mock).mockResolvedValue(mockUser);
    (signToken as jest.Mock).mockReturnValue('mock-token');
    (mockUser.comparePassword as jest.Mock).mockResolvedValue(true);
    (mockUser.save as jest.Mock).mockResolvedValue(mockUser);
  });

  describe('signup', () => {
    test('creates a new user and sends verification email', async () => {
      const { User } = require('../db/models/User');
      const { sendVerificationEmail } = require('../utils/email');
      
      const createdUser = {
        ...mockUser,
        id: 'new-user-id',
        verificationCode: 'ABC123',
        verificationCodeExpires: new Date(),
      };
      
      (User.findOne as jest.Mock).mockResolvedValue(null);
      (User.create as jest.Mock).mockImplementation(() => ({
        ...createdUser,
        verificationCode: 'GENERATED',
        verificationCodeExpires: new Date(Date.now() + 3600000),
      }));

      const result = await AuthService.signup({
        name: 'New User',
        email: 'new@example.com',
        password: 'password123',
      });

      expect(result.user).toBeDefined();
      expect(sendVerificationEmail).toHaveBeenCalledWith(
        'new@example.com',
        expect.any(String)
      );
    });

    test('throws error if email already exists', async () => {
      const { User } = require('../db/models/User');
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      await expect(
        AuthService.signup({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        })
      ).rejects.toThrow('An account with this email already exists');
    });
  });

  describe('verifyEmail', () => {
    test('verifies user with valid code', async () => {
      const userWithCode = {
        ...mockUser,
        isVerified: false,
        verificationCode: 'ABC123',
        verificationCodeExpires: new Date(Date.now() + 3600000),
      };
      const { User } = require('../db/models/User');
      (User.findOne as jest.Mock).mockResolvedValue(userWithCode);
      const { sendWelcomeEmail } = require('../utils/email');

      const result = await AuthService.verifyEmail({ code: 'ABC123' });

      expect(result.user.isVerified).toBe(true);
      expect(result.user.verificationCode).toBeNull();
      expect(sendWelcomeEmail).toHaveBeenCalledWith(userWithCode.email, userWithCode.name);
    });

    test('throws error for invalid code', async () => {
      const { User } = require('../db/models/User');
      (User.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        AuthService.verifyEmail({ code: 'INVALID' })
      ).rejects.toThrow('Invalid verification code');
    });

    test('throws error for expired code', async () => {
      const userWithExpiredCode = {
        ...mockUser,
        verificationCode: 'ABC123',
        verificationCodeExpires: new Date(Date.now() - 3600000),
      };
      const { User } = require('../db/models/User');
      (User.findOne as jest.Mock).mockResolvedValue(userWithExpiredCode);

      await expect(
        AuthService.verifyEmail({ code: 'ABC123' })
      ).rejects.toThrow('Verification code has expired');
    });
  });

  describe('login', () => {
    test('returns user and token for valid credentials', async () => {
      const { User } = require('../db/models/User');
      const { signToken } = require('../utils/token');
      
      const unverifiedUser = { ...mockUser, isVerified: false };
      (User.findOne as jest.Mock).mockResolvedValue(unverifiedUser);

      await expect(
        AuthService.login({ email: 'test@example.com', password: 'password123' })
      ).rejects.toThrow('Please verify your email before logging in');

      const verifiedUser = { ...mockUser, isVerified: true };
      (User.findOne as jest.Mock).mockResolvedValue(verifiedUser);
      (verifiedUser.comparePassword as jest.Mock).mockResolvedValue(true);

      const result = await AuthService.login({ email: 'test@example.com', password: 'password123' });

      expect(result.user).toBe(verifiedUser);
      expect(result.token).toBe('mock-token');
    });

    test('throws error for invalid credentials', async () => {
      const { User } = require('../db/models/User');
      (User.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        AuthService.login({ email: 'test@example.com', password: 'wrong' })
      ).rejects.toThrow('Invalid credentials');
    });
  });

  describe('forgotPassword', () => {
    test('returns generic message if email not found', async () => {
      const { User } = require('../db/models/User');
      (User.findOne as jest.Mock).mockResolvedValue(null);

      const result = await AuthService.forgotPassword('nonexistent@example.com');

      expect(result).toEqual({
        success: true,
        message: 'If an account exists for that email, a reset code has been sent.',
      });
    });

    test('sends reset code for existing user', async () => {
      const { User } = require('../db/models/User');
      const { sendPasswordResetEmail } = require('../utils/email');
      
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      const result = await AuthService.forgotPassword('test@example.com');

      expect(mockUser.resetPasswordCode).toBeDefined();
      expect(mockUser.resetPasswordExpires).toBeDefined();
      expect(sendPasswordResetEmail).toHaveBeenCalledWith(mockUser.email, mockUser.resetPasswordCode);
      expect(result.success).toBe(true);
    });
  });

  describe('resetPassword', () => {
    test('resets password with valid code', async () => {
      const userWithResetCode = {
        ...mockUser,
        resetPasswordCode: 'ABC123',
        resetPasswordExpires: new Date(Date.now() + 3600000),
        save: jest.fn(),
      };
      const { User } = require('../db/models/User');
      (User.findOne as jest.Mock).mockResolvedValue(userWithResetCode);

      const result = await AuthService.resetPassword({
        email: 'test@example.com',
        code: 'ABC123',
        newPassword: 'newpassword123',
      });

      expect(userWithResetCode.password).toBe('newpassword123');
      expect(userWithResetCode.resetPasswordCode).toBeNull();
      expect(userWithResetCode.resetPasswordExpires).toBeNull();
      expect(result.message).toBe('Password reset successful. You can now log in.');
    });

    test('throws error for invalid reset code', async () => {
      const { User } = require('../db/models/User');
      (User.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        AuthService.resetPassword({
          email: 'test@example.com',
          code: 'INVALID',
          newPassword: 'newpassword123',
        })
      ).rejects.toThrow('No password reset pending for this email');
    });
  });

  describe('getMe', () => {
    test('returns user by id', async () => {
      const { User } = require('../db/models/User');
      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);

      const result = await AuthService.getMe('user-1');

      expect(result).toBe(mockUser);
    });

    test('throws error if user not found', async () => {
      const { User } = require('../db/models/User');
      (User.findByPk as jest.Mock).mockResolvedValue(null);

      await expect(AuthService.getMe('invalid-id')).rejects.toThrow('User no longer exists');
    });
  });

  describe('updateProfile', () => {
    test('updates user profile', async () => {
      const { User } = require('../db/models/User');
      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);

      const result = await AuthService.updateProfile('user-1', {
        name: 'Updated Name',
        age: 11,
        avatar: '🦁',
      });

      expect(mockUser.name).toBe('Updated Name');
      expect(mockUser.age).toBe(11);
      expect(mockUser.avatar).toBe('🦁');
      expect(mockUser.save).toHaveBeenCalled();
      expect(result).toBe(mockUser);
    });
  });
});
