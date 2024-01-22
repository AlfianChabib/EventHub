import cloudinary from '@/utils/cloudinary';
import { Request, Response, NextFunction } from 'express';

export const imageUploader = async (req: Request, res: Response) => {
  try {
    const path = req.file?.path;

    if (!path) {
      return res.status(400).json({
        code: 400,
        message: 'No file uploaded',
      });
    }

    cloudinary.uploader.upload(path, async (error, result) => {
      if (error) {
        return res.status(500).json({
          code: 500,
          message: error,
        });
      }

      if (!result) {
        return res.status(500).json({
          code: 500,
          message: 'Something went wrong',
        });
      }

      const {
        original_filename,
        width,
        height,
        public_id,
        secure_url,
        created_at,
      } = result;

      return res.status(200).json({
        code: 200,
        message: 'image uploaded successfully',
        data: {
          original_filename,
          width,
          height,
          public_id,
          secure_url,
          created_at,
        },
      });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 500,
      success: false,
      message: 'Internal server error',
    });
  }
};
