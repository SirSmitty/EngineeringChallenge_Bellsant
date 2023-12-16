import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import firebase from 'firebase/app';
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

// authenticated firebase session
import authApp from './modal';
// Defined the shape of context
interface AuthContextType {
    isLoading: boolean;
    userToken: string | null;
    signIn: (authParams: any) => Promise<void>; // albe to adjust the params of auth here
    createUser: (authParams: any) => Promise<void>; // albe to adjust the params of auth here
    signOut: () => Promise<void>;
}

// Provide a default value matching the shape
const defaultAuthContextValue: AuthContextType = {
    isLoading: true,
    userToken: null,
    signIn: async () => { },
    createUser: async () => { }, // albe to adjust the params of auth here
    signOut: async () => { },
};

// Create the context with the default value
export const AuthContext = createContext<AuthContextType>(defaultAuthContextValue);

export const AuthProvider = ({ children }) => {
    const [userToken, setUserToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);


    useEffect(() => {
        // Load the token from storage and set the user token if it exists
        async function loadToken() {
            let token = await SecureStore.getItemAsync('userToken');
            if (token) {
                setUserToken(token);
            }
            setIsLoading(false);
        }

        loadToken();
    }, []);

    const createUser = async (authParams) => {
        try {

            const userCredential = await createUserWithEmailAndPassword(authApp, authParams.email, authParams.password)
            if (userCredential.user) {
                console.log("This is the user:", userCredential.user);
                const token = await userCredential.user.getIdToken();
                await SecureStore.setItemAsync('userToken', token);
                setUserToken(token);

            } else {
                console.error("No user object returned from sign-in");
            }
        } catch (error) {
            // Handle sign-in errors
            console.error("Sign-in error:", error.code, error.message);
            // Optionally, update state or inform the user
        }
    }

    const signIn = async (authParams) => {
        try {
            const userCredential = await signInWithEmailAndPassword(authApp, authParams.email, authParams.password);

            if (userCredential.user) {
                console.log("This is the user:", userCredential.user);
                const token = await userCredential.user.getIdToken();
                await SecureStore.setItemAsync('userToken', token);
                setUserToken(token);

            } else {
                console.error("No user object returned from sign-in");
            }
        } catch (error) {
            // Handle sign-in errors
            console.error("Sign-in error:", error.code, error.message);
            // Optionally, update state or inform the user
        }
    };


    const signOut = async () => {
        // Clear the token from secure storage and update state
        authApp.signOut();
        await SecureStore.deleteItemAsync('userToken');
        setUserToken(null);
    };

    return (
        <AuthContext.Provider value={{ isLoading, userToken, signIn, signOut, createUser }}>
            {children}
        </AuthContext.Provider>
    );
};
