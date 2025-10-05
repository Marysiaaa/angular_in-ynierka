import {SponsorDetails} from './sponsorDetails';
import {Role} from './role';

interface User {
  id: string;
  sponsorId: string;
  name: string;
  surname: string;
  email: string;
  phoneNumber: string;
  registrationDate: string;
  sponsorDetails: SponsorDetails
  role: Role;
}

export type {User};
