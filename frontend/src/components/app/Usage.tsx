import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { usageCardData, ApiEndpoints } from "@/lib/constants";
import { UsageCard } from "./UsageCard";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { GenerateSummaryForm } from "./GenerateSummaryForm";
import type { AvailableModel } from "@/lib/types";
import { hasRequestAborted } from "@/lib/utils";

export function Usage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const locationState = location.state as {
    openGetStartedDialog?: boolean;
  } | null;
  const [dialogOpen, setDialogOpen] = useState(
    !!locationState?.openGetStartedDialog,
  );

  useEffect(() => {
    if (locationState?.openGetStartedDialog) {
      navigate("/", { replace: true });
    }
  }, [locationState?.openGetStartedDialog, navigate]);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchAvailableModels() {
      try {
        const response = await fetch(ApiEndpoints.availableModels(), {
          signal: controller.signal,
        });
        if (controller.signal.aborted || !response.ok) return;

        const { data } = await response.json();
        setAvailableModels(
          data.map((modelData: AvailableModel) => modelData.id),
        );
      } catch (err) {
        if (hasRequestAborted(err)) return;
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
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
