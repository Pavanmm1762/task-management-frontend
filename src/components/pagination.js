// pagination.js

import { IconButton } from "@material-tailwind/react";

export const renderPagination = (totalPages, currentPage, handlePageChange) => {
    const pages = [];
    const totalVisiblePages = 6; // Total number of visible pagination buttons
    const firstThreePages = 3;   // Number of pages to show at the start
    const lastThreePages = 3;     // Number of pages to show at the end

    // Check if total pages are less than or equal to the total visible pages
    if (totalPages <= totalVisiblePages) {
        // Simply add all pages when total pages are 4
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <IconButton
                    key={i}
                    size="sm"
                    variant={i === currentPage ? "filled" : "text"}
                    className={`rounded-full hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-600 ${i === currentPage ? "bg-gray-500 dark:text-gray-700 dark:bg-gray-300" : ""}`}
                    onClick={() => handlePageChange(i)}>
                    {i}
                </IconButton>
            );
        }
    } else {
        // Show the first page
        pages.push(
            <IconButton
                key={1}
                variant={currentPage === 1 ? "filled" : "text"}
                className={`rounded-full hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-600 ${1 === currentPage ? "bg-gray-500 dark:text-gray-700 dark:bg-gray-300" : ""}`}
                onClick={() => handlePageChange(1)}>
                1
            </IconButton>
        );

        // Show dots if current page is more than 4
        if (currentPage > firstThreePages) {
            pages.push(<span key="dots1" className="dark:text-gray-300">...</span>);
        }

        // Add the current page and its surrounding pages
        let startPage = Math.max(currentPage - 1, 2); // At least show page 2 before current
        let endPage = Math.min(currentPage + 1, totalPages - 1); // At most show page before the last page

        for (let i = startPage; i <= endPage; i++) {
            if (i !== 1 && i !== totalPages) { // Prevent adding first and last page again
                pages.push(
                    <IconButton
                        key={i}
                        variant={i === currentPage ? "filled" : "text"}
                        className={`rounded-full hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-600 ${i === currentPage ? "bg-gray-500 dark:text-gray-700 dark:bg-gray-300" : ""}`}
                        onClick={() => handlePageChange(i)}>
                        {i}
                    </IconButton>
                );
            }
        }

        // Show dots if current page is less than totalPages - 3
        if (currentPage < totalPages - lastThreePages) {
            pages.push(<span key="dots2" className="dark:text-gray-300">...</span>);
        }

        // Show the last page
        if (totalPages > 1) {
            pages.push(
                <IconButton
                    key={totalPages}
                    variant={totalPages === currentPage ? "filled" : "text"}
                    className={`rounded-full hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-600 ${totalPages === currentPage ? "bg-gray-500 dark:text-gray-700 dark:bg-gray-300" : ""}`}
                    onClick={() => handlePageChange(totalPages)}>
                    {totalPages}
                </IconButton>
            );
        }
    }

    return pages;
};
