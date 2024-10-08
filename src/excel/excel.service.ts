import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as csv from 'csv-parser';


@Injectable()
export class ExcelService {

  async readXlsxFile(file: Express.Multer.File) {
    return new Promise((resolve, reject) => {
      try {
        const workbook = XLSX.readFile(file.path);
        const sheetName = workbook.SheetNames[0];
        console.log('Sheet :', sheetName)
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet);
        resolve(data)
      } catch (error) {
        reject(error)
      }
    })
  }

  // async readCsvFile(file: Express.Multer.File) {
  //   const convert = (from, to) => (str) => Buffer.from(str, from)
  //   .toString(to);
  //   const hexToUtf8 = convert('hex','utf8');
  //   let csvData = hexToUtf8(file.data)
  //   .split('\r\n')
  // }

  readCsvFile(file) {
    const results = []
    fs.createReadStream(file.path)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        console.log(results)
      })

  }

  // async readCsvFile(file: Express.Multer.File): Promise<any[]>{
  //   const results = [];
  //   return new Promise((resolve, reject) => {
  //     const stream = bufferToStream(file);
  //     stream.pipe(csv()).on('data',(data)=> results.push(data)).on('end',()=> resolve(results)).on('error',(err) => reject(err));
  //   });
  // }

}


// function bufferToStream(file: Express.Multer.File){
//   const stream = new (require('stream').Readable)();
//   stream.push(file);
//   stream.push(null);
//   return stream;
// }