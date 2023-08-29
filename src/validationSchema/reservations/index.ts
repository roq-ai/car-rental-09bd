import * as yup from 'yup';

export const reservationValidationSchema = yup.object().shape({
  start_time: yup.date().required(),
  end_time: yup.date().required(),
  vehicle_id: yup.string().nullable().required(),
  user_id: yup.string().nullable().required(),
});
