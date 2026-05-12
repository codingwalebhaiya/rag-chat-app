import { generateAnswer } from "../services/answer.service.js";
import { retrieveContext } from "../services/retrieve.service.js";
import asyncHandler from "../utils/asyncHandler.js";



const chatWithDocs = asyncHandler(async (req, res) => {
    const { message } = req.body;
    if (!message) {
        return res.status(400).json({
            success: false,
            message: 'Message required'
        })
    }

    const nameSpaceId = req.user.id;
    const context = retrieveContext(message, nameSpaceId);
    const answer = await generateAnswer(message, (await context).toString())

    res.json({
        success: true,
        answer
    })

})

export {
    chatWithDocs
}