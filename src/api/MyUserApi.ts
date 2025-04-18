import { User } from "@/types";
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, UseMutationResult, useQuery } from "@tanstack/react-query"; // Keep UseMutationResult if you prefer explicit types
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useGetMyUser = () => { 
    const { getAccessTokenSilently } = useAuth0();
    const getMyUserRequest = async (): Promise<User> => {
        const accessToken = await getAccessTokenSilently();
        const response = await fetch(`${API_BASE_URL}/api/my/user`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            throw new Error("Failed to fetch user");
        }

        return response.json();
    }    
    const {
        data: currentUser,
        isLoading: isPending,
        error,
    } = useQuery({
        queryKey: ["fetchCurrentUser"], // Unique key for this query
        queryFn: getMyUserRequest, // Function to fetch the data
    });
    if (error) {
        toast.error(error.toString());
    }
    
    return {
        currentUser,
        isPending,
    };
}



// Type for the user data part of the request
type CreateUserRequestData = {
    auth0Id: string;
    email: string;
};

// --- Define the actual API call function ---
// It now needs to receive the token as an argument
type ApiRequestInput = {
    user: CreateUserRequestData;
    accessToken: string;
};

const createMyUserRequest = async (requestInput: ApiRequestInput): Promise<void> => {
    const { user, accessToken } = requestInput;

    console.log("API_BASE_URL used in fetch:", API_BASE_URL); // Good for debugging

    const response = await fetch(`${API_BASE_URL}/api/my/user`, {
        method: "POST",
        headers: {
            // Use the passed accessToken here
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user), // Send only the user data in the body
    });

    if (!response.ok) {
        throw new Error("Failed to create user");
    }
};


// --- Custom Hook ---
type UseCreateMyUserHook = {
    // This function now only needs the user data, token is handled internally
    createUser: (user: CreateUserRequestData) => Promise<void>;
    isPending: boolean; // Matches your usage, isLoading is also common
    isError: boolean;
    isSuccess: boolean;
};

export const useCreateMyUser = (): UseCreateMyUserHook => {
    // Get the Auth0 function within the hook's scope
    const { getAccessTokenSilently } = useAuth0();

    // Define the mutation using the updated API function
    const {
        mutateAsync, // Rename to avoid confusion with the wrapper function we expose
        isPending,
        isError,
        isSuccess,
     // Provide explicit types to useMutation for clarity
    }: UseMutationResult<void, Error, ApiRequestInput> = useMutation({ // Expects ApiRequestInput
        mutationFn: createMyUserRequest,
    });

    // --- Create a wrapper function ---
    // This is the function components will actually call.
    // It gets the token, then calls the original mutateAsync with the combined data.
    const createUserWrapper = async (user: CreateUserRequestData) => {
        try {
            const accessToken = await getAccessTokenSilently();
            // Call the original mutateAsync, passing user data AND token
            await mutateAsync({
                user,
                accessToken,
            });
        } catch (error) {
            // Handle errors from getAccessTokenSilently or mutateAsync if needed
            console.error("Error during user creation process:", error);
            // Re-throw the error so the component calling createUser can handle it if necessary
            throw error;
        }
    };

    // Return the wrapper function as 'createUser'
    return {
        createUser: createUserWrapper, // Expose the wrapper
        isPending,
        isError,
        isSuccess,
    };
};

type UpdateUserRequest = {
    name: string;
    addressLine1: string;
    city: string;
    country: string;
};

export const useUpdateMyUser = () => {
    const { getAccessTokenSilently } = useAuth0();
    const updateMyUserRequest = async (formdata: UpdateUserRequest) => {
        const accessToken = await getAccessTokenSilently();
        const response = await fetch(`${API_BASE_URL}/api/my/user`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formdata),
        });
        if (!response.ok) {
            throw new Error("Failed to update user");
        }

        return response.json();
    }    
    const {
        mutateAsync: updateUser,
        isPending,
        isSuccess,
        error,
        reset,
    }: UseMutationResult<void, Error, UpdateUserRequest> = useMutation({
        mutationFn: updateMyUserRequest,
    });

    if(isSuccess) {
        toast.success("User updated successfully");
    }
    if(error) {
        toast.error(error.toString());
        reset();
    }   

    return {
        updateUser,
        isPending
    };
}

