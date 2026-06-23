import { z } from "zod";

const UploadPdfSchema = z.object({
  originalname: z.string().min(1),
  mimetype: z.literal(
    "application/pdf"
  ),
  size: z
    .number()
    .max(20 * 1024 * 1024),
});