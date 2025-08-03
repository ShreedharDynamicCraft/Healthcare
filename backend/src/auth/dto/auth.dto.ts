import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsEnum,
  IsPhoneNumber,
  MaxLength,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../entities/user.entity';

export class LoginDto {
  @ApiProperty({
    example: 'admin@clinic.com',
    description: 'User email address',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @ApiProperty({
    example: 'admin123',
    description: 'User password (minimum 8 characters)',
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;
}

export class RegisterDto {
  @ApiProperty({
    example: 'admin@clinic.com',
    description: 'User email address',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @ApiProperty({
    example: 'SecurePass123!',
    description:
      'Password with at least 8 characters, including uppercase, lowercase, number and special character',
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
  })
  password: string;

  @ApiProperty({
    example: 'John',
    description: 'User first name',
  })
  @IsString()
  @MaxLength(50, { message: 'First name must not exceed 50 characters' })
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'User last name',
  })
  @IsString()
  @MaxLength(50, { message: 'Last name must not exceed 50 characters' })
  lastName: string;

  @ApiPropertyOptional({
    example: '+1234567890',
    description: 'User phone number',
  })
  @IsOptional()
  @IsPhoneNumber(null, { message: 'Please provide a valid phone number' })
  phoneNumber?: string;

  @ApiPropertyOptional({
    example: 'Reception',
    description: 'User department',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  department?: string;

  @ApiPropertyOptional({
    enum: UserRole,
    example: UserRole.STAFF,
    description: 'User role in the system',
  })
  @IsOptional()
  @IsEnum(UserRole, { message: 'Role must be either admin or staff' })
  role?: UserRole;
}

export class AuthResponseDto {
  @ApiProperty({ description: 'JWT access token' })
  accessToken: string;

  @ApiProperty({ description: 'User information' })
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    phoneNumber?: string;
    department?: string;
    avatar?: string;
    isActive: boolean;
    createdAt: Date;
    lastLoginAt?: Date;
  };
}

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty({ enum: UserRole })
  role: UserRole;

  @ApiPropertyOptional()
  phoneNumber?: string;

  @ApiPropertyOptional()
  department?: string;

  @ApiPropertyOptional()
  avatar?: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  lastLoginAt?: Date;
}

export class ChangePasswordDto {
  @ApiProperty({ description: 'Current password' })
  @IsString()
  currentPassword: string;

  @ApiProperty({ description: 'New password' })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
  })
  newPassword: string;
}
