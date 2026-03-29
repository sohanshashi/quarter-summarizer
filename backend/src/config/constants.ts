export const LLM_CONSTANTS = Object.freeze({
  MAX_RETRIES: 3,
  TIMEOUT: 2 * 60 * 1000, // 2 minutes
  CLASSIFICATION_SYSTEM_TEMPLATE: 'system/classify_prs.njk',
  CLASSIFICATION_USER_TEMPLATE: 'user/classify_prs.njk',
  SUMMARIZATION_SYSTEM_TEMPLATE: 'system/summarize_prs.njk',
  SUMMARIZATION_USER_TEMPLATE: 'user/summarize_prs.njk',
  OLLAMA_BASE_URL: 'http://host.docker.internal:11434/v1',
  OLLAMA_API_KEY: 'ollama',
});
