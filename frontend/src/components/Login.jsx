import { Label } from "@radix-ui/react-dropdown-menu";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Link } from "react-router-dom";

const Login = () => {
    

  return (
    <div className="h-screen flex justify-center items-center transform -translate-y-16">
      <form action="" className="flex flex-col gap-6 max-w-xl w-full px-8">
        <div className="flex flex-col gap-2">
          <Label>Email</Label>
          <Input 
          type="email" 
          name="email" 
          placeholder="Enter email"  
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Password</Label>
          <Input 
          type="password" 
          name="password" 
          placeholder="Enter password" 
          />
        </div>
        <Button className="bg-violet-500">Login</Button>
        <span className="text-[#63657b] text-center text-lg">
          Don't have an account ?&ensp;
          <Link
            to="/register"
            className="transition ease-in-out hover:cursor-pointer hover:text-blue-500 hover:underline"
          >
            Register
          </Link>
        </span>
      </form>
    </div>
  );
};

export default Login;
