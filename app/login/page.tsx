'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import EmailGate from '@/components/EmailGate';
import AfterLoginDashboard from '@/components/AfterLoginDashboard';
import { isGuestAuthAllowed, getStoredEmail } from '@/lib/cookies';

export default function LoginPage() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [storedEmail, setStoredEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user already has guest authentication
    const guestAllowed = isGuestAuthAllowed();
    const email = getStoredEmail();
    
    if (guestAllowed && email) {
      setIsAuthorized(true);
      setStoredEmail(email);
    }
    
    setIsLoading(false);
  }, []);

  const handleGuestProceed = (email: string) => {
    setIsAuthorized(true);
    setStoredEmail(email);
  };

  const handleExistingUserProceed = (email: string) => {
    // For now, treat as same flow. In production, this could
    // check for existing customer data and provide different UX
    setIsAuthorized(true);
    setStoredEmail(email);
  };

  const handleLogout = () => {
    // For now, just clear the local state
    // In production, you might want to clear the cookie too
    setIsAuthorized(false);
    setStoredEmail(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <EmailGate
        onGuestProceed={handleGuestProceed}
        onExistingUserProceed={handleExistingUserProceed}
      />
    );
  }

  // User is authenticated - show dashboard
  return <AfterLoginDashboard />;
}