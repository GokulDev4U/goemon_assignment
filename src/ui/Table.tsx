interface Column<T> {
  header: string; // Column header name
  accessor: keyof T; // Property in the data object
}

interface TableProps<T> {
  data: T[]; // Array of data objects
  columns: Column<T>[]; // Column definitions
  className?: string; // Additional styles
}

function Table<T>({ data, columns, className }: TableProps<T>) {
  return (
    <div className={`overflow-x-auto ${className || ""}`}>
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100 text-left">
            {columns.map((col, index) => (
              <th
                key={index}
                className="px-4 py-2 text-sm font-semibold text-gray-700 border border-gray-300"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >
              {columns.map((col, colIndex) => (
                <td
                  key={colIndex}
                  className="px-4 py-2 text-sm text-gray-600 border border-gray-300"
                >
                  {String(row[col.accessor]) || "-"} 
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
