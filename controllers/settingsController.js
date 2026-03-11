const Setting = require('../models/Setting');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

const HERO_TEXT_FIELDS = [
  'heroTitle',
  'heroSubtitle',
  'heroDescription',
  'heroImageUrl',
  'heroVideoUrl',
  'heroBadge',
  'heroSlogan',
  'heroCtaPrimary',
  'heroCtaSecondary',
  'heroAffiliationLine1',
  'heroAffiliationLine2',
  'heroAffiliationLine3',
  'heroStat1Value',
  'heroStat1Label',
  'heroStat2Value',
  'heroStat2Label',
  'heroStat3Value',
  'heroStat3Label',
  'heroStat4Value',
  'heroStat4Label',
  'heroLogo1Url',
  'heroLogo2Url',
  'heroLogo3Url',
];

const HERO_BOOL_FIELDS = [
  'heroEnabled',
  'heroShowAffiliations',
  'heroShowStats',
  'heroShowLogos',
];

const MINI_TOURNAMENT_TEXT_FIELDS = [
  'miniTournamentBadge',
  'miniTournamentTitle',
  'miniTournamentMediaImageUrl',
  'miniTournamentMediaVideoUrl',
  'miniTournamentWhenWhereTitle',
  'miniTournamentWhenWhereText',
  'miniTournamentWhoCanPlayTitle',
  'miniTournamentWhoCanPlayText',
  'miniTournamentHowToRegisterTitle',
  'miniTournamentBullet1',
  'miniTournamentBullet2',
  'miniTournamentPrimaryCtaLabel',
  'miniTournamentPrimaryCtaUrl',
  'miniTournamentSecondaryCtaLabel',
  'miniTournamentSecondaryCtaUrl',
  'miniTournamentAffiliationButtonLabel',
  'miniTournamentAffiliationFeeText',
  'miniTournamentRegistrationFeeLabel',
  'miniTournamentRegistrationFeeValue',
];

const MINI_TOURNAMENT_BOOL_FIELDS = [
  'miniTournamentEnabled',
];

const parseBooleanLike = (value) => {
  if (typeof value === 'boolean') return value;
  if (value === 'true') return true;
  if (value === 'false') return false;
  return undefined;
};

const assignHeroFieldsFromBody = (update, body = {}) => {
  HERO_TEXT_FIELDS.forEach((key) => {
    if (typeof body[key] !== 'undefined') update[key] = body[key];
  });
  HERO_BOOL_FIELDS.forEach((key) => {
    const parsed = parseBooleanLike(body[key]);
    if (typeof parsed === 'boolean') update[key] = parsed;
  });
};

const unlinkIfExists = (file) => {
  if (!file || !file.path) return;
  try {
    if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
  } catch (err) {
    console.error('Failed to cleanup temp hero upload file:', err);
  }
};

