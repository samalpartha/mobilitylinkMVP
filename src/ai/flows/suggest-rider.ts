'use server';

/**
 * @fileOverview Suggests the closest available rider for a new dispatch task.
 *
 * - suggestRider - A function that suggests the closest available rider.
 * - SuggestRiderInput - The input type for the suggestRider function.
 * - SuggestRiderOutput - The return type for the suggestRider function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestRiderInputSchema = z.object({
  taskLocation: z
    .string()
    .describe(
      'The location of the new dispatch task.  This should be a geocode such as 37.7749,-122.4194.'
    ),
});
export type SuggestRiderInput = z.infer<typeof SuggestRiderInputSchema>;

const SuggestRiderOutputSchema = z.object({
  riderId: z.string().describe('The ID of the closest available rider.'),
  riderName: z.string().describe('The name of the closest available rider.'),
  riderLocation: z
    .string()
    .describe(
      'The current location of the closest available rider. This should be a geocode such as 37.7749,-122.4194.'
    ),
});
export type SuggestRiderOutput = z.infer<typeof SuggestRiderOutputSchema>;

export async function suggestRider(input: SuggestRiderInput): Promise<SuggestRiderOutput> {
  return suggestRiderFlow(input);
}

const suggestRiderPrompt = ai.definePrompt({
  name: 'suggestRiderPrompt',
  input: {schema: SuggestRiderInputSchema},
  output: {schema: SuggestRiderOutputSchema},
  prompt: `You are an expert dispatch manager for a fleet of riders. Given the location of a new task, you will identify the closest available rider and return their ID, name, and location. 

Task Location: {{{taskLocation}}}

Return the rider in JSON format.`,
});

const suggestRiderFlow = ai.defineFlow(
  {
    name: 'suggestRiderFlow',
    inputSchema: SuggestRiderInputSchema,
    outputSchema: SuggestRiderOutputSchema,
  },
  async input => {
    const {output} = await suggestRiderPrompt(input);
    return output!;
  }
);
