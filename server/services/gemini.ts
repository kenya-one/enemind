/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from '@google/genai';
import { AICategory } from '../../src/types/index.js';
import { config } from '../config.js';

let geminiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!geminiClient) {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'MY_GEMINI_API_KEY') {
      throw new Error('GEMINI_API_KEY is not configured. Please set your Gemini API key in AI Studio Settings > Secrets.');
    }
    geminiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return geminiClient;
}

export class GeminiService {
  isConfigured(): boolean {
    return Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY');
  }

  /**
   * Main Enermind multi-category AI reasoning engine
   */
  async generateCampusAssistance(params: {
    category: AICategory;
    prompt: string;
    userContext?: {
      institutionName?: string;
      courseName?: string;
      yearLevel?: string;
      countryCode?: string;
    };
    hasPrivateVaultAuthorization?: boolean;
  }): Promise<{
    response: string;
    category: AICategory;
    suggestedActions?: string[];
    groundingSources?: string[];
    isConfigured: boolean;
  }> {
    if (!this.isConfigured()) {
      return {
        response: `Enermind Gemini AI is ready to connect, but **GEMINI_API_KEY** is not yet configured in the environment. Configure the key in **Settings > Secrets** to enable real-time academic explanations, study plans, and Google Sheet generators.`,
        category: params.category,
        isConfigured: false,
        suggestedActions: [
          'Configure GEMINI_API_KEY in Secrets',
          'Explore Academic Course Catalog',
          'Browse Google Sheet Store',
        ],
      };
    }

    try {
      const ai = getGeminiClient();

      const systemInstruction = `You are Enermind Campus AI, an intelligent, objective academic and student advisor for university and college students worldwide.
You provide precise, structured, high-value guidance for higher-education students across institutions globally.
User Context:
- Institution: ${params.userContext?.institutionName || 'Global University'}
- Course / Major: ${params.userContext?.courseName || 'Higher Education Studies'}
- Level / Year: ${params.userContext?.yearLevel || 'Undergraduate'}
- Country: ${params.userContext?.countryCode || 'Global'}
- Category: ${params.category}

Security & Privacy Rule:
- Respect student privacy. Do not leak or fabricate private files.
- Deliver clear formatting with markdown headings, bullet points, and actionable next steps.
- When generating formulas or spreadsheet structure suggestions, format them cleanly with headers and formulas.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: params.prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const responseText = response.text || 'Unable to generate advice at this moment.';

      const suggestedActions: string[] = [];
      if (params.category === AICategory.ACADEMIC) {
        suggestedActions.push('Generate 7-day Revision Schedule', 'Explain key exam concepts', 'Export notes outline to Google Docs');
      } else if (params.category === AICategory.SHEET) {
        suggestedActions.push('Open template in Google Sheets', 'Add automated summary tab', 'Generate sample budget dataset');
      } else if (params.category === AICategory.CAREER) {
        suggestedActions.push('Tailor CV for this opportunity', 'Draft professional cover letter', 'Practice interview questions');
      } else {
        suggestedActions.push('Save to Enermind notes', 'Explore related campus resources');
      }

      return {
        response: responseText,
        category: params.category,
        suggestedActions,
        isConfigured: true,
      };
    } catch (error: any) {
      console.error('Gemini execution error:', error);
      return {
        response: `Enermind AI error: ${error?.message || 'Failed to process request.'}`,
        category: params.category,
        isConfigured: true,
      };
    }
  }

  /**
   * Past Paper and Academic Note Explainer
   */
  async explainPastPaper(params: {
    paperTitle: string;
    questionText: string;
    courseName?: string;
  }): Promise<{ explanation: string; solutionSteps: string[]; relatedTopics: string[] }> {
    if (!this.isConfigured()) {
      return {
        explanation: 'Configure GEMINI_API_KEY to unlock step-by-step past paper analysis.',
        solutionSteps: ['API Key Required'],
        relatedTopics: ['General University Syllabus'],
      };
    }

    try {
      const ai = getGeminiClient();
      const prompt = `Explain the following academic exam question from course "${params.courseName || 'University Course'}":
Paper: ${params.paperTitle}
Question:
${params.questionText}

Provide:
1. Core theoretical concepts
2. Step-by-step breakdown and mathematical/logical solution
3. Common student pitfalls in exam settings`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
      });

      return {
        explanation: response.text || 'Explanation generated.',
        solutionSteps: ['Review fundamental theorems', 'Apply boundary conditions', 'Derive final expression'],
        relatedTopics: ['Course Syllabus Topic 3', 'Exam Preparation Guidelines'],
      };
    } catch (err: any) {
      return {
        explanation: `Analysis failed: ${err?.message}`,
        solutionSteps: [],
        relatedTopics: [],
      };
    }
  }

  /**
   * Phase 6: Grounded AI Accommodation Assistant
   * Queries real accommodation data and answers student inquiries without inventing fake listings
   */
  async searchAndAdviseAccommodation(params: {
    query: string;
    studentCampus?: string;
    studentInstitution?: string;
    targetCurrency?: string;
    realPropertiesCatalog: Array<{
      id: string;
      title: string;
      propertyType: string;
      roomType: string;
      city: string;
      distanceFromCampusKm?: number | null;
      primaryCampusName?: string;
      price: number;
      currency: string;
      availableUnits: number;
      amenities: string[];
      isFurnished: boolean;
      utilitiesIncluded: boolean;
      verificationBadge: boolean;
    }>;
  }): Promise<{
    answer: string;
    recommendedPropertyIds: string[];
    suggestedFilters?: { maxPrice?: number; propertyType?: string; amenities?: string[] };
  }> {
    if (!this.isConfigured()) {
      // Fallback rule-based matching when API key is not yet set
      const q = params.query.toLowerCase();
      const matches = params.realPropertiesCatalog.filter((p) => {
        return (
          p.title.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.roomType.toLowerCase().includes(q) ||
          p.amenities.some((a) => a.toLowerCase().includes(q)) ||
          (params.studentCampus && p.primaryCampusName?.toLowerCase().includes(params.studentCampus.toLowerCase()))
        );
      });

      const bestMatches = matches.length > 0 ? matches.slice(0, 3) : params.realPropertiesCatalog.slice(0, 2);
      const answer = `Based on your query "${params.query}" near ${params.studentCampus || 'your campus'}, here are matching verified options from our accommodation database:
${bestMatches.map((m) => `• **${m.title}** (${m.city}) — ${m.currency} ${m.price}/mo, ${m.roomType.replace('_', ' ')} (${m.availableUnits} available, ${m.distanceFromCampusKm ? `${m.distanceFromCampusKm} km from campus` : 'Central'}). Includes: ${m.amenities.slice(0, 3).join(', ')}`).join('\n')}

*(Configure GEMINI_API_KEY in Secrets for live natural-language conversational accommodation analysis)*`;

      return {
        answer,
        recommendedPropertyIds: bestMatches.map((m) => m.id),
      };
    }

    try {
      const ai = getGeminiClient();
      const catalogSummary = params.realPropertiesCatalog.map((p) => ({
        id: p.id,
        title: p.title,
        type: p.propertyType,
        room: p.roomType,
        city: p.city,
        campus: p.primaryCampusName,
        distanceKm: p.distanceFromCampusKm,
        price: `${p.currency} ${p.price}`,
        availableBeds: p.availableUnits,
        verified: p.verificationBadge,
        amenities: p.amenities.join(', '),
      }));

      const prompt = `You are Enermind Accommodation AI, a trusted campus housing advisor.
User Question: "${params.query}"
User Campus: ${params.studentCampus || 'Not specified'}
User Institution: ${params.studentInstitution || 'Not specified'}
Preferred Currency: ${params.targetCurrency || 'USD'}

AVAILABLE REAL ACCOMMODATION DATABASE:
${JSON.stringify(catalogSummary, null, 2)}

Strict Instructions:
1. Ground your recommendations strictly in the provided real properties catalog. NEVER invent non-existent properties, landlords, prices, or fake distances.
2. If no properties match the exact criteria (e.g. unrealistic budget or unavailable amenities), clearly state what is available and suggest practical adjustments.
3. Compare options objectively (price, walking distance, Wi-Fi, security, furnished status).
4. Do not leak private owner details, landlord contact phone numbers, or private verification documents in the response. Direct the user to use the "Contact / Inquire" button on the property card.
5. Format your output with clean markdown bullet points and highlight property names.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
      });

