import mongoose from "mongoose";
import { GraphQLError } from "graphql";
import { ClienteModel, ClienteModelType } from "../db/cliente.ts";
import { ConductorModel, ConductorModelType } from "../db/conductor.ts";
import { ViajeModel, ViajeModelType } from "../db/viaje.ts";

export const Mutation={
crearCliente:async(_:unknown, args: {name: string, email: string}): Promise<ClienteModelType> => {
try{
    const cliente={
    name:args.name,
    email:args.email,
}
const clienteNuevo= await ClienteModel.create(cliente);
return clienteNuevo;

}catch(error){
    res.status(500).send(error)
}
},
crearConductor:async(_:unknown, args: {name: string, email: string, username:string}): Promise<ConductorModelType> => {
    
    try{
        const conductor={
        name:args.name,
        email:args.email,
        username:args.username,
    }
    const conductorNuevo= await ConductorModel.create(conductor);
    return conductorNuevo;
    
  }  catch(error){
        res.status(500).send(error)
    }
    },
addTarjeta:async(_:unknown,args:{id:string, number:string, cvv:string, expirity:string, money:number}):Promise<ClienteModelType>=>{
    try {
        const cliente = await ClienteModel.findById(args.id).exec();
        if(!cliente){throw new GraphQLError("El cliente no existe");}
        const tarjeta={
            number :args.number,
            cvv :args.cvv,
            expirity:args.expirity,
            money:args.money,
        }
        cliente.cards.push(tarjeta);
        await cliente.save()
        return cliente;
    } catch (error) {
        res.status(500).send(error);
    }
},
crearViaje:async(_:unknown, args:{client:string, driver:string, money:number, distance:number, date:Date, status:string}):Promise<ViajeModelType> =>{
    try {
        if(args.status==="Realized"){ throw new GraphQLError("No puedes crear un viaje con el estado Realized");}
        const viaje={
            client:args.client,
            driver:args.driver,
            money:args.money,
            distance:args.distance,
            date:args.date,
            status:args.status,
        };
        const viajeNuevo= await ViajeModel.create(viaje);
        return viajeNuevo;
    } catch (error) {
        res.status(500).send(error);
    }
},
borrarCliente:async(_:unknown, args:{id:string}):Promise<string>=>{
    try {
        const clienteB= await ClienteModel.findByIdAndDelete(args.id).exec();
        if(!clienteB){throw new GraphQLError("No existe el cliente")};
        return "cliente borrado";

    } catch (error) {
        res.status(500).send(error);
    }
},
borrarConductor:async(_:unknown, args:{id:string}):Promise<string>=>{
    try {
        const conductorB= await ConductorModel.findByIdAndDelete(args.id).exec();
        if(!conductorB){throw new GraphQLError("No existe el conductor")};
        return "conductor borrado";

    } catch (error) {
        res.status(500).send(error);
    }
},
eliminarTarjeta:async(_:unknown, args:{numero: string, cvv: string, expirity: string}):Promise<string>=>{
    try {
        const clientes = await ClienteModel.find({cards: {$elemMatch: {number: args.numero, cvv: args.cvv, expirity: args.expirity}}}).exec();
        if(clientes.length===0 ){throw new GraphQLError("No existe la tarjeta")};

        clientes.forEach(async cliente=>{
            cliente.cards = cliente.cards.filter(tarjeta => !(tarjeta.number == args.numero && tarjeta.cvv == args.cvv && tarjeta.expirity == args.expirity));
            await cliente.save();
        })
        return "tarjeta eliminada";
    }catch (error) {
        res.status(500).send(error);
    }
},
terminarViaje:async(_:unknown, args:{id:string}):Promise<string>=>{
    try {
        const viaje= await ViajeModel.findById(args.id).exec();
    if(viaje?.status==="Realized"){ throw new GraphQLError("El viaje está realizado")};
    const viajeN= await ViajeModel.findByIdAndUpdate(args.id,{status:"Realized", date:new Date()},{new:true, runValidator:false}).exec();
    if(viajeN){throw new GraphQLError("No existe el viaje")};
    return "El viaje terminó";
    } catch (error) {
        res.status(500).send(error);
    }
}
}