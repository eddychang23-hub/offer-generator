// /api/parse-mls — Parse an MLS sheet PDF via Claude. Same prompt and
// schema as mls_extractor.py so the dashboard upload produces identical
// fields to the desktop showing automation.
//
// POST { pdf_base64: "..." }  →  { success: true, parsed: { seller1, ... } }
//
// Requires ANTHROPIC_API_KEY env var on Vercel.

const Anthropic = require('@anthropic-ai/sdk').default || require('@anthropic-ai/sdk');

const MLS_PARSE_PROMPT = `Extract these fields from the MLS sheet. Return ONLY valid JSON, no markdown fences.

{
  "seller1": "first seller full name",
  "seller2": "second seller full name or empty string",
  "street_num": "street number only",
  "street": "street name with suffix and direction (e.g. 157 ST NW)",
  "city": "city name",
  "zipcode": "postal code",
  "plan": "Plan from Plan/Blk/Lot",
  "block": "Block from Plan/Blk/Lot",
  "lot": "Lot from Plan/Blk/Lot",
  "mls": "MLS number",
  "price": "list price as number, no commas or $",
  "beds": "bedroom count",
  "baths": "bathroom count",
  "sqft": "total above-grade square footage",
  "year_built": "year built",
  "listing_broker": "listing office name",
  "listing_agent": "primary listing agent full name",
  "listing_agent_ph": "primary listing agent phone",
  "listing_agent_email": "agent email",
  "inclusions": "goods included, as written",
  "exclusions": "goods excluded, as written"
}

IMPORTANT: Return the primary listing agent (List Agent 1) details. If a field
is not present, return an empty string for it. Do not invent values.`;

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST only' });
  }

  const { pdf_base64 } = req.body || {};
  if (!pdf_base64) {
    return res.status(400).json({ error: 'pdf_base64 is required in request body' });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({
      error: 'ANTHROPIC_API_KEY env var not set on Vercel. Add it via Vercel project settings → Environment Variables.'
    });
  }

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'document',
              source: {
                type: 'base64',
                media_type: 'application/pdf',
                data: pdf_base64,
              },
            },
            {
              type: 'text',
              text: MLS_PARSE_PROMPT,
            },
          ],
        },
      ],
    });

    const raw = (response.content[0]?.text || '').trim();
    // Strip markdown fences in case Claude added them despite the prompt
    const cleaned = raw.replace(/^```json\s*|^```\s*|```$/gm, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error('JSON parse failed. Raw response:', raw);
      return res.status(502).json({
        error: `Claude returned non-JSON: ${parseErr.message}`,
        raw_response: raw.slice(0, 500),
      });
    }

    return res.status(200).json({ success: true, parsed });
  } catch (err) {
    console.error('parse-mls error:', err);
    return res.status(500).json({ error: err.message || String(err) });
  }
};
