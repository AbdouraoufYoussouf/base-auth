import { UserRole } from "@prisma/client";
import { DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
    id:string;
    name:string;
    email:string;
    image:string;
    role:UserRole;
    isTwoFactorEnabled:boolean
    isOAuth:boolean
};

declare module "next-auth" {
    interface Session {
        user: ExtendedUser;
        }
}