import { Juego } from "./juego.interface";

export interface IEstadistica{
    totaljuegos:number,
    cntjuegosGratis:number,
    cntjuegosPago:number,
    mejorRating:Juego|undefined,
    promPrecio:number
}