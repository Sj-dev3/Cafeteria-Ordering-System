import { useCreateMyUser } from "@/api/MyUserApi";
import { Auth0Provider, AppState, User } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

type props = {
    children: React.ReactNode;
}

const Auth0ProviderWithNavigate = ({ children }: props) => {
    const navigate = useNavigate()
    const domain = import.meta.env.VITE_AUTH0_DOMAIN;
    const clientID = import.meta.env.VITE_AUTH0_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_AUTH0_CALLBACK_URL;

    if (!domain || !clientID || !redirectUri) {
        throw new Error("Unable to initialize auth")
    }

    const onRedirectCallback = (_appState?: AppState, user?:User)=> {
        navigate("/auth-callback")
    }

    return (
        <Auth0Provider domain ={domain} clientId = {clientID} authorizationParams = {{redirect_uri: redirectUri,}}
        onRedirectCallback={onRedirectCallback}
        >
            {children}
        </Auth0Provider>
    )
}


export default Auth0ProviderWithNavigate
