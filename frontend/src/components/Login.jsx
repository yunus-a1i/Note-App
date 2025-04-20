import { Label } from "@radix-ui/react-label";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Link, useNavigate } from "react-router-dom";
import { login } from "@/actions/userActions";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (success) {
      setTimeout(() => navigate("/todos"), 2000);
    }
  }, [success, navigate]);

  const handleChange = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent native form submission
    setIsPending(true);
    setError(null);
    try {
      // Here register expects formData to be a plain object
      const response = await login(null, formData);
      if (response.error) {
        setError(response.error);``
      } else {
        setSuccess(response.success);
      }
    } catch (err) {
      setError("Something went wrong!",err);
    }
    setIsPending(false);
  };

  return (
    <div className="h-screen flex justify-center items-center transform -translate-y-16">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-xl w-full px-8">
        {/* Email Field */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            name="email"
            placeholder="Enter email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        {/* Password Field */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            id="password"
            name="password"
            placeholder="Enter password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        {error && <p className="text-red-500 text-lg text-center">{error}</p>}

        <Button type="submit" className="bg-violet-500" disabled={isPending}>
          {isPending ? "Logging in" : "Login"}
        </Button>

        <span className="text-[#63657b] text-center text-lg">
          Don't have an account?&ensp;
          <Link
            to="/Register"
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
