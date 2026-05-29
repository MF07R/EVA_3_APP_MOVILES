import { useState } from 'react';
import * as z from "zod";

const schema = z.object({
  amount: z.number().positive('El monto debe ser positivo'),
  type: z.enum(['income', 'expense']),
  description: z.string().min(1, 'La descripción es requerida'),
  categoryId: z.string().min(1, 'Selecciona una categoría'),
});

type CreateTransactionInput = z.infer<typeof schema>;

type FormValues = {
  amount: string;
  type: 'income' | 'expense';
  description: string;
  categoryId: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

export function useTransactionForm(defaultValues: Partial<FormValues> = {}) {
  const [values, setValues] = useState<FormValues>({
    amount: defaultValues.amount ?? '',
    type: defaultValues.type ?? 'expense',
    description: defaultValues.description ?? '',
    categoryId: defaultValues.categoryId ?? '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const setField = <K extends keyof FormValues>(field: K, value: FormValues[K]) => {
    setValues(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validate = (): CreateTransactionInput | null => {
    const result = schema.safeParse({
      ...values,
      amount: parseFloat(values.amount),
    });
    if (!result.success) {
      const fieldErrors: FormErrors = {};
      result.error.issues.forEach(e => {
        const key = e.path[0] as keyof FormValues;
        fieldErrors[key] = e.message;
      });
      setErrors(fieldErrors);
      return null;
    }
    return result.data;
  };

  const reset = () => {
    setValues({
      amount: '',
      type: 'expense',
      description: '',
      categoryId: '',
    });
    setErrors({});
  };

  const handleSubmit = async (onSubmit: (data: CreateTransactionInput) => Promise<void>) => {
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