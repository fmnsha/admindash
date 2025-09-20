'use client'
import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"
import axios from "axios"
import Link from "next/link"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"

import {
    useQuery,
    useMutation,
    useQueryClient,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'

interface board {
    title: string
    url: string
    icon: string
}

export function AppSidebar() {

    const { isPending, error, data } = useQuery({
        queryKey: ['repoData'],
        queryFn: () =>
            axios.get('http://localhost:3332/boards/all').then((res) =>{
                console.log(res.data)
                return res.data
            } )
    })


    if (isPending) return <div>Loading...</div>
    if (error) return <div>Error: {error.message}</div>
   

var boards: board[] = data.map((board: any) => ({
    title: board.title,
    url: `/board/${board._id}`,
    icon: board.icon,
}))

    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <Collapsible defaultOpen className="group/collapsible">
                                <SidebarMenuItem>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton >Boards</SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {boards.map(board => <SidebarMenuSubItem key={board.title}><Link href={board.url}>{board.title}</Link></SidebarMenuSubItem>)}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </SidebarMenuItem>
                            </Collapsible>
                        </SidebarMenu>
                        <SidebarMenu>
                            <Collapsible defaultOpen className="group/collapsible">
                                <SidebarMenuItem>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton >Automation</SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {/* {items.map(item => <SidebarMenuSubItem key={item.title}><a href={item.url}>{item.title}</a></SidebarMenuSubItem>)} */}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </SidebarMenuItem>
                            </Collapsible>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}