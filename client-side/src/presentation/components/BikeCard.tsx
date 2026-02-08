import type { Motorcycle } from '../../domain/entities/Motorcycle'
import { formatCurrency, formatKm } from '../utils/format'

export type BikeCardProps = {
  bike: Motorcycle
  onSelect: (id: string) => void
}

export const BikeCard = ({ bike, onSelect }: BikeCardProps) => {
  return (
    <article className="bike-card">
      <div className="bike-thumb" style={{ background: bike.thumbnailColor }}>
        <img src={bike.imageUrl} alt={bike.name} />
        <span className="bike-tag">{bike.highlightTag}</span>
      </div>
      <div className="bike-info">
        <h3>{bike.name}</h3>
        <div className="bike-meta">
          <span>{bike.year}</span>
          <span>{formatKm(bike.mileageKm)}</span>
          <span>{bike.location}</span>
        </div>
        <div className="bike-price">{formatCurrency(bike.price)}</div>
        <div className="bike-actions">
          <button className="btn outline" onClick={() => onSelect(bike.id)}>
            Cek Detail
          </button>
          <button className="btn primary">Ajukan Kredit</button>
        </div>
      </div>
    </article>
  )
}
