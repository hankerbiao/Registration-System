import { Container, Heading, Tabs } from "@chakra-ui/react"
import { createFileRoute } from "@tanstack/react-router"

import Appearance from "@/components/UserSettings/Appearance"
import ChangePassword from "@/components/UserSettings/ChangePassword"
import DeleteAccount from "@/components/UserSettings/DeleteAccount"
import UserInformation from "@/components/UserSettings/UserInformation"
import useAuth from "@/hooks/useAuth"

const tabsConfig = [
    { value: "my-profile", title: "我的资料", component: UserInformation },
    { value: "password", title: "密码", component: ChangePassword },
    { value: "appearance", title: "外观", component: Appearance },
    { value: "danger-zone", title: "危险区域", component: DeleteAccount },
]

export const Route = createFileRoute("/_layout/settings")({
    component: UserSettings,
})

function UserSettings() {
    const { user: currentUser } = useAuth()
    const finalTabs = currentUser?.is_superuser
        ? tabsConfig.slice(0, 3)
        : tabsConfig

    if (!currentUser) {
        return null
    }

    return (
        <Container maxW="full">
            <Heading size="lg" textAlign={{ base: "center", md: "left" }} py={12}>
                我的信息
            </Heading>

            <Tabs.Root defaultValue="my-profile" variant="subtle">
                <Tabs.List>
                    {finalTabs.map((tab) => (
                        <Tabs.Trigger key={tab.value} value={tab.value}>
                            {tab.title}
                        </Tabs.Trigger>
                    ))}
                </Tabs.List>
                {finalTabs.map((tab) => (
                    <Tabs.Content key={tab.value} value={tab.value}>
                        <tab.component />
                    </Tabs.Content>
                ))}
            </Tabs.Root>
        </Container>
    )
}