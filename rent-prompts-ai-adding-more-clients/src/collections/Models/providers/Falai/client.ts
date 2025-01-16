import { fal } from "@fal-ai/client";

interface FalAiInputProps {
  apiKey: string;
  model: string;
  prompt: string;
  image?: any;
  settings: {
    seed?: number | null;
    steps?: number | 1;
    seconds_start?: number;
    seconds_total?: number;
    num_inference_steps?: number;
    guidance_scale?: number;
    num_frames?: number;
    export_fps?: number;
  };
}

const runFalAi = async (args: FalAiInputProps) => {
  const { apiKey, model, prompt, image, settings } = args;
  const {
    export_fps,
    guidance_scale,
    num_frames,
    num_inference_steps,
    seconds_start,
    seconds_total,
    seed,
    steps,
  } = settings;

  try {
    fal.config({
      credentials: apiKey,
    });

    // Submit the request to the Fal AI API
    console.log("model", model);
    const result = await fal.subscribe(model, {
      input: {
        prompt: prompt,
        seed: settings.seed ?? 2,
        num_inference_steps: settings.num_inference_steps || 4,
        guidance_scale: settings.guidance_scale || 7.5,
        num_frames: settings.num_frames || 16,
        export_fps: settings.export_fps || 8,
        seconds_start: 0,
        seconds_total: 30,
        steps: 100,
        image: image,
      },
      // logs: true,
      // onQueueUpdate: (update) => {
      //   if (update.status === "IN_PROGRESS") {
      //     update.logs.map((log) => log.message).forEach(console.log);
      //   }
      // },
    });
    console.log("FalAIClient Result:", result);
    return result.data; // Return the result data containing video URL
  } catch (error) {
    console.error("FalAIClient Error:", error);
    throw new Error(
      "Failed to communicate with Fal AI. Please contact support."
    );
  }
};
export default runFalAi;
