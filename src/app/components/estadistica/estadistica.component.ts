//Pregunta parte 4.1

//1 En la lista-juegos.component.html
//2 filtro.component.ts
//3 en los servicios

//Preegunta 4.2

//1 Por que esta hecho con standalone
//2 Compartir información entre diferentes partes de la aplicación 



import { Component, OnInit } from '@angular/core';
import { JuegosDataService } from '../../services/juegos-data.service';
import { Observable } from 'rxjs';
import { Juego } from '../../interfaces/juego.interface';
import { CommonModule } from '@angular/common';
import { TarjetaJuegoComponent } from '../tarjeta-juego/tarjeta-juego.component';

@Component({
  selector: 'app-estadistica',
  imports: [CommonModule, TarjetaJuegoComponent],
  templateUrl: './estadistica.component.html',
  styleUrl: './estadistica.component.css'
})
export class EstadisticaComponent implements OnInit{

  juegos$!: Observable<Juego[]>;

  cntJuegosGratis: number=0;
  cntJuegosPago: number=0;

  juegoTop : Juego|undefined;
  PromJuegosPago : number=0;

  constructor(private juegoservice : JuegosDataService)
  {

  }
  ngOnInit(): void {
  this.juegos$ = this.juegoservice.obtenerJuegos();   

  this.juegos$.subscribe((juegos)=>{
    this.cntJuegosGratis = juegos.filter(j => j.esGratis ==true).length
  })

    this.juegos$.subscribe((juegos)=>{
    this.cntJuegosPago = juegos.filter(j => j.esGratis ==false).length

    let ratingMAx =0
    let precioJuegosPago = 0
  for(let j of juegos)
  {
    if(ratingMAx < j.rating)
      {
      ratingMAx = j.rating;
      this.juegoTop =j;
      }

      if(j.esGratis == false)
        {
        precioJuegosPago = precioJuegosPago +j.precio
        }

  }

    this.PromJuegosPago = precioJuegosPago/this.cntJuegosPago;



  })

  }


}
