import { IconButton } from "@chakra-ui/react"
import { BsThreeDotsVertical } from "react-icons/bs"
import { MenuContent, MenuRoot, MenuTrigger } from "../ui/menu"

import {AthletePublic} from "@/client"
import DeleteItem from "../Items/DeleteItem"

interface ItemActionsMenuProps {
  item: AthletePublic
}

export const ItemActionsMenu = ({ item }: ItemActionsMenuProps) => {
  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <IconButton variant="ghost" color="inherit">
          <BsThreeDotsVertical />
        </IconButton>
      </MenuTrigger>
      <MenuContent>
        {/*<EditItem item={item} />*/}
        <DeleteItem id={item.id} />
      </MenuContent>
    </MenuRoot>
  )
}
