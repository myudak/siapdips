/** Tutorial text with its **label** / `url` markup stripped, for meta tags and structured data. */
export const plainText = (text: string) => text.replace(/\*\*|`/g, "");
