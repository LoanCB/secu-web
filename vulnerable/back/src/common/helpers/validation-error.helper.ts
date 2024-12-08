import { ValidationError } from 'class-validator';

interface ErrorDetail {
  field: string;
  value?: string;
  messages?: string[];
  children?: ErrorDetail[];
}

export const buildErrors = (errors: ValidationError[]): ErrorDetail[] => {
  return errors.map((error) => {
    const errorDetail: ErrorDetail = {
      field: error.property,
    };

    if (error.constraints) {
      errorDetail.messages = Object.values(error.constraints);
    }

    if (error.children && error.children.length) {
      errorDetail.children = buildErrors(error.children);
    } else {
      errorDetail.value = error.value;
    }

    return errorDetail;
  });
};
