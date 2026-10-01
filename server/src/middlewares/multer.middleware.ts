
// i am using aws s3 backet for file storage so i am using multer.memoryStorage() 
// if i was using local storage then i would use multer.diskStorage() 
// PDF lives in RAM temporarily
// Then upload directly to S3
// Cleaner than disk storage

import multer, { FileFilterCallback } from "multer";
import { Request } from "express";


const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true)
  } else {
    cb(new Error("Only pdf files are allowed"))
  }
}


export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter,
})
