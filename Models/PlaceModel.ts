export interface PlaceModel {
  displayName: DisplayNameModel;
  location: LocationModel;
  photos: PhotosModel[];
  formattedAddress: string;
  internationalPhoneNumber: string;
  nationalPhoneNumber: string;
  rating: number;
  userRatingCount: number;
  regularOpeningHours: OpenModel;
  shortFormattedAddress: string;
  addressComponents: any;
}

interface DisplayNameModel {
  languageCode: string;
  text: string;
}
interface LocationModel {
  latitude: number;
  longitude: number;
}
interface PhotosModel {
  authorAttributions: any;
  heightPx: number;
  name: string;
  widthPx: number;
}

interface OpenModel {
  openNow: boolean;
  periods: any;
  weekdayDescriptions: any;
}
