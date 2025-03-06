import {Container, Heading, Input, Text} from "@chakra-ui/react"
import {
  Link as RouterLink,
  createFileRoute,
  redirect,
} from "@tanstack/react-router"
import { type SubmitHandler, useForm } from "react-hook-form"
import { FiLock, FiMail } from "react-icons/fi"

import type { Body_login_login_access_token as AccessToken } from "@/client"
import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import { InputGroup } from "@/components/ui/input-group"
import { PasswordInput } from "@/components/ui/password-input"
import useAuth, { isLoggedIn } from "@/hooks/useAuth"
// import Logo from "/assets/images/fastapi-logo.svg"
import { emailPattern, passwordRules } from "../utils"

export const Route = createFileRoute("/login")({
  component: Login,
  beforeLoad: async () => {
    if (isLoggedIn()) {
      throw redirect({
        to: "/",
      })
    }
  },
})

function Login() {
  const { loginMutation, error, resetError } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AccessToken>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      username: "",
      password: "",
    },
  })

  const onSubmit: SubmitHandler<AccessToken> = async (data) => {
    if (isSubmitting) return

    resetError()

    try {
      await loginMutation.mutateAsync(data)
    } catch {
      // error is handled by useAuth hook
    }
  }

  return (
      <>
        <Container
            as="form"
            onSubmit={handleSubmit(onSubmit)}
            h="100vh"
            maxW="sm"
            alignItems="stretch"
            justifyContent="center"
            gap={4}
            centerContent
        >
          {/*<Image*/}
          {/*  src={Logo}*/}
          {/*  alt="FastAPI logo"*/}
          {/*  height="auto"*/}
          {/*  maxW="2xs"*/}
          {/*  alignSelf="center"*/}
          {/*  mb={4}*/}
          {/*/>*/}
          <Heading textStyle="2xl">天津市大学生空手道比赛报名</Heading>

          <Field
              invalid={!!errors.username}
              errorText={errors.username?.message || !!error}
          >
            <InputGroup w="100%" startElement={<FiMail />}>
              <Input
                  id="username"
                  {...register("username", {
                    required: "用户名是必填项",
                    pattern: emailPattern,
                  })}
                  placeholder="邮箱"
                  type="email"
              />
            </InputGroup>
          </Field>
          <PasswordInput
              type="password"
              startElement={<FiLock />}
              {...register("password", passwordRules())}
              placeholder="密码"
              errors={errors}
          />
          <RouterLink to="/recover-password" className="main-link">
            忘记密码？
          </RouterLink>
          <Button variant="solid" type="submit" loading={isSubmitting} size="md">
            登录
          </Button>
          <Text>
            还没有账号？{" "}
            <RouterLink to="/signup" className="main-link">
              注册
            </RouterLink>
          </Text>
        </Container>
      </>
  )
}