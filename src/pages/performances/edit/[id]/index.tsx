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
  Center,
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
import { FunctionComponent, useState, useRef } from 'react';
import * as yup from 'yup';
import useSWR from 'swr';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { ImagePicker } from 'components/image-file-picker';
import { getPerformanceById, updatePerformanceById } from 'apiSdk/performances';
import { performanceValidationSchema } from 'validationSchema/performances';
import { PerformanceInterface } from 'interfaces/performance';
import { VehicleInterface } from 'interfaces/vehicle';
import { getVehicles } from 'apiSdk/vehicles';

function PerformanceEditPage() {
  const router = useRouter();
  const id = router.query.id as string;

  const { data, error, isLoading, mutate } = useSWR<PerformanceInterface>(
    () => (id ? `/performances/${id}` : null),
    () => getPerformanceById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: PerformanceInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updatePerformanceById(id, values);
      mutate(updated);
      resetForm();
      router.push('/performances');
    } catch (error: any) {
      if (error?.response.status === 403) {
        setFormError({ message: "You don't have permisisons to update this resource" });
      } else {
        setFormError(error);
      }
    }
  };

  const formik = useFormik<PerformanceInterface>({
    initialValues: data,
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
              label: 'Update Performance',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Update Performance
          </Text>
        </Box>
        {(error || formError) && (
          <Box mb={4}>
            <Error error={error || formError} />
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
    operation: AccessOperationEnum.UPDATE,
  }),
)(PerformanceEditPage);
