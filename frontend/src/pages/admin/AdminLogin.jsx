import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api, { extractErrorMessage } from "../../lib/api";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("airo6_admin_token", res.data.token);
      toast.success(`Welcome, ${res.data.admin.name}`);
      navigate("/admin/dashboard");
    } catch (err) {
      toast.error(extractErrorMessage(err, "Login failed."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-void px-6">
      <form onSubmit={handleSubmit} className="glass-panel p-10 w-full max-w-sm">
        <h1 className="font-display text-xl text-mist mb-1 tracking-widest2">AIRO 6.0</h1>
        <p className="text-mist/50 text-sm mb-8">Admin sign in</p>

        <label className="block mb-4">
          <span className="text-xs tracking-widest2 text-mist/50">Email</span>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="mt-2 w-full bg-gunmetal border border-steel px-4 py-3 text-mist" />
        </label>
        <label className="block mb-8">
          <span className="text-xs tracking-widest2 text-mist/50">Password</span>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required className="mt-2 w-full bg-gunmetal border border-steel px-4 py-3 text-mist" />
        </label>

        <button disabled={loading} className="w-full py-3 bg-cyan-400 text-void text-xs tracking-widest2 disabled:opacity-50">
          {loading ? "SIGNING IN…" : "SIGN IN"}
        </button>
      </form>
    </div>
  );
}
