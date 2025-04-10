
import { useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "@/components/AuthModal";
import UserStats from "@/components/UserStats";

const LandingPage = () => {
  const { user } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="px-4 py-20 md:py-32 bg-secondary">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              Shorten, Share, and Track Your Links
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mb-10">
              Create custom, memorable short links that make your content more shareable and trackable.
            </p>
            
            <UserStats />
            
            <div className="flex flex-col sm:flex-row gap-4">
              {user ? (
                <Button
                  onClick={() => window.location.href = '/dashboard'}
                  className="text-white bg-black hover:bg-gray-800 rounded-full px-8 py-6 text-lg"
                >
                  Go to Dashboard
                </Button>
              ) : (
                <Button
                  onClick={() => setAuthModalOpen(true)}
                  className="text-white bg-black hover:bg-gray-800 rounded-full px-8 py-6 text-lg"
                >
                  Get Started - It's Free
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Powerful Features for Your Links
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="h-12 w-12 bg-black/10 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.102-1.101" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Customizable Short Links</h3>
              <p className="text-muted-foreground">
                Create memorable, branded short links that reflect your content and are easy to share.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="h-12 w-12 bg-black/10 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Analytics & Tracking</h3>
              <p className="text-muted-foreground">
                Track clicks and analyze performance to optimize your marketing campaigns.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="h-12 w-12 bg-black/10 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Secure & Reliable</h3>
              <p className="text-muted-foreground">
                Enterprise-grade security and high availability ensure your links always work.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 bg-secondary">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Shorten Your First URL?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of users who already trust our platform for their link management needs.
          </p>
          {user ? (
            <Button
              onClick={() => window.location.href = '/dashboard'}
              className="text-white bg-black hover:bg-gray-800 rounded-full px-8 py-6 text-lg"
            >
              Go to Dashboard
            </Button>
          ) : (
            <Button
              onClick={() => setAuthModalOpen(true)}
              className="text-white bg-black hover:bg-gray-800 rounded-full px-8 py-6 text-lg"
            >
              Create Free Account
            </Button>
          )}
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </MainLayout>
  );
};

export default LandingPage;
