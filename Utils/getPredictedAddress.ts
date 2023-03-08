import axios from "axios";

export const getGoogleAddressPredictions =async (input :string) => {
    let res = await axios.get('api/api-places-autocomplete?input='+input);
    return res.data.predictions;
}