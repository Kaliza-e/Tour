import { Download, Quote, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PublicationDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="container-tour max-w-3xl py-20">
      <span className="rounded-pill bg-champagne px-3 py-1 text-xs font-semibold text-navy">
        Environmental Science
      </span>
      <h1 className="mt-5 font-heading text-3xl font-bold text-navy md:text-4xl">
        Microplastic Accumulation in Freshwater Snails
      </h1>
      <p className="mt-3 text-sm text-navy/50">Leah M. · Published · Paper #{params.id}</p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button size="sm" variant="secondary"><Download size={15} /> Download PDF</Button>
        <Button size="sm" variant="ghost"><Quote size={15} /> Cite this paper</Button>
        <Button size="sm" variant="ghost"><Bookmark size={15} /> Bookmark</Button>
      </div>

      <div className="mt-10 rounded-card bg-white p-8 shadow-card">
        <h2 className="font-heading text-lg font-bold text-navy">Abstract</h2>
        <p className="mt-3 leading-relaxed text-navy/65">
          This study measures microplastic concentration in the tissue of freshwater
          snails collected across six sites along an urban stream gradient, finding a
          strong correlation between proximity to stormwater outflow and particle
          density — with implications for using snails as a low-cost bioindicator.
        </p>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="rounded-card border border-navy/8 bg-white p-6">
          <h3 className="font-heading text-sm font-bold text-navy">Related question</h3>
          <p className="mt-2 text-sm text-navy/60">
            “Can we use small organisms to detect microplastic pollution cheaply?”
          </p>
        </div>
        <div className="rounded-card border border-navy/8 bg-white p-6">
          <h3 className="font-heading text-sm font-bold text-navy">Keywords</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {["microplastics", "freshwater ecology", "bioindicators"].map((k) => (
              <span key={k} className="rounded-pill bg-ivory px-3 py-1 text-xs text-navy/60">{k}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
