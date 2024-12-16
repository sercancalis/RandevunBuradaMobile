export interface GetBusinessResponseModel
{
    id:number;
    userId: string;
    category: string;
    name: string;
    latitude: string;
    longitude: string;
    phoneNumber: string;
    city: string;
    district: string;
    address: string;
    isConfirmed: boolean;
    imageUrls: string[];
    workingHours: WorkingHoursDto[] 
}

export interface WorkingHoursDto{
    workingDay: number;
    value: string;
}
