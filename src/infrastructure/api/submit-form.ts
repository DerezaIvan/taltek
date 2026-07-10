import { env } from '$env/dynamic/public';

export interface SubmitFormPayload {
  name: string;
  email: string;
  message?: string;
}

export interface ContactsFormPayload {
  name: string;
  phone: string;
  email: string;
  company: string;
  wagonType: string;
  directionFrom: string;
  directionTo: string;
  comment: string;
}

export async function submitForm(_payload: SubmitFormPayload): Promise<void> {
  throw new Error('Not implemented');
}

export async function submitContactsForm(payload: ContactsFormPayload): Promise<void> {
  const apiUrl = env.PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error('Отправка формы не настроена: отсутствует PUBLIC_API_URL');
  }

  const response = await fetch(`${apiUrl.replace(/\/$/, '')}/contact`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || 'Не удалось отправить форму. Попробуйте позже.');
  }
}
