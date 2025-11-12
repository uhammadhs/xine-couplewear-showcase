import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { LogOut } from "lucide-react";
import ProductsManagement from "@/components/admin/ProductsManagement";
import TestimonialsManagement from "@/components/admin/TestimonialsManagement";
import MessagesManagement from "@/components/admin/MessagesManagement";
import SiteSettingsManagement from "@/components/admin/SiteSettingsManagement";
import CouplesManagement from "@/components/admin/CouplesManagement";

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("products");

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Gagal logout");
    } else {
      toast.success("Logout berhasil");
      navigate("/auth");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur-lg border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-primary">XINE Admin</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Dashboard Manajemen
              </p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/")}
                className="flex-1 sm:flex-none"
              >
                <span className="hidden sm:inline">Lihat Website</span>
                <span className="sm:hidden">Website</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="flex-1 sm:flex-none">
                <LogOut className="mr-0 sm:mr-2" size={18} />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 mb-6 sm:mb-8 h-auto gap-2 bg-muted/50 p-1">
            <TabsTrigger value="products" className="text-xs sm:text-sm py-2 data-[state=active]:bg-background data-[state=active]:shadow-md">
              Produk
            </TabsTrigger>
            <TabsTrigger value="couples" className="text-xs sm:text-sm py-2 data-[state=active]:bg-background data-[state=active]:shadow-md">
              Couple
            </TabsTrigger>
            <TabsTrigger value="testimonials" className="text-xs sm:text-sm py-2 data-[state=active]:bg-background data-[state=active]:shadow-md">
              Testimonial
            </TabsTrigger>
            <TabsTrigger value="messages" className="text-xs sm:text-sm py-2 data-[state=active]:bg-background data-[state=active]:shadow-md">
              Pesan
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-xs sm:text-sm py-2 data-[state=active]:bg-background data-[state=active]:shadow-md">
              Konten
            </TabsTrigger>
          </TabsList>

          <div className="bg-background/50 backdrop-blur-sm rounded-lg border border-border shadow-lg p-4 sm:p-6">
            <TabsContent value="products" className="space-y-4 mt-0">
              <ProductsManagement />
            </TabsContent>

            <TabsContent value="couples" className="space-y-4 mt-0">
              <CouplesManagement />
            </TabsContent>

            <TabsContent value="testimonials" className="space-y-4 mt-0">
              <TestimonialsManagement />
            </TabsContent>

            <TabsContent value="messages" className="space-y-4 mt-0">
              <MessagesManagement />
            </TabsContent>

            <TabsContent value="settings" className="space-y-4 mt-0">
              <SiteSettingsManagement />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
