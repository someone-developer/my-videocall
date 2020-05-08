import { Component, OnInit } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  currentUser: any;
  constructor(public auth: AngularFireAuth, private router: Router) { }

  async ngOnInit(): Promise<void> {
    this.currentUser = await this.auth.currentUser
    if (this.currentUser) {
      this.router.navigate(['/home'])
    }

  }
  login() {

    this.auth.signInWithPopup(new auth.GoogleAuthProvider()).then((res: any) => {
      let userProfile = res;
      console.log(userProfile);
      alert(userProfile.additionalUserInfo.profile.name);
      this.router.navigate(['/home'])
    });
  }

}
