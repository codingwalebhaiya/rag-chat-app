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
            fileName: file.originalname,
            filePath: file.path,
            pineconeNamespace: req.user.id.toString(),
            status: "processing"

        }
    )

    try {

        const parsedText = await extactPdfText(file.path);
        // console.log(parsedText.pages)
        const chunks = await chunkText(parsedText.pages);
        console.log(chunks)

       // chunks.slice(0, 10)
            console.log("chunks:", chunks.length)
        await ingestChunks(chunks, doc._id.toString(), doc.pineconeNamespace)

        doc.status = 'ready'
        await doc.save()

        res.status(201).json({ success: true, doc })

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