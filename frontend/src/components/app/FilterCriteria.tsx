import { useMemo, useState } from "react";
import { format, formatDate } from "date-fns";
import { CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function FilterCriteria() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [orgName, setOrgName] = useState("");
  const [model, setModel] = useState("");
  const [username, setUsername] = useState("");

  const isDisabled = useMemo(() => {
    return !orgName || !model || !username || !dateRange?.from || !dateRange.to;
  }, [orgName, model, username, dateRange]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const dateRange = formData.get("dateRange")?.toString().split(":");
    if (!dateRange) {
      // handle this with a toast
      return;
    }

    const startDate = dateRange[0];
    const endDate = dateRange[1];

    // TODO: Handle form submission
    console.log("Form submitted:", {
      orgName: formData.get("orgName"),
      model: formData.get("model"),
      username: formData.get("username"),
      dateRange: formData.get("dateRange")?.toString().split(":"),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-7 p-6">
      <h1 className="text-center text-3xl font-bold">Define Search Criteria</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor="org-name">Org Name</Label>
          <Input
            id="org-name"
            name="orgName"
            placeholder="Enter organization name"
            type="text"
            required
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="date-range">Date Range</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dateRange && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} -{" "}
                      {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          {/* Hidden input for validating date range */}
          <Input
            id="date-range"
            name="dateRange"
            type="text"
            required
            value={
              dateRange?.from && dateRange?.to
                ? `${formatDate(dateRange.from, "yyyy-MM-dd")}:${formatDate(
                    dateRange.to,
                    "yyyy-MM-dd"
                  )}`
                : ""
            }
            className="hidden"
            readOnly
            tabIndex={-1}
            aria-hidden="true"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Input
            id="model"
            name="model"
            placeholder="Enter model name"
            type="text"
            required
            value={model}
            onChange={(e) => setModel(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            placeholder="Enter username"
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-center">
        <Button disabled={isDisabled} type="submit" size="lg">
          Search PRs
        </Button>
      </div>
    </form>
  );
}
