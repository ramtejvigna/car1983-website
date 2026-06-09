export type AccountStatus = "ACTIVE" | "SUSPENDED" | "DELETED" | "PENDING_VERIFICATION";

export type UserListItem = {
  id: string;
  fullName: string | null;
  email: string | null;
  phoneNumber: string | null;
  role: "RIDER" | "DRIVER" | "ADMIN";
  status: AccountStatus;
  driverRegistrationStatus?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type UserListResponse = {
  items: UserListItem[];
  total: number;
  page: number;
  limit: number;
  pages: number;
};

export type StatusFilter = "ALL" | "ACTIVE" | "SUSPENDED" | "PENDING_VERIFICATION" | "DELETED";

type APIResponse<T> = {
  success: boolean;
  data: T;
  meta: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrevious: boolean;
    };
  };
};

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function statusChipClass(status: AccountStatus) {
  if (status === "ACTIVE") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (status === "SUSPENDED") return "bg-red-50 text-red-700 border-red-200";
  if (status === "PENDING_VERIFICATION") return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-slate-50 text-slate-700 border-slate-200";
}

export function onboardingChipClass(status?: string | null) {
  const normalized = (status || "NOT_STARTED").toUpperCase();
  if (normalized === "APPROVED" || normalized === "COMPLETED") {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }
  if (normalized === "REJECTED") return "bg-red-50 text-red-700 border-red-200";
  if (
    normalized === "PENDING_APPROVAL" ||
    normalized === "PENDING_REVIEW" ||
    normalized === "IN_REVIEW" ||
    normalized === "IN_PROGRESS" ||
    normalized === "NEEDS_RESUBMISSION"
  ) {
    return "bg-amber-50 text-amber-700 border-amber-200";
  }
  return "bg-slate-50 text-slate-600 border-slate-200";
}

export function getInitials(name?: string | null) {
  if (!name?.trim()) return "?";
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("") || "?";
}

export function parseUserListResponse(json: unknown, page: number): UserListResponse {
  const empty = { items: [], total: 0, page, limit: 20, pages: 0 };

  if (!json || typeof json !== "object") {
    return empty;
  }

  if ("success" in json && "data" in json && Array.isArray((json as APIResponse<UserListItem[]>).data)) {
    const wrapped = json as APIResponse<UserListItem[]>;
    return {
      items: wrapped.data,
      total: wrapped.meta?.pagination?.total ?? 0,
      page: wrapped.meta?.pagination?.page ?? page,
      limit: wrapped.meta?.pagination?.limit ?? 20,
      pages: wrapped.meta?.pagination?.totalPages ?? 0,
    };
  }

  if ("items" in json && Array.isArray((json as UserListResponse).items)) {
    const unwrapped = json as UserListResponse;
    return {
      items: unwrapped.items,
      total: unwrapped.total,
      page: unwrapped.page,
      limit: unwrapped.limit,
      pages: unwrapped.pages,
    };
  }

  return empty;
}

export function parseUserDetails<T>(json: unknown): T | null {
  if (!json || typeof json !== "object") {
    return null;
  }

  if ("success" in json && "data" in json && (json as APIResponse<T>).data) {
    return (json as APIResponse<T>).data;
  }

  return json as T;
}

export async function adminFetch<T>(
  path: string,
  token: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      "x-admin-token": token.trim(),
      ...(init?.headers ?? {}),
    },
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error((json as { message?: string }).message ?? "Request failed");
  }

  return json as T;
}
