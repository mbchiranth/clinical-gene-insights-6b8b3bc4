import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Shield, Stethoscope, Building2, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [hospital, setHospital] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate("/");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName, hospital, specialty },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        toast({
          title: "Account created",
          description: "You can now sign in with your credentials.",
        });
        setIsLogin(true);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[hsl(var(--topbar))] text-[hsl(var(--topbar-foreground))] flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 opacity-80" />
          <div>
            <h1 className="text-xl font-semibold tracking-tight">PGx Clinical Decision Support</h1>
            <p className="text-sm opacity-60">Pharmacogenomic Risk Profile System</p>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-semibold leading-tight">
              Precision Medicine<br />at the Point of Care
            </h2>
            <p className="mt-4 text-sm opacity-70 leading-relaxed max-w-md">
              Evidence-based pharmacogenomic decision support integrated into your clinical workflow.
              Reduce adverse drug reactions and optimize therapy selection.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: "🧬", label: "Gene-Drug Analysis", desc: "8 pharmacogenes profiled" },
              { icon: "⚠️", label: "Real-time Alerts", desc: "Hard & soft stop warnings" },
              { icon: "📊", label: "Risk Stratification", desc: "Evidence-based scoring" },
              { icon: "🔒", label: "HIPAA Compliant", desc: "Full audit trail" },
            ].map((item) => (
              <div key={item.label} className="border border-[hsl(var(--topbar-foreground)/0.15)] rounded-md p-3">
                <span className="text-lg">{item.icon}</span>
                <p className="text-sm font-medium mt-1">{item.label}</p>
                <p className="text-xs opacity-50">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs opacity-40">
          <span>HIPAA Secure</span>
          <span>•</span>
          <span>CPIC Guidelines v4.0</span>
          <span>•</span>
          <span>Audit Logging Enabled</span>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-semibold text-sm">PGx Clinical Decision Support</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground">
              {isLogin ? "Welcome back" : "Create your account"}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {isLogin
                ? "Sign in to access the clinical decision support system"
                : "Register as a healthcare professional"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Full Name
                  </label>
                  <div className="relative mt-1">
                    <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Dr. Jane Smith"
                      required
                      className="w-full h-10 rounded-md border border-input bg-background pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Hospital
                    </label>
                    <div className="relative mt-1">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        value={hospital}
                        onChange={(e) => setHospital(e.target.value)}
                        placeholder="Hospital name"
                        className="w-full h-10 rounded-md border border-input bg-background pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Specialty
                    </label>
                    <input
                      type="text"
                      value={specialty}
                      onChange={(e) => setSpecialty(e.target.value)}
                      placeholder="e.g. Cardiology"
                      className="w-full h-10 mt-1 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="doctor@hospital.org"
                required
                className="w-full h-10 mt-1 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Password
              </label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 rounded-md bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-primary hover:underline"
            >
              {isLogin ? "Don't have an account? Register" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
