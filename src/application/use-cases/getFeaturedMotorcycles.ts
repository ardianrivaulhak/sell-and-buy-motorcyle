import type { Motorcycle } from '../../domain/entities/Motorcycle'
import type { MotorcycleRepository } from '../../domain/repositories/MotorcycleRepository'

export const getFeaturedMotorcycles = (
  repository: MotorcycleRepository,
  limit = 6,
): Motorcycle[] => {
  return repository.findAll().filter((item) => item.isFeatured).slice(0, limit)
}
