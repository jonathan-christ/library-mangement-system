import PropTypes from "prop-types"
import { useReactTable, flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, getFilteredRowModel } from '@tanstack/react-table'
import { Pagination, TextInput } from "flowbite-react";
import TableTheme from "../table/TableTheme";
import { useState } from "react";
import { IoSearch } from "react-icons/io5";
import { MdAddToPhotos } from "react-icons/md";
import {TbMoodLookLeft} from 'react-icons/tb'

function TableLayout({ data, columns, addShow }) {
    const [sorting, setSorting] = useState([])
    const [filtering, setFiltering] = useState('')
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting: sorting,
            globalFilter: filtering,
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setFiltering
    })

    return (
        <div className="w-full min-h-full">
            <div className="flex flex-row gap-2 align-center h-max ml-2">
                {addShow &&
                    <button className="text-white hover:text-text-200 duration-100 flex pt-2 bg-primary-400 p-2 mb-4 rounded-lg" size="sm" onClick={() => addShow(true)}>
                        <MdAddToPhotos size={25} />
                    </button>
                }
                <TextInput
                    type="text"
                    placeholder="Search items here"
                    value={filtering}
                    onChange={e => setFiltering(e.target.value)}
                    required
                    theme={{ input: 'p-1 border-accent-400' }}
                    className="mb-4 rounded w-max flex-end"
                    icon={IoSearch}
                />
            </div>
            <div className="overflow-x-auto rounded-lg mx-2 shadow-lg">
                <table className="h-3/4 w-full text-text-900 bg-background-100 min-w-max">
                    <thead className="bg-primary-400 text-white text-md">
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th
                                        key={header.id}
                                        colSpan={header.colSpan}
                                        onClick={header.column.getToggleSortingHandler()}
                                        className="px-6 py-3 font-semibold cursor-pointer"
                                    >
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                        {{ asc: '↑', desc: '↓' }[header.column.getIsSorted() ?? null]}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="">
                        {table.getRowModel().rows.map((row, idx) => (
                            <tr key={row.id} className={(idx % 2 != 0 ? "bg-accent-100 " : "bg-accent-50 ") + "hover:bg-accent-400 hover:bg-opacity-25"}>
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id} align={(cell.column.columnDef.meta)?.align} className="px-6 py-2 h-[45px] overflow-x-auto">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
                {data.length === 0 && (
                    <div className="flex flex-col items-center  w-full p-10 bg-background-50">
                        <TbMoodLookLeft size={100} className='text-primary-800' />
                        Table looks empty!
                    </div>
                )}
            </div>
            <div className="flex sm:justify-center pt-4">
                <Pagination
                    currentPage={table.getState().pagination.pageIndex + 1}
                    totalPages={table.getPageCount()}
                    onPageChange={page => table.setPageIndex(page - 1)}
                    theme={TableTheme}
                    showIcons
                    className="text-accent-400"
                />
            </div>
        </div>

    )
}

TableLayout.propTypes = {
    addShow: PropTypes.func,
    columns: PropTypes.any,
    data: PropTypes.any
}

export default TableLayout