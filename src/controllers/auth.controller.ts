import { Request, Response, Handler } from 'express'
import { UserModel, UserTokenModel, UserOtpModel } from '@/models'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { generateRefreshToken, getTimes } from '@/helpers';
import axios from 'axios';

const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';

interface IspGeoResponse {
  location?: {
    country_name?: string;
    country_flag?: string;
    city?: string;
    state_prov?: string;
    district?: string;
    zipcode?: string;
    latitude?: string;
    longitude?: string;
  };
}

export const AuthController = {
  async index(req: Request, res: Response) {  
    res.json(['Login successful']);
  },

  login: (async(req: Request, res: Response) => {
    const { email, password, ip } = req.body || {}

    const user = await UserModel.findByEmail(email)
    
    if (!user) return res.status(401).json({ message: 'Invalid credentials' })

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' })

    const expiresIn = getTimes({ day: 1 })
    const refreshToken = await generateRefreshToken()

    const token = jwt.sign(
      { userId: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '1d' }
    )

    let location = <IspGeoResponse['location']>{}

    try {
      const ispCheckUrl      = `${process.env.IPGEO_API_URL}?apiKey=${process.env.IPGEO_API_KEY}&ip=${ip}&fields=location`
      const checkIspLocation = await axios.get<IspGeoResponse>(ispCheckUrl)
      location = checkIspLocation?.data?.location || {}
    } catch (error) {
      console.error('Error fetching ISP location')
    }

    await UserTokenModel.create({
      user_id: user.id,
      token: token,
      refresh_token: refreshToken.hash,
      expires_at: new Date(expiresIn),
      ip,
      country: location?.country_name || null,
      country_flag: location?.country_flag || null,
      city: location?.city || null,
      state: location?.state_prov || null,
      district: location?.district || null,
      zipcode: location?.zipcode || null,
      latitude: location?.latitude || null,
      longitude: location?.longitude || null,
    })
    
    res.json({
      access_token: token,
      refresh_token: refreshToken.plain,
      expires_at: expiresIn,
    })
  }) as Handler,

  register: (async (req: Request, res: Response) => {
    const { email, password, name } = req.body;

    let newName = name?.trim();

    if (!name) 
      newName = email.split('@')[0];
    
    const existing = await UserModel.findByEmail(email);
    if (existing) return res.status(409).json({ message: 'Email telah terdaftar sebelumnya.' })
    
    const hash = await bcrypt.hash(password, 10);
    const userId = await UserModel.create({ email, password: hash, name: newName });
    const user = await UserModel.findById(userId);

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    await UserOtpModel.create({
      user_id: userId,
      type: 'register',
      otp,
      expired_at: new Date(getTimes({ minutes: 10 })),
    })

    sendOtpRegister(email, otp, newName)

    res.status(201).json(user);
  }) as Handler,

  me: (async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const user = await UserModel.findById(userId);

    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const { password, ...rest } = user;
    res.json(rest);
  }) as Handler,

  logout: (async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const token = req.headers['authorization']?.split(' ')[1] || '-1';
    
    await UserTokenModel.deleteByUserIdAndToken(userId, token)

    res.json({ message: 'Logout successful' })
  }) as Handler,

  refreshToken: (async (req: Request, res: Response) => {
    const { refresh_token } = req.body
    const { userId, email, name, token_id } = (req as any).user;

    const userToken = await UserTokenModel.findByIdAndUserId(token_id, userId);

    if (!userToken) {
      return res.status(401).json({ message: 'Invalid refresh token (001)' });
    }

    const isValid = await bcrypt.compare(refresh_token, userToken.refresh_token);

    if (!isValid) {
      return res.status(401).json({ message: 'Invalid refresh token (002)' });
    }

    const expiresIn = getTimes({ day: 1 })

    const newToken = jwt.sign(
      { userId: userId, email: email, name: name },
      JWT_SECRET,
      { expiresIn: '1d' }
    )

    await UserTokenModel.updateById(token_id, {
      token: newToken,
      expires_at: new Date(expiresIn),
    })

    res.json({
      access_token: newToken,
      expires_at: expiresIn,
    })
  }) as Handler,
}

async function sendOtpRegister(email: string, otp: string, name: string): Promise<void> 
{
  return axios
    .create({
      headers: {
        'Authorization': `Bearer ${process.env.ADMIN_ACCESS_TOKEN}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .post(`${process.env.ADMIN_API_URL}/auth/send-otp-register`, { email, otp, name })
    .then(() => {})
    .catch((err) => {
      console.error('Error: ', err.message);
    });
}