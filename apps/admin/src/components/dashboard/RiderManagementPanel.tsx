"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { PanelHeader } from "./PanelHeader";
import {
  AccountStatus,
  UserListItem,
  UserListResponse,
  StatusFilter,
  adminFetch,
  formatDate,
  parseUserDetails,
  parseUserListResponse,
  statusChipClass,
} from "./user-management-utils";

type RiderProfile = {
  id: string;
  userId: string;
  phoneNumber: string;
  fullName: string | null;
  email: string | null;
  emailVerified: boolean;
  profilePhotoUrl: string | null;
  rating: number;
  totalTrips: number;
  emergencyContacts: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
};

type RiderDetails = {
  id: string;
  fullName: string | null;
  email: string | null;
  phoneNumber: string | null;
  role: "RIDER";
  status: AccountStatus;
  createdAt: string;
  updatedAt: string;
  riderProfile?: RiderProfile | null;
};

type TripHistoryItem = {
  id: string;
  status?: string;
  pickupAddress?: string;
  dropoffAddress?: string;
  fare?: number;
  createdAt?: string;
};

type TripHistoryResponse = {
  items?: TripHistoryItem[];
  total?: number;
};

export function RiderManagementPanel() {
  const { token: sessionToken } = useAuth();
  const [token, setToken] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("ALL");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<UserListResponse>({ items: [], total: 0, page: 1, limit: 20, pages: 0 });
  const [selectedRider, setSelectedRider] = useState<RiderDetails | null>(null);
  const [viewingRider, setViewingRider] = useState<RiderDetails | null>(null);
  const [tripHistory, setTripHistory] = useState<TripHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionBusyUserId, setActionBusyUserId] = useState<string | null>(null);

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

  async function fetchRiders() {
    if (!hasToken) {
      setError("Set an admin JWT token to load riders.");
      setData({ items: [], total: 0, page: 1, limit: 20, pages: 0 });
      return;
    }

    setLoading(true);
    setError(null);

    const params = new URLSearchParams({ page: String(page), limit: "20", type: "RIDER" });
    if (search) params.set("search", search);
    if (status !== "ALL") params.set("status", status);

    try {
      const json = await adminFetch<unknown>(`/api/admin/users?${params.toString()}`, token);
      const parsedData = parseUserListResponse(json, page);
      setData(parsedData);

      if (selectedRider) {
        const stillVisible = parsedData.items.some((item) => item.id === selectedRider.id);
        if (!stillVisible) {
          setSelectedRider(null);
        }
      }
    } catch (fetchError) {
      setData({ items: [], total: 0, page: 1, limit: 20, pages: 0 });
      setError(fetchError instanceof Error ? fetchError.message : "Failed to fetch riders");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchRiders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, status, search, token]);

  async function loadRiderDetails(userId: string) {
    if (!hasToken) return;

    setError(null);

    try {
      const json = await adminFetch<unknown>(`/api/admin/users/${userId}`, token);
      const riderDetails = parseUserDetails<RiderDetails>(json);
      setSelectedRider(riderDetails);
      if (viewingRider && viewingRider.id === userId) {
        setViewingRider(riderDetails);
      }
    } catch (detailError) {
      setError(detailError instanceof Error ? detailError.message : "Failed to fetch rider details");
    }
  }

  async function loadTripHistory(userId: string) {
    if (!hasToken) return;

    try {
      const json = await adminFetch<TripHistoryResponse>(`/api/admin/users/${userId}/trips?limit=10`, token);
      setTripHistory(json.items ?? []);
    } catch {
      setTripHistory([]);
    }
  }

  async function openRiderDetails(userId: string) {
    setError(null);
    setLoading(true);
    try {
      const json = await adminFetch<unknown>(`/api/admin/users/${userId}`, token);
      const riderDetails = parseUserDetails<RiderDetails>(json);
      setSelectedRider(riderDetails);
      setViewingRider(riderDetails);
      await loadTripHistory(userId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch rider details");
    } finally {
      setLoading(false);
    }
  }

  async function updateRiderStatus(user: UserListItem) {
    if (!hasToken || user.status === "DELETED") return;

    const shouldBlock = user.status !== "SUSPENDED";
    const reason = shouldBlock ? window.prompt("Reason for blocking this rider:", "Policy violation") ?? "" : "";

    if (shouldBlock && !reason.trim()) {
      return;
    }

    setActionBusyUserId(user.id);
    setError(null);

    try {
      await adminFetch(`/api/admin/users/${user.id}/${shouldBlock ? "block" : "unblock"}`, token, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: shouldBlock ? JSON.stringify({ reason: reason.trim() }) : JSON.stringify({}),
      });

      await fetchRiders();
      if (selectedRider?.id === user.id) {
        await loadRiderDetails(user.id);
      }
      if (viewingRider?.id === user.id) {
        await loadRiderDetails(user.id);
      }
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "Failed to update rider status");
    } finally {
      setActionBusyUserId(null);
    }
  }

  if (viewingRider) {
    const profile = viewingRider.riderProfile;
    const isBusy = actionBusyUserId === viewingRider.id;
    const isSuspended = viewingRider.status === "SUSPENDED";
    const canUpdateStatus = viewingRider.status !== "DELETED";

    return (
      <section className="rounded-[30px] border border-[#e4e2ec] bg-white/90 shadow-[0_20px_45px_-35px_rgba(45,49,66,0.45)] overflow-hidden">
        <div className="bg-gradient-to-r from-[#7a53e6]/10 to-[#502bb6]/5 border-b border-[#e4e2ec] p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setViewingRider(null)}
              className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-[#d5d7e2] text-[#343b4f] hover:bg-[#f6f7fb] hover:border-[#b0b3c5] transition-all cursor-pointer shadow-sm text-lg font-bold"
              title="Back to List"
            >
              ←
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-[#1e2330]">
                  {profile?.fullName || viewingRider.fullName || "Unnamed Rider"}
                </h2>
                <span className="inline-flex rounded-full bg-violet-50 text-violet-700 border border-violet-200 px-2.5 py-0.5 text-xs font-semibold">
                  RIDER
                </span>
                <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusChipClass(viewingRider.status)}`}>
                  {viewingRider.status}
                </span>
              </div>
              <p className="text-sm text-[#59617a] mt-0.5">
                {viewingRider.email || profile?.email || "No email"} • {profile?.phoneNumber || viewingRider.phoneNumber || "No phone"}
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={isBusy || !canUpdateStatus}
            onClick={async () => {
              await updateRiderStatus(viewingRider);
              setTimeout(() => {
                void loadRiderDetails(viewingRider.id);
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

        <div className="p-6 space-y-6">
          {error ? (
            <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          ) : null}

          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_2fr] gap-6">
            <div className="space-y-6">
              <div className="rounded-2xl border border-[#eaebf2] p-5 bg-[#fcfcff] space-y-4">
                <h4 className="font-bold text-[#1e2330] border-b border-[#f0f1f6] pb-2 text-base">Rider Profile</h4>
                {profile?.profilePhotoUrl ? (
                  <img
                    src={profile.profilePhotoUrl}
                    alt="Rider profile"
                    className="h-20 w-20 rounded-full object-cover border border-[#e4e2ec]"
                  />
                ) : null}
                <dl className="grid grid-cols-1 gap-y-3 text-sm">
                  <div>
                    <dt className="text-[#6d7385] text-xs">Full Name</dt>
                    <dd className="font-semibold text-[#2d3447]">{profile?.fullName || viewingRider.fullName || "-"}</dd>
                  </div>
                  <div>
                    <dt className="text-[#6d7385] text-xs">Email</dt>
                    <dd className="text-[#2d3447] flex items-center gap-1.5">
                      {profile?.email || viewingRider.email || "-"}
                      {profile?.emailVerified ? (
                        <span className="inline-flex rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.2 text-[10px] font-semibold">
                          Verified
                        </span>
                      ) : null}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[#6d7385] text-xs">Phone</dt>
                    <dd className="text-[#2d3447]">{profile?.phoneNumber || viewingRider.phoneNumber || "-"}</dd>
                  </div>
                  <div>
                    <dt className="text-[#6d7385] text-xs">Rating</dt>
                    <dd className="text-[#2d3447]">{profile?.rating != null ? profile.rating.toFixed(1) : "-"}</dd>
                  </div>
                  <div>
                    <dt className="text-[#6d7385] text-xs">Total Trips</dt>
                    <dd className="text-[#2d3447]">{profile?.totalTrips ?? "-"}</dd>
                  </div>
                  <div>
                    <dt className="text-[#6d7385] text-xs">Profile Status</dt>
                    <dd className="text-[#2d3447]">{profile?.status || "-"}</dd>
                  </div>
                  <div>
                    <dt className="text-[#6d7385] text-xs">Joined</dt>
                    <dd className="text-[#2d3447]">{formatDate(profile?.createdAt || viewingRider.createdAt)}</dd>
                  </div>
                </dl>
              </div>

              <div className="rounded-2xl border border-[#eaebf2] p-5 bg-[#fcfcff] space-y-4">
                <h4 className="font-bold text-[#1e2330] border-b border-[#f0f1f6] pb-2 text-base">Emergency Contacts</h4>
                {profile?.emergencyContacts?.length ? (
                  <ul className="space-y-2 text-sm text-[#2d3447]">
                    {profile.emergencyContacts.map((contact) => (
                      <li key={contact} className="font-mono">{contact}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-[#6d7385]">No emergency contacts on file.</p>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-bold text-[#1e2330]">Recent Trip History</h3>
              {tripHistory.length > 0 ? (
                <div className="space-y-3">
                  {tripHistory.map((trip) => (
                    <div key={trip.id} className="rounded-2xl border border-[#eaebf2] p-4 bg-white text-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#2d3447]">{trip.status || "UNKNOWN"}</span>
                        {trip.createdAt ? (
                          <span className="text-xs text-[#6d7385]">{formatDate(trip.createdAt)}</span>
                        ) : null}
                      </div>
                      {trip.pickupAddress ? (
                        <p className="text-[#59617a] mt-1 text-xs">From: {trip.pickupAddress}</p>
                      ) : null}
                      {trip.dropoffAddress ? (
                        <p className="text-[#59617a] text-xs">To: {trip.dropoffAddress}</p>
                      ) : null}
                      {trip.fare != null ? (
                        <p className="text-[#2d3447] mt-1 font-semibold">${trip.fare.toFixed(2)}</p>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-[#eaebf2] p-8 text-center bg-white">
                  <span className="text-3xl">🚗</span>
                  <p className="text-sm font-semibold text-[#343b4f] mt-2">No Trip History</p>
                  <p className="text-xs text-[#6d7385] mt-1">This rider has no recorded trips yet.</p>
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
      <PanelHeader
        title="Rider Management"
        subtitle="Search, filter, and manage rider accounts and profile details."
        icon="award"
      />

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
              void fetchRiders();
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
                    <th className="px-4 py-3 font-semibold">Rider</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Joined</th>
                    <th className="px-4 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td className="px-4 py-5 text-[#697189]" colSpan={4}>
                        Loading riders...
                      </td>
                    </tr>
                  ) : data.items.length === 0 ? (
                    <tr>
                      <td className="px-4 py-5 text-[#697189]" colSpan={4}>
                        No riders found for the current filters.
                      </td>
                    </tr>
                  ) : (
                    data.items.map((rider) => {
                      const isBusy = actionBusyUserId === rider.id;
                      const isSuspended = rider.status === "SUSPENDED";
                      const canUpdateStatus = rider.status !== "DELETED";

                      return (
                        <tr
                          key={rider.id}
                          className="border-t border-[#f0f1f6] hover:bg-[#fafbff] cursor-pointer"
                          onClick={() => void openRiderDetails(rider.id)}
                        >
                          <td className="px-4 py-3">
                            <p className="font-semibold text-[#2f3547]">{rider.fullName || "Unnamed rider"}</p>
                            <p className="text-[#6b7389] text-xs">{rider.email || rider.phoneNumber || rider.id}</p>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusChipClass(rider.status)}`}>
                              {rider.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-[#44506a]">{formatDate(rider.createdAt)}</td>
                          <td className="px-4 py-3">
                            <button
                              type="button"
                              disabled={isBusy || !canUpdateStatus}
                              onClick={(event) => {
                                event.stopPropagation();
                                void updateRiderStatus(rider);
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

          <aside className="rounded-2xl border border-[#eaebf2] p-4 bg-[#fcfcff]">
            <h3 className="text-lg font-bold text-[#30374a]">Rider details</h3>
            {selectedRider ? (
              <dl className="mt-3 space-y-3 text-sm">
                <div>
                  <dt className="text-[#6d7385]">ID</dt>
                  <dd className="font-mono text-xs text-[#2d3447] break-all">{selectedRider.id}</dd>
                </div>
                <div>
                  <dt className="text-[#6d7385]">Name</dt>
                  <dd className="text-[#2d3447]">{selectedRider.riderProfile?.fullName || selectedRider.fullName || "-"}</dd>
                </div>
                <div>
                  <dt className="text-[#6d7385]">Email</dt>
                  <dd className="text-[#2d3447]">{selectedRider.riderProfile?.email || selectedRider.email || "-"}</dd>
                </div>
                <div>
                  <dt className="text-[#6d7385]">Phone</dt>
                  <dd className="text-[#2d3447]">{selectedRider.riderProfile?.phoneNumber || selectedRider.phoneNumber || "-"}</dd>
                </div>
                <div>
                  <dt className="text-[#6d7385]">Rating</dt>
                  <dd className="text-[#2d3447]">
                    {selectedRider.riderProfile?.rating != null ? selectedRider.riderProfile.rating.toFixed(1) : "-"}
                  </dd>
                </div>
                <div>
                  <dt className="text-[#6d7385]">Total trips</dt>
                  <dd className="text-[#2d3447]">{selectedRider.riderProfile?.totalTrips ?? "-"}</dd>
                </div>
                <div>
                  <dt className="text-[#6d7385]">Status</dt>
                  <dd>
                    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusChipClass(selectedRider.status)}`}>
                      {selectedRider.status}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-[#6d7385]">Created</dt>
                  <dd className="text-[#2d3447]">{formatDate(selectedRider.createdAt)}</dd>
                </div>
              </dl>
            ) : (
              <p className="mt-3 text-sm text-[#6d7385]">Select a rider in the table to inspect account details.</p>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}
