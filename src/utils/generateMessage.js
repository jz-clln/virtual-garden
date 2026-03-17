// ============================================================
//  generateMessage — calls OpenAI gpt-4o-mini for sweet messages
// ============================================================
import { AI_MODEL, AI_ENDPOINT, AI_API_KEY, FALLBACK_MESSAGES } from './constants.js'

/**
 * Generates a unique, never-repeating romantic message for Desilyn.
 *
 * @param {string} flowerName   - Name of the flower just planted
 * @param {Set<string>} usedSet - Already-used messages to avoid repeats
 * @returns {Promise<string>}
 */
export async function generateMessage(flowerName, usedSet) {
  const usedList =
    usedSet.size > 0
      ? `\n\nDo NOT repeat any of these already used messages:\n- ${[...usedSet].join('\n- ')}`
      : ''

  const prompt = `Generate ONE short romantic message (1–3 sentences) for a woman named Desilyn from her husband Jabez.

The message was inspired by a "${flowerName}" she just planted in their virtual garden together.

Use simple, natural language. The message should feel genuine, warm, and personal, like something Jabez would casually say to Desilyn in a message.

Sometimes the tone can be sweet, sometimes playful, sometimes softly romantic, but avoid overly deep or dramatic wording.

Do not use em dashes. Do not use quotation marks. Keep the message short and sincere.

You may lightly reference the flower, their garden, or caring for something together, but keep it natural.

Output only the message text.${usedList}`;

  try {
    const response = await fetch(AI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${AI_API_KEY}`,   // ← OpenAI uses Bearer token
      },
      body: JSON.stringify({
        model: AI_MODEL,           // gpt-4o-mini
        max_tokens: 200,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    })

    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      throw new Error(err?.error?.message || `HTTP ${response.status}`)
    }

    const data = await response.json()
    // OpenAI response shape: data.choices[0].message.content
    const text = data.choices?.[0]?.message?.content?.trim()

    if (text) {
      usedSet.add(text)
      return text
    }
    throw new Error('Empty response from OpenAI')

  } catch (err) {
    console.warn('generateMessage fallback triggered:', err.message)
    const available = FALLBACK_MESSAGES.filter(m => !usedSet.has(m))
    const pool = available.length > 0 ? available : FALLBACK_MESSAGES
    const msg  = pool[Math.floor(Math.random() * pool.length)]
    usedSet.add(msg)
    return msg
  }
}