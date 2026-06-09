"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import {
  approveDriver as approveDriverApi,
  assignDriverVerification,
  fetchDriverAccount,
  fetchDriverProfile,
  fetchDriverStats,
  rejectDriver as rejectDriverApi,
} from "@/lib/driver-api";
import { Icon } from "./Icon";
import { PanelHeader } from "./PanelHeader";
import {
  AccountStatus,
  UserListItem,
  UserListResponse,
  StatusFilter,
  adminFetch,
  formatDate,
  getInitials,
  onboardingChipClass,
  parseUserListResponse,
  statusChipClass,
} from "./user-management-utils";

type DriverActionModalState =
  | { type: "approve"; driverId: string }
  | { type: "reject"; driverId: string }
  | { type: "block"; user: UserListItem };

type DriverDetails = {
  id: string;
  fullName: string | null;
  email: string | null;
  phoneNumber: string | null;
  role: "DRIVER";
  status: AccountStatus;
  driverRegistrationStatus?: string | null;
  driverRegistrationStep?: string | null;
  createdAt: string;
  updatedAt: string;
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
    id?: string;
    userId?: string;
  } | null;
  driverStats?: {
    driverId: string;
    rating: number;
    totalTrips: number;
    completedTrips: number;
    acceptanceRate: number;
    cancellationRate: number;
    vehicleType: string;
  } | null;
};

