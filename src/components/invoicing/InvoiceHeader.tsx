import { MoreHorizontal } from "lucide-react";

const menuIcon = "https://www.figma.com/api/mcp/asset/bd97da64-fefd-441a-8daf-972aeb6ce2d9";
const overviewIcon = "https://www.figma.com/api/mcp/asset/ed5912b3-934f-407b-94a6-addb42c09200";
const chatIcon = "https://www.figma.com/api/mcp/asset/3a0c711d-e2d9-43f2-bbc6-5f5e2c3ffeb4";
const rejectedIcon = "https://www.figma.com/api/mcp/asset/98886062-32c6-489a-ae23-aa53e19bec25";

const InvoiceHeader = ({ invoiceRejected }: { invoiceRejected?: boolean }) => {
  return (
    <>
      {/* Pane Bar */}
      <div className="flex items-center justify-between px-[20px] py-[12px] shrink-0 relative z-10">
        {/* Left: menu icon */}
        <div className="flex items-center gap-6">
          <button className="flex items-center justify-center rounded-lg hover:bg-secondary transition-colors p-[7px]">
            <img src={menuIcon} alt="Menu" className="size-[14px] object-contain" />
          </button>
        </div>
        {/* Right: actions */}
        <div className="flex items-center gap-1.5">
          <button className="flex items-center gap-1.5 px-[12px] py-[6px] rounded-lg hover:bg-secondary transition-colors">
            <img src={overviewIcon} alt="Overview" className="size-[14px] object-contain" />
            <span style={{ fontFamily: '"72", "72full", Arial, Helvetica, sans-serif', fontSize: 13, fontWeight: 400, lineHeight: '18px', color: '#0b0c0f', whiteSpace: 'nowrap' }}>Overview</span>
          </button>
          <button className="flex items-center justify-center rounded-lg hover:bg-secondary transition-colors p-[7px]">
            <MoreHorizontal size={14} className="text-foreground/70" />
          </button>
          <button className="flex items-center justify-center rounded-lg transition-colors p-[7px]" style={{ backgroundColor: '#e5ecf5' }}>
            <img src={chatIcon} alt="Chat" className="size-[14px] object-contain" />
          </button>
        </div>
      </div>

      {/* Heading */}
      <div className="relative px-6 pt-5 pb-2 shrink-0 z-10">
        <div className="flex items-center gap-3 flex-wrap" style={{ marginTop: 10 }}>
          <h1 style={{ fontFamily: '"72", "72full", Arial, Helvetica, sans-serif', fontSize: 26, fontWeight: 100, lineHeight: '32px', color: '#0b0c0f', margin: 0 }}>
            Price Mismatch - Meridian Frost Ltd
          </h1>
          {invoiceRejected && (
            <span className="inline-flex items-center gap-[6px] px-[8px] py-[4px] rounded-[4px] animate-[fade-in-up_0.4s_ease-out_both]" style={{ backgroundColor: '#f6e6e7' }}>
              <img src={rejectedIcon} alt="" className="size-[12px] shrink-0" />
              <span style={{ fontFamily: '"72", "72full", Arial, Helvetica, sans-serif', fontSize: 13, fontWeight: 400, lineHeight: '16px', color: '#c72f2b', whiteSpace: 'nowrap' }}>Rejected</span>
            </span>
          )}
        </div>
      </div>
    </>
  );
};

export default InvoiceHeader;
