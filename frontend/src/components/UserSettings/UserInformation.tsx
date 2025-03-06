import {
  Box,
  Button,
  Container,
  Flex,
  Input,
  Text,
} from "@chakra-ui/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { type SubmitHandler, useForm } from "react-hook-form"

import {
  type ApiError,
  type UserPublic,
  type UserUpdateMe,
  UsersService,
} from "@/client"
import useAuth from "@/hooks/useAuth"
import useCustomToast from "@/hooks/useCustomToast"
import { emailPattern, handleError } from "@/utils"
import { Field } from "../ui/field"

const UserInformation = () => {
  const queryClient = useQueryClient()
  const { showSuccessToast } = useCustomToast()
  const [editMode, setEditMode] = useState(false)
  const { user: currentUser } = useAuth()
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { isSubmitting, errors, isDirty },
  } = useForm<UserPublic>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      full_name: currentUser?.full_name,
      email: currentUser?.email,
    },
  })

  const toggleEditMode = () => {
    setEditMode(!editMode)
  }

  const mutation = useMutation({
    mutationFn: (data: UserUpdateMe) =>
        UsersService.updateUserMe({ requestBody: data }),
    onSuccess: () => {
      showSuccessToast("用户信息更新成功。")
    },
    onError: (err: ApiError) => {
      handleError(err)
    },
    onSettled: () => {
      queryClient.invalidateQueries()
    },
  })

  const onSubmit: SubmitHandler<UserUpdateMe> = async (data) => {
    mutation.mutate(data)
  }

  const onCancel = () => {
    reset()
    toggleEditMode()
  }

  return (
      <>
        <Container maxW="full">
          <Box
              w={{ sm: "full", md: "sm" }}
              as="form"
              onSubmit={handleSubmit(onSubmit)}
          >
            <Field label="运动队名称">
              {editMode ? (
                  <Input
                      {...register("full_name", { maxLength: 30 })}
                      type="text"
                      size="md"
                  />
              ) : (
                  <Text
                      fontSize="md"
                      py={2}
                      color={!currentUser?.full_name ? "gray" : "inherit"}
                      truncate
                      maxW="sm"
                  >
                    {currentUser?.full_name || "暂无"}
                  </Text>
              )}
            </Field>
            <Field
                mt={4}
                label="电子邮箱"
                invalid={!!errors.email}
                errorText={errors.email?.message}
            >
              {editMode ? (
                  <Input
                      {...register("email", {
                        required: "电子邮箱是必填项",
                        pattern: emailPattern,
                      })}
                      type="email"
                      size="md"
                  />
              ) : (
                  <Text fontSize="md" py={2} truncate maxW="sm">
                    {currentUser?.email}
                  </Text>
              )}
            </Field>
            <Flex mt={4} gap={3}>
              <Button
                  variant="solid"
                  onClick={toggleEditMode}
                  type={editMode ? "button" : "submit"}
                  loading={editMode ? isSubmitting : false}
                  disabled={editMode ? !isDirty || !getValues("email") : false}
              >
                {editMode ? "保存" : "编辑"}
              </Button>
              {editMode && (
                  <Button
                      variant="subtle"
                      colorPalette="gray"
                      onClick={onCancel}
                      disabled={isSubmitting}
                  >
                    取消
                  </Button>
              )}
            </Flex>
          </Box>
        </Container>
      </>
  )
}

export default UserInformation