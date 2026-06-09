"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { PanelHeader } from "./PanelHeader";

type UserRole = "RIDER" | "DRIVER" | "ADMIN";
type AccountStatus = "ACTIVE" | "SUSPENDED" | "DELETED" | "PENDING_VERIFICATION";

type UserListItem = {
  id: string;
  fullName: string | null;
  email: string | null;
  phoneNumber: string | null;
  role: UserRole;
  status: AccountStatus;
  driverRegistrationStatus?: string | null;
  createdAt: string;
  updatedAt: string;
};

type UserDetails = UserListItem & {
  driverRegistrationStep?: string | null;
  verification?: {
    id: string;
    driverId: string;
    status: "PENDING_REVIEW" | "IN_REVIEW" | "NEEDS_RESUBMISSION" | "APPROVED" | "REJECTED";
    priority: "LOW" | "NORMAL" | "HIGH" | "URGENT";
    assignedTo: string | null;
    licenseStatus: "PENDING" | "APPROVED" | "REJECTED" | "NEEDS_CLARIFICATION";
    licenseNotes: string | null;
    insuranceStatus: "PENDING" | "APPROVED" | "REJECTED" | "NEEDS_CLARIFICATION";
    insuranceNotes: string | null;
    registrationStatus: "PENDING" | "APPROVED" | "REJECTED" | "NEEDS_CLARIFICATION";
    registrationNotes: string | null;
    backgroundStatus: "PENDING" | "APPROVED" | "REJECTED" | "NEEDS_CLARIFICATION";
    backgroundNotes: string | null;
    decisionBy: string | null;
    decisionAt: string | null;
    decisionReason: string | null;
    submittedAt: string;
    completedAt: string | null;
    assignedAdmin?: {
      id: string;
      fullName: string;
      email: string;
    } | null;
  } | null;
  driverProfile?: {
    personalInfo?: {
      fullName: string;
      dob: string | null;
      mobile: string;
      email: string;
      emailVerified: boolean;
      addressLine1: string;
      addressLine2: string;
      city: string;
      state: string;
      country: string;
      zipCode: string;
      profilePhoto: string | null;
    };
    vehicleInfo?: {
      registrationNumber: string;
      expiryDate: string;
      registrationDoc: string | null;
      docName: string;
    } | null;
    driversLicense?: {
      licenseNumber: string;
      issuedDate: string;
      expiryDate: string;
      frontPhoto: string | null;
      backPhoto: string | null;
    } | null;
    vehicleRegistration?: {
      brandMake: string;
      model: string;
      manufactureYear: string;
      colour: string;
      licensePlate: string;
      vehiclePhoto: string | null;
    } | null;
    insuranceDocs?: {
      provider: string;
      policyNumber: string;
      expiryDate: string;
      insuranceDoc: string | null;
      docName: string;
    } | null;
    taxInfo?: {
      legalName: string;
      addressLine1: string;
      addressLine2: string;
      city: string;
      state: string;
      zipCode: string;
      isAgreed: boolean;
    } | null;
    bankDetails?: {
      bankName: string;
      accountHolderName: string;
      accountNumber: string;
      routingNumber: string;
    } | null;
    backgroundCheck?: {
      ssn: string;
      isConsented: boolean;
    } | null;
    statusInfo?: {
      registrationStatus: string;
      currentStep: string;
      driverStatus: string;
      isApproved: boolean;
      rating: number | null;
      totalTrips: number;
    };
  } | null;
};

type UserListResponse = {
  items: UserListItem[];
  total: number;
  page: number;
  limit: number;
  pages: number;
};

type RoleFilter = "ALL" | "RIDER" | "DRIVER";
type StatusFilter = "ALL" | "ACTIVE" | "SUSPENDED" | "PENDING_VERIFICATION" | "DELETED";

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
    timestamp?: string;
    requestId?: string;
    traceId?: string;
  };
};

const TOKEN_KEY = "car1983.admin.token";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function statusChipClass(status: AccountStatus) {
  if (status === "ACTIVE") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (status === "SUSPENDED") return "bg-red-50 text-red-700 border-red-200";
  if (status === "PENDING_VERIFICATION") return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-slate-50 text-slate-700 border-slate-200";
}

