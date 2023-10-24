
interface ISliderInputProps {
    name: string;
    value?: boolean;
    disabled?: boolean;
    handleChange: (e: any) => void;
}

const SliderInput = ({name, value, disabled=false, handleChange}: ISliderInputProps) => {
    return (
        <label className="switch">
            <input 
                type="checkbox" 
                name={name} 
                checked={value}
                disabled={disabled}
                onChange={handleChange}
            />
            <span className="slider round"></span>
        </label>
    );
}

export default SliderInput;