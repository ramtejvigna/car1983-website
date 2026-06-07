import type { Driver, MiniCard, NavItem, Ride, StatCard, Tone } from "./types";

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", icon: "grid" },
  {
    label: "User Management",
    icon: "users",
    children: [
      { label: "All Riders" },
      { label: "Loyalty Program" },
      { label: "Corporate Accounts" },
      { label: "Referral Program" },
    ],
  },
  {
    label: "Driver Management",
    icon: "car",
    children: [
      { label: "All Drivers" },
      { label: "Pending Approval" },
      { label: "Onboarding Workflow" },
      { label: "Performance & Scoring" },
      { label: "Incentives & Bonuses" },
    ],
  },
  {
    label: "Vehicle Management",
    icon: "truck",
    children: [{ label: "All Vehicles" }, { label: "Vehicle Types" }],
  },
  {
    label: "Ride Management",
    icon: "map",
    children: [
      { label: "All Rides" },
      { label: "Active Rides" },
      { label: "Scheduled" },
      { label: "Canceled" },
    ],
  },
  {
    label: "Pricing & Fares",
    icon: "dollar",
    children: [{ label: "Fare Management" }, { label: "Dynamic Pricing" }],
  },
  {
    label: "Advanced Operations",
    icon: "settings",
    children: [
      { label: "Geofencing & Service Areas" },
      { label: "Surge Pricing Engine" },
      { label: "Ride Matching Algorithm" },
    ],
  },
  {
    label: "Financial Operations",
    icon: "dollar",
    children: [
      { label: "Commission Tiers" },
      { label: "Payout Management", emphasis: "strong" },
      { label: "Dispute Resolution" },
    ],
  },
  {
    label: "Earnings & Reports",
    icon: "file",
    children: [{ label: "Earnings Reports" }, { label: "Revenue Dashboard" }],
  },
  { label: "Promo Codes", icon: "gift" },
  { label: "Reviews & Ratings", icon: "star" },
  { label: "God's View", icon: "location" },
  { label: "Notifications", icon: "bell" },
  { label: "Documents", icon: "file" },
  { label: "Settings", icon: "settings" },
  { 
    label: "Support & Help Desk", 
    icon: "help",
    children: [{ label: "Support Dashboard" }, { label: "FAQ Management" }, { label: "Issue Reports" }]
  },
  
];

export const TOP_STATS: StatCard[] = [
  { label: "Total Users", value: "24,847", delta: "+12.5%", tone: "violet" },
  { label: "Active Drivers", value: "3,421", delta: "+8.2%", tone: "blue" },
  { label: "Today's Rides", value: "1,284", delta: "+5.1%", tone: "green" },
  { label: "Revenue (Today)", value: "$18,420", delta: "+15.3%", tone: "amber" },
];

export const ACTIVITY_STATS: MiniCard[] = [
  { label: "Active Rides", value: "127", tone: "blue" },
  { label: "Completed", value: "1,089", tone: "green" },
  { label: "Canceled", value: "68", tone: "red" },
  { label: "Commission", value: "$2,763", tone: "violet" },
];

export const RECENT_RIDES: Ride[] = [
  {
    id: "RD-001",
    status: "In Progress",
    vehicle: "SUV",
    rider: "Sarah Johnson",
    driver: "Mike Chen",
    pickup: "123 Main St",
    dropoff: "456 Oak Ave",
    fare: "$24.50",
    time: "2 min ago",
  },
  {
    id: "RD-002",
    status: "Completed",
    vehicle: "Sedan",
    rider: "James Wilson",
    driver: "Ana Martinez",
    pickup: "789 Pine Rd",
    dropoff: "321 Elm St",
    fare: "$18.00",
    time: "15 min ago",
  },
  {
    id: "RD-003",
    status: "Completed",
    vehicle: "Premium",
    rider: "Emily Davis",
    driver: "Robert Brown",
    pickup: "555 Cedar Ln",
    dropoff: "777 Maple Dr",
    fare: "$32.75",
    time: "32 min ago",
  },
  {
    id: "RD-004",
    status: "Canceled",
    vehicle: "Economy",
    rider: "Michael Lee",
    driver: "Lisa Wang",
    pickup: "999 Birch Blvd",
    dropoff: "111 Walnut Way",
    fare: "$0.00",
    time: "45 min ago",
  },
  {
    id: "RD-005",
    status: "In Progress",
    vehicle: "SUV",
    rider: "Jessica Taylor",
    driver: "David Kim",
    pickup: "222 Spruce St",
    dropoff: "888 Aspen Ct",
    fare: "$45.00",
    time: "Just now",
  },
];

export const TOP_DRIVERS: Driver[] = [
  { rank: 1, name: "Mike Chen", initials: "MC", rating: "4.95", trips: "1247", earnings: "$12,450", growth: "+12%" },
  { rank: 2, name: "Ana Martinez", initials: "AM", rating: "4.92", trips: "1089", earnings: "$10,890", growth: "+12%" },
  { rank: 3, name: "Robert Brown", initials: "RB", rating: "4.88", trips: "956", earnings: "$9,560", growth: "+12%" },
  { rank: 4, name: "Lisa Wang", initials: "LW", rating: "4.85", trips: "823", earnings: "$8,230", growth: "+12%" },
  { rank: 5, name: "David Kim", initials: "DK", rating: "4.82", trips: "712", earnings: "$7,120", growth: "+12%" },
];

export const TONE_ICON_BG: Record<Tone, string> = {
  violet: "bg-violet-100 text-violet-500",
  blue: "bg-sky-100 text-sky-500",
  green: "bg-emerald-100 text-emerald-600",
  amber: "bg-amber-100 text-amber-500",
  red: "bg-red-100 text-red-500",
};

export const TONE_TEXT: Record<Tone, string> = {
  violet: "text-violet-500",
  blue: "text-sky-500",
  green: "text-emerald-600",
  amber: "text-amber-500",
  red: "text-red-500",
};

export const STATUS_STYLES: Record<Ride["status"], string> = {
  "In Progress": "bg-sky-50 text-sky-600 border-sky-200",
  Completed: "bg-emerald-50 text-emerald-600 border-emerald-200",
  Canceled: "bg-red-50 text-red-500 border-red-200",
};
