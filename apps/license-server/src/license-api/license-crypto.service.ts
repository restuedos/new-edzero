import { Injectable } from '@nestjs/common';
import { createPrivateKey, createPublicKey, privateDecrypt, sign, verify, constants } from 'node:crypto';
import { readFileSync, existsSync } from 'node:fs';

@Injectable()
export class LicenseCryptoService {
  decryptPayload(payloadBase64: string): string | null {
    const path = process.env.LICENSE_DECRYPT_PRIVATE_KEY_PATH ?? 'client-keys/decrypt-private.rsa';
    if (!existsSync(path)) return null;

    try {
      const key = createPrivateKey(readFileSync(path, 'utf8'));
      const binary = Buffer.from(payloadBase64, 'base64');
      const decrypted = privateDecrypt(
        { key, padding: constants.RSA_PKCS1_OAEP_PADDING, oaepHash: 'sha256' },
        binary,
      );
      return decrypted.toString('utf8');
    } catch {
      return null;
    }
  }

  signToken(token: string): string | null {
    const path = process.env.LICENSE_SIGN_PRIVATE_KEY_PATH ?? 'client-keys/sign-private.rsa';
    if (!existsSync(path)) return null;

    try {
      const key = createPrivateKey(readFileSync(path, 'utf8'));
      const signature = sign('sha256', Buffer.from(token), key);
      return signature.toString('base64');
    } catch {
      return null;
    }
  }

  verifyAndDecodeLicenseToken(
    licenseToken: string,
    signatureBase64: string,
  ): Record<string, unknown> | null {
    const path =
      process.env.LICENSE_VERIFICATION_PUBLIC_KEY_PATH ?? 'client-keys/verification-public.rsa';
    if (!existsSync(path)) return null;

    try {
      const key = createPublicKey(readFileSync(path, 'utf8'));
      const sig = Buffer.from(signatureBase64, 'base64');
      const valid = verify('sha256', Buffer.from(licenseToken), key, sig);
      if (!valid) return null;

      const json = Buffer.from(licenseToken, 'base64').toString('utf8');
      return JSON.parse(json) as Record<string, unknown>;
    } catch {
      return null;
    }
  }
}
