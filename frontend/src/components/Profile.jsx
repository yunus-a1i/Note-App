import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"; // Correct import for ShadCN
  import { CircleUserRound } from "lucide-react";
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
        navigate("/login", { replace: true }); // Ensures proper redirection
      } catch (error) {
        toast.error(error.message);
      }
    }
  
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <CircleUserRound className="transition ease-in cursor-pointer hover:stroke-blue-500" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="cursor-pointer mr-2">
          <DropdownMenuItem className="hover:bg-gray-100 px-4 py-2 rounded-md">
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleLogout}
            className="hover:bg-gray-100 px-4 py-2 rounded-md"
          >
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };
  
  export default Profile;
  