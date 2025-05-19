import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"; // Correct import for ShadCN
  import { User } from "lucide-react";
  import toast from "react-hot-toast";
  import { useNavigate } from "react-router-dom";
  
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
        navigate("/", { replace: true }); // Ensures proper redirection
      } catch (error) {
        toast.error(error.message);
      }
    }
  
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild className='bg-[#abd1c6] p-1 rounded-b-full'>
          <User className="text-[#0f3433] cursor-pointer" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className=" border-none mr-2 bg-[#abd1c6] text-[#0f3433] font-bold">
          <DropdownMenuItem className="hover:text-[#0f3433dd] px-4 py-2 cursor-pointer">
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleLogout}
            className="hover:text-[#0f3433dd] px-4 py-2 cursor-pointer"
          >
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };
  
  export default Profile;
  