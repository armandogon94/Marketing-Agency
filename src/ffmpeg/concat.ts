/**
 * FFmpeg Concatenation — Join clips, add intros/outros with transitions.
 */

import { execa } from "execa";
import { writeFile, mkdir, unlink } from "fs/promises";
import { join, dirname } from "path";

/**
 * Concatenate multiple video clips without transitions (fast, lossless-ish).
 */
export async function concatClips(
  clips: string[],
  outputPath: string,
): Promise<string> {
  if (clips.length === 0) throw new Error("No clips to concatenate");
  if (clips.length === 1) return clips[0];

  await mkdir(dirname(outputPath), { recursive: true });

  // Create a concat file
  const concatFile = join(dirname(outputPath), "_concat_list.txt");
  const content = clips.map((c) => `file '${c}'`).join("\n");
  await writeFile(concatFile, content, "utf-8");

  await execa("ffmpeg", [
    "-y",
    "-f",
    "concat",
    "-safe",
    "0",
    "-i",
    concatFile,
    "-c",
    "copy",
    "-movflags",
    "+faststart",
    outputPath,
  ]);

  await unlink(concatFile);
  return outputPath;
}

/**
 * Add an intro and/or outro to a video with xfade transitions.
 */
export async function addIntroOutro(
  mainVideo: string,
  outputPath: string,
  options: {
    intro?: string;
    outro?: string;
    transitionDuration?: number;
    transitionType?: string; // fade, wipeleft, wiperight, slideup, slidedown, dissolve
  },
): Promise<string> {
  const {
    intro,
    outro,
    transitionDuration = 1,
    transitionType = "fade",
  } = options;

  await mkdir(dirname(outputPath), { recursive: true });

  // If no intro/outro, just copy
  if (!intro && !outro) {
    await execa("ffmpeg", ["-y", "-i", mainVideo, "-c", "copy", outputPath]);
    return outputPath;
  }

  const inputs: string[] = [];
  const filterParts: string[] = [];
  let inputIdx = 0;

  if (intro) {
    inputs.push("-i", intro);
    inputIdx++;
  }
  inputs.push("-i", mainVideo);
  const mainIdx = inputIdx;
  inputIdx++;

  if (outro) {
    inputs.push("-i", outro);
  }

  // Build xfade filter chain
  if (intro && !outro) {
    // Intro → Main with xfade
    filterParts.push(
      `[0:v][1:v]xfade=transition=${transitionType}:duration=${transitionDuration}:offset=dur0[outv]`,
    );
    // Get intro duration for offset calculation
    const { stdout } = await execa("ffprobe", [
      "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", intro,
    ]);
    const introDur = parseFloat(stdout.trim());
    filterParts[0] = filterParts[0].replace(
      "dur0",
      String(introDur - transitionDuration),
    );
  } else if (!intro && outro) {
    // Main → Outro with xfade
    const { stdout } = await execa("ffprobe", [
      "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", mainVideo,
    ]);
    const mainDur = parseFloat(stdout.trim());
    filterParts.push(
      `[0:v][1:v]xfade=transition=${transitionType}:duration=${transitionDuration}:offset=${mainDur - transitionDuration}[outv]`,
    );
  } else if (intro && outro) {
    // Intro → Main → Outro (two xfade transitions)
    const { stdout: introStdout } = await execa("ffprobe", [
      "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", intro,
    ]);
    const { stdout: mainStdout } = await execa("ffprobe", [
      "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", mainVideo,
    ]);
    const introDur = parseFloat(introStdout.trim());
    const mainDur = parseFloat(mainStdout.trim());

    const offset1 = introDur - transitionDuration;
    const offset2 = offset1 + mainDur - transitionDuration;

    filterParts.push(
      `[0:v][1:v]xfade=transition=${transitionType}:duration=${transitionDuration}:offset=${offset1}[tmp]`,
      `[tmp][2:v]xfade=transition=${transitionType}:duration=${transitionDuration}:offset=${offset2}[outv]`,
    );
  }

  await execa("ffmpeg", [
    "-y",
    ...inputs,
    "-filter_complex",
    filterParts.join(";"),
    "-map",
    "[outv]",
    "-c:v",
    "libx264",
    "-crf",
    "18",
    "-preset",
    "medium",
    "-movflags",
    "+faststart",
    outputPath,
  ]);

  return outputPath;
}
