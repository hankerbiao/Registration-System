import {
    Container,
    EmptyState,
    Flex,
    Heading,
    Table,
    VStack,
} from "@chakra-ui/react"
import {useQuery, useQueryClient} from "@tanstack/react-query"
import {createFileRoute, useNavigate} from "@tanstack/react-router"
import {FiSearch} from "react-icons/fi"
import {z} from "zod"

import {AthletesService, type UserPublic} from "@/client"
import {ItemActionsMenu} from "@/components/Common/ItemActionsMenu"
import AddItem from "@/components/Items/AddItem"
import PendingItems from "@/components/Pending/PendingItems"
import {
    PaginationItems,
    PaginationNextTrigger,
    PaginationPrevTrigger,
    PaginationRoot,
} from "@/components/ui/pagination.tsx"

const itemsSearchSchema = z.object({
    page: z.number().catch(1),
})

const PER_PAGE = 10

function getItemsQueryOptions({page}: { page: number }) {
    return {
        queryFn: () =>
            AthletesService.readAthletes({skip: (page - 1) * PER_PAGE, limit: PER_PAGE}),
        queryKey: ["items", {page}],
    }
}

export const Route = createFileRoute("/_layout/items")({
    component: Items,
    validateSearch: (search) => itemsSearchSchema.parse(search),
})

function ItemsTable() {
    const navigate = useNavigate({from: Route.fullPath})
    const {page} = Route.useSearch()
    const queryClient = useQueryClient()
    const currentUser = queryClient.getQueryData<UserPublic>(["currentUser"])

    const isAdmin = currentUser?.is_superuser
    const {data, isLoading, isPlaceholderData} = useQuery({
        ...getItemsQueryOptions({page}),
        placeholderData: (prevData) => prevData,
    })

    const setPage = (page: number) =>
        navigate({
            search: (prev: { [key: string]: string }) => ({...prev, page}),
        })

    const items = data?.data.slice(0, PER_PAGE) ?? []
    const count = data?.count ?? 0

    if (isLoading) {
        return <PendingItems/>
    }

    if (items.length === 0) {
        return (
            <EmptyState.Root>
                <EmptyState.Content>
                    <EmptyState.Indicator>
                        <FiSearch/>
                    </EmptyState.Indicator>
                    <VStack textAlign="center">
                        <EmptyState.Title>您还没有任何运动员</EmptyState.Title>
                        <EmptyState.Description>
                            添加一个新运动员以开始
                        </EmptyState.Description>
                    </VStack>
                </EmptyState.Content>
            </EmptyState.Root>
        )
    }

    return (
        <>
            <Table.Root size={{base: "sm", md: "md"}}>
                <Table.Header>
                    <Table.Row>
                        {isAdmin && <Table.ColumnHeader w="sm">单位</Table.ColumnHeader>}
                        <Table.ColumnHeader w="sm">姓名</Table.ColumnHeader>
                        <Table.ColumnHeader w="sm">性别</Table.ColumnHeader>
                        <Table.ColumnHeader w="sm">组手级别</Table.ColumnHeader>
                        <Table.ColumnHeader w="sm">个人组手</Table.ColumnHeader>
                        <Table.ColumnHeader w="sm">团体组手</Table.ColumnHeader>
                        <Table.ColumnHeader w="sm">个人型</Table.ColumnHeader>
                        <Table.ColumnHeader w="sm">混合型</Table.ColumnHeader>
                        <Table.ColumnHeader w="sm">团体型</Table.ColumnHeader>
                        <Table.ColumnHeader w="sm">混合团体型</Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {items?.map((item) => (
                        <Table.Row key={item.id} opacity={isPlaceholderData ? 0.5 : 1}>
                            {isAdmin && (
                                <Table.Cell truncate maxW="sm">
                                    {item.unit}
                                </Table.Cell>
                            )}
                            <Table.Cell truncate maxW="sm">
                                {item.name}
                            </Table.Cell>
                            <Table.Cell truncate maxW="sm">
                                {item.gender}
                            </Table.Cell>
                            <Table.Cell truncate maxW="sm">
                                {item.kumite_category}
                            </Table.Cell>

                            <Table.Cell truncate maxW="sm">
                                {item.kumite_individual}
                            </Table.Cell>
                            <Table.Cell truncate maxW="sm">
                                {item.kumite_team}
                            </Table.Cell>
                            <Table.Cell truncate maxW="sm">
                                {item.individual_kata}
                            </Table.Cell>
                            <Table.Cell truncate maxW="sm">
                                {item.mixed_double_kata}
                            </Table.Cell>
                            <Table.Cell truncate maxW="sm">
                                {item.team_kata}
                            </Table.Cell>
                            <Table.Cell truncate maxW="sm">
                                {item.mixed_team_kata}
                            </Table.Cell>

                            <Table.Cell>
                                <ItemActionsMenu item={item}/>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>
            <Flex justifyContent="flex-end" mt={4}>
                <PaginationRoot
                    count={count}
                    pageSize={PER_PAGE}
                    onPageChange={({page}) => setPage(page)}
                >
                    <Flex>
                        <PaginationPrevTrigger/>
                        <PaginationItems/>
                        <PaginationNextTrigger/>
                    </Flex>
                </PaginationRoot>
            </Flex>
        </>
    )
}

function Items() {
    return (
        <Container maxW="full">
            <Heading size="lg" pt={12}>
                运动员管理
            </Heading>
            <AddItem/>
            <ItemsTable/>
        </Container>
    )
}