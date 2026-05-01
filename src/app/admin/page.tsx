"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  MousePointer2,
  MessageSquare,
  BookOpen,
  Loader2,
  Lock,
  BarChart3,
  CheckCircle2,
} from "lucide-react";

interface AdminStats {
  totalVisitors: number;
  ctaClicks: { action: string; count: number }[];
  topQuestions: { question: string; count: number }[];
  pendingGuestbook: {
    _id: string;
    name: string;
    message: string;
    timestamp: string;
  }[];
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className={`inline-flex p-2 rounded-lg mb-3 ${color}`}>
        <Icon size={20} />
      </div>
      <p className="text-slate-400 text-sm">{label}</p>
      <p className="text-white text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}

const SESSION_KEY = "aj_admin_pw";

export default function AdminPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState("");
  const [approvingId, setApprovingId] = useState<string | null>(null);

  const fetchStats = useCallback(async (pw: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/stats", {
        headers: { Authorization: `Bearer ${pw}` },
      });
      if (res.status === 401) {
        sessionStorage.removeItem(SESSION_KEY);
        setError("Wrong password.");
        setAuthed(false);
        setLoading(false);
        return;
      }
      if (!res.ok) throw new Error("Failed to load stats");
      const data: AdminStats = await res.json();
      sessionStorage.setItem(SESSION_KEY, pw);
      setStats(data);
      setAuthed(true);
    } catch {
      setError("Could not load stats. Check the console.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStats(password);
  };

  const handleApprove = async (id: string) => {
    const pw = sessionStorage.getItem(SESSION_KEY) ?? password;
    setApprovingId(id);
    try {
      const res = await fetch(`/api/admin/guestbook/${id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${pw}` },
      });
      if (res.ok) {
        // Remove from pending list optimistically
        setStats((prev) =>
          prev
            ? {
                ...prev,
                pendingGuestbook: prev.pendingGuestbook.filter(
                  (e) => e._id !== id,
                ),
              }
            : prev,
        );
      }
    } finally {
      setApprovingId(null);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthed(false);
    setPassword("");
    setStats(null);
  };

  // On mount: restore session if password was saved
  useEffect(() => {
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (saved) {
      setPassword(saved);
      fetchStats(saved).finally(() => setInitializing(false));
    } else {
      setInitializing(false);
    }
  }, [fetchStats]);

  // Auto-refresh every 30s when authed
  useEffect(() => {
    if (!authed) return;
    const id = setInterval(() => fetchStats(password), 30_000);
    return () => clearInterval(id);
  }, [authed, password, fetchStats]);

  // Lock navigation while logged in — push /admin back on popstate
  useEffect(() => {
    if (!authed) return;
    // Push a history entry so back button hits this before leaving
    window.history.pushState(null, "", "/admin");
    const onPop = () => {
      window.history.pushState(null, "", "/admin");
      router.replace("/admin");
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [authed, router]);

  const totalClicks = stats?.ctaClicks.reduce((s, c) => s + c.count, 0) ?? 0;
  const totalQuestions =
    stats?.topQuestions.reduce((s, q) => s + q.count, 0) ?? 0;

  if (initializing) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-slate-600" />
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2 mb-8">
            <BarChart3 size={24} className="text-indigo-400" />
            <h1 className="text-white font-bold text-xl">Portfolio Admin</h1>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="admin-pw"
                className="block text-slate-400 text-sm mb-1.5"
              >
                Password
              </label>
              <input
                id="admin-pw"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                placeholder="Enter admin password"
                required
                autoFocus
              />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading || !password}
              className="w-full inline-flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Lock size={16} />
              )}
              {loading ? "Loading..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 lg:p-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-2">
            <BarChart3 size={24} className="text-indigo-400" />
            <h1 className="font-bold text-xl">Portfolio Analytics</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-slate-500 text-sm">
              Auto-refreshes every 30s
            </span>
            <button
              onClick={() => fetchStats(password)}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm transition-colors"
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-red-900/40 text-slate-400 hover:text-red-400 text-sm transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatCard
            icon={Eye}
            label="Unique Visitors"
            value={stats?.totalVisitors ?? 0}
            color="bg-indigo-500/20 text-indigo-400"
          />
          <StatCard
            icon={MousePointer2}
            label="CTA Clicks"
            value={totalClicks}
            color="bg-emerald-500/20 text-emerald-400"
          />
          <StatCard
            icon={MessageSquare}
            label="Bot Questions"
            value={totalQuestions}
            color="bg-violet-500/20 text-violet-400"
          />
          <StatCard
            icon={BookOpen}
            label="Pending Guestbook"
            value={stats?.pendingGuestbook.length ?? 0}
            color="bg-amber-500/20 text-amber-400"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* CTA Clicks */}
          <section>
            <h2 className="text-slate-300 font-semibold text-base mb-4">
              CTA Clicks
            </h2>
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
              {stats?.ctaClicks.length === 0 ? (
                <p className="text-slate-500 text-sm p-6">
                  No clicks recorded yet.
                </p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left px-4 py-3 text-slate-400 font-medium">
                        Action
                      </th>
                      <th className="text-right px-4 py-3 text-slate-400 font-medium">
                        Count
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats?.ctaClicks.map((c) => (
                      <tr
                        key={c.action}
                        className="border-b border-slate-700/50 last:border-0"
                      >
                        <td className="px-4 py-3 text-slate-200 font-mono">
                          {c.action}
                        </td>
                        <td className="px-4 py-3 text-right text-white font-bold">
                          {c.count}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>

          {/* Top Bot Questions */}
          <section>
            <h2 className="text-slate-300 font-semibold text-base mb-4">
              Top Bot Questions
            </h2>
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden max-h-80 overflow-y-auto">
              {stats?.topQuestions.length === 0 ? (
                <p className="text-slate-500 text-sm p-6">
                  No questions recorded yet.
                </p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left px-4 py-3 text-slate-400 font-medium">
                        Question
                      </th>
                      <th className="text-right px-4 py-3 text-slate-400 font-medium w-16">
                        Asked
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats?.topQuestions.map((q, i) => (
                      <tr
                        key={i}
                        className="border-b border-slate-700/50 last:border-0"
                      >
                        <td className="px-4 py-3 text-slate-200 max-w-xs truncate">
                          {q.question}
                        </td>
                        <td className="px-4 py-3 text-right text-white font-bold">
                          {q.count}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        </div>

        {/* Pending Guestbook */}
        <section className="mt-8">
          <h2 className="text-slate-300 font-semibold text-base mb-4">
            Pending Guestbook Entries
          </h2>
          <div className="bg-slate-800 rounded-xl border border-slate-700">
            {stats?.pendingGuestbook.length === 0 ? (
              <p className="text-slate-500 text-sm p-6">
                No pending entries — all clear!
              </p>
            ) : (
              <div className="divide-y divide-slate-700">
                {stats?.pendingGuestbook.map((e) => (
                  <div key={e._id} className="p-5 flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-white font-semibold">
                          {e.name}
                        </span>
                        <span className="text-slate-500 text-xs">
                          {new Date(e.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-slate-300 text-sm">{e.message}</p>
                    </div>
                    <button
                      onClick={() => handleApprove(e._id)}
                      disabled={approvingId === e._id}
                      className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold transition-colors"
                    >
                      {approvingId === e._id ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <CheckCircle2 size={12} />
                      )}
                      Approve
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