// Get public settings (non-authenticated)
exports.getPublicSettings = async (req, res) => {
  try {
    const settings = await Setting.findOne().sort({ createdAt: -1 });
    // defaults if not present
    const showIdsToUsers = settings ? settings.showIdsToUsers : true;
    const allowGallery = settings ? (typeof settings.allowGallery === 'boolean' ? settings.allowGallery : true) : true;
    const allowNews = settings ? (typeof settings.allowNews === 'boolean' ? settings.allowNews : true) : true;
    const allowContacts = settings ? (typeof settings.allowContacts === 'boolean' ? settings.allowContacts : true) : true;
    const allowDonations = settings ? (typeof settings.allowDonations === 'boolean' ? settings.allowDonations : true) : true;
    const allowImportantDocs = settings ? (typeof settings.allowImportantDocs === 'boolean' ? settings.allowImportantDocs : true) : true;
    const allowUnifiedSearch = settings ? (typeof settings.allowUnifiedSearch === 'boolean' ? settings.allowUnifiedSearch : true) : true;
    const allowRefereeBoard = settings ? (typeof settings.allowRefereeBoard === 'boolean' ? settings.allowRefereeBoard : true) : true;
    // New export controls (public-facing)
    const allowExportAll = settings ? (typeof settings.allowExportAll === 'boolean' ? settings.allowExportAll : true) : true;
    const allowExportPlayers = settings ? (typeof settings.allowExportPlayers === 'boolean' ? settings.allowExportPlayers : true) : true;
    const allowExportTechnicalOfficials = settings ? (typeof settings.allowExportTechnicalOfficials === 'boolean' ? settings.allowExportTechnicalOfficials : true) : true;
    const allowExportInstitutions = settings ? (typeof settings.allowExportInstitutions === 'boolean' ? settings.allowExportInstitutions : true) : true;
    const emailEnabled = settings ? (typeof settings.emailEnabled === 'boolean' ? settings.emailEnabled : true) : true;
    const heroData = {
      heroEnabled: settings ? (typeof settings.heroEnabled === 'boolean' ? settings.heroEnabled : true) : true,
      heroShowAffiliations: settings ? (typeof settings.heroShowAffiliations === 'boolean' ? settings.heroShowAffiliations : true) : true,
      heroShowStats: settings ? (typeof settings.heroShowStats === 'boolean' ? settings.heroShowStats : true) : true,
      heroShowLogos: settings ? (typeof settings.heroShowLogos === 'boolean' ? settings.heroShowLogos : true) : true,
      heroTitle: settings ? (settings.heroTitle || '') : '',
      heroSubtitle: settings ? (settings.heroSubtitle || '') : '',
      heroDescription: settings ? (settings.heroDescription || '') : '',
      heroImageUrl: settings ? (settings.heroImageUrl || '') : '',
      heroVideoUrl: settings ? (settings.heroVideoUrl || '') : '',
      heroBadge: settings ? (settings.heroBadge || '') : '',
      heroSlogan: settings ? (settings.heroSlogan || '') : '',
      heroCtaPrimary: settings ? (settings.heroCtaPrimary || '') : '',
      heroCtaSecondary: settings ? (settings.heroCtaSecondary || '') : '',
      heroAffiliationLine1: settings ? (settings.heroAffiliationLine1 || '') : '',
      heroAffiliationLine2: settings ? (settings.heroAffiliationLine2 || '') : '',
      heroAffiliationLine3: settings ? (settings.heroAffiliationLine3 || '') : '',
      heroStat1Value: settings ? (settings.heroStat1Value || '') : '',
      heroStat1Label: settings ? (settings.heroStat1Label || '') : '',
      heroStat2Value: settings ? (settings.heroStat2Value || '') : '',
      heroStat2Label: settings ? (settings.heroStat2Label || '') : '',
      heroStat3Value: settings ? (settings.heroStat3Value || '') : '',
      heroStat3Label: settings ? (settings.heroStat3Label || '') : '',
      heroStat4Value: settings ? (settings.heroStat4Value || '') : '',
      heroStat4Label: settings ? (settings.heroStat4Label || '') : '',
      heroLogo1Url: settings ? (settings.heroLogo1Url || '') : '',
      heroLogo2Url: settings ? (settings.heroLogo2Url || '') : '',
      heroLogo3Url: settings ? (settings.heroLogo3Url || '') : '',
    };

    const miniTournamentData = {
      miniTournamentEnabled: settings ? (typeof settings.miniTournamentEnabled === 'boolean' ? settings.miniTournamentEnabled : true) : true,
      miniTournamentBadge: settings ? (settings.miniTournamentBadge || '') : '',
      miniTournamentTitle: settings ? (settings.miniTournamentTitle || '') : '',
      miniTournamentMediaImageUrl: settings ? (settings.miniTournamentMediaImageUrl || '') : '',
      miniTournamentMediaVideoUrl: settings ? (settings.miniTournamentMediaVideoUrl || '') : '',
      miniTournamentWhenWhereTitle: settings ? (settings.miniTournamentWhenWhereTitle || '') : '',
      miniTournamentWhenWhereText: settings ? (settings.miniTournamentWhenWhereText || '') : '',
      miniTournamentWhoCanPlayTitle: settings ? (settings.miniTournamentWhoCanPlayTitle || '') : '',
      miniTournamentWhoCanPlayText: settings ? (settings.miniTournamentWhoCanPlayText || '') : '',
      miniTournamentHowToRegisterTitle: settings ? (settings.miniTournamentHowToRegisterTitle || '') : '',
      miniTournamentBullet1: settings ? (settings.miniTournamentBullet1 || '') : '',
      miniTournamentBullet2: settings ? (settings.miniTournamentBullet2 || '') : '',
      miniTournamentPrimaryCtaLabel: settings ? (settings.miniTournamentPrimaryCtaLabel || '') : '',
      miniTournamentPrimaryCtaUrl: settings ? (settings.miniTournamentPrimaryCtaUrl || '') : '',
      miniTournamentSecondaryCtaLabel: settings ? (settings.miniTournamentSecondaryCtaLabel || '') : '',
      miniTournamentSecondaryCtaUrl: settings ? (settings.miniTournamentSecondaryCtaUrl || '') : '',
      miniTournamentAffiliationButtonLabel: settings ? (settings.miniTournamentAffiliationButtonLabel || '') : '',
      miniTournamentAffiliationFeeText: settings ? (settings.miniTournamentAffiliationFeeText || '') : '',
      miniTournamentRegistrationFeeLabel: settings ? (settings.miniTournamentRegistrationFeeLabel || '') : '',
      miniTournamentRegistrationFeeValue: settings ? (settings.miniTournamentRegistrationFeeValue || '') : '',
    };

    res.status(200).json({ success: true, data: { showIdsToUsers, allowGallery, allowNews, allowContacts, allowDonations, allowImportantDocs, allowUnifiedSearch, allowRefereeBoard, allowExportAll, allowExportPlayers, allowExportTechnicalOfficials, allowExportInstitutions, emailEnabled, ...heroData, ...miniTournamentData } });
  } catch (err) {
    console.error('getPublicSettings error', err);
    res.status(500).json({ success: false, message: 'Failed to get settings' });
  }
};

