import z from "zod";

export const searchFriendSchema = z.object({
    name : z.string().nonempty()
})
export type SearchFriend = z.infer<typeof searchFriendSchema>




export type Friend = {
  id: number
  name: string
}

type Message = {
  id: number;
  sender: Friend;
  created_at: string; // ISO date string
};

type Pagination = {
  total: string;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export type FriendData = {
  data: Friend[];
  pagination: Pagination;
};

export type FriendRequestData = {
  data: Message[],
  pagination: Pagination
}