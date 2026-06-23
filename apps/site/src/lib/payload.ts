import config from '@payload-config';
import { getPayload as getPayloadClient } from 'payload';

export async function getPayload() {
  return getPayloadClient({ config });
}
