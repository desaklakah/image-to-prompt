
export interface GenerationParameters {
  style: string;
  lighting: string;
  camera: string;
  color_palette: string[];
  cfg_scale: string;
  steps: string;
  sampler: string;
  seed: string;
  aspect_ratio: string;
}

export interface PromptData {
  positive_prompt: string;
  negative_prompt: string;
  parameters: GenerationParameters;
}
