// pages/signin.js
import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { useRouter } from 'next/router';
import { Label } from "@/components/Label";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { useAuth } from '@/context/AuthContext';
import { Package2Icon } from "@/components/Icons";

export default function SignIn() {
    const { setIsAuthenticated, setUserEmail } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showError, setShowError] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (error) {
            setShowError(true);
            const timer = setTimeout(() => setShowError(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        try {
            const response = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ email, password }),
            });

            if (response.status === 200) {
                setIsAuthenticated(true);
                setUserEmail(email); // Set the user's email in the context
                router.push('/');
            }  else {
                const data = await response.json();
                setError(data.error || 'An error occurred');
            }
        } catch (error) {
            setError('Failed to connect to the server');
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-800">
            <header className="flex h-14 items-center border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
                <Link href="#"
                    className="flex items-center gap-2 font-semibold">
                        <Package2Icon className="h-6 w-6" />
                        CryptoApp
                    
                </Link>
                </header>
            <main className="flex-grow flex flex-col items-center justify-center py-12">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold">Sign In</h1>
                        <p className="text-gray-400">
                            Don't have an account? 
                            <Link href="/signup" className="underline"> Sign Up</Link>
                        </p>
                    </div>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                required
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <Button className="w-full" type="submit">
                            Sign In
                        </Button>
                        <div className="h-6">
                            {showError && <p className="text-red-500 text-center">{error}</p>}
                        </div>
                    </form>
                </div>
            </main>
            <footer className="py-4 bg-gray-900 shadow">
                <p className="text-center text-sm text-gray-400">
                    © 2024 CryptoApp. All rights reserved.
                </p>
            </footer>
        </div>
    );
}
