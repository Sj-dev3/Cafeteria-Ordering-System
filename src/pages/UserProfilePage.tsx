import { useGetMyUser, useUpdateMyUser } from "@/api/MyUserApi";
import UserProfileForm from "@/forms/user-profile-form/UserProfileForm";

export default function UserProfilePage() {
    const { currentUser, isLoading: isGetLoading } = useGetMyUser();
    const { updateUser, isLoading: isUpdateLoading } = useUpdateMyUser();

    if (isGetLoading) {
        return <span>Loading...</span>;
    }

    if (!currentUser) {
        return <span>User not found</span>;
    }
    return <UserProfileForm 
        currentUser={currentUser} 
        onSave={(userProfileData) => updateUser({
            ...userProfileData,
            addressLine1: userProfileData.addressLine1 || "",
            city: userProfileData.city || "",
            country: userProfileData.country || ""
        })} 
        isLoading={isUpdateLoading}
    />
}