// Admin-only: get full settings
exports.getSettings = async (req, res) => {
  try {
    const settings = await Setting.findOne().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: settings || { showIdsToUsers: true } });
  } catch (err) {
    console.error('getSettings error', err);
    res.status(500).json({ success: false, message: 'Failed to get settings' });
  }
};

// Admin-only: update settings
exports.updateSettings = async (req, res) => {
  try {
    const { showIdsToUsers, allowGallery, allowNews, allowContacts, allowDonations, allowImportantDocs, allowUnifiedSearch, allowRefereeBoard, allowExportAll, allowExportPlayers, allowExportTechnicalOfficials, allowExportInstitutions, emailEnabled } = req.body;
    const update = {};
    if (typeof showIdsToUsers !== 'undefined') update.showIdsToUsers = showIdsToUsers;
    if (typeof allowGallery !== 'undefined') update.allowGallery = allowGallery;
    if (typeof allowNews !== 'undefined') update.allowNews = allowNews;
    if (typeof allowContacts !== 'undefined') update.allowContacts = allowContacts;
    if (typeof allowDonations !== 'undefined') update.allowDonations = allowDonations;
    if (typeof allowImportantDocs !== 'undefined') update.allowImportantDocs = allowImportantDocs;
    if (typeof allowUnifiedSearch !== 'undefined') update.allowUnifiedSearch = allowUnifiedSearch;
    if (typeof allowRefereeBoard !== 'undefined') update.allowRefereeBoard = allowRefereeBoard;
    if (typeof allowExportAll !== 'undefined') update.allowExportAll = allowExportAll;
    if (typeof allowExportPlayers !== 'undefined') update.allowExportPlayers = allowExportPlayers;
    if (typeof allowExportTechnicalOfficials !== 'undefined') update.allowExportTechnicalOfficials = allowExportTechnicalOfficials;
    if (typeof allowExportInstitutions !== 'undefined') update.allowExportInstitutions = allowExportInstitutions;
    if (typeof emailEnabled !== 'undefined') update.emailEnabled = emailEnabled;
    assignHeroFieldsFromBody(update, req.body);
    assignMiniTournamentFieldsFromBody(update, req.body);
    const settings = await Setting.findOneAndUpdate({}, { $set: update }, { new: true, upsert: true });
    res.status(200).json({ success: true, message: 'Settings updated', data: settings });
  } catch (err) {
    console.error('updateSettings error', err);
    res.status(500).json({ success: false, message: 'Failed to update settings' });
  }
};

