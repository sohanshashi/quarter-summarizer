import type { UsageCardData } from "./types";

export const ApiEndpoints = Object.freeze({
  generateSummary: (query: string) => `/api/summary?${query}`,
});

export const editorTheme = {
  heading: {
    h1: "text-3xl font-bold mt-6 mb-4 text-gray-100",
    h2: "text-2xl font-bold mt-5 mb-3 text-gray-100",
    h3: "text-xl font-bold mt-4 mb-2 text-gray-100",
    h4: "text-lg font-bold mt-3 mb-2 text-gray-100",
  },
  paragraph: "mb-4 text-gray-200",
  list: {
    nested: {
      listitem: "ml-4",
    },
    ol: "list-decimal list-inside mb-4 text-gray-200",
    ul: "list-disc list-inside mb-4 text-gray-200",
  },
  quote: "border-l-4 border-gray-500 pl-4 italic my-4 text-gray-300",
  code: "bg-gray-800 px-1 py-0.5 rounded font-mono text-sm text-gray-100",
  codeHighlight: {
    atrule: "text-purple-600 dark:text-purple-400",
    attr: "text-blue-600 dark:text-blue-400",
    boolean: "text-red-600 dark:text-red-400",
    builtin: "text-yellow-600 dark:text-yellow-400",
    cdata: "text-gray-600 dark:text-gray-400",
    char: "text-green-600 dark:text-green-400",
    class: "text-blue-600 dark:text-blue-400",
    comment: "text-gray-500 dark:text-gray-500 italic",
    constant: "text-red-600 dark:text-red-400",
    deleted: "text-red-600 dark:text-red-400",
    doctype: "text-gray-600 dark:text-gray-400",
    entity: "text-orange-600 dark:text-orange-400",
    function: "text-blue-600 dark:text-blue-400",
    important: "text-red-600 dark:text-red-400",
    inserted: "text-green-600 dark:text-green-400",
    keyword: "text-purple-600 dark:text-purple-400",
    namespace: "text-blue-600 dark:text-blue-400",
    number: "text-red-600 dark:text-red-400",
    operator: "text-gray-600 dark:text-gray-400",
    prolog: "text-gray-600 dark:text-gray-400",
    property: "text-yellow-600 dark:text-yellow-400",
    punctuation: "text-gray-600 dark:text-gray-400",
    regex: "text-green-600 dark:text-green-400",
    selector: "text-green-600 dark:text-green-400",
    string: "text-green-600 dark:text-green-400",
    symbol: "text-red-600 dark:text-red-400",
    tag: "text-red-600 dark:text-red-400",
    url: "text-blue-600 dark:text-blue-400",
    variable: "text-orange-600 dark:text-orange-400",
  },
  link: "text-blue-400 underline hover:text-blue-300",
  text: {
    bold: "font-bold",
    italic: "italic",
    underline: "underline",
    strikethrough: "line-through",
    code: "bg-gray-800 px-1 py-0.5 rounded font-mono text-sm text-gray-100",
  },
};

export const usageCardData: UsageCardData[] = [
  {
    title: "Enter Username",
    description: "Your GitHub Username",
    iconUrl: "/icons/person.svg",
  },
  {
    title: "Organization Name",
    description: "Your company or organization",
    iconUrl: "/icons/organization.svg",
  },
  {
    title: "Select Date Range",
    description: "Quarter or custom date range",
    iconUrl: "/icons/date-range.svg",
  },
  {
    title: "Choose Model",
    description: "Select AI model for summary",
    iconUrl: "/icons/ai-pen.svg",
  },
];

export const quarterToMonthRangeMapping = Object.freeze({
  1: { start: "01-01", end: "03-31", label: "Jan - Mar" },
  2: { start: "04-01", end: "06-30", label: "Apr - Jun" },
  3: { start: "07-01", end: "09-30", label: "Jul - Sep" },
  4: { start: "10-01", end: "12-31", label: "Oct - Dec" },
});
