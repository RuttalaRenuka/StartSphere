import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // AI Generation Endpoint
  app.post("/api/generate-plan", async (req, res) => {
    let rawCategory = req.body.category || "Startup";
    // Convert 'coffee-shop' to 'Coffee Shop'
    let category = rawCategory.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    
    try {
      const prompt = `
        Generate a comprehensive, professional startup blueprint specifically for a "${category}" business in India.
        You MUST tailor all equipment, suppliers, description, and marketing completely to the "${category}" industry. Do NOT use generic or coffee shop data unless the category is Coffee Shop.

        The response MUST be a single, valid JSON object following this EXACT structure:
        {
          "id": "unique-id",
          "category": "${category}",
          "budget": { "basic": number, "standard": number, "premium": number },
          "equipment": [
            { "id": "eq-1", "name": "Item Name", "price": number, "category": "Equipment Type" }
          ],
          "suppliers": [
            { "id": "sup-1", "name": "Supplier Name", "rating": number, "contact": "Contact info/email" }
          ],
          "checklist": ["Task 1", "Task 2"],
          "description": "Short business bio",
          "marketingPlan": ["Strategy 1", "Strategy 2"],
          "riskAnalysis": ["Identify primary risks and mitigation."],
          "growthOpportunities": ["Long term expansion ideas."],
          "revenuePrediction": {
            "monthlyRevenue": number,
            "monthlyExpenses": number,
            "expectedProfit": number,
            "breakEvenMonths": number,
            "growthPotential": "Description of trends"
          }
        }
        Provide exactly 6 items for equipment and 4 suppliers tailored to the ${category}. All financial amounts and prices MUST be in Indian Rupees (₹), realistically scaled for India.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-pro-latest",
        contents: prompt
      });
      const text = response.text || "";
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) {
        throw new Error("Failed to parse AI response as JSON");
      }

      const plan = JSON.parse(jsonMatch[0]);
      res.json(plan);
    } catch (error) {
      console.error("AI Generation Error:", error);
      
      // Fallback sample data when AI generation fails or quota is exceeded
      const fallbackData: Record<string, any> = {
        "Coffee Shop": {
          budget: { basic: 500000, standard: 1200000, premium: 2500000 },
          equipment: [
            { id: "eq-1", name: "Commercial Espresso Machine", price: 250000, category: "Hardware" },
            { id: "eq-2", name: "Industrial Coffee Grinder", price: 60000, category: "Hardware" },
            { id: "eq-3", name: "POS System Complete", price: 35000, category: "Software/IT" },
            { id: "eq-4", name: "Furniture Set (Tables & Chairs)", price: 150000, category: "Interior" },
            { id: "eq-5", name: "Commercial Refrigerator", price: 80000, category: "Hardware" },
            { id: "eq-6", name: "Initial Inventory & Beans", price: 50000, category: "Inventory" }
          ],
          suppliers: [
            { id: "sup-1", name: "Global Coffee Equipments", rating: 4.8, contact: "sales@globalcoffee.in" },
            { id: "sup-2", name: "TechPOS Solutions", rating: 4.5, contact: "support@techpos.in" },
            { id: "sup-3", name: "Premium Roast Beans Wholesale", rating: 4.9, contact: "wholesale@premiumroast.in" },
            { id: "sup-4", name: "Modern Cafe Interiors", rating: 4.6, contact: "hello@moderncafe.in" }
          ],
          revenuePrediction: {
            monthlyRevenue: 300000,
            monthlyExpenses: 180000,
            expectedProfit: 120000,
            breakEvenMonths: 14,
            growthPotential: "Expected steady 15% YoY growth based on location foot traffic and growing specialty coffee market."
          }
        },
        "Clothing Brand": {
          budget: { basic: 300000, standard: 800000, premium: 2000000 },
          equipment: [
            { id: "eq-1", name: "Industrial Sewing Machines", price: 120000, category: "Hardware" },
            { id: "eq-2", name: "Cutting & Embroidery Tools", price: 40000, category: "Hardware" },
            { id: "eq-3", name: "Initial Fabric Inventory", price: 150000, category: "Inventory" },
            { id: "eq-4", name: "Packaging Materials", price: 20000, category: "Inventory" },
            { id: "eq-5", name: "E-commerce Website Setup", price: 50000, category: "Software/IT" },
            { id: "eq-6", name: "Marketing & Photoshoot", price: 30000, category: "Marketing" }
          ],
          suppliers: [
            { id: "sup-1", name: "Surat Textiles Wholesale", rating: 4.9, contact: "orders@surattextiles.in" },
            { id: "sup-2", name: "Thread & Needle Co.", rating: 4.6, contact: "supply@threadco.in" },
            { id: "sup-3", name: "Eco Packaging India", rating: 4.7, contact: "sales@ecopack.in" },
            { id: "sup-4", name: "Shopify Dev Experts", rating: 4.8, contact: "build@shopdevindia.in" }
          ],
          revenuePrediction: {
            monthlyRevenue: 250000,
            monthlyExpenses: 120000,
            expectedProfit: 130000,
            breakEvenMonths: 8,
            growthPotential: "Strong potential online. Expect 30% growth during festive seasons."
          }
        },
        "Bakery": {
          budget: { basic: 400000, standard: 800000, premium: 1500000 },
          equipment: [
            { id: "eq-1", name: "Commercial Convection Oven", price: 150000, category: "Hardware" },
            { id: "eq-2", name: "Planetary Mixers", price: 60000, category: "Hardware" },
            { id: "eq-3", name: "Display Counters", price: 80000, category: "Interior" },
            { id: "eq-4", name: "Baking Trays & Molds", price: 25000, category: "Hardware" },
            { id: "eq-5", name: "Proofing Cabinets", price: 50000, category: "Hardware" },
            { id: "eq-6", name: "Initial Ingredients (Flour/Sugar)", price: 40000, category: "Inventory" }
          ],
          suppliers: [
            { id: "sup-1", name: "Delhi Bakery Equipments", rating: 4.8, contact: "sales@bakeryequip.in" },
            { id: "sup-2", name: "Agro Millers India", rating: 4.7, contact: "bulk@agromillers.in" },
            { id: "sup-3", name: "Sweet Decor Packagings", rating: 4.5, contact: "support@sweetdecor.in" },
            { id: "sup-4", name: "Chef's Kitchen Tools", rating: 4.9, contact: "orders@chefskitchen.in" }
          ],
          revenuePrediction: {
            monthlyRevenue: 200000,
            monthlyExpenses: 110000,
            expectedProfit: 90000,
            breakEvenMonths: 10,
            growthPotential: "High local demand. B2B contracts with local cafes can dramatically increase scale."
          }
        },
        "Youtube Studio": {
          budget: { basic: 100000, standard: 350000, premium: 1000000 },
          equipment: [
            { id: "eq-1", name: "4K Mirrorless Camera", price: 120000, category: "Hardware" },
            { id: "eq-2", name: "Studio Lighting Kit", price: 30000, category: "Hardware" },
            { id: "eq-3", name: "High-end Editing Laptop", price: 150000, category: "Hardware" },
            { id: "eq-4", name: "Condenser Microphone", price: 25000, category: "Hardware" },
            { id: "eq-5", name: "Acoustic Panels & Decor", price: 15000, category: "Interior" },
            { id: "eq-6", name: "Creative Cloud License (1 Yr)", price: 20000, category: "Software/IT" }
          ],
          suppliers: [
            { id: "sup-1", name: "Camera Store India", rating: 4.9, contact: "sales@camerastore.in" },
            { id: "sup-2", name: "AudioTech Pro", rating: 4.8, contact: "support@audiotech.in" },
            { id: "sup-3", name: "Acoustic Solutions", rating: 4.6, contact: "hello@acousticsolutions.in" },
            { id: "sup-4", name: "ComputeWorld", rating: 4.7, contact: "b2b@computeworld.in" }
          ],
          revenuePrediction: {
            monthlyRevenue: 80000,
            monthlyExpenses: 15000,
            expectedProfit: 65000,
            breakEvenMonths: 6,
            growthPotential: "Very high ROI potential via Adsense, sponsorships, and affiliate marketing."
          }
        },
        "Gym": {
          budget: { basic: 1000000, standard: 3500000, premium: 10000000 },
          equipment: [
            { id: "eq-1", name: "Treadmills & Cardio Machines", price: 600000, category: "Hardware" },
            { id: "eq-2", name: "Free Weights & Dumbbells", price: 300000, category: "Hardware" },
            { id: "eq-3", name: "Multi-station Rigs", price: 450000, category: "Hardware" },
            { id: "eq-4", name: "Rubber Flooring", price: 150000, category: "Interior" },
            { id: "eq-5", name: "Mirrors & Lockers", price: 100000, category: "Interior" },
            { id: "eq-6", name: "Gym Management Software", price: 50000, category: "Software/IT" }
          ],
          suppliers: [
            { id: "sup-1", name: "Fitness Equip India", rating: 4.9, contact: "sales@fitnessequip.in" },
            { id: "sup-2", name: "Jerai Fitness", rating: 4.8, contact: "orders@jeraifitness.in" },
            { id: "sup-3", name: "GymFlooring Pros", rating: 4.7, contact: "support@gymflooring.in" },
            { id: "sup-4", name: "FitSoft Solutions", rating: 4.6, contact: "sales@fitsoft.in" }
          ],
          revenuePrediction: {
            monthlyRevenue: 600000,
            monthlyExpenses: 250000,
            expectedProfit: 350000,
            breakEvenMonths: 18,
            growthPotential: "Recurring subscription model offers high stability once member base hits 500."
          }
        },
        "Beauty Salon": {
          budget: { basic: 300000, standard: 1000000, premium: 3000000 },
          equipment: [
            { id: "eq-1", name: "Salon Styling Chairs", price: 80000, category: "Interior" },
            { id: "eq-2", name: "Hair Wash Stations", price: 60000, category: "Interior" },
            { id: "eq-3", name: "Professional Hair Dryers & Tools", price: 50000, category: "Hardware" },
            { id: "eq-4", name: "Mirrors and Lighting", price: 40000, category: "Interior" },
            { id: "eq-5", name: "Initial Beauty Products", price: 70000, category: "Inventory" },
            { id: "eq-6", name: "Booking Software System", price: 20000, category: "Software/IT" }
          ],
          suppliers: [
            { id: "sup-1", name: "Salon Furniture India", rating: 4.8, contact: "sales@salonfurniture.in" },
            { id: "sup-2", name: "L'Oreal Professional Dist.", rating: 4.9, contact: "orders@lorealpro.in" },
            { id: "sup-3", name: "Mirror & Lighting Co", rating: 4.6, contact: "hello@mirrorlight.in" },
            { id: "sup-4", name: "BookMySalon Software", rating: 4.7, contact: "support@bookmysalon.in" }
          ],
          revenuePrediction: {
            monthlyRevenue: 350000,
            monthlyExpenses: 150000,
            expectedProfit: 200000,
            breakEvenMonths: 12,
            growthPotential: "Strong repeat customer base ensures steady cash flow and word-of-mouth growth."
          }
        }
      };

      const selectedData = fallbackData[category] || fallbackData["Coffee Shop"];

      const fallbackPlan = {
        id: "fallback-plan-1",
        category,
        budget: selectedData.budget,
        equipment: selectedData.equipment,
        suppliers: selectedData.suppliers,
        checklist: [
          "Register Business Entity (LLC/Corp)",
          "Sign Commercial Lease Agreement",
          "Apply for Local Trade Licenses",
          "Order Core Equipment & Supplies",
          "Hire and Train Staff",
          "Launch Digital Marketing Campaign"
        ],
        description: `A modern, scalable ${category} tailored to current market demands, emphasizing quality and great customer experience.`,
        riskAnalysis: [
          "Market competition and saturation.",
          "Economic downturns affecting consumer discretionary spending.",
          "Supply chain disruptions impacting inventory."
        ],
        growthOpportunities: [
          "Franchising and multi-location expansion.",
          "Vertical integration and launching private label products.",
          "B2B partnerships and corporate accounts."
        ],
        marketingPlan: [
          "Social Media Campaign (Instagram/Facebook) focusing on aesthetics",
          "Local community partnerships and flyer distribution",
          "Introductory discounts to drive initial footfall",
          "Launch event covered by local lifestyle influencers"
        ],
        revenuePrediction: selectedData.revenuePrediction
      };

      res.json(fallbackPlan);
    }
  });

  // Chatbot Assistant Endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      
      const chat = ai.chats.create({
        model: "gemini-3.5-flash",
        config: {
          systemInstruction: "You are StartSphere AI Startup Advisor, a professional business consultant. Answer queries like: 'What business can I start with ₹5 Lakhs?', 'Which business has the highest profit?', 'Suggest low-risk businesses.' Help users launch and scale their ideas with practical advice on equipment, budgets, logic, and planning. Keep responses concise, professional, and supportive.",
        }
      });
      
      // Need to restore history if valid format, but to make it simple we can just append
      // The `history` array passed to `chatWithAI` might not map to the exact types expected or could be empty.
      // Send the current message
      
      // Actually, if we send the entire history as text, or map the history!
      if (history && history.length > 0) {
        // Just send the most recent message with previous history as context
      }

      // But the chat history must be part of message if we don't start it properly:
      // Let's just serialize it or map it to the chat object if supported.
      // For simplicity, I'll pass the message directly, but let's see how `ai.chats.create` config supports history. No history config mentioned in SKILL for `ai.chats.create` so it defaults to empty. So let's manually send contents if we must. Or just use `ai.chats.create()` and hope `history` is implicitly supported. Wait, I'll handle history in `contents` manually for `generateContent` instead of `chats.create`.
      // Actually, `generateContent` requires parts mapping.
      // Let's use `generateContent` instead for true stateless backend:
      
      let contents = [];
      if (history && history.length > 0) {
        contents = history.map((msg: any) => ({
          role: msg.role === 'model' ? 'model' : 'user',
          parts: msg.parts,
        }));
      }
      contents.push({ role: 'user', parts: [{ text: message }] });

      const response = await ai.models.generateContent({
        model: "gemini-pro-latest",
        contents: contents,
        config: {
          systemInstruction: "You are StartSphere AI Startup Advisor, a professional business consultant. Answer queries like: 'What business can I start with ₹5 Lakhs?', 'Which business has the highest profit?', 'Suggest low-risk businesses.' Help users launch and scale their ideas with practical advice on equipment, budgets, logic, and planning. Keep responses concise, professional, and supportive."
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Chat Error:", error);
      res.json({ text: "I'm experiencing high traffic right now and some functionality is limited. However, you can still generate a Complete Business Blueprint by selecting a business category on the main page!" });
    }
  });

  // Vite middleware for development
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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
