"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

import { getAllFilterOptionsQuery } from "@/lib/queries";
import { fetchSanityQuery } from "@/lib/fetchSanity";

interface FiltersProps {
  onApplyFilters: (filters: FiltersState) => void;
  pendingFilters: FiltersState;
  setPendingFilters: React.Dispatch<React.SetStateAction<FiltersState>>;
  resultsCount: number;
  onClose?: () => void;
}

export type FiltersState = {
  make: string[];
  model: string[];
  year: string[];
  fuelType: string[];
  transmission: string[];
  bodyType: string[];
};

type FilterOption = {
  make: string;
  model: string;
  year?: string | number;
};

const Filters = ({
  onApplyFilters,
  resultsCount,
  pendingFilters,
  setPendingFilters,
  onClose,
}: FiltersProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isApplying, setIsApplying] = useState(false);

  const [makes, setMakes] = useState<string[]>([]);
  const [modelOptions, setModelOptions] = useState<FilterOption[]>([]);
  const [, setYears] = useState<string[]>([]);
  const [fuelTypes, setFuelTypes] = useState<string[]>([]);
  const [transmissions, setTransmissions] = useState<string[]>([]);
  const [bodyTypes, setBodyTypes] = useState<string[]>([]);

  // Parse initial filters from URL
  useEffect(() => {
    const parseFilters = (): FiltersState => {
      const filters: FiltersState = {
        make: [],
        model: [],
        year: [],
        fuelType: [],
        transmission: [],
        bodyType: [],
      };

      for (const key of Object.keys(filters) as (keyof FiltersState)[]) {
        const values = searchParams.getAll(key);
        if (values.length) {
          filters[key] = values;
        }
      }

      return filters;
    };

    const filtersFromURL = parseFilters();
    setPendingFilters(filtersFromURL);
    onApplyFilters(filtersFromURL);
  }, []);

  // Fetch all filter options
  useEffect(() => {
    async function fetchOptions() {
      const data = (await fetchSanityQuery(getAllFilterOptionsQuery)) as {
        makes: string[];
        models: { make: string; model: string; year: number }[];
        years: number[];
        fuelTypes: string[];
        transmissions: string[];
        bodyTypes: string[];
      };

      // Remove duplicates and sort
      setMakes([...new Set(data.makes)].sort());
      setModelOptions(data.models.filter((entry) => entry.make && entry.model));
      setYears(
        Array.from(new Set(data.years))
          .map(String)
          .sort((a, b) => Number(b) - Number(a))
      );
      setFuelTypes([...new Set(data.fuelTypes)].sort());
      setTransmissions([...new Set(data.transmissions)].sort());
      setBodyTypes([...new Set(data.bodyTypes)].sort());
    }

    fetchOptions();
  }, []);

  // Get filtered options based on current selections
  const getFilteredOptions = () => {
    const filteredModels =
      pendingFilters.make.length > 0
        ? Array.from(
            new Set(
              modelOptions
                .filter((entry) => pendingFilters.make.includes(entry.make))
                .map((entry) => entry.model)
            )
          ).sort()
        : Array.from(new Set(modelOptions.map((entry) => entry.model))).sort();

    const filteredYears = Array.from(
      new Set(
        modelOptions
          .filter((entry) => {
            const makeMatch =
              pendingFilters.make.length === 0 ||
              pendingFilters.make.includes(entry.make);
            const modelMatch =
              pendingFilters.model.length === 0 ||
              pendingFilters.model.includes(entry.model);
            return makeMatch && modelMatch;
          })
          .map((entry) => entry.year)
      )
    )
      .map(String)
      .sort((a, b) => Number(b) - Number(a));

    return { filteredModels, filteredYears };
  };

  const { filteredModels, filteredYears } = getFilteredOptions();

  const updateURL = (filters: FiltersState) => {
    const params = new URLSearchParams();
    for (const key of Object.keys(filters) as (keyof FiltersState)[]) {
      filters[key].forEach((val) => params.append(key, val));
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const handleFilterChange = (category: keyof FiltersState, value: string) => {
    setPendingFilters((prev) => {
      const newFilters = { ...prev };

      // Handle make selection
      if (category === "make") {
        newFilters.make = [value];
        // Reset model and year when make changes
        newFilters.model = [];
        newFilters.year = [];
      }
      // Handle model selection
      else if (category === "model") {
        newFilters.model = [value];
        // Reset year when model changes
        newFilters.year = [];
      }
      // Handle year selection
      else if (category === "year") {
        newFilters.year = value === "all" ? [] : [value];
      }
      // Handle other filters
      else {
        newFilters[category] = [value];
      }

      return newFilters;
    });
  };

  const removeFilter = (category: keyof FiltersState) => {
    setPendingFilters((prev) => {
      const newFilters = { ...prev };
      newFilters[category] = [];

      // If removing make, also clear model and year
      if (category === "make") {
        newFilters.model = [];
        newFilters.year = [];
      }
      // If removing model, also clear year
      else if (category === "model") {
        newFilters.year = [];
      }

      return newFilters;
    });
  };

  const handleResetFilters = () => {
    const reset: FiltersState = {
      make: [],
      model: [],
      year: [],
      fuelType: [],
      transmission: [],
      bodyType: [],
    };
    setPendingFilters(reset);
    updateURL(reset);
    onApplyFilters(reset);
  };

  const handleApplyFilters = async () => {
    if (isApplying) return;

    setIsApplying(true);
    try {
      // First update the URL
      updateURL(pendingFilters);

      // Add a minimum loading time to ensure the spinner is visible
      const startTime = Date.now();

      // Wait for the data to be fully updated
      await onApplyFilters(pendingFilters);

      // Ensure minimum loading time of 500ms
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < 500) {
        await new Promise((resolve) => setTimeout(resolve, 500 - elapsedTime));
      }

      // Only close after everything is complete
      onClose?.();
    } finally {
      setIsApplying(false);
    }
  };

  const anyFilterSelected = Object.values(pendingFilters).some(
    (arr) => arr.length > 0
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Filters</h2>
        <span className="text-sm text-muted-foreground">
          Results: {resultsCount}
        </span>
      </div>

      <div className="space-y-4">
        {/* Vehicle Details Section */}
        <div className="space-y-4">
          <h3 className="font-medium text-sm text-muted-foreground">
            Vehicle Details
          </h3>
          <div className="space-y-3">
            <Select
              value={pendingFilters.make[0] || ""}
              onValueChange={(value) => handleFilterChange("make", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Make" />
              </SelectTrigger>
              <SelectContent>
                {makes.map((make) => (
                  <SelectItem key={make} value={make}>
                    {make}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {pendingFilters.make.length > 0 && (
              <Select
                value={pendingFilters.model[0] || ""}
                onValueChange={(value) => handleFilterChange("model", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Model" />
                </SelectTrigger>
                <SelectContent>
                  {filteredModels.map((model) => (
                    <SelectItem key={model} value={model}>
                      {model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {pendingFilters.model.length > 0 && (
              <Select
                value={
                  pendingFilters.year.length === 0
                    ? "all"
                    : pendingFilters.year[0]
                }
                onValueChange={(value) => handleFilterChange("year", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {filteredYears.map((year) => (
                    <SelectItem key={year} value={String(year)}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        {/* Specifications Section */}
        <div className="space-y-4">
          <h3 className="font-medium text-sm text-muted-foreground">
            Specifications
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <Select
              value={pendingFilters.fuelType[0] || ""}
              onValueChange={(value) => handleFilterChange("fuelType", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Fuel Type" />
              </SelectTrigger>
              <SelectContent>
                {fuelTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={pendingFilters.transmission[0] || ""}
              onValueChange={(value) =>
                handleFilterChange("transmission", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Transmission" />
              </SelectTrigger>
              <SelectContent>
                {transmissions.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={pendingFilters.bodyType[0] || ""}
              onValueChange={(value) => handleFilterChange("bodyType", value)}
            >
              <SelectTrigger className="col-span-2">
                <SelectValue placeholder="Body Type" />
              </SelectTrigger>
              <SelectContent>
                {bodyTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Active Filters */}
      {anyFilterSelected && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(pendingFilters).map(([category, values]) =>
            values.map((value) => (
              <Badge
                key={`${category}-${value}`}
                variant="secondary"
                className="capitalize flex items-center space-x-1"
              >
                <span>{value}</span>
                <button
                  type="button"
                  onClick={() => removeFilter(category as keyof FiltersState)}
                  aria-label={`Remove filter ${value} from ${category}`}
                  className="ml-1 text-muted-foreground hover:text-destructive focus:outline-none focus:ring-2 focus:ring-destructive rounded"
                >
                  <X size={14} />
                </button>
              </Badge>
            ))
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          className="w-full"
          onClick={handleApplyFilters}
          disabled={isApplying}
        >
          {isApplying ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : resultsCount > 1 ? (
            `Apply Filters (${resultsCount} results)`
          ) : (
            `Apply Filters (${resultsCount} result)`
          )}
        </Button>
        <Button
          className="w-full"
          variant="outline"
          onClick={handleResetFilters}
          disabled={!anyFilterSelected || isApplying}
        >
          Reset Filters
        </Button>
      </div>
    </div>
  );
};

export default Filters;
