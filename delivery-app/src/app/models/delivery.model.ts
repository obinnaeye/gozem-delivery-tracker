import { Location } from './location.model';

export interface Delivery {
  delivery_id: string;
  package_id: string;
  pickup_time?: Date;
  start_time?: Date;
  end_time?: Date;
  location?: Location;
  status: 'open' | 'picked-up' | 'in-transit' | 'delivered' | 'failed';
}
