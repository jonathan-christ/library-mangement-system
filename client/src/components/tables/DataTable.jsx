// import PropTypes from 'prop-types'
// import { useReactTable, getCoreRowModel } from '@tanstack/react-table'

// DataTable.propTypes = {
//     data: PropTypes.array,
//     cols: PropTypes.array
// }
// function DataTable({ data, cols }) {

//     const table = useReactTable({
//         data,
//         columns,
//         getCoreRowModel: getCoreRowModel(),
//     })
//     return (
//         <table>
//             <thead>
//                 {table.getHeaderGroups().map((headerGroup) => {
//                     <tr key={headerGroup.id}>
//                         {headerGroup.headers.map(header => {
//                             {header.column.columnDef.header}
//                         })}
//                     </tr>
//                 })}
//             </thead>
//         </table>
//     )
// }

// export default DataTable