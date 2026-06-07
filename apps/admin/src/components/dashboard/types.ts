export type Tone = "violet" | "blue" | "green" | "amber" | "red";

export type IconName =
  | "award"
  | "bell"
  | "briefcase"
  | "car"
  | "chart"
  | "chevron"
  | "clock"
  | "dollar"
  | "file"
  | "gift"
  | "grid"
  | "help"
  | "location"
  | "map"
  | "message"
  | "pin"
  | "search"
  | "settings"
  | "sliders"
  | "star"
  | "tag"
  | "trend"
  | "truck"
  | "user"
  | "users"
  | "wallet";

export interface NavItem {
  label: string;
  icon: IconName;
  children?: Array<{
    label: string;
    emphasis?: "strong";
  }>;
}

export interface StatCard {
  label: string;
  value: string;
  delta: string;
  tone: Tone;
}

export interface MiniCard {
  label: string;
  value: string;
  tone: Tone;
}

export interface Ride {
  id: string;
  status: "In Progress" | "Completed" | "Canceled";
  vehicle: string;
  rider: string;
  driver: string;
  pickup: string;
  dropoff: string;
  fare: string;
  time: string;
}

export interface Driver {
  rank: number;
  name: string;
  initials: string;
  rating: string;
  trips: string;
  earnings: string;
  growth: string;
}
