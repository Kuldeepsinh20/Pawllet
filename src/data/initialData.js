export const initialPetData = {
  // Page 1: Profile
  species: "",
  name: "",
  breed: "",
  dob: "",
  place: "",
  gender: "",
  height: "",
  heightUnit: "cm",
  weight: "",
  weightUnit: "kg",
  ownerName: "",
  ownerContact: "",
  ownerAadhar: "",
  address: "",

  // Page 2: Health & Documents
  vaccines: [],
  diseases: [],
  medications: [],
  allergies: [],
  food: [],
  grooming: "",
  checkupRoutine: "",
  lastVisit: "",

  // Section 3: Official Vault
  documents: []
};

export const breedOptions = [
  "Golden Retriever",
  "Labrador Retriever",
  "German Shepherd",
  "French Bulldog",
  "Beagle",
  "Poodle",
  "Rottweiler",
  "Siberian Husky",
  "Indie / Indian Pariah",
  "Shih Tzu"
];

export const routineOptions = [
  "Annual",
  "Semi-Annual (6 Months)",
  "Quarterly (3 Months)",
  "Monthly",
  "Bi-Weekly"
];

export const speciesOptions = [
  "Dogs",
  "Cats",
  "Birds",
  "Small mammals",
  "Farm Animals"
];
