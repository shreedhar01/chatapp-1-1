import z from "zod";

export const searchFriendSchema = z.object({
    name : z.string().nonempty()
})
export type SearchFriend = z.infer<typeof searchFriendSchema>