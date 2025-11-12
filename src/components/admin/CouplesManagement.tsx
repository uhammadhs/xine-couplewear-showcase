import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Trash2, Plus, Award } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import ImageUpload from "./ImageUpload";

interface Couple {
  id: string;
  couple_names: string;
  email: string | null;
  phone: string | null;
  photo_url: string | null;
  total_points: number;
  rank: number | null;
  is_public: boolean;
  created_at: string;
}

const CouplesManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [newCouple, setNewCouple] = useState({
    couple_names: "",
    email: "",
    phone: "",
    photo_url: "",
    total_points: 0,
    is_public: true,
  });

  const { data: couples, isLoading } = useQuery({
    queryKey: ["couples-admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("couples")
        .select("*")
        .order("rank", { ascending: true });

      if (error) throw error;
      return data as Couple[];
    },
  });

  const addMutation = useMutation({
    mutationFn: async (couple: typeof newCouple) => {
      const { error } = await supabase.from("couples").insert([couple]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["couples-admin"] });
      toast({ title: "Couple berhasil ditambahkan" });
      setIsAdding(false);
      setNewCouple({
        couple_names: "",
        email: "",
        phone: "",
        photo_url: "",
        total_points: 0,
        is_public: true,
      });
    },
    onError: () => {
      toast({ title: "Gagal menambahkan couple", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Couple> }) => {
      const { error } = await supabase
        .from("couples")
        .update(updates)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["couples-admin"] });
      toast({ title: "Couple berhasil diupdate" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("couples").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["couples-admin"] });
      toast({ title: "Couple berhasil dihapus" });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Couples</h2>
        <Button onClick={() => setIsAdding(!isAdding)}>
          <Plus className="mr-2 h-4 w-4" />
          {isAdding ? "Cancel" : "Add Couple"}
        </Button>
      </div>

      {isAdding && (
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <Label>Couple Names *</Label>
              <Input
                value={newCouple.couple_names}
                onChange={(e) =>
                  setNewCouple({ ...newCouple, couple_names: e.target.value })
                }
                placeholder="e.g., Budi & Ani"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={newCouple.email}
                  onChange={(e) =>
                    setNewCouple({ ...newCouple, email: e.target.value })
                  }
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  value={newCouple.phone}
                  onChange={(e) =>
                    setNewCouple({ ...newCouple, phone: e.target.value })
                  }
                  placeholder="+62 xxx"
                />
              </div>
            </div>

            <div>
              <Label>Photo</Label>
              <ImageUpload
                currentImageUrl={newCouple.photo_url}
                onImageUrlChange={(url) =>
                  setNewCouple({ ...newCouple, photo_url: url })
                }
                folder="couples"
              />
            </div>

            <div>
              <Label>Initial Points</Label>
              <Input
                type="number"
                value={newCouple.total_points}
                onChange={(e) =>
                  setNewCouple({ ...newCouple, total_points: parseInt(e.target.value) || 0 })
                }
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={newCouple.is_public}
                onCheckedChange={(checked) =>
                  setNewCouple({ ...newCouple, is_public: checked })
                }
              />
              <Label>Show publicly</Label>
            </div>

            <Button
              onClick={() => addMutation.mutate(newCouple)}
              disabled={!newCouple.couple_names || addMutation.isPending}
              className="w-full"
            >
              Add Couple
            </Button>
          </div>
        </Card>
      )}

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid gap-4">
          {couples?.map((couple) => (
            <Card key={couple.id} className="p-6">
              <div className="flex items-start gap-4">
                {couple.photo_url ? (
                  <img
                    src={couple.photo_url}
                    alt={couple.couple_names}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-semibold text-xl">
                    {couple.couple_names.charAt(0)}
                  </div>
                )}

                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{couple.couple_names}</h3>
                  <p className="text-sm text-muted-foreground">
                    Rank #{couple.rank || '-'} • {couple.total_points} points
                  </p>
                  {couple.email && (
                    <p className="text-sm text-muted-foreground">{couple.email}</p>
                  )}
                  {couple.phone && (
                    <p className="text-sm text-muted-foreground">{couple.phone}</p>
                  )}
                  
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={couple.is_public}
                        onCheckedChange={(checked) =>
                          updateMutation.mutate({
                            id: couple.id,
                            updates: { is_public: checked },
                          })
                        }
                      />
                      <Label className="text-sm">Public</Label>
                    </div>

                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        className="w-24"
                        defaultValue={couple.total_points}
                        onBlur={(e) => {
                          const newPoints = parseInt(e.target.value) || 0;
                          if (newPoints !== couple.total_points) {
                            updateMutation.mutate({
                              id: couple.id,
                              updates: { total_points: newPoints },
                            });
                          }
                        }}
                      />
                      <Award className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>

                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => deleteMutation.mutate(couple.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CouplesManagement;