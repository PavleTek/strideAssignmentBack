import { Request, Response, NextFunction } from 'express';
import { RegisterRequest, LoginRequest } from '../types';

export const validateRegister = (req: Request, res: Response, next: NextFunction): void => {
  const { username, email, password }: RegisterRequest = req.body;

  const errors: string[] = [];

  if (!username || typeof username !== 'string' || username.trim().length === 0) {
    errors.push('Username is required');
  }

  if (!email || typeof email !== 'string' || email.trim().length === 0) {
    errors.push('Email is required');
  } else {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push('Invalid email format');
    }
  }

  if (!password || typeof password !== 'string') {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    res.status(400).json({ 
      error: 'Validation failed', 
      details: errors 
    });
    return;
  }

  // Trim whitespace
  req.body.username = username.trim();
  req.body.email = email.trim().toLowerCase();
  
  next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction): void => {
  const { usernameOrEmail, password }: LoginRequest = req.body;

  const errors: string[] = [];

  if (!usernameOrEmail || typeof usernameOrEmail !== 'string' || usernameOrEmail.trim().length === 0) {
    errors.push('Username or email is required');
  }

  if (!password || typeof password !== 'string') {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    res.status(400).json({ 
      error: 'Validation failed', 
      details: errors 
    });
    return;
  }

  // Trim whitespace
  req.body.usernameOrEmail = usernameOrEmail.trim();
  
  next();
};