// Admin-only: update hero settings with optional image/video upload
exports.updateHeroSettings = async (req, res) => {
  try {
    const update = {};
    assignHeroFieldsFromBody(update, req.body);

    const clearHeroImage = parseBooleanLike(req.body.clearHeroImage);
    const clearHeroVideo = parseBooleanLike(req.body.clearHeroVideo);
    if (clearHeroImage === true) update.heroImageUrl = '';
    if (clearHeroVideo === true) update.heroVideoUrl = '';

    const files = req.files || {};
    const imageFile = Array.isArray(files.heroImage) ? files.heroImage[0] : null;
    const videoFile = Array.isArray(files.heroVideo) ? files.heroVideo[0] : null;

    if (imageFile) {
      const uploadedImage = await cloudinary.uploader.upload(imageFile.path, {
        folder: 'ddka/hero',
        resource_type: 'image',
      });
      update.heroImageUrl = uploadedImage.secure_url;
      unlinkIfExists(imageFile);
    }

    if (videoFile) {
      const uploadedVideo = await cloudinary.uploader.upload(videoFile.path, {
        folder: 'ddka/hero',
        resource_type: 'video',
      });
      update.heroVideoUrl = uploadedVideo.secure_url;
      unlinkIfExists(videoFile);
    }

    const settings = await Setting.findOneAndUpdate({}, { $set: update }, { new: true, upsert: true });
    return res.status(200).json({ success: true, message: 'Hero settings updated', data: settings });
  } catch (err) {
    const files = req.files || {};
    unlinkIfExists(Array.isArray(files.heroImage) ? files.heroImage[0] : null);
    unlinkIfExists(Array.isArray(files.heroVideo) ? files.heroVideo[0] : null);
    console.error('updateHeroSettings error', err);
    return res.status(500).json({ success: false, message: 'Failed to update hero settings' });
  }
};

// Admin-only: update mini tournament section settings with optional media upload
exports.updateMiniTournamentSettings = async (req, res) => {
  try {
    const update = {};
    assignMiniTournamentFieldsFromBody(update, req.body);

    const clearMiniTournamentImage = parseBooleanLike(req.body.clearMiniTournamentImage);
    const clearMiniTournamentVideo = parseBooleanLike(req.body.clearMiniTournamentVideo);
    if (clearMiniTournamentImage === true) update.miniTournamentMediaImageUrl = '';
    if (clearMiniTournamentVideo === true) update.miniTournamentMediaVideoUrl = '';

    const files = req.files || {};
    const imageFile = Array.isArray(files.miniTournamentImage) ? files.miniTournamentImage[0] : null;
    const videoFile = Array.isArray(files.miniTournamentVideo) ? files.miniTournamentVideo[0] : null;

    if (imageFile) {
      const uploadedImage = await cloudinary.uploader.upload(imageFile.path, {
        folder: 'ddka/home-mini-tournament',
        resource_type: 'image',
      });
      update.miniTournamentMediaImageUrl = uploadedImage.secure_url;
      unlinkIfExists(imageFile);
    }

    if (videoFile) {
      const uploadedVideo = await cloudinary.uploader.upload(videoFile.path, {
        folder: 'ddka/home-mini-tournament',
        resource_type: 'video',
      });
      update.miniTournamentMediaVideoUrl = uploadedVideo.secure_url;
      unlinkIfExists(videoFile);
    }

    const settings = await Setting.findOneAndUpdate({}, { $set: update }, { new: true, upsert: true });
    return res.status(200).json({ success: true, message: 'Mini tournament settings updated', data: settings });
  } catch (err) {
    const files = req.files || {};
    unlinkIfExists(Array.isArray(files.miniTournamentImage) ? files.miniTournamentImage[0] : null);
    unlinkIfExists(Array.isArray(files.miniTournamentVideo) ? files.miniTournamentVideo[0] : null);
    console.error('updateMiniTournamentSettings error', err);
    return res.status(500).json({ success: false, message: 'Failed to update mini tournament settings' });
  }
};

const assignMiniTournamentFieldsFromBody = (update, body = {}) => {
  MINI_TOURNAMENT_TEXT_FIELDS.forEach((key) => {
    if (typeof body[key] !== 'undefined') update[key] = body[key];
  });
  MINI_TOURNAMENT_BOOL_FIELDS.forEach((key) => {
    const parsed = parseBooleanLike(body[key]);
    if (typeof parsed === 'boolean') update[key] = parsed;
  });
};