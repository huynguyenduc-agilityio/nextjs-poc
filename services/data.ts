import { unstable_noStore as noStore } from 'next/cache';
import {
  CustomerField,
  InvoiceForm,
  InvoicePayload,
  InvoicesTable,
  LatestInvoiceRaw,
} from '../types/definitions';

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  try {
    const res = await fetch(
      `${process.env.API_ENDPOINT}/customers?limit=${ITEMS_PER_PAGE}&page=${currentPage}&search=${query}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    const data = await res.json();
    const formattedData: InvoicesTable[] = data === 'Not found' ? [] : data;

    return formattedData;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    const res = await fetch(
      `${process.env.API_ENDPOINT}/customers?search=${query}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    const data = await res.json();

    const formattedData: InvoicesTable[] = data === 'Not found' ? [] : data;
    const totalPages = Math.ceil(Number(formattedData.length) / ITEMS_PER_PAGE);

    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  noStore();

  try {
    const res = await fetch(`${process.env.API_ENDPOINT}/customers/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data: InvoiceForm = await res.json();
    data.amount = data.amount / 100;

    return data;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchCustomers() {
  noStore();

  try {
    const res = await fetch(`${process.env.API_ENDPOINT}/customers`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data: CustomerField[] = await res.json();

    return data;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function createInvoiceToDatabase(invoice: InvoicePayload) {
  noStore();

  try {
    const res = await fetch(`${process.env.API_ENDPOINT}/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invoice),
    });

    const data: LatestInvoiceRaw = await res.json();

    return data;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to create invoice.');
  }
}

export async function updateInvoiceById(id: string, invoice: InvoicePayload) {
  noStore();

  try {
    const res = await fetch(`${process.env.API_ENDPOINT}/customers/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invoice),
    });

    const data: LatestInvoiceRaw = await res.json();

    return data;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch invoice by id.');
  }
}

export async function deleteInvoiceById(id: string) {
  noStore();

  try {
    const res = await fetch(`${process.env.API_ENDPOINT}/customers/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data: LatestInvoiceRaw = await res.json();

    return data;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to delete invoice by id.');
  }
}
