import type { SummaryState } from "@/lib/types";
import { Badge } from "@/components/ui/badge";


export function SummaryHeader({ organization, username, startDate, endDate, useCustomDates, selectedQuarter }: SummaryState) {
  const dateLabel = useCustomDates ? `${startDate} - ${endDate}` : selectedQuarter.label

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold mb-4">Your Performance Summary</h1>
      <div className="flex flex-wrap items-center gap-3">
        <Badge variant='outline' className="text-sm px-4 py-2">
          @{username}
        </Badge>
        <Badge variant='outline' className="text-sm px-4 py-2">
          @{organization}
        </Badge>
        <Badge variant='outline' className="text-sm px-4 py-2">
          {dateLabel}
        </Badge>
      </div>
    </div>
  )
}