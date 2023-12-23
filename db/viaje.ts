import mongoose, {Schema} from "mongoose";
import { Viaje,Conductor } from "../type.ts";
import{ Status } from "../type.ts";
import { ClienteModel } from "./cliente.ts";
import { ConductorModel } from "./conductor.ts";

const ViajeSchema = new Schema({
    client:{type:mongoose.Schema.Types.ObjectId, ref: "Cliente", required:false},
    driver:{type:mongoose.Schema.Types.ObjectId,ref:"Conductor", required:false},
    money:{type:Number, required:true,validate: {
        validator: (v) => {
         return v <5
        },
        message: "{path} es menor que 5"
      }},
    distance:{type:Number, required:true,validate: {
        validator: (v) => {
         return (v <0.01);
        },
        message: "{path} es menor que 0,01km"
      }},
    date:{type:Date,required:true, validate:{validator: (v)=>{
      return Object.values(Status).includes(v);
    }}},
    status:{type:String, required:true, enum:Object.values(Status)}
});
  
  ViajeSchema.pre("actualizar",async function(next){
    const viaje = this as ViajeModelType
    const cliente = await ClienteModel.findById(viaje.client).populate('travels').exec();
    const conductor = await ConductorModel.findById(viaje.driver).populate('travels').exec();

    if(cliente && conductor){
      const numVCliente= cliente.travels;
      const numVConductor = conductor.travels;

      if((numVCliente.length===0 || numVCliente.every(viaje=> viaje.status===Status.Realized)) && (numVConductor.length===0 || numVConductor.every(viaje=> viaje.status===Status.Realized)) &&( cliente.cards.length > 0 && cliente.cards.some(tarjeta => tarjeta.money >= viaje.money))){
      const tarjeta = cliente.cards.find(tarjeta=> tarjeta.money>= viaje.money);
      if(tarjeta){
        tarjeta.money -= viaje.money;
        cliente.travels.push(viaje);
        await cliente.save();
        conductor.travels.push(viaje);
        await conductor.save();
        next();
      }
      }else{ throw new Error(' No hay cliente/conductor disponible o cliente no tiene suficiente dinero')}
    }else{ throw new Error ('No existe el conductor o el cliente.')
    }
  })
  export type ViajeModelType = mongoose.Document & Omit<Viaje, "id">;

  export const ViajeModel = mongoose.model<ViajeModelType>("Viaje",ViajeSchema);