import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SlidersHorizontal } from "lucide-react";
import { FilterBarProps } from "../types";

const FilterBar = ({ onSortChange, onCategoryChange, onStatusChange, onValuationChange }: FilterBarProps) => {
  const [activeSort, setActiveSort] = useState("popular");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSortChange = (sort: string) => {
    setActiveSort(sort);
    onSortChange(sort);
  };

  return (
    <div className="space-y-4">
      {/* Quick Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {["popular", "recent", "hot", "trending"].map((sort) => (
            <Button
              key={sort}
              variant={activeSort === sort ? "default" : "outline"}
              size="sm"
              onClick={() => handleSortChange(sort)}
              className="capitalize"
            >
              {sort}
            </Button>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Advanced Filters
        </Button>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Category</label>
            <Select onValueChange={onCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="ai-automation">AI & Automation</SelectItem>
                <SelectItem value="fintech">FinTech</SelectItem>
                <SelectItem value="healthtech">HealthTech</SelectItem>
                <SelectItem value="legaltech">LegalTech</SelectItem>
                <SelectItem value="climatetech">ClimateTech</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
            <Select onValueChange={onStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="hot">Hot</SelectItem>
                <SelectItem value="trending">Trending</SelectItem>
                <SelectItem value="rising">Rising</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Valuation Range</label>
            <Select onValueChange={onValuationChange}>
              <SelectTrigger>
                <SelectValue placeholder="Any Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Range</SelectItem>
                <SelectItem value="0-500k">$0 - $500K</SelectItem>
                <SelectItem value="500k-1m">$500K - $1M</SelectItem>
                <SelectItem value="1m-5m">$1M - $5M</SelectItem>
                <SelectItem value="5m+">$5M+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
