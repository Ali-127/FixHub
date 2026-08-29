import { NextFunction, Request, Response } from "express";
import jwt, { SignOptions } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma";
import { z } from "zod";

const signupSchema = z
  .object({
    name: z.string().min(2),
    email: z.email(),
    password: z.string().min(6),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords don't match",
    path: ["passwordConfirm"],
  });

export async function signup(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, password, passwordConfirm } = signupSchema.parse(
      req.body,
    );

    // // Validate data
    // if (!email || !password)
    //   return res.status(400).json({
    //     message: "Email and password are required",
    //   });

    const existing_user = await prisma.user.findUnique({
      where: { email },
    });

    if (existing_user)
      return res.status(400).json({
        message: "User with this email already exists. Use another email",
      });

    // if (password !== passwordConfirm)
    //   return res.status(400).json({
    //     message: "Password and password confirm doesn't match",
    //   });

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
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    // Login new user

    return res.status(201).json({
      status: "ok",
      data: newUser,
    });
  } catch (error) {
    console.error("Sign up error: ", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        status: "error",
        data: {
          errors: error.issues,
        },
      });
    }

    next(error);
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
    console.log("Login error: ", error);
    return res.status(500).json({ message: error.message });
  }
}

export async function getAllUsers(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

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
