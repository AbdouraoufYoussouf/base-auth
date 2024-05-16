import { LoginButton } from "@/components/auth/LoginButton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google"; import { GrSecure } from "react-icons/gr";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"]
})

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center 
    bg-gradient-to-r from-sky-400 to-blue-800">
      <div className="space-y-6 text-center ">
        <h1 className={cn("flex items-center justify-center text-6xl font-semibold text-white drop-shadow-md ", font.className)}>
          <GrSecure />
          Auth</h1>
        <p className="text-lg text-white">A simple authentification service</p>
        <div>
          <LoginButton>
            <Button variant={'secondary'} size={'lg'} >
              Sign In
            </Button>
          </LoginButton>
        </div>
      </div>
    </main>
  );
}
