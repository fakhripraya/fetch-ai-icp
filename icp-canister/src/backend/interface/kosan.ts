export interface IKosan {
  name?: string;
  priceRange?: number;
  facility?: string;
  location?: string;
}



export interface IKosanDBObject {
  id: string;
  name: string;
  price: number;
  facility: string;
  location: string;
  images?: string[];
  fullDescription?: string;
}


