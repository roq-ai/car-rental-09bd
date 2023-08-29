const mapping: Record<string, string> = {
  organizations: 'organization',
  performances: 'performance',
  reservations: 'reservation',
  'usage-data': 'usage_data',
  users: 'user',
  vehicles: 'vehicle',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
