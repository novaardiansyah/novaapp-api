import { DateTime, DurationLikeObject } from 'luxon'
import bcrypt from 'bcryptjs'
import { randomBytes } from 'crypto'

export function getTimes(
  plusObj?: DurationLikeObject,
  format: string = 'yyyy-MM-dd HH:mm:ss',
  zone: string = 'Asia/Jakarta'
) {
  if (!plusObj) return DateTime.now().setZone(zone).toFormat(format)
  return DateTime.now().setZone(zone).plus(plusObj).toFormat(format)
}

export async function generateRefreshToken(): Promise<{ plain: string, hash: string }> {
  const plain = randomBytes(64).toString("hex"); // 128 char random token
  const hash = await bcrypt.hash(plain, 10);
  return { plain, hash };
}