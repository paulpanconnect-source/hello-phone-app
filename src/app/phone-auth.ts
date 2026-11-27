import {
  ConfirmationResult,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from 'firebase/auth';
import { auth } from './firebase';

let verifier: RecaptchaVerifier | null = null;

export function toE164(mobile: string): string {
  const digits = mobile.replace(/\D/g, '');
  const local =
    digits.length === 11 && digits.startsWith('1') ? digits.slice(1) : digits;
  return `+1${local}`;
}

export async function sendSmsCode(
  buttonId: string,
  mobile: string,
): Promise<ConfirmationResult> {
  const host = globalThis.location?.hostname ?? '';
  if (host === 'localhost' || host === '127.0.0.1') {
    auth.settings.appVerificationDisabledForTesting = true;
  }
  verifier?.clear();
  verifier = new RecaptchaVerifier(auth, buttonId, { size: 'invisible' });
  try {
    return await signInWithPhoneNumber(auth, toE164(mobile), verifier);
  } catch (error) {
    verifier.clear();
    verifier = null;
    throw error;
  }
}

export function checkSmsCode(
  confirmation: ConfirmationResult,
  code: string,
): Promise<unknown> {
  return confirmation.confirm(code);
}
