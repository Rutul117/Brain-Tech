require("dotenv").config();
const { Router } = require("express")
const openaiRouter = Router()
const OpenAI = require("openai");
const apiKey = process.env.APIKEY;
const { exec } = require("child_process");

const openai = new OpenAI({
    apiKey: apiKey,
});


// Route for code execution
openaiRouter.post("/execute-code", (req, res) => {
    const { code } = req.body;

    // Execute JavaScript code using Node.js
    const sanitizedCode = code.trim().replace(/"/g, '\\"');
    exec(`node -e "${sanitizedCode}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            res.status(500).json({ error: "Code execution failed" });
            return;
        }
        if (stderr) {
            console.error(`Stderr: ${stderr}`);
        }

        const output = stdout || "No output";

        res.json({ output });
    });
});

// Route for code conversion
openaiRouter.post("/convert-code", async (req, res) => {
    try {
        const { code, targetLanguage } = req.body;

        // Use the openai library to send a prompt to GPT-3 for code conversion
        const response = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content:
                        "You are a Developer who has knowledge of all computer languages",
                },
                {
                    role: "user",
                    content: `Convert the following code from ${code} to ${targetLanguage}.`,
                },
            ],
            model: "gpt-3.5-turbo",
        });

        const convertedCode = response.choices[0].message.content;
        console.log(convertedCode);

        res.json({ convertedCode });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Conversion failed" });
    }
});

// Route for code debugging
openaiRouter.post("/debug-code", async (req, res) => {
    try {
        const { code } = req.body;

        // Use the openai library to send a prompt to GPT-3 for code debugging
        const response = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content:
                        "You are a Developer who has knowledge of all computer languages",
                },
                {
                    role: "user",
                    content: `Debug the following code:\n${code}.\nPlease debug the following code and provide a corrected version explaining the issues and the fixes made.\n `,
                },
            ],
            model: "gpt-3.5-turbo",
        });

        const debuggedCode = response.choices[0].message.content;

        res.json({ debuggedCode });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Debugging failed" });
    }
});

// Route for code quality check
openaiRouter.post("/quality-check", async (req, res) => {
    try {
        const { code } = req.body;

        // Use the openai library to send a prompt to GPT-3 for code quality checking
        const response = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content:
                        "You are a Developer who has knowledge of all computer languages",
                },
                {
                    role: "user",
                    content: `Check the quality of the following code:\n${code}.\nPlease evaluate the following code for its quality and provide a score in percentage (max 100%) for each of the following factors. Additionally, provide explanations or comments on the code's adherence to the following aspects, and each factor should start with a new line:
            \n 1. Code Consistency: Provide a percentage based on the provided code.
            \n 2. Code Performance: Provide a percentage based on the provided code.
            \n 3. Error Handling: Provide a percentage based on the provided code.
            \n 4. Code Readability: Provide a percentage based on the provided code.
            \n 5. Code Complexity: Provide a percentage based on the provided code.`,
                },
            ],
            model: "gpt-3.5-turbo",
        });

        const qualityAssessment = response.choices[0].message.content;

        res.json({ qualityAssessment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Quality check failed" });
    }
});

module.exports = { openaiRouter }