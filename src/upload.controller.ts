import { Controller, Get, Post, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Response } from 'express';
import * as path from 'path';

@Controller()
export class UploadController {

    @Post('/upload')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './uploads',  // Save files in 'uploads' folder
                filename: (req, file, cb) => {
                    const filename = `${Date.now()}-${file.originalname}`;
                    cb(null, filename);
                },
            })
        }))
    uploadFile(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            return { success: false, message: 'File not uploaded' }
        } else {
            return { success: true, message: 'File uploaded successfully', file };
        }
    }
}