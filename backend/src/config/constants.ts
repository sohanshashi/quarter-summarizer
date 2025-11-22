export const GITHUB_CONSTANTS = Object.freeze({
  API_BASE_URL: 'https://api.github.com',
  API_REQUEST_TIMEOUT: 10000, // 10 seconds,
  API_VERSION: '2022-11-28',
});

export const API_URLS = Object.freeze({
  getIssues: (query: string) => `/search/issues?q=${query}`,
});

export const LLM_CONSTANTS = Object.freeze({
  BASE_URL: 'http://localhost:11434/v1',
  MAX_RETRIES: 3,
  TIMEOUT: 2 * 60 * 1000, // 2 minutes
  PROMPT_TEMPLATE_FILE: 'summarize_pr.njk',
});
