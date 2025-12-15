const express = require('express');
const { v4: uuidv4 } = require('uuid'); 
const app = express();

app.use(express.json());

// --- 1. THE DISCOVERY ENDPOINT (CORRECTED SCHEMA) ---
app.get('/discovery', (req, res) => {
  res.json({
    tools: [
      {
        name: "get_remix_recipe",
        description: "Fetches formatting rules (length, tone, emojis) for specific social channels.",
        endpoint: "/tools/recipe",
        method: "POST",
        parameters: {
          type: "object",
          properties: {
            channels: {
              type: "string",
              description: "Comma-separated list of channels (e.g., 'LinkedIn, Twitter')."
            }
          },
          required: ["channels"]
        }
      },
      {
        name: "create_cmp_draft",
        description: "Creates a new task/draft in the Content Marketing Platform (CMP).",
        endpoint: "/tools/create-task",
        method: "POST",
        parameters: {
          type: "object",
          properties: {
            channel: {
              type: "string",
              description: "The platform (LinkedIn, Twitter, etc.)."
            },
            content_body: {
              type: "string",
              description: "The final remixed text content."
            },
            due_date: {
              type: "string",
              description: "Due date (YYYY-MM-DD). Optional."
            }
          },
          required: ["channel", "content_body"]
        }
      }
    ]
  });
});

// --- 2. TOOL LOGIC ---

// Tool 1: The Recipe Book
app.post('/tools/recipe', (req, res) => {
  // Safe extraction of parameters
  const channels = req.body.channels || "";
  const requested = channels.toLowerCase();
  
  let recipes = {};

  if (requested.includes("linkedin")) {
    recipes.LinkedIn = {
      role: "Thought Leader",
      structure: "Hook (Question) -> Context -> 3 Bullet Points -> Call to Action.",
      constraints: "Max 1500 chars. Use 3-5 hashtags like #DXP #MarTech.",
      tone: "Professional, Insightful, corporate-friendly."
    };
  }
  
  if (requested.includes("twitter") || requested.includes("x")) {
    recipes.Twitter = {
      role: "News Breaker",
      structure: "Punchy Headline -> Link -> Thread Emojis (👇).",
      constraints: "Max 280 chars strictly. Use trending hashtags.",
      tone: "Urgent, exciting, short."
    };
  }

  // Default if no specific channel found
  if (Object.keys(recipes).length === 0) {
     recipes.General = {
        note: "No specific channel detected. Keep it short and clear."
     };
  }

  res.json({
    instruction: "Use these recipes to rewrite the user's input text.",
    recipes: recipes
  });
});

// Tool 2: The CMP Task Creator (Simulated)
app.post('/tools/create-task', (req, res) => {
  const { channel, content_body, due_date } = req.body;
  const taskId = uuidv4().split('-')[0].toUpperCase();
  
  res.json({
    status: "success",
    platform: "Optimizely CMP",
    task_created: {
      id: `CMP-${taskId}`,
      title: `${channel} Post`,
      channel: channel,
      workflow_step: "Draft",
      assignee: "System User",
      due_date: due_date || "2025-12-31"
    },
    message: `✅ Successfully created draft in CMP for ${channel}.`
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Remixer Agent listening on port ${port}`);
});
