export async function withRetry(
  fn,
  { retries = 4, baseDelayMs = 300, maxDelayMs = 5000 } = {},
) {
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (err) {
      const status = err?.response?.status;
      const retryable = status === 429 || (status >= 500 && status < 600);
      if (!retryable || attempt >= retries) throw err;

      const jitter = Math.random() * 100;
      const delay = Math.min(baseDelayMs * 2 ** attempt + jitter, maxDelayMs);
      await new Promise(r => setTimeout(r, delay));
      attempt++;
    }
  }
}
