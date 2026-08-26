import { NextFunction, Request, Response } from "express";
import jwt, { SignOptions } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma";

export async function signup(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, password, passwordConfirm } = req.body;

    // Validate data
    if (!email || !password)
      return res.status(400).json({
        message: "Email and password are required",
      });

    const existing_user = await prisma.user.findUnique({
      where: { email },
    });
    if (existing_user)
      return res
        .status(400)
        .json({
          message: "User with this email already exists. Use another email",
        });

    if (password !== passwordConfirm)
      return res.status(400).json({
        message: "Password and password confirm doesn't match",
      });

    // Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Save to database
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
      },
    });

    // Remove password from response
    const { passwordHash: _, ...userWithoutPassword } = newUser;

    return res.status(201).json({
      status: "ok",
      data: userWithoutPassword,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    // check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid email" });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid password" });

    // Create tokens
    const accessToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_ACCESS_SECRET as string,
      { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN } as SignOptions,
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET as string,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN } as SignOptions,
    );

    const { passwordHash: _, ...userWithoutPassword } = user;

    return res.status(200).json({
      status: "ok",
      data: {
        user: userWithoutPassword,
        accessToken,
        refreshToken,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export async function getAllUsers(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const users = await prisma.user.findMany();

    return res.status(200).json({
      status: "ok",
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Failed to get users",
    });
  }
}