export function DriverManagementPanel() {
  const { token: sessionToken } = useAuth();
  const [token, setToken] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("ALL");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<UserListResponse>({ items: [], total: 0, page: 1, limit: 20, pages: 0 });
  const [selectedDriver, setSelectedDriver] = useState<DriverDetails | null>(null);
  const [viewingDriver, setViewingDriver] = useState<DriverDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionBusyUserId, setActionBusyUserId] = useState<string | null>(null);
  const [actionModal, setActionModal] = useState<DriverActionModalState | null>(null);
  const [actionNotes, setActionNotes] = useState("");
  const [documentTab, setDocumentTab] = useState<"license" | "vehicle" | "insurance" | "background">("license");

  useEffect(() => {
    setToken(sessionToken || "");
  }, [sessionToken]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const hasToken = (token || "").trim().length > 0;

  async function fetchDrivers() {
    if (!hasToken) {
      setError("Set an admin JWT token to load drivers.");
      setData({ items: [], total: 0, page: 1, limit: 20, pages: 0 });
      return;
    }

    setLoading(true);
    setError(null);

    const params = new URLSearchParams({ page: String(page), limit: "20", type: "DRIVER" });
    if (search) params.set("search", search);
    if (status !== "ALL") params.set("status", status);

    try {
      const json = await adminFetch<unknown>(`/api/admin/users?${params.toString()}`, token);
      const parsedData = parseUserListResponse(json, page);
      setData(parsedData);

      if (selectedDriver) {
        const stillVisible = parsedData.items.some((item) => item.id === selectedDriver.id);
        if (!stillVisible) {
          setSelectedDriver(null);
        }
      }
    } catch (fetchError) {
      setData({ items: [], total: 0, page: 1, limit: 20, pages: 0 });
      setError(fetchError instanceof Error ? fetchError.message : "Failed to fetch drivers");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchDrivers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, status, search, token]);

  async function fetchDriverBundle(userId: string): Promise<DriverDetails> {
    const [account, profile, stats] = await Promise.all([
      fetchDriverAccount(userId, token),
      fetchDriverProfile(userId, token),
      fetchDriverStats(userId, token),
    ]);

    if (!account) {
      throw new Error("Failed to fetch driver account details");
    }

    return {
      ...(account as DriverDetails),
      driverProfile: (profile as DriverDetails["driverProfile"]) ?? null,
      driverStats: stats,
    };
  }

  async function loadDriverDetails(userId: string) {
    if (!hasToken) return;

    setError(null);

    try {
      const driverDetails = await fetchDriverBundle(userId);
      setSelectedDriver(driverDetails);
      if (viewingDriver && viewingDriver.id === userId) {
        setViewingDriver(driverDetails);
      }
    } catch (detailError) {
      setError(detailError instanceof Error ? detailError.message : "Failed to fetch driver details");
    }
  }

  async function openDriverDetails(userId: string) {
    setError(null);
    setDetailLoading(true);
    setDocumentTab("license");
    try {
      const driverDetails = await fetchDriverBundle(userId);
      setSelectedDriver(driverDetails);
      setViewingDriver(driverDetails);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch driver details");
    } finally {
      setDetailLoading(false);
    }
  }

  async function assignVerificationToSelf(verificationId: string) {
    if (!hasToken) return;
    setLoading(true);
    setError(null);
    try {
      await assignDriverVerification(verificationId, token);
      if (viewingDriver) {
        await loadDriverDetails(viewingDriver.id);
      }
      await fetchDrivers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to assign verification");
    } finally {
      setLoading(false);
    }
  }

  function openActionModal(state: DriverActionModalState) {
    setActionNotes(state.type === "block" ? "Policy violation" : "");
    setActionModal(state);
  }

  async function confirmActionModal() {
    if (!actionModal || !hasToken) return;

    setActionBusyUserId(
      actionModal.type === "block" ? actionModal.user.id : actionModal.driverId,
    );
    setError(null);

    try {
      if (actionModal.type === "approve") {
        await approveDriverApi(actionModal.driverId, token, actionNotes.trim());
      } else if (actionModal.type === "reject") {
        if (!actionNotes.trim()) {
          setError("Rejection reason is required.");
          return;
        }
        await rejectDriverApi(actionModal.driverId, token, actionNotes.trim());
      } else if (actionModal.type === "block") {
        if (!actionNotes.trim()) {
          setError("Block reason is required.");
          return;
        }
        await adminFetch(`/api/admin/users/${actionModal.user.id}/block`, token, {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ reason: actionNotes.trim() }),
        });
      }

      setActionModal(null);
      setActionNotes("");

      if (viewingDriver) {
        await loadDriverDetails(viewingDriver.id);
      }
      await fetchDrivers();
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "Action failed");
    } finally {
      setActionBusyUserId(null);
    }
  }

  async function unblockDriver(user: UserListItem) {
    if (!hasToken || user.status !== "SUSPENDED") return;

    setActionBusyUserId(user.id);
    setError(null);

    try {
      await adminFetch(`/api/admin/users/${user.id}/unblock`, token, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({}),
      });

      await fetchDrivers();
      if (selectedDriver?.id === user.id) {
        await loadDriverDetails(user.id);
      }
      if (viewingDriver?.id === user.id) {
        await loadDriverDetails(user.id);
      }
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "Failed to unblock driver");
    } finally {
      setActionBusyUserId(null);
    }
  }

  if (viewingDriver) {
    const isBusy = actionBusyUserId === viewingDriver.id;
    const isSuspended = viewingDriver.status === "SUSPENDED";
    const canUpdateStatus = viewingDriver.status !== "DELETED";
    const driverProfile = viewingDriver.driverProfile;
    const driverStats = viewingDriver.driverStats;
    const verification = viewingDriver.verification;
    const displayName = driverProfile?.personalInfo?.fullName || viewingDriver.fullName || "Unnamed Driver";
    const profilePhoto = driverProfile?.personalInfo?.profilePhoto;

    return (
      <section className="rounded-[30px] border border-[#e4e2ec] bg-white/90 shadow-[0_20px_45px_-35px_rgba(45,49,66,0.45)] overflow-hidden">
        {actionModal ? (
          <DriverActionModal
            modal={actionModal}
            notes={actionNotes}
            busy={isBusy}
            onNotesChange={setActionNotes}
            onCancel={() => {
              setActionModal(null);
              setActionNotes("");
            }}
            onConfirm={() => void confirmActionModal()}
          />
        ) : null}

        <div className="bg-gradient-to-r from-[#7a53e6]/10 to-[#502bb6]/5 border-b border-[#e4e2ec] p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <button
              type="button"
              onClick={() => setViewingDriver(null)}
              className="h-10 w-10 shrink-0 flex items-center justify-center rounded-xl bg-white border border-[#d5d7e2] text-[#343b4f] hover:bg-[#f6f7fb] hover:border-[#b0b3c5] transition-all cursor-pointer shadow-sm text-lg font-bold"
              title="Back to List"
            >
              ←
            </button>
            <DriverAvatar name={displayName} photoUrl={profilePhoto} size="lg" />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-bold text-[#1e2330] truncate">{displayName}</h2>
                <span className="inline-flex rounded-full bg-violet-50 text-violet-700 border border-violet-200 px-2.5 py-0.5 text-xs font-semibold">
                  DRIVER
                </span>
                <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusChipClass(viewingDriver.status)}`}>
                  {viewingDriver.status}
                </span>
                <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${onboardingChipClass(viewingDriver.driverRegistrationStatus || verification?.status)}`}>
                  {viewingDriver.driverRegistrationStatus || verification?.status || "NOT_STARTED"}
                </span>
              </div>
              <p className="text-sm text-[#59617a] mt-0.5 truncate">
                {viewingDriver.email || "No email"} • {viewingDriver.phoneNumber || "No phone"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <button
              type="button"
              disabled={isBusy || !canUpdateStatus}
              onClick={() => {
                if (isSuspended) {
                  void unblockDriver(viewingDriver);
                } else {
                  openActionModal({ type: "block", user: viewingDriver });
                }
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

          {detailLoading ? (
            <div className="rounded-2xl border border-[#eaebf2] bg-[#fcfcff] p-8 text-center text-sm text-[#6d7385]">
              Loading driver profile…
            </div>
          ) : null}

          {driverStats ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <DriverMetricCard label="Rating" value={(driverStats.rating ?? 0).toFixed(1)} icon="star" tone="amber" />
              <DriverMetricCard label="Total Trips" value={String(driverStats.totalTrips ?? 0)} icon="car" tone="violet" />
              <DriverMetricCard
                label="Acceptance"
                value={`${((driverStats.acceptanceRate ?? 0) * 100).toFixed(0)}%`}
                icon="trend"
                tone="green"
              />
              <DriverMetricCard
                label="Cancellation"
                value={`${((driverStats.cancellationRate ?? 0) * 100).toFixed(0)}%`}
                icon="clock"
                tone="red"
              />
            </div>
          ) : null}

          {verification?.decisionReason ? (
            <div className="rounded-2xl border border-red-200 bg-red-50/60 px-4 py-3 text-sm text-red-800">
              <span className="font-semibold">Decision reason:</span> {verification.decisionReason}
              {verification.decisionAt ? (
                <span className="text-red-600/80"> • {formatDate(verification.decisionAt)}</span>
              ) : null}
            </div>
          ) : null}

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
                    (verification?.status === "APPROVED" || viewingDriver.driverRegistrationStatus === "APPROVED" || viewingDriver.driverRegistrationStatus === "COMPLETED") ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                    (verification?.status === "REJECTED" || viewingDriver.driverRegistrationStatus === "REJECTED") ? "bg-red-50 text-red-700 border-red-200" :
                    (verification?.status === "IN_REVIEW" || verification?.status === "PENDING_REVIEW" || viewingDriver.driverRegistrationStatus === "PENDING_APPROVAL" || viewingDriver.driverRegistrationStatus === "IN_PROGRESS") ? "bg-amber-50 text-amber-700 border-amber-200" :
                    "bg-slate-50 text-slate-700 border-slate-200"
                  ].join(" ")}>
                    {viewingDriver.driverRegistrationStatus || verification?.status || "NOT_STARTED"}
                  </span>
                </div>
                <div>
                  Priority:{" "}
                  <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold ${priorityChipClass(verification?.priority)}`}>
                    {verification?.priority || "NORMAL"}
                  </span>
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
              {verification && verification.status !== "APPROVED" && verification.status !== "REJECTED" && (
                <button
                  type="button"
                  onClick={() => void assignVerificationToSelf(verification.id)}
                  className="h-10 px-4 rounded-xl border border-[#d5d7e2] bg-white font-semibold text-[#343b4f] hover:bg-[#f6f7fb] transition-all cursor-pointer text-sm"
                >
                  Assign to Me
                </button>
              )}
              {verification?.status !== "APPROVED" && viewingDriver.driverRegistrationStatus !== "APPROVED" && (
                <button
                  type="button"
                  onClick={() => openActionModal({ type: "approve", driverId: viewingDriver.id })}
                  className="h-10 px-4 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-all cursor-pointer text-sm shadow-sm"
                >
                  Approve Driver
                </button>
              )}
              {verification?.status !== "REJECTED" && viewingDriver.driverRegistrationStatus !== "REJECTED" && (
                <button
                  type="button"
                  onClick={() => openActionModal({ type: "reject", driverId: viewingDriver.id })}
                  className="h-10 px-4 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-all cursor-pointer text-sm shadow-sm"
                >
                  Reject Driver
                </button>
              )}
            </div>
          </div>

          {verification ? (
            <VerificationProgress verification={verification} />
          ) : null}

          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_2fr] gap-6">
            <div className="space-y-6">
              <div className="rounded-2xl border border-[#eaebf2] p-5 bg-[#fcfcff] space-y-4">
                <h4 className="font-bold text-[#1e2330] border-b border-[#f0f1f6] pb-2 text-base">Account Overview</h4>
                <dl className="grid grid-cols-1 gap-y-3 gap-x-2 text-sm">
                  <div>
                    <dt className="text-[#6d7385] text-xs">Full Legal Name</dt>
                    <dd className="font-semibold text-[#2d3447]">
                      {driverProfile?.personalInfo?.fullName || viewingDriver.fullName || "-"}
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
                      {viewingDriver.email || "-"}
                      {driverProfile?.personalInfo?.emailVerified && (
                        <span className="inline-flex rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.2 text-[10px] font-semibold">
                          Verified
                        </span>
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[#6d7385] text-xs">Phone Number</dt>
                    <dd className="text-[#2d3447]">{viewingDriver.phoneNumber || "-"}</dd>
                  </div>
                  <div>
                    <dt className="text-[#6d7385] text-xs">Registration Step</dt>
                    <dd className="text-[#2d3447]">{viewingDriver.driverRegistrationStep || driverProfile?.statusInfo?.currentStep || "-"}</dd>
                  </div>
                  <div>
                    <dt className="text-[#6d7385] text-xs">Driver Rating</dt>
                    <dd className="text-[#2d3447]">
                      {(driverStats?.rating ?? driverProfile?.statusInfo?.rating) != null
                        ? (driverStats?.rating ?? driverProfile?.statusInfo?.rating)!.toFixed(1)
                        : "-"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[#6d7385] text-xs">Total Trips</dt>
                    <dd className="text-[#2d3447]">{driverStats?.totalTrips ?? driverProfile?.statusInfo?.totalTrips ?? "-"}</dd>
                  </div>
                  {driverStats && (
                    <>
                      <div>
                        <dt className="text-[#6d7385] text-xs">Vehicle Type</dt>
                        <dd className="text-[#2d3447]">{driverStats.vehicleType}</dd>
                      </div>
                      <div>
                        <dt className="text-[#6d7385] text-xs">Acceptance Rate</dt>
                        <dd className="text-[#2d3447]">{(driverStats.acceptanceRate * 100).toFixed(0)}%</dd>
                      </div>
                    </>
                  )}
                  <div>
                    <dt className="text-[#6d7385] text-xs">Joined Date</dt>
                    <dd className="text-[#2d3447]">{formatDate(viewingDriver.createdAt)}</dd>
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

            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h3 className="text-xl font-bold text-[#1e2330]">Documents & Verification</h3>
                {driverProfile ? (
                  <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-[#f6f7fb] border border-[#eaebf2]">
                    {(
                      [
                        { id: "license", label: "License" },
                        { id: "vehicle", label: "Vehicle" },
                        { id: "insurance", label: "Insurance" },
                        { id: "background", label: "Background" },
                      ] as const
                    ).map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setDocumentTab(tab.id)}
                        className={[
                          "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                          documentTab === tab.id
                            ? "bg-white text-violet-700 shadow-sm border border-violet-100"
                            : "text-[#59617a] hover:text-[#343b4f]",
                        ].join(" ")}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              {driverProfile ? (
                <DriverDocuments
                  driverProfile={driverProfile}
                  verification={verification}
                  activeTab={documentTab}
                />
              ) : (
                <div className="rounded-2xl border border-dashed border-[#eaebf2] p-8 text-center bg-white">
                  <span className="text-3xl">📭</span>
                  <p className="text-sm font-semibold text-[#343b4f] mt-2">Driver Profile Not Found</p>
                  <p className="text-xs text-[#6d7385] mt-1">
                    This driver has not initiated onboarding or uploaded documents yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  const pageStats = {
    total: data.total,
    active: data.items.filter((d) => d.status === "ACTIVE").length,
    pending: data.items.filter((d) => {
      const onboarding = (d.driverRegistrationStatus || "").toUpperCase();
      return (
        d.status === "PENDING_VERIFICATION" ||
        ["PENDING_APPROVAL", "IN_PROGRESS", "PENDING_REVIEW", "IN_REVIEW", "NEEDS_RESUBMISSION"].includes(onboarding)
      );
    }).length,
    suspended: data.items.filter((d) => d.status === "SUSPENDED").length,
  };

  return (
    <section className="rounded-[30px] border border-[#e4e2ec] bg-white/90 shadow-[0_20px_45px_-35px_rgba(45,49,66,0.45)] overflow-hidden">
      {actionModal ? (
        <DriverActionModal
          modal={actionModal}
          notes={actionNotes}
          busy={actionBusyUserId !== null}
          onNotesChange={setActionNotes}
          onCancel={() => {
            setActionModal(null);
            setActionNotes("");
          }}
          onConfirm={() => void confirmActionModal()}
        />
      ) : null}

      <PanelHeader
        title="Driver Management"
        subtitle="Review onboarding, verify documents, and manage driver accounts."
        icon="car"
      />

      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <DriverMetricCard label="Total Drivers" value={String(pageStats.total)} icon="users" tone="violet" />
          <DriverMetricCard label="Active (page)" value={String(pageStats.active)} icon="user" tone="green" />
          <DriverMetricCard label="Pending (page)" value={String(pageStats.pending)} icon="clock" tone="amber" />
          <DriverMetricCard label="Suspended (page)" value={String(pageStats.suspended)} icon="briefcase" tone="red" />
        </div>

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

          <button
            type="button"
            onClick={() => {
              setPage(1);
              void fetchDrivers();
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
                    <th className="px-4 py-3 font-semibold">Driver</th>
                    <th className="px-4 py-3 font-semibold">Onboarding</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Joined</th>
                    <th className="px-4 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <tr key={`skeleton-${index}`} className="border-t border-[#f0f1f6]">
                        <td className="px-4 py-3" colSpan={5}>
                          <div className="h-10 rounded-lg bg-[#f0f1f6] animate-pulse" />
                        </td>
                      </tr>
                    ))
                  ) : data.items.length === 0 ? (
                    <tr>
                      <td className="px-4 py-10 text-center" colSpan={5}>
                        <div className="inline-flex flex-col items-center gap-2 text-[#697189]">
                          <Icon name="car" className="size-8 text-violet-300" />
                          <p className="font-semibold text-[#343b4f]">No drivers found</p>
                          <p className="text-xs">Try adjusting search or status filters.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    data.items.map((driver) => {
                      const isBusy = actionBusyUserId === driver.id;
                      const isSuspended = driver.status === "SUSPENDED";
                      const canUpdateStatus = driver.status !== "DELETED";
                      const isSelected = selectedDriver?.id === driver.id;

                      return (
                        <tr
                          key={driver.id}
                          className={[
                            "border-t border-[#f0f1f6] hover:bg-[#fafbff] cursor-pointer transition-colors",
                            isSelected ? "bg-violet-50/50 ring-1 ring-inset ring-violet-200" : "",
                          ].join(" ")}
                          onClick={() => {
                            void openDriverDetails(driver.id);
                            void loadDriverDetails(driver.id);
                          }}
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <DriverAvatar name={driver.fullName} size="sm" />
                              <div className="min-w-0">
                                <p className="font-semibold text-[#2f3547] truncate">
                                  {driver.fullName || "Unnamed driver"}
                                </p>
                                <p className="text-[#6b7389] text-xs truncate">
                                  {driver.email || driver.phoneNumber || driver.id}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${onboardingChipClass(driver.driverRegistrationStatus)}`}>
                              {driver.driverRegistrationStatus || "NOT_STARTED"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusChipClass(driver.status)}`}>
                              {driver.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-[#44506a] text-xs whitespace-nowrap">
                            {formatDate(driver.createdAt)}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  void openDriverDetails(driver.id);
                                }}
                                className="rounded-lg px-3 py-1.5 text-xs font-semibold border border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100 transition-colors"
                              >
                                Review
                              </button>
                              <button
                                type="button"
                                disabled={isBusy || !canUpdateStatus}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  if (isSuspended) {
                                    void unblockDriver(driver);
                                  } else {
                                    openActionModal({ type: "block", user: driver });
                                  }
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
                                {isBusy ? "…" : !canUpdateStatus ? "—" : isSuspended ? "Unblock" : "Block"}
                              </button>
                            </div>
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
                Showing {data.total === 0 ? 0 : (data.page - 1) * data.limit + 1}-{Math.min(data.page * data.limit, data.total)} of {data.total}
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

          <aside className="rounded-2xl border border-[#eaebf2] p-4 bg-[#fcfcff] lg:sticky lg:top-4 lg:self-start">
            <h3 className="text-lg font-bold text-[#30374a]">Quick preview</h3>
            {selectedDriver ? (
              <div className="mt-4 space-y-4">
                <div className="flex items-center gap-3">
                  <DriverAvatar
                    name={selectedDriver.driverProfile?.personalInfo?.fullName || selectedDriver.fullName}
                    photoUrl={selectedDriver.driverProfile?.personalInfo?.profilePhoto}
                    size="md"
                  />
                  <div className="min-w-0">
                    <p className="font-semibold text-[#2d3447] truncate">
                      {selectedDriver.fullName || "Unnamed driver"}
                    </p>
                    <p className="text-xs text-[#6d7385] truncate">{selectedDriver.email || "No email"}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusChipClass(selectedDriver.status)}`}>
                    {selectedDriver.status}
                  </span>
                  <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${onboardingChipClass(selectedDriver.driverRegistrationStatus)}`}>
                    {selectedDriver.driverRegistrationStatus || "NOT_STARTED"}
                  </span>
                </div>
                {selectedDriver.driverStats ? (
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="rounded-xl bg-white border border-[#eaebf2] p-2">
                      <p className="text-lg font-bold text-[#2d3447]">
                        {(selectedDriver.driverStats.rating ?? 0).toFixed(1)}
                      </p>
                      <p className="text-[10px] text-[#6d7385] uppercase tracking-wide">Rating</p>
                    </div>
                    <div className="rounded-xl bg-white border border-[#eaebf2] p-2">
                      <p className="text-lg font-bold text-[#2d3447]">{selectedDriver.driverStats.totalTrips ?? 0}</p>
                      <p className="text-[10px] text-[#6d7385] uppercase tracking-wide">Trips</p>
                    </div>
                  </div>
                ) : null}
                <button
                  type="button"
                  onClick={() => void openDriverDetails(selectedDriver.id)}
                  className="w-full h-10 rounded-xl bg-brand-violet text-white text-sm font-semibold hover:bg-[#7a53e6] transition-colors cursor-pointer"
                >
                  Open full review
                </button>
              </div>
            ) : (
              <p className="mt-3 text-sm text-[#6d7385]">Select a driver to see a quick preview, or click Review to open verification.</p>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}

function verificationStatusClass(status?: string) {
  if (status === "APPROVED") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (status === "REJECTED") return "bg-red-50 text-red-700 border-red-200";
  if (status === "NEEDS_CLARIFICATION") return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-slate-50 text-slate-700 border-slate-200";
}

function priorityChipClass(priority?: string | null) {
  if (priority === "URGENT") return "bg-red-50 text-red-700 border-red-200";
  if (priority === "HIGH") return "bg-orange-50 text-orange-700 border-orange-200";
  if (priority === "LOW") return "bg-slate-50 text-slate-600 border-slate-200";
  return "bg-violet-50 text-violet-700 border-violet-200";
}

function DriverAvatar({
  name,
  photoUrl,
  size = "md",
}: {
  name?: string | null;
  photoUrl?: string | null;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClass = size === "lg" ? "size-14 text-lg" : size === "sm" ? "size-9 text-xs" : "size-11 text-sm";

  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt={name || "Driver"}
        className={`${sizeClass} rounded-full object-cover border-2 border-white shadow-sm shrink-0`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} rounded-full bg-gradient-to-br from-violet-500 to-[#502bb6] text-white font-bold flex items-center justify-center shrink-0 shadow-sm`}
    >
      {getInitials(name)}
    </div>
  );
}

