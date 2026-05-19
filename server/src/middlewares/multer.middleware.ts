import multer from "multer";
import path from "path";
//import fs from "fs"

// const uploadDir = "./public/temp";

// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, {
//     recursive: true,
//   });
// }

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
    //cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    //cb(null, file.originalname);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `pdf-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req: any, file: any, cb: any) => {
  //const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp", "image/svg", "image/gif"];
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only PDF files are allowed."
      ),
      false
    );
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});