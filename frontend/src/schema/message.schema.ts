export type Message = {
    id: number;
    senderId: number;
    content: string;
    type: "text" | "file" | "video" | "audio" | "image";
    status: "sent" | "delivered" | "read";
    createdAt: string;
};

type Pagination = {
  total: string;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export type MessageData = {
  data: Message[];
  pagination: Pagination;
};