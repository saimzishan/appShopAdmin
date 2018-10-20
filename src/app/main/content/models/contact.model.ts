
export class Contact {
  id: number;
  name: string;
  email: string;
  no: number; // house or buidling number
  street: string;
  postal_code: string;
  city: string;
  country: string;
  po_box: number;
  ph_landline1: string;
  ph_landline2: string;
  ph_landline3: string;
  ph_mobile1: string;
  ph_mobile2: string;
  ph_mobile3: string;
  type: string; // two types right now [User, Supplier]
  profile_image: string;

  constructor(contact?)
  {
    contact = contact || {};
    this.id = contact.id || -1;
    this.name = contact.name || '';
    this.email = contact.email || '';
    this.no = contact.no || '';
    this.street = contact.street || '';
    this.postal_code = contact.postal_code || '';
    this.city = contact.city || '';
    this.country = contact.country || '';
    this.po_box = contact.po_box || '';
    this.ph_landline1 = contact.ph_landline1 || '';
    this.ph_landline2 = contact.ph_landline2 || '';
    this.ph_landline3 = contact.ph_landline3 || '';
    this.ph_mobile1 = contact.ph_mobile1 || '';
    this.ph_mobile2 = contact.ph_mobile2 || '';
    this.ph_mobile3 = contact.ph_mobile3 || '';
    this.type = contact.type || '';
    this.profile_image = contact.profile_image || '';
  }
}
