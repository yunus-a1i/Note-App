import { DropdownMenu, DropdownMenuContent,DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { CircleUserRound } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const navigate = useNavigate();
    async function handleLogout() {
        try {
            const response = await fetch('https://note-app-wd85.onrender.com/user/logout', {
                method: 'POST',
                credentials: 'include',
            });
            if(!response.ok){
                throw new Error('Logout failed. Please try again.');
            }
            navigate('/login')
        } catch (error) {
            toast.error(error.message)    
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <CircleUserRound className="transition ease-in hover:cursor-pointer hover:stroke-blue-500" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="cursor-pointer mr-4">
                <DropdownMenuItem className="hover:bg-gray-100 px-4 py-2 rounded-md">Profile</DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="hover:bg-gray-100 px-4 py-2 rounded-md">Logout</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default Profile;