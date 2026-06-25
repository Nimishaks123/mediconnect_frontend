interface PaginationProps{
    currentPage:number;
    totalPages:number;
    onPageChange:(page:number)=>void;

}
export default function Pagination({
    currentPage,
    totalPages,
    onPageChange
}:PaginationProps){
    return(
        <div className="flex justify-center items-center gap-4 mt-8">
            <button disabled={currentPage===1} onClick={()=>
                onPageChange(currentPage-1)
            }
        className="px-4 py-2 border rounded disabled:opacity-50">
            Previous
        </button>
        <span>
            Page{currentPage} of {totalPages}
        </span>
        <button disabled={currentPage===totalPages}
        onClick={()=>onPageChange(currentPage+1)}
        className="px-4 py-2 border rounded disabled:opacity-15 ">
            Next

        </button>
        </div>
    )
}