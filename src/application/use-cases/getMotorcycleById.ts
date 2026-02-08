import type { Motorcycle } from '../../domain/entities/Motorcycle'
import type { MotorcycleRepository } from '../../domain/repositories/MotorcycleRepository'

export const getMotorcycleById = (
  repository: MotorcycleRepository,
  id: string,
): Motorcycle | null => {
  return repository.findById(id)
}
