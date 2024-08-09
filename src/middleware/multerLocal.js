import multer from "multer";

import AppError from "../utils/appError.js";

export const validExtension = {
  image: ["image/png", "image/jpeg"],
  pdf: ["application/pdf"],
  video: ["video/mp4"],
};

export const multerHost = (customValidation = ["image/png"]) => {
  const storage = multer.diskStorage();

  const fileFilter = (req, file, cb) => {
    if (customValidation.includes(file.mimetype)) {
      return cb(null, true);
    }
    return cb(new AppError("File type not supported", 400), false); // Provide more specific error
  };

  const upload = multer({ fileFilter, storage });
  return upload;
};
