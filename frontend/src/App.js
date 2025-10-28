import { useState } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import logoImage from "./logo.png";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login attempt:", { username, password });
    // Giriş işlemleri burada yapılacak
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-900/50 border-slate-800 backdrop-blur-sm">
        <CardHeader className="flex flex-col p-6 space-y-4">
          <div className="flex justify-center">
            <img
              alt="SAR Ambalaj"
              className="h-24 w-24 object-contain"
              src={logoImage}
            />
          </div>
          <div className="text-center">
            <div
              className="font-semibold tracking-tight text-2xl text-white"
              style={{ fontFamily: '"Space Grotesk", sans-serif' }}
            >
              SAR Ambalaj
            </div>
            <div className="text-sm text-slate-400 mt-2">
              Üretim Yönetim Sistemine Giriş
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="username"
                className="text-sm font-medium leading-none text-slate-200"
              >
                Kullanıcı Adı
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Kullanıcı adınızı girin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="bg-slate-800/50 border-slate-700 text-white"
                data-testid="username-input"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium leading-none text-slate-200"
              >
                Şifre
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Şifrenizi girin"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-slate-800/50 border-slate-700 text-white pr-10"
                  data-testid="password-input"
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                  data-testid="toggle-password-btn"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              data-testid="login-submit-btn"
            >
              Giriş Yap
            </Button>
          </form>
          <div className="mt-4 text-center text-xs text-slate-500">
            <p>Varsayılan Admin:</p>
            <p className="font-mono">admin / SAR2025!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
