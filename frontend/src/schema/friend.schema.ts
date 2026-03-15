import z from "zod";

export const searchFriendSchema = z.object({
    name : z.string().nonempty()
})
export type SearchFriend = z.infer<typeof searchFriendSchema>




export type Friend = {
  id: number
  name: string
}

export type FriendData = {
  data: Friend[]
  pagination: {
    total: string
    limit: number
    page: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}