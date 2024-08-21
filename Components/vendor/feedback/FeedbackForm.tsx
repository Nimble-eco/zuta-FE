import TextAreaInput from "../../inputs/TextAreaInput";

interface IFeedbackFormProps {
  message: string;
  handleMessageChange: (e: any) => void;
}

const FeedbackForm = ({message, handleMessageChange}: IFeedbackFormProps) => {
  return (
    <div>
      <TextAreaInput 
        label="message"
        value={message || ""}
        placeHolder="Tell us what you think, we will love to hear from you"
        onInputChange={handleMessageChange}
      />
    </div>
  )
}

export default FeedbackForm