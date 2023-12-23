export type Cliente={
    id:string,
    name:string,
    email:string,
    cards:Array<Cards>
    travels:Array<Omit<Viaje,"client">>
}
export type Cards={
    id:string,
    number:string,
    cvv:string,
    expirity:string,
    money:number
}
export type Conductor={
    id:string,
    name:string,
    email:string,
    username:string,
    travels:Array<Omit<Viaje,"driver">>
}
export type Viaje={
    id:string,
    client:string,
    driver:string,
    money:number,
    distance:number,
    date:date,
    status:Status
}
export enum Status{
    Ready = "Ready",
    InProgress= "InProgress",
    Realized= "Realized"
}