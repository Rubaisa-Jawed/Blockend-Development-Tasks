import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';

const useRequireAuth = () => {
    const router = useRouter();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (!isAuthenticated) {
            // Redirect to sign-in page
            router.push('/signin');
        }
    }, [isAuthenticated, router]);

    return isAuthenticated;
};

export default useRequireAuth;
