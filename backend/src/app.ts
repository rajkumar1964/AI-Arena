import express from "express";
import cors from "cors"
import path from "path"
import { fileURLToPath } from 'url'
import rungraph from "../src/ai/graph.ai.js";
const app = express();
app.use(express.json())

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
app.use(express.static(path.join(__dirname, "..", "dist")));

app.use(cors({
    origin:"http://localhost:5173",
    methods:["GET", "POST"],
    credentials:true

}))
app.get("/", async (req, res) => {
    const result = await rungraph("write factorial");
    res.json(result);
});

app.post ("/invoke",async(req,res)=>{
    const { input  } = req.body;

    const result = await rungraph(input)
    res.status(200).json({
        message:"grah  executed succefully",
        success :true,
        result
    })
})

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() })
})

app.get("/{*splat}", (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'))
})

export default app;