import { VehicleInterface } from 'interfaces/vehicle';
import { GetQueryInterface } from 'interfaces';

export interface PerformanceInterface {
  id?: string;
  performance_date: any;
  demand: number;
  vehicle_id: string;
  created_at?: any;
  updated_at?: any;

  vehicle?: VehicleInterface;
  _count?: {};
}

export interface PerformanceGetQueryInterface extends GetQueryInterface {
  id?: string;
  vehicle_id?: string;
}
