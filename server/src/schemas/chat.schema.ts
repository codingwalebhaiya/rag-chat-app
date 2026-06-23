import {z} from "zod";


export const chatSchema = z.object({
    message: z.string("").min(3, "message at least 3 characters long").max(200, "")
})