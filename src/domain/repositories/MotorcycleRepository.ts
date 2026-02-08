import type { Motorcycle, MotorcycleId } from '../entities/Motorcycle'

export interface MotorcycleRepository {
  findAll(): Motorcycle[]
  findById(id: MotorcycleId): Motorcycle | null
}
