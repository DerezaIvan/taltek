export interface SubmitFormPayload {
  name: string;
  email: string;
  message?: string;
}

export async function submitForm(_payload: SubmitFormPayload): Promise<void> {
  throw new Error('Not implemented');
}
