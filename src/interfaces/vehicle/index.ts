import { PerformanceInterface } from 'interfaces/performance';
import { ReservationInterface } from 'interfaces/reservation';
import { UsageDataInterface } from 'interfaces/usage-data';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface VehicleInterface {
  id?: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  user_id: string;
  created_at?: any;
  updated_at?: any;
  performance?: PerformanceInterface[];
  reservation?: ReservationInterface[];
  usage_data?: UsageDataInterface[];
  user?: UserInterface;
  _count?: {
    performance?: number;
    reservation?: number;
    usage_data?: number;
  };
}

export interface VehicleGetQueryInterface extends GetQueryInterface {
  id?: string;
  make?: string;
  model?: string;
  user_id?: string;
}
