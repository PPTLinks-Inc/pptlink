import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ReactElement } from "react";
import { IconBaseProps, IconType } from "react-icons/lib";
import { cn } from "@/lib/utils";

interface SplitButtonProps {
  primaryLabel: string;
  options: string[];
  onPrimaryClick: () => void;
  onOptionClick: (option: string) => void;
  icon?: ReactElement<IconBaseProps, IconType>; // Optional icon component
  backgroundColor?: string; // Optional background color
}

export default function Component({
  primaryLabel,
  options,
  onPrimaryClick,
  onOptionClick,
  icon: Icon, // Destructure as Icon (capitalized) for JSX usage
  backgroundColor
}: SplitButtonProps) {
  return (
    <div className="flex">
      <Button
        className={cn("rounded-r-none px-4 shadow-none", backgroundColor)}
        onClick={onPrimaryClick}
      >
        {Icon}
        {primaryLabel}
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className={cn("rounded-l-none px-2 shadow-none", backgroundColor)}
            aria-label="More options"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {options.map((option) => (
            <DropdownMenuItem
              key={option}
              onClick={() => onOptionClick(option)}
            >
              {option}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
