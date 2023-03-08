import { toast } from "react-toastify";

export const notify = (message: string) => {
    toast.dark(message);
}