import { Badge, Container, Flex, Heading, Table } from "@chakra-ui/react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { z } from "zod"

import { type UserPublic, UsersService } from "@/client"
import AddUser from "@/components/Admin/AddUser"
import { UserActionsMenu } from "@/components/Common/UserActionsMenu"
import PendingUsers from "@/components/Pending/PendingUsers"
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@/components/ui/pagination.tsx"

const usersSearchSchema = z.object({
  page: z.number().catch(1),
})

const PER_PAGE = 5

function getUsersQueryOptions({ page }: { page: number }) {
  return {
    queryFn: () =>
        UsersService.readUsers({ skip: (page - 1) * PER_PAGE, limit: PER_PAGE }),
    queryKey: ["users", { page }],
  }
}

export const Route = createFileRoute("/_layout/admin")({
  component: Admin,
  validateSearch: (search) => usersSearchSchema.parse(search),
})

function UsersTable() {
  const queryClient = useQueryClient()
  const currentUser = queryClient.getQueryData<UserPublic>(["currentUser"])
  const navigate = useNavigate({ from: Route.fullPath })
  const { page } = Route.useSearch()

  const { data, isLoading, isPlaceholderData } = useQuery({
    ...getUsersQueryOptions({ page }),
    placeholderData: (prevData) => prevData,
  })

  const setPage = (page: number) =>
      navigate({
        search: (prev: { [key: string]: string }) => ({ ...prev, page }),
      })

  const users = data?.data.slice(0, PER_PAGE) ?? []
  const count = data?.count ?? 0

  if (isLoading) {
    return <PendingUsers />
  }

  return (
      <>
        <Table.Root size={{ base: "sm", md: "md" }}>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader w="sm">全名</Table.ColumnHeader>
              <Table.ColumnHeader w="sm">邮箱</Table.ColumnHeader>
              <Table.ColumnHeader w="sm">角色</Table.ColumnHeader>
              <Table.ColumnHeader w="sm">报名人数</Table.ColumnHeader>
              <Table.ColumnHeader w="sm">操作</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {users?.map((user) => (
                <Table.Row key={user.id} opacity={isPlaceholderData ? 0.5 : 1}>
                  <Table.Cell color={!user.full_name ? "gray" : "inherit"}>
                    {user.full_name || "N/A"}
                    {currentUser?.id === user.id && (
                        <Badge ml="1" colorScheme="teal">
                          You
                        </Badge>
                    )}
                  </Table.Cell>
                  <Table.Cell truncate maxW="sm">
                    {user.email}
                  </Table.Cell>
                  <Table.Cell>
                    {user.is_superuser ? "管理员" : "普通运动队"}
                  </Table.Cell>
                    <Table.Cell>
                        {user.athletes_count}
                    </Table.Cell>
                  <Table.Cell>
                    <UserActionsMenu
                        user={user}
                        disabled={currentUser?.id === user.id}
                    />
                  </Table.Cell>
                </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
        <Flex justifyContent="flex-end" mt={4}>
          <PaginationRoot
              count={count}
              pageSize={PER_PAGE}
              onPageChange={({ page }) => setPage(page)}
          >
            <Flex>
              <PaginationPrevTrigger />
              <PaginationItems />
              <PaginationNextTrigger />
            </Flex>
          </PaginationRoot>
        </Flex>
      </>
  )
}

function Admin() {
  return (
      <Container maxW="full">
        <Heading size="lg" pt={12}>
          用户管理
        </Heading>

        <AddUser />
        <UsersTable />
      </Container>
  )
}