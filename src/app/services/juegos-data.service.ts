import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, map, of } from 'rxjs';
import { Juego } from '../interfaces/juego.interface';
import { IEstadistica } from '../interfaces/estadistica.interface';

@Injectable({
  providedIn: 'root'
})
export class JuegosDataService {
  private juegosSubject = new BehaviorSubject<Juego[]>([]);
  public juegos$ = this.juegosSubject.asObservable();

  constructor(private http: HttpClient) {
    this.cargarJuegos();
  }

  private cargarJuegos(): void {
    this.http.get<{ juegos: Juego[] }>('assets/data/juegos.json')
      .subscribe(data => {
        this.juegosSubject.next(data.juegos);
      });
  }

  obtenerJuegos(): Observable<Juego[]> {
    return this.juegos$;
  }

  obtenerJuegoPorId(id: number): Observable<Juego | undefined> {
    return this.juegos$.pipe(
      map(juegos => juegos.find(juego => juego.id === id))
    );
  }

  buscarJuegos(termino: string): Observable<Juego[]> {
    return this.juegos$.pipe(
      map(juegos => juegos.filter(juego => 
        juego.nombre.toLowerCase().includes(termino.toLowerCase()) ||
        juego.desarrollador.toLowerCase().includes(termino.toLowerCase()) ||
        juego.categoria.toLowerCase().includes(termino.toLowerCase())
      ))
    );
  }

  filtrarPorCategoria(categoria: string): Observable<Juego[]> {
    return this.juegos$.pipe(
      map(juegos => juegos.filter(juego => 
        juego.categoria.toLowerCase() === categoria.toLowerCase()
      ))
    );
  }

  filtrarPorPlataforma(plataforma: string): Observable<Juego[]> {
    return this.juegos$.pipe(
      map(juegos => juegos.filter(juego => 
        juego.plataformas.includes(plataforma)
      ))
    );
  }

  filtrarPorPrecio(esGratis: boolean): Observable<Juego[]> {
    return this.juegos$.pipe(
      map(juegos => juegos.filter(juego => juego.esGratis === esGratis))
    );
  }

  filtrarPorRating(minRating: number): Observable<Juego[]> {
    return this.juegos$.pipe(
      map(juegos => juegos.filter(juego => juego.rating >= minRating))
    );
  }

  obtenerJuegosPopulares(limite: number = 6): Observable<Juego[]> {
    return this.juegos$.pipe(
      map(juegos => [...juegos]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, limite)
      )
    );
  }

  obtenerJuegosRecientes(limite: number = 4): Observable<Juego[]> {
    return this.juegos$.pipe(
      map(juegos => [...juegos]
        .sort((a, b) => new Date(b.fechaLanzamiento).getTime() - new Date(a.fechaLanzamiento).getTime())
        .slice(0, limite)
      )
    );
  }
  getJuegosPrecio(minimo:number , maximo:number)
  {
    return this.juegos$.pipe(
    map(juegos => juegos.filter(juego => juego.precio >= minimo && juego.precio <= maximo))
    );
  }
  getEstadistica():Observable<IEstadistica> 
  {

    let arrJuegos = this.juegosSubject.value;

    let estadistica:IEstadistica={
      totaljuegos : arrJuegos.length,
      cntjuegosPago: arrJuegos.filter(j => j.esGratis ==false).length,
      cntjuegosGratis:arrJuegos.filter(j => j.esGratis ==true).length,
      mejorRating:undefined,
      promPrecio:0
    }
    
    let ratingMAx =0
    let precioJuegosPago = 0
  for(let j of arrJuegos)
  {
    if(ratingMAx < j.rating)
      {
      ratingMAx = j.rating;
      estadistica.mejorRating =j;
      }

      if(j.esGratis == false)
        {
        precioJuegosPago = precioJuegosPago +j.precio
        }

  }

    estadistica.promPrecio= precioJuegosPago/estadistica.cntjuegosPago;


    return of(estadistica);
  }



}