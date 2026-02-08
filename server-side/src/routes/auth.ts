import { Router } from 'express'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'node:crypto'
import { prisma } from '../db/prisma'

export const authRouter = Router()

const registerSchema = z
  .object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(['penjual', 'pembeli']),
  })
  .strict()

const loginSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(6),
  })
  .strict()

const refreshSchema = z
  .object({
    refreshToken: z.string().min(20),
  })
  .strict()

const sendError = (
  res: any,
  status: number,
  message: string,
  issues?: { path: string; message: string }[],
) => {
  res.status(status).json({ error: { message, issues } })
}

const signAccessToken = (payload: { id: string; role: string; email: string }) => {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET is not configured')
  }

  return jwt.sign(
    { sub: payload.id, role: payload.role, email: payload.email },
    secret,
    { expiresIn: '15m' },
  )
}

const hashToken = (token: string) =>
  crypto.createHash('sha256').update(token).digest('hex')

const createRefreshToken = async (userId: string) => {
  const token = crypto.randomBytes(48).toString('hex')
  const tokenHash = hashToken(token)
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  await prisma.refreshToken.create({
    data: {
      tokenHash,
      userId,
      expiresAt,
    },
  })

  return token
}

const rotateRefreshToken = async (token: string) => {
  const tokenHash = hashToken(token)
  const existing = await prisma.refreshToken.findUnique({
    where: { tokenHash },
    include: { user: true },
  })

  if (!existing || existing.revokedAt) return null
  if (existing.expiresAt.getTime() < Date.now()) return null

  await prisma.refreshToken.update({
    where: { tokenHash },
    data: { revokedAt: new Date() },
  })

  const newToken = await createRefreshToken(existing.userId)
  return { user: existing.user, refreshToken: newToken }
}

const revokeRefreshToken = async (token: string) => {
  const tokenHash = hashToken(token)
  const existing = await prisma.refreshToken.findUnique({ where: { tokenHash } })
  if (!existing) return
  await prisma.refreshToken.update({
    where: { tokenHash },
    data: { revokedAt: new Date() },
  })
}

const sanitizeUser = (user: { id: string; name: string; email: string; role: string }) => user

authRouter.post('/register', async (req: any, res: any) => {
  const parsed = registerSchema.safeParse(req.body)
  if (!parsed.success) {
    sendError(
      res,
      400,
      'Validation error',
      parsed.error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    )
    return
  }

  const { name, email, password, role } = parsed.data
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    sendError(res, 409, 'Email already registered')
    return
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: { name, email, passwordHash, role },
  })

  const accessToken = signAccessToken({ id: user.id, role: user.role, email: user.email })
  const refreshToken = await createRefreshToken(user.id)
  res.status(201).json({ data: sanitizeUser(user), accessToken, refreshToken })
})

authRouter.post('/login', async (req: any, res: any) => {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) {
    sendError(
      res,
      400,
      'Validation error',
      parsed.error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    )
    return
  }

  const { email, password } = parsed.data
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    sendError(res, 401, 'Email atau password salah')
    return
  }

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) {
    sendError(res, 401, 'Email atau password salah')
    return
  }

  const accessToken = signAccessToken({ id: user.id, role: user.role, email: user.email })
  const refreshToken = await createRefreshToken(user.id)
  res.json({ data: sanitizeUser(user), accessToken, refreshToken })
})

authRouter.post('/refresh', async (req: any, res: any) => {
  const parsed = refreshSchema.safeParse(req.body)
  if (!parsed.success) {
    sendError(
      res,
      400,
      'Validation error',
      parsed.error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    )
    return
  }

  const rotated = await rotateRefreshToken(parsed.data.refreshToken)
  if (!rotated) {
    sendError(res, 401, 'Refresh token invalid or expired')
    return
  }

  const accessToken = signAccessToken({
    id: rotated.user.id,
    role: rotated.user.role,
    email: rotated.user.email,
  })

  res.json({
    data: sanitizeUser(rotated.user),
    accessToken,
    refreshToken: rotated.refreshToken,
  })
})

authRouter.post('/logout', async (req: any, res: any) => {
  const parsed = refreshSchema.safeParse(req.body)
  if (!parsed.success) {
    sendError(
      res,
      400,
      'Validation error',
      parsed.error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    )
    return
  }

  await revokeRefreshToken(parsed.data.refreshToken)
  res.status(204).send()
})
