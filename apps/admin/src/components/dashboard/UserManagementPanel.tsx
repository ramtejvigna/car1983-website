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

      const json = (await response.json()) as UserListResponse | { message?: string };

      if (!response.ok) {
        throw new Error((json as { message?: string }).message ?? "Failed to fetch users");
      }

      setData(json as UserListResponse);

      if (selectedUser) {
        const stillVisible = (json as UserListResponse).items.some((item) => item.id === selectedUser.id);
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
      const json = (await response.json()) as UserDetails | { message?: string };

      if (!response.ok) {
        throw new Error((json as { message?: string }).message ?? "Failed to fetch user details");
      }

      setSelectedUser(json as UserDetails);
    } catch (detailError) {
      setError(detailError instanceof Error ? detailError.message : "Failed to fetch user details");
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
                          onClick={() => void loadUserDetails(user.id)}
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
