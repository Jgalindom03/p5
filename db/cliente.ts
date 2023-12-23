import mongoose, {Schema} from "mongoose";
import { Cliente,Cards } from "../type.ts";
import { ViajeModel, ViajeModelType } from "./viaje.ts";
import { ConductorModel } from "./conductor.ts";

const ClienteSchema = new Schema({
    name:{type:String, required:true, validate: {
            validator: (value) => {
             return value !== ""
            },
            message: "{path} esta vacio"
          }
        },
    email:{type:String, required:true,validate: {validator: function(v) {return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    ;},message: props => `${props.value} is not a valid email address!`}},
    cards:[{number:{type:String, required:true, validate:{validator: function(v){return /^(\d{4} ){3}\d{4}$|^\d{16}$/.test(v)}}},
      cvv:{type:String, required:true, validate:{validator:function(v){return /^\d{3}$/.test(v)}}},
      expirity:{type:String, required:true, validate:{
        validator:function(v){
          const [mes, year]= v.split('/').map(Number);
          const fActual =new Date();
          const mActual = fActual.getMonth()+1;
          const yActual= fActual.getFullYear();
          if(year < yActual) {return false;}
          if(year=== yActual && mes < mActual){return false;}
          return true; 
        },message:props=> `${props.v} no es una fecha válida.`
      }
      },
      money:{type:Number, required:false, validate:{validator: function(v){return money>=0}}}
    },{required: false}],
    travels:{type:[mongoose.Schema.Types.ObjectId], ref:"Viaje", required: false, validate:{validator: function(v){
      let contador=0;
      for(let i=0; i< travels.length; i++){
        if(travels[i].status!= "Realized"){contador ++;}
      }if(contador>1){throw new Error("Solo puedes tener un viaje");
      }
      return true;
    }}}});

  ClienteSchema.post("delete", async function(c:ClienteModelType){
    if(c){
      await ViajeModel.deleteMany({client:c._id});
      await ConductorModel.updateMany({travels:c._id}, {$pull:{travels:cliente._id}});
    }
  })
  export type ClienteModelType = mongoose.Document & Omit<Cliente, "id">;

  export const ClienteModel = mongoose.model<ClienteModelType>("Cliente",ClienteSchema);