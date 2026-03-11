const mongoose = require('mongoose');

const SettingSchema = new mongoose.Schema({
  showIdsToUsers: {
    type: Boolean,
    default: true,
  },
  // Feature flags for public/export controls
  allowGallery: {
    type: Boolean,
    default: true,
  },
  allowNews: {
    type: Boolean,
    default: true,
  },
  allowContacts: {
    type: Boolean,
    default: true,
  },
  allowDonations: {
    type: Boolean,
    default: true,
  },
  allowImportantDocs: {
    type: Boolean,
    default: true,
  },
  allowUnifiedSearch: {
    type: Boolean,
    default: true,
  },
  allowRefereeBoard: {
    type: Boolean,
    default: true,
  },
  // New export toggles
  // Unified export control: when false, all export UI/features should be disabled
  allowExportAll: {
    type: Boolean,
    default: true,
  },
  // Legacy per-module toggles (kept for backward compatibility)
  allowExportPlayers: {
    type: Boolean,
    default: true,
  },
  allowExportTechnicalOfficials: {
    type: Boolean,
    default: true,
  },
  allowExportInstitutions: {
    type: Boolean,
    default: true,
  },

  // Email sending toggle for nodemailer (admin controlled)
  emailEnabled: {
    type: Boolean,
    default: true,
  },

  // Hero section controls/content
  heroEnabled: {
    type: Boolean,
    default: true,
  },
  heroTitle: {
    type: String,
    trim: true,
    default: '',
  },
  heroSubtitle: {
    type: String,
    trim: true,
    default: '',
  },
  heroDescription: {
    type: String,
    trim: true,
    default: '',
  },
  heroImageUrl: {
    type: String,
    trim: true,
    default: '',
  },
  heroVideoUrl: {
    type: String,
    trim: true,
    default: '',
  },
  heroBadge: {
    type: String,
    trim: true,
    default: '',
  },
  heroSlogan: {
    type: String,
    trim: true,
    default: '',
  },
  heroCtaPrimary: {
    type: String,
    trim: true,
    default: '',
  },
  heroCtaSecondary: {
    type: String,
    trim: true,
    default: '',
  },
  heroAffiliationLine1: {
    type: String,
    trim: true,
    default: '',
  },
  heroAffiliationLine2: {
    type: String,
    trim: true,
    default: '',
  },
  heroAffiliationLine3: {
    type: String,
    trim: true,
    default: '',
  },
  heroStat1Value: {
    type: String,
    trim: true,
    default: '',
  },
  heroStat1Label: {
    type: String,
    trim: true,
    default: '',
  },
  heroStat2Value: {
    type: String,
    trim: true,
    default: '',
  },
  heroStat2Label: {
    type: String,
    trim: true,
    default: '',
  },
  heroStat3Value: {
    type: String,
    trim: true,
    default: '',
  },
  heroStat3Label: {
    type: String,
    trim: true,
    default: '',
  },
  heroStat4Value: {
    type: String,
    trim: true,
    default: '',
  },
  heroStat4Label: {
    type: String,
    trim: true,
    default: '',
  },
  heroLogo1Url: {
    type: String,
    trim: true,
    default: '',
  },
  heroLogo2Url: {
    type: String,
    trim: true,
    default: '',
  },
  heroLogo3Url: {
    type: String,
    trim: true,
    default: '',
  },
  heroShowAffiliations: {
    type: Boolean,
    default: true,
  },
  heroShowStats: {
    type: Boolean,
    default: true,
  },
  heroShowLogos: {
    type: Boolean,
    default: true,
  },

  // Home mini tournament section controls/content
  miniTournamentEnabled: {
    type: Boolean,
    default: true,
  },
  miniTournamentBadge: {
    type: String,
    trim: true,
    default: '',
  },
  miniTournamentTitle: {
    type: String,
    trim: true,
    default: '',
  },
  miniTournamentMediaImageUrl: {
    type: String,
    trim: true,
    default: '',
  },
  miniTournamentMediaVideoUrl: {
    type: String,
    trim: true,
    default: '',
  },
  miniTournamentWhenWhereTitle: {
    type: String,
    trim: true,
    default: '',
  },
  miniTournamentWhenWhereText: {
    type: String,
    trim: true,
    default: '',
  },
  miniTournamentWhoCanPlayTitle: {
    type: String,
    trim: true,
    default: '',
  },
  miniTournamentWhoCanPlayText: {
    type: String,
    trim: true,
    default: '',
  },
  miniTournamentHowToRegisterTitle: {
    type: String,
    trim: true,
    default: '',
  },
  miniTournamentBullet1: {
    type: String,
    trim: true,
    default: '',
  },
  miniTournamentBullet2: {
    type: String,
    trim: true,
    default: '',
  },
  miniTournamentPrimaryCtaLabel: {
    type: String,
    trim: true,
    default: '',
  },
  miniTournamentPrimaryCtaUrl: {
    type: String,
    trim: true,
    default: '',
  },
  miniTournamentSecondaryCtaLabel: {
    type: String,
    trim: true,
    default: '',
  },
  miniTournamentSecondaryCtaUrl: {
    type: String,
    trim: true,
    default: '',
  },
  miniTournamentAffiliationButtonLabel: {
    type: String,
    trim: true,
    default: '',
  },
  miniTournamentAffiliationFeeText: {
    type: String,
    trim: true,
    default: '',
  },
  miniTournamentRegistrationFeeLabel: {
    type: String,
    trim: true,
    default: '',
  },
  miniTournamentRegistrationFeeValue: {
    type: String,
    trim: true,
    default: '',
  },

}, { timestamps: true });

module.exports = mongoose.model('Setting', SettingSchema);