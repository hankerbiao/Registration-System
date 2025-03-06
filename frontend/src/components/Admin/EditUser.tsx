import { useMutation, useQueryClient } from "@tanstack/react-query"
import { type SubmitHandler, useForm } from "react-hook-form"

import {
  Button,
  DialogActionTrigger,
  DialogRoot,
  DialogTrigger,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react"
import { useState } from "react"
import { FaExchangeAlt } from "react-icons/fa"

import { type UserPublic, type UserUpdate, UsersService } from "@/client"
import type { ApiError } from "@/client/core/ApiError"
import useCustomToast from "@/hooks/useCustomToast"
import { emailPattern, handleError } from "@/utils"
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import { Field } from "../ui/field"

interface EditUserProps {
  user: UserPublic
}

interface UserUpdateForm extends UserUpdate {
  confirm_password?: string
}

const EditUser = ({ user }: EditUserProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()
  const { showSuccessToast } = useCustomToast()
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<UserUpdateForm>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: user,
  })

  const mutation = useMutation({
    mutationFn: (data: UserUpdateForm) =>
        UsersService.updateUser({ userId: user.id, requestBody: data }),
    onSuccess: () => {
      showSuccessToast("运动队更新成功。")
      reset()
      setIsOpen(false)
    },
    onError: (err: ApiError) => {
      handleError(err)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })

  const onSubmit: SubmitHandler<UserUpdateForm> = async (data) => {
    if (data.password === "") {
      data.password = undefined
    }
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
          <Button variant="ghost" size="sm">
            <FaExchangeAlt fontSize="16px" />
            编辑运动队
          </Button>
        </DialogTrigger>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>编辑运动队</DialogTitle>
            </DialogHeader>
            <DialogBody>
              <Text mb={4}>在下方更新运动队详情。</Text>
              <VStack gap={4}>
                <Field
                    required
                    invalid={!!errors.email}
                    errorText={errors.email?.message}
                    label="邮箱"
                >
                  <Input
                      id="email"
                      {...register("email", {
                        required: "邮箱是必填项",
                        pattern: emailPattern,
                      })}
                      placeholder="邮箱"
                      type="email"
                  />
                </Field>

                <Field
                    invalid={!!errors.full_name}
                    errorText={errors.full_name?.message}
                    label="全名"
                >
                  <Input
                      id="name"
                      {...register("full_name")}
                      placeholder="全名"
                      type="text"
                  />
                </Field>

                <Field
                    invalid={!!errors.password}
                    errorText={errors.password?.message}
                    label="设置密码"
                >
                  <Input
                      id="password"
                      {...register("password", {
                        minLength: {
                          value: 8,
                          message: "密码必须至少8个字符",
                        },
                      })}
                      placeholder="密码"
                      type="password"
                  />
                </Field>

                <Field
                    invalid={!!errors.confirm_password}
                    errorText={errors.confirm_password?.message}
                    label="确认密码"
                >
                  <Input
                      id="confirm_password"
                      {...register("confirm_password", {
                        validate: (value) =>
                            value === getValues().password ||
                            "两次输入的密码不匹配",
                      })}
                      placeholder="密码"
                      type="password"
                  />
                </Field>
              </VStack>

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
              <Button variant="solid" type="submit" loading={isSubmitting}>
                保存
              </Button>
            </DialogFooter>
            <DialogCloseTrigger />
          </form>
        </DialogContent>
      </DialogRoot>
  )
}

export default EditUser