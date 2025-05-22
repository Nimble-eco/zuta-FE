function Tooltip({children, content}:{children?:any, content?:any}) {
    return (
        !content?children:
        <span className="tooltip relative inline-block border-b border-dotted border-black hover:border-transparent capitalize">
            {children}
            <span className="tooltip-text hidden bg-black text-white text-center py-2 px-4 rounded absolute z-10 bottom-full left-1/2 transform -translate-x-1/2">
                {content}
            </span>
        </span>
    )
}

export default Tooltip;