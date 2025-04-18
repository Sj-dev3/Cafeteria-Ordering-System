import { useGetMyUser, useUpdateMyUser } from "@/api/MyUserApi";
import UserProfileForm from "@/forms/user-profile-form/UserProfileForm";

export default function UserProfilePage() {
    const { currentUser, isPending: isGetLoading } = useGetMyUser();
    const { updateUser, isPending: isUpdateLoading } = useUpdateMyUser();

    if (isGetLoading) {
        return <span>Loading...</span>;
    }

    if (!currentUser) {
        return <span>User not found</span>;
    }
    return <UserProfileForm currentUser = {currentUser} onSave={updateUser} isLoading={isUpdateLoading}/>
}
