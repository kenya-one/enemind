import { SheetEntry, UserProfile } from '../types';
import { INITIAL_USER_SHEETS } from './mockData';

const LOCAL_STORAGE_KEY_SHEETS = 'enemind_user_sheets_v1';

export class DriveSheetsService {
  private static sheetsData: Record<string, SheetEntry[]> = {};

  static init() {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY_SHEETS);
      if (stored) {
        this.sheetsData = JSON.parse(stored);
      } else {
        this.sheetsData = INITIAL_USER_SHEETS;
        this.save();
      }
    } catch {
      this.sheetsData = INITIAL_USER_SHEETS;
    }
  }

  private static save() {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_SHEETS, JSON.stringify(this.sheetsData));
    } catch (e) {
      console.warn('Unable to persist sheets to localStorage', e);
    }
  }

  static getSheetsForUser(user: UserProfile): SheetEntry[] {
    if (!this.sheetsData[user.id]) {
      // Auto-provision sheets based on account type
      this.sheetsData[user.id] = this.createDefaultSheetsForAccountType(user);
      this.save();
    }
    return this.sheetsData[user.id];
  }

  static createDefaultSheetsForAccountType(user: UserProfile): SheetEntry[] {
    const now = new Date().toLocaleDateString('en-GB', { hour: '2-digit', minute: '2-digit' }) + ' EAT';
    switch (user.accountType) {
      case 'company':
        return [
          { sheetName: 'Catalogue', rowCount: 1, lastModified: now, syncStatus: 'synced', columns: ['Item_ID', 'Title', 'Category', 'Price_KES', 'In_Stock'], sampleRows: [] },
          { sheetName: 'Sales', rowCount: 0, lastModified: now, syncStatus: 'synced', columns: ['Order_ID', 'Customer_Name', 'Amount_KES', 'Status'], sampleRows: [] },
          { sheetName: 'Jobs', rowCount: 0, lastModified: now, syncStatus: 'synced', columns: ['Job_ID', 'Title', 'Location', 'Deadline'], sampleRows: [] },
          { sheetName: 'Notices_Policies', rowCount: 1, lastModified: now, syncStatus: 'synced', columns: ['Policy_Title', 'Summary'], sampleRows: [] }
        ];
      case 'school':
        return [
          { sheetName: 'Students', rowCount: 0, lastModified: now, syncStatus: 'synced', columns: ['Admin_No', 'Student_Name', 'Grade_Class', 'Parent_Email'], sampleRows: [] },
          { sheetName: 'Marks', rowCount: 0, lastModified: now, syncStatus: 'synced', columns: ['Student_ID', 'Name', 'Subject', 'Term', 'Assessment', 'Rating'], sampleRows: [] },
          { sheetName: 'Notices', rowCount: 0, lastModified: now, syncStatus: 'synced', columns: ['Notice_ID', 'Title', 'Date', 'Body'], sampleRows: [] },
          { sheetName: 'Jobs', rowCount: 0, lastModified: now, syncStatus: 'synced', columns: ['Job_ID', 'Title', 'Deadline'], sampleRows: [] },
          { sheetName: 'Approved_Materials', rowCount: 0, lastModified: now, syncStatus: 'synced', columns: ['Material_ID', 'Subject', 'Grade', 'Link'], sampleRows: [] }
        ];
      case 'landlord':
        return [
          { sheetName: 'Properties', rowCount: 0, lastModified: now, syncStatus: 'synced', columns: ['Property_ID', 'Name', 'Location', 'Rent_KES', 'Vacant_Units'], sampleRows: [] },
          { sheetName: 'Units', rowCount: 0, lastModified: now, syncStatus: 'synced', columns: ['Unit_No', 'Floor', 'Status', 'Tenant_Name'], sampleRows: [] },
          { sheetName: 'Bookings', rowCount: 0, lastModified: now, syncStatus: 'synced', columns: ['Booking_ID', 'Tenant_Name', 'Deposit_Status'], sampleRows: [] },
          { sheetName: 'Payments', rowCount: 0, lastModified: now, syncStatus: 'synced', columns: ['Payment_ID', 'Amount_KES', 'Renter_Confirmed', 'Landlord_Confirmed'], sampleRows: [] },
          { sheetName: 'Sessions', rowCount: 0, lastModified: now, syncStatus: 'synced', columns: ['Session_ID', 'Mode', 'Scheduled_Time', 'YouTube_Live_URL'], sampleRows: [] }
        ];
      case 'dealer':
        return [
          { sheetName: 'Products', rowCount: 0, lastModified: now, syncStatus: 'synced', columns: ['Item_ID', 'Title', 'Category', 'Price_KES', 'Stock_Status', 'Unit_Type'], sampleRows: [] },
          { sheetName: 'Locations', rowCount: 1, lastModified: now, syncStatus: 'synced', columns: ['Branch_ID', 'Name', 'Address', 'Phone'], sampleRows: [{ Branch_ID: 'BR-1', Name: 'Main Shop', Address: user.location || 'Nairobi', Phone: user.phone || '+254700000000' }] },
          { sheetName: 'Sales', rowCount: 0, lastModified: now, syncStatus: 'synced', columns: ['Order_ID', 'Buyer_Name', 'Item', 'Total_KES'], sampleRows: [] }
        ];
      case 'student':
      default:
        return [
          { sheetName: 'Notes_Pastpapers', rowCount: 0, lastModified: now, syncStatus: 'synced', columns: ['Doc_ID', 'Title', 'Subject', 'Price_KES', 'Drive_Link'], sampleRows: [] },
          { sheetName: 'Stories', rowCount: 0, lastModified: now, syncStatus: 'synced', columns: ['Story_ID', 'Title', 'Genre', 'Word_Count'], sampleRows: [] },
          { sheetName: 'Earnings', rowCount: 0, lastModified: now, syncStatus: 'synced', columns: ['Txn_ID', 'Item_Sold', 'Gross_KES', 'Enemind_15Pct_Cut_KES', 'Net_Earnings_KES'], sampleRows: [] }
        ];
    }
  }

  static addRowToSheet(userId: string, sheetName: string, rowData: Record<string, any>) {
    if (!this.sheetsData[userId]) return;
    const sheet = this.sheetsData[userId].find((s) => s.sheetName.toLowerCase() === sheetName.toLowerCase());
    if (sheet) {
      sheet.sampleRows.unshift(rowData);
      sheet.rowCount += 1;
      sheet.lastModified = new Date().toLocaleDateString('en-GB', { hour: '2-digit', minute: '2-digit' }) + ' EAT';
      sheet.syncStatus = 'synced';
      this.save();
    }
  }

  static syncAllUserSheets(userId: string): Promise<{ syncedSheets: number; totalRows: number }> {
    return new Promise((resolve) => {
      const sheets = this.sheetsData[userId] || [];
      sheets.forEach((s) => {
        s.syncStatus = 'syncing';
      });
      this.save();

      setTimeout(() => {
        let totalRows = 0;
        sheets.forEach((s) => {
          s.syncStatus = 'synced';
          s.lastModified = new Date().toLocaleDateString('en-GB', { hour: '2-digit', minute: '2-digit' }) + ' EAT';
          totalRows += s.rowCount;
        });
        this.save();
        resolve({ syncedSheets: sheets.length, totalRows });
      }, 700);
    });
  }
}

DriveSheetsService.init();
