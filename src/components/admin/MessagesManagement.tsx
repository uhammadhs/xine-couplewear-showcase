import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Mail, MailOpen, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id as localeId } from "date-fns/locale";

type Message = {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  replied: boolean;
  created_at: string;
};

const MessagesManagement = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  useEffect(() => {
    fetchMessages();
  }, [filter]);

  const fetchMessages = async () => {
    try {
      let query = supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (filter === "unread") {
        query = query.eq("is_read", false);
      } else if (filter === "read") {
        query = query.eq("is_read", true);
      }

      const { data, error } = await query;

      if (error) throw error;
      setMessages(data || []);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleRead = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("contact_messages")
        .update({ is_read: !currentStatus })
        .eq("id", id);

      if (error) throw error;
      toast.success(currentStatus ? "Ditandai belum dibaca" : "Ditandai sudah dibaca");
      fetchMessages();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const toggleReplied = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("contact_messages")
        .update({ replied: !currentStatus, is_read: true })
        .eq("id", id);

      if (error) throw error;
      toast.success(currentStatus ? "Ditandai belum dibalas" : "Ditandai sudah dibalas");
      fetchMessages();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus pesan ini?")) return;

    try {
      const { error } = await supabase
        .from("contact_messages")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Pesan berhasil dihapus");
      fetchMessages();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Memuat...</div>;
  }

  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-primary">Manajemen Pesan</h2>
          <p className="text-sm text-muted-foreground">
            {unreadCount} pesan belum dibaca
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={filter === "all" ? "hero" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            Semua
          </Button>
          <Button
            variant={filter === "unread" ? "hero" : "outline"}
            size="sm"
            onClick={() => setFilter("unread")}
          >
            Belum Dibaca
          </Button>
          <Button
            variant={filter === "read" ? "hero" : "outline"}
            size="sm"
            onClick={() => setFilter("read")}
          >
            Sudah Dibaca
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`bg-background p-6 rounded-lg shadow-sm border transition-all ${
              !message.is_read
                ? "border-primary/50 bg-primary/5"
                : "border-border"
            }`}
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {!message.is_read && (
                    <Mail className="text-primary" size={18} />
                  )}
                  <h3 className="text-lg font-semibold text-primary">
                    {message.name}
                  </h3>
                  <a
                    href={`mailto:${message.email}`}
                    className="text-sm text-muted-foreground hover:text-primary hover:underline"
                  >
                    {message.email}
                  </a>
                  {message.replied && (
                    <span className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full">
                      Dibalas
                    </span>
                  )}
                </div>
                <p className="text-sm text-foreground mb-3 whitespace-pre-wrap">
                  {message.message}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(message.created_at), {
                    addSuffix: true,
                    locale: localeId,
                  })}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleRead(message.id, message.is_read)}
                  title={message.is_read ? "Tandai belum dibaca" : "Tandai sudah dibaca"}
                >
                  {message.is_read ? (
                    <MailOpen size={16} />
                  ) : (
                    <Mail size={16} />
                  )}
                </Button>
                <Button
                  size="sm"
                  variant={message.replied ? "hero" : "outline"}
                  onClick={() => toggleReplied(message.id, message.replied)}
                  title={message.replied ? "Tandai belum dibalas" : "Tandai sudah dibalas"}
                >
                  {message.replied ? "✓" : "↩"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(message.id)}
                  title="Hapus pesan"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          </div>
        ))}

        {messages.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            {filter === "all"
              ? "Belum ada pesan masuk"
              : filter === "unread"
              ? "Tidak ada pesan yang belum dibaca"
              : "Tidak ada pesan yang sudah dibaca"}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesManagement;
