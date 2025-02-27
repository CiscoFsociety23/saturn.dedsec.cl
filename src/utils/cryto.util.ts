import * as crypto from 'crypto';
import { PropertyUtil } from './property.util';
import { Logger } from '@nestjs/common';

export default class CryptoUtil {

    private encoding: BufferEncoding = 'hex';
    private property: PropertyUtil = new PropertyUtil();
    private logger: Logger = new Logger(CryptoUtil.name);
    private key: string | undefined; 

    private splitEncryptedText(encryptedText: string) {
        return { ivString: encryptedText.slice(0, 32), encryptedDataString: encryptedText.slice(32) };
    };

    public async encrypt(plaintext: string): Promise<string | undefined> {
        try {
            this.logger.log('[ encrypt() ]: Iniciando proceso de encriptado');
            const iv = crypto.randomBytes(16);
            this.key = await this.property.getProperty('Crypto Key');
            const cipher = crypto.createCipheriv('aes-256-cbc', String(this.key), iv);
            const encrypted = Buffer.concat([cipher.update(plaintext, 'utf-8'), cipher.final()]);
            return iv.toString(this.encoding) + encrypted.toString(this.encoding);
        } catch (e) {
            this.logger.error('[ encrypt() ]: Ha ocurrido un error en el proceso de encriptado');
            console.error(e);
        };
    };

    public async decrypt(cipherText: string): Promise<string | undefined> {
        const { encryptedDataString, ivString } = this.splitEncryptedText(cipherText);
        try {
            this.logger.log('[ decrypt() ]: Iniciando proceso de desencriptado');
            const iv = Buffer.from(ivString, this.encoding);
            this.key = await this.property.getProperty('Crypto Key');
            const encryptedText = Buffer.from(encryptedDataString, this.encoding);
            const decipher = crypto.createDecipheriv('aes-256-cbc', String(this.key), iv);
            const decrypted = decipher.update(encryptedText);
            return Buffer.concat([decrypted, decipher.final()]).toString();
        } catch (e) {
            this.logger.error('[ decrypt() ]: Ha ocurrido un error en el proceso de desencriptado');
            console.error(e);
        };
    };
}
