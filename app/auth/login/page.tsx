import { LoginForm } from "@/components/auth/login-form";

const LoginPage = () => {
    return ( 
        <div className="flex h-screen items-center justify-center bg-gradient-to-l from-sky-500 to-blue-800">
            <LoginForm />
        </div>
     );
}
 
export default LoginPage;