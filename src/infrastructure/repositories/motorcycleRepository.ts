import type { Motorcycle, MotorcycleId } from '../../domain/entities/Motorcycle'
import type { MotorcycleRepository } from '../../domain/repositories/MotorcycleRepository'
import { motorcycles } from '../data/motorcycles'

class InMemoryMotorcycleRepository implements MotorcycleRepository {
  private readonly items: Motorcycle[]

  constructor(data: Motorcycle[]) {
    this.items = data
  }

  findAll(): Motorcycle[] {
    return [...this.items]
  }

  findById(id: MotorcycleId): Motorcycle | null {
    return this.items.find((item) => item.id === id) ?? null
  }
}

export const motorcycleRepository = new InMemoryMotorcycleRepository(motorcycles)
