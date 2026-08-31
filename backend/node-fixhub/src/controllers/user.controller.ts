import { NextFunction, Request, Response } from "express";
import { ApiError, ApiResponse } from "../lib/errors";

export function dashboard(req: Request, res: Response, next: NextFunction) {
  try {
    const response: ApiResponse<{ message: string; userId: string }> = {
      status: "ok",
      data: {
        message: "You can access this route becuase you are logged in!",
        userId: req.userId || "",
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.log("Dashboard error: ", error);
    const response: ApiError = {
      status: "error",
      message: "Internal server error",
    };
    res.status(500).json(response);
  }
}
