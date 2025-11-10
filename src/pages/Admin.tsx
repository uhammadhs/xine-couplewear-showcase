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
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">XINE Admin</h1>
              <p className="text-sm text-muted-foreground">
                Dashboard Manajemen
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => navigate("/")}
              >
                Lihat Website
              </Button>
              <Button variant="ghost" onClick={handleLogout}>
                <LogOut className="mr-2" size={18} />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="products">Produk</TabsTrigger>
            <TabsTrigger value="testimonials">Testimonial</TabsTrigger>
            <TabsTrigger value="messages">Pesan</TabsTrigger>
            <TabsTrigger value="settings">Konten Situs</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-4">
            <ProductsManagement />
          </TabsContent>

          <TabsContent value="testimonials" className="space-y-4">
            <TestimonialsManagement />
          </TabsContent>

          <TabsContent value="messages" className="space-y-4">
            <MessagesManagement />
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <SiteSettingsManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
