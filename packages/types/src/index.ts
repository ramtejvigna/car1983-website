// ─── Enums / Literal Types ───────────────────────────────────────────────────

export type TripStatus =
  | 'REQUESTED'
  | 'MATCHED'
  | 'STARTED'
  | 'COMPLETED'
  | 'CANCELLED'

export type DriverStatus = 'PENDING' | 'ACTIVE' | 'REJECTED' | 'SUSPENDED'

export type RiderStatus = 'ACTIVE' | 'SUSPENDED'

export type PaymentStatus = 'PENDING' | 'CAPTURED' | 'FAILED' | 'REFUNDED'

export type DriverApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

// ─── Core Domain Interfaces ──────────────────────────────────────────────────

export interface Rider {
  id: string
  phone: string
  name: string | null
  email: string | null
  status: RiderStatus
  createdAt: string
  updatedAt: string
}

export interface Driver {
  id: string
  phone: string
  name: string
  email: string | null
  status: DriverStatus
  onboardingStep: number
  approvalStatus: DriverApprovalStatus
  rating: number | null
  totalTrips: number
  createdAt: string
  updatedAt: string
}

export interface Vehicle {
  id: string
  driverId: string
  make: string
  model: string
  year: number
  color: string
  licensePlate: string
  createdAt: string
  updatedAt: string
}

export interface Trip {
  id: string
  riderId: string
  driverId: string | null
  status: TripStatus
  pickupAddress: string
  dropoffAddress: string
  pickupLat: number
  pickupLng: number
  dropoffLat: number
  dropoffLng: number
  fareEstimateCents: number
  fareFinalCents: number | null
  distanceMeters: number | null
  durationSeconds: number | null
  createdAt: string
  updatedAt: string
}

export interface FareEstimate {
  vehicleType: string
  estimateCents: number
  estimateMin: number
  estimateMax: number
  distanceMeters: number
  durationSeconds: number
  surgeMultiplier: number
}

export interface PaymentIntent {
  id: string
  tripId: string
  amountCents: number
  currency: string
  status: PaymentStatus
  stripePaymentIntentId: string
  createdAt: string
}

export interface PricingZone {
  id: string
  name: string
  baseRateCents: number
  perMileRateCents: number
  perMinuteRateCents: number
  minimumFareCents: number
  surgeMultiplier: number
  isActive: boolean
}

export interface PromoCode {
  id: string
  code: string
  discountPercent: number | null
  discountCents: number | null
  maxUses: number | null
  usedCount: number
  expiresAt: string | null
  isActive: boolean
  createdAt: string
}

// ─── API Response Wrappers ───────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface ApiError {
  statusCode: number
  message: string
  error: string
}
