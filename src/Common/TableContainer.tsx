import React, { Fragment, useState } from "react";
import { Table, Button, Form } from "react-bootstrap";
import {
    useReactTable,
    getCoreRowModel,
    flexRender
} from "@tanstack/react-table";

interface TableContainerProps {
    columns?: any;
    data?: any;
    tableClass?: string;
    theadClass?: string;
    tdColumn?: string;
    thColumn?: string;
    divClassName?: string;
    isBordered?: boolean;
    customPageSize?: number;
    isPagination?: boolean;
    currentPage?: number;
    totalPages?: number;
    onPageChange?: (page: number) => void;
    onPageSizeChange?: (size: number) => void;
}

const TableContainer = ({
                            columns,
                            data,
                            tableClass,
                            theadClass,
                            tdColumn,
                            thColumn,
                            divClassName,
                            isBordered,
                            isPagination,
                            customPageSize = 10,
                            currentPage = 1,
                            totalPages = 1,
                            onPageChange,
                            onPageSizeChange,
                        }: TableContainerProps) => {
    const [pageSize, setPageSize] = useState(customPageSize);

    const table = useReactTable({
        columns,
        data,
        manualPagination: true,
        manualFiltering: true,
        pageCount: totalPages,
        getCoreRowModel: getCoreRowModel()
    });

    const { getHeaderGroups, getRowModel } = table;

    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSize = Number(e.target.value);
        setPageSize(newSize);
        onPageSizeChange?.(newSize);
    };

    const renderPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5; // Adjust based on container width

        // Always show first page
        pages.push(
            <Button
                key={1}
                variant={currentPage === 1 ? "primary" : "outline-primary"}
                size="sm"
                onClick={() => onPageChange?.(1)}
                className="mx-1"
            >
                1
            </Button>
        );

        // Determine range of pages to show
        let startPage = Math.max(2, currentPage - 1);
        let endPage = Math.min(totalPages - 1, currentPage + 1);

        // Adjust if we're near the start
        if (currentPage <= 3) {
            endPage = Math.min(4, totalPages - 1);
        }
        // Adjust if we're near the end
        else if (currentPage >= totalPages - 2) {
            startPage = Math.max(totalPages - 3, 2);
        }

        // Add ellipsis if needed
        if (startPage > 2) {
            pages.push(<span key="left-ellipsis" className="mx-1">...</span>);
        }

        // Add middle pages
        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <Button
                    key={i}
                    variant={currentPage === i ? "primary" : "outline-primary"}
                    size="sm"
                    onClick={() => onPageChange?.(i)}
                    className="mx-1"
                >
                    {i}
                </Button>
            );
        }

        // Add ellipsis if needed
        if (endPage < totalPages - 1) {
            pages.push(<span key="right-ellipsis" className="mx-1">...</span>);
        }

        // Always show last page if different from first
        if (totalPages > 1) {
            pages.push(
                <Button
                    key={totalPages}
                    variant={currentPage === totalPages ? "primary" : "outline-primary"}
                    size="sm"
                    onClick={() => onPageChange?.(totalPages)}
                    className="mx-1"
                >
                    {totalPages}
                </Button>
            );
        }

        return pages;
    };

    return (
        <Fragment>
            <div className={divClassName || "table-responsive"}>
                <Table style={{hieght:'300px'}} className={tableClass} bordered={isBordered}>
                    <thead className={theadClass}>
                    {getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th key={header.id} colSpan={header.colSpan} className={thColumn || ""}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(header.column.columnDef.header, header.getContext())}
                                </th>
                            ))}
                        </tr>
                    ))}
                    </thead>
                    <tbody>
                    {getRowModel().rows.map((row) => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id} className={tdColumn || ""}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </div>

            {isPagination && (
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mt-3">
                    <div className="d-flex align-items-center">
                        <span className="me-2">Show</span>
                        <Form.Select
                            size="sm"
                            style={{ width: '80px' }}
                            value={pageSize}
                            onChange={handlePageSizeChange}
                        >
                            {[10, 25, 50, 100].map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </Form.Select>
                        <span className="ms-2">entries</span>
                    </div>

                    <div className="d-flex flex-wrap justify-content-center align-items-center gap-1">
                        <Button
                            variant="outline-primary"
                            size="sm"
                            disabled={currentPage <= 1}
                            onClick={() => onPageChange?.(currentPage - 1)}
                        >
                            Previous
                        </Button>

                        {renderPageNumbers()}

                        <Button
                            variant="outline-primary"
                            size="sm"
                            disabled={currentPage >= totalPages}
                            onClick={() => onPageChange?.(currentPage + 1)}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </Fragment>
    );
};

export default React.memo(TableContainer);