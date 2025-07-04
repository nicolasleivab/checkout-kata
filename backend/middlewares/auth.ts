import { RequestHandler } from "express";
import { ApiError } from "./errorHandler";

// Mock user types for demonstration
export type TMockUser = {
  id: string;
  email: string;
  role: "admin" | "user" | "manager";
  permissions: string[];
};

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: TMockUser;
    }
  }
}

// Mock user database (in real app, this would come from a database)
const MOCK_USERS: Record<string, TMockUser> = {
  "admin-token": {
    id: "1",
    email: "admin@example.com",
    role: "admin",
    permissions: ["read", "write", "delete", "manage_pricing"],
  },
  "user-token": {
    id: "2",
    email: "user@example.com",
    role: "user",
    permissions: ["read"],
  },
  "manager-token": {
    id: "3",
    email: "manager@example.com",
    role: "manager",
    permissions: ["read", "write", "manage_pricing"],
  },
};

// Mock authentication middleware
export const authenticate: RequestHandler = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new ApiError(401, "Authorization header is required");
    }

    const token = authHeader.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Bearer token is required");
    }

    const user = MOCK_USERS[token];

    if (!user) {
      throw new ApiError(401, "Invalid or expired token");
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

// Role-based authorization middleware
export const requireRole = (roles: TMockUser["role"][]) => {
  return (req: any, res: any, next: any) => {
    try {
      if (!req.user) {
        throw new ApiError(401, "Authentication required");
      }

      if (!roles.includes(req.user.role)) {
        throw new ApiError(
          403,
          `Access denied. Required roles: ${roles.join(", ")}`
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

// Permission-based authorization middleware
export const requirePermission = (permission: string) => {
  return (req: any, res: any, next: any) => {
    try {
      if (!req.user) {
        throw new ApiError(401, "Authentication required");
      }

      if (!req.user.permissions.includes(permission)) {
        throw new ApiError(
          403,
          `Access denied. Required permission: ${permission}`
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

// Mock up middleware for authentication
export const optionalAuth: RequestHandler = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return next(); // Continue without authentication
    }

    const token = authHeader.replace("Bearer ", "");
    const user = MOCK_USERS[token];

    if (user) {
      req.user = user;
    }

    next();
  } catch (error) {
    next(error);
  }
};
