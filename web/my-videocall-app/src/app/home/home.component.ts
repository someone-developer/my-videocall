import { Component, OnInit } from '@angular/core';
import { auth } from 'firebase/app';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
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
  videoCallRoom:any;
  constructor(public auth: AngularFireAuth, private router: Router, private firestore: AngularFirestore,private sanitizer: DomSanitizer) {



  }

  async ngOnInit(): Promise<void> {
    this.currentUser = await this.auth.currentUser
    if( this.currentUser){
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

    }else{
      this.router.navigate(['/login']);
    }
    
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
  join(owner){
    var src =this.sanitizer.bypassSecurityTrustResourceUrl('https://tokbox.com/embed/embed/ot-embed.js?embedId=a88cc824-ce0f-4b88-bc89-804feaec6f3c&room='+owner+'&iframe=true');
    this.videoCallRoom =src;
  }
  disconnect(){
    this.videoCallRoom =null;
  }

}
