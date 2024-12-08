export interface ServiceResponseBase<T>{
    data: T;
    success:boolean;
    message: string;
}