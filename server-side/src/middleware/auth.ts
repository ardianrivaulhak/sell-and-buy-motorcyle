import jwt from 'jsonwebtoken'

export type AuthUser = {
  id: string
  role: string
  email: string
}

export const authenticate = (req: any, res: any, next: any) => {
  const header = req.headers.authorization
  if (!header) {
    res.status(401).json({ error: { message: 'Unauthorized' } })
    return
  }

  const token = header.startsWith('Bearer ') ? header.slice(7) : header
  const secret = process.env.JWT_SECRET
  if (!secret) {
    res.status(500).json({ error: { message: 'JWT_SECRET is not configured' } })
    return
  }

  try {
    const payload = jwt.verify(token, secret) as jwt.JwtPayload
    req.user = {
      id: payload.sub as string,
      role: payload.role as string,
      email: payload.email as string,
    }
    next()
  } catch {
    res.status(401).json({ error: { message: 'Invalid token' } })
  }
}

export const requireRole = (role: string) => (req: any, res: any, next: any) => {
  if (!req.user || req.user.role !== role) {
    res.status(403).json({ error: { message: 'Forbidden' } })
    return
  }
  next()
}
