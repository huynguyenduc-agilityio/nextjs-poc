'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import {
  createInvoiceToDatabase,
  updateInvoiceById,
  deleteInvoiceById,
} from '../services/data';

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});

const Invoice = FormSchema.omit({ id: true, date: true });
const date = new Date().toISOString().split('T')[0];

// TODO: Need to remove params
const userInfo = {
  name: 'Amy Burns',
  email: 'amy@burns.com',
  image_url: '/customers/amy-burns.png',
};

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

export async function createInvoice(prevState: State, formData: FormData) {
  const validatedFields = Invoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  const { customerId, amount, status } = Invoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
  const amountInCents = amount * 100;

  const payload = {
    customer_id: customerId,
    amount: amountInCents,
    status,
    date,
    ...userInfo,
  };

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  await createInvoiceToDatabase(payload);

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = Invoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  const amountInCents = amount * 100;

  const payload = {
    customer_id: customerId,
    amount: amountInCents,
    status,
    date,
    ...userInfo,
  };

  await updateInvoiceById(id, payload);

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  await deleteInvoiceById(id);
  revalidatePath('/dashboard/invoices');
}
