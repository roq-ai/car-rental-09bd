import axios from 'axios';
import queryString from 'query-string';
import { UsageDataInterface, UsageDataGetQueryInterface } from 'interfaces/usage-data';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getUsageData = async (
  query?: UsageDataGetQueryInterface,
): Promise<PaginatedInterface<UsageDataInterface>> => {
  const response = await axios.get('/api/usage-data', {
    params: query,
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const createUsageData = async (usageData: UsageDataInterface) => {
  const response = await axios.post('/api/usage-data', usageData);
  return response.data;
};

export const updateUsageDataById = async (id: string, usageData: UsageDataInterface) => {
  const response = await axios.put(`/api/usage-data/${id}`, usageData);
  return response.data;
};

export const getUsageDataById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/usage-data/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteUsageDataById = async (id: string) => {
  const response = await axios.delete(`/api/usage-data/${id}`);
  return response.data;
};
