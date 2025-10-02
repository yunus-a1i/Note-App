import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, User as UserIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Profile = () => {
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      const response = await fetch("https://note-app-ffeu.onrender.com/api/user/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Logout failed. Please try again.");
      }

      toast.success("Logged out successfully");
      navigate("/", { replace: true });
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-10 h-10 rounded-full bg-white/20 border border-white/30 flex items-center justify-center hover:bg-white/30 transition-all duration-200 backdrop-blur-sm"
        >
          <UserIcon size={20} className="text-white" />
        </motion.button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="border border-white/20 bg-white/10 backdrop-blur-lg rounded-2xl p-2 min-w-[140px] shadow-2xl"
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <DropdownMenuItem className="flex items-center gap-2 px-3 py-2 text-white rounded-xl cursor-pointer hover:bg-white/20 focus:bg-white/20 transition-all duration-200 mb-1">
            <User size={16} className="text-white/70" />
            <span className="font-medium">Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 text-white rounded-xl cursor-pointer hover:bg-red-500/20 focus:bg-red-500/20 transition-all duration-200"
          >
            <LogOut size={16} className="text-red-300" />
            <span className="font-medium">Logout</span>
          </DropdownMenuItem>
        </motion.div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Profile;