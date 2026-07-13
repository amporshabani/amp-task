import { Input } from "@/shared/ui/input";
import useDebounce from "@/shared/hooks/useDebounce";
import { useEffect, useState } from "react";

interface SearchInputProps {
  onSearchChange: (value: string) => void;
}

const SearchInput = ({ onSearchChange }: SearchInputProps) => {
  const [localValue, setLocalValue] = useState("");
  const debouncedValue = useDebounce(localValue, 500);

  useEffect(() => {
    onSearchChange(debouncedValue);
  }, [debouncedValue, onSearchChange]);

  return (
    <>
      <Input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder="جست‌وجو در تسک ها..."
        dir="rtl"
      />
    </>
  );
};

export default SearchInput;
