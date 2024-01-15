import { Request } from 'express';
import multer from 'multer';

const storage = multer.diskStorage({
  filename: (req: Request, file: Express.Multer.File, cb) => {
    const originalNameParts = file.originalname.split('.');
    const fileExtension = originalNameParts[originalNameParts.length - 1];
    const fileName = `${Date.now()}.${fileExtension}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage });
export default upload;
