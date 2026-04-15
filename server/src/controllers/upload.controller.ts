import { generateUploadUrl } from "../services/upload.service.js";
import asyncHandler from "../utils/asyncHandler.js";


const getUploadUrl = asyncHandler(async (req, res) => {

    try {
        const { fileName, fileType } = req.body;

        if (!fileName || !fileType) {
            return res.status(400).json({ message: "File name and type are required" });
        }

        const userId = req.user.id; ;
        const { uploadUrl, fileKey } = await generateUploadUrl(
            fileName,
            fileType,
            userId
        );

        return res.status(200).json({
            uploadUrl,
            fileKey
        })
    }
    catch (error) {
        res.status(500).json({ error: "Failed to generate upload URL" });
    }
})

export default getUploadUrl;