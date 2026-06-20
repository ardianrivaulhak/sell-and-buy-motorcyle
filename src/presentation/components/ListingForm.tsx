import { useEffect, useMemo, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import type {
  FuelType,
  Listing,
  ListingCategory,
  ListingCondition,
  ListingStatus,
  Transmission,
} from '../../domain/entities/Listing'

const statusLabels: ListingStatus[] = ['Aktif', 'Ditinjau', 'Draft', 'Terjual']

const draftStorageKey = 'sell-marketplace-draft-v1'

type ListingFormState = {
  category: ListingCategory
  title: string
  price: string
  location: string
  status: ListingStatus
  description: string
  year: string
  mileageKm: string
  transmission: Transmission
  fuelType: FuelType
  color: string
  condition: ListingCondition
  features: string
}

const defaultFormState: ListingFormState = {
  category: 'Motor',
  title: '',
  price: '',
  location: 'Jakarta Selatan',
  status: 'Aktif',
  description: '',
  year: `${new Date().getFullYear()}`,
  mileageKm: '',
  transmission: 'Automatic',
  fuelType: 'Bensin',
  color: '',
  condition: 'Terawat',
  features: '',
}

export type ListingFormProps = {
  allListings: Listing[]
  onUpsertListing: (
    payload: {
      category: Listing['category']
      title: string
      price: number
      location: string
      status: Listing['status']
      description: string
      year: number
      mileageKm: number
      transmission: Listing['transmission']
      fuelType: Listing['fuelType']
      color: string
      condition: Listing['condition']
      features: string[]
    },
    photos: string[],
    editingId?: string,
  ) => Promise<void>
}

export const ListingForm = ({ allListings, onUpsertListing }: ListingFormProps) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const editId = searchParams.get('edit')
  const editingListing = useMemo(
    () => (editId ? allListings.find((item) => item.id === editId) ?? null : null),
    [allListings, editId],
  )
  const [formState, setFormState] = useState<ListingFormState>(defaultFormState)
  const [localPhotos, setLocalPhotos] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [hasInitialized, setHasInitialized] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      localPhotos.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [localPhotos])

  useEffect(() => {
    if (editingListing) {
      setFormState({
        category: editingListing.category,
        title: editingListing.title,
        price: `${editingListing.price.amount}`,
        location: editingListing.location,
        status: editingListing.status,
        description: editingListing.description,
        year: `${editingListing.year}`,
        mileageKm: `${editingListing.mileageKm}`,
        transmission: editingListing.transmission,
        fuelType: editingListing.fuelType,
        color: editingListing.color,
        condition: editingListing.condition,
        features: editingListing.features.join(', '),
      })
      setLocalPhotos(editingListing.photos)
      setSubmitError(null)
      setHasInitialized(true)
      return
    }

    if (hasInitialized) return

    const rawDraft = localStorage.getItem(draftStorageKey)
    if (rawDraft) {
      try {
        const parsed = JSON.parse(rawDraft) as {
          formState: ListingFormState
          photos: string[]
        }
        setFormState(parsed.formState ?? defaultFormState)
        setLocalPhotos(parsed.photos ?? [])
      } catch {
        setFormState(defaultFormState)
        setLocalPhotos([])
      }
    }
    setHasInitialized(true)
  }, [editingListing, hasInitialized])

  useEffect(() => {
    setHasInitialized(false)
  }, [editId])

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])
    if (files.length === 0) return
    Promise.all(
      files.map(
        (file) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => resolve(reader.result as string)
            reader.onerror = () => reject(reader.error)
            reader.readAsDataURL(file)
          }),
      ),
    )
      .then((dataUrls) => {
        setLocalPhotos((prev) => {
          prev.forEach((url) => URL.revokeObjectURL(url))
          return dataUrls
        })
      })
      .catch(() => {
        const nextUrls = files.map((file) => URL.createObjectURL(file))
        setLocalPhotos((prev) => {
          prev.forEach((url) => URL.revokeObjectURL(url))
          return nextUrls
        })
      })
  }

  const handleSaveDraft = () => {
    localStorage.setItem(
      draftStorageKey,
      JSON.stringify({ formState, photos: localPhotos }),
    )
  }

  const handleResetForm = () => {
    setFormState(defaultFormState)
    setLocalPhotos([])
    setSearchParams({})
    setSubmitError(null)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitError(null)
    setSubmitting(true)
    const price = Number(formState.price)
    const year = Number(formState.year)
    const mileageKm = Number(formState.mileageKm)
    const features = formState.features
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean)

    try {
      await onUpsertListing(
        {
          category: formState.category,
          title: formState.title.trim(),
          price: Number.isNaN(price) ? 0 : price,
          location: formState.location.trim(),
          status: formState.status,
          description: formState.description.trim(),
          year: Number.isNaN(year) ? new Date().getFullYear() : year,
          mileageKm: Number.isNaN(mileageKm) ? 0 : mileageKm,
          transmission: formState.transmission,
          fuelType: formState.fuelType,
          color: formState.color.trim(),
          condition: formState.condition,
          features,
        },
        localPhotos,
        editingListing?.id,
      )
      localStorage.removeItem(draftStorageKey)
      setHasInitialized(false)
    } catch (err) {
      setSubmitError((err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="form-card">
      <div className="form-head">
        <div>
          <h2>{editingListing ? 'Edit listing' : 'Buat listing jual'}</h2>
          <p className="muted">Lengkapi informasi agar cepat dilirik pembeli.</p>
        </div>
      </div>
      {editingListing ? (
        <div className="edit-banner">
          Sedang mengedit: <strong>{editingListing.title}</strong>
        </div>
      ) : null}
      {submitError ? <p className="form-error">{submitError}</p> : null}
      <form className="form-grid" onSubmit={handleSubmit}>
        <label className="field">
          <span>Kategori</span>
          <select
            value={formState.category}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                category: event.target.value as ListingCategory,
              }))
            }
          >
            <option>Motor</option>
            <option>Mobil</option>
          </select>
        </label>
        <label className="field">
          <span>Judul listing</span>
          <input
            placeholder="Contoh: Honda Brio RS 2021"
            value={formState.title}
            onChange={(event) =>
              setFormState((prev) => ({ ...prev, title: event.target.value }))
            }
          />
        </label>
        <label className="field">
          <span>Harga</span>
          <input
            placeholder="Contoh: 178000000"
            value={formState.price}
            onChange={(event) =>
              setFormState((prev) => ({ ...prev, price: event.target.value }))
            }
          />
        </label>
        <label className="field">
          <span>Lokasi</span>
          <select
            value={formState.location}
            onChange={(event) =>
              setFormState((prev) => ({ ...prev, location: event.target.value }))
            }
          >
            <option>Jakarta Selatan</option>
            <option>Bandung</option>
            <option>Surabaya</option>
            <option>Bekasi</option>
            <option>Tangerang</option>
          </select>
        </label>
        <label className="field">
          <span>Status iklan</span>
          <select
            value={formState.status}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                status: event.target.value as ListingStatus,
              }))
            }
          >
            {statusLabels.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Tahun</span>
          <input
            placeholder="2023"
            value={formState.year}
            onChange={(event) =>
              setFormState((prev) => ({ ...prev, year: event.target.value }))
            }
          />
        </label>
        <label className="field">
          <span>Kilometer</span>
          <input
            placeholder="5200"
            value={formState.mileageKm}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                mileageKm: event.target.value,
              }))
            }
          />
        </label>
        <label className="field">
          <span>Transmisi</span>
          <select
            value={formState.transmission}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                transmission: event.target.value as Transmission,
              }))
            }
          >
            <option value="Automatic">Automatic</option>
            <option value="Manual">Manual</option>
          </select>
        </label>
        <label className="field">
          <span>Bahan bakar</span>
          <select
            value={formState.fuelType}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                fuelType: event.target.value as FuelType,
              }))
            }
          >
            <option value="Bensin">Bensin</option>
            <option value="Diesel">Diesel</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Listrik">Listrik</option>
          </select>
        </label>
        <label className="field">
          <span>Warna</span>
          <input
            placeholder="Hitam doff"
            value={formState.color}
            onChange={(event) =>
              setFormState((prev) => ({ ...prev, color: event.target.value }))
            }
          />
        </label>
        <label className="field">
          <span>Kondisi</span>
          <select
            value={formState.condition}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                condition: event.target.value as ListingCondition,
              }))
            }
          >
            <option value="Baru">Baru</option>
            <option value="Seperti baru">Seperti baru</option>
            <option value="Terawat">Terawat</option>
            <option value="Standar">Standar</option>
          </select>
        </label>
        <label className="field full">
          <span>Deskripsi</span>
          <textarea
            rows={4}
            placeholder="Cerita kondisi, servis, dan bonus..."
            value={formState.description}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                description: event.target.value,
              }))
            }
          />
        </label>
        <label className="field full">
          <span>Fitur utama (pisahkan dengan koma)</span>
          <input
            placeholder="ABS, Keyless, Kamera mundur"
            value={formState.features}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                features: event.target.value,
              }))
            }
          />
        </label>
        <label className="field full">
          <span>Foto kendaraan</span>
          <div className="upload-box">
            <input
              ref={fileInputRef}
              className="upload-input"
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoChange}
            />
            <p>Tarik & lepas foto di sini, atau klik untuk upload</p>
            <button
              className="btn ghost"
              type="button"
              onClick={() => fileInputRef.current?.click()}
            >
              Upload Foto
            </button>
            {localPhotos.length > 0 ? (
              <div className="upload-preview">
                {localPhotos.map((photo) => (
                  <div className="upload-thumb" key={photo}>
                    <img src={photo} alt="Preview foto kendaraan" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="muted upload-note">
                Preview lokal saja (belum tersimpan ke backend).
              </p>
            )}
          </div>
        </label>
        <div className="form-actions full">
          <button className="btn ghost" type="button" onClick={handleSaveDraft}>
            Simpan Draft
          </button>
          <button className="btn outline" type="button" onClick={handleResetForm}>
            {editingListing ? 'Batal Edit' : 'Reset Form'}
          </button>
          <button className="btn primary" type="submit" disabled={submitting}>
            {submitting
              ? 'Menyimpan...'
              : editingListing
                ? 'Simpan Perubahan'
                : 'Terbitkan Listing'}
          </button>
        </div>
      </form>
    </div>
  )
}
