import axios from 'axios';
import queryString from 'query-string';
import { PerformanceInterface, PerformanceGetQueryInterface } from 'interfaces/performance';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getPerformances = async (
  query?: PerformanceGetQueryInterface,
): Promise<PaginatedInterface<PerformanceInterface>> => {
  const response = await axios.get('/api/performances', {
    params: query,
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const createPerformance = async (performance: PerformanceInterface) => {
  const response = await axios.post('/api/performances', performance);
  return response.data;
};

export const updatePerformanceById = async (id: string, performance: PerformanceInterface) => {
  const response = await axios.put(`/api/performances/${id}`, performance);
  return response.data;
};

export const getPerformanceById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/performances/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deletePerformanceById = async (id: string) => {
  const response = await axios.delete(`/api/performances/${id}`);
  return response.data;
};
