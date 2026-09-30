import { ChatGoogle } from "@langchain/google";
import { ChatMistralAI } from "@langchain/mistralai"
import { ChatCohere } from "@langchain/cohere"
import { ChatGroq } from "@langchain/groq"

import config from "../config/config.js";

export const googlemodel = new ChatGoogle({
    model:"gemini-3.6-flash",
    apiKey:config.GEMINI_API_KEY
})

export const mistralModel = new ChatMistralAI({
    model:"mistral-medium-latest",
    apiKey:config.MISTRAL_API_KEY
})

export const cohoreModel= new ChatCohere({
    model:"command-a-03-2025",
    apiKey:config.COHERE_API_KEY
})


export const chatgroq = new ChatGroq({
    model: "openai/gpt-oss-120b",
    apiKey: config.GROQ_API_KEY,
    maxTokens: undefined,
    maxRetries: 2
})