import {
  Button,
  ButtonGroup,
  DialogActionTrigger,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { type SubmitHandler, useForm } from "react-hook-form"
import { FaExchangeAlt } from "react-icons/fa"

import {type ApiError, AthletePublic, ItemsService} from "@/client"
import useCustomToast from "@/hooks/useCustomToast"
import { handleError } from "@/utils"
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { Field } from "../ui/field"

interface EditItemProps {
  item: AthletePublic
}

interface ItemUpdateForm {
  title: string
  description?: string
}

const EditItem = ({ item }: EditItemProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()
  const { showSuccessToast } = useCustomToast()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ItemUpdateForm>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      ...item,
      description: item.name ?? undefined,
    },
  })

  const mutation = useMutation({
    mutationFn: (data: ItemUpdateForm) =>
        ItemsService.updateItem({ id: item.id, requestBody: data }),
    onSuccess: () => {
      showSuccessToast("运动员更新成功。")
      reset()
      setIsOpen(false)
    },
    onError: (err: ApiError) => {
      handleError(err)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] })
    },
  })

  const onSubmit: SubmitHandler<ItemUpdateForm> = async (data) => {
    mutation.mutate(data)
  }

  return (
      <DialogRoot
          size={{ base: "xs", md: "md" }}
          placement="center"
          open={isOpen}
          onOpenChange={({ open }) => setIsOpen(open)}
      >
        <DialogTrigger asChild>
          <Button variant="ghost">
            <FaExchangeAlt fontSize="16px" />
            编辑运动员
          </Button>
        </DialogTrigger>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>编辑运动员</DialogTitle>
            </DialogHeader>
            <DialogBody>
              <Text mb={4}>在下方更新运动员详情。</Text>
              <VStack gap={4}>
                <Field
                    required
                    invalid={!!errors.title}
                    errorText={errors.title?.message}
                    label="标题"
                >
                  <Input
                      id="title"
                      {...register("title", {
                        required: "标题是必填项",
                      })}
                      placeholder="标题"
                      type="text"
                  />
                </Field>

                <Field
                    invalid={!!errors.description}
                    errorText={errors.description?.message}
                    label="描述"
                >
                  <Input
                      id="description"
                      {...register("description")}
                      placeholder="描述"
                      type="text"
                  />
                </Field>
              </VStack>
            </DialogBody>

            <DialogFooter gap={2}>
              <ButtonGroup>
                <DialogActionTrigger asChild>
                  <Button
                      variant="subtle"
                      colorPalette="gray"
                      disabled={isSubmitting}
                  >
                    取消
                  </Button>
                </DialogActionTrigger>
                <Button variant="solid" type="submit" loading={isSubmitting}>
                  保存
                </Button>
              </ButtonGroup>
            </DialogFooter>
          </form>
          <DialogCloseTrigger />
        </DialogContent>
      </DialogRoot>
  )
}

export default EditItem