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

export async function submitContactsForm(_payload: ContactsFormPayload): Promise<void> {
  throw new Error('Not implemented');
}
