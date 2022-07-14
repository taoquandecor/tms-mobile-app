import { Injectable } from '@angular/core';

import * as JsEncryptModule from 'jsencrypt';
import sha256 from 'crypto-js/sha256';

@Injectable()
export class CryptographyService {
  getRandomString(length: number): string {
    const allowedChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let text = '';

    for (let i = 0; i < length; i++) {
      text += allowedChars.charAt(Math.floor(Math.random() * allowedChars.length));
    }
    return text;
  }

  encryptRsa(message: string, key: string) {
    const encrypt = new JsEncryptModule.JSEncrypt();
    encrypt.setPublicKey(key);
    const cipher = encrypt.encrypt(message);

    return cipher === false ? undefined : cipher;
  }

  sha256(message: string | undefined) {
    return sha256(message || '').toString();
  }
}
