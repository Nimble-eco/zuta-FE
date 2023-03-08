import axios from "axios";

export const getAddressDetailsFromGoogleAPI = async  (placeId :string) => {
    let res = await axios.get('api/api-places-details?placeId='+placeId);
    const {formatted_address, geometry, types, place_id, plus_code, name, address_components} = res.data.result;
    return  {formatted_address, geometry, types, place_id, plus_code, name, address_components};
}