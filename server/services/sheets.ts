/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SheetCategory, SheetProduct } from '../../src/types/index.js';

export const INITIAL_SHEET_PRODUCTS: SheetProduct[] = [
  {
    id: 'sheet-student-budget-master',
    name: 'University Student Master Budget & Expense Tracker',
    tagline: 'Track allowances, part-time income, hostel rent, food, and semester savings automatically.',
    description: 'Comprehensive multi-currency Google Sheet built specifically for campus living. Includes automated monthly cashflow graphs, grocery allocation formulas, and semester savings goals.',
    category: SheetCategory.STUDENT,
    price: 0,
    currency: 'USD',
    isFree: true,
    features: ['Semester Cash Flow Dashboard', 'Daily Expense Log with Categories', 'Hostel & Utility Split Calculator', 'Automated Pie & Bar Charts'],
    tabCount: 4,
    version: '2.1.0',
    author: 'Enermind Finance Lab',
    downloadsCount: 1420,
    rating: 4.9,
    createdDate: new Date('2025-01-10').toISOString(),
    updatedDate: new Date('2025-01-10').toISOString(),
  },
  {
    id: 'sheet-gpa-course-planner',
    name: 'Academic GPA Calculator & Assignment Kanban Sheet',
    tagline: 'Keep track of course credits, assignment deadlines, exam weights, and cumulative GPA projection.',
    description: 'Designed for high-achieving students across 3-year, 4-year, and 5-year degree programs. Calculates weighted grade averages and predicts required exam scores to reach Dean’s List status.',
    category: SheetCategory.STUDENT,
    price: 0,
    currency: 'USD',
    isFree: true,
    features: ['Weighted GPA Formula Matrix', 'Exam Score Target Simulator', 'Assignment Due Date Countdown', 'Course Credit Tracker'],
    tabCount: 3,
    version: '1.4.0',
    author: 'Enermind Academic Division',
    downloadsCount: 2380,
    rating: 4.95,
    createdDate: new Date('2025-01-12').toISOString(),
    updatedDate: new Date('2025-01-12').toISOString(),
  },
  {
    id: 'sheet-campus-sidehustle-crm',
    name: 'Student Freelancer & Campus Business Mini-CRM',
    tagline: 'Manage client leads, order fulfillment, invoicing, and profit margins on campus.',
    description: 'Perfect for students offering graphic design, tutoring, baking, electronics repairs, or photography on campus. Generates auto-calculating client quotes and payment tracking.',
    category: SheetCategory.BUSINESS,
    price: 5.0,
    currency: 'USD',
    isFree: false,
    features: ['Client Pipeline Tracker', 'Invoice & Receipt Template Tab', 'Cost vs Profit Margin Analysis', 'PesaPal Payment Status Log'],
    tabCount: 5,
    version: '3.0.0',
    author: 'Enermind Commerce',
    downloadsCount: 890,
    rating: 4.85,
    createdDate: new Date('2025-01-18').toISOString(),
    updatedDate: new Date('2025-01-18').toISOString(),
  },
  {
    id: 'sheet-hostel-property-manager',
    name: 'Student Accommodation & Tenant Manager',
    tagline: 'Manage room vacancies, tenant deposits, monthly rent collections, and maintenance requests.',
    description: 'Built for campus hostels, private student apartments, and property caretakers. Features vacancy dashboards and automatic reminder formulas.',
    category: SheetCategory.PROPERTY,
    price: 12.0,
    currency: 'USD',
    isFree: false,
    features: ['Room Vacancy Matrix', 'Deposit & Rent Ledger', 'Maintenance Ticket Pipeline', 'Monthly Revenue Summary'],
    tabCount: 6,
    version: '2.0.0',
    author: 'Enermind Housing Guild',
    downloadsCount: 420,
    rating: 4.78,
    createdDate: new Date('2025-01-20').toISOString(),
    updatedDate: new Date('2025-01-20').toISOString(),
  },
  {
    id: 'sheet-agri-farm-tracker',
    name: 'Smallholder Crop & Poultry Farm Manager',
    tagline: 'Track input costs, planting schedules, feed consumption, and harvest yields.',
    description: 'Designed for young student agri-preneurs and cooperative farm projects. Includes feed-to-egg ratios, fertilizer batch costs, and wholesale revenue tracking.',
    category: SheetCategory.AGRICULTURE,
    price: 8.0,
    currency: 'USD',
    isFree: false,
    features: ['Planting & Harvest Calendar', 'Feed & Medicine Cost Tracker', 'Yield vs Market Price Calculator', 'Profit & Loss Statement'],
    tabCount: 5,
    version: '1.2.0',
    author: 'Enermind AgriTech',
    downloadsCount: 310,
    rating: 4.88,
    createdDate: new Date('2025-01-25').toISOString(),
    updatedDate: new Date('2025-01-25').toISOString(),
  },
];

export class GoogleSheetsService {
  private products: Map<string, SheetProduct> = new Map();

  constructor() {
    for (const prod of INITIAL_SHEET_PRODUCTS) {
      this.products.set(prod.id, prod);
    }
  }

  getAllProducts(category?: SheetCategory): SheetProduct[] {
    const list = Array.from(this.products.values());
    if (category) {
      return list.filter((p) => p.category === category);
    }
    return list;
  }

  getProductById(id: string): SheetProduct | undefined {
    return this.products.get(id);
  }

  /**
   * Structure payload for creating a spreadsheet in user's Google Drive via Sheets API
   */
  getTemplateStructure(templateId: string) {
    const product = this.getProductById(templateId);
    if (!product) return null;

    return {
      title: `Enermind - ${product.name}`,
      properties: {
        title: `Enermind - ${product.name}`,
        locale: 'en',
        autoRecalc: 'ON_CHANGE',
      },
      sheets: [
        {
          properties: {
            title: 'Overview & Dashboard',
            gridProperties: { rowCount: 100, columnCount: 20 },
          },
        },
        {
          properties: {
            title: 'Data Input & Logs',
            gridProperties: { rowCount: 500, columnCount: 15 },
          },
        },
        {
          properties: {
            title: 'Summary & Visualizations',
            gridProperties: { rowCount: 100, columnCount: 20 },
          },
        },
      ],
    };
  }
}

export const googleSheetsService = new GoogleSheetsService();
