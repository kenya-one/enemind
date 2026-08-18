/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AuditLogEntry, InstitutionStatus, UserRole } from '../../src/types/index.js';
import { institutionService } from './institutions.js';
import { orderAndListingService } from './orders.js';
import { authService } from './auth.js';

class AdminService {
  private auditLogs: AuditLogEntry[] = [];

  constructor() {
    this.logAction({
      actorUserId: 'system',
      actorEmail: 'system@enermind.org',
      actorRole: UserRole.SUPER_ADMIN,
      action: 'SYSTEM_INITIALIZATION',
      targetType: 'PLATFORM',
      targetId: 'global',
      details: 'Enermind Platform backend service initialized successfully.',
    });
  }

  logAction(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) {
    const log: AuditLogEntry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      ...entry,
    };
    this.auditLogs.unshift(log);
    // Keep max 500 logs in memory
    if (this.auditLogs.length > 500) {
      this.auditLogs.pop();
    }
  }

  getAuditLogs(limit: number = 50): AuditLogEntry[] {
    return this.auditLogs.slice(0, limit);
  }

  getOverviewStats() {
    const pendingInstitutions = institutionService.getAllInstitutions(undefined, InstitutionStatus.PENDING);
    const approvedInstitutions = institutionService.getAllInstitutions(undefined, InstitutionStatus.APPROVED);
    const pendingCampuses = institutionService.getCampusSubmissions(InstitutionStatus.PENDING);
    const allOrders = orderAndListingService.getAllOrders();
    const totalPaidRevenueUSD = allOrders
      .filter((o) => o.status === 'PAID')
      .reduce((sum, o) => sum + (o.originalCurrency === 'USD' ? o.originalAmount : o.originalAmount * 0.0077), 0);

    return {
      institutions: {
        total: approvedInstitutions.length + pendingInstitutions.length,
        approved: approvedInstitutions.length,
        pending: pendingInstitutions.length,
        pendingCampuses: pendingCampuses.length,
      },
      users: {
        total: 1420,
        activeToday: 384,
      },
      auditLogsCount: this.auditLogs.length,
      totalOrders: allOrders.length,
      paidOrdersCount: allOrders.filter((o) => o.status === 'PAID').length,
      estimatedRevenueUSD: Number(totalPaidRevenueUSD.toFixed(2)),
      activeAccommodationListings: orderAndListingService.getAccommodation().length,
      activeOpportunities: orderAndListingService.getOpportunities().length,
      activeGigs: orderAndListingService.getGigs().length,
      activeMarketplaceItems: orderAndListingService.getMarketplace().length,
    };
  }

  reviewInstitution(params: {
    institutionId: string;
    newStatus: InstitutionStatus;
    reviewerUserId: string;
    reviewerEmail: string;
    reviewerNotes?: string;
    targetMergeId?: string;
  }) {
    const updated = institutionService.moderateInstitution(
      params.institutionId,
      params.newStatus,
      params.reviewerNotes,
      params.targetMergeId
    );

    if (updated) {
      this.logAction({
        actorUserId: params.reviewerUserId,
        actorEmail: params.reviewerEmail,
        actorRole: UserRole.ADMIN,
        action: `INSTITUTION_${params.newStatus}`,
        targetType: 'INSTITUTION',
        targetId: params.institutionId,
        details: `Institution "${updated.name}" review updated to ${params.newStatus}. Notes: ${params.reviewerNotes || 'None'}`,
      });
    }
    return updated;
  }

  reviewCampus(params: {
    submissionId: string;
    action: 'APPROVE' | 'REJECT';
    reviewerUserId: string;
    reviewerEmail: string;
  }) {
    const res = institutionService.reviewCampusSubmission(params.submissionId, params.action);
    if (res.success) {
      this.logAction({
        actorUserId: params.reviewerUserId,
        actorEmail: params.reviewerEmail,
        actorRole: UserRole.ADMIN,
        action: `CAMPUS_${params.action}`,
        targetType: 'CAMPUS',
        targetId: params.submissionId,
        details: `Campus submission ${params.submissionId} was ${params.action}D.`,
      });
    }
    return res;
  }
}

export const adminService = new AdminService();
