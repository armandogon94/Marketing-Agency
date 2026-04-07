/**
 * Research Sources — Manage source documents for NotebookLM integration.
 *
 * Sources are tracked per campaign and can include URLs, PDFs, documents.
 * The NotebookLM skill handles browser automation (Patchright).
 * This module manages the metadata layer.
 */

import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";

export interface ResearchSource {
  id: string;
  type: "url" | "pdf" | "document" | "video";
  path: string;
  title: string;
  addedAt: string;
  tags: string[];
  notebookId?: string;
}

export interface ResearchLibrary {
  sources: ResearchSource[];
  notebooks: { id: string; name: string; sources: string[] }[];
}

const DEFAULT_LIBRARY: ResearchLibrary = {
  sources: [],
  notebooks: [],
};

/**
 * Load the research library for a campaign (or global).
 */
export async function loadLibrary(
  campaignDir?: string,
): Promise<ResearchLibrary> {
  const dir = campaignDir ?? ".";
  const filePath = join(dir, "research-library.json");
  try {
    const raw = await readFile(filePath, "utf-8");
    return JSON.parse(raw) as ResearchLibrary;
  } catch {
    return { ...DEFAULT_LIBRARY };
  }
}

/**
 * Save the research library.
 */
export async function saveLibrary(
  library: ResearchLibrary,
  campaignDir?: string,
): Promise<void> {
  const dir = campaignDir ?? ".";
  await mkdir(dir, { recursive: true });
  const filePath = join(dir, "research-library.json");
  await writeFile(filePath, JSON.stringify(library, null, 2), "utf-8");
}

/**
 * Add a source to the library.
 */
export async function addSource(
  source: Omit<ResearchSource, "id" | "addedAt">,
  campaignDir?: string,
): Promise<ResearchSource> {
  const library = await loadLibrary(campaignDir);

  const newSource: ResearchSource = {
    ...source,
    id: `src_${Date.now()}`,
    addedAt: new Date().toISOString(),
  };

  library.sources.push(newSource);
  await saveLibrary(library, campaignDir);

  return newSource;
}

/**
 * List sources, optionally filtered by tag.
 */
export async function listSources(
  campaignDir?: string,
  tag?: string,
): Promise<ResearchSource[]> {
  const library = await loadLibrary(campaignDir);
  if (tag) {
    return library.sources.filter((s) => s.tags.includes(tag));
  }
  return library.sources;
}
