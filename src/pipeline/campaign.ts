/**
 * Campaign Orchestration CLI — Create, plan, produce, and export campaigns.
 *
 * Usage:
 *   npm run campaign -- create --name "Q2-Launch" --brand default
 *   npm run campaign -- plan --name "Q2-Launch"
 *   npm run campaign -- produce --name "Q2-Launch"
 *   npm run campaign -- export --name "Q2-Launch"
 */

import { Command } from "commander";
import { mkdir, writeFile, readFile } from "fs/promises";
import { join } from "path";

const CAMPAIGNS_DIR = "campaigns";

interface CampaignBrief {
  name: string;
  brand: string;
  createdAt: string;
  goals: string[];
  targetAudience: string;
  platforms: string[];
  timeline: {
    start: string;
    end: string;
  };
  contentTypes: string[];
  notes: string;
}

interface ContentCalendarItem {
  date: string;
  platform: string;
  type: "video" | "image" | "post" | "email" | "avatar-video";
  title: string;
  description: string;
  status: "planned" | "in-progress" | "produced" | "exported";
  template?: string;
  assets?: string[];
}

/**
 * Create a new campaign folder with brief scaffold.
 */
async function createCampaign(name: string, brand: string): Promise<void> {
  const campaignDir = join(CAMPAIGNS_DIR, name);

  // Create directory structure
  await mkdir(join(campaignDir, "assets", "images"), { recursive: true });
  await mkdir(join(campaignDir, "assets", "videos"), { recursive: true });
  await mkdir(join(campaignDir, "assets", "avatar-videos"), { recursive: true });
  await mkdir(join(campaignDir, "assets", "copy"), { recursive: true });
  await mkdir(join(campaignDir, "exports", "youtube"), { recursive: true });
  await mkdir(join(campaignDir, "exports", "tiktok"), { recursive: true });
  await mkdir(join(campaignDir, "exports", "instagram"), { recursive: true });
  await mkdir(join(campaignDir, "exports", "linkedin"), { recursive: true });

  // Create brief scaffold
  const brief: CampaignBrief = {
    name,
    brand,
    createdAt: new Date().toISOString(),
    goals: ["Increase brand awareness", "Drive conversions"],
    targetAudience: "Describe your target audience here",
    platforms: ["youtube", "tiktok", "instagram", "linkedin"],
    timeline: {
      start: new Date().toISOString().split("T")[0],
      end: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
    },
    contentTypes: ["video", "image", "post", "email"],
    notes: "Add campaign-specific notes here",
  };

  await writeFile(
    join(campaignDir, "brief.json"),
    JSON.stringify(brief, null, 2),
    "utf-8",
  );

  // Create empty content calendar
  const calendar: ContentCalendarItem[] = [];
  await writeFile(
    join(campaignDir, "content-calendar.json"),
    JSON.stringify(calendar, null, 2),
    "utf-8",
  );

  console.log(`Campaign "${name}" created at ${campaignDir}/`);
  console.log("Next steps:");
  console.log(`  1. Edit ${campaignDir}/brief.json with your campaign details`);
  console.log(`  2. Run: npm run campaign -- plan --name "${name}"`);
}

/**
 * Read a campaign brief.
 */
async function readBrief(name: string): Promise<CampaignBrief> {
  const briefPath = join(CAMPAIGNS_DIR, name, "brief.json");
  const raw = await readFile(briefPath, "utf-8");
  return JSON.parse(raw) as CampaignBrief;
}

/**
 * List all campaigns.
 */
async function listCampaigns(): Promise<void> {
  const { readdir } = await import("fs/promises");
  try {
    const entries = await readdir(CAMPAIGNS_DIR, { withFileTypes: true });
    const campaigns = entries
      .filter((e) => e.isDirectory() && !e.name.startsWith("."))
      .map((e) => e.name);

    if (campaigns.length === 0) {
      console.log("No campaigns found. Create one with: npm run campaign -- create --name <name>");
      return;
    }

    console.log("Campaigns:");
    for (const name of campaigns) {
      try {
        const brief = await readBrief(name);
        console.log(`  ${name} — brand: ${brief.brand}, platforms: ${brief.platforms.join(", ")}`);
      } catch {
        console.log(`  ${name} — (no brief.json)`);
      }
    }
  } catch {
    console.log("No campaigns directory. Create a campaign first.");
  }
}

// CLI setup
const program = new Command();

program
  .name("campaign")
  .description("Marketing campaign orchestration");

program
  .command("create")
  .description("Create a new campaign folder")
  .requiredOption("--name <name>", "Campaign name")
  .option("--brand <brand>", "Brand preset name", "default")
  .action(async (opts) => {
    await createCampaign(opts.name, opts.brand);
  });

program
  .command("plan")
  .description("Generate content calendar from brief")
  .requiredOption("--name <name>", "Campaign name")
  .action(async (opts) => {
    const brief = await readBrief(opts.name);
    console.log(`Planning campaign "${brief.name}"...`);
    console.log("Use Claude Code agents to generate the content calendar:");
    console.log(`  "Plan a content calendar for the ${brief.name} campaign targeting ${brief.targetAudience}"`);
  });

program
  .command("produce")
  .description("Generate all assets for campaign")
  .requiredOption("--name <name>", "Campaign name")
  .action(async (opts) => {
    const brief = await readBrief(opts.name);
    console.log(`Producing assets for "${brief.name}"...`);
    console.log("Use Claude Code agents to produce content:");
    console.log("  - Video Producer: generate videos");
    console.log("  - Visual Designer: generate images");
    console.log("  - Copywriter: write copy and email sequences");
  });

program
  .command("export")
  .description("Export campaign assets for all platforms")
  .requiredOption("--name <name>", "Campaign name")
  .action(async (opts) => {
    const brief = await readBrief(opts.name);
    console.log(`Exporting "${brief.name}" for platforms: ${brief.platforms.join(", ")}`);
    console.log("Use Distribution Manager agent to resize and format assets for each platform.");
  });

program
  .command("list")
  .description("List all campaigns")
  .action(async () => {
    await listCampaigns();
  });

program.parse();
