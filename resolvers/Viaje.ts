import { GraphQLError } from "graphql";
import { ViajeModelType } from "../db/viaje.ts";
import { ClienteModel, ClienteModelType } from "../db/cliente.ts";
import { ConductorModel, ConductorModelType } from "../db/conductor.ts";

export const Viaje={
    client:async(parent:ViajeModelType):Promise<ClienteModelType>=>{
        if(parent.client){
            const cliente= await ClienteModel.findById(parent.client).exec();
            if(cliente){return cliente;}
        }throw new GraphQLError("EL cliente no existe para este viaje");
    },
    driver:async(parent:ViajeModelType):Promise<ConductorModelType>=>{
        if(parent.driver){
            const conductor= await ConductorModel.findById(parent.driver).exec();
            if(conductor){return conductor;}
        }throw new GraphQLError("EL conductor no existe para este viaje");
    }
}