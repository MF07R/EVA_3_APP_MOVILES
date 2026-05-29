import { useState } from 'react';
import * as z from "zod";

type CreateCategoryInput = {
  name: string;
};

const schema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(50, 'Máximo 50 caracteres'),
});

type FormErrors = Partial<Record<keyof CreateCategoryInput, string>>;

export function useCategoryForm(defaultValues: CreateCategoryInput = { name: '' }) {
  const [values, setValues] = useState<CreateCategoryInput>(defaultValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const setField = (field: keyof CreateCategoryInput, value: string) => {
    setValues(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validate = (): CreateCategoryInput | null => {
    const result = schema.safeParse(values);
    if (!result.success) {
      const fieldErrors: FormErrors = {};
      result.error.issues.forEach(e => {
        const key = e.path[0] as keyof CreateCategoryInput;
        fieldErrors[key] = e.message;
      });
      setErrors(fieldErrors);
      return null;
    }
    return result.data;
  };

  const reset = () => {
    setValues(defaultValues);
    setErrors({});
  };

  const handleSubmit = async (onSubmit: (data: CreateCategoryInput) => Promise<void>) => {
    const data = validate();
    if (!data) return;
    setSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    values,
    errors,
    submitting,
    setField,
    validate,
    reset,
    handleSubmit,
  };
}