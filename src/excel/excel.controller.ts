import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Res, NotFoundException, BadRequestException } from '@nestjs/common';
import { ExcelService } from './excel.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import * as fs from 'fs'
import * as csv from 'csv-parser';
import * as path from 'path';

@Controller('excel')
export class ExcelController {
  constructor(private readonly excelService: ExcelService) { }

  @Post('upload-csv')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file) {
    if (!file) {
      throw new Error('No file')
    }

    const results = []

    fs.createReadStream(file.path)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        console.log(results)
        fs.unlinkSync(file.path);
      })
      console.log('this result: ',results)
      return results
  }

  @Post('upload-xlsx')
  @UseInterceptors(FileInterceptor('file'))
  uploadXlsx(@UploadedFile() file) {
    if (!file) {
      throw new NotFoundException('no file')
    }
    console.log('this file: ',file)
    const file_ext = path.extname(file.originalname)
    if (file_ext === '.xlsx') {
      const data = this.excelService.readXlsxFile(file)
    // delete file upload at the end process
    fs.unlinkSync(file.path);
    return data;
    }
    if (file_ext === '.csv') {
      this.excelService.readCsvFile(file)
    // delete file upload at the end process
    fs.unlinkSync(file.path);
    
    // return data;
      return 'success csv'
    }

    fs.unlinkSync(file.path);
    throw new BadRequestException('file not xlsx');
  }

  // @Post('upload-csv')
  // @UseInterceptors(FileInterceptor('file'))
  // async uploadCsv(@UploadedFile() file: Express.Multer.File, @Res() res: Response) {
  //   if (!file) {
  //     return res.status(400).send('No file uploaded.');
  //   }

  //   // Read CSV file
  //   const data = await this.excelService.readCsvFile(file.buffer);

  //   // Return the extracted data from CSV file
  //   return data;
  // }
}
