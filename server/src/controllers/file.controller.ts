import File from "../models/file.model.js";
import { ingestChunks } from "../services/ingest.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import { chunkText } from "../utils/chunk.js";
import { extactPdfText } from "../utils/pdf.js";



const uploadPdf = asyncHandler(async (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }


    const doc = await File.create(
        {
            userId: req.user.id,
            fileName: file.filename,
            filePath: file.path,
            pineconeNamespace: req.user.id,
            status: "processing"

        }
    )

    try {

        const text = await extactPdfText(file.path);
        const chunks = await chunkText(text);
        await ingestChunks(chunks, doc.id.toString(), doc.pineconeNamespace)

        doc.status = 'ready'
        await doc.save()

        res.json({ success: true, doc })

    }

    catch (error) {
        doc.status = "failed"
        await doc.save();
        throw error;
    }
}
)

export {
    uploadPdf
}