import z from "zod";

export type Content = {
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
  data: Content[];
  pagination: Pagination;
};

export const messageSentSchema = z.object({
  content: z.string().min(1).max(255),
  receiverId: z.number()
})
export type MessageFormate = z.infer<typeof messageSentSchema>