function DriverMetricCard({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: string;
  icon: "star" | "car" | "users" | "user" | "clock" | "trend" | "briefcase";
  tone: "violet" | "green" | "amber" | "red";
}) {
  const toneBg = {
    violet: "bg-violet-50 text-violet-600",
    green: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    red: "bg-red-50 text-red-600",
  }[tone];

  return (
    <article className="rounded-2xl border border-[#eaebf2] bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <span className={`size-9 rounded-xl flex items-center justify-center ${toneBg}`}>
          <Icon name={icon} className="size-4" />
        </span>
        <p className="text-2xl font-extrabold text-[#1e2330] leading-none">{value}</p>
      </div>
      <p className="mt-2 text-xs font-semibold text-[#6d7385] uppercase tracking-wide">{label}</p>
    </article>
  );
}

function DriverActionModal({
  modal,
  notes,
  busy,
  onNotesChange,
  onCancel,
  onConfirm,
}: {
  modal: DriverActionModalState;
  notes: string;
  busy: boolean;
  onNotesChange: (value: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const config = {
    approve: {
      title: "Approve driver",
      description: "Optional notes will be recorded with this approval.",
      confirmLabel: "Approve",
      confirmClass: "bg-emerald-600 hover:bg-emerald-700",
      required: false,
      placeholder: "Optional approval notes…",
    },
    reject: {
      title: "Reject driver",
      description: "A reason is required so the driver knows what to fix.",
      confirmLabel: "Reject",
      confirmClass: "bg-red-600 hover:bg-red-700",
      required: true,
      placeholder: "Reason for rejection…",
    },
    block: {
      title: "Block driver account",
      description: "The driver will be suspended until manually unblocked.",
      confirmLabel: "Block account",
      confirmClass: "bg-red-600 hover:bg-red-700",
      required: true,
      placeholder: "Reason for blocking…",
    },
  }[modal.type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]">
      <div className="w-full max-w-md rounded-2xl bg-white border border-[#e4e2ec] shadow-2xl p-6 space-y-4">
        <div>
          <h3 className="text-lg font-bold text-[#1e2330]">{config.title}</h3>
          <p className="text-sm text-[#6d7385] mt-1">{config.description}</p>
        </div>
        <label className="block text-sm text-[#59617a]">
          {config.required ? "Reason" : "Notes"}
          <textarea
            value={notes}
            onChange={(event) => onNotesChange(event.target.value)}
            rows={4}
            placeholder={config.placeholder}
            className="mt-1.5 w-full rounded-xl border border-[#d5d7e2] px-3 py-2 text-sm text-[#343b4f] focus:outline-none focus:ring-2 focus:ring-violet-300 resize-y"
          />
        </label>
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="h-10 px-4 rounded-xl border border-[#d5d7e2] bg-white font-semibold text-[#343b4f] hover:bg-[#f6f7fb] text-sm cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy || (config.required && !notes.trim())}
            className={`h-10 px-4 rounded-xl text-white font-semibold text-sm cursor-pointer disabled:opacity-50 ${config.confirmClass}`}
          >
            {busy ? "Saving…" : config.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function VerificationProgress({
  verification,
}: {
  verification: NonNullable<DriverDetails["verification"]>;
}) {
  const steps = [
    { label: "License", status: verification.licenseStatus },
    { label: "Registration", status: verification.registrationStatus },
    { label: "Insurance", status: verification.insuranceStatus },
    { label: "Background", status: verification.backgroundStatus },
  ];
  const approvedCount = steps.filter((step) => step.status === "APPROVED").length;
  const progress = Math.round((approvedCount / steps.length) * 100);

  return (
    <div className="rounded-2xl border border-[#eaebf2] bg-white p-5 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h4 className="font-bold text-[#1e2330]">Verification checklist</h4>
        <span className="text-sm font-semibold text-violet-700">{progress}% complete</span>
      </div>
      <div className="h-2 rounded-full bg-[#f0f1f6] overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-emerald-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {steps.map((step) => (
          <div
            key={step.label}
            className="rounded-xl border border-[#f0f1f6] bg-[#fafbff] px-3 py-2 text-center"
          >
            <p className="text-xs text-[#6d7385]">{step.label}</p>
            <span className={`mt-1 inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold ${verificationStatusClass(step.status)}`}>
              {step.status || "PENDING"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DriverDocuments({
  driverProfile,
  verification,
  activeTab,
}: {
  driverProfile: NonNullable<DriverDetails["driverProfile"]>;
  verification: DriverDetails["verification"];
  activeTab: "license" | "vehicle" | "insurance" | "background";
}) {
  if (activeTab === "vehicle") {
    return (
      <div className="rounded-2xl border border-[#eaebf2] p-5 bg-white space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#f0f1f6] pb-3">
          <h4 className="font-bold text-[#1e2330] text-base">Vehicle Registration & Details</h4>
          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${verificationStatusClass(verification?.registrationStatus)}`}>
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
                <dt className="text-[#6d7385] text-xs">License Plate</dt>
                <dd className="font-mono font-semibold text-[#2d3447]">{driverProfile.vehicleRegistration.licensePlate}</dd>
              </div>
              <div>
                <dt className="text-[#6d7385] text-xs">Colour</dt>
                <dd className="text-[#2d3447]">{driverProfile.vehicleRegistration.colour}</dd>
              </div>
            </dl>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DocumentImage label="Vehicle Photo" url={driverProfile.vehicleRegistration.vehiclePhoto} />
              {driverProfile.vehicleInfo?.registrationDoc ? (
                <DocumentLink
                  label="Registration Document"
                  url={driverProfile.vehicleInfo.registrationDoc}
                  name={driverProfile.vehicleInfo.docName || "registration.pdf"}
                />
              ) : (
                <EmptyDocument label="Registration Document" />
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm text-[#6d7385]">No vehicle details uploaded yet.</p>
        )}
      </div>
    );
  }

  if (activeTab === "insurance") {
    return (
      <div className="rounded-2xl border border-[#eaebf2] p-5 bg-white space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#f0f1f6] pb-3">
          <h4 className="font-bold text-[#1e2330] text-base">Insurance Policy Certificate</h4>
          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${verificationStatusClass(verification?.insuranceStatus)}`}>
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
            {driverProfile.insuranceDocs.insuranceDoc ? (
              <DocumentLink
                label="Policy Document"
                url={driverProfile.insuranceDocs.insuranceDoc}
                name={driverProfile.insuranceDocs.docName || "insurance_policy.pdf"}
              />
            ) : (
              <EmptyDocument label="Policy Document" />
            )}
          </div>
        ) : (
          <p className="text-sm text-[#6d7385]">No insurance policy uploaded yet.</p>
        )}
      </div>
    );
  }

  if (activeTab === "background") {
    return (
      <div className="rounded-2xl border border-[#eaebf2] p-5 bg-white space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#f0f1f6] pb-3">
          <h4 className="font-bold text-[#1e2330] text-base">Background Check & Tax Information</h4>
          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${verificationStatusClass(verification?.backgroundStatus)}`}>
            {verification?.backgroundStatus || "PENDING"}
          </span>
        </div>
        {driverProfile.taxInfo || driverProfile.backgroundCheck ? (
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm bg-[#fafbff] p-3 rounded-xl border border-[#f0f1f6]">
            {driverProfile.taxInfo ? (
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
            ) : null}
            {driverProfile.backgroundCheck ? (
              <>
                <div>
                  <dt className="text-[#6d7385] text-xs">SSN (masked)</dt>
                  <dd className="font-mono text-[#2d3447]">{driverProfile.backgroundCheck.ssn || "-"}</dd>
                </div>
                <div>
                  <dt className="text-[#6d7385] text-xs">Consent</dt>
                  <dd className="text-[#2d3447] font-semibold">
                    {driverProfile.backgroundCheck.isConsented ? "Consented" : "Not consented"}
                  </dd>
                </div>
              </>
            ) : null}
          </dl>
        ) : (
          <p className="text-sm text-[#6d7385]">No background check or tax information uploaded yet.</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[#eaebf2] p-5 bg-white space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#f0f1f6] pb-3">
          <h4 className="font-bold text-[#1e2330] text-base">Driver&apos;s License</h4>
          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${verificationStatusClass(verification?.licenseStatus)}`}>
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
              <DocumentImage label="Front Photo" url={driverProfile.driversLicense.frontPhoto} />
              <DocumentImage label="Back Photo" url={driverProfile.driversLicense.backPhoto} />
            </div>
          </div>
        ) : (
          <p className="text-sm text-[#6d7385]">No driver&apos;s license uploaded yet.</p>
        )}
      </div>
    </div>
  );
}

function DocumentImage({ label, url }: { label: string; url: string | null | undefined }) {
  if (!url) {
    return <EmptyDocument label={label} />;
  }

  return (
    <div>
      <p className="text-xs text-[#6d7385] font-semibold mb-1">{label}</p>
      <a href={url} target="_blank" rel="noopener noreferrer" className="block relative group rounded-xl overflow-hidden border border-[#e4e2ec] aspect-video bg-slate-100">
        <img src={url} alt={label} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300" />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-white text-xs font-semibold">
          View Full Image ↗
        </div>
      </a>
    </div>
  );
}

function DocumentLink({ label, url, name }: { label: string; url: string; name: string }) {
  return (
    <div>
      <p className="text-xs text-[#6d7385] font-semibold mb-1">{label}</p>
      <div className="h-28 flex flex-col items-center justify-center bg-[#fafbff] border border-[#d5d7e2] rounded-xl p-3">
        <span className="text-2xl">📄</span>
        <p className="text-xs text-[#343b4f] font-semibold mt-1 truncate max-w-full">{name}</p>
        <a href={url} target="_blank" rel="noopener noreferrer" className="mt-2 text-xs font-bold text-violet-600 hover:text-violet-800 hover:underline">
          View / Download ↗
        </a>
      </div>
    </div>
  );
}

function EmptyDocument({ label }: { label: string }) {
  return (
    <div>
      <p className="text-xs text-[#6d7385] font-semibold mb-1">{label}</p>
      <div className="h-28 flex items-center justify-center bg-slate-50 border border-dashed border-[#d5d7e2] rounded-xl text-xs text-[#6d7385]">
        Not uploaded
      </div>
    </div>
  );
}
