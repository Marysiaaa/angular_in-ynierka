import {Component, OnInit} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule
} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AccountService} from "../../services/account.service";

import {CommonModule} from '@angular/common';
import {SponsorDetails} from '../../types/sponsorDetails';
import {PersonService} from '../../services/person.service';

function passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
  const pass = group.get("password")?.value;
  const confirm = group.get("confirmPassword")?.value;
  return pass === confirm ? null : {passwordMismatch: true};
}

@Component({
  selector: 'cp-registration',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ]
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  sponsorId: string | null = null;
  sponsorName: string | null = null;
  showPassword = false;
  showPopup = false

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private personService: PersonService,
    private accountService: AccountService,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ["", [Validators.required, Validators.maxLength(40), Validators.pattern('^[A-Za-zĄąĆćĘęŁłŃńÓóŚśŻżŹź ]+$')]],
      surname: ["", [Validators.required, Validators.maxLength(60), Validators.pattern('^[A-Za-zĄąĆćĘęŁłŃńÓóŚśŻżŹź ]+$')]],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(8)]],
      confirmPassword: ["", Validators.required],
      phoneNumber: ["", [Validators.required, Validators.maxLength(9), Validators.minLength(9), Validators.pattern(/^\d{3}-\d{3}-\d{3}$/)]],

      street: ["", Validators.pattern("^[A-Za-zĄąĆćĘęŁłŃńÓóŚśŻżŹź0-9 .-]+$")],
      houseNumber: ["", Validators.pattern('^[0-9]+[A-Za-z]?(/?[0-9]+)?$')],
      flatNumber: ["", Validators.pattern('^[0-9]+[A-Za-z]?(/?[0-9]+)?$')],
      postalCode: ["", [Validators.pattern(/^\d{2}-\d{3}$/)]],
      city: ["", Validators.pattern('^[A-Za-zĄąĆćĘęŁłŃńÓóŚśŻżŹź ]+$')],
      acceptTerms: [false, [Validators.requiredTrue]]
    }, {validators: passwordMatchValidator});
  }

  sponsor: SponsorDetails | null = null;

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const ref = params['ref'];
      console.log(ref);
      if (ref) {
        this.loadSponsor(ref);
      }
    });
  }

  loadSponsor(ref: string) {
    console.log("rozpoczecie łądaownia sponsora ")
    this.personService.getSponsorByRef(ref).subscribe({
      next: (sponsor: SponsorDetails) => {
        this.sponsor = sponsor;
        this.sponsorId = sponsor.id;
        console.log(this.sponsor);
      },
      error: () => {
        this.sponsor = null;
        this.sponsorId = null;
        console.log("error")
      }
    });
  }


  get f() {
    return this.form.controls;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = {
      sponsorId: this.sponsorId,
      name: this.form.value.name,
      surname: this.form.value.surname,
      email: this.form.value.email,
      password: this.form.value.password,
      phoneNumber: this.form.value.phoneNumber,
      address: {
        street: this.form.value.street,
        city: this.form.value.city,
        houseNumber: this.form.value.houseNumber,
        flatNumber: this.form.value.flatNumber,
        zip: this.form.value.postalCode
      }
    };

    this.accountService.register(payload).subscribe({
      next: () => this.showPopup = true,
      error: () => alert("Błąd przy rejestracji.")
    });
  }

  goToLogin() {
    this.showPopup = false;
    this.router.navigate(['/login/login']);
  }

}
