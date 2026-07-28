import { NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai"

// Ensure we don't try to instantiate without a key in production
// But handle gracefully if it's missing during runtime
let ai: GoogleGenAI | null = null;
try {
  if (process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  }
} catch (error) {
  console.warn("Failed to initialize Google GenAI", error)
}

export async function POST(req: Request) {
  try {
    const { productName, format = "text" } = await req.json()

    if (!productName) {
      return NextResponse.json({ error: "Product name is required" }, { status: 400 })
    }

    if (!ai) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured in the environment variables." },
        { status: 500 }
      )
    }

    let prompt = `You are a helpful mobile device expert.
The user is adding a mobile device to their inventory system and needs the specifications.
Device Name: "${productName}"

Please provide the key specifications for this device in a concise, clean markdown format that will be pasted into a description field. 
Do not include any introductory or concluding text like "Here are the specs" or "Let me know if you need anything else". Just return the markdown specifications.

Include the following details if known:
- **Display**: (e.g., 6.7" OLED, 120Hz)
- **Processor**: (e.g., Snapdragon 8 Gen 3)
- **RAM**: (e.g., 12GB)
- **Storage**: (e.g., 256GB / 512GB)
- **Main Camera**: (e.g., 50MP + 12MP + 10MP)
- **Selfie Camera**: (e.g., 12MP)
- **Battery**: (e.g., 5000mAh, 45W Fast Charging)
- **OS**: (e.g., Android 14)

If you are not reasonably confident about the device (e.g., if it's a made up name), please state: "Could not find specifications for this device. Please verify the name."`

    if (format === "json") {
      prompt = `You are a mobile device expert. Return ONLY a raw JSON object with the following string keys for "${productName}". 
Keys: "Processor", "Display Size", "Rear Camera", "Front Camera", "Battery Capacity", "Operating System", "Warranty", "RAM", "Storage".
If you don't know a value, use an empty string. Do NOT wrap in markdown \`\`\` blocks, just return raw JSON text.`
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    })

    const text = response.text || ""

    if (format === "json") {
      try {
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const json = JSON.parse(cleanedText)
        return NextResponse.json({ specs: json })
      } catch (e) {
        console.error("JSON parse error:", text)
        return NextResponse.json({ error: "Failed to parse JSON" }, { status: 500 })
      }
    }

    return NextResponse.json({ specs: text.trim() || "Could not generate specifications." })

  } catch (error: any) {
    console.error("AI Fetch Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch product specifications." },
      { status: 500 }
    )
  }
}
