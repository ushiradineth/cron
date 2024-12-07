import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock, View } from "@/lib/types";

interface SettingPickerProps {
  defaultValue: Clock | View;
  setSetting: (value: string) => void;
  data: {
    value: Clock | View;
    label: string;
  }[];
}

export default function SettingPicker({
  defaultValue,
  setSetting,
  data,
}: SettingPickerProps) {
  return (
    <Select onValueChange={setSetting} value={String(defaultValue)}>
      <SelectTrigger className="shadow-text-tertiary shadow-sm bg-text-tertiary/20 w-fit">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {data.map(({ value, label }) => (
          <SelectItem key={String(value)} value={String(value)}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}