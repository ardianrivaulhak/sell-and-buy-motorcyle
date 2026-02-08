import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import { listingsRouter } from './routes/listings'
import { authRouter } from './routes/auth'

dotenv.config()

const app = express()
const port = Number(process.env.PORT ?? 4000)

app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  }),
)
app.use(express.json({ limit: '5mb' }))

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'sell-and-buy-backend' })
})

app.use('/auth', authRouter)
app.use('/listings', listingsRouter)

app.use((_req, res) => {
  res.status(404).json({ error: { message: 'Not Found' } })
})

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err)
  res.status(500).json({ error: { message: 'Internal Server Error' } })
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
