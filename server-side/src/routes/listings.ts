import { Router } from 'express'
import { z } from 'zod'
import type { Listing } from '../domain/Listing'
import {
  createListing,
  findListing,
  getListings,
  removeListing,
  updateListing,
} from '../data/store'
import { buildListing } from './listings.helper'
import { authenticate, requireRole } from '../middleware/auth'

export const listingsRouter = Router()

const listingSchema = z
  .object({
    title: z.string().min(1).optional(),
    category: z.enum(['Motor', 'Mobil']).optional(),
    price: z
      .object({
        amount: z.number().min(0),
        currency: z.enum(['IDR']),
      })
      .optional(),
    location: z.string().min(1).optional(),
    year: z.number().int().min(1900).max(2100).optional(),
    mileageKm: z.number().int().min(0).optional(),
    condition: z
      .enum(['Baru', 'Seperti baru', 'Terawat', 'Standar', 'Siap pakai'])
      .optional(),
    status: z.enum(['Draft', 'Aktif', 'Ditinjau', 'Terjual']).optional(),
    transmission: z.enum(['Automatic', 'Manual']).optional(),
    fuelType: z.enum(['Bensin', 'Diesel', 'Hybrid', 'Listrik']).optional(),
    color: z.string().min(1).optional(),
    description: z.string().optional(),
    features: z.array(z.string()).optional(),
    photos: z.array(z.string()).optional(),
    thumbnailColor: z.string().optional(),
    views: z.number().int().min(0).optional(),
    chats: z.number().int().min(0).optional(),
    saved: z.number().int().min(0).optional(),
    createdAt: z.string().optional(),
  })
  .strict()

const statusSchema = z
  .object({
    status: z.enum(['Draft', 'Aktif', 'Ditinjau', 'Terjual']),
  })
  .strict()

const toOptionalString = (value: unknown) => {
  if (Array.isArray(value)) return value[0]
  if (value === '' || value === undefined) return undefined
  return value
}

const querySchema = z
  .object({
    category: z.preprocess(
      toOptionalString,
      z.enum(['Motor', 'Mobil']).optional(),
    ),
    status: z.preprocess(
      toOptionalString,
      z.enum(['Draft', 'Aktif', 'Ditinjau', 'Terjual']).optional(),
    ),
    location: z.preprocess(toOptionalString, z.string().min(1).optional()),
    term: z.preprocess(toOptionalString, z.string().min(1).optional()),
    priceMin: z.preprocess(
      toOptionalString,
      z.string().regex(/^\d+$/).optional(),
    ),
    priceMax: z.preprocess(
      toOptionalString,
      z.string().regex(/^\d+$/).optional(),
    ),
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

listingsRouter.get('/', async (req: any, res: any) => {
  const parsed = querySchema.safeParse(req.query)
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

  const listings = await getListings(parsed.data)
  res.json({ data: listings })
})

listingsRouter.get('/:id', async (req: any, res: any) => {
  const listing = await findListing(req.params.id)
  if (!listing) {
    sendError(res, 404, 'Listing not found')
    return
  }
  res.json({ data: listing })
})

listingsRouter.post('/', authenticate, requireRole('penjual'), async (req: any, res: any) => {
  const parsed = listingSchema.safeParse(req.body)
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

  const payload = parsed.data as Partial<Listing>
  const listing = buildListing(payload)
  const created = await createListing(listing, req.user?.id)
  res.status(201).json({ data: created })
})

listingsRouter.put('/:id', authenticate, requireRole('penjual'), async (req: any, res: any) => {
  const existing = await findListing(req.params.id)
  if (!existing) {
    sendError(res, 404, 'Listing not found')
    return
  }

  if (existing.sellerId && existing.sellerId !== req.user?.id) {
    sendError(res, 403, 'Forbidden')
    return
  }

  const parsed = listingSchema.safeParse(req.body)
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

  const payload = parsed.data as Partial<Listing>
  const listing = buildListing({ ...existing, ...payload }, existing.id)
  const updated = await updateListing(existing.id, listing, existing.sellerId ?? req.user?.id)
  res.json({ data: updated })
})

listingsRouter.patch('/:id/status', authenticate, requireRole('penjual'), async (req: any, res: any) => {
  const existing = await findListing(req.params.id)
  if (!existing) {
    sendError(res, 404, 'Listing not found')
    return
  }

  if (existing.sellerId && existing.sellerId !== req.user?.id) {
    sendError(res, 403, 'Forbidden')
    return
  }

  const parsed = statusSchema.safeParse(req.body)
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

  const status = parsed.data.status as Listing['status']
  const listing = buildListing({ ...existing, status }, existing.id)
  const updated = await updateListing(existing.id, listing, existing.sellerId ?? req.user?.id)
  res.json({ data: updated })
})

listingsRouter.delete('/:id', authenticate, requireRole('penjual'), async (req: any, res: any) => {
  const existing = await findListing(req.params.id)
  if (!existing) {
    sendError(res, 404, 'Listing not found')
    return
  }

  if (existing.sellerId && existing.sellerId !== req.user?.id) {
    sendError(res, 403, 'Forbidden')
    return
  }

  await removeListing(existing.id)
  res.status(204).send()
})
