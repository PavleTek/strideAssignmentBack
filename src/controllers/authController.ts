import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { RegisterRequest, LoginRequest, AuthResponse, UserWithoutPassword } from '../types';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password }: RegisterRequest = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ]
      }
    });

    if (existingUser) {
      if (existingUser.username === username) {
        res.status(409).json({ error: 'Username already exists' });
        return;
      }
      if (existingUser.email === email) {
        res.status(409).json({ error: 'Email already exists' });
        return;
      }
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        isAdmin: false, // Default to false for new registrations
      },
      select: {
        id: true,
        username: true,
        email: true,
        isAdmin: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Generate token
    const token = generateToken(user);

    const response: AuthResponse = {
      user,
      token,
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { usernameOrEmail, password }: LoginRequest = req.body;

    // Find user by username or email
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: usernameOrEmail },
          { email: usernameOrEmail.toLowerCase() }
        ]
      }
    });

    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Create user object without password
    const userWithoutPassword: UserWithoutPassword = {
      id: user.id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    // Generate token
    const token = generateToken(userWithoutPassword);

    const response: AuthResponse = {
      user: userWithoutPassword,
      token,
    };

    res.json(response);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    // For JWT-based authentication, logout is typically handled client-side
    // by removing the token. However, we can implement a blacklist if needed.
    // For now, we'll just return a success response.
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Failed to logout' });
  }
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    // The user is already attached to req by the auth middleware
    const user = (req as any).user as UserWithoutPassword;
    
    if (!user) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
};
