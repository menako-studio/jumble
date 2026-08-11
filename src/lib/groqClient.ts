// ============================================================
// JUMBLE — Groq LLM AI Assistant Client
// ============================================================

const GROQ_API_KEY_STORAGE_KEY = 'jumble_groq_api_key';

export function getGroqApiKey(): string {
  return localStorage.getItem(GROQ_API_KEY_STORAGE_KEY) || '';
}

export function setGroqApiKey(key: string): void {
  localStorage.setItem(GROQ_API_KEY_STORAGE_KEY, key.trim());
}

export interface AskGroqParams {
  question: string;
  lessonTitle: string;
  cefrLevel?: string;
  ruleExplanation?: string;
  examples?: string[];
  lang?: 'en' | 'id';
}

export async function askGroqTutor(params: AskGroqParams): Promise<string> {
  const { question, lessonTitle, cefrLevel, ruleExplanation, examples, lang = 'en' } = params;
  const apiKey = getGroqApiKey();

  // If API Key is present, attempt live call to Groq API
  if (apiKey) {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: `You are an expert, friendly English Grammar Tutor in the Jumble gamified learning app (inspired by Brilliant.org & Duolingo).
Language response target: ${lang === 'id' ? 'Indonesian' : 'English'}.
Current Lesson Context: "${lessonTitle}" (CEFR: ${cefrLevel || 'General'}).
Rule Context: ${ruleExplanation || 'General Grammar'}.
Examples: ${examples?.join(' | ') || 'N/A'}.

Keep your response encouraging, clear, markdown-formatted, and concise (under 150 words). Include 1 illustrative example sentence when helpful.`,
            },
            {
              role: 'user',
              content: question,
            },
          ],
          temperature: 0.7,
          max_tokens: 300,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) {
          return content;
        }
      }
    } catch (e) {
      console.warn('Groq API call error, using smart fallback response:', e);
    }
  }

  // Smart Contextual Fallback Response when API key is not provided or API fails
  return generateContextualFallback(question, lessonTitle, ruleExplanation, lang);
}

function generateContextualFallback(
  question: string,
  lessonTitle: string,
  ruleExplanation?: string,
  lang: 'en' | 'id' = 'en'
): string {
  const qLower = question.toLowerCase();

  if (lang === 'id') {
    if (qLower.includes('simpel') || qLower.includes('sederhana') || qLower.includes('jelaskan')) {
      return `💡 **Penjelasan Sederhana untuk "${lessonTitle}":**\n\n${
        ruleExplanation || 'Aturan tata bahasa ini membantu membuat kalimat yang tepat dan alami.'
      }\n\n*Tips:* Ingatlah untuk selalu mencocokkan subjek dengan bentuk kata kerja (Subject-Verb Agreement)!`;
    }
    if (qLower.includes('contoh') || qLower.includes('example')) {
      return `📝 **Contoh Penggunaan Lainnya:**\n\n1. *She works at Google.* (Kerja rutin)\n2. *They are learning English right now.* (Aksi saat ini)\n3. *We have finished the assignment.* (Sudah selesai)`;
    }
    return `🤖 **Tutor AI Jumble:**\n\nUntuk materi **${lessonTitle}**, kuncinya adalah memahami aturan dasarnya:\n\n> ${
      ruleExplanation || 'Perhatikan bentuk kata kerja dan subjeknya!'
    }\n\n*Catatan:* Tambahkan **Groq API Key** di menu pengaturan untuk tanya-jawab AI serba tahu tanpa batas! ⚡`;
  }

  // English fallback
  if (qLower.includes('simple') || qLower.includes('explain')) {
    return `💡 **Simple breakdown for "${lessonTitle}":**\n\n${
      ruleExplanation || 'This grammar rule helps you construct natural English sentences.'
    }\n\n*Key Tip:* Always pair your subject correctly with the corresponding verb form!`;
  }
  if (qLower.includes('example')) {
    return `📝 **Additional Real-Life Examples:**\n\n1. *She works at Google.* (Daily routine)\n2. *They are learning English right now.* (Happening now)\n3. *We have finished the task.* (Completed result)`;
  }
  return `🤖 **Jumble AI Tutor:**\n\nRegarding **${lessonTitle}**, here is the core takeaway:\n\n> ${
    ruleExplanation || 'Always observe the subject-verb agreement!'
  }\n\n*Tip:* Add a **Groq API Key** in settings to unlock unlimited live AI responses! ⚡`;
}
