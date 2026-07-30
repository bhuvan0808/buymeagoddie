/** The public repository this product is built in. */
export const GITHUB_REPO = "bhuvan0808/buymeagoddie";
export const GITHUB_REPO_URL = `https://github.com/${GITHUB_REPO}`;

/**
 * Live star count, revalidated hourly. Returns null when GitHub is
 * unreachable or rate-limited so the UI can degrade gracefully.
 */
export async function getGitHubStars(): Promise<number | null> {
  try {
    const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}`, {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: 3600 },
    });
    if (!response.ok) return null;
    const data = (await response.json()) as { stargazers_count?: number };
    return typeof data.stargazers_count === "number"
      ? data.stargazers_count
      : null;
  } catch {
    return null;
  }
}
