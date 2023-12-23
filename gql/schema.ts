export const typeDefs = `#graphql
type Cards{
    number:String!,
    cvv:String!,
    expirity:String!,
    money:Int!
}
enum Status{
    Ready,
    InProgress,
    Realized
}
type Cliente{
    id: ID!,
    name:String!,
    email:String!,
    cards:[Cards!]!,
    travels:[Viaje!]!
}
type Conductor{
    id:ID!,
    name:String!,
    email:String!,
    username:String!,
    travels:[Viaje!]!
}
type Viaje{
    id: ID!,
    client:Cliente!,
    driver:Conductor!,
    money: Int!,
    distance:Int!,
    date:String!,
    status:Status!
}
type Query{
    clientes: [Cliente!]!,
    conductores:[Conductor!]!,
    viajes:[Viaje!]!
}
type Mutation{
    crearCliente(name:String!, email:String!):Cliente!,
    crearConductor(name:String!, email:String!, username:String!):Conductor!,
    borrarCliente(id:ID!):String!,
    borrarConductor(id:ID!):String!,
    addTarjeta(id:ID!, number:String!, cvv:String!, expirity:String!, money:Int!):Cliente!,
    crearViaje(client:ID!, driver:ID!, money:Int!, distance:Int!, date:String!, status:Status!):Viaje!,
    eliminarTarjeta(number:String!, cvv:String!, expirity:String!):String!,
    terminarViaje(id:ID!):String!
    }
`