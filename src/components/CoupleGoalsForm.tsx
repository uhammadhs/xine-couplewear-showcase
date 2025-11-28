
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';

const formSchema = z.object({
  couple_names: z.string().min(2, "Couple names must be at least 2 characters."),
  photo: z.instanceof(File).optional(),
});

export function CoupleGoalsForm({
  setOpen,
}: {
  setOpen: (open: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      couple_names: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      let photo_url = null;
      if (values.photo) {
        const file = values.photo;
        const { data, error } = await supabase.storage
          .from("couple-photos")
          .upload(`public/${uuidv4()}`, file);

        if (error) {
          throw new Error("Failed to upload image.");
        }
        
        const { data: publicUrlData } = supabase.storage
          .from("couple-photos")
          .getPublicUrl(data.path);
        photo_url = publicUrlData.publicUrl;
      }

      const { error: insertError } = await supabase.from("couples").insert([
        {
          couple_names: values.couple_names,
          photo_url,
          total_points: 0,
          is_public: false, // Default to not public, admin can approve
        },
      ]);

      if (insertError) {
        throw new Error("Failed to submit couple goals.");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["couples"] });
      toast({
        title: "Success!",
        description: "Your submission has been received and is awaiting approval.",
      });
      setOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="couple_names"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Couple Names</FormLabel>
              <FormControl>
                <Input placeholder="e.g., John & Jane" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="photo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Photo</FormLabel>
              <FormControl>
                <Input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => field.onChange(e.target.files?.[0])}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
