import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {AuthServiceService} from '../auth-service.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  userForm : FormGroup;
  isTokenized = false;

  constructor(public authService: AuthServiceService) { }

  ngOnInit(): void {
    this.isTokenized = false;
    this.userForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl('', [Validators.required, Validators.minLength(5)]),
    }
    );

  }

  onSubmit() {
    this.isTokenized = true;
    console.log("email : ", this.userForm.value.email);

    this.authService.login(this.userForm.value.email, this.userForm.value.password);

}

  get email() { return this.userForm.get('email'); }
  get password() { return this.userForm.get('password'); }


}
