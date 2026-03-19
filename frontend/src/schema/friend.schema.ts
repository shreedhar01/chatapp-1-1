import z from "zod";

export const searchFriendSchema = z.object({
    name : z.string().nonempty()
})
export type SearchFriend = z.infer<typeof searchFriendSchema>




export type Friend = {
  id: number
  name: string
}

export type Message = {
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


export type AcceptedFriend = {
  id: number;
  name: string;
  email: string;
  status: "active" | "offline"; 
  lastSeen: Date; 
}

export type FriendItem = {
  id: number;
  friend: AcceptedFriend;
}

export interface DataWrapper {
  data: FriendItem[];
  pagination: Pagination;
}