export type LocationData = Record<string, Record<string, string[]>>;

export const locations: LocationData = {
  Karnataka: {
    Bengaluru: ["Bengaluru", "Whitefield", "Electronic City"],
    Mysuru: ["Mysuru", "Srirangapatna"],
    Mangaluru: ["Mangaluru", "Udupi"],
    Hubballi: ["Hubballi", "Dharwad"],
  },
  Kerala: {
    Thiruvananthapuram: ["Thiruvananthapuram", "Varkala"],
    Ernakulam: ["Kochi", "Aluva", "Fort Kochi"],
    Kozhikode: ["Kozhikode", "Wayanad"],
  },
  "Tamil Nadu": {
    Chennai: ["Chennai", "Mahabalipuram"],
    Coimbatore: ["Coimbatore", "Ooty"],
    Madurai: ["Madurai", "Rameswaram"],
    Kanyakumari: ["Kanyakumari", "Nagercoil"],
  },
  Maharashtra: {
    Mumbai: ["Mumbai", "Andheri", "Bandra"],
    Pune: ["Pune", "Lonavala", "Mahabaleshwar"],
    Nashik: ["Nashik", "Trimbakeshwar"],
    Aurangabad: ["Aurangabad", "Ajanta"],
  },
  Rajasthan: {
    Jaipur: ["Jaipur", "Amer"],
    Udaipur: ["Udaipur", "Chittorgarh"],
    Jodhpur: ["Jodhpur", "Jaisalmer"],
  },
  Goa: {
    "North Goa": ["Panaji", "Calangute", "Anjuna"],
    "South Goa": ["Margao", "Palolem", "Colva"],
  },
  Delhi: {
    "New Delhi": ["Connaught Place", "Karol Bagh", "Dwarka"],
    "South Delhi": ["Hauz Khas", "Saket"],
  },
  "Himachal Pradesh": {
    Shimla: ["Shimla", "Kufri"],
    Kullu: ["Manali", "Kasol"],
    Kangra: ["Dharamshala", "McLeod Ganj"],
  },
  Uttarakhand: {
    Dehradun: ["Dehradun", "Mussoorie"],
    Nainital: ["Nainital", "Bhimtal"],
    Haridwar: ["Haridwar", "Rishikesh"],
  },
  "West Bengal": {
    Kolkata: ["Kolkata", "Howrah", "Darjeeling"],
    Darjeeling: ["Darjeeling", "Kalimpong"],
  },
};

export function getStates() {
  return Object.keys(locations).sort();
}

export function getDistricts(state: string) {
  if (!locations[state]) return [];
  return Object.keys(locations[state]).sort();
}

export function getCities(state: string, district: string) {
  if (!locations[state]?.[district]) return [];
  return [...locations[state][district]].sort();
}
