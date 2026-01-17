const { OLLAMA_BASE_URL } = process.env;

export const LLM_CONSTANTS = Object.freeze({
  BASE_URL: `${OLLAMA_BASE_URL}/v1`,
  MAX_RETRIES: 3,
  TIMEOUT: 2 * 60 * 1000, // 2 minutes
  PROMPT_TEMPLATE_FILE: 'summarize_pr.njk',
});
