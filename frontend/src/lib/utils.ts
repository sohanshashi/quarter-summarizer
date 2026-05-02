import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import type { Quarter } from "./types";
import { GITHUB_LOGIN_PATTERN, quarterToMonthRangeMapping } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAvailableQuarters(): Quarter[] {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const currentQuarter = Math.ceil(currentMonth / 3);
  const quarters: Quarter[] = [];

  for (let i = 0; i < 4; i++) {
    let quarter = currentQuarter - i;
    let year = currentYear;

    while (quarter <= 0) {
      quarter += 4;
      year -= 1;
    }

    quarters.push(createQuarter(quarter, year));
  }

  // Reverse to show oldest to newest
  return quarters.reverse();
}

function createQuarter(quarter: number, year: number): Quarter {
  const range =
    quarterToMonthRangeMapping[
      quarter as keyof typeof quarterToMonthRangeMapping
    ];

  return {
    label: `Q${quarter} ${year} (${range.label})`,
    value: `q${quarter}-${year}`,
    startDate: `${year}-${range.start}`,
    endDate: `${year}-${range.end}`,
  };
}

export function hasRequestAborted(err: unknown) {
  return !!(err instanceof DOMException && err.name === "AbortError");
}

export function validateGithubUsernameFormat(trimmed: string): string | null {
  if (!GITHUB_LOGIN_PATTERN.test(trimmed)) {
    return "Invalid username format";
  }
  return null;
}

export function validateGithubOrganizationFormat(
  trimmed: string,
): string | null {
  if (!GITHUB_LOGIN_PATTERN.test(trimmed)) {
    return "Invalid organization name format";
  }
  return null;
}
