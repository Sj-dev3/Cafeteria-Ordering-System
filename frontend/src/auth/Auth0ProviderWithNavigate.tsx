import { Auth0Provider, AppState } from "@auth0/auth0-react"; // Removed unused User import
import { useNavigate } from "react-router-dom";

type props = {
    children: React.ReactNode;
}

const Auth0ProviderWithNavigate = ({ children }: props) => {
    const navigate = useNavigate()
    const domain = import.meta.env.VITE_AUTH0_DOMAIN;
    const clientID = import.meta.env.VITE_AUTH0_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_AUTH0_CALLBACK_URL;
    const audience = import.meta.env.VITE_AUTH0_AUDIENCE; // You are reading this

    // Add audience to the check
    if (!domain || !clientID || !redirectUri || !audience) {
        throw new Error("Unable to initialize auth: Missing environment variables")
    }

    // The AppState type can be used if you pass state during loginWithRedirect
    const onRedirectCallback = (appState?: AppState)=> {
        console.log("Auth0 Redirect Callback triggered. AppState:", appState);
        // Navigate to the dedicated callback route where user creation/sync logic resides
        navigate("/auth-callback")
    }

    return (
        <Auth0Provider
            domain ={domain}
            clientId = {clientID}
            authorizationParams = {{
                redirect_uri: redirectUri,
                audience: audience, // Pass the audience here
            }}
            onRedirectCallback={onRedirectCallback}
            // Consider adding cacheLocation="localstorage" for better persistence
            // cacheLocation="localstorage"
        >
            {children}
        </Auth0Provider>
    )
}


export default Auth0ProviderWithNavigate