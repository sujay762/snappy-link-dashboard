
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowRight, Link as LinkIcon, BarChart, Shield, Clock } from "lucide-react";

const LandingPage = () => {
  const { user } = useAuth();

  return (
    <MainLayout>
      {/* Hero section */}
      <section className="bg-gradient-to-b from-white to-secondary py-16 md:py-24">
        <div className="container px-4 md:px-6 flex flex-col items-center text-center">
          <div className="flex items-center justify-center p-2 bg-secondary rounded-full mb-4">
            <LinkIcon className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            Short Links, <span className="text-primary">Big Impact</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-[700px] mb-8">
            Create memorable, branded links with our easy-to-use URL shortener.
            Track clicks, manage links, and boost your online presence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
            {user ? (
              <Button asChild className="w-full" size="lg">
                <Link to="/dashboard">Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="outline" className="w-full" size="lg">
                  <Link to="/login">Log In</Link>
                </Button>
                <Button asChild className="w-full" size="lg">
                  <Link to="/register">Get Started <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Powerful URL Shortening Features</h2>
            <p className="text-muted-foreground max-w-[700px] mx-auto">
              Everything you need to create, manage and track your shortened URLs in one place.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm border">
              <div className="p-3 rounded-full bg-secondary mb-4">
                <LinkIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Custom Short Links</h3>
              <p className="text-muted-foreground">
                Create memorable URLs with custom domains and personalized back-halves.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm border">
              <div className="p-3 rounded-full bg-secondary mb-4">
                <BarChart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Click Analytics</h3>
              <p className="text-muted-foreground">
                Track performance with detailed click analytics for each shortened URL.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm border">
              <div className="p-3 rounded-full bg-secondary mb-4">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Expiration Dates</h3>
              <p className="text-muted-foreground">
                Set expiration dates for temporary links that automatically deactivate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="bg-primary py-16">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Shorten Your URLs?
          </h2>
          <p className="text-primary-foreground/90 max-w-[700px] mx-auto mb-8">
            Join thousands of users who trust Snappy.Link for their URL shortening needs.
          </p>
          {!user && (
            <Button asChild size="lg" variant="secondary">
              <Link to="/register">Create Your Free Account</Link>
            </Button>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default LandingPage;
