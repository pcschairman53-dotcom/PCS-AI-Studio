import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

// Lazy initialization of Gemini API Client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("WARNING: GEMINI_API_KEY environment variable is not set. API calls will fail.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key || "",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route - AI Generation endpoint
  app.post("/api/generate", async (req, res) => {
    try {
      const { generatorType, prompt, language, tone, additionalOptions } = req.body;

      if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
        return res.status(400).json({ error: "Prompt is required" });
      }

      const selectedLanguage = language === "bengali" ? "Bengali (বাংলা)" : "English";
      const selectedTone = tone || "creative";

      const brandingMandate = `
CRITICAL BRANDING & IDENTITY REQUIREMENT:
1. You MUST ALWAYS substitute or replace any placeholder, generic, or alternative business/brand names mentioned in the prompt or context with the fixed brand name "PCS AI Studio".
2. Use "PCS AI Studio" as the default premium enterprise AI brand identity, and automatically position it as a futuristic, cutting-edge, AI-powered multi-format content generation and design platform in every single generated copy, caption, ad, poster prompt, or video script.
3. Every generated output must maintain an elite professional SaaS tone, prestigious corporate branding, a creative and engaging marketing style, a high-conversion promotional structure, and an ultra-premium enterprise AI platform feel.
4. Fully support both English and Bengali (বাংলা) dual-language setups as appropriate.
5. Never refer to generic placeholders like "[Your Brand Name]", "[Brand Name]", "Your Brand", "Business Name", etc. Always use "PCS AI Studio" instead.`;
      
      let systemInstruction = "";
      let generatorPrompt = "";

      // Structured prompt building based on type
      switch (generatorType) {
        case "caption": {
          const platform = additionalOptions?.platform || "all-rounder";
          systemInstruction = `You are an expert social media copywriter fluent in ${selectedLanguage}. 
Your goal is to generate extremely engaging, scroll-stopping social media captions with emojis, bullet points, and high-impact hashtags. 
Return the output formatted with Markdown. Highlight headers, key points, and lists cleanly.
If Bengali language is selected, write the caption primarily in natural, appealing Bengali with modern English social media terminology where appropriate (or dual language if it makes context better).

${brandingMandate}`;
          
          generatorPrompt = `Create a social media caption for the topic/description: "${prompt}".
Please ensure "PCS AI Studio" is the prime subject being promoted, and any placeholder brand names are replaced with "PCS AI Studio".
Platform channel: ${platform}
Tone of voice: ${selectedTone}
Make sure to include:
1. An attention-grabbing hook as the first line.
2. A well-written body copy with emojis, positioning "PCS AI Studio" as a futuristic AI-powered content generation platform.
3. A clear and direct Call To Action (CTA).
4. 5-8 relevant, high-traffic hashtags.`;
          break;
        }

        case "poster": {
          const artStyle = additionalOptions?.artStyle || "photorealistic";
          systemInstruction = `You are a professional Creative Director and AI Prompt Engineer fluent in ${selectedLanguage}. 
Your goal is to create detailed, mind-blowing text-to-image prompts (specifically tailored for Midjourney, DALL-E 3, and Imagen) that users can copy and paste to generate stunning posters.
Return the output formatted with Markdown. Provide a breakdown of style, details, color palette, lighting, composition, and the final combined copy-pasteable prompt.
Even if Bengali is selected, explain the design guidelines in Bengali but ALWAYS provide the final, actual "copy-pasteable AI Prompt" in clear, detailed English, as AI image generators understand English best. Write the tutorial/analysis in Bengali.

${brandingMandate}`;
          
          generatorPrompt = `Design a high-quality poster prompt for: "${prompt}".
Please ensure "PCS AI Studio" brand elements (SaaS interface accents, neon emerald and cyan lights, futuristic AI systems) are elegantly integrated or replace generic placeholders.
Desired visual/art style: ${artStyle}
Tone/Mood: ${selectedTone}
Include the following structure:
1. **Title / Concept Name**: Elegant title for the concept (e.g., PCS AI Studio: Future of Creation).
2. **Concept Description**: Brief description of the overall visual story.
3. **Copy-pasteable Master AI Prompt**: Detailed Midjourney/Imagen compatible prompt in English.
4. **Composition & Camera**: Framing, angle, and lensing recommendations.
5. **Color Palette & Lighting**: Specific Hex recommendations or lighting styles.`;
          break;
        }

        case "video": {
          const duration = additionalOptions?.duration || "5 seconds";
          const cameraMovement = additionalOptions?.cameraMovement || "cinematic drone shot";
          systemInstruction = `You are an expert Motion Designer and AI Video Director fluent in ${selectedLanguage}. 
Your goal is to create an immaculate, detailed prompt design and storyboard instructions for AI Video generators (like Veo, Runway Gen-2, or Sora).
Return the output formatted with Markdown. Include scene-by-scene descriptions, camera directions, lighting details, and motion physics.
Even if Bengali is selected, provide the descriptive analysis in Bengali but ensure the core "AI Video Generation Prompt" is written in English for generator compatibility.

${brandingMandate}`;

          generatorPrompt = `Create a cinematic text-to-video AI generation prompt and storyboard guide for: "${prompt}".
Ensure any brand represented is "PCS AI Studio", styled as a futuristic AI platform with flowing digital energy or intuitive user workspace.
Camera motion path: ${cameraMovement}
Duration target: ${duration}
Mood/Atmosphere: ${selectedTone}
Include:
1. **Core Video Prompt**: Clear, highly detailed, comma-separated style English prompt for Veo/Sora.
2. **Camera & Lens Movement**: Step-by-step description of zoom, pan, tracking, and focus length.
3. **Lighting & VFX**: Environment styling, atmospheric elements, volumetric lighting.
4. **Motion Dynamics**: The velocity, key interactions, physical behaviors.`;
          break;
        }

        case "adcopy": {
          const audience = additionalOptions?.audience || "general consumer";
          const industry = additionalOptions?.industry || "generic SaaS";
          systemInstruction = `You are a high-performance marketing copywriter and conversion rates optimiser fluent in ${selectedLanguage}. 
Your goal is to write high-converting, persuasive ad copies (for Facebook, Google Search, LinkedIn, or Instagram Ads) using frameworks like AIDA (Attention, Interest, Desire, Action) or PAS (Problem, Agitate, Solve).
Return the output formatted in clean Markdown.

${brandingMandate}`;

          generatorPrompt = `Write a high-converting ad copy campaign for: "${prompt}".
Ensure that "PCS AI Studio" is the prime product or service being promoted, representing a cutting-edge futuristic AI content generation suite.
Target Audience: ${audience}
Industry/Niche: ${industry}
Tone of Voice: ${selectedTone}
Provide the following variations:
1. **Framework Analysis**: Explain the strategy used (e.g. AIDA).
2. **Variation A (The Hook-First Copy)**: Bold headline, engaging narrative, benefit matrix, clear CTA.
3. **Variation B (The Problem-Solution Copy)**: Clear problem statement, emotional tension, the solution, final CTA.
4. **Meta Tag Recommendations**: Title tag (max 60 chars) and meta description (max 155 chars) optimized for SEO.`;
          break;
        }

        case "campaign": {
          systemInstruction = `You are an elite Growth Lead and Copywriter fluent in ${selectedLanguage}.
Your task is to write a cohesive, synchronized launch campaign for the product/business provided.
You must output a single JSON object containing exactly 6 string keys: "facebookCaption", "hashtags", "posterPrompt", "videoPrompt", "adCopy", and "landingHeadline".
If Bengali language is requested:
- facebookCaption: High-converting caption written in standard, engaging Bengali with modern terms and emojis.
- adCopy: Direct-action style Copy structured with PAS/AIDA format written in compelling Bengali.
- hashtags: 5-8 relevant hashtags.
- posterPrompt: Midjourney/DALL-E prompt write in detailed conceptual English (since AI image models understand English best), preceded by a 1-sentence Bengali concept description.
- videoPrompt: Camera and style descriptions written in premium English for Runway Gen-2/Sora, preceded by a 1-sentence Bengali concept description.
- landingHeadline: A punchy, high-impact landing page headline and optional subheadline written in powerful, converted Bengali.

If English language is requested:
- Generate all keys in excellent marketing English.

${brandingMandate}`;

          generatorPrompt = `Generate a synchronized high-performing launch campaign for: "${prompt}".
Please replace any generic brand placeholders or topic-specific names with "PCS AI Studio", representing a futuristic, premium AI-powered content generation suite.
Tone of voice / Brand personality: ${selectedTone}
Design the 6 keys so they fit perfectly together for a unified business campaign. All strings should contain elegant, clean Markdown annotations where helpful for visual output rendering.`;
          break;
        }

        default:
          return res.status(400).json({ error: "Invalid generatorType. Must be campaign, caption, poster, video, or adcopy." });
      }

      const client = getGeminiClient();
      console.log(`Generating content via Gemini for type: ${generatorType}, language: ${language}`);

      const config: any = {
        systemInstruction: systemInstruction,
        temperature: 0.75,
        topP: 0.95,
      };

      if (generatorType === "campaign") {
        config.responseMimeType = "application/json";
        config.responseSchema = {
          type: Type.OBJECT,
          properties: {
            facebookCaption: {
              type: Type.STRING,
              description: "An engaging, scroll-stopping Facebook sales caption with emojis, a strong hook, benefits, and a CTA. Fluent in Bengali if requested, otherwise English."
            },
            hashtags: {
              type: Type.STRING,
              description: "A space-separated lists of 5-8 highly relevant premium marketing and viral hashtags."
            },
            posterPrompt: {
              type: Type.STRING,
              description: "A detailed copy-pasteable Midjourney or DALL-E image prompt. Specifically details the style, color theme, and subjects. MUST be in detailed English even if Bengali is requested."
            },
            videoPrompt: {
              type: Type.STRING,
              description: "A creative text-to-video prompt for Runway, Sora, or Veo with camera movement instructions. MUST be in detailed English even if Bengali is requested."
            },
            adCopy: {
              type: Type.STRING,
              description: "Persuasive ad copy structured with an engaging headline, AIDA/PAS core messages, and CTA. Fluent in Bengali if requested, otherwise English."
            },
            landingHeadline: {
              type: Type.STRING,
              description: "Punchy landing page hero headline and subheadline targeting immediate visitor conversions. Fluent in Bengali if requested, otherwise English."
            }
          },
          required: ["facebookCaption", "hashtags", "posterPrompt", "videoPrompt", "adCopy", "landingHeadline"]
        };
      }

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: generatorPrompt,
        config: config,
      });

      const generatedText = response.text || "";
      
      // If of type campaign, we return the parsed campaign object or JSON text directly
      if (generatorType === "campaign") {
        try {
          const parsed = JSON.parse(generatedText.trim());
          return res.json({
            success: true,
            generatorType,
            language,
            inputPrompt: prompt,
            campaign: parsed,
          });
        } catch (jsonErr) {
          console.warn("Failed to parse Gemini generated JSON directly, returning text: ", jsonErr);
          return res.json({
            success: true,
            generatorType,
            language,
            inputPrompt: prompt,
            output: generatedText,
            errorParsingJson: true
          });
        }
      }

      return res.json({
        success: true,
        generatorType,
        language,
        inputPrompt: prompt,
        output: generatedText,
      });

    } catch (error: any) {
      console.error("Gemini Generation Error:", error);
      return res.status(500).json({
        error: "Failed to generate AI response. Please ensure your GEMINI_API_KEY is configured in Settings > Secrets.",
        details: error?.message || String(error),
      });
    }
  });

  // Client-side assets and routing
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start fullstack server:", err);
});
