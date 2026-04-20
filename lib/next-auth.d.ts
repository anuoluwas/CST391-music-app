import "next-auth";
import "next-auth/jwt"

declare module "next-auth" {
    interface Session {
        user: {
            name?: string | null;
            email?: string | null;
            image?: string | null;
            role?: "admin" | "user";
            id?: number;
        };
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        email?: string | null;
        role?: "admin" | "user";
        id?: number;
    }
}