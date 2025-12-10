import {SponsorDetails} from './sponsorDetails';

interface User {
  id: string;
  sponsorId: string;
  name:string;
  surname: string;
  email: string;
  phoneNumber: string;
  registrationDate: string;
  sponsorDetails: SponsorDetails
}

export type {User};
