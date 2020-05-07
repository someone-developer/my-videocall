import { Component, OnInit } from '@angular/core';
import { auth } from 'firebase/app';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private itemsCollection: AngularFirestoreCollection<any>;
  rooms: Observable<any[]>;
  my_rooms: any[]=[];
  currentUser:any;
  roomName:string;
  constructor(public auth: AngularFireAuth, private router: Router, private firestore: AngularFirestore) {



  }

  ngOnInit(): void {
    this.auth.authState.subscribe(async res => {
      if (!auth) {
        this.router.navigate(['/login']);
      } else {
        this.currentUser = await this.auth.currentUser
         console.log( this.currentUser.uid );
        this.itemsCollection = this.firestore.collection<any>('rooms');
        this.rooms = this.itemsCollection.valueChanges();
         this.firestore.collection<any>('rooms',ref=>ref.where('owner','==',  this.currentUser.uid)).snapshotChanges().subscribe(res=>{
          this.my_rooms=res.map(p=>{
             var d = p.payload.doc.data();
               d.id = p.payload.doc.id;
            return d;
          });
         
        });


      }
    });
  }
  addItem(name) {
    if(name){
      var room =this.getNewRoom(name);
    
      this.itemsCollection.add(room);
    }
   
  //  this.itemsCollection.add(item);
  }
  delete(){
    if(this.my_rooms){
      this.firestore.doc(`rooms/${this.my_rooms[0].id}`).delete()
    }
    
  }
  getNewRoom(roomName:string){
    return {owner: this.currentUser.uid,name:roomName,session:'',token:''};
  }

}
