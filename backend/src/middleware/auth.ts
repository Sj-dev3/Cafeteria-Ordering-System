import { NextFunction, Request, Response } from "express";
import { auth } from "express-oauth2-jwt-bearer";
import jwt from "jsonwebtoken";
import User from "../user";

declare global {
  namespace Express {
    interface Request {
      userid: string;
      auth0Id: string;
    }
  }
}

export const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_DOMAIN,
  tokenSigningAlg: "RS256",
});

export const jwtParse = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized" });
    return; // Ensure the function does not continue
  }

  const token = authorization.split(" ")[1];

  try {
    const decoded = jwt.decode(token) as jwt.JwtPayload;

    const auth0Id = decoded.sub;

    const user = await User.findOne({ auth0Id });
    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return; // Ensure the function does not continue
    }

    req.userid = user._id.toString();
    req.auth0Id = auth0Id as string;

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Error parsing JWT:", error);
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};
