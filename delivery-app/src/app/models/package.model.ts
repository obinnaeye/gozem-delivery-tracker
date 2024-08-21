import { Location } from './location.model';

export interface Package {
  package_id: string;
  active_delivery_id?: string;
  description: string;
  weight: number;
  width: number;
  height: number;
  depth: number;
  from_name: string;
  from_location: Location;
  from_address: string;
  to_name: string;
  to_location: Location;
  to_address: string;
}
