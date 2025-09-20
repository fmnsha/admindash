'use client'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import axios from "axios"
import { useQuery } from "@tanstack/react-query"



export function TableDemo({ id }: { id: string }) {

    const { isPending, error, data } = useQuery({
        queryKey: ['boarddata', id],
        queryFn: () =>
            axios.get(`http://localhost:3332/boards/${id}/items/all`).then((res) => {
                console.log(res.data)
                return res.data
            }),
        staleTime: 0,
        refetchOnMount: true
    })

    if (isPending) return <div>Loading...</div>
    if (error) return <div>Error: {error.message}</div>
    if (!data) return <div>No data</div>

    var fields = data.board.fields
    var items: any[] = data.data

    return (
        <Table>
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
                <TableRow>
                    {fields.map((field: { id: string, label: string }) => <TableHead key={field.id}>{field.label}</TableHead>)}
                    
                </TableRow>
            </TableHeader>
            <TableBody>
                {items?.map((item: any) => {
                    return (
                        <TableRow key={item.id}>
                            {fields.map((field: any) => <TableCell key={field.id}>{JSON.stringify(item.data[field.id])}</TableCell>)}

                        </TableRow>
                    )
                })}

            </TableBody>
            {/* <TableFooter>
                <TableRow>
                    <TableCell colSpan={3}>Total</TableCell>
                    <TableCell className="text-right">$2,500.00</TableCell>
                </TableRow>
            </TableFooter> */}
        </Table>
    )
}
