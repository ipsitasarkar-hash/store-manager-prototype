import { MoreHorizontal, ChevronDown, TrendingDown, ClipboardList, Building2, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";

const InsightsSection = ({ jobActivated }: { jobActivated?: boolean }) => {
  const [showResolved, setShowResolved] = useState(false);

  useEffect(() => {
    if (jobActivated) {
      const t = setTimeout(() => setShowResolved(true), 50);
      return () => clearTimeout(t);
    }
  }, [jobActivated]);

  return (
    <div className="px-4 md:px-6" style={{ marginTop: '28px' }}>
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-sap-base font-semibold text-foreground">Insights</h3>
        <button className="text-primary hover:text-primary/80"><MoreHorizontal size={16} /></button>
        <button className="text-primary hover:text-primary/80"><ChevronDown size={16} /></button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Price Deviation Card */}
        <div className={`bg-card rounded-md p-4 min-w-0 border transition-all duration-700 ${showResolved ? "border-success/40" : "border-border/55"}`}>
          <div className="flex items-center gap-2 mb-3">
            <div className={`w-9 h-9 rounded-md flex items-center justify-center shrink-0 transition-all duration-700 ${showResolved ? "bg-success/10" : "bg-label-accent/10"}`}>
              <CheckCircle2 size={18} className={`absolute transition-all duration-500 ${showResolved ? "opacity-100 scale-100" : "opacity-0 scale-75"}`} style={{ color: 'hsl(var(--success))' }} />
              <TrendingDown size={18} className={`transition-all duration-500 ${showResolved ? "opacity-0 scale-75" : "opacity-100 scale-100"}`} style={{ color: 'hsl(var(--label-accent))' }} />
            </div>
            <div className="min-w-0">
              <p className="text-sap-base font-semibold text-foreground truncate">
                {showResolved ? "Price Deviation Resolved" : "Price Deviation Detected"}
              </p>
              <p className={`text-sap-sm transition-colors duration-700 ${showResolved ? "text-success" : "text-muted-foreground"}`}>
                {showResolved ? "Resolved" : "Issue"}
              </p>
            </div>
          </div>
          <div className="flex items-baseline gap-4 md:gap-8 mb-1 flex-wrap">
            <div>
              <p className="text-sap-lg font-medium text-foreground">+2.35<span className="text-sap-xs font-medium text-muted-foreground ml-0.5">%</span></p>
              <p className="text-sap-xs text-muted-foreground mt-0.5">Avg Margin Variance</p>
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <p className="text-sap-lg font-medium text-foreground">+0.35<span className="text-sap-xs font-medium text-muted-foreground ml-0.5">%</span></p>
                <CheckCircle2 size={16} className={`transition-all duration-500 ${showResolved ? "opacity-100 scale-100" : "opacity-0 scale-75"}`} style={{ color: 'hsl(var(--success))' }} />
              </div>
              <p className={`text-sap-xs text-muted-foreground mt-0.5`}>
                {showResolved ? "Within Tolerance" : "Above Tolerance"}
              </p>
            </div>
          </div>
          <div className="space-y-1 text-sap-sm border-t border-border pt-3">
            <div className={`transition-opacity duration-500 ${showResolved ? "opacity-0 h-0 overflow-hidden" : "opacity-100"} space-y-1`}>
              <p><span className="text-muted-foreground">Deadline:</span> <span className="font-medium text-foreground">Before weekly review closes</span></p>
              <p><span className="text-muted-foreground">Impact if unresolved:</span> <span className="font-medium text-foreground">Period close buffer reduced</span></p>
              <p><span className="text-muted-foreground">Description:</span> <span className="font-medium text-foreground">Variance explanation required</span></p>
            </div>
            <div className={`transition-opacity duration-700 ${showResolved ? "opacity-100" : "opacity-0 h-0 overflow-hidden"}`}>
              <p className="flex items-center gap-1.5 text-success font-medium">
                <CheckCircle2 size={12} />
                Tolerance limit updated by job — no action required
              </p>
            </div>
          </div>
        </div>

        {/* Recommended Tasks Card */}
        <div className="bg-card rounded-md p-4 min-w-0 border border-border/55">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-9 h-9 rounded-md bg-teal-light flex items-center justify-center shrink-0">
                <ClipboardList size={18} className="text-teal" />
              </div>
              <div className="min-w-0">
                <p className="text-sap-base font-semibold text-foreground truncate">Recommended Tasks</p>
                <p className="text-sap-sm text-muted-foreground">Price Variance</p>
              </div>
            </div>
            <button className="text-primary hover:text-primary/80 shrink-0"><MoreHorizontal size={16} /></button>
          </div>
          <div className="space-y-2">
            {[
              { name: "Line Item 1: High-Tensile Steel Bolts M12 x 80mm", price: "$46,800.00" },
              { name: "Line Item 2: Hydraulic Seal Kit — Type HK-440", price: "$36,440.00" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 rounded-xs border border-border min-w-0">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-6 h-6 rounded-xs border border-teal/30 bg-teal-light flex items-center justify-center shrink-0">
                    <div className="w-3 h-3 rounded-xs bg-teal/20" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sap-sm font-medium text-foreground truncate">{item.name}</p>
                    <p className="text-sap-sm text-muted-foreground">{item.price}</p>
                  </div>
                </div>
                <button className="text-primary hover:text-primary/80 shrink-0"><MoreHorizontal size={14} /></button>
              </div>
            ))}
          </div>
        </div>

        {/* Supplier Card */}
        <div className="bg-card rounded-md p-4 min-w-0 border border-border/55">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
              <Building2 size={18} className="text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-sap-base font-semibold text-foreground truncate">Meridian Frost Ltd</p>
              <p className="text-sap-sm text-muted-foreground">200400012</p>
            </div>
          </div>
          <div className="text-sap-sm">
            <p className="font-medium text-foreground mb-1">Contact</p>
            <p className="text-muted-foreground leading-relaxed">
              47 Industrial Pkwy<br />
              Detroit, MI 48201<br />
              USA
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightsSection;
