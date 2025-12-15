const express = require('express');
const { v4: uuidv4 } = require('uuid'); 
const app = express();

app.use(express.json());

// --- 1. THE DISCOVERY ENDPOINT ---
app.get('/discovery', (req, res) => {
  res.json({
    tools: [
      {
        name: "get_remix_recipe",
        description: "Fetches formatting rules (length, tone, emojis) for specific social channels.",
        endpoint: "/tools/recipe",
        method: "POST",
        parameters: [
          { name: "channels", type: "string", description: "Comma-separated list of channels (e.g., 'LinkedIn, Twitter, Instagram')." }
        ]
      },
      {
        name: "create_cmp_draft",
        description: "Creates a new task/draft in the Content Marketing Platform (CMP) for a specific channel.",
        endpoint: "/tools/create-task",
        method: "POST",
        parameters: [
          { name: "channel", type: "string", description: "The platform (LinkedIn, Twitter, etc.)." },
          { name: "content_body", type: "string", description: "The final remixed text content." },
          { name: "due_date", type: "string", description: "Due date for the post (YYYY-MM-DD)." }
        ]
      }
    ]
  });
});

// --- 2. TOOL LOGIC ---

// Tool 1: The Recipe Book
app.post('/tools/recipe', (req, res) => {
  const { channels } = req.body;
  const requested = (channels || "").toLowerCase();
  
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

  if (requested.includes("instagram")) {
    recipes.Instagram = {
      role: "Visual Storyteller",
      structure: "Emotional Hook -> Short Story -> 'Link in Bio'.",
      constraints: "Focus on visual description. 10+ hashtags at the bottom.",
      tone: "Casual, friendly, lifestyle-focused."
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
      title: `${channel} Post: ${content_body.substring(0, 20)}...`,
      channel: channel,
      workflow_step: "Draft",
      assignee: "Yazan Al Shalabi",
      due_date: due_date || "2025-12-31"
    },
    message: `✅ Successfully created draft in CMP for ${channel}.`
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Remixer Agent listening on port ${port}`);
});