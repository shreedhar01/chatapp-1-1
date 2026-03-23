import type { FriendItem } from "@/schema/friend.schema"

export const Messages = ({friendItem}:{friendItem:FriendItem})=>{
    return(
        <div className="flex items-center justify-center h-full border">
            messages{friendItem.friend.id}
        </div>
    )
}