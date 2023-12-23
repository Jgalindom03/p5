import mongoose, {Schema} from "mongoose";
import { Conductor } from "../type.ts";
import { ViajeModel, ViajeModelType } from "./viaje.ts";
import { ClienteModel } from "./cliente.ts";

const ConductorSchema = new Schema({
    name:{type:String, required:true, validate: {
            validator: (value) => {
             return value !== ""
            },
            message: "{path} esta vacio"
          }
        },
    email:{type:String, required:true,validate: {validator: function(v) {return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    ;},message: props => `${props.value} is not a valid email address!`}},
    username:{type:String, required:true},
    travels:{type:[mongoose.Schema.Types.ObjectId], ref:"Viaje", required: false, validate:{validator: function(v){
      let contador=0;
      for(let i=0; i< travels.length; i++){
        if(travels[i].status!= "Realized"){contador ++;}
      }if(contador>1){throw new Error("Solo puedes tener un viaje");
      }
      return true;
    }}}    });

  ConductorSchema.post("delete", async function(c:ConductorModelType){
    if(c){
      await ViajeModel.deleteMany({driver:c._id});
      await ClienteModel.updateMany({travels:c._id}, {$pull:{travels:c._id}});
    }
  })  
  export type ConductorModelType = mongoose.Document & Omit<Conductor, "id">;

  export const ConductorModel = mongoose.model<ConductorModelType>("Conductor",ConductorSchema);