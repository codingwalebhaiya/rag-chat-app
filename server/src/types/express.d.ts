import { IUser } from "@/types/user.types.js"

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export { };
