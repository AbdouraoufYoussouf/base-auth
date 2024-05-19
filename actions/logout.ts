import { signOut } from "@/auth"

export const handleLogout=async()=>{
    await signOut();
}