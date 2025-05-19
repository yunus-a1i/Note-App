import { Label } from "@radix-ui/react-label";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Link, useNavigate } from "react-router-dom";
import { register } from "@/actions/userActions";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (success) {
      setTimeout(() => navigate("/"), 2000);
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
      const response = await register(null, formData);
      if (response.error) {
        setError(response.error);
      } else {
        setSuccess(response.success);
      }
    } catch (err) {
      setError("Something went wrong!");
    }
    setIsPending(false);
  };

  return (
    <div className="h-screen flex justify-center items-center transform -translate-y-16">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 sm:max-w-xl w-full max-w-sm sm:p-8 border p-4 rounded-sm bg-[#004643]">
        {/* Email Field */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="email" className="text-[#fffffe] font-bold">Email</Label>
          <Input
            type="email"
            id="email"
            name="email"
            placeholder="Enter email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            className='bg-[#e8e4e6] text-[#0f3433]'
          />
        </div>

        {/* Password Field */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="password" className="text-[#fffffe] font-bold">Password</Label>
          <Input
            type="password"
            id="password"
            name="password"
            placeholder="Enter password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            className='bg-[#e8e4e6] text-[#0f3433]'
          />
        </div>

        {error && <p className="text-red-500 text-lg text-center">{error}</p>}
        {success && <p className="text-green-500 text-lg text-center">Registration successful!</p>}

        <Button type="submit" className="bg-[#f9bc60cc] text-[#001e1d] hover:bg-[#f9bc60] transition duration-300 cursor-pointer" disabled={isPending}>
          {isPending ? "Registering" : "Register"}
        </Button>

        <span className="text-[#abd1c6] text-center text-lg">
          Already have an account?&ensp;
          <Link
            to="/"
            className="transition ease-in-out hover:cursor-pointer hover:text-[#fffffe] hover:underline"
          >
            Login
          </Link>
        </span>
      </form>
    </div>
  );
};

export default Register;
