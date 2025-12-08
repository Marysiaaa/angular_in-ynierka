import {Component} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors, ReactiveFormsModule
} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {AccountService} from "../../services/account.service";
import {CommonModule} from '@angular/common';
import {SponsorResponse} from '../../types/sponsorResonse';

function passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
  const pass = group.get("password")?.value;
  const confirm = group.get("confirmPassword")?.value;
  return pass === confirm ? null : {passwordMismatch: true};
}

@Component({
  selector: 'app-registration',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ]
})

export class RegisterComponent {
  form: FormGroup;
  sponsorId: string | null = null;
  sponsorName: string | null = null;

  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private accountService: AccountService
  ) {
    // --- Formularz ---
    this.form = this.fb.group(
      {
        firstName: ["", [Validators.required, Validators.maxLength(40)]],
        lastName: ["", [Validators.required, Validators.maxLength(60)]],
        email: ["", [Validators.required, Validators.email]],
        password: ["", [Validators.required, Validators.minLength(8)]],
        confirmPassword: ["", Validators.required],
        street: [""],
        buildingNumber: [""],
        postalCode: ["", [Validators.pattern(/^\d{2}-\d{3}$/)]],
        city: [""],
        acceptTerms: [false, [Validators.requiredTrue]],
      },
      {validators: passwordMatchValidator}
    );

    // --- Pobieranie reflinku z URL ---
    this.route.queryParams.subscribe((params) => {
      const ref = params["ref"];
      if (ref) {
        this.loadSponsor(ref);
      }
    });
  }

  // Pobranie sponsora z backendu
  loadSponsor(ref: string) {
    this.accountService.getSponsorByRef(ref).subscribe({
      next: (sponsor: SponsorResponse) => {
        this.sponsorId = sponsor.sponsorId;
        this.sponsorName = sponsor.sponsorName;
      },
      error: () => {
        this.sponsorId = null;
        this.sponsorName = null;
      },
    });
  }

  get f(): any {
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
      SponsorId: this.sponsorId ?  // jeśli sponsorId jest Guid
      name: this.form.value.firstName,
      surname: this.form.value.lastName,
      email: this.form.value.email,
      password: this.form.value.password,
      phoneNumber: this.form.value.phoneNumber || '', // dodaj pole w formularzu
      address: {
        street: this.form.value.street,
        city: this.form.value.city,
        houseNumber: this.form.value.houseNumber,
        flatNumber:this.form.value.flatNumber,
        zip: this.form.value.postalCode,
      }
    };


    this.accountService.register(payload).subscribe({
      next: () => alert("Rejestracja udana!"),
      error: () => alert("Błąd przy rejestracji."),
    });
  }
}
