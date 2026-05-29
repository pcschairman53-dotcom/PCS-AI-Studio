export type GeneratorType = "caption" | "poster" | "video" | "adcopy" | "campaign";

export type Language = "english" | "bengali";

export interface ToneOption {
  id: string;
  nameEn: string;
  nameBn: string;
  emoji: string;
}

export interface GeneratorConfig {
  id: GeneratorType;
  nameEn: string;
  nameBn: string;
  taglineEn: string;
  taglineBn: string;
  iconName: string;
  placeholderEn: string;
  placeholderBn: string;
  additionalFields: Array<{
    id: string;
    labelEn: string;
    labelBn: string;
    type: "select" | "text";
    options?: Array<{ value: string; labelEn: string; labelBn: string }>;
    placeholderEn?: string;
    placeholderBn?: string;
  }>;
}

export interface SavedResult {
  id: string;
  type: GeneratorType;
  prompt: string;
  language: Language;
  timestamp: string;
  output: string;
  tone: string;
  options?: Record<string, string>;
}

export interface UserProject {
  id: string;
  name: string;
  type: GeneratorType;
  prompt: string;
  language: Language;
  timestamp: string;
  output: string;
  tone: string;
  notes?: string;
  options?: Record<string, string>;
}

export interface VaultPrompt {
  id: string;
  title: string;
  promptText: string;
  category: string;
  timestamp: string;
  isPremium?: "pro" | "business";
}

export interface DashboardActivity {
  id: string;
  type: string;
  descEn: string;
  descBn: string;
  timestamp: string;
}

