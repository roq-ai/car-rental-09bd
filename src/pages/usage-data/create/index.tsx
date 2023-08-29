import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  Flex,
} from '@chakra-ui/react';
import Breadcrumbs from 'components/breadcrumb';
import DatePicker from 'components/date-picker';
import { Error } from 'components/error';
import { FormWrapper } from 'components/form-wrapper';
import { NumberInput } from 'components/number-input';
import { SelectInput } from 'components/select-input';
import { AsyncSelect } from 'components/async-select';
import { TextInput } from 'components/text-input';
import AppLayout from 'layout/app-layout';
import { FormikHelpers, useFormik } from 'formik';
import { useRouter } from 'next/router';
import { FunctionComponent, useState } from 'react';
import * as yup from 'yup';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';

import { createUsageData } from 'apiSdk/usage-data';
import { usageDataValidationSchema } from 'validationSchema/usage-data';
import { VehicleInterface } from 'interfaces/vehicle';
import { getVehicles } from 'apiSdk/vehicles';
import { UsageDataInterface } from 'interfaces/usage-data';

function UsageDataCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: UsageDataInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createUsageData(values);
      resetForm();
      router.push('/usage-data');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<UsageDataInterface>({
    initialValues: {
      usage_date: new Date(new Date().toDateString()),
      mileage: 0,
      vehicle_id: (router.query.vehicle_id as string) ?? null,
    },
    validationSchema: usageDataValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout
      breadcrumbs={
        <Breadcrumbs
          items={[
            {
              label: 'Usage Data',
              link: '/usage-data',
            },
            {
              label: 'Create Usage Data',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Create Usage Data
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <FormWrapper onSubmit={formik.handleSubmit}>
          <FormControl id="usage_date" mb="4">
            <FormLabel fontSize="1rem" fontWeight={600}>
              Usage Date
            </FormLabel>
            <DatePicker
              selected={formik.values?.usage_date ? new Date(formik.values?.usage_date) : null}
              onChange={(value: Date) => formik.setFieldValue('usage_date', value)}
            />
          </FormControl>

          <NumberInput
            label="Mileage"
            formControlProps={{
              id: 'mileage',
              isInvalid: !!formik.errors?.mileage,
            }}
            name="mileage"
            error={formik.errors?.mileage}
            value={formik.values?.mileage}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('mileage', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <AsyncSelect<VehicleInterface>
            formik={formik}
            name={'vehicle_id'}
            label={'Select Vehicle'}
            placeholder={'Select Vehicle'}
            fetcher={getVehicles}
            labelField={'make'}
          />
          <Flex justifyContent={'flex-start'}>
            <Button
              isDisabled={formik?.isSubmitting}
              bg="state.info.main"
              color="base.100"
              type="submit"
              display="flex"
              height="2.5rem"
              padding="0rem 1rem"
              justifyContent="center"
              alignItems="center"
              gap="0.5rem"
              mr="4"
              _hover={{
                bg: 'state.info.main',
                color: 'base.100',
              }}
            >
              Submit
            </Button>
            <Button
              bg="neutral.transparent"
              color="neutral.main"
              type="button"
              display="flex"
              height="2.5rem"
              padding="0rem 1rem"
              justifyContent="center"
              alignItems="center"
              gap="0.5rem"
              mr="4"
              onClick={() => router.push('/usage-data')}
              _hover={{
                bg: 'neutral.transparent',
                color: 'neutral.main',
              }}
            >
              Cancel
            </Button>
          </Flex>
        </FormWrapper>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'usage_data',
    operation: AccessOperationEnum.CREATE,
  }),
)(UsageDataCreatePage);
