import fs from 'fs';
import * as uuid from 'uuid';
import * as path from 'path';
import { UUID_NAMESPACE } from '../constants/uuid_namespace';

const qrService = {
  createQrImg: (treatedQRData: string): string => {
    const fileName = uuid.v5(treatedQRData, UUID_NAMESPACE) + '.png';
    const filePath = path.resolve('QR-codes', fileName);

    fs.writeFile(filePath, treatedQRData, { encoding: 'base64' }, () => {});
    return fileName;
  },

  deleteQrImg: (fileName: string): void => {
    const filePath = path.resolve('QR-codes', fileName);
    fs.unlink(filePath, () => {});
  }
}

export default qrService