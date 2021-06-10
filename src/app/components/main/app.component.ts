import { Component } from '@angular/core';
import  { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface City {
  id        : string;
  nombre    : string;
  habitantes: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  cities: City[] = [];
  cityForm!: FormGroup;
  citiesCollection = this.fireStore.collection<any>('ciudades');
  formButtonText: string = 'Añadir';
  updateId: string = '';
  showSuccess: string = 'void';
  showDelete: string = 'void';

  constructor( private fireStore: AngularFirestore, private formBuilder: FormBuilder ) {}

  ngOnInit(): void {
    this.getCities();
    this.buildForm();
  }

  getCities() {
    this.citiesCollection.valueChanges({ idField: 'id' }).subscribe( data => this.cities = data );
  }

  buildForm() {
    this.cityForm = this.formBuilder.group({
      nombre    : ['', [Validators.required]],
      habitantes: ['', [Validators.required, Validators.min(1)]]
    })
  }

  submitCityForm() {
    if( this.cityForm.valid && this.formButtonText === 'Añadir' ) {
      const { nombre, habitantes } = this.cityForm.value;

      this.citiesCollection.add({ nombre, habitantes })
        .then( data => {
          this.showSuccess = 'show';
          setTimeout(() => this.showSuccess = 'hide', 2500);
          this.formButtonText = 'Añadir'
          this.cityForm.reset();
        })

    } else if( this.cityForm.valid && this.formButtonText === 'Confirmar' ) {
      const { nombre, habitantes } = this.cityForm.value;

      this.citiesCollection.doc( this.updateId ).update({ nombre, habitantes })
        .then( data => {
          this.showSuccess = 'show';
          setTimeout(() => this.showSuccess = 'hide', 2500);
          this.formButtonText = 'Añadir'
          this.cityForm.reset();
        })
    }
  }

  trackCities( item: any ) {
    return item.id;
  }

  deleteCity( id: string ) {
    this.citiesCollection.doc( id ).delete()
      .then( data => {
        this.showDelete = 'show';
        setTimeout(() => this.showDelete = 'hide', 2500); 
      })
  }

  updateCity( city: City ) {
    this.updateId = city.id;
    this.formButtonText = 'Confirmar'
    this.cityForm.setValue({ nombre: city.nombre, habitantes: city.habitantes });
  }

  cancelUpdate() {
    this.formButtonText = 'Añadir';
    this.cityForm.reset();
  }

}
