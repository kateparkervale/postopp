import { describe, it, expect } from 'vitest';
import {
  generateDeviceKey,
  encrypt,
  decrypt,
  hashPin,
  verifyPin,
} from '@/lib/crypto';

describe('generateDeviceKey', () => {
  it('returns a base64 string', async () => {
    const key = await generateDeviceKey();
    expect(typeof key).toBe('string');
    expect(key.length).toBeGreaterThan(0);
    // Verify valid base64 by round-tripping
    const decoded = atob(key);
    expect(decoded.length).toBe(32);
  });
});

describe('encrypt / decrypt', () => {
  it('round-trips correctly', async () => {
    const secret = 'test-secret-key';
    const plaintext = 'Hello, PostOpp!';
    const encrypted = await encrypt(plaintext, secret);
    const decrypted = await decrypt(encrypted, secret);
    expect(decrypted).toBe(plaintext);
  });

  it('decrypt with wrong key throws', async () => {
    const encrypted = await encrypt('secret data', 'correct-key');
    await expect(decrypt(encrypted, 'wrong-key')).rejects.toThrow();
  });
});

describe('hashPin', () => {
  it('returns a non-empty string', async () => {
    const hash = await hashPin('1234');
    expect(typeof hash).toBe('string');
    expect(hash.length).toBeGreaterThan(0);
  });

  it('returns different hashes for same pin (random salt)', async () => {
    const hash1 = await hashPin('1234');
    const hash2 = await hashPin('1234');
    expect(hash1).not.toBe(hash2);
  });
});

describe('verifyPin', () => {
  it('returns true for correct pin', async () => {
    const hash = await hashPin('5678');
    const result = await verifyPin('5678', hash);
    expect(result).toBe(true);
  });

  it('returns false for wrong pin', async () => {
    const hash = await hashPin('5678');
    const result = await verifyPin('0000', hash);
    expect(result).toBe(false);
  });
});
