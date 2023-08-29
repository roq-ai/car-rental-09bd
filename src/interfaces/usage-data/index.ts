import { VehicleInterface } from 'interfaces/vehicle';
import { GetQueryInterface } from 'interfaces';

export interface UsageDataInterface {
  id?: string;
  usage_date: any;
  mileage: number;
  vehicle_id: string;
  created_at?: any;
  updated_at?: any;

  vehicle?: VehicleInterface;
  _count?: {};
}

export interface UsageDataGetQueryInterface extends GetQueryInterface {
  id?: string;
  vehicle_id?: string;
}
