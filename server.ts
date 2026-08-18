/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { config } from './server/config.js';
import { authService } from './server/services/auth.js';
import { institutionService, GLOBAL_COUNTRIES } from './server/services/institutions.js';
import { currencyService } from './server/services/currency.js';
import { geminiService } from './server/services/gemini.js';
import { pesapalService } from './server/services/pesapal.js';
import { googleDriveService, PRIVATE_VAULT_CATEGORIES } from './server/services/drive.js';
import { documentAiService } from './server/services/documentAi.js';
import { securityTestSuite } from './server/services/securityTests.js';
import { googleSheetsService } from './server/services/sheets.js';
import { orderAndListingService } from './server/services/orders.js';
import { accommodationService } from './server/services/accommodation.js';
import { opportunitiesService } from './server/services/opportunities.js';
import { tasksService } from './server/services/tasks.js';
import { campusEventsService } from './server/services/campusEvents.js';
import { adminService } from './server/services/admin.js';
import { InstitutionStatus, ServiceConfigStatus, UserRole } from './src/types/index.js';

function getRedirectUri(req: express.Request): string {
  if (config.google.redirectUri && config.google.redirectUri.trim().length > 0) {
    return config.google.redirectUri;
  }
  const appUrl = config.google.appUrl || `http://${req.headers.host || 'localhost:3000'}`;
  return `${appUrl.replace(/\/$/, '')}/api/auth/google/callback`;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON & URL-encoded parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // ==========================================
  // 1. HEALTH & SYSTEM CONFIGURATION
  // ==========================================

  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'Enermind Global Campus Platform',
      version: '2.0.0',
      timestamp: new Date().toISOString(),
    });
  });

  app.get('/api/config/status', (req, res) => {
    const statuses: ServiceConfigStatus[] = [
      {
        serviceName: 'Gemini AI Engine',
        identifier: 'gemini',
        isConfigured: geminiService.isConfigured(),
        requiresSetup: !geminiService.isConfigured(),
        environment: 'Server-Side (@google/genai)',
        details: geminiService.isConfigured()
          ? 'Gemini 3.7 Flash model ready for multi-category campus reasoning and sheet generation.'
          : 'GEMINI_API_KEY environment variable is required in AI Studio Settings > Secrets.',
      },
      {
        serviceName: 'Google Workspace & OAuth 2.0',
        identifier: 'google_oauth',
        isConfigured: config.google.isConfigured,
        requiresSetup: !config.google.isConfigured,
        environment: 'Server & Client OAuth 2.0',
        details: config.google.isConfigured
          ? 'Google OAuth 2.0 configured with server-side token exchange and stable subject ID mapping.'
          : 'GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are required in environment variables for live Google OAuth.',
      },
      {
        serviceName: 'Google Drive Private Vault & Storage',
        identifier: 'google_drive',
        isConfigured: true,
        requiresSetup: false,
        environment: 'User-Owned Google Drive',
        details: 'Enermind/ folder structure prepared: Academic/, Private Vault/, Sheets/, Receipts/.',
      },
      {
        serviceName: 'Google Sheets Integration Engine',
        identifier: 'google_sheets',
        isConfigured: true,
        requiresSetup: false,
        environment: 'Google Sheets REST v4 API',
        details: 'Template injection, multi-tab layout builder, and formula engine initialized.',
      },
      {
        serviceName: 'PesaPal v3 Global Payments',
        identifier: 'pesapal',
        isConfigured: pesapalService.isConfigured(),
        requiresSetup: !pesapalService.isConfigured(),
        environment: pesapalService.getEnvironment().toUpperCase(),
        details: pesapalService.isConfigured()
          ? `Connected to PesaPal ${pesapalService.getEnvironment()} API with server-side bearer token authentication.`
          : 'PESAPAL_CONSUMER_KEY and PESAPAL_CONSUMER_SECRET are required for live transaction execution.',
      },
      {
        serviceName: 'Multi-Currency Exchange Service',
        identifier: 'currency',
        isConfigured: true,
        requiresSetup: false,
        environment: 'Central Rate Matrix (Base: USD)',
        details: 'Real-time multi-currency conversions across USD, GBP, EUR, KES, NGN, ZAR, CAD, AUD, INR.',
      },
    ];

    res.json({
      platform: 'Enermind',
      environment: process.env.NODE_ENV || 'development',
      services: statuses,
    });
  });

  // ==========================================
  // 2. AUTHENTICATION & USER PROFILE
  // ==========================================

  app.get('/api/auth/session', (req, res) => {
    const user = authService.getActiveUser();
    res.json({ user });
  });

  app.get('/api/auth/google/url', (req, res) => {
    const redirectUri = getRedirectUri(req);
    const { url, isConfigured } = authService.getGoogleAuthUrl(redirectUri);

    res.json({
      url,
      isConfigured,
      redirectUri,
      message: isConfigured
        ? 'Google OAuth URL generated successfully.'
        : 'Google OAuth credentials (GOOGLE_CLIENT_ID) not configured in environment.',
    });
  });

  // OAuth Callback Route (renders popup postMessage script)
  app.get('/api/auth/google/callback', async (req, res) => {
    const code = req.query.code as string | undefined;
    const error = req.query.error as string | undefined;
    const redirectUri = getRedirectUri(req);

    if (error) {
      return res.send(`
        <!DOCTYPE html>
        <html>
          <body style="font-family: sans-serif; background: #0A0B10; color: #fff; text-align: center; padding: 40px;">
            <h3>Google Authentication Cancelled or Failed</h3>
            <p style="color: #888;">${error}</p>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: 'OAUTH_AUTH_ERROR', error: '${error}' }, '*');
                setTimeout(() => window.close(), 1500);
              }
            </script>
          </body>
        </html>
      `);
    }

    if (!code) {
      return res.status(400).send('Authorization code missing');
    }

    const exchangeRes = await authService.exchangeCodeForGoogleUser(code, redirectUri);
    if (!exchangeRes.success || !exchangeRes.googleUser) {
      return res.send(`
        <!DOCTYPE html>
        <html>
          <body style="font-family: sans-serif; background: #0A0B10; color: #fff; text-align: center; padding: 40px;">
            <h3>Authentication Error</h3>
            <p style="color: #ff6b6b;">${exchangeRes.error || 'Token exchange failed'}</p>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: 'OAUTH_AUTH_ERROR', error: '${exchangeRes.error || 'Exchange failed'}' }, '*');
                setTimeout(() => window.close(), 2000);
              }
            </script>
          </body>
        </html>
      `);
    }

    const { user, isNewUser } = await authService.getOrCreateUserFromGoogle(exchangeRes.googleUser);

    res.send(`
      <!DOCTYPE html>
      <html>
        <body style="font-family: sans-serif; background: #0A0B10; color: #fff; text-align: center; padding: 40px;">
          <h3 style="color: #50E3C2;">Authentication Successful</h3>
          <p style="color: #aaa;">Welcome, ${user.displayName}! Connecting your campus workspace...</p>
          <script>
            if (window.opener) {
              window.opener.postMessage({
                type: 'OAUTH_AUTH_SUCCESS',
                user: ${JSON.stringify(user)},
                isNewUser: ${isNewUser}
              }, '*');
              window.close();
            } else {
              window.location.href = '/';
            }
          </script>
        </body>
      </html>
    `);
  });

  app.post('/api/auth/logout', (req, res) => {
    authService.setActiveUser(null);
    res.json({ success: true, message: 'Logged out successfully.' });
  });

  app.post('/api/auth/login', (req, res) => {
    const { identifier, password } = req.body;
    const result = authService.loginWithCredentials(identifier, password);
    if (!result.success) {
      return res.status(400).json({ error: result.error || 'Login failed' });
    }
    res.json({ success: true, user: result.user });
  });

  app.post('/api/auth/signup', (req, res) => {
    const result = authService.signupUser(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error || 'Signup failed' });
    }
    res.json({ success: true, user: result.user });
  });

  app.get('/api/auth/demo-accounts', (req, res) => {
    const demos = authService.getDemoAccounts();
    res.json({ accounts: demos });
  });

  app.post('/api/auth/switch-user', (req, res) => {
    const { userId } = req.body;
    const user = authService.switchUser(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ success: true, user });
  });

  app.post('/api/auth/verify-google-token', async (req, res) => {
    const { token } = req.body;
    const result = await authService.verifyGoogleToken(token);
    if (!result.valid) {
      return res.status(401).json({ error: result.error || 'Token verification failed' });
    }

    const { user } = await authService.getOrCreateUserFromGoogle({
      sub: result.sub || `sub-${Date.now()}`,
      email: result.email!,
      name: result.name || 'Enermind Student',
      picture: result.picture,
    });

    res.json({ success: true, user });
  });

  app.post('/api/auth/profile', (req, res) => {
    const { userId, updates } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const updated = authService.updateUserProfile(userId, updates);
    if (!updated) {
      return res.status(404).json({ error: 'User not found' });
    }

    adminService.logAction({
      actorUserId: updated.id,
      actorEmail: updated.email,
      actorRole: updated.role,
      action: 'USER_PROFILE_UPDATE',
      targetType: 'USER',
      targetId: updated.id,
      details: `User updated profile (Onboarding: ${updated.onboardingCompleted ? 'Complete' : 'In Progress'}). Institution: ${updated.institutionName || 'None'}`,
    });

    res.json({ success: true, user: updated });
  });

  // ==========================================
  // 3. GLOBAL INSTITUTIONS & ONBOARDING
  // ==========================================

  app.get('/api/countries', (req, res) => {
    res.json({ countries: GLOBAL_COUNTRIES });
  });

  app.get('/api/institutions', (req, res) => {
    const countryCode = req.query.countryCode as string | undefined;
    const status = (req.query.status as InstitutionStatus) || InstitutionStatus.APPROVED;
    const institutions = institutionService.getAllInstitutions(countryCode, status);
    res.json({ institutions });
  });

  app.get('/api/institutions/search', (req, res) => {
    const q = (req.query.q as string) || '';
    const countryCode = req.query.countryCode as string | undefined;
    const results = institutionService.searchInstitutions(q, countryCode);
    res.json({ results });
  });

  app.get('/api/institutions/check-duplicates', (req, res) => {
    const name = (req.query.name as string) || '';
    const countryCode = (req.query.countryCode as string) || 'KE';
    const result = institutionService.checkDuplicates(name, countryCode);
    res.json(result);
  });

  app.get('/api/institutions/:id', (req, res) => {
    const inst = institutionService.getInstitutionById(req.params.id);
    if (!inst) {
      return res.status(404).json({ error: 'Institution not found' });
    }
    res.json({ institution: inst });
  });

  app.post('/api/institutions/propose', (req, res) => {
    const { countryCode, name, shortName, type, website, submissionNotes, submittedByUserId, campusName, city } = req.body;
    if (!countryCode || !name) {
      return res.status(400).json({ error: 'countryCode and institution name are required' });
    }

    const { institution: proposed, duplicates } = institutionService.proposeInstitution({
      countryCode,
      name,
      shortName,
      type,
      website,
      submissionNotes,
      submittedByUserId,
      campusName,
      city,
    });

    adminService.logAction({
      actorUserId: submittedByUserId || 'anonymous',
      actorEmail: 'student@enermind.org',
      actorRole: UserRole.STUDENT,
      action: 'INSTITUTION_PROPOSAL_SUBMITTED',
      targetType: 'INSTITUTION',
      targetId: proposed.id,
      details: `New institution proposed: "${proposed.name}" (${proposed.countryCode}). Status: PENDING review.`,
    });

    res.json({
      success: true,
      institution: proposed,
      duplicates,
      message: 'Institution proposal submitted to moderation queue with status PENDING.',
    });
  });

  app.post('/api/institutions/campuses/submit', (req, res) => {
    const { institutionId, campusName, city, countryCode, address, website, description, submittedByUserId } = req.body;
    if (!institutionId || !campusName || !city || !countryCode) {
      return res.status(400).json({ error: 'institutionId, campusName, city and countryCode are required' });
    }

    const submission = institutionService.submitCampus({
      institutionId,
      campusName,
      city,
      countryCode,
      address,
      website,
      description,
      submittedByUserId,
    });

    adminService.logAction({
      actorUserId: submittedByUserId || 'anonymous',
      actorEmail: 'student@enermind.org',
      actorRole: UserRole.STUDENT,
      action: 'CAMPUS_SUBMISSION_CREATED',
      targetType: 'CAMPUS',
      targetId: submission.id,
      details: `New campus "${campusName}" (${city}) submitted for institution ${submission.institutionName}. Status: PENDING.`,
    });

    res.json({ success: true, submission });
  });

  // ==========================================
  // 4. CURRENCY & EXCHANGE RATES
  // ==========================================

  app.get('/api/currency/rates', (req, res) => {
    res.json({
      baseCurrency: 'USD',
      rates: currencyService.getRates(),
      timestamp: new Date().toISOString(),
    });
  });

  app.post('/api/currency/convert', (req, res) => {
    const { amount, fromCurrency, toCurrency } = req.body;
    if (amount === undefined || !fromCurrency || !toCurrency) {
      return res.status(400).json({ error: 'amount, fromCurrency, and toCurrency are required' });
    }

    const conversion = currencyService.convert(Number(amount), fromCurrency, toCurrency);
    const rateTo = currencyService.getRate(toCurrency).rateToUSD;
    const rateFrom = currencyService.getRate(fromCurrency).rateToUSD;
    const calculatedRate = rateFrom > 0 ? rateTo / rateFrom : 1.0;

    res.json({
      originalAmount: Number(amount),
      fromCurrency,
      toCurrency,
      convertedAmount: conversion.targetAmount,
      rate: calculatedRate,
    });
  });

  // ==========================================
  // 5. GEMINI AI ASSISTANT
  // ==========================================

  app.post('/api/gemini/assist', async (req, res) => {
    const { category, prompt, userContext, hasPrivateVaultAuthorization } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const result = await geminiService.generateCampusAssistance({
      category: category || 'ACADEMIC',
      prompt,
      userContext,
      hasPrivateVaultAuthorization,
    });

    res.json(result);
  });

  app.post('/api/gemini/explain-paper', async (req, res) => {
    const { paperTitle, questionText, courseName } = req.body;
    if (!paperTitle || !questionText) {
      return res.status(400).json({ error: 'paperTitle and questionText are required' });
    }

    const result = await geminiService.explainPastPaper({ paperTitle, questionText, courseName });
    res.json(result);
  });

  // ==========================================
  // 6. GOOGLE SHEETS & TEMPLATES
  // ==========================================

  app.get('/api/sheet-store/products', (req, res) => {
    const category = req.query.category as string | undefined;
    res.json({ products: googleSheetsService.getAllProducts(category as any) });
  });

  app.get('/api/sheet-store/template-structure/:id', (req, res) => {
    const structure = googleSheetsService.getTemplateStructure(req.params.id);
    if (!structure) {
      return res.status(404).json({ error: 'Template structure not found' });
    }
    res.json({ structure });
  });

  // ==========================================
  // 7. GOOGLE DRIVE & PRIVATE VAULT WORKSPACE
  // ==========================================

  app.get('/api/workspace/private-vault/categories', (req, res) => {
    res.json({ categories: PRIVATE_VAULT_CATEGORIES });
  });

  app.get('/api/workspace/drive/status', async (req, res) => {
    const user = authService.getActiveUser();
    const userId = user?.id || 'usr-enermind-lead';
    const status = googleDriveService.getConnectionStatus(userId);
    const quota = await googleDriveService.getStorageQuota(userId);
    const workspace = await googleDriveService.getOrCreateWorkspace(userId);

    res.json({
      status,
      quota,
      workspace,
      userConnected: status === 'CONNECTED',
    });
  });

  app.post('/api/workspace/drive/connect', (req, res) => {
    const user = authService.getActiveUser();
    const userId = user?.id || 'usr-enermind-lead';
    googleDriveService.setConnectionStatus(userId, 'CONNECTED');

    adminService.logAction({
      actorUserId: userId,
      actorEmail: user?.email || 'student@enermind.org',
      actorRole: user?.role || UserRole.STUDENT,
      action: 'DRIVE_CONNECTED',
      targetType: 'GOOGLE_DRIVE',
      targetId: userId,
      details: 'User authorized Enermind Google Drive workspace.',
    });

    res.json({ success: true, status: 'CONNECTED', message: 'Google Drive connected successfully.' });
  });

  app.post('/api/workspace/drive/disconnect', (req, res) => {
    const user = authService.getActiveUser();
    const userId = user?.id || 'usr-enermind-lead';
    const result = googleDriveService.disconnectDrive(userId);
    res.json(result);
  });

  app.get('/api/workspace/files', (req, res) => {
    const user = authService.getActiveUser();
    const userId = (req.query.userId as string) || user?.id || 'usr-enermind-lead';

    const result = googleDriveService.getUserFiles(userId, {
      resourceType: req.query.resourceType as string,
      category: req.query.category as string,
      courseCode: req.query.courseCode as string,
      unitCode: req.query.unitCode as string,
      examType: req.query.examType as string,
      query: req.query.q as string,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      offset: req.query.offset ? parseInt(req.query.offset as string) : undefined,
    });

    res.json(result);
  });

  app.get('/api/workspace/files/:id', (req, res) => {
    const user = authService.getActiveUser();
    const userId = user?.id || 'usr-enermind-lead';
    const file = googleDriveService.getFileById(userId, req.params.id);
    if (!file) {
      return res.status(404).json({ error: 'File not found or unauthorized access' });
    }
    res.json({ file });
  });

  app.post('/api/workspace/files/upload', async (req, res) => {
    const user = authService.getActiveUser();
    const userId = user?.id || 'usr-enermind-lead';

    const {
      name,
      mimeType,
      sizeBytes,
      category,
      resourceType,
      institutionId,
      institutionName,
      campusId,
      campusName,
      courseId,
      courseCode,
      courseName,
      unitCode,
      unitName,
      topic,
      yearLevel,
      academicYear,
      semester,
      examType,
      sampleQuestion,
      tags,
    } = req.body;

    if (!name || !category || !resourceType) {
      return res.status(400).json({ error: 'name, category, and resourceType are required' });
    }

    try {
      const uploadResult = await googleDriveService.uploadFile(userId, {
        name,
        mimeType: mimeType || 'application/pdf',
        sizeBytes: sizeBytes || 102400,
        category,
        resourceType,
        institutionId: institutionId || user?.institutionId,
        institutionName: institutionName || user?.institutionName,
        campusId: campusId || user?.campusId,
        campusName: campusName || user?.campusName,
        courseId: courseId || user?.courseId,
        courseCode: courseCode || user?.courseName?.split(' ')[0] || 'CSC 301',
        courseName: courseName || user?.courseName,
        unitCode,
        unitName,
        topic,
        yearLevel: yearLevel || user?.yearLevelLabel,
        academicYear,
        semester,
        examType,
        sampleQuestion,
        tags,
      });

      res.json(uploadResult);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'File upload failed' });
    }
  });

  app.patch('/api/workspace/files/:id/rename', async (req, res) => {
    const user = authService.getActiveUser();
    const userId = user?.id || 'usr-enermind-lead';
    const { newName } = req.body;

    if (!newName || newName.trim().length === 0) {
      return res.status(400).json({ error: 'newName is required' });
    }

    try {
      const updated = await googleDriveService.renameFile(userId, req.params.id, newName.trim());
      if (!updated) {
        return res.status(404).json({ error: 'File not found' });
      }
      res.json({ success: true, file: updated });
    } catch (err: any) {
      res.status(403).json({ error: err.message || 'Rename unauthorized' });
    }
  });

  app.patch('/api/workspace/files/:id/move', async (req, res) => {
    const user = authService.getActiveUser();
    const userId = user?.id || 'usr-enermind-lead';
    const { newCategory } = req.body;

    if (!newCategory) {
      return res.status(400).json({ error: 'newCategory is required' });
    }

    try {
      const updated = await googleDriveService.moveFile(userId, req.params.id, newCategory);
      if (!updated) {
        return res.status(404).json({ error: 'File not found' });
      }
      res.json({ success: true, file: updated });
    } catch (err: any) {
      res.status(403).json({ error: err.message || 'Move unauthorized' });
    }
  });

  app.delete('/api/workspace/files/:id', async (req, res) => {
    const user = authService.getActiveUser();
    const userId = user?.id || 'usr-enermind-lead';

    try {
      const success = await googleDriveService.deleteFile(userId, req.params.id);
      if (!success) {
        return res.status(404).json({ error: 'File not found or delete unauthorized' });
      }
      res.json({ success: true, message: 'File deleted successfully from authorized workspace.' });
    } catch (err: any) {
      res.status(403).json({ error: err.message || 'Delete unauthorized' });
    }
  });

  app.post('/api/workspace/academic/submit', async (req, res) => {
    const user = authService.getActiveUser();
    const userId = user?.id || 'usr-enermind-lead';

    try {
      const result = await googleDriveService.submitAcademicResource(userId, req.body);
      res.json(result);
    } catch (err: any) {
      res.status(403).json({ error: err.message || 'Submission failed' });
    }
  });

  app.get('/api/workspace/academic/public', (req, res) => {
    const catalog = googleDriveService.getPublicAcademicCatalog({
      institutionId: req.query.institutionId as string,
      courseCode: req.query.courseCode as string,
      resourceType: req.query.resourceType as string,
      academicYear: req.query.academicYear as string,
      query: req.query.q as string,
    });
    res.json({ catalog });
  });

  app.post('/api/workspace/document-ai/process', async (req, res) => {
    const user = authService.getActiveUser();
    const userId = user?.id || 'usr-enermind-lead';

    const result = await documentAiService.processAuthorizedDocument({
      userId,
      fileId: req.body.fileId,
      userExplicitConsent: Boolean(req.body.userExplicitConsent),
      action: req.body.action || 'SUMMARIZE_NOTES',
      questionQuery: req.body.questionQuery,
      targetLength: req.body.targetLength,
    });

    res.json(result);
  });

  app.get('/api/security/test-matrix', async (req, res) => {
    const report = await securityTestSuite.runSecurityMatrix();
    res.json(report);
  });

  // ==========================================
  // 8. CAMPUS ACCOMMODATION & RENTALS SYSTEM
  // ==========================================

  // Advanced Search & Browse (with multi-currency, distance, filters)
  app.get('/api/accommodation', (req, res) => {
    const targetCurrency = (req.query.currency as string) || 'USD';
    const params = {
      q: req.query.q as string,
      countryCode: req.query.countryCode as string,
      institutionId: req.query.institutionId as string,
      campusId: req.query.campusId as string,
      propertyType: req.query.propertyType as any,
      roomType: req.query.roomType as any,
      minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
      maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
      maxDistanceKm: req.query.maxDistanceKm ? parseFloat(req.query.maxDistanceKm as string) : undefined,
      genderPreference: req.query.genderPreference as any,
      isFurnished: req.query.isFurnished !== undefined ? req.query.isFurnished === 'true' : undefined,
      utilitiesIncluded: req.query.utilitiesIncluded !== undefined ? req.query.utilitiesIncluded === 'true' : undefined,
      isVerifiedOnly: req.query.isVerifiedOnly === 'true',
      availabilityOnly: req.query.availabilityOnly === 'true',
      sortBy: (req.query.sortBy as any) || 'RECOMMENDED',
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 24,
    };

    const result = accommodationService.searchProperties(params, targetCurrency);
    res.json({
      listings: result.properties,
      properties: result.properties,
      total: result.total,
      page: result.page,
      totalPages: result.totalPages,
    });
  });

  // Single Property Detail (protects private verification documents)
  app.get('/api/accommodation/properties/:id', (req, res) => {
    const user = authService.getActiveUser();
    const isStaff = user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN || user?.role === UserRole.MODERATOR;
    const property = accommodationService.getPropertyById(req.params.id, user?.id, isStaff);

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json({ property });
  });

  // Explainable AI & Rule-based Campus Recommendations
  app.get('/api/accommodation/recommended', (req, res) => {
    const user = authService.getActiveUser();
    const recommendations = accommodationService.getRecommendationsForStudent({
      countryCode: (req.query.countryCode as string) || user?.countryCode,
      institutionId: (req.query.institutionId as string) || user?.institutionId,
      campusId: (req.query.campusId as string) || user?.campusId,
    });
    res.json({ recommendations });
  });

  // Create Property (Wizard submission)
  app.post('/api/accommodation/properties', (req, res) => {
    const user = authService.getActiveUser();
    const ownerId = req.body.ownerId || user?.id || 'usr-enermind-lead';
    const ownerName = req.body.ownerName || user?.displayName || 'Property Landlord';
    const ownerEmail = req.body.ownerEmail || user?.email;

    try {
      const result = accommodationService.createProperty({
        ...req.body,
        ownerId,
        ownerName,
        ownerEmail,
      });
      res.json({ success: true, ...result });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to create property' });
    }
  });

  // Edit Property (Strict owner check)
  app.put('/api/accommodation/properties/:id', (req, res) => {
    const user = authService.getActiveUser();
    const editorUserId = user?.id || 'usr-enermind-lead';
    const isStaff = user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN;

    try {
      const updated = accommodationService.updateProperty(req.params.id, editorUserId, req.body, isStaff);
      res.json({ success: true, property: updated });
    } catch (err: any) {
      res.status(403).json({ error: err.message || 'Update unauthorized' });
    }
  });

  // Fast Availability Updater (Units/Beds)
  app.patch('/api/accommodation/properties/:id/availability', (req, res) => {
    const user = authService.getActiveUser();
    const ownerUserId = user?.id || req.body.ownerId || 'usr-enermind-lead';
    const { totalUnits, availableUnits } = req.body;

    try {
      const updated = accommodationService.updateAvailability(req.params.id, ownerUserId, totalUnits, availableUnits);
      res.json({ success: true, property: updated });
    } catch (err: any) {
      res.status(403).json({ error: err.message || 'Failed to update availability' });
    }
  });

  // Listing Status Change (PAUSE, RESUME, MARK_FULL, ARCHIVE)
  app.patch('/api/accommodation/properties/:id/status', (req, res) => {
    const user = authService.getActiveUser();
    const ownerUserId = user?.id || req.body.ownerId || 'usr-enermind-lead';
    const { action } = req.body;

    try {
      const updated = accommodationService.changeListingStatus(req.params.id, ownerUserId, action);
      res.json({ success: true, property: updated });
    } catch (err: any) {
      res.status(403).json({ error: err.message || 'Failed to update status' });
    }
  });

  // Renew Listing Expiration
  app.post('/api/accommodation/properties/:id/renew', (req, res) => {
    const user = authService.getActiveUser();
    const ownerUserId = user?.id || req.body.ownerId || 'usr-enermind-lead';

    try {
      const updated = accommodationService.renewListing(req.params.id, ownerUserId);
      res.json({ success: true, property: updated });
    } catch (err: any) {
      res.status(403).json({ error: err.message || 'Renewal failed' });
    }
  });

  // Submit Private Verification Documents
  app.post('/api/accommodation/properties/:id/verify', (req, res) => {
    const user = authService.getActiveUser();
    const ownerUserId = user?.id || req.body.ownerId || 'usr-enermind-lead';
    const { documents } = req.body;

    try {
      const result = accommodationService.submitVerificationDocuments(req.params.id, ownerUserId, documents || []);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Verification submission failed' });
    }
  });

  // Owner Dashboard Properties
  app.get('/api/accommodation/owner/properties', (req, res) => {
    const user = authService.getActiveUser();
    const ownerId = (req.query.ownerId as string) || user?.id || 'usr-landlord-ke-1';
    const properties = accommodationService.getOwnerProperties(ownerId);
    res.json({ properties });
  });

  // Inquiries: Student creates inquiry
  app.post('/api/accommodation/inquiries', (req, res) => {
    const user = authService.getActiveUser();
    const studentId = user?.id || req.body.studentId || 'usr-student-anon';
    const studentName = user?.displayName || req.body.studentName || 'Campus Student';
    const studentEmail = user?.email || req.body.studentEmail || 'student@enermind.org';

    try {
      const inquiry = accommodationService.createInquiry({
        ...req.body,
        studentId,
        studentName,
        studentEmail,
      });
      res.json({ success: true, inquiry });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Inquiry submission failed' });
    }
  });

  // Student Inquiries List
  app.get('/api/accommodation/inquiries/student', (req, res) => {
    const user = authService.getActiveUser();
    const studentId = (req.query.studentId as string) || user?.id || 'usr-enermind-lead';
    const inquiries = accommodationService.getStudentInquiries(studentId);
    res.json({ inquiries });
  });

  // Owner Inquiries List
  app.get('/api/accommodation/inquiries/owner', (req, res) => {
    const user = authService.getActiveUser();
    const ownerId = (req.query.ownerId as string) || user?.id || 'usr-landlord-ke-1';
    const inquiries = accommodationService.getOwnerInquiries(ownerId);
    res.json({ inquiries });
  });

  // Owner Responds to Inquiry
  app.patch('/api/accommodation/inquiries/:id/respond', (req, res) => {
    const user = authService.getActiveUser();
    const ownerId = user?.id || req.body.ownerId || 'usr-landlord-ke-1';
    const { responseMessage } = req.body;

    try {
      const updated = accommodationService.respondToInquiry(req.params.id, ownerId, responseMessage || '');
      res.json({ success: true, inquiry: updated });
    } catch (err: any) {
      res.status(403).json({ error: err.message || 'Failed to respond to inquiry' });
    }
  });

  // Saved / Bookmark Accommodation
  app.post('/api/accommodation/saved', (req, res) => {
    const user = authService.getActiveUser();
    const userId = user?.id || req.body.userId || 'usr-enermind-lead';
    const { propertyId } = req.body;

    try {
      const result = accommodationService.toggleSaveProperty(userId, propertyId);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to save property' });
    }
  });

  app.get('/api/accommodation/saved', (req, res) => {
    const user = authService.getActiveUser();
    const userId = (req.query.userId as string) || user?.id || 'usr-enermind-lead';
    const targetCurrency = (req.query.currency as string) || 'USD';
    const saved = accommodationService.getUserSavedProperties(userId, targetCurrency);
    res.json({ saved });
  });

  // Property Comparison Side-by-Side
  app.post('/api/accommodation/compare', (req, res) => {
    const { propertyIds, currency } = req.body;
    const items = accommodationService.compareProperties(propertyIds || [], currency || 'USD');
    res.json({ comparison: items });
  });

  // Reviews
  app.post('/api/accommodation/reviews', (req, res) => {
    const user = authService.getActiveUser();
    const userId = user?.id || req.body.userId || 'usr-student-anon';
    const userName = user?.displayName || req.body.userName || 'Campus Resident';

    try {
      const review = accommodationService.submitReview({
        propertyId: req.body.propertyId,
        userId,
        userName,
        userRole: user?.role,
        rating: req.body.rating,
        comment: req.body.comment,
      });
      res.json({ success: true, review });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Review failed' });
    }
  });

  app.get('/api/accommodation/reviews/:propertyId', (req, res) => {
    const reviews = accommodationService.getPropertyReviews(req.params.propertyId);
    res.json({ reviews });
  });

  // Reports (Scam / Inaccuracy)
  app.post('/api/accommodation/reports', (req, res) => {
    const user = authService.getActiveUser();
    const reportedByUserId = user?.id || req.body.reportedByUserId || 'usr-student-anon';

    try {
      const report = accommodationService.reportProperty({
        propertyId: req.body.propertyId,
        reportedByUserId,
        reporterEmail: user?.email || req.body.reporterEmail,
        reason: req.body.reason,
        details: req.body.details,
      });
      res.json({ success: true, report });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Report failed' });
    }
  });

  // AI Accommodation Assistant (Grounded natural language search)
  app.post('/api/accommodation/ai-assistant', async (req, res) => {
    const user = authService.getActiveUser();
    const { query, currency } = req.body;

    const catalog = accommodationService.searchProperties({}, currency || 'USD').properties;
    const response = await geminiService.searchAndAdviseAccommodation({
      query: query || 'Find affordable accommodation near campus',
      studentCampus: user?.campusName,
      studentInstitution: user?.institutionName,
      targetCurrency: currency || 'USD',
      realPropertiesCatalog: catalog,
    });

    res.json(response);
  });

  // ==========================================
  // 9. OPPORTUNITIES, GIGS, COMMUNITIES, EVENTS, ORDERS
  // ==========================================

  // ------------------------------------------
  // Phase 7: Global Opportunities & Careers
  // ------------------------------------------

  // Search & Filter Opportunities
  app.get('/api/opportunities/search', (req, res) => {
    const {
      q,
      type,
      industry,
      countryCode,
      city,
      remoteType,
      minSalary,
      maxSalary,
      currency,
      course,
      institutionId,
      campusId,
      experience,
      isVerifiedOnly,
      sortBy,
      page,
      limit,
    } = req.query;

    const skills = req.query.skills
      ? Array.isArray(req.query.skills)
        ? (req.query.skills as string[])
        : [(req.query.skills as string)]
      : undefined;

    const result = opportunitiesService.searchOpportunities(
      {
        q: q as string,
        type: type as any,
        industry: industry as string,
        countryCode: countryCode as string,
        city: city as string,
        remoteType: remoteType as any,
        minSalary: minSalary ? parseFloat(minSalary as string) : undefined,
        maxSalary: maxSalary ? parseFloat(maxSalary as string) : undefined,
        currency: (currency as string) || 'USD',
        skills,
        course: course as string,
        institutionId: institutionId as string,
        campusId: campusId as string,
        experience: experience as string,
        isVerifiedOnly: isVerifiedOnly === 'true',
        sortBy: sortBy as any,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 20,
      },
      (currency as string) || 'USD'
    );

    res.json(result);
  });

  // Backward compatibility list endpoint
  app.get('/api/opportunities', (req, res) => {
    const type = req.query.type as string | undefined;
    const currency = (req.query.currency as string) || 'USD';
    const result = opportunitiesService.searchOpportunities(
      { type: type as any, limit: 50 },
      currency
    );
    res.json({ listings: result.opportunities, total: result.total });
  });

  // Student Personalized Recommendations
  app.get('/api/opportunities/recommendations', (req, res) => {
    const user = authService.getActiveUser();
    const recommendations = opportunitiesService.getRecommendationsForStudent({
      userId: user?.id,
      courseName: user?.courseName,
      institutionId: user?.institutionId,
      campusId: user?.campusId,
      skills: user?.skills || [],
      countryCode: user?.countryCode,
    });
    res.json({ recommendations });
  });

  // Skills Catalog
  app.get('/api/opportunities/skills', (req, res) => {
    res.json({ skills: opportunitiesService.getSkills() });
  });

  // Organizations Catalog
  app.get('/api/opportunities/organizations', (req, res) => {
    res.json({ organizations: opportunitiesService.getOrganizations() });
  });

  app.get('/api/opportunities/organizations/:id', (req, res) => {
    const org = opportunitiesService.getOrganizationById(req.params.id);
    if (!org) return res.status(404).json({ error: 'Organization not found' });
    res.json({ organization: org });
  });

  app.post('/api/opportunities/organizations', (req, res) => {
    const user = authService.getActiveUser();
    const org = opportunitiesService.createOrUpdateOrganization(req.body, user?.id || 'usr-anon');
    res.json({ success: true, organization: org });
  });

  app.post('/api/opportunities/organizations/:id/verify-submit', (req, res) => {
    const user = authService.getActiveUser();
    const { documents } = req.body;
    try {
      const org = opportunitiesService.submitEmployerVerification(
        req.params.id,
        user?.id || 'usr-anon',
        documents || []
      );
      res.json({ success: true, organization: org });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Verification submission failed' });
    }
  });

  // Single Opportunity Detail
  app.get('/api/opportunities/:id', (req, res) => {
    const user = authService.getActiveUser();
    const isStaff = user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN || user?.role === UserRole.MODERATOR;
    const opp = opportunitiesService.getOpportunityById(req.params.id, user?.id, isStaff);
    if (!opp) return res.status(404).json({ error: 'Opportunity not found' });
    res.json({ opportunity: opp });
  });

  // Post Opportunity (Employer / Recruiter / Admin)
  app.post('/api/opportunities', (req, res) => {
    const user = authService.getActiveUser();
    const creatorRole = user?.role || UserRole.EMPLOYER;
    const creatorUserId = user?.id || 'usr-employer';

    try {
      const result = opportunitiesService.createOpportunity(req.body, creatorUserId, creatorRole);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to post opportunity' });
    }
  });

  // Update Opportunity
  app.put('/api/opportunities/:id', (req, res) => {
    const user = authService.getActiveUser();
    const isStaff = user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN;

    try {
      const updated = opportunitiesService.updateOpportunity(
        req.params.id,
        user?.id || 'usr-anon',
        req.body,
        isStaff
      );
      res.json({ success: true, opportunity: updated });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Update failed' });
    }
  });

  // Opportunity Status Change (Pause, Resume, Close, Archive)
  app.post('/api/opportunities/:id/status', (req, res) => {
    const user = authService.getActiveUser();
    const isStaff = user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN;
    const { action } = req.body;

    try {
      const updated = opportunitiesService.changeOpportunityStatus(
        req.params.id,
        user?.id || 'usr-anon',
        action,
        isStaff
      );
      res.json({ success: true, opportunity: updated });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Status change failed' });
    }
  });

  // Apply to Opportunity (Enermind Native)
  app.post('/api/opportunities/:id/apply', (req, res) => {
    const user = authService.getActiveUser();
    const { applicantName, applicantEmail, applicantPhone, resumeFileId, resumeFileName, resumeDriveLink, coverLetter, answers } = req.body;

    try {
      const application = opportunitiesService.applyToOpportunity({
        opportunityId: req.params.id,
        applicantId: user?.id || 'usr-student',
        applicantName: applicantName || user?.displayName || 'Enermind Student',
        applicantEmail: applicantEmail || user?.email || 'student@enermind.org',
        applicantPhone,
        resumeFileId,
        resumeFileName,
        resumeDriveLink,
        coverLetter,
        answers,
      });

      res.json({ success: true, application });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Application failed' });
    }
  });

  // Student's My Applications
  app.get('/api/opportunities/applications/student', (req, res) => {
    const user = authService.getActiveUser();
    const applications = opportunitiesService.getStudentApplications(user?.id || 'usr-enermind-lead');
    res.json({ applications });
  });

  // Employer's Received Applications
  app.get('/api/opportunities/applications/employer', (req, res) => {
    const user = authService.getActiveUser();
    const isStaff = user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN;
    const applications = opportunitiesService.getEmployerApplications(user?.id || 'usr-employer-seed', isStaff);
    res.json({ applications });
  });

  // Update Application Status (Employer review)
  app.post('/api/opportunities/applications/:id/status', (req, res) => {
    const user = authService.getActiveUser();
    const isStaff = user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN;
    const { status, employerNotes } = req.body;

    try {
      const updated = opportunitiesService.updateApplicationStatus(
        req.params.id,
        user?.id || 'usr-anon',
        status,
        employerNotes,
        isStaff
      );
      res.json({ success: true, application: updated });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Status update failed' });
    }
  });

  // Withdraw Application (Student)
  app.post('/api/opportunities/applications/:id/withdraw', (req, res) => {
    const user = authService.getActiveUser();
    try {
      const success = opportunitiesService.withdrawApplication(req.params.id, user?.id || 'usr-enermind-lead');
      res.json({ success });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Withdrawal failed' });
    }
  });

  // Saved / Bookmarked Opportunities
  app.get('/api/opportunities/saved/my-list', (req, res) => {
    const user = authService.getActiveUser();
    const saved = opportunitiesService.getUserSavedOpportunities(user?.id || 'usr-enermind-lead');
    res.json({ saved });
  });

  app.post('/api/opportunities/:id/save-toggle', (req, res) => {
    const user = authService.getActiveUser();
    try {
      const result = opportunitiesService.toggleSaveOpportunity(user?.id || 'usr-enermind-lead', req.params.id);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Save toggle failed' });
    }
  });

  // Career Profile
  app.get('/api/opportunities/career-profile/me', (req, res) => {
    const user = authService.getActiveUser();
    const profile = opportunitiesService.getCareerProfile(user?.id || 'usr-enermind-lead');
    res.json({ profile });
  });

  app.post('/api/opportunities/career-profile/me', (req, res) => {
    const user = authService.getActiveUser();
    const updated = opportunitiesService.saveCareerProfile(user?.id || 'usr-enermind-lead', req.body);
    res.json({ success: true, profile: updated });
  });

  // Fraud / Scam Reporting
  app.post('/api/opportunities/:id/report', (req, res) => {
    const user = authService.getActiveUser();
    const { reason, details, reporterEmail } = req.body;

    try {
      const report = opportunitiesService.reportOpportunity({
        opportunityId: req.params.id,
        reportedByUserId: user?.id || 'usr-anon',
        reporterEmail: reporterEmail || user?.email,
        reason,
        details,
      });
      res.json({ success: true, report });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Report failed' });
    }
  });

  // AI Career Assistant: Grounded Search
  app.post('/api/opportunities/ai-search', async (req, res) => {
    const user = authService.getActiveUser();
    const { query } = req.body;

    const catalog = opportunitiesService.searchOpportunities({ activeOnly: true, limit: 30 }).opportunities.map((o) => ({
      id: o.id,
      title: o.title,
      organizationName: o.organizationName,
      type: o.type,
      remoteType: o.remoteType,
      country: o.country,
      city: o.city,
      salary: o.stipendOrSalary || 'Undisclosed',
      skills: o.skills,
      requirements: o.requirements,
      deadline: o.applicationDeadline,
    }));

    const result = await geminiService.searchAndAdviseOpportunities({
      query: query || 'Find software engineering internships and graduate tracks',
      studentCourse: user?.courseName,
      studentInstitution: user?.institutionName,
      studentSkills: user?.skills || [],
      realOpportunitiesCatalog: catalog,
    });

    res.json(result);
  });

  // AI Career Tooling Suite (CV polish, Cover letter, Interview prep, Skill gap)
  app.post('/api/opportunities/ai-career-tool', async (req, res) => {
    const user = authService.getActiveUser();
    const profile = opportunitiesService.getCareerProfile(user?.id || 'usr-enermind-lead');
    const { action, opportunityId, customPrompt } = req.body;

    let opportunityContext: any = undefined;
    if (opportunityId) {
      const opp = opportunitiesService.getOpportunityById(opportunityId);
      if (opp) {
        opportunityContext = {
          title: opp.title,
          organizationName: opp.organizationName,
          type: opp.type,
          description: opp.description,
          requirements: opp.requirements,
          responsibilities: opp.responsibilities,
          skills: opp.skills,
        };
      }
    }

    const result = await geminiService.assistCareerTool({
      action: action || 'IMPROVE_CV',
      studentProfile: profile,
      opportunityContext,
      customPrompt,
    });

    res.json(result);
  });

  app.get('/api/gigs', (req, res) => {
    res.json({ gigs: orderAndListingService.getGigs() });
  });

  app.get('/api/marketplace', (req, res) => {
    res.json({ items: orderAndListingService.getMarketplace() });
  });

  app.get('/api/communities', (req, res) => {
    const instId = req.query.institutionId as string | undefined;
    const category = req.query.category as string | undefined;
    res.json({ communities: orderAndListingService.getCommunities(instId, category as any) });
  });

  app.post('/api/communities', (req, res) => {
    const newGroup = orderAndListingService.submitCommunity(req.body);
    res.json({ success: true, community: newGroup });
  });

  // ==========================================
  // 12. PHASE 10 — CAMPUS EVENTS & CALENDAR
  // ==========================================

  // Backward-compatible & unified events endpoint
  app.get('/api/events', (req, res) => {
    const user = authService.getActiveUser();
    const instId = req.query.institutionId as string | undefined;
    const campusId = req.query.campusId as string | undefined;
    const category = req.query.category as string | undefined;
    const query = req.query.query as string | undefined;
    const timeframe = req.query.timeframe as any;

    const result = campusEventsService.searchEvents({
      institutionId: instId,
      campusId,
      category,
      query,
      timeframe,
      currentUserId: user?.id,
    });
    res.json(result);
  });

  app.get('/api/campus/events', (req, res) => {
    const user = authService.getActiveUser();
    const result = campusEventsService.searchEvents({
      query: req.query.query as string | undefined,
      category: req.query.category as string | undefined,
      type: req.query.type as string | undefined,
      institutionId: req.query.institutionId as string | undefined,
      campusId: req.query.campusId as string | undefined,
      countryCode: req.query.countryCode as string | undefined,
      timeframe: req.query.timeframe as any,
      visibility: req.query.visibility as string | undefined,
      status: req.query.status as string | undefined,
      clubId: req.query.clubId as string | undefined,
      isOfficialOnly: req.query.isOfficialOnly === 'true',
      isFeaturedOnly: req.query.isFeaturedOnly === 'true',
      hasRegistrationOnly: req.query.hasRegistrationOnly === 'true',
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 20,
      sortBy: req.query.sortBy as any,
      currentUserId: user?.id,
    });
    res.json(result);
  });

  app.get('/api/campus/events/:id', (req, res) => {
    const user = authService.getActiveUser();
    const event = campusEventsService.getEventById(req.params.id, user?.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json({ event });
  });

  app.post('/api/campus/events', (req, res) => {
    const user = authService.getActiveUser();
    if (!user) return res.status(401).json({ error: 'Authentication required to publish events' });

    try {
      const {
        title,
        description,
        type,
        category,
        startDateTime,
        endDateTime,
        timezone,
        location,
        locationType,
        venueName,
        building,
        room,
        mapCoordinates,
        onlineUrl,
        organizerName,
        organizerContact,
        organizerEmail,
        organizerRole,
        organizerLogoUrl,
        coverImageUrl,
        capacity,
        registrationRequired,
        registrationDeadline,
        registrationUrl,
        requiresApproval,
        targetAudience,
        visibility,
        institutionId,
        institutionName,
        campusId,
        campusName,
        departmentId,
        departmentName,
        courseId,
        courseCode,
        courseName,
        clubId,
        clubName,
        tags,
        materials,
      } = req.body;

      if (!title || !description || !startDateTime || !location || !organizerName) {
        return res.status(400).json({ error: 'Title, description, start date, location, and organizer name are required' });
      }

      const result = campusEventsService.createEvent({
        createdBy: user.id,
        creatorRole: user.role,
        creatorName: user.name,
        creatorEmail: user.email,
        institutionId: institutionId || user.institutionId || 'inst-uon-ke',
        institutionName: institutionName || user.institutionName || 'University of Nairobi',
        campusId: campusId || user.campusId,
        campusName: campusName || user.campusName,
        departmentId,
        departmentName,
        courseId,
        courseCode,
        courseName,
        clubId,
        clubName,
        title,
        description,
        type: type || 'PUBLIC_CAMPUS_EVENT',
        category: category || 'ACADEMIC',
        startDateTime,
        endDateTime: endDateTime || startDateTime,
        timezone: timezone || 'Africa/Nairobi',
        location,
        locationType: locationType || 'PHYSICAL',
        venueName,
        building,
        room,
        mapCoordinates,
        onlineUrl,
        organizerName,
        organizerContact,
        organizerEmail: organizerEmail || user.email,
        organizerRole: organizerRole || 'Event Organizer',
        organizerLogoUrl,
        coverImageUrl,
        capacity: capacity ? Number(capacity) : undefined,
        registrationRequired: Boolean(registrationRequired),
        registrationDeadline,
        registrationUrl,
        requiresApproval: Boolean(requiresApproval),
        targetAudience: targetAudience || [],
        visibility: visibility || 'INSTITUTION',
        status: 'PUBLISHED',
        verificationStatus: 'COMMUNITY_SUBMITTED',
        isOfficial: false,
        tags: tags || [],
        materials: materials || [],
        userRole: user.role,
      });

      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to create event' });
    }
  });

  app.put('/api/campus/events/:id', (req, res) => {
    const user = authService.getActiveUser();
    if (!user) return res.status(401).json({ error: 'Authentication required' });

    try {
      const isStaff = user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN;
      const updated = campusEventsService.updateEvent(req.params.id, user.id, req.body, isStaff);
      res.json({ success: true, event: updated });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to update event' });
    }
  });

  app.post('/api/campus/events/:id/status', (req, res) => {
    const user = authService.getActiveUser();
    if (!user) return res.status(401).json({ error: 'Authentication required' });

    try {
      const { action, note, newStartDateTime, newEndDateTime } = req.body;
      const isStaff = user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN;
      const updated = campusEventsService.cancelOrPostponeEvent(
        req.params.id,
        user.id,
        action,
        note,
        newStartDateTime,
        newEndDateTime,
        isStaff
      );
      res.json({ success: true, event: updated });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to update event status' });
    }
  });

  app.post('/api/campus/events/:id/register', (req, res) => {
    const user = authService.getActiveUser();
    if (!user) return res.status(401).json({ error: 'Please sign in to register for campus events' });

    try {
      const result = campusEventsService.registerForEvent({
        eventId: req.params.id,
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        userInstitutionName: user.institutionName,
        notes: req.body.notes,
      });
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Registration failed' });
    }
  });

  app.post('/api/campus/events/:id/cancel-registration', (req, res) => {
    const user = authService.getActiveUser();
    if (!user) return res.status(401).json({ error: 'Authentication required' });

    try {
      const result = campusEventsService.cancelRegistration(req.params.id, user.id);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to cancel registration' });
    }
  });

  app.get('/api/campus/events/:id/attendees', (req, res) => {
    const user = authService.getActiveUser();
    if (!user) return res.status(401).json({ error: 'Authentication required' });

    try {
      const isStaff = user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN;
      const attendees = campusEventsService.getEventAttendees(req.params.id, user.id, isStaff);
      res.json({ attendees });
    } catch (err: any) {
      res.status(403).json({ error: err.message || 'Access denied' });
    }
  });

  app.post('/api/campus/events/:id/save', (req, res) => {
    const user = authService.getActiveUser();
    if (!user) return res.status(401).json({ error: 'Authentication required' });

    const reminderMinutes = req.body.reminderMinutes ? Number(req.body.reminderMinutes) : 60;
    const result = campusEventsService.toggleSaveEvent(user.id, req.params.id, reminderMinutes);
    res.json(result);
  });

  app.get('/api/campus/saved-events', (req, res) => {
    const user = authService.getActiveUser();
    const userId = user?.id || 'usr-enermind-lead';
    const saved = campusEventsService.getUserSavedEvents(userId);
    res.json({ savedEvents: saved });
  });

  app.get('/api/campus/registrations', (req, res) => {
    const user = authService.getActiveUser();
    const userId = user?.id || 'usr-enermind-lead';
    const registrations = campusEventsService.getUserRegistrations(userId);
    res.json({ registrations });
  });

  // Academic Deadlines
  app.get('/api/campus/deadlines', (req, res) => {
    const deadlines = campusEventsService.getAcademicDeadlines({
      institutionId: req.query.institutionId as string | undefined,
      campusId: req.query.campusId as string | undefined,
      courseCode: req.query.courseCode as string | undefined,
      type: req.query.type as string | undefined,
      priority: req.query.priority as string | undefined,
    });
    res.json({ deadlines });
  });

  app.post('/api/campus/deadlines', (req, res) => {
    const user = authService.getActiveUser();
    if (!user) return res.status(401).json({ error: 'Authentication required' });

    try {
      const isStaff = user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN;
      const deadline = campusEventsService.createAcademicDeadline(req.body, user.id, isStaff);
      res.json({ success: true, deadline });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to create deadline' });
    }
  });

  // Personal Deadlines (Student Private Planner)
  app.get('/api/campus/personal-deadlines', (req, res) => {
    const user = authService.getActiveUser();
    const userId = user?.id || 'usr-enermind-lead';
    const deadlines = campusEventsService.getPersonalDeadlines(userId);
    res.json({ personalDeadlines: deadlines });
  });

  app.post('/api/campus/personal-deadlines', (req, res) => {
    const user = authService.getActiveUser();
    if (!user) return res.status(401).json({ error: 'Authentication required' });

    try {
      const { title, description, dueDateTime, timezone, category, priority, courseCode, reminderMinutes } = req.body;
      if (!title || !dueDateTime) {
        return res.status(400).json({ error: 'Title and due date are required' });
      }

      const item = campusEventsService.createPersonalDeadline({
        userId: user.id,
        title,
        description,
        dueDateTime,
        timezone: timezone || 'Africa/Nairobi',
        category: category || 'ASSIGNMENT',
        priority: priority || 'MEDIUM',
        courseCode,
        reminderMinutes: reminderMinutes ? Number(reminderMinutes) : 60,
      });

      res.json({ success: true, personalDeadline: item });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to create personal deadline' });
    }
  });

  app.post('/api/campus/personal-deadlines/:id/toggle', (req, res) => {
    const user = authService.getActiveUser();
    if (!user) return res.status(401).json({ error: 'Authentication required' });

    try {
      const item = campusEventsService.togglePersonalDeadline(req.params.id, user.id);
      res.json({ success: true, personalDeadline: item });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to toggle personal deadline' });
    }
  });

  app.delete('/api/campus/personal-deadlines/:id', (req, res) => {
    const user = authService.getActiveUser();
    if (!user) return res.status(401).json({ error: 'Authentication required' });

    const deleted = campusEventsService.deletePersonalDeadline(req.params.id, user.id);
    res.json({ success: deleted });
  });

  // Exams Timetable
  app.get('/api/campus/exams', (req, res) => {
    const exams = campusEventsService.getExams({
      institutionId: req.query.institutionId as string | undefined,
      campusId: req.query.campusId as string | undefined,
      courseCode: req.query.courseCode as string | undefined,
      examType: req.query.examType as string | undefined,
      query: req.query.query as string | undefined,
    });
    res.json({ exams });
  });

  app.post('/api/campus/exams', (req, res) => {
    const user = authService.getActiveUser();
    if (!user) return res.status(401).json({ error: 'Authentication required' });

    try {
      const exam = campusEventsService.createExamSchedule(req.body, user.id);
      res.json({ success: true, exam });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to create exam entry' });
    }
  });

  // Announcements
  app.get('/api/campus/announcements', (req, res) => {
    const instId = req.query.institutionId as string | undefined;
    const campusId = req.query.campusId as string | undefined;
    const announcements = campusEventsService.getAnnouncements(instId, campusId);
    res.json({ announcements });
  });

  app.post('/api/campus/announcements', (req, res) => {
    const user = authService.getActiveUser();
    if (!user) return res.status(401).json({ error: 'Authentication required' });

    try {
      const isStaff = user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN;
      const announcement = campusEventsService.createAnnouncement(
        {
          authorName: user.name,
          authorRole: user.role,
          authorAvatar: user.picture,
          institutionId: req.body.institutionId || user.institutionId || 'inst-uon-ke',
          institutionName: req.body.institutionName || user.institutionName || 'University of Nairobi',
          campusId: req.body.campusId || user.campusId,
          campusName: req.body.campusName || user.campusName,
          departmentId: req.body.departmentId,
          title: req.body.title,
          content: req.body.content,
          priority: req.body.priority || 'NORMAL',
          isOfficial: isStaff,
          source: req.body.source || (isStaff ? 'Official Administration' : 'Student Association'),
          actionUrl: req.body.actionUrl,
          actionLabel: req.body.actionLabel,
          expiresAt: req.body.expiresAt,
        },
        user.id,
        isStaff
      );
      res.json({ success: true, announcement });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to create announcement' });
    }
  });

  // Clubs & Societies
  app.get('/api/campus/clubs', (req, res) => {
    const clubs = campusEventsService.getClubs({
      institutionId: req.query.institutionId as string | undefined,
      campusId: req.query.campusId as string | undefined,
      category: req.query.category as string | undefined,
      query: req.query.query as string | undefined,
    });
    res.json({ clubs });
  });

  app.post('/api/campus/clubs', (req, res) => {
    const user = authService.getActiveUser();
    if (!user) return res.status(401).json({ error: 'Authentication required' });

    try {
      const club = campusEventsService.createClub(req.body, user.id);
      res.json({ success: true, club });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to propose club' });
    }
  });

  app.post('/api/campus/clubs/:id/follow', (req, res) => {
    const user = authService.getActiveUser();
    if (!user) return res.status(401).json({ error: 'Authentication required' });

    try {
      const result = campusEventsService.toggleFollowClub(user.id, req.params.id);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to follow club' });
    }
  });

  // Campus Locations
  app.get('/api/campus/locations', (req, res) => {
    const instId = req.query.institutionId as string | undefined;
    const campusId = req.query.campusId as string | undefined;
    const locations = campusEventsService.getLocations(instId, campusId);
    res.json({ locations });
  });

  // Combined My Calendar Feed
  app.get('/api/campus/my-feed', (req, res) => {
    const user = authService.getActiveUser();
    const userId = user?.id || 'usr-enermind-lead';
    const instId = (req.query.institutionId as string) || user?.institutionId || 'inst-uon-ke';
    const campusId = (req.query.campusId as string) || user?.campusId;

    const feed = campusEventsService.getMyCalendarFeed(userId, instId, campusId);
    res.json(feed);
  });

  // Report Event
  app.post('/api/campus/events/:id/report', (req, res) => {
    const user = authService.getActiveUser();
    const { reason, details } = req.body;

    if (!reason || !details) {
      return res.status(400).json({ error: 'Reason and details are required' });
    }

    try {
      const result = campusEventsService.reportEvent({
        eventId: req.params.id,
        reportedByUserId: user?.id || 'usr-anon',
        reportedByUserEmail: user?.email,
        reason,
        details,
      });
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to submit event report' });
    }
  });

  // Google Drive Event Dossier Export
  app.post('/api/campus/events/:id/export-drive', async (req, res) => {
    const user = authService.getActiveUser();
    const userId = user?.id || 'usr-enermind-lead';

    try {
      const result = await campusEventsService.exportEventToDrive(userId, req.params.id);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Drive export failed' });
    }
  });

  // Campus Calendar Google URL helper
  app.post('/api/campus/calendar-url', (req, res) => {
    const { title, description, location, startDateTime, endDateTime, timezone } = req.body;
    if (!title || !startDateTime) {
      return res.status(400).json({ error: 'Title and startDateTime are required' });
    }

    const url = campusEventsService.generateGoogleCalendarUrl({
      title,
      description,
      location,
      startDateTime,
      endDateTime,
      timezone,
    });

    res.json({ googleCalendarUrl: url });
  });

  // Campus Calendar AI Planner & Advisor
  app.post('/api/campus/ai/advisor', async (req, res) => {
    const user = authService.getActiveUser();
    const { action, query } = req.body;

    const eventsList = campusEventsService.searchEvents({
      institutionId: user?.institutionId || 'inst-uon-ke',
      timeframe: 'UPCOMING',
      limit: 15,
    }).events.map((e) => ({
      id: e.id,
      title: e.title,
      category: e.category,
      startDateTime: e.startDateTime,
      endDateTime: e.endDateTime,
      location: e.location,
      locationType: e.locationType,
      organizerName: e.organizerName,
      isOfficial: e.isOfficial,
    }));

    const deadlinesList = campusEventsService.getAcademicDeadlines({
      institutionId: user?.institutionId || 'inst-uon-ke',
    }).map((d) => ({
      id: d.id,
      title: d.title,
      type: d.type,
      deadline: d.deadline,
      priority: d.priority,
      courseCode: d.courseCode,
      isOfficial: d.isOfficial,
    }));

    const examsList = campusEventsService.getExams({
      institutionId: user?.institutionId || 'inst-uon-ke',
    }).map((x) => ({
      id: x.id,
      courseCode: x.courseCode,
      courseName: x.courseName,
      dateTime: x.dateTime,
      venue: x.venue,
      room: x.room,
      durationMinutes: x.durationMinutes,
    }));

    const result = await geminiService.assistCampusCalendar({
      action: action || 'PLAN_MY_WEEK',
      studentContext: {
        institutionName: user?.institutionName || 'University of Nairobi',
        campusName: user?.campusName || 'Chiromo Science Campus',
        courseName: user?.courseName || 'BSc. Computer Science',
      },
      eventsCatalog: eventsList,
      deadlinesCatalog: deadlinesList,
      examsCatalog: examsList,
      userQuery: query,
    });

    res.json(result);
  });

  // Admin Campus Moderation Endpoints
  app.get('/api/admin/campus/reports', (req, res) => {
    res.json({ reports: campusEventsService.getEventReports(req.query.status as string) });
  });

  app.post('/api/admin/campus/events/:id/moderate', (req, res) => {
    const user = authService.getActiveUser();
    const { action, moderatorNotes } = req.body;

    if (!action) return res.status(400).json({ error: 'Action is required' });

    try {
      const event = campusEventsService.moderateEvent({
        eventId: req.params.id,
        action,
        moderatorNotes,
        adminUserId: user?.id || 'admin-usr',
      });
      res.json({ success: true, event });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Moderation failed' });
    }
  });

  app.post('/api/orders', (req, res) => {
    const { userId, userEmail, productId, productTitle, productType, amount, currency, displayCurrency, paymentProvider } = req.body;

    if (!userId || !userEmail || !productId || amount === undefined) {
      return res.status(400).json({ error: 'Missing required order fields' });
    }

    const order = orderAndListingService.createOrder({
      userId,
      userEmail,
      productId,
      productTitle,
      productType,
      amount,
      currency: currency || 'USD',
      displayCurrency: displayCurrency || 'USD',
      paymentProvider: paymentProvider || 'PESAPAL',
    });

    adminService.logAction({
      actorUserId: userId,
      actorEmail: userEmail,
      actorRole: UserRole.STUDENT,
      action: 'ORDER_CREATED',
      targetType: 'ORDER',
      targetId: order.id,
      details: `Order created for "${productTitle}" (${order.originalCurrency} ${order.originalAmount}). Merchant Ref: ${order.merchantReference}`,
    });

    res.json({ success: true, order });
  });

  app.post('/api/pesapal/submit-order', async (req, res) => {
    const { orderId } = req.body;
    const order = orderAndListingService.getOrderById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    if (!config.pesapal.consumerKey || !config.pesapal.consumerSecret) {
      // Graceful sandbox simulation when secrets not in environment
      return res.json({
        success: false,
        isConfigured: false,
        error: 'PesaPal credentials (PESAPAL_CONSUMER_KEY, PESAPAL_CONSUMER_SECRET) required for live redirection. Order is saved in sandbox history.',
      });
    }

    res.json({
      success: true,
      redirectUrl: `https://cybqa.pesapal.com/pesapalv3/api/Transactions/RegisterIPN?trackingId=${order.merchantReference}`,
    });
  });

  app.get('/api/orders/user/:userId', (req, res) => {
    res.json({ orders: orderAndListingService.getUserOrders(req.params.userId) });
  });

  // ==========================================
  // 9. ADMIN & MODERATION
  // ==========================================

  app.get('/api/admin/overview', (req, res) => {
    res.json(adminService.getOverviewStats());
  });

  app.get('/api/admin/institutions/pending', (req, res) => {
    res.json({ pending: institutionService.getAllInstitutions(undefined, InstitutionStatus.PENDING) });
  });

  app.post('/api/admin/institutions/review', (req, res) => {
    const { institutionId, newStatus, reviewerUserId, reviewerEmail, reviewerNotes, targetMergeId } = req.body;
    if (!institutionId || !newStatus) {
      return res.status(400).json({ error: 'institutionId and newStatus are required' });
    }

    const updated = adminService.reviewInstitution({
      institutionId,
      newStatus,
      reviewerUserId: reviewerUserId || 'admin',
      reviewerEmail: reviewerEmail || 'admin@enermind.org',
      reviewerNotes,
      targetMergeId,
    });

    if (!updated) {
      return res.status(404).json({ error: 'Institution not found' });
    }

    res.json({ success: true, institution: updated });
  });

  app.get('/api/admin/campuses/pending', (req, res) => {
    res.json({ pending: institutionService.getCampusSubmissions(InstitutionStatus.PENDING) });
  });

  app.post('/api/admin/campuses/review', (req, res) => {
    const { submissionId, action, reviewerUserId, reviewerEmail } = req.body;
    if (!submissionId || !action) {
      return res.status(400).json({ error: 'submissionId and action are required' });
    }

    const result = adminService.reviewCampus({
      submissionId,
      action,
      reviewerUserId: reviewerUserId || 'admin',
      reviewerEmail: reviewerEmail || 'admin@enermind.org',
    });

    res.json(result);
  });

  // Accommodation Moderation Queue
  app.get('/api/admin/accommodation/pending', (req, res) => {
    res.json({ pending: accommodationService.getPendingModerationProperties() });
  });

  app.post('/api/admin/accommodation/review', (req, res) => {
    const user = authService.getActiveUser();
    const { propertyId, action, moderatorNotes } = req.body;

    if (!propertyId || !action) {
      return res.status(400).json({ error: 'propertyId and action are required' });
    }

    try {
      const updated = accommodationService.reviewPropertyListing({
        propertyId,
        action,
        reviewerUserId: user?.id || 'admin-usr',
        reviewerEmail: user?.email || 'admin@enermind.org',
        moderatorNotes,
      });
      res.json({ success: true, property: updated });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Review failed' });
    }
  });

  // Accommodation Verifications Queue (with private documents)
  app.get('/api/admin/accommodation/verifications', (req, res) => {
    res.json({ verifications: accommodationService.getPendingVerifications() });
  });

  app.post('/api/admin/accommodation/verify', (req, res) => {
    const user = authService.getActiveUser();
    const { propertyId, decision, rejectionReason } = req.body;

    if (!propertyId || !decision) {
      return res.status(400).json({ error: 'propertyId and decision are required' });
    }

    try {
      const updated = accommodationService.verifyProperty({
        propertyId,
        decision,
        reviewerUserId: user?.id || 'admin-usr',
        reviewerEmail: user?.email || 'admin@enermind.org',
        rejectionReason,
      });
      res.json({ success: true, property: updated });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Verification decision failed' });
    }
  });

  // Accommodation Reports Queue
  app.get('/api/admin/accommodation/reports', (req, res) => {
    res.json({ reports: accommodationService.getReports(req.query.status as any) });
  });

  app.post('/api/admin/accommodation/reports/:id/action', (req, res) => {
    const user = authService.getActiveUser();
    const { action, moderatorNotes } = req.body;

    try {
      const report = accommodationService.actionReport({
        reportId: req.params.id,
        action,
        moderatorUserId: user?.id || 'admin-usr',
        moderatorNotes,
      });
      res.json({ success: true, report });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Report action failed' });
    }
  });

  // Opportunity Moderation Queue
  app.get('/api/admin/opportunities/pending', (req, res) => {
    res.json({ pending: opportunitiesService.getPendingModerationOpportunities() });
  });

  app.post('/api/admin/opportunities/review', (req, res) => {
    const user = authService.getActiveUser();
    const { opportunityId, action, moderatorNotes } = req.body;

    if (!opportunityId || !action) {
      return res.status(400).json({ error: 'opportunityId and action are required' });
    }

    try {
      const updated = opportunitiesService.reviewOpportunityListing({
        opportunityId,
        action,
        reviewerUserId: user?.id || 'admin-usr',
        moderatorNotes,
      });
      res.json({ success: true, opportunity: updated });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Review failed' });
    }
  });

  // Employer Verifications Queue
  app.get('/api/admin/employers/verifications', (req, res) => {
    res.json({ verifications: opportunitiesService.getPendingEmployerVerifications() });
  });

  app.post('/api/admin/employers/verify', (req, res) => {
    const user = authService.getActiveUser();
    const { organizationId, decision, notes } = req.body;

    if (!organizationId || !decision) {
      return res.status(400).json({ error: 'organizationId and decision are required' });
    }

    try {
      const updated = opportunitiesService.verifyEmployer({
        organizationId,
        decision,
        reviewerUserId: user?.id || 'admin-usr',
        notes,
      });
      res.json({ success: true, organization: updated });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Verification decision failed' });
    }
  });

  // Opportunity Reports Queue
  app.get('/api/admin/opportunities/reports', (req, res) => {
    res.json({ reports: opportunitiesService.getReports(req.query.status as any) });
  });

  app.post('/api/admin/opportunities/reports/:id/action', (req, res) => {
    const user = authService.getActiveUser();
    const { action, moderatorNotes } = req.body;

    try {
      const report = opportunitiesService.actionReport(
        req.params.id,
        action,
        user?.id || 'admin-usr',
        moderatorNotes
      );
      res.json({ success: true, report });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Report action failed' });
    }
  });

  app.get('/api/admin/audit-logs', (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
    res.json({ logs: adminService.getAuditLogs(limit) });
  });

  // ==========================================
  // 9. PHASE 8: STUDENT ECONOMY (TASKS & GIGS)
  // ==========================================

  // Tasks Discovery & Search
  app.get('/api/tasks', (req, res) => {
    const {
      query,
      category,
      skill,
      country,
      city,
      campusId,
      remoteType,
      budgetType,
      minBudget,
      maxBudget,
      currency,
      sortBy,
      posterId,
      assignedWorkerId,
      status,
      page,
      limit,
    } = req.query;

    const result = tasksService.searchTasks({
      query: query as string,
      category: category as any,
      skill: skill as string,
      country: country as string,
      city: city as string,
      campusId: campusId as string,
      remoteType: remoteType as any,
      budgetType: budgetType as any,
      minBudget: minBudget ? parseFloat(minBudget as string) : undefined,
      maxBudget: maxBudget ? parseFloat(maxBudget as string) : undefined,
      currency: currency as string,
      sortBy: sortBy as any,
      posterId: posterId as string,
      assignedWorkerId: assignedWorkerId as string,
      status: status as any,
      page: page ? parseInt(page as string) : 1,
      limit: limit ? parseInt(limit as string) : 20,
    });

    res.json(result);
  });

  app.get('/api/tasks/fee-config', (req, res) => {
    res.json(tasksService.getPlatformFeeConfig());
  });

  app.get('/api/tasks/saved/ids', (req, res) => {
    const user = authService.getActiveUser();
    if (!user) return res.json({ savedIds: [] });
    res.json({ savedIds: tasksService.getUserSavedTaskIds(user.id) });
  });

  app.get('/api/tasks/user/applications', (req, res) => {
    const user = authService.getActiveUser();
    if (!user) return res.json({ applications: [] });
    res.json({ applications: tasksService.getUserApplications(user.id) });
  });

  app.get('/api/tasks/worker/earnings', (req, res) => {
    const user = authService.getActiveUser();
    if (!user) return res.status(401).json({ error: 'Authentication required' });
    res.json(tasksService.getWorkerEarningsSummary(user.id));
  });

  app.get('/api/tasks/worker/withdrawals', (req, res) => {
    const user = authService.getActiveUser();
    if (!user) return res.status(401).json({ error: 'Authentication required' });
    res.json({ withdrawals: tasksService.getUserWithdrawals(user.id) });
  });

  app.post('/api/tasks/worker/withdrawals', (req, res) => {
    const user = authService.getActiveUser();
    if (!user) return res.status(401).json({ error: 'Authentication required' });

    const { amount, currency, destinationType, destinationReference, recipientName } = req.body;
    const result = tasksService.requestWithdrawal({
      userId: user.id,
      userEmail: user.email,
      userName: user.displayName,
      amount: parseFloat(amount),
      currency: currency || 'USD',
      destinationType,
      destinationReference,
      recipientName: recipientName || user.displayName,
    });

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    res.json(result);
  });

  app.get('/api/tasks/worker/profile', (req, res) => {
    const user = authService.getActiveUser();
    const userId = (req.query.userId as string) || user?.id;
    if (!userId) return res.status(400).json({ error: 'User ID is required' });
    const profile = tasksService.getWorkerProfile(userId);
    res.json({ profile });
  });

  app.post('/api/tasks/worker/profile', (req, res) => {
    const user = authService.getActiveUser();
    if (!user) return res.status(401).json({ error: 'Authentication required' });
    const profile = tasksService.upsertWorkerProfile(user.id, req.body);
    res.json({ success: true, profile });
  });

  app.post('/api/tasks/ai/assist', async (req, res) => {
    const { action, taskContext, workerContext, customPrompt } = req.body;
    try {
      const result = await geminiService.assistTaskEconomy({
        action,
        taskContext,
        workerContext,
        customPrompt,
      });
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'AI assistance failed' });
    }
  });

  // Task by ID
  app.get('/api/tasks/:id', (req, res) => {
    const user = authService.getActiveUser();
    const task = tasksService.getTaskById(req.params.id, user?.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ task });
  });

  app.post('/api/tasks', (req, res) => {
    const user = authService.getActiveUser();
    if (!user) return res.status(401).json({ error: 'Authentication required' });

    const result = tasksService.createTask(
      req.body,
      user.id,
      user.role || UserRole.STUDENT
    );

    if (!result.success) {
      return res.status(400).json({ error: result.error, flagged: result.flagged });
    }
    res.json(result);
  });

  app.patch('/api/tasks/:id', (req, res) => {
    const user = authService.getActiveUser();
    if (!user) return res.status(401).json({ error: 'Authentication required' });

    const result = tasksService.updateTask(
      req.params.id,
      req.body,
      user.id,
      user.role
    );

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    res.json(result);
  });

  app.post('/api/tasks/:id/save', (req, res) => {
    const user = authService.getActiveUser();
    if (!user) return res.status(401).json({ error: 'Authentication required' });

    const result = tasksService.toggleSaveTask(user.id, req.params.id);
    res.json(result);
  });

  // Applications
  app.get('/api/tasks/:id/applications', (req, res) => {
    const user = authService.getActiveUser();
    if (!user) return res.status(401).json({ error: 'Authentication required' });

    const result = tasksService.getTaskApplications(req.params.id, user.id, user.role);
    if (result.error) return res.status(400).json({ error: result.error });
    res.json(result);
  });

  app.post('/api/tasks/:id/applications', (req, res) => {
    const user = authService.getActiveUser();
    if (!user) return res.status(401).json({ error: 'Authentication required' });

    const { proposal, bidAmount, currency, estimatedDuration, relevantSkills, portfolioLinks } = req.body;
    const result = tasksService.submitApplication({
      taskId: req.params.id,
      workerId: user.id,
      workerName: user.displayName,
      workerEmail: user.email,
      workerAvatar: user.avatarUrl,
      workerRole: user.role,
      proposal,
      bidAmount: parseFloat(bidAmount),
      currency: currency || 'USD',
      estimatedDuration,
      relevantSkills: relevantSkills || [],
      portfolioLinks: portfolioLinks || [],
    });

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    res.json(result);
  });

  // Assign & Fund Task
  app.post('/api/tasks/:id/assign', (req, res) => {
    const user = authService.getActiveUser();
    if (!user) return res.status(401).json({ error: 'Authentication required' });

    const { applicationId, orderId, paymentReference } = req.body;
    const result = tasksService.assignWorkerAndFundTask({
      taskId: req.params.id,
      applicationId,
      posterUserId: user.id,
      orderId,
      paymentReference,
    });

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    res.json(result);
  });

  // Deliverable Submissions
  app.get('/api/tasks/:id/submissions', (req, res) => {
    const user = authService.getActiveUser();
    if (!user) return res.status(401).json({ error: 'Authentication required' });

    const result = tasksService.getTaskSubmissions(req.params.id, user.id, user.role);
    if (result.error) return res.status(403).json({ error: result.error });
    res.json(result);
  });

  app.post('/api/tasks/:id/submissions', (req, res) => {
    const user = authService.getActiveUser();
    if (!user) return res.status(401).json({ error: 'Authentication required' });

    const { message, files, links } = req.body;
    const result = tasksService.submitDeliverable({
      taskId: req.params.id,
      workerUserId: user.id,
      workerName: user.displayName,
      message,
      files,
      links,
    });

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    res.json(result);
  });

  // Revisions & Completion
  app.post('/api/tasks/:id/revisions', (req, res) => {
    const user = authService.getActiveUser();
    if (!user) return res.status(401).json({ error: 'Authentication required' });

    const { reason } = req.body;
    const result = tasksService.requestRevision({
      taskId: req.params.id,
      posterUserId: user.id,
      reason,
    });

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    res.json(result);
  });

  app.post('/api/tasks/:id/complete', (req, res) => {
    const user = authService.getActiveUser();
    if (!user) return res.status(401).json({ error: 'Authentication required' });

    const result = tasksService.approveAndCompleteTask({
      taskId: req.params.id,
      posterUserId: user.id,
    });

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    res.json(result);
  });

  // Disputes
  app.post('/api/tasks/:id/disputes', (req, res) => {
    const user = authService.getActiveUser();
    if (!user) return res.status(401).json({ error: 'Authentication required' });

    const { reason, description, evidence, openedByRole } = req.body;
    const result = tasksService.openDispute({
      taskId: req.params.id,
      openedBy: user.id,
      openedByName: user.displayName,
      openedByRole: openedByRole || 'POSTER',
      reason,
      description,
      evidence,
    });

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    res.json(result);
  });

  // Reviews
  app.get('/api/tasks/:id/reviews', (req, res) => {
    res.json({ reviews: tasksService.getTaskReviews(req.params.id) });
  });

  app.post('/api/tasks/:id/reviews', (req, res) => {
    const user = authService.getActiveUser();
    if (!user) return res.status(401).json({ error: 'Authentication required' });

    const { rating, comment } = req.body;
    const result = tasksService.submitReview({
      taskId: req.params.id,
      reviewerId: user.id,
      reviewerName: user.displayName,
      reviewerAvatar: user.avatarUrl,
      rating: parseInt(rating),
      comment,
    });

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    res.json(result);
  });

  // Reports
  app.post('/api/tasks/:id/reports', (req, res) => {
    const user = authService.getActiveUser();
    const { reason, details } = req.body;
    const result = tasksService.reportTask({
      taskId: req.params.id,
      reportedByUserId: user?.id || 'anon-usr',
      reportedByUserEmail: user?.email,
      reason,
      details,
    });

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    res.json(result);
  });

  // --- Admin Task Economy Routes ---
  app.get('/api/admin/tasks/disputes', (req, res) => {
    res.json({ disputes: tasksService.getDisputes(req.query.status as string) });
  });

  app.post('/api/admin/tasks/disputes/:id/resolve', (req, res) => {
    const user = authService.getActiveUser();
    const { decision, resolutionNotes } = req.body;
    const result = tasksService.resolveDispute({
      disputeId: req.params.id,
      decision,
      resolutionNotes,
      adminUserId: user?.id || 'admin-usr',
    });
    if (!result.success) return res.status(400).json({ error: result.error });
    res.json(result);
  });

  app.get('/api/admin/tasks/reports', (req, res) => {
    res.json({ reports: tasksService.getReports(req.query.status as string) });
  });

  app.post('/api/admin/tasks/reports/:id/action', (req, res) => {
    const user = authService.getActiveUser();
    const { action, moderatorNotes } = req.body;
    const result = tasksService.actionTaskReport({
      reportId: req.params.id,
      action,
      moderatorNotes,
      adminUserId: user?.id || 'admin-usr',
    });
    if (!result.success) return res.status(400).json({ error: result.error });
    res.json(result);
  });

  app.get('/api/admin/tasks/withdrawals', (req, res) => {
    res.json({ withdrawals: tasksService.getAllWithdrawals() });
  });

  app.post('/api/admin/tasks/withdrawals/:id/process', (req, res) => {
    const user = authService.getActiveUser();
    const { action, rejectionReason } = req.body;
    const result = tasksService.processWithdrawal({
      withdrawalId: req.params.id,
      action,
      rejectionReason,
      adminUserId: user?.id || 'admin-usr',
    });
    if (!result.success) return res.status(400).json({ error: result.error });
    res.json(result);
  });

  app.post('/api/admin/tasks/fee-config', (req, res) => {
    const user = authService.getActiveUser();
    const updated = tasksService.updatePlatformFeeConfig(req.body, user?.id || 'admin-usr');
    res.json({ success: true, config: updated });
  });

  // ==========================================
  // 10. VITE MIDDLEWARE (DEV) & STATIC (PROD)
  // ==========================================

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Enermind Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Enermind Server Startup Error]:', err);
});
