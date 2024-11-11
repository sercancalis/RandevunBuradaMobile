import axios from "axios";
const BASE_URL = "https://places.googleapis.com/v1/places:searchNearby";
const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;

const config = {
  headers: {
    "content-type": "application/json",
    "X-Goog-Api-Key": API_KEY,
    "X-Goog-FieldMask": [
      "places.displayName",
      "places.formattedAddress",
      "places.location",
      "places.photos",
      "places.name",
      "places.internationalPhoneNumber",
      "places.nationalPhoneNumber",
      "places.plusCode",
      "places.rating",
      "places.regularOpeningHours",
      "places.userRatingCount",
      "places.addressComponents",
      "places.shortFormattedAddress",
    ],
  },
};

const NewNearByPlace = (data: any) => axios.post(BASE_URL, data, config);

export default {
  NewNearByPlace,
};
