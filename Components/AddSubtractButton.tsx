export const AddButton = ({ ...props }) => (
    <button
        className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-full"
        {...props}
    >
        +
    </button>
);

export const SubtractButton = ({ ...props }) => (
    <button
        className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-full"
        {...props}
    >
        &#8210;
    </button>
);

export const RemoveButton = (onClick: any) => (
    <button
        className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-full"
        onClick={onClick}
    >
        Remove
    </button>
);
  