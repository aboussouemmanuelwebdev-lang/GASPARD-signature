import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Initialize Express
const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client with fallback verification
let aiClient: GoogleGenAI | null = null;
const isAiConfigured = !!process.env.GEMINI_API_KEY;

function getGemini(): GoogleGenAI {
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY || "fallback_key_for_testing",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Function declaration for booking a table
const bookTableDeclaration: FunctionDeclaration = {
  name: "bookTable",
  description: "Enregistre une réservation de table pour un client quand toutes les informations nécessaires sont fournies (nom complet, prénom, numéro de téléphone, date de réservation, heure, et nombre de convives). Si une information majeure manque (comme le téléphone ou la date de réservation), ne lancez pas l'enregistrement : demandez-la d'abord à l'utilisateur.",
  parameters: {
    type: Type.OBJECT,
    description: "Données de la réservation de table",
    properties: {
      firstName: {
        type: Type.STRING,
        description: "Le prénom du client."
      },
      lastName: {
        type: Type.STRING,
        description: "Le nom de famille du client."
      },
      phone: {
        type: Type.STRING,
        description: "Le numéro de téléphone du client (requis pour confirmer la table)."
      },
      email: {
        type: Type.STRING,
        description: "L'adresse email du client (optionnelle)."
      },
      date: {
        type: Type.STRING,
        description: "La date demandée pour la réservation au format YYYY-MM-DD."
      },
      time: {
        type: Type.STRING,
        description: "L'heure demandée pour la réservation au format HH:MM (ex: 20:30)."
      },
      guestsCount: {
        type: Type.INTEGER,
        description: "Le nombre de convives assistant au repas (de 1 à 10 personnes)."
      },
      message: {
        type: Type.STRING,
        description: "Notes particulières ou demandes spéciales comme une allergie ou le souhait d'une table d'affaires."
      }
    },
    required: ["firstName", "lastName", "phone", "date", "time", "guestsCount"]
  }
};

const CHAT_SYSTEM_INSTRUCTION = `Vous êtes "Concierge Gaspard AI", l'assistant d'accueil virtuel officiel et haut de gamme du restaurant GAGNANT "Gaspard Signature", situé à l'Angré 8ème Tranche, en face de la pharmacie de la 8ème Tranche, Cocody, Abidjan (Côte d'Ivoire).

Votre mission consiste à :
1. Accueillir chaleureusement les visiteurs de notre site web avec le prestige et le raffinement de la gastronomie de Cocody.
2. Indiquer le lieu précis du restaurant : "Angré 8ème Tranche, en face de la pharmacie de la 8ème Tranche, Cocody, Abidjan".
3. Proposer nos services de prestige :
   - Nos fameuses grillades mémorables de filet de bœuf tendre cuit au feu de bois.
   - Les meilleures pizzas haut de gamme de Cocody avec une pâte légère et aérée.
   - Sélection de vins fins magnifiques et mets raffinés (allant des entrées de prestige aux desserts gourmands).
   - Un espace élégant noir et or haut de gamme, parfait pour les rendez-vous professionnels, privatisations, anniversaires ou dîners en amoureux.
   - Commande de repas en ligne (livraison partout à Abidjan ou retrait au restaurant).
   - Service traiteur pour événements de groupe (+10 personnes).
4. Accompagner activement les visiteurs à PRENDRE DES RENDEZ-VOUS (réserver une table) :
   - Lorsque le visiteur souhaite réserver une table, guidez-le amicalement pour collecter ses informations indispensables :
     * Son Prénom
     * Son Nom
     * Son numéro de Téléphone (très important !)
     * La Date (au format AAAA-MM-JJ, ex: demain, ou une date précise en rappelant que nous sommes le lundi 1er juin 2026)
     * L'Heure de repas (ex: 19:30, 20:00)
     * Le nombre de places / convives (de 1 à 10)
     * Notes optionnelles (ex: allergies, table d'affaires, table calme)
   - Dès que vous avez réuni ces informations obligatoires (Prénom, Nom, Téléphone, Date, Heure, Convives), lancez l'outil de réservation "bookTable". Ne supposez pas de fausses valeurs sans demander ! Mais soyez fluide dans l'échange et aidez-les s'ils fournissent les données au compte-goutte.

Si la clé API Gemini n'est pas ou mal configurée, nous opérons avec un assistant fluide. Répondez de manière chic et élégante, concise et structurée, en utilisant le français de Côte d'Ivoire élégant.`;

// Endpoint directly simulating Gemini AI or calling Gemini API
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    // Format historical messages for Gemini
    const contents = messages.map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }));

    if (isAiConfigured) {
      try {
        const ai = getGemini();
        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: contents,
          config: {
            systemInstruction: CHAT_SYSTEM_INSTRUCTION,
            tools: [{ functionDeclarations: [bookTableDeclaration] }]
          }
        });

        const replyText = response.text || "";
        const functionCalls = response.functionCalls;

        return res.json({
          reply: replyText,
          functionCall: functionCalls && functionCalls.length > 0 ? functionCalls[0] : null
        });
      } catch (geminiError: any) {
        console.error("Gemini runtime error, falling back to smart rules:", geminiError);
        // Fall back to rule-based parser in case of quota or network issue
      }
    }

    // Smart Rule-Based Fallback Engine (Runs when no API Key is available or if Call Fails)
    const lastUserMessage = messages[messages.length - 1]?.content || "";
    const lowerMessage = lastUserMessage.toLowerCase();
    
    let reply = "";
    let functionCall = null;

    // Detect if user is asking for location
    if (lowerMessage.includes("lieu") || lowerMessage.includes("adresse") || lowerMessage.includes("situé") || lowerMessage.includes("où se trouve") || lowerMessage.includes("trouver") || lowerMessage.includes("localisation")) {
      reply = "Gaspard Signature est idéalement situé à **l'Angré 8ème Tranche, en face de la pharmacie de la 8ème Tranche, Cocody, Abidjan**.\n\nVous y découvrirez un cadre exceptionnel noir et or d'une élégance rare, idéal pour tous vos repas de prestige ! Vous pouvez également réserver une table ou commander en ligne.";
    } 
    // Detect if user asking for services/specialities
    else if (lowerMessage.includes("service") || lowerMessage.includes("carte") || lowerMessage.includes("menu") || lowerMessage.includes("manger") || lowerMessage.includes("spécialit") || lowerMessage.includes("proposer") || lowerMessage.includes("pizza") || lowerMessage.includes("grillade")) {
      reply = "Chez Gaspard Signature, nous vous proposons des services d'exception :\n\n" +
        "🔥 **Grillades mémorables** : Filet de bœuf au feu de bois d'une tendresse absolue, cuit selon vos désirs.\n" +
        "🍕 **Pizzas de prestige** : Recettes gourmandes avec une pâte aérée, légère et fraîchement préparée.\n" +
        "🍷 **Cave de prestige** : Une carte des vins fins soigneusement sélectionnés par nos sommeliers.\n" +
        "💼 **Repas d'affaires & Événements** : Organisation de privatisations, anniversaires et repas de groupes sur mesure.\n" +
        "🚗 **Livraison à domicile** : Commande en ligne directe avec livraison sur tout Abidjan.\n\n" +
        "Souhaitez-vous que je vous aide à réserver une table pour vivre cette expérience ?";
    }
    // Deep interactive check to help book a table in fallback mode
    else if (lowerMessage.includes("réserv") || lowerMessage.includes("table") || lowerMessage.includes("rendez-vous") || lowerMessage.includes("book") || lowerMessage.includes("rdv") || lowerMessage.includes("venir")) {
      // Look for data inside request to attempt auto-fill
      let foundDate = null;
      let foundTime = "19:30";
      let foundGuests = 2;
      let foundPhone = "";

      // Rough parsing for date
      const dateMatch = lowerMessage.match(/(\d{4}-\d{2}-\d{2})/) || lowerMessage.match(/(\d{2}\/\d{2}\/\d{4})/);
      if (dateMatch) foundDate = dateMatch[1];
      
      const phoneMatch = lowerMessage.match(/(\d[\s-]?){8,15}/);
      if (phoneMatch) foundPhone = phoneMatch[0].trim();

      const timeMatch = lowerMessage.match(/(\d{2}h\d{2})/) || lowerMessage.match(/(\d{2}:\d{2})/);
      if (timeMatch) foundTime = timeMatch[1].replace('h', ':');

      if (foundDate && foundPhone) {
        // We have basic details. Call functionCall!
        functionCall = {
          name: "bookTable",
          args: {
            firstName: "Client",
            lastName: "Gaspard",
            phone: foundPhone,
            date: foundDate,
            time: foundTime,
            guestsCount: foundGuests,
            message: "Réservation rapide via notre Concierge AI"
          }
        };
        reply = "C'est un plaisir ! J'ai rassemblé vos informations pour enregistrer votre table. Votre réservation est en cours de traitement...";
      } else {
        reply = "Je serais ravi de planifier votre table chez Gaspard Signature ! 🥂\n\nPour cela, pourriez-vous m'indiquer :\n" +
          "1. Votre **Prénom & Nom**\n" +
          "2. Votre numéro de **Téléphone**\n" +
          "3. La **Date & l'Heure** souhaitées\n" +
          "4. Le **nombre de convives**\n\n*Vous pouvez également remplir directement le formulaire en bas de page ou me donner ces détails ensemble !*";
      }
    } else {
      reply = "Bonjour ! Je suis **Concierge Gaspard AI**, votre assistant virtuel haut de gamme. ✨\n\n" +
        "Je suis à votre entière disposition pour :\n" +
        "📍 Vous indiquer la **localisation** de notre restaurant à Cocody\n" +
        "🍕 Vous présenter nos **spécialités gastronomiques** (grillades de bœuf, pizzas de prestige)\n" +
        "🗓️ Vous accompagner pas à pas pour **réserver une table mémorable**\n\n" +
        "Comment puis-je vous accompagner aujourd'hui ?";
    }

    return res.json({ reply, functionCall });

  } catch (error: any) {
    console.error("API error:", error);
    res.status(500).json({ error: "Une erreur interne est survenue sur le serveur de chat." });
  }
});

// Setup Vite or Production build serving
async function setupRouting() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }
}

setupRouting().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server started in ${process.env.NODE_ENV || 'development'} on port ${PORT}`);
  });
});
