import { NextFunction, Request, Response } from "express";
import jwt, { SignOptions } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma";
import { formatZodErrors, ApiResponse, ApiError } from "../lib/errors";
import { loginSchema, signupSchema } from "../lib/validation";


export async function signup(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const validationResult = signupSchema.safeParse(req.body);

    if (!validationResult.success) {
      const errors = formatZodErrors(validationResult.error);
      const response: ApiError = {
        status: "error",
        message: "Validation failed",
        errors,
      };

      res.status(400).json(response);
      return;
    }

    const { name, email, password } = validationResult.data;

    // Check if user exists
    const existing_user = await prisma.user.findUnique({
      where: { email },
    });

    if (existing_user) {
      const response: ApiError = {
        status: "error",
        message: "User with this email already exists",
        errors: {
          email: ["Email is already in use"],
        },
      };

      res.status(400).json(response);
      return;
    }

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

    res.status(201).json({
      status: "ok",
      data: newUser,
    });
    return;
  } catch (error) {
    console.error("Signup error: ", error);
    const response: ApiError = {
      status: "error",
      message: "Internal error",
    };

    res.status(500).json(response);
    return;
  }
}

export async function login(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const validationResult = loginSchema.safeParse(req.body);

    if (!validationResult.success) {
      const errors = formatZodErrors(validationResult.error);
      const response: ApiError = {
        status: "error",
        message: "Validation failed",
        errors,
      };

      res.status(400).json(response);
      return;
    }

    const { email, password } = validationResult.data;

    // check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      const response: ApiError = {
        status: "error",
        message: "Invalid credentials",
        errors: {
          email: ["User not found"],
        },
      };

      res.status(401).json(response);
      return;
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      const response: ApiError = {
        status: "error",
        message: "Invalid credentials",
        errors: {
          password: ["Password is incorrect"],
        },
      };
      res.status(401).json(response);
      return;
    }

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

    // add tokens to cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: true, // protect csrf attack
      maxAge: 15 * 60 * 1000 // 15 min -----FIX THIS AND USE ENV VARIABLE INSTEAD
    })

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: true, // protect csrf attack
      maxAge: 7 * 24 * 15 * 60 * 1000 // 7 days
    })

    const { passwordHash: _, ...userWithoutPassword } = user;

    res.status(200).json({
      status: "ok",
      data: {
        user: userWithoutPassword,
        accessToken,
        refreshToken,
      },
    });
    return;
  } catch (error: any) {
    console.log("Login error: ", error);
    const response: ApiError = {
      status: "error",
      message: "Internal server error",
    };

    res.status(500).json(response);
    return;
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
