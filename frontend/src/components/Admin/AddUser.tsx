
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { type SubmitHandler, useForm } from "react-hook-form"

import { type UserCreate, UsersService } from "@/client"
import type { ApiError } from "@/client/core/ApiError"
import useCustomToast from "@/hooks/useCustomToast"
import { emailPattern, handleError } from "@/utils"
import {
  Button,
  DialogActionTrigger,
  DialogTitle,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react"
import { useState } from "react"
import { FaPlus } from "react-icons/fa"
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTrigger,
} from "../ui/dialog"
import { Field } from "../ui/field"

interface UserCreateForm extends UserCreate {
  confirm_password: string
}

const AddUser = () => {
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()
  const { showSuccessToast } = useCustomToast()
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isValid, isSubmitting },
  } = useForm<UserCreateForm>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      email: "",
      full_name: "",
      password: "",
      confirm_password: "",
      is_superuser: false,
      is_active: true,
    },
  })

  const mutation = useMutation({
    mutationFn: (data: UserCreate) =>
        UsersService.createUser({ requestBody: data }),
    onSuccess: () => {
      showSuccessToast("运动队创建成功。")
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

  const onSubmit: SubmitHandler<UserCreateForm> = (data) => {
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
          <Button value="add-user" my={4}>
            <FaPlus fontSize="16px" />
            添加运动队
          </Button>
        </DialogTrigger>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>添加运动队</DialogTitle>
            </DialogHeader>
            <DialogBody>
              <Text mb={4}>
                请填写以下表单以向系统添加新运动队。
              </Text>
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
                    required
                    invalid={!!errors.password}
                    errorText={errors.password?.message}
                    label="设置密码"
                >
                  <Input
                      id="password"
                      {...register("password", {
                        required: "密码是必填项",
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
                    required
                    invalid={!!errors.confirm_password}
                    errorText={errors.confirm_password?.message}
                    label="确认密码"
                >
                  <Input
                      id="confirm_password"
                      {...register("confirm_password", {
                        required: "请确认您的密码",
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
              <Button
                  variant="solid"
                  type="submit"
                  disabled={!isValid}
                  loading={isSubmitting}
              >
                保存
              </Button>
            </DialogFooter>
          </form>
          <DialogCloseTrigger />
        </DialogContent>
      </DialogRoot>
  )
}

export default AddUser