import Replicate from "replicate";

interface Args {
  userPrompt: string;
  systemPrompt?: string;
  model: `${string}/${string}` | `${string}/${string}:${string}`; // Correct type
  apiKey: string;
  image?: string;
  face_image?: string;
  settings: {
    num_outputs: any;
    apiKey: string;
    streaming?:false;
    seed?: number;
    top_k?: number; // default 0
    top_p?: number; // default 0.95
    temperature?: number; // default 0.7
    length_penalty?: number; // default 1
    presence_penalty?: number; // default 0
    maxTokens?: number; // default 128
    minTokens?: number;
    stopSequences?: Array<string>;
  };
}

export default async function runReplicate(arg: Args) {
  try {
    const { userPrompt, systemPrompt,face_image, model, settings,apiKey,image } = arg;

    // Validate the model format
    const modelRegex = /^[^\/]+\/[^\/]+(:[^\/]+)?$/;
    if (!modelRegex.test(model)) {
      throw new Error(`Invalid model format: ${model}. Expected 'owner/model' or 'owner/model:version'.`);
    }

    // Initialize Replicate client
    const replicate = new Replicate({ auth:apiKey });

    // Prepare input for the API call
    const input = {
      system_prompt: systemPrompt || " ", // Fallback to empty string if undefined
      prompt: userPrompt,
      seed: settings.seed,
      top_k: settings.top_k,
      top_p: settings.top_p,
      temperature: settings.temperature,
      length_penalty: settings.length_penalty,
      max_new_tokens: settings.maxTokens,
      min_new_tokens: settings.minTokens,
      stop_sequences: settings.stopSequences,
      presence_penalty: settings.presence_penalty,
      image: image,
      streaming:false,
      num_outputs: settings.num_outputs||1,
    };
    // Use prediction.create() instead of run() for better control
    const prediction = await replicate.predictions.create({
      // version: "b076c7bf1904e80a5fa634bc845e64f1b118f55bbb18e3782da79148bee5b3b1", // flux-schnell version
      model:"black-forest-labs/flux-schnell",
      input: input,
    });

    const finalPrediction = await replicate.wait(prediction);

    // The output should now be an array of image URLs
    // console.log('ReplicateImageClient Output:', finalPrediction);
    
    if (!finalPrediction.output || !Array.isArray(finalPrediction.output)) {
      throw new Error('Invalid output format from Replicate');
    }
    return finalPrediction.output;
  } catch (error) {
    console.error('ReplicateImageClient Error:', error);
    throw new Error('Please contact the support team');
  }
}