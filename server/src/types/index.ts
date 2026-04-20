type AppRole = "student" | "lecturer" | "admin";

declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string;
        email: string | null;
        fullName: string | null;
        role: AppRole;
        isPro: boolean;
        accessToken?: string;
      };
    }
  }
}

export {};
