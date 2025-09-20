import { TableDemo } from "./table"

export default async function BoardData({
    params,
  }: {
    params: Promise<{ id: string }>
  }) {
    const { id } = await params
    return <TableDemo id={id} />
  }
  