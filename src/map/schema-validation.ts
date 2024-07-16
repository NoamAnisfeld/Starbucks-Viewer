import { z } from 'zod';

export const starbucksStoreInfoSchema = z.object({
    longitude: z.number(),
    latitude: z.number(),
});
export type StarbucksStoreInfo = z.infer<typeof starbucksStoreInfoSchema>;