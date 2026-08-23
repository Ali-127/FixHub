import { NextFunction, Request, Response } from "express";
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