      const answer = response.text || 'No matching accommodation advice found.';
      
      // Match referenced property IDs
      const recommendedPropertyIds = params.realPropertiesCatalog
        .filter((p) => answer.includes(p.title) || answer.includes(p.id))
        .map((p) => p.id);

      return {
        answer,
        recommendedPropertyIds: recommendedPropertyIds.length > 0 ? recommendedPropertyIds : params.realPropertiesCatalog.slice(0, 2).map((p) => p.id),
      };
    } catch (err: any) {
      return {
        answer: `Accommodation AI query failed: ${err.message}`,
        recommendedPropertyIds: [],
      };
    }
  }

  /**
   * Phase 7: Grounded AI Opportunities & Job Search Assistant
   * Answers natural language student queries based strictly on real published opportunities.
   */
  async searchAndAdviseOpportunities(params: {
    query: string;
    studentCourse?: string;
    studentInstitution?: string;
    studentSkills?: string[];
    realOpportunitiesCatalog: Array<{
      id: string;
      title: string;
      organizationName: string;
      type: string;
      remoteType: string;
      country: string;
      city: string;
      salary: string;
      skills: string[];
      requirements: string[];
      deadline: string;
    }>;
  }): Promise<{
    answer: string;
    recommendedOpportunityIds: string[];
  }> {
    if (!this.isConfigured()) {
      const q = params.query.toLowerCase();
      const matches = params.realOpportunitiesCatalog.filter((o) => {
        return (
          o.title.toLowerCase().includes(q) ||
          o.organizationName.toLowerCase().includes(q) ||
          o.type.toLowerCase().includes(q) ||
          o.country.toLowerCase().includes(q) ||
          o.city.toLowerCase().includes(q) ||
          o.skills.some((s) => s.toLowerCase().includes(q))
        );
      });

      const selected = matches.length > 0 ? matches.slice(0, 3) : params.realOpportunitiesCatalog.slice(0, 2);
      const answer = `Based on your career search "${params.query}", here are matching opportunities from our verified opportunities registry:

${selected
  .map(
    (o) =>
      `• **${o.title}** at **${o.organizationName}** (${o.city}, ${o.country})\n  *Type:* ${o.type.replace('_', ' ')} | *Workplace:* ${o.remoteType.replace('_', ' ')}\n  *Compensation:* ${o.salary}\n  *Key Skills:* ${o.skills.slice(0, 4).join(', ')}\n  *Deadline:* ${new Date(o.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`
  )
  .join('\n\n')}

*(Configure GEMINI_API_KEY in Settings > Secrets for real-time deep career reasoning)*`;

      return {
        answer,
        recommendedOpportunityIds: selected.map((o) => o.id),
      };
    }

    try {
      const ai = getGeminiClient();
      const prompt = `You are Enermind Career AI, an intelligent, objective career and employment advisor for global university and college students.
Student Query: "${params.query}"
Student Course/Major: ${params.studentCourse || 'Not specified'}
Student Institution: ${params.studentInstitution || 'Not specified'}
Student Skills: ${params.studentSkills?.join(', ') || 'General student skills'}

REAL PUBLISHED OPPORTUNITIES DATABASE:
${JSON.stringify(params.realOpportunitiesCatalog, null, 2)}

Strict Instructions:
1. Ground your recommendations strictly in the provided real opportunities catalog. NEVER invent non-existent jobs, fake companies, salaries, or fake application links.
2. If no jobs match the exact criteria (e.g. niche role or unavailable region), clearly state "No matching opportunities were found in the current registry" and offer practical guidance on related skills or upcoming cycles.
3. Highlight why each recommended role fits the student's profile (e.g. course match, skill overlap, deadline urgency).
4. Emphasize safety: remimd students to apply through the portal and never send money to recruiters.
5. Format your output with clear markdown headings and bullet points.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
      });

      const answer = response.text || 'No matching opportunities found.';
      const recommendedOpportunityIds = params.realOpportunitiesCatalog
        .filter((o) => answer.includes(o.title) || answer.includes(o.id) || answer.includes(o.organizationName))
        .map((o) => o.id);

      return {
        answer,
        recommendedOpportunityIds: recommendedOpportunityIds.length > 0 ? recommendedOpportunityIds : params.realOpportunitiesCatalog.slice(0, 2).map((o) => o.id),
      };
    } catch (err: any) {
      return {
        answer: `Career search failed: ${err.message}`,
        recommendedOpportunityIds: [],
      };
    }
  }

  /**
   * Phase 7: Career Tooling Suite (CV Improvement, Cover Letter Outline, Interview Preparation, Skill Gap)
   */
  async assistCareerTool(params: {
    action: 'IMPROVE_CV' | 'COVER_LETTER' | 'INTERVIEW_PREP' | 'SKILL_GAP' | 'EXPLAIN_ROLE';
    studentProfile?: {
      headline?: string;
      bio?: string;
      education?: any[];
      skills?: string[];
      experience?: any[];
      projects?: any[];
    };
    opportunityContext?: {
      title: string;
      organizationName: string;
      type: string;
      description: string;
      requirements: string[];
      responsibilities: string[];
      skills: string[];
    };
    customPrompt?: string;
  }): Promise<{
    result: string;
    actionItems: string[];
  }> {
    if (!this.isConfigured()) {
      let defaultResult = '';
      if (params.action === 'IMPROVE_CV') {
        defaultResult = `### 📄 Resume & CV Enhancement Guide\n\n1. **Lead with Impact:** Use the STAR method (Situation, Task, Action, Result) for all experience bullets.\n2. **Quantify Metrics:** Add numbers (e.g., "improved performance by 25%", "coordinated 120+ participants").\n3. **Tailor Keywords:** Ensure keywords matching target roles (e.g. Python, SQL, React) are prominent.\n\n*(Configure GEMINI_API_KEY in Secrets for automated document evaluation)*`;
      } else if (params.action === 'COVER_LETTER') {
        defaultResult = `### ✉️ Tailored Cover Letter Structure for ${params.opportunityContext?.title || 'Target Role'}\n\n**Dear Hiring Team at ${params.opportunityContext?.organizationName || 'the Organization'},**\n\nI am writing to express my strong enthusiasm for the ${params.opportunityContext?.title || 'position'}. With my background in ${params.studentProfile?.education?.[0]?.fieldOfStudy || 'my academic field'} and practical experience in ${params.studentProfile?.skills?.slice(0, 3).join(', ') || 'industry skills'}, I am eager to contribute immediately to your team's objectives.\n\n[Body Paragraph highlighting key project impact]\n\nThank you for considering my application. I look forward to discussing how my skills align with your goals.\n\n**Sincerely,**\n[Your Name]`;
      } else if (params.action === 'INTERVIEW_PREP') {
        defaultResult = `### 🎯 Interview Preparation Checklist for ${params.opportunityContext?.title || 'Target Role'}\n\n1. **Technical Foundation:** Review core concepts in ${params.opportunityContext?.skills?.slice(0, 3).join(', ') || 'essential job skills'}.\n2. **Behavioral Questions:** Prepare 2 stories illustrating teamwork under pressure.\n3. **Role Understanding:** Be prepared to explain how ${params.opportunityContext?.organizationName || 'the company'} delivers value.`;
      } else {
        defaultResult = `### 💡 Career Guidance\n\nReview the required competencies and align your portfolio projects to demonstrate practical mastery.`;
      }

      return {
        result: defaultResult,
        actionItems: ['Configure GEMINI_API_KEY for dynamic generation', 'Update Career Profile', 'Review application requirements'],
      };
    }

    try {
      const ai = getGeminiClient();
      const prompt = `You are Enermind Career AI, an expert career advisor, resume specialist, and technical recruiter.
Action: ${params.action}

STUDENT CAREER CONTEXT:
${JSON.stringify(params.studentProfile || {}, null, 2)}

TARGET OPPORTUNITY CONTEXT (IF APPLICABLE):
${JSON.stringify(params.opportunityContext || {}, null, 2)}

CUSTOM USER REQUEST:
${params.customPrompt || 'Provide comprehensive assistance for the specified action.'}

Instructions:
- If IMPROVE_CV: Provide actionable critique on clarity, strong action verbs, quantifiable achievements, and structure. Provide a polished CV summary outline.
- If COVER_LETTER: Draft a professional, compelling, human-sounding cover letter tailored specifically to the opportunity's responsibilities and requirements without generic clichés.
- If INTERVIEW_PREP: Generate 5 realistic interview questions (3 behavioral + 2 role-specific technical/scenario questions) with bulleted guidelines on how to structure high-impact answers.
- If SKILL_GAP: Compare student skills against opportunity requirements. List matched strengths, missing skills, and a 2-week quick-learning plan for each gap.
- If EXPLAIN_ROLE: Break down technical jargon into clear student-friendly expectations and day-to-day duties.
- Respect privacy. Keep tone professional, encouraging, and concrete. Format with markdown headings and lists.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
      });

      return {
        result: response.text || 'Career analysis completed.',
        actionItems: ['Review generated suggestions', 'Save to Career Profile', 'Proceed with Application'],
      };
    } catch (err: any) {
      return {
        result: `Career AI error: ${err.message}`,
        actionItems: [],
      };
    }
  }

  /**
   * Phase 8: Task Economy AI Assistant (Task Drafting, Proposal Assistant, Milestone Breakdown)
   */
  async assistTaskEconomy(params: {
    action: 'DRAFT_TASK' | 'DRAFT_PROPOSAL' | 'EXPLAIN_TASK' | 'SUGGEST_MILESTONES' | 'CHECK_INTEGRITY';
    taskContext?: any;
    workerContext?: any;
    customPrompt?: string;
  }): Promise<{
    result: string;
    suggestedData?: any;
    actionItems: string[];
    isClean?: boolean;
  }> {
    if (!this.isConfigured()) {
      if (params.action === 'DRAFT_TASK') {
        return {
          result: `### 📝 Task Drafting Assistant\n\n**Suggested Structure:**\n1. **Objective:** Define exactly what needs to be created or solved.\n2. **Skills:** Specify 3-5 technical or domain skills.\n3. **Deliverables:** Provide a clear bulleted checklist.\n4. **Budget & Timeline:** Set a realistic fixed or hourly amount.`,
          actionItems: ['Review requirements', 'Specify deliverables', 'Set deadline'],
        };
      } else if (params.action === 'DRAFT_PROPOSAL') {
        return {
          result: `### 🚀 Proposal Suggestion for ${params.taskContext?.title || 'Selected Task'}\n\n**Hi there,**\n\nI saw your task requirement and I'm confident I can deliver high-quality results. I have strong experience in ${params.workerContext?.skills?.slice(0, 3).join(', ') || 'the requested skills'} and have completed similar projects.\n\n**Approach:**\n1. Initial review and alignment on specifications\n2. First milestone draft for your feedback\n3. Final delivery with source files and documentation\n\nLooking forward to working with you!`,
          actionItems: ['Customize proposal with specific portfolio links', 'Set bid amount', 'Submit proposal'],
        };
      }
      return {
        result: `### 💼 Task Economy Advisor\n\nReview project requirements and align with marketplace standards.`,
        actionItems: ['Proceed with task action'],
      };
    }

    try {
      const ai = getGeminiClient();
      const prompt = `You are Enermind Student Economy AI, a specialized assistant for university freelance marketplaces and student micro-projects.
Action: ${params.action}

TASK CONTEXT (IF APPLICABLE):
${JSON.stringify(params.taskContext || {}, null, 2)}

WORKER / POSTER CONTEXT (IF APPLICABLE):
${JSON.stringify(params.workerContext || {}, null, 2)}

USER PROMPT / INSTRUCTIONS:
${params.customPrompt || 'Execute the requested action with practical, structured advice.'}

STRICT ACADEMIC INTEGRITY & MARKETPLACE RULES:
1. Academic Integrity: NEVER draft or assist tasks that ask students to cheat, take exams, write graded academic tests for others, or solve exam questions.
2. Legitimate Assistance: Permitted services include tutoring, code mentoring, graphic design, photography, data entry/scraping, translation, research assistance, and campus services.
3. Realistic Proposals: In DRAFT_PROPOSAL mode, highlight real worker capabilities without making up fake qualifications.
4. Format: Use clean markdown headings, bulleted deliverables, and structured lists.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
      });

      return {
        result: response.text || 'Task assistance generated successfully.',
        actionItems: ['Review generated content', 'Apply to task form', 'Proceed'],
      };
    } catch (err: any) {
      return {
        result: `Task Economy AI error: ${err.message}`,
        actionItems: [],
      };
    }
  }

  /**
   * Phase 10: Grounded Campus Calendar & Events AI Advisor
   * Formulates weekly planning, exam study timetables, and answers event queries strictly grounded in real campus data
   */
  async assistCampusCalendar(params: {
    action: 'PLAN_MY_WEEK' | 'WEEKLY_SUMMARY' | 'EVENT_QA' | 'STUDY_PLAN_EXAM';
    studentContext?: {
      institutionName?: string;
      campusName?: string;
      courseName?: string;
      yearLevel?: string;
    };
    eventsCatalog: Array<{
      id: string;
      title: string;
      category: string;
      startDateTime: string;
      endDateTime?: string;
      location: string;
      locationType?: string;
      organizerName: string;
      isOfficial?: boolean;
    }>;
    deadlinesCatalog: Array<{
      id: string;
      title: string;
      type: string;
      deadline: string;
      priority: string;
      courseCode?: string;
      isOfficial?: boolean;
    }>;
    examsCatalog: Array<{
      id: string;
      courseCode: string;
      courseName: string;
      dateTime: string;
      venue: string;
      room: string;
      durationMinutes: number;
    }>;
    userQuery?: string;
  }): Promise<{
    summary: string;
    suggestedSchedule?: Array<{ day: string; time: string; activity: string; type: string; itemTitle: string }>;
    actionItems: string[];
    groundedItemIds: string[];
  }> {
    const groundedItemIds: string[] = [
      ...params.eventsCatalog.map((e) => e.id),
      ...params.deadlinesCatalog.map((d) => d.id),
      ...params.examsCatalog.map((x) => x.id),
    ];

    if (!this.isConfigured()) {
      // Deterministic rule-based planner when API key is not configured
      const totalEvents = params.eventsCatalog.length;
      const totalDeadlines = params.deadlinesCatalog.length;
      const totalExams = params.examsCatalog.length;

      let summaryText = `### 📅 Campus Calendar Advisor\n\nYou currently have **${totalEvents} upcoming event(s)**, **${totalDeadlines} academic deadline(s)**, and **${totalExams} scheduled exam(s)** on your campus calendar.`;

      if (params.deadlinesCatalog.length > 0) {
        const topDeadline = params.deadlinesCatalog[0];
        summaryText += `\n\n**Next Priority Deadline:**\n- **${topDeadline.title}** (${new Date(topDeadline.deadline).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })})`;
      }

      if (params.examsCatalog.length > 0) {
        const firstExam = params.examsCatalog[0];
        summaryText += `\n\n**Upcoming Examination:**\n- **${firstExam.courseCode}: ${firstExam.courseName}** in ${firstExam.venue} (${firstExam.room}) on ${new Date(firstExam.dateTime).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}.`;
      }

      return {
        summary: summaryText,
        actionItems: [
          'Review high-priority deadlines on calendar',
          'Add key exam dates to Google Calendar',
          'Export weekly plan to Google Drive',
        ],
        groundedItemIds,
      };
    }

    try {
      const ai = getGeminiClient();
      const prompt = `You are Enermind Campus AI, an academic calendar and student advisor.
Goal: Provide high-value, organized study planning and calendar assistance for a student.

STUDENT CONTEXT:
- Institution: ${params.studentContext?.institutionName || 'University'}
- Campus: ${params.studentContext?.campusName || 'Main Campus'}
- Major / Course: ${params.studentContext?.courseName || 'Higher Education'}

REAL CAMPUS EVENTS ON RECORD:
${JSON.stringify(params.eventsCatalog, null, 2)}

REAL ACADEMIC DEADLINES ON RECORD:
${JSON.stringify(params.deadlinesCatalog, null, 2)}

REAL EXAMS ON RECORD:
${JSON.stringify(params.examsCatalog, null, 2)}

ACTION REQUESTED: ${params.action}
STUDENT QUERY / PROMPT: ${params.userQuery || 'Plan my week and summarize my priorities based on these actual records.'}

RULES:
1. STRICT GROUNDING: ONLY reference events, deadlines, and exams present in the data above. NEVER invent fake events, fake times, or fake room numbers.
2. Structure: Format clearly with markdown headings (e.g. "### 🎯 Key Priorities", "### 📅 Suggested 7-Day Study & Attendance Schedule", "### 💡 Preparation Tips").
3. Include specific times and locations from the real records.
4. Tone: Encouraging, efficient, and academically disciplined.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
      });

      return {
        summary: response.text || 'Schedule analysis generated successfully.',
        actionItems: [
          'Synchronize priorities with Google Calendar',
          'Set reminder notifications for urgent deadlines',
          'Save study plan to Enermind Private Vault',
        ],
        groundedItemIds,
      };
    } catch (err: any) {
      return {
        summary: `Campus AI Advisor: ${err.message}`,
        actionItems: ['Check calendar dates manually'],
        groundedItemIds,
      };
    }
  }
}

export const geminiService = new GeminiService();
