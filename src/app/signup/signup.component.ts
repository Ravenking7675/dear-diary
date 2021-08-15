import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthServiceService } from '../auth-service.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  isTokenized = false;
  userForm : FormGroup;

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
      this.authService.createUser(this.userForm.value.email, this.userForm.value.password)
  }

  get email() { return this.userForm.get('email'); }
  get password() { return this.userForm.get('password'); }

}
