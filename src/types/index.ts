export type TicketStatus = "new" | "open" | "pending" | "solved" | "closed";
export type TicketPriority = "low" | "normal" | "high" | "urgent";
export type TicketChannel = "email" | "web" | "api" | "phone";
export type UserRole = "admin" | "agent" | "customer";

export interface Ticket {
  id: string;
  ticketNumber: number;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  channel: TicketChannel;
  tags: string[];
  assigneeId: string | null;
  requesterId: string;
  groupId: string | null;
  slaDeadline: Date | null;
  solvedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  requester?: User;
  assignee?: User;
  comments?: Comment[];
}

export interface Comment {
  id: string;
  ticketId: string;
  authorId: string;
  body: string;
  isInternal: boolean;
  attachments: string[];
  emailMessageId: string | null;
  createdAt: Date;
  author?: User;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string | null;
  timezone: string;
  isOnline: boolean;
  createdAt: Date;
}

export interface DashboardStats {
  openTickets: number;
  pendingTickets: number;
  solvedToday: number;
  avgResponseTime: string;
  slaBreaches: number;
  newTickets: number;
}
