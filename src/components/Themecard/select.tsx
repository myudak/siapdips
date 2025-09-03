import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, Check } from "lucide-react";

type SelectContextType<T extends string = string> = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  value: T;
  setValue: React.Dispatch<React.SetStateAction<T>>;
  selectedLabel: string;
  setSelectedLabel: React.Dispatch<React.SetStateAction<string>>;
  onValueChange?: React.Dispatch<React.SetStateAction<T>>;
  disabled?: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SelectContext = createContext<SelectContextType<any> | undefined>(
  undefined
);

function useSelectContext<T extends string = string>() {
  const context = useContext(SelectContext) as SelectContextType<T> | undefined;
  if (!context) {
    throw new Error("Select components must be used within a Select provider");
  }
  return context;
}

type SelectProps<T extends string = string> = {
  children: React.ReactNode;
  defaultValue?: T;
  value?: T;
  onChange?: React.Dispatch<React.SetStateAction<T>>;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
};

const Select = <T extends string = string>({
  children,
  defaultValue = "" as T,
  value: propValue,
  onChange,
  className,
  disabled = false,
  placeholder = "Select an option",
}: SelectProps<T>) => {
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<T>(
    propValue ?? defaultValue
  );
  const [selectedLabel, setSelectedLabel] = useState(placeholder);

  // Use prop value if provided, otherwise use internal state
  const value = propValue !== undefined ? propValue : internalValue;

  // Update internal value when prop value changes
  useEffect(() => {
    if (propValue !== undefined) {
      setInternalValue(propValue);

      // Find the corresponding SelectItem to get its label
      // This will be handled by the SelectItem components
    }
  }, [propValue]);

  // Initialize the selected label based on the initial value
  useEffect(() => {
    // If we have a value but no label set yet, try to find a matching child
    if (value && value !== "custom" && selectedLabel === placeholder) {
      // Set a default capitalized label based on the value
      setSelectedLabel(value.charAt(0).toUpperCase() + value.slice(1));
    }
  }, [value, selectedLabel]);

  const setValue = (newValue: React.SetStateAction<T>) => {
    const resolvedValue =
      typeof newValue === "function"
        ? (newValue as (prev: T) => T)(value)
        : newValue;
    setInternalValue(resolvedValue);
    if (onChange && resolvedValue) {
      onChange(resolvedValue);
    }
  };

  return (
    <SelectContext.Provider
      value={{
        open,
        setOpen,
        value,
        setValue,
        selectedLabel,
        setSelectedLabel,
        onValueChange: onChange,
        disabled,
      }}
    >
      <div className={cn("relative w-full", className)}>{children}</div>
    </SelectContext.Provider>
  );
};

type SelectTriggerProps = {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  title?: string;
};

const SelectTrigger = ({
  children,
  className,
  disabled = false,
  title,
}: SelectTriggerProps) => {
  const {
    open,
    setOpen,
    selectedLabel,
    disabled: contextDisabled,
  } = useSelectContext();
  const isDisabled = disabled || contextDisabled;
  const displayValue = typeof children === "string" ? children : selectedLabel;

  return (
    <button
      type="button"
      onClick={() => !isDisabled && setOpen(!open)}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "transition-colors hover:bg-muted/50",
        className
      )}
      disabled={isDisabled}
      aria-expanded={open}
      aria-haspopup="listbox"
      title={title}
    >
      <span className="flex-1 text-left truncate">{displayValue}</span>
      <ChevronDown
        className={cn(
          "h-4 w-4 opacity-50 transition-transform duration-200",
          open && "rotate-180"
        )}
      />
    </button>
  );
};

type SelectContentProps = {
  children: React.ReactNode;
  className?: string;
};

const SelectContent = ({ children, className }: SelectContentProps) => {
  const { open, setOpen } = useSelectContext();
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, setOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, setOpen]);

  if (!open) return null;

  return (
    <div
      ref={ref}
      className={cn(
        "absolute z-50 min-w-[8rem] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md",
        "animate-in fade-in-0 zoom-in-95",
        "mt-1 max-h-60 overflow-y-auto",
        className
      )}
      role="listbox"
    >
      <div className="p-1">{children}</div>
    </div>
  );
};

type SelectItemProps = {
  children: React.ReactNode;
  value: string;
  className?: string;
  onSelect?: (value: string) => void;
  disabled?: boolean;
};

const SelectItem = ({
  children,
  value,
  className,
  onSelect,
  disabled = false,
}: SelectItemProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { setValue, setSelectedLabel, setOpen, onValueChange } =
    useSelectContext();

  const handleSelect = () => {
    if (disabled) return;
    setValue(value);
    setSelectedLabel(children as string);
    setOpen(false);
    if (onSelect) {
      onSelect(value);
    }
  };

  return (
    <div
      role="option"
      onClick={handleSelect}
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none",
        "hover:bg-accent hover:text-accent-foreground",
        "focus:bg-accent focus:text-accent-foreground",
        disabled && "pointer-events-none opacity-50",
        className
      )}
      aria-disabled={disabled}
    >
      <span className="flex-1 truncate">{children}</span>
      <Check className="h-4 w-4 opacity-0 group-data-[state=checked]:opacity-100" />
    </div>
  );
};

export { SelectItem as MySelectItem };
export { SelectContent as MySelectContent };
export { SelectTrigger as MySelectTrigger };
export { Select as MySelect };
export default Select;
