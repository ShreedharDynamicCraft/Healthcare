import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  Logger,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import {
  LoginDto,
  RegisterDto,
  AuthResponseDto,
  UserResponseDto,
  ChangePasswordDto,
} from './dto/auth.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const {
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      department,
      role,
    } = registerDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Create new user
    const user = this.userRepository.create({
      email: email.toLowerCase(),
      password,
      firstName,
      lastName,
      phoneNumber,
      department,
      role: role || UserRole.STAFF,
    });

    await this.userRepository.save(user);

    this.logger.log(`New user registered: ${email}`);

    // Generate JWT token
    const tokens = await this.generateTokens(user);

    return {
      accessToken: tokens.accessToken,
      user: this.transformUserToResponse(user),
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    // Find user by email
    const user = await this.userRepository.findOne({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if account is locked
    if (user.isLocked) {
      throw new ForbiddenException(
        'Account is temporarily locked due to multiple failed login attempts. Please try again later.',
      );
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedException(
        'Account is deactivated. Please contact administrator.',
      );
    }

    // Validate password
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      // Increment login attempts
      await user.incrementLoginAttempts();
      await this.userRepository.save(user);

      this.logger.warn(`Failed login attempt for user: ${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    // Reset login attempts on successful login
    user.resetLoginAttempts();
    await this.userRepository.save(user);

    this.logger.log(`User logged in successfully: ${email}`);

    // Generate JWT token
    const tokens = await this.generateTokens(user);

    return {
      accessToken: tokens.accessToken,
      user: this.transformUserToResponse(user),
    };
  }

  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    const { currentPassword, newPassword } = changePasswordDto;

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Validate current password
    const isCurrentPasswordValid = await user.validatePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    // Update password
    user.password = await bcrypt.hash(newPassword, 12);
    await this.userRepository.save(user);

    this.logger.log(`Password changed for user: ${user.email}`);
  }

  async validateUser(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId, isActive: true },
    });

    if (!user) {
      throw new UnauthorizedException('User not found or account deactivated');
    }

    return user;
  }

  async getUserProfile(userId: string): Promise<UserResponseDto> {
    const user = await this.validateUser(userId);
    return this.transformUserToResponse(user);
  }

  async updateUserProfile(
    userId: string,
    updateData: Partial<User>,
  ): Promise<UserResponseDto> {
    const user = await this.validateUser(userId);

    // Update allowed fields
    const allowedFields = [
      'firstName',
      'lastName',
      'phoneNumber',
      'department',
      'avatar',
    ];
    allowedFields.forEach((field) => {
      if (updateData[field] !== undefined) {
        user[field] = updateData[field];
      }
    });

    await this.userRepository.save(user);

    this.logger.log(`User profile updated: ${user.email}`);
    return this.transformUserToResponse(user);
  }

  private async generateTokens(user: User): Promise<{ accessToken: string }> {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  private transformUserToResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      phoneNumber: user.phoneNumber,
      department: user.department,
      avatar: user.avatar,
      isActive: user.isActive,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
    };
  }

  async createDefaultAdmin(): Promise<void> {
    const adminExists = await this.userRepository.findOne({
      where: { email: 'admin@clinic.com' },
    });

    if (!adminExists) {
      const admin = this.userRepository.create({
        email: 'admin@clinic.com',
        password: 'AdminPass123!',
        firstName: 'Admin',
        lastName: 'User',
        role: UserRole.ADMIN,
        department: 'Administration',
      });

      await this.userRepository.save(admin);
      this.logger.log(
        'Default admin user created with email: admin@clinic.com',
      );
    }
  }

  // Admin methods
  async getAllUsers(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.find({
      order: { createdAt: 'DESC' },
    });

    return users.map((user) => this.transformUserToResponse(user));
  }

  async deactivateUser(userId: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    user.isActive = false;
    await this.userRepository.save(user);

    this.logger.log(`User deactivated: ${user.email}`);
  }

  async activateUser(userId: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    user.isActive = true;
    user.loginAttempts = 0;
    user.lockedUntil = null;
    await this.userRepository.save(user);

    this.logger.log(`User activated: ${user.email}`);
  }
}
