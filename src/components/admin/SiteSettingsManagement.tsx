import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Loader2, Save } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

type SiteSetting = {
  id: string;
  section: string;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  description_2: string | null;
  description_3: string | null;
  image_url: string | null;
  button_text: string | null;
  button_link: string | null;
  extra_data: any;
  is_active: boolean;
};

const SiteSettingsManagement = () => {
  const [settings, setSettings] = useState<Record<string, SiteSetting>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .order("section");

      if (error) throw error;

      const settingsMap = (data || []).reduce((acc, setting) => {
        acc[setting.section] = setting;
        return acc;
      }, {} as Record<string, SiteSetting>);

      setSettings(settingsMap);
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast({
        title: "Error",
        description: "Gagal memuat pengaturan situs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (section: string) => {
    setSaving(section);
    try {
      const setting = settings[section];
      const { error } = await supabase
        .from("site_settings")
        .update({
          title: setting.title,
          subtitle: setting.subtitle,
          description: setting.description,
          description_2: setting.description_2,
          description_3: setting.description_3,
          image_url: setting.image_url,
          extra_data: setting.extra_data,
        })
        .eq("section", section);

      if (error) throw error;

      toast({
        title: "Berhasil",
        description: "Pengaturan berhasil diperbarui",
      });
    } catch (error) {
      console.error("Error updating settings:", error);
      toast({
        title: "Error",
        description: "Gagal memperbarui pengaturan",
        variant: "destructive",
      });
    } finally {
      setSaving(null);
    }
  };

  const updateSetting = (section: string, field: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const updateExtraData = (section: string, key: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        extra_data: {
          ...prev[section].extra_data,
          [key]: value,
        },
      },
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <Tabs defaultValue="hero" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="hero">Hero</TabsTrigger>
        <TabsTrigger value="about">About</TabsTrigger>
        <TabsTrigger value="journal">Journal</TabsTrigger>
        <TabsTrigger value="footer">Footer</TabsTrigger>
      </TabsList>

      <TabsContent value="hero">
        <Card>
          <CardHeader>
            <CardTitle>Hero Section</CardTitle>
            <CardDescription>
              Edit konten untuk bagian hero di halaman utama
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="hero-title">Title</Label>
              <Input
                id="hero-title"
                value={settings.hero?.title || ""}
                onChange={(e) => updateSetting("hero", "title", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="hero-subtitle">Subtitle</Label>
              <Input
                id="hero-subtitle"
                value={settings.hero?.subtitle || ""}
                onChange={(e) =>
                  updateSetting("hero", "subtitle", e.target.value)
                }
              />
            </div>
            <div>
              <Label htmlFor="hero-description">Description</Label>
              <Textarea
                id="hero-description"
                value={settings.hero?.description || ""}
                onChange={(e) =>
                  updateSetting("hero", "description", e.target.value)
                }
              />
            </div>
            <ImageUpload
              currentImageUrl={settings.hero?.image_url || ""}
              onImageUrlChange={(url) => updateSetting("hero", "image_url", url)}
              folder="hero"
              label="Hero Image"
            />
            <div>
              <Label htmlFor="hero-button1">Button 1 Text</Label>
              <Input
                id="hero-button1"
                value={settings.hero?.extra_data?.button1 || ""}
                onChange={(e) =>
                  updateExtraData("hero", "button1", e.target.value)
                }
              />
            </div>
            <div>
              <Label htmlFor="hero-button2">Button 2 Text</Label>
              <Input
                id="hero-button2"
                value={settings.hero?.extra_data?.button2 || ""}
                onChange={(e) =>
                  updateExtraData("hero", "button2", e.target.value)
                }
              />
            </div>
            <Button
              onClick={() => handleUpdate("hero")}
              disabled={saving === "hero"}
            >
              {saving === "hero" ? (
                <Loader2 className="animate-spin mr-2" size={16} />
              ) : (
                <Save className="mr-2" size={16} />
              )}
              Simpan
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="about">
        <Card>
          <CardHeader>
            <CardTitle>About Section</CardTitle>
            <CardDescription>
              Edit konten untuk bagian tentang kami
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="about-title">Title</Label>
              <Input
                id="about-title"
                value={settings.about?.title || ""}
                onChange={(e) =>
                  updateSetting("about", "title", e.target.value)
                }
              />
            </div>
            <div>
              <Label htmlFor="about-description">Paragraph 1</Label>
              <Textarea
                id="about-description"
                value={settings.about?.description || ""}
                onChange={(e) =>
                  updateSetting("about", "description", e.target.value)
                }
              />
            </div>
            <div>
              <Label htmlFor="about-description2">Paragraph 2</Label>
              <Textarea
                id="about-description2"
                value={settings.about?.description_2 || ""}
                onChange={(e) =>
                  updateSetting("about", "description_2", e.target.value)
                }
              />
            </div>
            <div>
              <Label htmlFor="about-description3">Paragraph 3</Label>
              <Textarea
                id="about-description3"
                value={settings.about?.description_3 || ""}
                onChange={(e) =>
                  updateSetting("about", "description_3", e.target.value)
                }
              />
            </div>
            <ImageUpload
              currentImageUrl={settings.about?.image_url || ""}
              onImageUrlChange={(url) => updateSetting("about", "image_url", url)}
              folder="about"
              label="About Image"
            />
            <Button
              onClick={() => handleUpdate("about")}
              disabled={saving === "about"}
            >
              {saving === "about" ? (
                <Loader2 className="animate-spin mr-2" size={16} />
              ) : (
                <Save className="mr-2" size={16} />
              )}
              Simpan
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="journal">
        <Card>
          <CardHeader>
            <CardTitle>Journal Section</CardTitle>
            <CardDescription>
              Edit konten untuk bagian behind the design
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="journal-subtitle">Subtitle</Label>
              <Input
                id="journal-subtitle"
                value={settings.journal?.subtitle || ""}
                onChange={(e) =>
                  updateSetting("journal", "subtitle", e.target.value)
                }
              />
            </div>
            <div>
              <Label htmlFor="journal-title">Title</Label>
              <Input
                id="journal-title"
                value={settings.journal?.title || ""}
                onChange={(e) =>
                  updateSetting("journal", "title", e.target.value)
                }
              />
            </div>
            <div>
              <Label htmlFor="journal-description">Paragraph 1</Label>
              <Textarea
                id="journal-description"
                value={settings.journal?.description || ""}
                onChange={(e) =>
                  updateSetting("journal", "description", e.target.value)
                }
              />
            </div>
            <div>
              <Label htmlFor="journal-description2">Paragraph 2</Label>
              <Textarea
                id="journal-description2"
                value={settings.journal?.description_2 || ""}
                onChange={(e) =>
                  updateSetting("journal", "description_2", e.target.value)
                }
              />
            </div>
            <ImageUpload
              currentImageUrl={settings.journal?.image_url || ""}
              onImageUrlChange={(url) => updateSetting("journal", "image_url", url)}
              folder="journal"
              label="Journal Image"
            />
            <div>
              <Label htmlFor="journal-button">Button Text</Label>
              <Input
                id="journal-button"
                value={settings.journal?.extra_data?.button || ""}
                onChange={(e) =>
                  updateExtraData("journal", "button", e.target.value)
                }
              />
            </div>
            <Button
              onClick={() => handleUpdate("journal")}
              disabled={saving === "journal"}
            >
              {saving === "journal" ? (
                <Loader2 className="animate-spin mr-2" size={16} />
              ) : (
                <Save className="mr-2" size={16} />
              )}
              Simpan
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="footer">
        <Card>
          <CardHeader>
            <CardTitle>Footer Section</CardTitle>
            <CardDescription>
              Edit konten dan link sosial media di footer
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="footer-title">Brand Name</Label>
              <Input
                id="footer-title"
                value={settings.footer?.title || ""}
                onChange={(e) =>
                  updateSetting("footer", "title", e.target.value)
                }
              />
            </div>
            <div>
              <Label htmlFor="footer-description">Description</Label>
              <Textarea
                id="footer-description"
                value={settings.footer?.description || ""}
                onChange={(e) =>
                  updateSetting("footer", "description", e.target.value)
                }
              />
            </div>
            <div>
              <Label htmlFor="footer-instagram">Instagram URL</Label>
              <Input
                id="footer-instagram"
                value={settings.footer?.extra_data?.instagram || ""}
                onChange={(e) =>
                  updateExtraData("footer", "instagram", e.target.value)
                }
              />
            </div>
            <div>
              <Label htmlFor="footer-email">Email</Label>
              <Input
                id="footer-email"
                type="email"
                value={settings.footer?.extra_data?.email || ""}
                onChange={(e) =>
                  updateExtraData("footer", "email", e.target.value)
                }
              />
            </div>
            <div>
              <Label htmlFor="footer-whatsapp">WhatsApp URL</Label>
              <Input
                id="footer-whatsapp"
                value={settings.footer?.extra_data?.whatsapp || ""}
                onChange={(e) =>
                  updateExtraData("footer", "whatsapp", e.target.value)
                }
              />
            </div>
            <Button
              onClick={() => handleUpdate("footer")}
              disabled={saving === "footer"}
            >
              {saving === "footer" ? (
                <Loader2 className="animate-spin mr-2" size={16} />
              ) : (
                <Save className="mr-2" size={16} />
              )}
              Simpan
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default SiteSettingsManagement;
