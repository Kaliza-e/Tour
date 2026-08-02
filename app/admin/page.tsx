import { ShieldCheck, FileCheck, Users, BarChart3, Settings, Bell, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminDashboardPage() {
  return (
    <div className="py-12 bg-ivory min-h-screen">
      <div className="container-tour space-y-8">
        {/* Admin Header */}
        <div className="rounded-3xl border border-navy/15 bg-navy p-8 text-ivory flex flex-col md:flex-row items-center justify-between gap-6 shadow-soft">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-sapphire/50 px-3 py-1 text-xs font-semibold text-champagne">
              <ShieldCheck className="h-4 w-4" /> Platform Admin Portal
            </div>
            <h1 className="font-heading text-3xl font-bold text-ivory">Editorial & Moderation Control Center</h1>
            <p className="text-xs text-ivory/70 max-w-xl">
              Manage incoming research paper submissions, assign peer reviewers, audit volunteer hours, and review reported questions.
            </p>
          </div>
        </div>

        {/* Quick Admin Stats */}
        <div className="grid gap-6 md:grid-cols-4">
          <div className="rounded-3xl border border-navy/10 bg-white p-6 shadow-sm space-y-2">
            <p className="text-xs uppercase font-bold text-sapphire">Pending Submissions</p>
            <p className="font-heading text-3xl font-extrabold text-navy">12</p>
            <p className="text-xs text-amber-700 font-semibold">Requires Editorial Review</p>
          </div>
          <div className="rounded-3xl border border-navy/10 bg-white p-6 shadow-sm space-y-2">
            <p className="text-xs uppercase font-bold text-sapphire">Active Peer Reviews</p>
            <p className="font-heading text-3xl font-extrabold text-navy">28</p>
            <p className="text-xs text-navy/60">Across 8 categories</p>
          </div>
          <div className="rounded-3xl border border-navy/10 bg-white p-6 shadow-sm space-y-2">
            <p className="text-xs uppercase font-bold text-sapphire">Pending Volunteer Logs</p>
            <p className="font-heading text-3xl font-extrabold text-navy">19</p>
            <p className="text-xs text-navy/60">Hours verification queue</p>
          </div>
          <div className="rounded-3xl border border-navy/10 bg-white p-6 shadow-sm space-y-2">
            <p className="text-xs uppercase font-bold text-sapphire">Total Platform Users</p>
            <p className="font-heading text-3xl font-extrabold text-navy">2,480</p>
            <p className="text-xs text-emerald-700 font-semibold">+18% this month</p>
          </div>
        </div>

        {/* Action Table: Submissions Queue */}
        <div className="rounded-3xl border border-navy/10 bg-white p-6 shadow-card space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-heading text-xl font-bold text-navy">Incoming Research Submissions Queue</h3>
            <span className="text-xs text-navy/60">Showing 3 of 12 pending</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-navy">
              <thead className="border-b border-navy/10 bg-champagne/30 text-navy font-bold uppercase text-[11px]">
                <tr>
                  <th className="p-3">Paper Title</th>
                  <th className="p-3">Author</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Submitted Date</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy/10">
                <tr>
                  <td className="p-3 font-semibold text-navy">Neural Net Models for Local Rainfall Anomaly</td>
                  <td className="p-3">Kofi A. (Grade 12)</td>
                  <td className="p-3">Computer Science</td>
                  <td className="p-3">Aug 1, 2026</td>
                  <td className="p-3 text-right space-x-2">
                    <Button size="sm" className="rounded-full bg-emerald-700 text-ivory hover:bg-emerald-800 text-[11px] px-3 py-1">
                      <Check className="h-3 w-3 mr-1" /> Approve
                    </Button>
                    <Button size="sm" variant="secondary" className="rounded-full border-red-300 text-red-700 hover:bg-red-50 text-[11px] px-3 py-1">
                      <X className="h-3 w-3 mr-1" /> Reject
                    </Button>
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-navy">Acoustic Levitation in Microgravity Simulation</td>
                  <td className="p-3">Elena V. (Undergrad)</td>
                  <td className="p-3">Physics</td>
                  <td className="p-3">Jul 30, 2026</td>
                  <td className="p-3 text-right space-x-2">
                    <Button size="sm" className="rounded-full bg-emerald-700 text-ivory hover:bg-emerald-800 text-[11px] px-3 py-1">
                      <Check className="h-3 w-3 mr-1" /> Approve
                    </Button>
                    <Button size="sm" variant="secondary" className="rounded-full border-red-300 text-red-700 hover:bg-red-50 text-[11px] px-3 py-1">
                      <X className="h-3 w-3 mr-1" /> Reject
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
