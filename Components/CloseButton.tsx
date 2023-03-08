function CloseButton(...props: any) {
    return (
        <button 
            className="py-1 px-2 text-2xl m-2 bg-red-800 text-white"
            {...props}
        >
            X
        </button>
    )
}

export default CloseButton
