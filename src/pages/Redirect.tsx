
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUrlByShortCode, incrementUrlClicks } from "@/services/urlService";
import { Link as LinkIcon } from "lucide-react";

const RedirectPage = () => {
  const { shortCode } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [destination, setDestination] = useState<string | null>(null);

  useEffect(() => {
    const redirectToOriginalUrl = async () => {
      if (!shortCode) {
        setError("Invalid short URL");
        return;
      }

      try {
        const urlData = await getUrlByShortCode(shortCode);
        
        if (!urlData) {
          setError("This short URL does not exist");
          return;
        }

        // Check if URL has expired
        if (urlData.expiresAt && new Date(urlData.expiresAt) < new Date()) {
          setError("This short URL has expired");
          return;
        }

        // Increment the click count
        await incrementUrlClicks(urlData.id);
        
        // Show the destination before redirecting
        setDestination(urlData.originalUrl);
        
        // Redirect after a short delay
        setTimeout(() => {
          window.location.href = urlData.originalUrl;
        }, 1500);
      } catch (error) {
        console.error("Error redirecting:", error);
        setError("Something went wrong while redirecting you");
      }
    };

    redirectToOriginalUrl();
  }, [shortCode, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-secondary p-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <LinkIcon className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Snappy.Link</h1>
        </div>

        {error ? (
          <>
            <div className="text-destructive mb-6">{error}</div>
            <p className="mb-6">
              This link may have been removed or may have never existed.
            </p>
            <a 
              href="/"
              className="text-primary hover:underline"
            >
              Go to homepage
            </a>
          </>
        ) : destination ? (
          <>
            <div className="animate-pulse mb-6">
              <div className="h-2 bg-primary rounded mb-4"></div>
              <div className="h-2 bg-primary rounded w-3/4 mx-auto"></div>
            </div>
            <p className="mb-2">Redirecting you to:</p>
            <p className="text-muted-foreground mb-6 break-all">
              {destination}
            </p>
          </>
        ) : (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mb-4"></div>
            <p>Loading...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RedirectPage;
