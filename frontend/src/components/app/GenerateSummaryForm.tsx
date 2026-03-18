import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarRangeIcon, Undo2Icon } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { getAvailableQuarters } from "@/lib/utils";

type GenerateSummaryFormProps = {
  availableModels: string[];
};

export function GenerateSummaryForm({
  availableModels = [],
}: GenerateSummaryFormProps) {
  const navigate = useNavigate();
  const quarters = useMemo(() => getAvailableQuarters(), []);

  const [username, setUsername] = useState("");
  const [organization, setOrganization] = useState("");
  const [selectedQuarterIndex, setSelectedQuarterIndex] = useState(
    quarters.length - 1,
  );
  const [useCustomDates, setUseCustomDates] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [aiModel, setAiModel] = useState(
    availableModels.length > 0 ? availableModels[0] : "",
  );

  const isSubmitButtonDisabled = useMemo(() => {
    if (username.length <= 0 || organization.length <= 0 || aiModel.length <= 0)
      return true;

    if (useCustomDates && (startDate.length <= 0 || endDate.length <= 0)) {
      return true;
    }

    return false;
  }, [endDate, startDate, useCustomDates, username, organization, aiModel]);

  const selectedQuarter = quarters[selectedQuarterIndex];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/summary", {
      state: {
        username,
        organization: organization || null,
        startDate: useCustomDates ? startDate : selectedQuarter.startDate,
        endDate: useCustomDates ? endDate : selectedQuarter.endDate,
        model: aiModel,
        useCustomDates,
        selectedQuarter,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Generate Your Summary</h2>
        <p className="text-muted-foreground text-sm">
          Enter your details to create an AI-powered performance review
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="username" className="text-sm font-medium gap-0.5">
          GitHub Username<span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Input
            id="username"
            type="text"
            placeholder="Eg: octocat"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="pr-10"
            required
          />
          {username && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
              ✓
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="organization" className="text-sm font-medium gap-0.5">
          Github Organization<span className="text-red-500">*</span>
        </Label>
        <Input
          id="organization"
          type="text"
          placeholder="Eg: discord"
          value={organization}
          onChange={(e) => setOrganization(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="quarter" className="text-sm font-medium">
          Date Range
        </Label>
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <select
              id="quarter"
              value={selectedQuarterIndex}
              onChange={(e) => setSelectedQuarterIndex(Number(e.target.value))}
              disabled={useCustomDates}
              className="cursor-pointer h-9 w-full rounded-md border border-input bg-transparent pl-3 pr-10 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
            >
              {quarters.map((quarter, index) => (
                <option key={quarter.value} value={index}>
                  {quarter.label}
                </option>
              ))}
            </select>
            <div
              className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${useCustomDates && "text-muted-foreground"}`}
            >
              <svg
                width="12"
                height="8"
                viewBox="0 0 12 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 1L6 6L11 1"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
          {!useCustomDates && (
            <span className="text-sm text-muted-foreground">OR</span>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => setUseCustomDates(!useCustomDates)}
              >
                {useCustomDates ? <Undo2Icon /> : <CalendarRangeIcon />}
              </button>
            </TooltipTrigger>
            <TooltipContent>
              {useCustomDates
                ? "Switch back to quarterly date ranges"
                : "Use custom start and end dates"}
            </TooltipContent>
          </Tooltip>
        </div>

        {useCustomDates && (
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div>
              <Label
                htmlFor="startDate"
                className="text-xs text-muted-foreground mb-1"
              >
                Start Date
              </Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                onClick={(e) => {
                  const input = e.currentTarget as HTMLInputElement;
                  input.showPicker?.();
                }}
                required
                className="cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:invert"
              />
            </div>
            <div>
              <Label
                htmlFor="endDate"
                className="text-xs text-muted-foreground mb-1"
              >
                End Date
              </Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                onClick={(e) => {
                  const input = e.currentTarget as HTMLInputElement;
                  input.showPicker?.();
                }}
                required={useCustomDates}
                className="cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:invert"
              />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="model" className="text-sm font-medium">
          AI Model
        </Label>
        {availableModels.length > 0 ? (
          <div className="relative w-full">
            <select
              id="model"
              value={aiModel}
              onChange={(e) => setAiModel(e.target.value)}
              required
              className="cursor-pointer h-9 w-full rounded-md border border-input bg-transparent pl-3 pr-10 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
            >
              {availableModels.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg
                width="12"
                height="8"
                viewBox="0 0 12 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 1L6 6L11 1"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        ) : (
          <Input
            id="model"
            type="text"
            placeholder="Eg: claude-sonnet-4.5, gpt-4o, gemini-pro"
            value={aiModel}
            onChange={(e) => setAiModel(e.target.value)}
            required
          />
        )}
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90 text-white h-11 text-base font-medium"
          disabled={isSubmitButtonDisabled}
        >
          Generate Summary
        </Button>
        <p className="text-xs text-center font-bold text-muted-foreground mt-3">
          This will analyze your merged pull requests and create a summary
        </p>
      </div>
    </form>
  );
}
