
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Copy, Trash, Edit, MoreVertical, BarChart, ExternalLink } from "lucide-react";
import {
  createShortUrl,
  getUserUrls,
  updateUrl,
  deleteUrl,
  UrlData,
} from "@/services/urlService";
import { 
  isValidUrl, 
  formatUrlForDisplay, 
  formatDate, 
  getFullShortUrl,
  commonDomainExtensions 
} from "@/utils/url-utils";

const DashboardPage = () => {
  const { user } = useAuth();
  const [urls, setUrls] = useState<UrlData[]>([]);
  const [loading, setLoading] = useState(true);
  const [longUrl, setLongUrl] = useState("");
  const [shortCode, setShortCode] = useState("");
  const [customDomain, setCustomDomain] = useState("");
  const [editUrl, setEditUrl] = useState<UrlData | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch user's URLs
  const fetchUrls = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const userUrls = await getUserUrls(user.id);
      setUrls(userUrls);
    } catch (error) {
      console.error("Error fetching URLs:", error);
      toast.error("Failed to load your shortened URLs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, [user]);

  // Handle URL shortening
  const handleCreateShortUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!longUrl) {
      toast.error("Please enter a URL to shorten");
      return;
    }
    
    if (!isValidUrl(longUrl)) {
      toast.error("Please enter a valid URL including http:// or https://");
      return;
    }
    
    try {
      setIsSubmitting(true);
      if (!user) {
        toast.error("You must be logged in to create short URLs");
        return;
      }
      
      const newUrl = await createShortUrl(
        user.id,
        longUrl,
        shortCode || undefined
      );
      
      toast.success("URL shortened successfully!");
      setUrls([newUrl, ...urls]);
      
      // Reset form
      setLongUrl("");
      setShortCode("");
    } catch (error: any) {
      toast.error(error.message || "Failed to shorten URL");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle URL deletion
  const handleDeleteUrl = async (id: string) => {
    try {
      await deleteUrl(id);
      setUrls(urls.filter(url => url.id !== id));
      toast.success("URL deleted successfully");
    } catch (error) {
      toast.error("Failed to delete URL");
    }
  };

  // Handle URL update
  const handleUpdateUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editUrl) return;
    
    if (!isValidUrl(editUrl.original_url)) {
      toast.error("Please enter a valid URL");
      return;
    }
    
    try {
      setIsSubmitting(true);
      const updatedUrl = await updateUrl(editUrl.id, {
        original_url: editUrl.original_url,
        short_code: editUrl.short_code,
        title: editUrl.title,
      });
      
      if (updatedUrl) {
        setUrls(urls.map(url => url.id === updatedUrl.id ? updatedUrl : url));
        toast.success("URL updated successfully");
        setEditDialogOpen(false);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update URL");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle URL copy
  const copyToClipboard = (url: UrlData) => {
    const fullShortUrl = getFullShortUrl(url.short_code, customDomain);
    navigator.clipboard.writeText(fullShortUrl);
    toast.success("URL copied to clipboard");
  };

  return (
    <MainLayout>
      <div className="container px-4 py-8 md:px-6 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Shorten, share and track your links
          </p>
        </div>

        {/* URL shortening form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Create Short URL</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateShortUrl} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-12">
                <div className="md:col-span-6">
                  <Input
                    placeholder="Enter long URL (https://...)"
                    value={longUrl}
                    onChange={(e) => setLongUrl(e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <Input
                    placeholder="Custom path (optional)"
                    value={shortCode}
                    onChange={(e) => setShortCode(e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <Select onValueChange={setCustomDomain} defaultValue="">
                    <SelectTrigger>
                      <SelectValue placeholder="Domain" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {commonDomainExtensions.map((domain) => (
                          <SelectItem key={domain.value} value={domain.value}>
                            {domain.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Button className="w-full bg-black hover:bg-gray-800" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Shorten"}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* URLs table */}
        <Card>
          <CardHeader>
            <CardTitle>Your URLs</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
              </div>
            ) : urls.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  You haven't created any short URLs yet
                </p>
                <Button variant="outline" onClick={() => window.scrollTo(0, 0)}>
                  Create Your First Short URL
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Short URL</TableHead>
                      <TableHead className="hidden md:table-cell">Original URL</TableHead>
                      <TableHead className="hidden md:table-cell">Created</TableHead>
                      <TableHead>Clicks</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {urls.map((url) => {
                      const fullShortUrl = getFullShortUrl(url.short_code, customDomain);
                      const domain = customDomain ? customDomain : window.location.host;
                      
                      return (
                        <TableRow key={url.id}>
                          <TableCell className="font-medium">
                            <a
                              href={fullShortUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-black hover:underline"
                            >
                              {domain}/r/{url.short_code}
                              <ExternalLink className="ml-1 h-3 w-3" />
                            </a>
                          </TableCell>
                          <TableCell className="hidden md:table-cell max-w-[200px] truncate">
                            {formatUrlForDisplay(url.original_url)}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {formatDate(url.created_at)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <BarChart className="mr-2 h-4 w-4 text-muted-foreground" />
                              {url.clicks}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => copyToClipboard(url)}>
                                  <Copy className="mr-2 h-4 w-4" />
                                  Copy
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setEditUrl(url);
                                    setEditDialogOpen(true);
                                  }}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => handleDeleteUrl(url.id)}
                                >
                                  <Trash className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit URL Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit URL</DialogTitle>
            </DialogHeader>
            {editUrl && (
              <form onSubmit={handleUpdateUrl} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Original URL</label>
                  <Input
                    value={editUrl.original_url}
                    onChange={(e) =>
                      setEditUrl({ ...editUrl, original_url: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Short Code</label>
                  <Input
                    value={editUrl.short_code}
                    onChange={(e) =>
                      setEditUrl({ ...editUrl, short_code: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title (Optional)</label>
                  <Input
                    value={editUrl.title || ''}
                    onChange={(e) =>
                      setEditUrl({ ...editUrl, title: e.target.value || null })
                    }
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-black hover:bg-gray-800" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default DashboardPage;
