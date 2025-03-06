import { Button, DialogTitle, Text } from "@chakra-ui/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { FiTrash2 } from "react-icons/fi"

import { UsersService } from "@/client"
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTrigger,
} from "@/components/ui/dialog"
import useCustomToast from "@/hooks/useCustomToast"

const DeleteUser = ({ id }: { id: string }) => {
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()
  const { showSuccessToast, showErrorToast } = useCustomToast()
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm()

  const deleteUser = async (id: string) => {
    await UsersService.deleteUser({ userId: id })
  }

  const mutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      showSuccessToast("运动队已成功删除")
      setIsOpen(false)
    },
    onError: () => {
      showErrorToast("删除运动队时发生错误")
    },
    onSettled: () => {
      queryClient.invalidateQueries()
    },
  })

  const onSubmit = async () => {
    mutation.mutate(id)
  }

  return (
      <DialogRoot
          size={{ base: "xs", md: "md" }}
          placement="center"
          role="alertdialog"
          open={isOpen}
          onOpenChange={({ open }) => setIsOpen(open)}
      >
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" colorPalette="red">
            <FiTrash2 fontSize="16px" />
            删除运动队
          </Button>
        </DialogTrigger>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>删除运动队</DialogTitle>
            </DialogHeader>
            <DialogBody>
              <Text mb={4}>
                与该运动队关联的所有项目也将被<strong>永久删除</strong>。
                您确定吗？此操作无法撤消。
              </Text>
            </DialogBody>

            <DialogFooter gap={2}>
              <DialogActionTrigger asChild>
                <Button
                    variant="subtle"
                    colorPalette="gray"
                    disabled={isSubmitting}
                >
                  取消
                </Button>
              </DialogActionTrigger>
              <Button
                  variant="solid"
                  colorPalette="red"
                  type="submit"
                  loading={isSubmitting}
              >
                删除
              </Button>
            </DialogFooter>
            <DialogCloseTrigger />
          </form>
        </DialogContent>
      </DialogRoot>
  )
}

export default DeleteUser