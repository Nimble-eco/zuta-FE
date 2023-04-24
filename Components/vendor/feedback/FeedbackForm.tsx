import { useState } from "react";
import TextAreaInput from "../../inputs/TextAreaInput";

const FeedbackForm = () => {
    const [formDetails, setFormDetails] = useState({
        message: '',
    });

    const handleFormChange = (value: string) => {
        setFormDetails((prevState) => ({
            ...prevState,
            message: value
        }))
    }

  return (
    <div>
        <TextAreaInput 
            label="message"
            value={formDetails.message || ""}
            placeHolder="Tell us what you think, we will love to hear from you"
            onInputChange={handleFormChange}
        />
    </div>
  )
}

export default FeedbackForm