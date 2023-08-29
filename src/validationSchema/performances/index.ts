import * as yup from 'yup';

export const performanceValidationSchema = yup.object().shape({
  performance_date: yup.date().required(),
  demand: yup.number().integer().required(),
  vehicle_id: yup.string().nullable().required(),
});
