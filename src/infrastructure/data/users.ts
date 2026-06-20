export type User = {
  id: string
  name: string
  email: string
  password: string // In real app, this would be hashed
  role: 'penjual' | 'pembeli'
}

// Mock users database
export const users: User[] = [
  {
    id: 'user-1',
    name: 'Ahmad Penjual',
    email: 'penjual@test.com',
    password: '123456',
    role: 'penjual',
  },
  {
    id: 'user-2',
    name: 'Budi Pembeli',
    email: 'pembeli@test.com',
    password: '123456',
    role: 'pembeli',
  },
  {
    id: 'user-3',
    name: 'Citra Dealer',
    email: 'dealer@test.com',
    password: '123456',
    role: 'penjual',
  },
]
