import { CheckCircle2, Pencil, Scale, UserCircle, Trash2 } from "lucide-react";

const SummaryCard = () => {
  return (
    <div className="bg-card rounded-md border border-border/50 p-4 md:p-5 mx-4 md:mx-6 mt-6">
      <div className="mb-4">
        <h2 className="text-sap-base font-semibold text-foreground">Summary</h2>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="min-w-0">
          <p className="text-sap-sm text-muted-foreground font-medium mb-1">Gross Amount</p>
          <p className="text-sap-lg font-medium text-foreground">$83,240.00</p>
        </div>
        <div className="min-w-0">
          <p className="text-sap-sm text-muted-foreground font-medium mb-1">Due Amount</p>
          <p className="text-sap-lg font-medium text-foreground">$83,240.00</p>
        </div>
        <div className="min-w-0">
          <p className="text-sap-sm text-muted-foreground font-medium mb-1">Due Date</p>
          <p className="text-sap-lg font-medium text-foreground">Dec 29, 2026</p>
        </div>
        <div className="min-w-0">
          <p className="text-sap-sm text-muted-foreground font-medium mb-1">Invoice Lifecycle</p>
          <div className="flex items-center mt-2 flex-wrap gap-y-1">
            <span className="w-7 h-7 rounded-full bg-success flex items-center justify-center shrink-0">
              <CheckCircle2 size={14} className="text-success-foreground" />
            </span>
            <span className="w-3 h-px bg-muted-foreground/30" />
            <span className="w-7 h-7 rounded-full bg-success flex items-center justify-center shrink-0">
              <Pencil size={14} className="text-success-foreground" />
            </span>
            <span className="w-3 h-px bg-muted-foreground/30" />
            <span className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0">
              <Scale size={14} className="text-primary-foreground" />
            </span>
            <span className="w-3 h-px bg-muted-foreground/30" />
            <span className="w-7 h-7 rounded-full border border-muted-foreground/30 flex items-center justify-center shrink-0">
              <UserCircle size={14} className="text-muted-foreground" />
            </span>
            <span className="w-3 h-px bg-muted-foreground/30" />
            <span className="w-7 h-7 rounded-full border border-muted-foreground/30 flex items-center justify-center shrink-0">
              <Trash2 size={14} className="text-muted-foreground" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
