import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Award, Medal, Crown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CoupleGoalsForm } from "./CoupleGoalsForm";
import { useState } from "react";

interface Couple {
  id: string;
  couple_names: string;
  photo_url: string | null;
  total_points: number;
  rank: number | null;
}

const CoupleGoals = () => {
  const [open, setOpen] = useState(false);
  const { data: couples, isLoading } = useQuery({
    queryKey: ["couples"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("couples")
        .select("*")
        .eq("is_public", true)
        .order("rank", { ascending: true })
        .limit(5);

      if (error) throw error;
      return data as Couple[];
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes (frequently updated)
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    refetchOnWindowFocus: true, // Refresh when user comes back
  });

  const getRankIcon = (rank: number | null) => {
    if (!rank) return <Award className="w-6 h-6 text-muted-foreground" />;
    
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <Trophy className="w-6 h-6 text-primary" />;
    }
  };

  const getRankBadgeVariant = (rank: number | null) => {
    if (!rank) return "secondary";
    if (rank <= 3) return "default";
    return "secondary";
  };

  return (
    <section id="couple-goals" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif mb-4">Couple Goals</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Bergabunglah dengan pasangan lainnya yang telah mempercayai kami untuk mewujudkan momen istimewa mereka
          </p>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="mt-4">Join the Couple Goals</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Join the Couple Goals</DialogTitle>
                <DialogDescription>
                  Submit your details to be featured in the Couple Goals section.
                </DialogDescription>
              </DialogHeader>
              <CoupleGoalsForm setOpen={setOpen} />
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="p-6">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-16 h-16 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : couples && couples.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {couples.map((couple) => (
              <Card
                key={couple.id}
                className={`p-6 transition-all hover:shadow-lg ${
                  couple.rank === 1 ? 'border-yellow-500 border-2' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    {couple.photo_url ? (
                      <img
                        src={couple.photo_url}
                        alt={couple.couple_names}
                        className="w-16 h-16 rounded-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-semibold text-xl">
                        {couple.couple_names.charAt(0)}
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-1">
                      {getRankIcon(couple.rank)}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{couple.couple_names}</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant={getRankBadgeVariant(couple.rank)}>
                        Rank #{couple.rank || '-'}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {couple.total_points} points
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Belum ada couple yang terdaftar. Jadilah yang pertama!
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CoupleGoals;
