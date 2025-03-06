import { Container, Heading, Text } from "@chakra-ui/react"

import DeleteConfirmation from "./DeleteConfirmation"

const DeleteAccount = () => {
  return (
    <Container maxW="full">
      <Heading size="sm" py={4}>
        删除账户
      </Heading>
      <Text>
        点击删除按钮，删除账号所有内容
      </Text>
      <DeleteConfirmation />
    </Container>
  )
}
export default DeleteAccount
