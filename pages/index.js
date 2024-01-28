import React, { useEffect, useState } from 'react';
import Link from "next/link";
import { Button } from "@/components/Button";
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/Card";
import { Label } from "@/components/Label";
import { Input } from "@/components/Input";
import useRequireAuth from '@/hooks/useRequireAuth';
import { useAuth } from '@/context/AuthContext';
import database from "../database/testDatabase";
import { useRouter } from 'next/router';

export default function IndexPage() {
    const isAuthenticated = useRequireAuth();
    const { userEmail } = useAuth();
    const router = useRouter();

    if (!isAuthenticated) {
        return <div>Loading...</div>;
    }

    const handleLogout = () => {
        logout();
    };
    const [selectedWallet, setSelectedWallet] = useState('');
    const [wallets, setWallets] = useState([]);
    const [ethBalance, setEthBalance] = useState('0.000');
    const [erc20Balance, setErc20Balance] = useState('0.000');
    const [amount, setAmount] = useState('');
    const [mintAmount, setMintAmount] = useState('');
    const [receivingAddress, setReceivingAddress] = useState('');
    const [refreshWallets, setRefreshWallets] = useState(false);

    // Fetch wallets from backend
    useEffect(() => {
        const fetchWallets = async () => {
            const response = await fetch(`/api/wallet/getWallets?email=${userEmail}`);
            const data = await response.json();

            setWallets(data.wallets);
            setSelectedWallet(data.wallets[0]);
        };

        fetchWallets();
    }, [userEmail, refreshWallets]);

    // Function to handle creating new wallet
    const handleCreateNewWallet = async () => {
        const response = await fetch('/api/wallet/createWallet', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: userEmail })
        });
        setRefreshWallets(prev => !prev);
    };

    // Function to handle transfer of ERC20 tokens
    const handleTransfer = async () => {
        try {
            const response = await fetch('/api/transfer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: userEmail,
                    amount: amount,
                    walletAddress: selectedWallet,
                    receivingAddress: receivingAddress
                }),
            });

            const data = await response.json();
            if (response.ok) {
                console.log('Transfer successful:', data);
                // Handle successful response
            } else {
                console.error('Transfer failed:', data.error);
                // Handle errors
            }
        } catch (error) {
            console.error('Error transferring tokens:', error);
            // Handle network errors
        }
    };

    const handleMint = async () => {
        try {
            const response = await fetch('/api/mint', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: userEmail, amount: mintAmount, walletAddress: selectedWallet }),
            });

            const data = await response.json();
            if (response.ok) {
                console.log('Minting successful:', data);
                // Handle successful response
            } else {
                console.error('Minting failed:', data.error);
                // Handle errors
            }
        } catch (error) {
            console.error('Error minting tokens:', error);
            // Handle network errors
        }
    };

    const fetchErc20Balance = async () => {
        try {
            const response = await fetch('/api/fetchErc20Balance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: userEmail, walletAddress: selectedWallet }),
            });

            const data = await response.json();
            if (response.ok) {
                setErc20Balance(data.balance);
            } else {
                console.error('Failed to fetch balance:', data.error);
            }
        } catch (error) {
            console.error('Error fetching ERC20 balance:', error);
        }
    };

    useEffect(() => {
        if (userEmail && selectedWallet) {
            fetchErc20Balance();
        }
    }, [userEmail, selectedWallet]);

    const fetchEthBalance = async () => {
        try {
            const response = await fetch('/api/fetchEthBalance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ walletAddress: selectedWallet }),
            });

            const data = await response.json();
            if (response.ok) {
                setEthBalance(data.balance);
            } else {
                console.error('Failed to fetch ETH balance:', data.error);
            }
        } catch (error) {
            console.error('Error fetching ETH balance:', error);
        }
    };

    useEffect(() => {
        if (selectedWallet) {
            fetchEthBalance();
        }
    }, [selectedWallet]);


    return (
        <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
            <header className="flex h-14 items-center border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
                <Link href="#"
                    className="flex items-center gap-2 font-semibold">
                    CryptoApp
                </Link>
                <div className="ml-auto">
                    <Button onClick={handleLogout} size="sm" variant="outline">Logout</Button>
                </div>
            </header>
            <main className="flex-grow p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <h1 className="font-semibold text-lg md:text-xl">Ethereum Wallet</h1>
                    <div>
                        <select
                            value={selectedWallet}
                            onChange={(e) => setSelectedWallet(e.target.value)}
                            className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                        >
                            {wallets.map(wallet => (
                                <option key={wallet} value={wallet}>
                                    {wallet}
                                </option>
                            ))}
                        </select>
                        <Button onClick={handleCreateNewWallet} className="ml-2" size="sm" variant="outline">
                            Create New Wallet
                        </Button>
                    </div>
                </div>
                <div className="flex flex-col md:grid md:grid-cols-6 gap-6 mt-6">
                    <div className="md:col-span-4 lg:col-span-3 xl:col-span-4 flex flex-col gap-6">
                        {/* Ethereum Balance Card */}
                        <Card className="p-4 rounded-md shadow-md">
                            <CardHeader>
                                <CardTitle>Wallet Address</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {/* Balance will be dynamically loaded */}
                                <p className="text-2xl">{selectedWallet}</p>
                            </CardContent>
                        </Card>
                        <Card className="p-4 rounded-md shadow-md">
                            <CardHeader>
                                <CardTitle>Ethereum Balance</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {/* Balance will be dynamically loaded */}
                                <p className="text-2xl">{ethBalance} ETH</p>
                            </CardContent>
                        </Card>

                        {/* ERC20 Token Balance Card */}
                        <Card className="p-4 rounded-md shadow-md">
                            <CardHeader>
                                <CardTitle>ERC20 Token Balance</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {/* Balance will be dynamically loaded */}
                                <p className="text-2xl">{erc20Balance} TOKEN</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="md:col-span-2 xl:col-span-2">
                        <Card className="p-4 rounded-md shadow-md">
                            <CardHeader>
                                <CardTitle>Transfer ERC20 Token</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <Label htmlFor="to-address">To Address</Label>
                                    <Input id="to-address" value={receivingAddress} onChange={(e) => setReceivingAddress(e.target.value)} />

                                    <Label htmlFor="amount">Amount</Label>
                                    <Input id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full" onClick={handleTransfer}>Transfer Token</Button>
                            </CardFooter>
                        </Card>
                    </div>

                    <div className="md:col-span-2 xl:col-span-2">
                        <Card className="p-4 rounded-md shadow-md">
                            <CardHeader>
                                <CardTitle>Mint ERC20 Token</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <Label htmlFor="amount">Amount</Label>
                                    <Input id="amount" value={mintAmount} onChange={(e) => setMintAmount(e.target.value)} />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full" onClick={handleMint}>Mint Token</Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>

            </main>
            <footer className="flex items-center justify-center py-4 bg-white dark:bg-gray-900 shadow">
                <p className="text-sm text-gray-500 dark:text-gray-400">© 2024 CryptoApp. All rights reserved.</p>
            </footer>
        </div>
    );
}
