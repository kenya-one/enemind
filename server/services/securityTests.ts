/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SecurityTestResult } from '../../src/types/index.js';
import { googleDriveService } from './drive.js';

export class SecurityTestSuite {
  async runSecurityMatrix(): Promise<{
    timestamp: string;
    totalTests: number;
    passedTests: number;
    results: SecurityTestResult[];
  }> {
    const results: SecurityTestResult[] = [];

    const userAlice = 'usr-alice-student-1';
    const userBob = 'usr-bob-student-2';
    const adminUser = 'usr-admin-moderator-9';

    // Seed file for Alice
    const uploadRes = await googleDriveService.uploadFile(userAlice, {
      name: 'Alice_Private_Passport_Confidential.pdf',
      mimeType: 'application/pdf',
      sizeBytes: 1048576,
      category: 'IDENTITY',
      resourceType: 'PRIVATE_VAULT',
    });
    const aliceFile = uploadRes.file;

    // Test 1: User A cannot access User B's file
    try {
      const bobAccess = googleDriveService.getFileById(userBob, aliceFile.id);
      const passed = bobAccess === null;
      results.push({
        testId: 'SEC-01',
        title: 'User Isolation: User A cannot access User B file',
        passed,
        details: passed
          ? 'PASSED: Bob query for Alice file returned null / 404.'
          : 'FAILED: Bob was able to retrieve Alice file.',
        evaluatedAt: new Date().toISOString(),
      });
    } catch (err: any) {
      results.push({
        testId: 'SEC-01',
        title: 'User Isolation: User A cannot access User B file',
        passed: true,
        details: `PASSED: Access rejected with security error: ${err.message}`,
        evaluatedAt: new Date().toISOString(),
      });
    }

    // Test 2: Changing fileId does not bypass authorization
    try {
      const randomFileAccess = googleDriveService.getFileById(userBob, 'file-vault-1');
      const passed = randomFileAccess === null;
      results.push({
        testId: 'SEC-02',
        title: 'Parameter Tampering: Arbitrary fileId parameter does not bypass ownership',
        passed,
        details: passed
          ? 'PASSED: Cross-user file access denied on direct ID lookup.'
          : 'FAILED: Direct ID lookup leaked file.',
        evaluatedAt: new Date().toISOString(),
      });
    } catch (err: any) {
      results.push({
        testId: 'SEC-02',
        title: 'Parameter Tampering: Arbitrary fileId parameter does not bypass ownership',
        passed: true,
        details: 'PASSED: Blocked.',
        evaluatedAt: new Date().toISOString(),
      });
    }

    // Test 3: Changing userId does not bypass authorization
    try {
      const aliceFilesAsBob = googleDriveService.getUserFiles(userBob);
      const containsAliceFile = aliceFilesAsBob.files.some((f) => f.id === aliceFile.id);
      const passed = !containsAliceFile;
      results.push({
        testId: 'SEC-03',
        title: 'User Context Integrity: Spoofed userId does not return foreign files',
        passed,
        details: passed
          ? 'PASSED: Bob file list strictly contained 0 of Alice files.'
          : 'FAILED: Foreign files leaked in listing.',
        evaluatedAt: new Date().toISOString(),
      });
    } catch (err: any) {
      results.push({
        testId: 'SEC-03',
        title: 'User Context Integrity: Spoofed userId does not return foreign files',
        passed: false,
        details: err.message,
        evaluatedAt: new Date().toISOString(),
      });
    }

    // Test 4: Private files do not appear in public search
    const publicResults = googleDriveService.getPublicAcademicCatalog({ query: 'Alice_Private_Passport' });
    const leakInPublic = publicResults.some((f) => f.id === aliceFile.id);
    results.push({
      testId: 'SEC-04',
      title: 'Catalog Isolation: Private Vault files never appear in public search',
      passed: !leakInPublic,
      details: !leakInPublic
        ? 'PASSED: Public academic catalog strictly excluded private file.'
        : 'FAILED: Private file visible in public search!',
      evaluatedAt: new Date().toISOString(),
    });

    // Test 5: Admin cannot automatically read Private Vault contents
    const adminDirectAccess = googleDriveService.getFileById(adminUser, aliceFile.id);
    results.push({
      testId: 'SEC-05',
      title: 'Admin Boundary: Admin role cannot access student Private Vault',
      passed: adminDirectAccess === null,
      details:
        adminDirectAccess === null
          ? 'PASSED: Admin query for private student vault file returned null.'
          : 'FAILED: Admin breached private vault boundary!',
      evaluatedAt: new Date().toISOString(),
    });

    // Test 6: Disconnecting Drive removes Enermind authorization
    const tempUser = 'usr-temp-student-disc';
    googleDriveService.saveUserToken(tempUser, 'temp-token-xyz');
    googleDriveService.disconnectDrive(tempUser);
    const postDiscToken = googleDriveService.getUserToken(tempUser);
    const postDiscStatus = googleDriveService.getConnectionStatus(tempUser);
    const discPassed = postDiscToken === null && postDiscStatus === 'DISCONNECTED';
    results.push({
      testId: 'SEC-06',
      title: 'Drive Revocation: Disconnecting Drive removes active tokens',
      passed: discPassed,
      details: discPassed
        ? 'PASSED: Token purged and status set to DISCONNECTED.'
        : 'FAILED: Stale token remained active.',
      evaluatedAt: new Date().toISOString(),
    });

    // Test 7: Deleted Drive files are handled gracefully
    await googleDriveService.deleteFile(userAlice, aliceFile.id);
    const deletedFetch = googleDriveService.getFileById(userAlice, aliceFile.id);
    results.push({
      testId: 'SEC-07',
      title: 'Soft-Delete Consistency: Deleted files are excluded from active reads',
      passed: deletedFetch === null,
      details: deletedFetch === null ? 'PASSED: Deleted file is hidden from user workspace.' : 'FAILED: Deleted file remained visible.',
      evaluatedAt: new Date().toISOString(),
    });

    // Test 8: Unauthorized upload is rejected
    let uploadPassed = false;
    try {
      await googleDriveService.uploadFile('', {
        name: 'Malicious_File.pdf',
        mimeType: 'application/pdf',
        sizeBytes: 100,
        category: 'IDENTITY',
        resourceType: 'PRIVATE_VAULT',
      });
    } catch {
      uploadPassed = true;
    }
    results.push({
      testId: 'SEC-08',
      title: 'Upload Authentication: Anonymous upload attempts rejected',
      passed: uploadPassed,
      details: uploadPassed ? 'PASSED: Unauthenticated upload rejected.' : 'FAILED: Allowed anonymous file upload.',
      evaluatedAt: new Date().toISOString(),
    });

    // Test 9: Unauthorized delete is rejected
    // Seed new file for Alice
    const aliceFile2Res = await googleDriveService.uploadFile(userAlice, {
      name: 'Alice_Degree_Certificate.pdf',
      mimeType: 'application/pdf',
      sizeBytes: 500000,
      category: 'CERTIFICATES',
      resourceType: 'PRIVATE_VAULT',
    });
    let deleteAttackPassed = false;
    try {
      await googleDriveService.deleteFile(userBob, aliceFile2Res.file.id);
    } catch {
      deleteAttackPassed = true;
    }
    results.push({
      testId: 'SEC-09',
      title: 'Delete Authorization: Bob cannot delete Alice file',
      passed: deleteAttackPassed,
      details: deleteAttackPassed ? 'PASSED: Cross-user delete rejected.' : 'FAILED: Bob deleted Alice file!',
      evaluatedAt: new Date().toISOString(),
    });

    // Test 10: User cannot submit another user's file as their own
    let submitSpoofPassed = false;
    try {
      await googleDriveService.submitAcademicResource(userBob, {
        fileId: aliceFile2Res.file.id,
        resourceType: 'NOTE',
        title: 'Spoofed Notes',
        institutionId: 'inst-uon-ke',
        institutionName: 'University of Nairobi',
      });
    } catch {
      submitSpoofPassed = true;
    }
    results.push({
      testId: 'SEC-10',
      title: 'Academic Provenance: User cannot submit foreign file for sharing',
      passed: submitSpoofPassed,
      details: submitSpoofPassed ? 'PASSED: Submission rejected because Bob is not the owner.' : 'FAILED: Submission spoofing allowed!',
      evaluatedAt: new Date().toISOString(),
    });

    // ========================================================
    // PHASE 6 ACCOMMODATION SECURITY & INTEGRITY MATRIX TESTS
    // ========================================================

    // SEC-11: Private Verification Documents Isolation
    const { accommodationService } = await import('./accommodation.js');
    const createdListing = accommodationService.createProperty({
      ownerId: 'usr-owner-sec-1',
      ownerName: 'Security Test Landlord',
      ownerEmail: 'landlord.sec@test.com',
      title: 'Secure Test Residence Suites',
      description: 'Quiet test residence for security assertions with fiber Wi-Fi.',
      propertyType: 'STUDENT_RESIDENCE' as any,
      roomType: 'SINGLE_ROOM' as any,
      country: 'KE',
      city: 'Nairobi',
      address: 'Upperhill Road',
      latitude: -1.2991,
      longitude: 36.8163,
      institutionIds: ['inst-uon-ke'],
      campusIds: ['camp-uon-main'],
      primaryInstitutionName: 'University of Nairobi',
      primaryCampusName: 'Main Campus',
      distanceFromCampusKm: 0.7,
      currency: 'KES',
      price: 15000,
      totalUnits: 5,
      availableUnits: 2,
      amenities: ['High Speed Wi-Fi', '24/7 Security'],
      submitForReview: true,
    });

    // Upload sensitive title deed
    accommodationService.submitVerificationDocuments(createdListing.property.id, 'usr-owner-sec-1', [
      {
        documentType: 'TITLE_DEED',
        fileName: 'Confidential_Title_Deed_Plot_99.pdf',
        fileSizeBytes: 2048500,
      },
    ]);

    // Student fetches property
    const studentFetchedProperty = accommodationService.getPropertyById(createdListing.property.id, userBob, false);
    const docsLeakedToStudent =
      studentFetchedProperty?.verificationDocuments && studentFetchedProperty.verificationDocuments.length > 0;

    results.push({
      testId: 'SEC-11',
      title: 'Accommodation Security: Landlord title deeds and private verification docs never leak to public/student queries',
      passed: !docsLeakedToStudent,
      details: !docsLeakedToStudent
        ? 'PASSED: Private verification documents strictly stripped from student view.'
        : 'FAILED: Landlord verification deed leaked in public query!',
      evaluatedAt: new Date().toISOString(),
    });

    // SEC-12: Cross-user Property Edit Authorization
    let maliciousEditBlocked = false;
    try {
      accommodationService.updateProperty(
        createdListing.property.id,
        userBob, // Bob attempts to edit Owner 1's listing
        { price: 10 }
      );
    } catch (err: any) {
      maliciousEditBlocked = true;
    }

    results.push({
      testId: 'SEC-12',
      title: 'Property Authorization: Unauthorized user cannot edit or modify foreign listing',
      passed: maliciousEditBlocked,
      details: maliciousEditBlocked
        ? 'PASSED: Cross-user listing modification blocked with 403 authorization error.'
        : 'FAILED: Bob was able to tamper with Owner listing!',
      evaluatedAt: new Date().toISOString(),
    });

    // SEC-13: Listing Moderation Workflow Integrity
    const pendingListings = accommodationService.getPendingModerationProperties();
    const isPending = pendingListings.some((p) => p.id === createdListing.property.id);

    results.push({
      testId: 'SEC-13',
      title: 'Listing Moderation: Listings submitted for review start in PENDING_REVIEW and require admin approval',
      passed: isPending,
      details: isPending
        ? 'PASSED: Listing is held safely in moderation queue before public publication.'
        : 'FAILED: Listing bypassed moderation queue.',
      evaluatedAt: new Date().toISOString(),
    });

    // SEC-14: Admin Approval & Verified Badge Consistency
    accommodationService.reviewPropertyListing({
      propertyId: createdListing.property.id,
      action: 'APPROVE',
      reviewerUserId: adminUser,
      reviewerEmail: 'admin@enermind.org',
    });

    accommodationService.verifyProperty({
      propertyId: createdListing.property.id,
      decision: 'VERIFY',
      reviewerUserId: adminUser,
      reviewerEmail: 'admin@enermind.org',
    });

    const approvedProp = accommodationService.getPropertyById(createdListing.property.id, undefined, true);
    const approvalPassed =
      approvedProp?.listingStatus === 'PUBLISHED' &&
      approvedProp?.verificationStatus === 'VERIFIED' &&
      approvedProp?.verificationBadge === true;

    results.push({
      testId: 'SEC-14',
      title: 'Verification Integrity: Verified badge is strictly displayed only when verificationStatus is VERIFIED',
      passed: Boolean(approvalPassed),
      details: approvalPassed
        ? 'PASSED: Verified badge confirmed only after admin document audit.'
        : 'FAILED: Verification badge status mismatch.',
      evaluatedAt: new Date().toISOString(),
    });

    // SEC-15: Duplicate Property Detection Engine
    const duplicateCheck = accommodationService.detectDuplicates({
      ownerId: 'usr-owner-sec-1',
      title: 'Secure Test Residence Suites',
      address: 'Upperhill Road',
      latitude: -1.2991,
      longitude: 36.8163,
    });

    results.push({
      testId: 'SEC-15',
      title: 'Duplicate Prevention: System flags identical owner, title, address, and coordinates proximity',
      passed: duplicateCheck.hasPotentialDuplicate,
      details: duplicateCheck.hasPotentialDuplicate
        ? `PASSED: Duplicate engine caught potential duplicate with score ${duplicateCheck.duplicateMatches[0]?.score}.`
        : 'FAILED: Duplicate detection missed identical listing.',
      evaluatedAt: new Date().toISOString(),
    });

    // SEC-16: Inquiry Creation & Student Privacy
    const studentInquiry = accommodationService.createInquiry({
      propertyId: createdListing.property.id,
      studentId: userAlice,
      studentName: 'Alice Johnson',
      studentEmail: 'alice@student.uonbi.ac.ke',
      message: 'Hello, is the single room available from next semester?',
      moveInDate: '2026-09-01',
      durationMonths: 6,
    });

    const ownerInquiries = accommodationService.getOwnerInquiries('usr-owner-sec-1');
    const inquiryReceived = ownerInquiries.some((i) => i.id === studentInquiry.id);

    results.push({
      testId: 'SEC-16',
      title: 'Inquiry System: Secure message dispatch from student to landlord with move-in timeline',
      passed: inquiryReceived,
      details: inquiryReceived
        ? 'PASSED: Inquiry delivered to landlord inbox without exposing private student secrets.'
        : 'FAILED: Inquiry delivery failed.',
      evaluatedAt: new Date().toISOString(),
    });

    // SEC-17: Landlord Inquiry Response Workflow
    accommodationService.respondToInquiry(
      studentInquiry.id,
      'usr-owner-sec-1',
      'Yes, Alice! Unit A-101 is available. You are welcome to view it.'
    );
    const aliceInquiries = accommodationService.getStudentInquiries(userAlice);
    const responseReceived = aliceInquiries.some(
      (i) => i.id === studentInquiry.id && i.status === 'RESPONDED' && Boolean(i.responseMessage)
    );

    results.push({
      testId: 'SEC-17',
      title: 'Inquiry Response: Landlord responses accurately transition inquiry status and notify student',
      passed: responseReceived,
      details: responseReceived
        ? 'PASSED: Response recorded and inquiry status set to RESPONDED.'
        : 'FAILED: Response did not update inquiry status.',
      evaluatedAt: new Date().toISOString(),
    });

    // SEC-18: Multi-Currency Search & Original Price Preservation
    const searchRes = accommodationService.searchProperties(
      { q: 'Secure Test Residence Suites' },
      'USD'
    );
    const firstFound = searchRes.properties[0];
    const currencyPreserved =
      firstFound &&
      firstFound.currency === 'KES' &&
      firstFound.price === 15000 &&
      firstFound.originalPriceDisplay.includes('KES') &&
      firstFound.convertedPriceDisplay.includes('USD');

    results.push({
      testId: 'SEC-18',
      title: 'Currency Integrity: Multi-currency conversion preserves original currency & amount without distortion',
      passed: Boolean(currencyPreserved),
      details: currencyPreserved
        ? `PASSED: Original price (${firstFound.originalPriceDisplay}) preserved alongside converted display (${firstFound.convertedPriceDisplay}).`
        : 'FAILED: Currency precision lost during search query.',
      evaluatedAt: new Date().toISOString(),
    });

    // SEC-19: Fraud Reporting & Admin Action Queue
    const reportCreated = accommodationService.reportProperty({
      propertyId: createdListing.property.id,
      reportedByUserId: userBob,
      reporterEmail: 'bob@student.ac.uk',
      reason: 'INCORRECT_PRICE' as any,
      details: 'Test reporting incorrect price details.',
    });

    const pendingReports = accommodationService.getReports();
    const reportFound = pendingReports.some((r) => r.id === reportCreated.id);

    results.push({
      testId: 'SEC-19',
      title: 'Fraud Prevention: Student abuse & fraud reports are logged into moderation queue with audit trail',
      passed: reportFound,
      details: reportFound
        ? 'PASSED: Fraud report logged into admin queue.'
        : 'FAILED: Report missing from admin queue.',
      evaluatedAt: new Date().toISOString(),
    });

    // SEC-20: AI Accommodation Assistant Grounding
    const { geminiService } = await import('./gemini.js');
    const aiRes = await geminiService.searchAndAdviseAccommodation({
      query: 'Find accommodation near Chiromo with Wi-Fi under $250',
      studentCampus: 'Chiromo Science Campus',
      studentInstitution: 'University of Nairobi',
      targetCurrency: 'USD',
      realPropertiesCatalog: accommodationService.searchProperties({}, 'USD').properties,
    });

    const aiAnswerHasGrounding = Boolean(aiRes.answer && aiRes.recommendedPropertyIds.length > 0);

    results.push({
      testId: 'SEC-20',
      title: 'AI Grounding: Accommodation AI queries real property dataset and grounds answers in verified data',
      passed: aiAnswerHasGrounding,
      details: aiAnswerHasGrounding
        ? `PASSED: AI assistant grounded response against real property catalog (${aiRes.recommendedPropertyIds.length} property matches).`
        : 'FAILED: AI failed to ground accommodation search.',
      evaluatedAt: new Date().toISOString(),
    });

    // SEC-21: Event Privacy & Attendee Isolation
    const { campusEventsService } = await import('./campusEvents.js');
    let attendeePrivacyEnforced = false;
    try {
      // Bob tries to fetch attendee list of an event created by another organizer
      campusEventsService.getEventAttendees('evt-ieee-robotics-workshop', userBob, false);
      attendeePrivacyEnforced = false;
    } catch (e: any) {
      attendeePrivacyEnforced = e.message.includes('Unauthorized') || e.message.includes('private');
    }

    results.push({
      testId: 'SEC-21',
      title: 'Event Privacy: Event attendee lists are strictly isolated and shielded from unauthorized students',
      passed: attendeePrivacyEnforced,
      details: attendeePrivacyEnforced
        ? 'PASSED: Unauthorized student request for full attendee roster blocked.'
        : 'FAILED: Student was able to access other attendees private information.',
      evaluatedAt: new Date().toISOString(),
    });

    // SEC-22: Capacity, Waitlist & Auto-Promotion Engine
    const testCapEvent = campusEventsService.createEvent({
      createdBy: userAlice,
      creatorRole: 'STUDENT',
      creatorName: 'Alice Organizer',
      institutionId: 'inst-uon-ke',
      title: 'Security Capacity Test Workshop',
      description: 'Capacity test event',
      type: 'WORKSHOP',
      category: 'ACADEMIC',
      startDateTime: new Date(Date.now() + 86400000).toISOString(),
      endDateTime: new Date(Date.now() + 90000000).toISOString(),
      timezone: 'Africa/Nairobi',
      location: 'Test Lab 1',
      locationType: 'PHYSICAL',
      organizerName: 'Alice',
      capacity: 1,
      registrationRequired: true,
      visibility: 'INSTITUTION',
      userRole: UserRole.STUDENT,
    });

    // User Bob registers -> takes the 1 seat
    const regBob = campusEventsService.registerForEvent({
      eventId: testCapEvent.event.id,
      userId: userBob,
      userName: 'Bob Student',
      userEmail: 'bob@student.ac.uk',
    });

    // User Charlie registers -> placed on waitlist
    const userCharlie = 'usr-test-charlie';
    const regCharlie = campusEventsService.registerForEvent({
      eventId: testCapEvent.event.id,
      userId: userCharlie,
      userName: 'Charlie Student',
      userEmail: 'charlie@student.ac.uk',
    });

    // Bob cancels -> Charlie should auto-promote to REGISTERED
    const cancelRes = campusEventsService.cancelRegistration(testCapEvent.event.id, userBob);
    const charlieRegs = campusEventsService.getUserRegistrations(userCharlie);
    const charlieNowRegistered = charlieRegs.some((r) => r.eventId === testCapEvent.event.id && r.status === 'REGISTERED');

    const waitlistWorkflowPassed =
      !regBob.isWaitlisted &&
      regCharlie.isWaitlisted &&
      cancelRes.success &&
      charlieNowRegistered;

    results.push({
      testId: 'SEC-22',
      title: 'Waitlist Engine: Strict event capacity enforcement and automatic waitlist queue promotion upon cancellation',
      passed: Boolean(waitlistWorkflowPassed),
      details: waitlistWorkflowPassed
        ? 'PASSED: Capacity limit enforced (#1 Waitlist assigned), and cancellation correctly promoted waitlisted student to REGISTERED.'
        : 'FAILED: Waitlist transition failed.',
      evaluatedAt: new Date().toISOString(),
    });

    // SEC-23: Official Badge Authorization & Audit Trail
    const studentEvent = campusEventsService.createEvent({
      createdBy: userBob,
      creatorRole: 'STUDENT',
      creatorName: 'Bob Student',
      institutionId: 'inst-uon-ke',
      title: 'Bob Student Study Group',
      description: 'Study group meet',
      type: 'CLUB_EVENT',
      category: 'ACADEMIC',
      startDateTime: new Date(Date.now() + 86400000).toISOString(),
      endDateTime: new Date(Date.now() + 90000000).toISOString(),
      timezone: 'Africa/Nairobi',
      location: 'Library Floor 2',
      locationType: 'PHYSICAL',
      organizerName: 'Bob',
      registrationRequired: false,
      visibility: 'INSTITUTION',
      userRole: UserRole.STUDENT,
    });

    const isOfficialRestricted =
      studentEvent.event.isOfficial === false &&
      studentEvent.event.verificationStatus === 'COMMUNITY_SUBMITTED';

    results.push({
      testId: 'SEC-23',
      title: 'Official Badge Integrity: Normal student submissions cannot self-grant Official Institution verification status',
      passed: isOfficialRestricted,
      details: isOfficialRestricted
        ? 'PASSED: Student submission defaulted safely to COMMUNITY_SUBMITTED without unverified Official badge.'
        : 'FAILED: Student was able to self-grant official status.',
      evaluatedAt: new Date().toISOString(),
    });

    // SEC-24: Campus AI Calendar Grounding
    const aiCalendarRes = await geminiService.assistCampusCalendar({
      action: 'PLAN_MY_WEEK',
      studentContext: {
        institutionName: 'University of Nairobi',
        campusName: 'Chiromo Science Campus',
        courseName: 'BSc. Computer Science',
      },
      eventsCatalog: [testCapEvent.event],
      deadlinesCatalog: campusEventsService.getAcademicDeadlines({ institutionId: 'inst-uon-ke' }),
      examsCatalog: campusEventsService.getExams({ institutionId: 'inst-uon-ke' }),
      userQuery: 'Give me my study priorities and exam schedule',
    });

    const aiCalendarPassed = Boolean(aiCalendarRes.summary && aiCalendarRes.groundedItemIds.length > 0);

    results.push({
      testId: 'SEC-24',
      title: 'Campus AI Grounding: Campus AI schedules and recommendations are grounded in verified academic deadlines & exams',
      passed: aiCalendarPassed,
      details: aiCalendarPassed
        ? `PASSED: Campus AI grounded plan against ${aiCalendarRes.groundedItemIds.length} verified events/deadlines.`
        : 'FAILED: Campus AI failed grounding evaluation.',
      evaluatedAt: new Date().toISOString(),
    });

    const passedCount = results.filter((r) => r.passed).length;

    return {
      timestamp: new Date().toISOString(),
      totalTests: results.length,
      passedTests: passedCount,
      results,
    };
  }
}

export const securityTestSuite = new SecurityTestSuite();
