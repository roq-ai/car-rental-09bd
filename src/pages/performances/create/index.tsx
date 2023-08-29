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

import { createPerformance } from 'apiSdk/performances';
import { performanceValidationSchema } from 'validationSchema/performances';
import { VehicleInterface } from 'interfaces/vehicle';
import { getVehicles } from 'apiSdk/vehicles';
import { PerformanceInterface } from 'interfaces/performance';

function PerformanceCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: PerformanceInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createPerformance(values);
      resetForm();
      router.push('/performances');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<PerformanceInterface>({
    initialValues: {
      performance_date: new Date(new Date().toDateString()),
      demand: 0,
      vehicle_id: (router.query.vehicle_id as string) ?? null,
    },
    validationSchema: performanceValidationSchema,
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
              label: 'Performances',
              link: '/performances',
            },
            {
              label: 'Create Performance',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Create Performance
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <FormWrapper onSubmit={formik.handleSubmit}>
          <FormControl id="performance_date" mb="4">
            <FormLabel fontSize="1rem" fontWeight={600}>
              Performance Date
            </FormLabel>
            <DatePicker
              selected={formik.values?.performance_date ? new Date(formik.values?.performance_date) : null}
              onChange={(value: Date) => formik.setFieldValue('performance_date', value)}
            />
          </FormControl>

          <NumberInput
            label="Demand"
            formControlProps={{
              id: 'demand',
              isInvalid: !!formik.errors?.demand,
            }}
            name="demand"
            error={formik.errors?.demand}
            value={formik.values?.demand}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('demand', Number.isNaN(valueNumber) ? 0 : valueNumber)
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
              onClick={() => router.push('/performances')}
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
    entity: 'performance',
    operation: AccessOperationEnum.CREATE,
  }),
)(PerformanceCreatePage);
