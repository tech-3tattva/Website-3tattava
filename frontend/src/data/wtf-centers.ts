// ─── 3TATTAVA × WTF Gym Experience Centers — single source of truth ──────────
// Real data from the WTF Gym network (Delhi NCR). Used by the Find-Us page and
// the home-page interactive map.

export interface WTFCenter {
  id: number;
  name: string;
  city: "Delhi" | "Noida" | "Greater Noida" | "Ghaziabad" | "Gurugram" | "Faridabad";
  address: string;
  pincode: string;
  trainers: number;
  sqft: number;
  lat: number;
  lng: number;
}

export const WTF_CENTERS: WTFCenter[] = [
  { id: 1,  name: "WTF Sector 16 — World Trade Tower", city: "Noida",        address: "M Floor, World Trade Tower, Sector 16, Noida", pincode: "201301", trainers: 11, sqft: 10000, lat: 28.5686, lng: 77.3196 },
  { id: 2,  name: "WTF Sector 22",                    city: "Noida",        address: "2nd Floor, C.S. Rana Complex, near Shiv Mandir, Block D, Sector 22, Noida", pincode: "201301", trainers: 4, sqft: 2500, lat: 28.5741, lng: 77.3228 },
  { id: 3,  name: "WTF Sector 70",                    city: "Noida",        address: "BS-102, Basai, Sector 70, Noida, Uttar Pradesh", pincode: "201301", trainers: 3, sqft: 2200, lat: 28.5570, lng: 77.3810 },
  { id: 4,  name: "WTF Indirapuram — Nayaykhand 3",   city: "Ghaziabad",   address: "441/4, Kala Pathar Rd, Opposite Orange Count, Gyan Khand III, Indirapuram, Ghaziabad", pincode: "201014", trainers: 6, sqft: 4000, lat: 28.6447, lng: 77.3571 },
  { id: 5,  name: "WTF Sector 122",                   city: "Noida",        address: "Basement, PK-09, Sector 122, Noida, Uttar Pradesh", pincode: "201316", trainers: 4, sqft: 2700, lat: 28.5330, lng: 77.3540 },
  { id: 6,  name: "WTF Sector 116",                   city: "Noida",        address: "SD-06, Sector 116, Noida, Uttar Pradesh", pincode: "201301", trainers: 4, sqft: 4000, lat: 28.5210, lng: 77.3480 },
  { id: 7,  name: "WTF Sector 121 — Parthala",        city: "Noida",        address: "PKA-8, near Baraamda Restaurant, Parthala Khanjarpur, Sector 121, Noida 201316", pincode: "201316", trainers: 4, sqft: 4500, lat: 28.5174, lng: 77.3400 },
  { id: 8,  name: "WTF Shalimar Garden",              city: "Ghaziabad",   address: "Ram Enclave, 80 Feet Rd, Shalimar Apartment, Block A, Shalimar Garden, Sahibabad, Ghaziabad", pincode: "201006", trainers: 5, sqft: 4500, lat: 28.6733, lng: 77.3555 },
  { id: 9,  name: "WTF Noida West — Sector 1",        city: "Greater Noida", address: "NB Mart, opp. Sanskriti Apartment, behind CRC & ATS Society, Sector 1, Bisrakh Jalalpur, Greater Noida", pincode: "201308", trainers: 3, sqft: 3500, lat: 28.5960, lng: 77.4300 },
  { id: 10, name: "WTF Dwarka — Sector 10",           city: "Delhi",        address: "DDA Market, Pocket 1, Sector 10 Dwarka, New Delhi", pincode: "110075", trainers: 4, sqft: 3800, lat: 28.5931, lng: 77.0475 },
  { id: 11, name: "WTF Rohini — Sector 24",           city: "Delhi",        address: "102, above Bank of Baroda, Pocket 27, Sector 24, Rohini, Delhi", pincode: "110085", trainers: 4, sqft: 3000, lat: 28.7455, lng: 77.1005 },
  { id: 12, name: "WTF Rohini — Sector 23",           city: "Delhi",        address: "C-548, Near Sunrise Traders, Gram Sabha, Pooth Kalan, Sector 23, Rohini, Delhi", pincode: "110085", trainers: 6, sqft: 3200, lat: 28.7440, lng: 77.1020 },
  { id: 13, name: "WTF Dwarka — Sector 17",           city: "Delhi",        address: "3rd & 4th Floor, WTF Gym, Plot 17, Pocket C, Sector 17 Dwarka, Delhi", pincode: "110078", trainers: 5, sqft: 4000, lat: 28.5754, lng: 77.0469 },
  { id: 14, name: "WTF Nehru Nagar",                  city: "Ghaziabad",   address: "Moti Lal Nehru Marg, near Zudio Store, Ram Nagar, Nehru Nagar, Ghaziabad", pincode: "201001", trainers: 4, sqft: 3000, lat: 28.6652, lng: 77.4315 },
  { id: 15, name: "WTF Shakti Khand — Indirapuram",   city: "Ghaziabad",   address: "WTF Gym, Plot No. 380, Lane 5, Shakti Khand 4, Indirapuram, Ghaziabad", pincode: "201014", trainers: 3, sqft: 2800, lat: 28.6375, lng: 77.3574 },
  { id: 16, name: "WTF Mayur Vihar Phase-3",          city: "Delhi",        address: "Shop No. B-1/381, Mayur Vihar Phase-3, Pragati Marg, Pocket B1, New Kondli", pincode: "110096", trainers: 7, sqft: 4000, lat: 28.6027, lng: 77.3148 },
  { id: 17, name: "WTF Janakpuri",                    city: "Delhi",        address: "A-3, 233, SS Mota Singh Marg, opp. St. Francis De Sales School, Block A3, Kondli, Delhi", pincode: "110058", trainers: 5, sqft: 4200, lat: 28.6289, lng: 77.0815 },
  { id: 18, name: "WTF Greater Noida — Ace City",     city: "Greater Noida", address: "Mahaveer Plaza, behind ACE CITY, Sector 1, Aimnabad, Bisrakh Jalalpur, Greater Noida", pincode: "201306", trainers: 6, sqft: 6500, lat: 28.5780, lng: 77.4415 },
  { id: 19, name: "WTF Greenfield, Faridabad",        city: "Faridabad",   address: "First Floor, H. No. B-693, Greenfield Colony Block B, Greenfields, Sector 43, Faridabad", pincode: "121010", trainers: 5, sqft: 4000, lat: 28.3934, lng: 77.3120 },
  { id: 20, name: "WTF Shahdara",                     city: "Delhi",        address: "A-82, Jagat Puri Chowk, near Under Pass, Nathu Colony, Shahdara, Delhi", pincode: "110093", trainers: 7, sqft: 2700, lat: 28.6680, lng: 77.2863 },
  { id: 21, name: "WTF Punjabi Bagh",                 city: "Delhi",        address: "56/43, West Punjabi Bagh, Delhi", pincode: "110026", trainers: 6, sqft: 4000, lat: 28.6668, lng: 77.1356 },
  { id: 22, name: "WTF Raj Nagar",                    city: "Ghaziabad",   address: "R-13/112, Sector 13, Block 13, Raj Nagar, Ghaziabad, Uttar Pradesh", pincode: "201001", trainers: 4, sqft: 6000, lat: 28.6680, lng: 77.4320 },
  { id: 23, name: "WTF Govindpuram",                  city: "Ghaziabad",   address: "C-5, near HDFC Bank, Balaji Enclave, Krishna Garden Colony, Govindpuram, Ghaziabad", pincode: "201013", trainers: 5, sqft: 4000, lat: 28.7100, lng: 77.4500 },
  { id: 24, name: "WTF Raj Nagar Extension",          city: "Ghaziabad",   address: "VVIP Assets, Plot No. 6, Raj Nagar Extension, Ghaziabad, Uttar Pradesh", pincode: "201003", trainers: 5, sqft: 4200, lat: 28.6770, lng: 77.4158 },
  { id: 25, name: "WTF Gurugram — Sector 7",          city: "Gurugram",    address: "P21, Variman Point, Circular Rd, New Colony, Gurgaon Rural, Gurugram, Haryana", pincode: "122001", trainers: 4, sqft: 7500, lat: 28.4785, lng: 77.0207 },
  { id: 26, name: "WTF Gurugram — Sector 4",          city: "Gurugram",    address: "One Life Fitness, Cancon Enclave, Old Railway Rd, Urban Estate, Sector 4, Gurugram", pincode: "122001", trainers: 4, sqft: 4200, lat: 28.4720, lng: 77.0350 },
  { id: 27, name: "WTF Faridabad — Sector 82",        city: "Faridabad",   address: "Near Chandila Chowk, Bathola, Near World Street, Sector 82, Haryana", pincode: "121004", trainers: 3, sqft: 4400, lat: 28.3900, lng: 77.3250 },
  { id: 28, name: "WTF New Ashok Nagar",              city: "Delhi",        address: "E-480, New Ashok Nagar Road, Near Vasundra Enclave, Delhi", pincode: "110096", trainers: 5, sqft: 3500, lat: 28.6127, lng: 77.3120 },
];

export function gmapsLink(center: Pick<WTFCenter, "address">): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(center.address)}`;
}
