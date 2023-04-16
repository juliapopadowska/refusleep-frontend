export type Apartment = {
  _id: string;
  owner: string;
  type: string;
  address: string;
  photos: string[];
  city: string;
  phoneNumber: string;
  polishDetails: string;
  englishDetails: string;
  germanDetails: string;
  ukrainianDetails: string;
};

export type User = {
  _id: string;
  email: string;
  name: string;
  password: string;
};
