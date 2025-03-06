import { Box, Button, Container, Heading, VStack } from "@chakra-ui/react"
import { useMutation } from "@tanstack/react-query"
import { type SubmitHandler, useForm } from "react-hook-form"
import { FiLock } from "react-icons/fi"

import { type ApiError, type UpdatePassword, UsersService } from "@/client"
import useCustomToast from "@/hooks/useCustomToast"
import { confirmPasswordRules, handleError, passwordRules } from "@/utils"
import { PasswordInput } from "../ui/password-input"

interface UpdatePasswordForm extends UpdatePassword {
  confirm_password: string
}

const ChangePassword = () => {
  const { showSuccessToast } = useCustomToast()
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isValid, isSubmitting },
  } = useForm<UpdatePasswordForm>({
    mode: "onBlur",
    criteriaMode: "all",
  })

  const mutation = useMutation({
    mutationFn: (data: UpdatePassword) =>
        UsersService.updatePasswordMe({ requestBody: data }),
    onSuccess: () => {
      showSuccessToast("密码更新成功。")
      reset()
    },
    onError: (err: ApiError) => {
      handleError(err)
    },
  })

  const onSubmit: SubmitHandler<UpdatePasswordForm> = async (data) => {
    mutation.mutate(data)
  }

  return (
      <>
        <Container maxW="full">
          <Heading size="sm" py={4}>
            修改密码
          </Heading>
          <Box as="form" onSubmit={handleSubmit(onSubmit)}>
            <VStack gap={4} w={{ base: "100%", md: "sm" }}>
              <PasswordInput
                  type="current_password"
                  startElement={<FiLock />}
                  {...register("current_password", passwordRules())}
                  placeholder="当前密码"
                  errors={errors}
              />
              <PasswordInput
                  type="new_password"
                  startElement={<FiLock />}
                  {...register("new_password", passwordRules())}
                  placeholder="新密码"
                  errors={errors}
              />
              <PasswordInput
                  type="confirm_password"
                  startElement={<FiLock />}
                  {...register("confirm_password", confirmPasswordRules(getValues))}
                  placeholder="确认新密码"
                  errors={errors}
              />
            </VStack>
            <Button
                variant="solid"
                mt={4}
                type="submit"
                loading={isSubmitting}
                disabled={!isValid}
            >
              保存
            </Button>
          </Box>
        </Container>
      </>
  )
}
export default ChangePassword