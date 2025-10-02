import { Label } from "@radix-ui/react-label";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Link, useNavigate } from "react-router-dom";
import { register } from "@/actions/userActions";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, UserPlus, LogIn } from "lucide-react";

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
    event.preventDefault();
    setIsPending(true);
    setError(null);
    try {
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
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-[#004643] to-[#0c7b6e] p-4">
      <motion.form
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 w-full max-w-md p-8 rounded-3xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-4"
        >
          <div className="w-16 h-16 bg-[#f9bc60] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <UserPlus size={32} className="text-[#001e1d]" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-[#f9bc60] bg-clip-text text-transparent">
            Create Account
          </h1>
          <p className="text-white/60 mt-2">Join us and start organizing your notes</p>
        </motion.div>

        {/* Email Field */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-3"
        >
          <Label htmlFor="email" className="text-white font-semibold text-sm">
            Email
          </Label>
          <Input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            className="h-12 bg-white/20 border border-white/30 text-white placeholder-white/50 rounded-xl focus:ring-2 focus:ring-[#f9bc60] focus:border-transparent transition-all duration-200"
            required
          />
        </motion.div>

        {/* Password Field */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col gap-3"
        >
          <Label htmlFor="password" className="text-white font-semibold text-sm">
            Password
          </Label>
          <Input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            className="h-12 bg-white/20 border border-white/30 text-white placeholder-white/50 rounded-xl focus:ring-2 focus:ring-[#f9bc60] focus:border-transparent transition-all duration-200"
            required
          />
        </motion.div>

        {/* Messages */}
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-red-300 text-center bg-red-500/20 border border-red-500/30 rounded-xl p-3"
            >
              {error}
            </motion.p>
          )}
          {success && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-green-300 text-center bg-green-500/20 border border-green-500/30 rounded-xl p-3"
            >
              {success}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-12 bg-[#f9bc60] text-[#001e1d] font-semibold rounded-xl hover:bg-[#e8ab4f] transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <div className="flex items-center gap-2">
                <Loader2 size={20} className="animate-spin" />
                <span>Creating Account...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <UserPlus size={20} />
                <span>Create Account</span>
              </div>
            )}
          </Button>
        </motion.div>

        {/* Login Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center pt-4 border-t border-white/20"
        >
          <span className="text-white/70">
            Already have an account?{" "}
            <Link
              to="/"
              className="inline-flex items-center gap-1 text-[#f9bc60] font-semibold hover:text-[#e8ab4f] transition-colors duration-200 hover:underline"
            >
              <LogIn size={16} />
              Sign In
            </Link>
          </span>
        </motion.div>
      </motion.form>
    </div>
  );
};

export default Register;