import { DateTime, DurationLikeObject } from 'luxon'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { randomBytes } from 'crypto'

const JWT_SECRET = process.env.JWT_SECRET || 'secret-key'

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

// ! genereteJwtToken() Start
interface generateJwtTokenParams {
  userId: number;
  email: string;
  name: string;
}

interface generateJwtTokenResponse {
  access_token: string;
  expires_in: string;
}

export async function generateJwtToken(params: generateJwtTokenParams): Promise<generateJwtTokenResponse> 
{
  const { userId, email, name } = params

  const expiresHours = 1
  const expiresIn = getTimes({ hours: expiresHours })

  const access_token = jwt.sign(
    { userId, email, name },
    JWT_SECRET,
    { expiresIn: `${expiresHours}h` }
  )

  return {
    access_token,
    expires_in: expiresIn
  }
}
// ! genereteJwtToken() End