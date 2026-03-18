import { useEffect, useState } from "react";

import { usageCardData, ApiEndpoints } from "@/lib/constants";
import { UsageCard } from "./UsageCard";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { GenerateSummaryForm } from "./GenerateSummaryForm";
import type { AvailableModel } from "@/lib/types";

export function Usage() {
  const [availableModels, setAvailableModels] = useState<string[]>([]);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchAvailableModels() {
      try {
        const response = await fetch(ApiEndpoints.availableModels());
        if (!response.ok) return;

        const { data } = await response.json();
        setAvailableModels(
          data.map((modelData: AvailableModel) => modelData.id),
        );
      } catch (err) {
        console.error("Failed to fetch available models:", err);
      }
    }

    fetchAvailableModels();

    return () => controller.abort();
  }, []);

  return (
    <div className="mt-4 mb-6">
      <h1 className="text-[28px] font-bold text-center">How it works</h1>
      <div className="flex justify-center items-center gap-10 flex-wrap mt-6 py-4">
        {usageCardData.map((card, index) => (
          <UsageCard key={card.title} stepNumber={index + 1} {...card} />
        ))}
      </div>
      <div className="mt-8 flex justify-center items-center">
        <Dialog>
          <DialogTrigger asChild>
            <button className="px-[16px] py-[10px] bg-primary rounded-[10px] hover:bg-primary/90">
              Get Started
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-[600px]">
            <GenerateSummaryForm availableModels={availableModels} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
