import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

interface FormFieldProps {
  label?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  dir?: "rtl" | "ltr";
  className?: string;
}

const FormField = ({
  placeholder,
  value,
  onChange,
  error,
  type = "text",
  dir = "rtl",
  className = "",
  label,
}: FormFieldProps) => {
  return (
    <div className="space-y-1.5 w-full">
      <Label>{label}</Label>
      <Input
        type={type}
        dir={dir}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${error ? "border-destructive" : ""} ${className}`}
      />
      {error && (
        <p className="text-[11px] text-destructive font-medium mr-1 animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField;
