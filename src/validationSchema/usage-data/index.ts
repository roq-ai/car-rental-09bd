import * as yup from 'yup';

export const usageDataValidationSchema = yup.object().shape({
  usage_date: yup.date().required(),
  mileage: yup.number().integer().required(),
  vehicle_id: yup.string().nullable().required(),
});
