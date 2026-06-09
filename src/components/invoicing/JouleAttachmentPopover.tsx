import { ChangeEvent, useRef, useState } from "react";
import { Code2, FlaskConical, Paperclip, Plus, Search } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SpacesIcon } from "@/components/invoicing/IconSidebar";

type JouleAttachmentPopoverProps = {
  onFileSelect: (file: File) => void;
  buttonClassName?: string;
  iconSize?: number;
};

const menuItemClassName = "flex w-full items-center gap-3 px-4 py-3 text-left text-sap-sm text-foreground transition-colors hover:bg-muted/50";

const JouleAttachmentPopover = ({
  onFileSelect,
  buttonClassName = "text-muted-foreground transition-colors hover:text-foreground",
  iconSize = 18,
}: JouleAttachmentPopoverProps) => {
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    onFileSelect(file);
    setOpen(false);
    event.target.value = "";
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.png,.jpg,.jpeg,.gif,.webp"
        className="hidden"
        onChange={handleFileChange}
      />

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button type="button" className={buttonClassName} aria-label="Open attachment menu">
            <Plus size={iconSize} />
          </button>
        </PopoverTrigger>

        <PopoverContent side="bottom" align="start" sideOffset={8} className="w-56 rounded-2xl border border-border bg-card p-0 pb-1 shadow-lg">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`${menuItemClassName} rounded-t-2xl`}
          >
            <Paperclip size={16} className="text-muted-foreground" />
            Upload files and images
          </button>
          <div className="mx-3 h-px bg-border" />
          <button type="button" className={menuItemClassName}>
            <Search size={16} className="text-muted-foreground" />
            Search
          </button>
          <button type="button" className={menuItemClassName}>
            <FlaskConical size={16} className="text-muted-foreground" />
            Deep Research
          </button>
          <button type="button" className={menuItemClassName}>
            <Code2 size={16} className="text-muted-foreground" />
            Develop
          </button>
          <button type="button" className={`${menuItemClassName} rounded-b-2xl`}>
            <span className="opacity-[0.62]"><SpacesIcon size={15} /></span>
            Create Space
          </button>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default JouleAttachmentPopover;
