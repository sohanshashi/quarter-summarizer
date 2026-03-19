import { useRef, useState } from "react";
import { formatDistanceStrict } from "date-fns";
import {
  ExternalLinkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { PullRequestApiData } from "@/lib/types";

const ROWS_PER_PAGE = 10;

function formatMergeTime(createdAt: Date, mergedAt: Date | null): string {
  if (!mergedAt) return "Not merged"; // won't happen for our case but adding fallback just in case
  return formatDistanceStrict(createdAt, mergedAt);
}

type PullRequestsTableProps = {
  pullRequests: PullRequestApiData[];
};

export function PullRequestsTable({ pullRequests }: PullRequestsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const paginationRef = useRef<HTMLDivElement>(null);

  const totalPages = Math.ceil(pullRequests.length / ROWS_PER_PAGE);

  const scrollToPagination = () => {
    /**
     * React's update and browser paint happen in the same frame.
     * A single requestAnimationFrame runs before the next paint, so it can run before React has committed the new DOM.
     * Hence calling one within another to ensure scrolling happens when react has finished committing to the DOM.
     */
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        paginationRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      });
    });
  };

  const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
  const paginatedPrs = pullRequests.slice(
    startIndex,
    startIndex + ROWS_PER_PAGE,
  );

  return (
    <div className="mt-6 space-y-4">
      <div className="rounded-md border border-border">
        <Table className="table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead className="w-[60%] pr-8 ">Title</TableHead>
              <TableHead className="w-28">Time to Ship</TableHead>
              <TableHead className="w-24 text-right">Link</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedPrs.map((pr, index) => (
              <TableRow key={pr.url}>
                <TableCell className="font-medium">
                  {startIndex + index + 1}
                </TableCell>
                <TableCell className="truncate pr-8" title={pr.title}>
                  {pr.title}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatMergeTime(pr.createdAt, pr.mergedAt)}
                </TableCell>
                <TableCell className="text-right">
                  <a
                    href={pr.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline"
                  >
                    View PR
                    <ExternalLinkIcon className="size-3.5" />
                  </a>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div ref={paginationRef} className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {startIndex + 1}-
            {Math.min(startIndex + ROWS_PER_PAGE, pullRequests.length)} of{" "}
            {pullRequests.length} PRs
          </p>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => {
                setCurrentPage((p) => Math.max(1, p - 1));
                scrollToPagination();
              }}
              disabled={currentPage === 1}
            >
              <ChevronLeftIcon className="size-4" />
              Previous
            </Button>
            <span className="text-sm font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              size="sm"
              onClick={() => {
                setCurrentPage((p) => Math.min(totalPages, p + 1));
                scrollToPagination();
              }}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRightIcon className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
