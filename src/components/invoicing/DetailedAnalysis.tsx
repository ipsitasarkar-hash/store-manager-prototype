import { useState, useEffect } from "react";
import { MoreHorizontal, ChevronDown, Package, CheckCircle2 } from "lucide-react";

interface LineItemCardProps {
  name: string;
  invoicePrice: string;
  poPrice: string;
  variance: string;
  thresholdExcess: string;
  resolved?: boolean;
}

const LineItemCard = ({ name, invoicePrice, poPrice, variance, thresholdExcess, resolved }: LineItemCardProps) => {
  const [localResolved, setLocalResolved] = useState(false);
  const [showResolved, setShowResolved] = useState(false);
  const isResolved = resolved || localResolved;

  useEffect(() => {
    if (isResolved) {
      const t = setTimeout(() => setShowResolved(true), 50);
      return () => clearTimeout(t);
    }
  }, [isResolved]);

  return (
    <div className={`bg-card rounded-md p-4 min-w-0 border transition-all duration-700 ${showResolved ? "border-success/30" : "border-border/55"}`}>
      <div className="flex items-center justify-between mb-3 gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-10 h-10 md:w-11 md:h-11 rounded-md flex items-center justify-center shrink-0 transition-all duration-700 ${showResolved ? "bg-success/10" : "bg-blue-50"}`}>
            <CheckCircle2 size={18} className={`absolute transition-all duration-500 ${showResolved ? "opacity-100 scale-100" : "opacity-0 scale-75"}`} style={{ color: 'hsl(var(--success))' }} />
            <Package size={18} className={`transition-all duration-500 ${showResolved ? "opacity-0 scale-75" : "opacity-100 scale-100"} text-blue-500`} />
          </div>
          <div className="min-w-0">
            <p className="text-sap-base font-semibold text-foreground truncate">{name}</p>
            <p className="text-sap-sm text-muted-foreground mt-1">
              Issue type:{" "}
              <span className={`font-medium transition-colors duration-700 ${showResolved ? "text-success" : "text-warning"}`}>
                {showResolved ? "Resolved" : "Price Variance"}
              </span>
            </p>
          </div>
        </div>
        <button className="text-primary hover:text-primary/80 shrink-0"><MoreHorizontal size={16} /></button>
      </div>

      <div className="grid grid-cols-3 gap-3 md:gap-4 mb-3">
        <div className="min-w-0">
          <p className="text-sap-sm text-muted-foreground mb-0.5">Invoice Price:</p>
          <p className="text-sap-base font-bold text-foreground">{invoicePrice}</p>
        </div>
        <div className="min-w-0">
          <p className="text-sap-sm text-muted-foreground mb-0.5">PO Price:</p>
          <p className="text-sap-base font-bold text-foreground">{poPrice}</p>
        </div>
        <div className="min-w-0">
          <p className="text-sap-sm text-muted-foreground mb-0.5">Total Variance:</p>
          <p className="text-sap-base font-bold text-foreground">{variance}</p>
        </div>
      </div>

      <div className={`transition-opacity duration-500 ${showResolved ? "opacity-0 h-0 overflow-hidden" : "opacity-100"}`}>
        <div>
          <p className="text-sap-sm font-medium text-muted-foreground mb-1">Issue Information:</p>
          <p className="text-sap-sm text-foreground leading-relaxed">
            The invoiced unit price exceeds the agreed PO rate by {variance}, identified during the 3-way match process. The variance falls outside the approved tolerance threshold by {thresholdExcess}, requiring review before payment can be authorized. This may be an invoicing error or an unapproved price adjustment.
          </p>
        </div>
      </div>

      <div className={`transition-opacity duration-700 ${showResolved ? "opacity-100" : "opacity-0 h-0 overflow-hidden"}`}>
        <div className="flex items-center gap-1.5 text-success text-sap-sm font-medium">
          <CheckCircle2 size={13} className="shrink-0" />
          Price variance accepted — tolerance limit updated by job
        </div>
      </div>
    </div>
  );
};

const DetailedAnalysis = ({ jobActivated }: { jobActivated?: boolean }) => {
  return (
    <div className="px-4 md:px-6 pb-6" style={{ marginTop: '42px' }}>
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-sap-base font-semibold text-foreground">Detailed Analysis</h3>
        <button className="text-primary hover:text-primary/80"><MoreHorizontal size={16} /></button>
        <button className="text-primary hover:text-primary/80"><ChevronDown size={16} /></button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <LineItemCard
          name="Line Item 1: High-Tensile Steel Bolts M12 x 80mm (Box of 500)"
          invoicePrice="$46,800.00"
          poPrice="$45,774.00"
          variance="2.2%"
          thresholdExcess="0.2%"
          resolved={jobActivated}
        />
        <LineItemCard
          name="Line Item 2: Hydraulic Seal Kit — Type HK-440 Industrial"
          invoicePrice="$36,440.00"
          poPrice="$35,654.00"
          variance="2.5%"
          thresholdExcess="0.5%"
          resolved={jobActivated}
        />
      </div>
    </div>
  );
};

export default DetailedAnalysis;
