import File from "../models/file.model.js";
import { generateAnswer } from "../services/generation.service.js";
import { retrieveContext } from "../services/retrieval.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import { z } from "zod";

const AskQuestionSchema =
    z.object({
        query: z
            .string()
            .min(3)
            .max(2000),
    });

const chatWithDocs = asyncHandler(async (req, res) => {
    const { query } = AskQuestionSchema.parse(req.body);
    if (!query) {
        return res.status(400).json({
            success: false,
            message: 'Query required'
        })
    }

    const file = await File.findById(req.params.fileId);
    if (!file) {
        return res.status(404).json({
            success: false,
            message: "File not found"
        })
    }

    // 🔐 CRITICAL SECURITY FIX: Verify file ownership before allowing retrieval
    const isOwner = file.userId.toString() === req.user.id.toString();
    const isAdmin = req.user.role === "ADMIN"; // Optional role check

    if (!isOwner && !isAdmin) {
        return res.status(403).json({
            success: false,
            message: "Forbidden: You do not have permission to query this file"
        });
    }


    const chunks = await retrieveContext({ query, namespace: file.namespace, fileId: file._id.toString() });
    if (!chunks) {
        return res.json({
            success: true,
            answer: "Not found in uploaded documents"
        });
    }
    console.log("context text:", chunks);

    const answer = await generateAnswer({ query, chunks })
    console.log("generated answer", answer)

    res.json({
        success: true,
        answer
    })

})

export {
    chatWithDocs
}