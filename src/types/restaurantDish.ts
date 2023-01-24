export type Dish = {
  stripe_api_id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Restaurant = {
  id: string;
  name: string;
  description: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
  dish: Dish[];
};
