
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";

interface CompanyOption {
  label: string;
  value: string;
  subTitle: string;
}

interface CompanyCardSelectProps {
  options: CompanyOption[];
  onSelect: (option: CompanyOption) => void;
}

const CompanyCardSelect = ({ options, onSelect }: CompanyCardSelectProps) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleSelect = (option: CompanyOption) => {
    setSelectedOption(option.value);
    onSelect(option);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {options.map((option) => (
        <Card
          key={option.value}
          className={`cursor-pointer transition-all hover:border-primary ${selectedOption === option.value ? "border-primary bg-primary/5" : ""
            }`}
          onClick={() => handleSelect(option)}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-lg">{option.label}</h3>
                <p className="text-sm text-muted-foreground">{option.subTitle}</p>
              </div>
              {selectedOption === option.value && (
                <Check className="h-5 w-5 text-primary" />
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CompanyCardSelect;
