import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { z } from "zod";

const authSchema = z.object({
  email: z.string().email({ message: "Email tidak valid" }),
  password: z
    .string()
    .min(6, { message: "Password minimal 6 karakter" })
    .max(100, { message: "Password maksimal 100 karakter" }),
  fullName: z.string().optional(),
});

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        navigate("/admin");
      }
    };
    checkUser();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validatedData = authSchema.parse({
        email: email.trim(),
        password,
        fullName: fullName.trim(),
      });

      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: validatedData.email,
          password: validatedData.password,
        });

        if (error) throw error;

        if (data.session) {
          toast.success("Login berhasil!");
          navigate("/admin");
        }
      } else {
        const redirectUrl = `${window.location.origin}/admin`;
        const { data, error } = await supabase.auth.signUp({
          email: validatedData.email,
          password: validatedData.password,
          options: {
            data: {
              full_name: validatedData.fullName || "",
            },
            emailRedirectTo: redirectUrl,
          },
        });

        if (error) throw error;

        if (data.session) {
          toast.success("Registrasi berhasil!");
          navigate("/admin");
        } else {
          toast.success("Silakan cek email untuk verifikasi akun Anda");
        }
      }
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else if (error.message?.includes("already registered")) {
        toast.error("Email sudah terdaftar");
      } else if (error.message?.includes("Invalid login")) {
        toast.error("Email atau password salah");
      } else {
        toast.error(error.message || "Terjadi kesalahan");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="max-w-md w-full space-y-8 bg-background p-8 rounded-lg shadow-elegant">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary">XINE</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {isLogin ? "Login ke Admin Panel" : "Registrasi Admin Baru"}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          {!isLogin && (
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Nama Lengkap
              </label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required={!isLogin}
                placeholder="Masukkan nama lengkap"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@xine.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Min. 6 karakter"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            variant="hero"
            size="lg"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Memproses..." : isLogin ? "Login" : "Registrasi"}
          </Button>
        </form>

        <div className="text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-primary hover:underline"
          >
            {isLogin
              ? "Belum punya akun? Registrasi"
              : "Sudah punya akun? Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
