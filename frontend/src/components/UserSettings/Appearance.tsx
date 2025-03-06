import { Container, Heading, Stack } from "@chakra-ui/react"
import { useTheme } from "next-themes"

import { Radio, RadioGroup } from "@/components/ui/radio"

const Appearance = () => {
  const { theme, setTheme } = useTheme()

  return (
      <>
        <Container maxW="full">
          <Heading size="sm" py={4}>
            外观
          </Heading>

          <RadioGroup
              onValueChange={(e) => setTheme(e.value)}
              value={theme}
              colorPalette="teal"
          >
            <Stack>
              <Radio value="system">跟随系统</Radio>
              <Radio value="light">浅色模式</Radio>
              <Radio value="dark">深色模式</Radio>
            </Stack>
          </RadioGroup>
        </Container>
      </>
  )
}
export default Appearance