export function UserManagementPanel({ roleHint = "ALL" }: { roleHint?: RoleFilter }) {
  const { token: sessionToken } = useAuth();
  const [token, setToken] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<RoleFilter>(roleHint);
  const [status, setStatus] = useState<StatusFilter>("ALL");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<UserListResponse>({ items: [], total: 0, page: 1, limit: 20, pages: 0 });
  const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);
  const [viewingUser, setViewingUser] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionBusyUserId, setActionBusyUserId] = useState<string | null>(null);

  useEffect(() => {
    if (sessionToken) {
      setToken(sessionToken);
    }
  }, [sessionToken]);

  useEffect(() => {
    setRole(roleHint);
    setPage(1);
  }, [roleHint]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const hasToken = token.trim().length > 0;

  async function fetchUsers() {
    if (!hasToken) {
      setError("Set an admin JWT token to load users.");
      setData({ items: [], total: 0, page: 1, limit: 20, pages: 0 });
      return;
    }

    setLoading(true);
    setError(null);

    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (search) params.set("search", search);
    if (role !== "ALL") params.set("type", role);
    if (status !== "ALL") params.set("status", status);

    try {
      const response = await fetch(`/api/admin/users?${params.toString()}`, {
        headers: { "x-admin-token": token.trim() },
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error((json as { message?: string }).message ?? "Failed to fetch users");
      }

      let items: UserListItem[] = [];
      let total = 0;
      let pageNum = page;
      let limitNum = 20;
      let pages = 0;

      if (json && typeof json === "object") {
        if ("success" in json && "data" in json && Array.isArray(json.data)) {
          const wrapped = json as APIResponse<UserListItem[]>;
          items = wrapped.data;
          total = wrapped.meta?.pagination?.total ?? 0;
          pageNum = wrapped.meta?.pagination?.page ?? page;
          limitNum = wrapped.meta?.pagination?.limit ?? 20;
          pages = wrapped.meta?.pagination?.totalPages ?? 0;
        } else if ("items" in json && Array.isArray((json as any).items)) {
          const unwrapped = json as UserListResponse;
          items = unwrapped.items;
          total = unwrapped.total;
          pageNum = unwrapped.page;
          limitNum = unwrapped.limit;
          pages = unwrapped.pages;
        }
      }

      const parsedData: UserListResponse = {
        items,
        total,
        page: pageNum,
        limit: limitNum,
        pages,
      };

      setData(parsedData);

      if (selectedUser) {
        const stillVisible = items.some((item) => item.id === selectedUser.id);
        if (!stillVisible) {
          setSelectedUser(null);
        }
      }
    } catch (fetchError) {
      setData({ items: [], total: 0, page: 1, limit: 20, pages: 0 });
      setError(fetchError instanceof Error ? fetchError.message : "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, role, status, search, token]);

  async function loadUserDetails(userId: string) {
    if (!hasToken) return;

    setError(null);

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        headers: { "x-admin-token": token.trim() },
      });
      const json = await response.json();

      if (!response.ok) {
        throw new Error((json as { message?: string }).message ?? "Failed to fetch user details");
      }

      let userDetails: UserDetails | null = null;
      if (json && typeof json === "object") {
        if ("success" in json && "data" in json && json.data) {
          userDetails = (json as APIResponse<UserDetails>).data;
        } else {
          userDetails = json as UserDetails;
        }
      }

      setSelectedUser(userDetails);
      if (viewingUser && viewingUser.id === userId) {
        setViewingUser(userDetails);
      }
    } catch (detailError) {
      setError(detailError instanceof Error ? detailError.message : "Failed to fetch user details");
    }
  }

  async function assignVerificationToSelf(verificationId: string) {
    if (!hasToken) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/drivers/verification/${verificationId}/assign`, {
        method: "POST",
        headers: {
          "x-admin-token": token.trim(),
        },
      });
      const json = await response.json();
      if (!response.ok) {
        throw new Error(json.message ?? "Failed to assign verification to self");
      }
      if (viewingUser) {
        await loadUserDetails(viewingUser.id);
      }
      await fetchUsers();
    } catch (err: any) {
      setError(err instanceof Error ? err.message : "Failed to assign verification");
    } finally {
      setLoading(false);
    }
  }

  async function approveDriver(verificationId: string) {
    if (!hasToken) return;
    const notes = window.prompt("Optional notes/comments for approval:", "") ?? "";
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/drivers/verification/${verificationId}/approve`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-admin-token": token.trim(),
        },
        body: JSON.stringify({ notes }),
      });
      const json = await response.json();
      if (!response.ok) {
        throw new Error(json.message ?? "Failed to approve driver");
      }
      if (viewingUser) {
        await loadUserDetails(viewingUser.id);
      }
      await fetchUsers();
    } catch (err: any) {
      setError(err instanceof Error ? err.message : "Failed to approve driver");
    } finally {
      setLoading(false);
    }
  }

  async function rejectDriver(verificationId: string) {
    if (!hasToken) return;
    const reason = window.prompt("Required reason for rejection:", "");
    if (!reason || !reason.trim()) {
      alert("Rejection reason is required.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/drivers/verification/${verificationId}/reject`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-admin-token": token.trim(),
        },
        body: JSON.stringify({ reason: reason.trim() }),
      });
      const json = await response.json();
      if (!response.ok) {
        throw new Error(json.message ?? "Failed to reject driver");
      }
      if (viewingUser) {
        await loadUserDetails(viewingUser.id);
      }
      await fetchUsers();
    } catch (err: any) {
      setError(err instanceof Error ? err.message : "Failed to reject driver");
    } finally {
      setLoading(false);
    }
  }

  async function updateUserStatus(user: UserListItem) {
    if (!hasToken) return;
    if (user.status === "DELETED") return;

    const shouldBlock = user.status !== "SUSPENDED";
    const reason = shouldBlock ? window.prompt("Reason for blocking this user:", "Policy violation") ?? "" : "";

    if (shouldBlock && !reason.trim()) {
      return;
    }

    setActionBusyUserId(user.id);
    setError(null);

    try {
      const response = await fetch(`/api/admin/users/${user.id}/${shouldBlock ? "block" : "unblock"}`, {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
          "x-admin-token": token.trim(),
        },
        body: shouldBlock ? JSON.stringify({ reason: reason.trim() }) : JSON.stringify({}),
      });

      const json = (await response.json()) as { message?: string };
      if (!response.ok) {
        throw new Error(json.message ?? `Failed to ${shouldBlock ? "block" : "unblock"} user`);
      }

      await fetchUsers();
      if (selectedUser?.id === user.id) {
        await loadUserDetails(user.id);
      }
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "Failed to update user status");
    } finally {
      setActionBusyUserId(null);
    }
  }

  const subtitle = useMemo(() => {
    if (role === "RIDER") return "Manage rider accounts, access status, and profile details.";
    if (role === "DRIVER") return "Manage driver accounts, statuses, and onboarding visibility.";
    return "Search, filter, and control rider and driver accounts from one console.";
  }, [role]);

  if (viewingUser) {
    const isBusy = actionBusyUserId === viewingUser.id;
    const isSuspended = viewingUser.status === "SUSPENDED";
    const canUpdateStatus = viewingUser.status !== "DELETED";
    const driverProfile = viewingUser.driverProfile;
    const verification = viewingUser.verification;

    return (
      <section className="rounded-[30px] border border-[#e4e2ec] bg-white/90 shadow-[0_20px_45px_-35px_rgba(45,49,66,0.45)] overflow-hidden">
        {/* Detail Header */}
        <div className="bg-gradient-to-r from-[#7a53e6]/10 to-[#502bb6]/5 border-b border-[#e4e2ec] p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setViewingUser(null)}
              className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-[#d5d7e2] text-[#343b4f] hover:bg-[#f6f7fb] hover:border-[#b0b3c5] transition-all cursor-pointer shadow-sm text-lg font-bold"
              title="Back to List"
            >
              ←
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-[#1e2330]">
                  {viewingUser.fullName || "Unnamed User"}
                </h2>
                <span className="inline-flex rounded-full bg-violet-50 text-violet-700 border border-violet-200 px-2.5 py-0.5 text-xs font-semibold">
                  {viewingUser.role}
                </span>
                <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusChipClass(viewingUser.status)}`}>
                  {viewingUser.status}
                </span>
              </div>
              <p className="text-sm text-[#59617a] mt-0.5">
                {viewingUser.email || "No email"} • {viewingUser.phoneNumber || "No phone"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Block / Unblock Action */}
            <button
              type="button"
              disabled={isBusy || !canUpdateStatus}
              onClick={async () => {
                await updateUserStatus(viewingUser);
                // After status change, reload details
                setTimeout(() => {
                  void loadUserDetails(viewingUser.id);
                }, 1000);
              }}
              className={[
                "h-11 rounded-xl px-4 font-semibold border transition-all cursor-pointer flex items-center gap-2 text-sm",
                isSuspended
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                  : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
                isBusy ? "opacity-60 cursor-wait" : "",
                !canUpdateStatus ? "opacity-50 cursor-not-allowed" : "",
              ].join(" ")}
            >
              {isBusy ? "Saving..." : !canUpdateStatus ? "Unavailable" : isSuspended ? "Unblock Account" : "Block Account"}
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {error ? (
            <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          ) : null}

          {/* Verification Section */}
          {viewingUser.role === "DRIVER" && (
            <div className="rounded-2xl border border-violet-100 bg-violet-50/20 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-lg text-[#2d3142] flex items-center gap-2">
                  Driver Onboarding & Verification
                </h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm text-[#59617a]">
                  <div>
                    Status:{" "}
                    <span className={[
                      "font-semibold uppercase tracking-wider text-xs px-2 py-0.5 rounded-full border",
                      verification?.status === "APPROVED" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                      verification?.status === "REJECTED" ? "bg-red-50 text-red-700 border-red-200" :
                      verification?.status === "IN_REVIEW" ? "bg-amber-50 text-amber-700 border-amber-200" :
                      "bg-slate-50 text-slate-700 border-slate-200"
                    ].join(" ")}>
                      {verification?.status || "NOT_STARTED"}
                    </span>
                  </div>
                  <div>
                    Priority:{" "}
                    <span className="font-semibold text-[#2f3547]">{verification?.priority || "NORMAL"}</span>
                  </div>
                  <div>
                    Assigned To:{" "}
                    <span className="font-semibold text-[#2f3547]">
                      {verification?.assignedAdmin ? `${verification.assignedAdmin.fullName} (${verification.assignedAdmin.email})` : "Unassigned"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {verification ? (
                  <>
                    {/* Assign to Self Button */}
                    {verification.status !== "APPROVED" && verification.status !== "REJECTED" && (
                      <button
                        type="button"
                        onClick={() => void assignVerificationToSelf(verification.id)}
                        className="h-10 px-4 rounded-xl border border-[#d5d7e2] bg-white font-semibold text-[#343b4f] hover:bg-[#f6f7fb] transition-all cursor-pointer text-sm"
                      >
                        Assign to Me
                      </button>
                    )}

                    {/* Approve Driver Button */}
                    {verification.status !== "APPROVED" && (
                      <button
                        type="button"
                        onClick={() => void approveDriver(verification.id)}
                        className="h-10 px-4 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-all cursor-pointer text-sm shadow-sm"
                      >
                        Approve Driver
                      </button>
                    )}

                    {/* Reject Driver Button */}
                    {verification.status !== "REJECTED" && (
                      <button
                        type="button"
                        onClick={() => void rejectDriver(verification.id)}
                        className="h-10 px-4 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-all cursor-pointer text-sm shadow-sm"
                      >
                        Reject Driver
                      </button>
                    )}
                  </>
                ) : (
                  <p className="text-xs text-[#697189]">No verification record found.</p>
                )}
              </div>
            </div>
          )}

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_2fr] gap-6">
            {/* Column 1: Details */}
            <div className="space-y-6">
              {/* Profile Overview */}
              <div className="rounded-2xl border border-[#eaebf2] p-5 bg-[#fcfcff] space-y-4">
                <h4 className="font-bold text-[#1e2330] border-b border-[#f0f1f6] pb-2 text-base">Account Overview</h4>
                <dl className="grid grid-cols-1 gap-y-3 gap-x-2 text-sm">
                  <div>
                    <dt className="text-[#6d7385] text-xs">Full Legal Name</dt>
                    <dd className="font-semibold text-[#2d3447]">
                      {driverProfile?.personalInfo?.fullName || viewingUser.fullName || "-"}
                    </dd>
                  </div>
                  {driverProfile?.personalInfo?.dob && (
                    <div>
                      <dt className="text-[#6d7385] text-xs">Date of Birth</dt>
                      <dd className="text-[#2d3447]">
                        {new Date(driverProfile.personalInfo.dob).toLocaleDateString("en-US", { dateStyle: "long" })}
                      </dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-[#6d7385] text-xs">Email Address</dt>
                    <dd className="text-[#2d3447] flex items-center gap-1.5">
                      {viewingUser.email || "-"}
                      {driverProfile?.personalInfo?.emailVerified && (
                        <span className="inline-flex rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.2 text-[10px] font-semibold">
                          Verified
                        </span>
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[#6d7385] text-xs">Phone Number</dt>
                    <dd className="text-[#2d3447]">{viewingUser.phoneNumber || "-"}</dd>
                  </div>
                  <div>
                    <dt className="text-[#6d7385] text-xs">Joined Date</dt>
                    <dd className="text-[#2d3447]">{formatDate(viewingUser.createdAt)}</dd>
                  </div>
                  {driverProfile?.personalInfo?.addressLine1 && (
                    <div>
                      <dt className="text-[#6d7385] text-xs">Residential Address</dt>
                      <dd className="text-[#2d3447] text-xs leading-relaxed mt-0.5">
                        {driverProfile.personalInfo.addressLine1}
                        {driverProfile.personalInfo.addressLine2 && `, ${driverProfile.personalInfo.addressLine2}`}
                        <br />
                        {driverProfile.personalInfo.city}, {driverProfile.personalInfo.state} {driverProfile.personalInfo.zipCode}
                        <br />
                        {driverProfile.personalInfo.country}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* Bank Account Information */}
              {driverProfile?.bankDetails && (
                <div className="rounded-2xl border border-[#eaebf2] p-5 bg-[#fcfcff] space-y-4">
                  <h4 className="font-bold text-[#1e2330] border-b border-[#f0f1f6] pb-2 text-base">Bank Account Details</h4>
                  <dl className="grid grid-cols-1 gap-y-3 text-sm">
                    <div>
                      <dt className="text-[#6d7385] text-xs">Bank Name</dt>
                      <dd className="font-semibold text-[#2d3447]">{driverProfile.bankDetails.bankName}</dd>
                    </div>
                    <div>
                      <dt className="text-[#6d7385] text-xs">Account Holder Name</dt>
                      <dd className="text-[#2d3447]">{driverProfile.bankDetails.accountHolderName}</dd>
                    </div>
                    <div>
                      <dt className="text-[#6d7385] text-xs">Routing Number</dt>
                      <dd className="font-mono text-[#2d3447]">{driverProfile.bankDetails.routingNumber}</dd>
                    </div>
                    <div>
                      <dt className="text-[#6d7385] text-xs">Account Number (Masked)</dt>
                      <dd className="font-mono text-[#2d3447]">{driverProfile.bankDetails.accountNumber}</dd>
                    </div>
                  </dl>
                </div>
              )}
            </div>

            {/* Column 2: Documents & Uploads */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-[#1e2330] flex items-center gap-2">
                Uploaded Documents & Verification Items
              </h3>

              {viewingUser.role === "DRIVER" ? (
                driverProfile ? (
                  <div className="space-y-6">
                    {/* Document 1: Driver License */}
                    <div className="rounded-2xl border border-[#eaebf2] p-5 bg-white space-y-4 shadow-sm">
                      <div className="flex items-center justify-between border-b border-[#f0f1f6] pb-3">
                        <h4 className="font-bold text-[#1e2330] text-base flex items-center gap-2">
                          1. Driver's License
                        </h4>
                        <span className={[
                          "text-xs px-2.5 py-1 rounded-full font-semibold border",
                          verification?.licenseStatus === "APPROVED" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                          verification?.licenseStatus === "REJECTED" ? "bg-red-50 text-red-700 border-red-200" :
                          verification?.licenseStatus === "NEEDS_CLARIFICATION" ? "bg-amber-50 text-amber-700 border-amber-200" :
                          "bg-slate-50 text-slate-700 border-slate-200"
                        ].join(" ")}>
                          {verification?.licenseStatus || "PENDING"}
                        </span>
                      </div>

                      {driverProfile.driversLicense ? (
                        <div className="space-y-4">
                          <dl className="grid grid-cols-2 gap-4 text-sm bg-[#fafbff] p-3 rounded-xl border border-[#f0f1f6]">
                            <div>
                              <dt className="text-[#6d7385] text-xs">License Number</dt>
                              <dd className="font-mono font-semibold text-[#2d3447]">{driverProfile.driversLicense.licenseNumber}</dd>
                            </div>
                            <div>
                              <dt className="text-[#6d7385] text-xs">Expiry Date</dt>
                              <dd className="text-[#2d3447]">
                                {new Date(driverProfile.driversLicense.expiryDate).toLocaleDateString("en-US", { dateStyle: "medium" })}
                              </dd>
                            </div>
                          </dl>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-[#6d7385] font-semibold mb-1">Front Photo</p>
                              {driverProfile.driversLicense.frontPhoto ? (
                                <a href={driverProfile.driversLicense.frontPhoto} target="_blank" rel="noopener noreferrer" className="block relative group rounded-xl overflow-hidden border border-[#e4e2ec] aspect-video bg-slate-100">
                                  <img
                                    src={driverProfile.driversLicense.frontPhoto}
                                    alt="License Front"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                                  />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-white text-xs font-semibold">
                                    View Full Image ↗
                                  </div>
                                </a>
                              ) : (
                                <div className="h-28 flex items-center justify-center bg-slate-50 border border-dashed border-[#d5d7e2] rounded-xl text-xs text-[#6d7385]">
                                  No Front Photo Uploaded
                                </div>
                              )}
                            </div>

                            <div>
                              <p className="text-xs text-[#6d7385] font-semibold mb-1">Back Photo</p>
                              {driverProfile.driversLicense.backPhoto ? (
                                <a href={driverProfile.driversLicense.backPhoto} target="_blank" rel="noopener noreferrer" className="block relative group rounded-xl overflow-hidden border border-[#e4e2ec] aspect-video bg-slate-100">
                                  <img
                                    src={driverProfile.driversLicense.backPhoto}
                                    alt="License Back"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                                  />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-white text-xs font-semibold">
                                    View Full Image ↗
                                  </div>
                                </a>
                              ) : (
                                <div className="h-28 flex items-center justify-center bg-slate-50 border border-dashed border-[#d5d7e2] rounded-xl text-xs text-[#6d7385]">
                                  No Back Photo Uploaded
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-[#6d7385]">No Driver's License information uploaded yet.</p>
                      )}
                    </div>

                    {/* Document 2: Vehicle Information & Registration */}
                    <div className="rounded-2xl border border-[#eaebf2] p-5 bg-white space-y-4 shadow-sm">
                      <div className="flex items-center justify-between border-b border-[#f0f1f6] pb-3">
                        <h4 className="font-bold text-[#1e2330] text-base flex items-center gap-2">
                          2. Vehicle Registration & Details
                        </h4>
                        <span className={[
                          "text-xs px-2.5 py-1 rounded-full font-semibold border",
                          verification?.registrationStatus === "APPROVED" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                          verification?.registrationStatus === "REJECTED" ? "bg-red-50 text-red-700 border-red-200" :
                          verification?.registrationStatus === "NEEDS_CLARIFICATION" ? "bg-amber-50 text-amber-700 border-amber-200" :
                          "bg-slate-50 text-slate-700 border-slate-200"
                        ].join(" ")}>
                          {verification?.registrationStatus || "PENDING"}
                        </span>
                      </div>

                      {driverProfile.vehicleRegistration ? (
                        <div className="space-y-4">
                          <dl className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm bg-[#fafbff] p-3 rounded-xl border border-[#f0f1f6]">
                            <div>
                              <dt className="text-[#6d7385] text-xs">Make / Model</dt>
                              <dd className="font-semibold text-[#2d3447]">
                                {driverProfile.vehicleRegistration.brandMake} {driverProfile.vehicleRegistration.model}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-[#6d7385] text-xs">Manufacture Year</dt>
                              <dd className="text-[#2d3447]">{driverProfile.vehicleRegistration.manufactureYear}</dd>
                            </div>
                            <div>
                              <dt className="text-[#6d7385] text-xs">Colour</dt>
                              <dd className="text-[#2d3447]">{driverProfile.vehicleRegistration.colour}</dd>
                            </div>
                            <div>
                              <dt className="text-[#6d7385] text-xs">License Plate</dt>
                              <dd className="font-mono font-semibold text-[#2d3447]">{driverProfile.vehicleRegistration.licensePlate}</dd>
                            </div>
                            {driverProfile.vehicleInfo && (
                              <div className="col-span-2">
                                <dt className="text-[#6d7385] text-xs">Registration Number</dt>
                                <dd className="font-mono text-[#2d3447]">{driverProfile.vehicleInfo.registrationNumber}</dd>
                              </div>
                            )}
                          </dl>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-[#6d7385] font-semibold mb-1">Vehicle Photo</p>
                              {driverProfile.vehicleRegistration.vehiclePhoto ? (
                                <a href={driverProfile.vehicleRegistration.vehiclePhoto} target="_blank" rel="noopener noreferrer" className="block relative group rounded-xl overflow-hidden border border-[#e4e2ec] aspect-video bg-slate-100">
                                  <img
                                    src={driverProfile.vehicleRegistration.vehiclePhoto}
                                    alt="Vehicle Front"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                                  />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-white text-xs font-semibold">
                                    View Full Image ↗
                                  </div>
                                </a>
                              ) : (
                                <div className="h-28 flex items-center justify-center bg-slate-50 border border-dashed border-[#d5d7e2] rounded-xl text-xs text-[#6d7385]">
                                  No Vehicle Photo Uploaded
                                </div>
                              )}
                            </div>

                            <div>
                              <p className="text-xs text-[#6d7385] font-semibold mb-1">Registration Document</p>
                              {driverProfile.vehicleInfo?.registrationDoc ? (
                                <div className="h-28 flex flex-col items-center justify-center bg-[#fafbff] border border-[#d5d7e2] rounded-xl p-3">
                                  <span className="text-2xl">📄</span>
                                  <p className="text-xs text-[#343b4f] font-semibold mt-1 truncate max-w-full">
                                    {driverProfile.vehicleInfo.docName || "registration.pdf"}
                                  </p>
                                  <a
                                    href={driverProfile.vehicleInfo.registrationDoc}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-2 text-xs font-bold text-violet-600 hover:text-violet-800 hover:underline"
                                  >
                                    View / Download Document ↗
                                  </a>
                                </div>
                              ) : (
                                <div className="h-28 flex items-center justify-center bg-slate-50 border border-dashed border-[#d5d7e2] rounded-xl text-xs text-[#6d7385]">
                                  No Registration Document Uploaded
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-[#6d7385]">No Vehicle details uploaded yet.</p>
                      )}
                    </div>

                    {/* Document 3: Insurance Certificate */}
                    <div className="rounded-2xl border border-[#eaebf2] p-5 bg-white space-y-4 shadow-sm">
                      <div className="flex items-center justify-between border-b border-[#f0f1f6] pb-3">
                        <h4 className="font-bold text-[#1e2330] text-base flex items-center gap-2">
                          3. Insurance Policy Certificate
                        </h4>
                        <span className={[
                          "text-xs px-2.5 py-1 rounded-full font-semibold border",
                          verification?.insuranceStatus === "APPROVED" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                          verification?.insuranceStatus === "REJECTED" ? "bg-red-50 text-red-700 border-red-200" :
                          verification?.insuranceStatus === "NEEDS_CLARIFICATION" ? "bg-amber-50 text-amber-700 border-amber-200" :
                          "bg-slate-50 text-slate-700 border-slate-200"
                        ].join(" ")}>
                          {verification?.insuranceStatus || "PENDING"}
                        </span>
                      </div>

                      {driverProfile.insuranceDocs ? (
                        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-4">
                          <dl className="grid grid-cols-1 gap-3 text-sm bg-[#fafbff] p-3 rounded-xl border border-[#f0f1f6]">
                            <div>
                              <dt className="text-[#6d7385] text-xs">Insurance Provider</dt>
                              <dd className="font-semibold text-[#2d3447]">{driverProfile.insuranceDocs.provider}</dd>
                            </div>
                            <div>
                              <dt className="text-[#6d7385] text-xs">Policy Number</dt>
                              <dd className="font-mono text-[#2d3447]">{driverProfile.insuranceDocs.policyNumber}</dd>
                            </div>
                            <div>
                              <dt className="text-[#6d7385] text-xs">Expiry Date</dt>
                              <dd className="text-[#2d3447]">
                                {new Date(driverProfile.insuranceDocs.expiryDate).toLocaleDateString("en-US", { dateStyle: "medium" })}
                              </dd>
                            </div>
                          </dl>

                          <div>
                            <p className="text-xs text-[#6d7385] font-semibold mb-1">Policy Document</p>
                            {driverProfile.insuranceDocs.insuranceDoc ? (
                              <div className="h-32 flex flex-col items-center justify-center bg-[#fafbff] border border-[#d5d7e2] rounded-xl p-3">
                                <span className="text-2xl">🛡️</span>
                                <p className="text-xs text-[#343b4f] font-semibold mt-1 truncate max-w-full">
                                  {driverProfile.insuranceDocs.docName || "insurance_policy.pdf"}
                                </p>
                                <a
                                  href={driverProfile.insuranceDocs.insuranceDoc}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="mt-2 text-xs font-bold text-violet-600 hover:text-violet-800 hover:underline"
                                >
                                  View / Download ↗
                                </a>
                              </div>
                            ) : (
                              <div className="h-32 flex items-center justify-center bg-slate-50 border border-dashed border-[#d5d7e2] rounded-xl text-xs text-[#6d7385]">
                                No Policy Document Uploaded
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-[#6d7385]">No Insurance policy uploaded yet.</p>
                      )}
                    </div>

                    {/* Document 4: Background Check & Tax Info */}
                    <div className="rounded-2xl border border-[#eaebf2] p-5 bg-white space-y-4 shadow-sm">
                      <div className="flex items-center justify-between border-b border-[#f0f1f6] pb-3">
                        <h4 className="font-bold text-[#1e2330] text-base flex items-center gap-2">
                          4. Background Check Consent & Tax Information
                        </h4>
                        <span className={[
                          "text-xs px-2.5 py-1 rounded-full font-semibold border",
                          verification?.backgroundStatus === "APPROVED" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                          verification?.backgroundStatus === "REJECTED" ? "bg-red-50 text-red-700 border-red-200" :
                          verification?.backgroundStatus === "NEEDS_CLARIFICATION" ? "bg-amber-50 text-amber-700 border-amber-200" :
                          "bg-slate-50 text-slate-700 border-slate-200"
                        ].join(" ")}>
                          {verification?.backgroundStatus || "PENDING"}
                        </span>
                      </div>

                      {driverProfile.taxInfo || driverProfile.backgroundCheck ? (
                        <div className="space-y-4">
                          <dl className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm bg-[#fafbff] p-3 rounded-xl border border-[#f0f1f6]">
                            {driverProfile.taxInfo && (
                              <>
                                <div>
                                  <dt className="text-[#6d7385] text-xs">Legal Tax Name</dt>
                                  <dd className="font-semibold text-[#2d3447]">{driverProfile.taxInfo.legalName}</dd>
                                </div>
                                <div>
                                  <dt className="text-[#6d7385] text-xs">Tax Address</dt>
                                  <dd className="text-xs text-[#2d3447] mt-0.5 leading-normal">
                                    {driverProfile.taxInfo.addressLine1}
                                    {driverProfile.taxInfo.addressLine2 && `, ${driverProfile.taxInfo.addressLine2}`}
                                    <br />
                                    {driverProfile.taxInfo.city}, {driverProfile.taxInfo.state} {driverProfile.taxInfo.zipCode}
                                  </dd>
                                </div>
                              </>
                            )}
                            {driverProfile.backgroundCheck && (
                              <>
                                <div>
                                  <dt className="text-[#6d7385] text-xs">Social Security Number (SSN)</dt>
                                  <dd className="font-mono text-[#2d3447]">{driverProfile.backgroundCheck.ssn || "-"}</dd>
                                </div>
                                <div>
                                  <dt className="text-[#6d7385] text-xs">Consent Status</dt>
                                  <dd className="text-[#2d3447] font-semibold flex items-center gap-1">
                                    <span>✅ Consented</span>
                                    {driverProfile.taxInfo?.isAgreed && (
                                      <span className="text-xs text-[#6d7385] font-normal">(Signature on file)</span>
                                    )}
                                  </dd>
                                </div>
                              </>
                            )}
                          </dl>
                        </div>
                      ) : (
                        <p className="text-sm text-[#6d7385]">No Background check details or Tax information uploaded yet.</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-[#eaebf2] p-8 text-center bg-white">
                    <span className="text-3xl">📭</span>
                    <p className="text-sm font-semibold text-[#343b4f] mt-2">Driver Profile Not Found</p>
                    <p className="text-xs text-[#6d7385] mt-1">This user is registered as a Driver but has not initiated their onboarding details or uploaded any documents yet.</p>
                  </div>
                )
              ) : (
                <div className="rounded-2xl border border-dashed border-[#eaebf2] p-8 text-center bg-white">
                  <span className="text-3xl">👤</span>
                  <p className="text-sm font-semibold text-[#343b4f] mt-2">No Documents Required</p>
                  <p className="text-xs text-[#6d7385] mt-1">This user has the role of a **RIDER**. Riders do not need to upload onboarding documents or go through background checks.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-[30px] border border-[#e4e2ec] bg-white/90 shadow-[0_20px_45px_-35px_rgba(45,49,66,0.45)] overflow-hidden">
      <PanelHeader title="User Management" subtitle={subtitle} icon="award" />

      <div className="p-6 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr_auto] gap-3">
          <label className="flex flex-col gap-1 text-sm text-[#59617a]">
            Search
            <input
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Name, email, or phone"
              className="h-11 rounded-xl border border-[#d5d7e2] px-3 text-[14px] text-[#343b4f] focus:outline-none focus:ring-2 focus:ring-violet-300"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1 text-sm text-[#59617a]">
              Role
              <select
                value={role}
                onChange={(event) => {
                  setRole(event.target.value as RoleFilter);
                  setPage(1);
                }}
                className="h-11 rounded-xl border border-[#d5d7e2] px-3 text-[14px] text-[#343b4f] focus:outline-none focus:ring-2 focus:ring-violet-300"
              >
                <option value="ALL">All</option>
                <option value="RIDER">Rider</option>
                <option value="DRIVER">Driver</option>
              </select>
            </label>

            <label className="flex flex-col gap-1 text-sm text-[#59617a]">
              Status
              <select
                value={status}
                onChange={(event) => {
                  setStatus(event.target.value as StatusFilter);
                  setPage(1);
                }}
                className="h-11 rounded-xl border border-[#d5d7e2] px-3 text-[14px] text-[#343b4f] focus:outline-none focus:ring-2 focus:ring-violet-300"
              >
                <option value="ALL">All</option>
                <option value="ACTIVE">Active</option>
                <option value="SUSPENDED">Suspended</option>
                <option value="PENDING_VERIFICATION">Pending verification</option>
                <option value="DELETED">Deleted</option>
              </select>
            </label>
          </div>

          <button
            type="button"
            onClick={() => {
              setPage(1);
              void fetchUsers();
            }}
            className="h-11 mt-6 rounded-xl bg-brand-violet text-white font-semibold px-4 hover:bg-[#7a53e6] transition-colors cursor-pointer"
          >
            Refresh
          </button>
        </div>

        {error ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        ) : null}

        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-4">
          <div className="rounded-2xl border border-[#eaebf2] overflow-hidden">
            <div className="overflow-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#f6f7fb] text-[#5f677c]">
                  <tr>
                    <th className="px-4 py-3 font-semibold">User</th>
                    <th className="px-4 py-3 font-semibold">Role</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Joined</th>
                    <th className="px-4 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td className="px-4 py-5 text-[#697189]" colSpan={5}>
                        Loading users...
                      </td>
                    </tr>
                  ) : data.items.length === 0 ? (
                    <tr>
                      <td className="px-4 py-5 text-[#697189]" colSpan={5}>
                        No users found for the current filters.
                      </td>
                    </tr>
                  ) : (
                    data.items.map((user) => {
                      const isBusy = actionBusyUserId === user.id;
                      const isSuspended = user.status === "SUSPENDED";
                      const canUpdateStatus = user.status !== "DELETED";

                      return (
                        <tr
                          key={user.id}
                          className="border-t border-[#f0f1f6] hover:bg-[#fafbff] cursor-pointer"
                          onClick={async () => {
                            setError(null);
                            setLoading(true);
                            try {
                              const response = await fetch(`/api/admin/users/${user.id}`, {
                                headers: { "x-admin-token": token.trim() },
                              });
                              const json = await response.json();
                              if (!response.ok) {
                                throw new Error((json as { message?: string }).message ?? "Failed to fetch user details");
                              }
                              let userDetails: UserDetails | null = null;
                              if (json && typeof json === "object") {
                                if ("success" in json && "data" in json && json.data) {
                                  userDetails = (json as APIResponse<UserDetails>).data;
                                } else {
                                  userDetails = json as UserDetails;
                                }
                              }
                              setSelectedUser(userDetails);
                              setViewingUser(userDetails);
                            } catch (err: any) {
                              setError(err.message ?? "Failed to fetch user details");
                            } finally {
                              setLoading(false);
                            }
                          }}
                        >
                          <td className="px-4 py-3">
                            <p className="font-semibold text-[#2f3547]">{user.fullName || "Unnamed user"}</p>
                            <p className="text-[#6b7389] text-xs">{user.email || user.phoneNumber || user.id}</p>
                          </td>
                          <td className="px-4 py-3 text-[#44506a]">{user.role}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusChipClass(user.status)}`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-[#44506a]">{formatDate(user.createdAt)}</td>
                          <td className="px-4 py-3">
                            <button
                              type="button"
                              disabled={isBusy || !canUpdateStatus}
                              onClick={(event) => {
                                event.stopPropagation();
                                void updateUserStatus(user);
                              }}
                              className={[
                                "rounded-lg px-3 py-1.5 text-xs font-semibold border transition-colors",
                                isSuspended
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                                  : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
                                isBusy ? "opacity-60 cursor-wait" : "",
                                !canUpdateStatus ? "opacity-50 cursor-not-allowed" : "",
                              ].join(" ")}
                            >
                              {isBusy ? "Saving..." : !canUpdateStatus ? "Unavailable" : isSuspended ? "Unblock" : "Block"}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between border-t border-[#f0f1f6] px-4 py-3 bg-[#fcfcff]">
              <p className="text-xs text-[#697189]">
                Showing {data.total === 0 ? 0 : (data.page - 1) * data.limit + 1}-{Math.min(data.page * data.limit, data.total || 0)} of {data.total}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={data.page <= 1}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  className="rounded-lg border border-[#d7d9e6] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#434c64] disabled:opacity-50"
                >
                  Prev
                </button>
                <span className="text-xs text-[#697189]">
                  Page {data.page} of {Math.max(1, data.pages || 1)}
                </span>
                <button
                  type="button"
                  disabled={data.page >= Math.max(1, data.pages || 1)}
                  onClick={() => setPage((current) => current + 1)}
                  className="rounded-lg border border-[#d7d9e6] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#434c64] disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          <aside className="rounded-2xl border border-[#eaebf2] p-4 bg-[#fcfcff]">
            <h3 className="text-lg font-bold text-[#30374a]">User details</h3>
            {selectedUser ? (
              <dl className="mt-3 space-y-3 text-sm">
                <div>
                  <dt className="text-[#6d7385]">ID</dt>
                  <dd className="font-mono text-xs text-[#2d3447] break-all">{selectedUser.id}</dd>
                </div>
                <div>
                  <dt className="text-[#6d7385]">Name</dt>
                  <dd className="text-[#2d3447]">{selectedUser.fullName || "-"}</dd>
                </div>
                <div>
                  <dt className="text-[#6d7385]">Email</dt>
                  <dd className="text-[#2d3447]">{selectedUser.email || "-"}</dd>
                </div>
                <div>
                  <dt className="text-[#6d7385]">Phone</dt>
                  <dd className="text-[#2d3447]">{selectedUser.phoneNumber || "-"}</dd>
                </div>
                <div>
                  <dt className="text-[#6d7385]">Role</dt>
                  <dd className="text-[#2d3447]">{selectedUser.role}</dd>
                </div>
                <div>
                  <dt className="text-[#6d7385]">Status</dt>
                  <dd>
                    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusChipClass(selectedUser.status)}`}>
                      {selectedUser.status}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-[#6d7385]">Driver registration status</dt>
                  <dd className="text-[#2d3447]">{selectedUser.driverRegistrationStatus || "-"}</dd>
                </div>
                <div>
                  <dt className="text-[#6d7385]">Driver registration step</dt>
                  <dd className="text-[#2d3447]">{selectedUser.driverRegistrationStep || "-"}</dd>
                </div>
                <div>
                  <dt className="text-[#6d7385]">Created</dt>
                  <dd className="text-[#2d3447]">{formatDate(selectedUser.createdAt)}</dd>
                </div>
                <div>
                  <dt className="text-[#6d7385]">Updated</dt>
                  <dd className="text-[#2d3447]">{formatDate(selectedUser.updatedAt)}</dd>
                </div>
              </dl>
            ) : (
              <p className="mt-3 text-sm text-[#6d7385]">Select a user in the table to inspect account details.</p>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}
