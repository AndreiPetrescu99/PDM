export interface TrainProps{
    _id?: string;
    from: string;
    to: string;
    timeLeave?: Date;
    timeArrive?: Date;
    nrSeats: number;
    imgSrc?: string;
    base64str?: string;
}
