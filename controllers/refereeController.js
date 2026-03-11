const Referee = require('../models/Referee');
const TechnicalOfficial = require('../models/TechnicalOfficial');

const toLegacyRefereePayload = (doc) => ({
  _id: doc._id,
  source: 'legacy',
  name: doc.name,
  qualification: doc.qualification,
  boardPost: doc.boardPost || '',
  photoUrl: '',
  showOnRefereeBoard: doc.isActive !== false,
  status: doc.isActive === false ? 'Hidden' : 'Active',
});

const toTechnicalRefereePayload = (doc) => ({
  _id: doc._id,
  source: 'technical',
  name: doc.candidateName,
  qualification: doc.work || doc.playerLevel || 'Technical Official',
  boardPost: doc.boardPost || '',
  photoUrl: doc.photoUrl || '',
  showOnRefereeBoard: doc.showOnRefereeBoard !== false,
  status: doc.status,
});

const byNameAsc = (a, b) => (a.name || '').localeCompare(b.name || '');

// Public: Hall of Fame referee list sourced from legacy Referees + Technical Officials
exports.getAllReferees = async (_req, res) => {
  try {
    const [legacyReferees, technicalOfficials] = await Promise.all([
      Referee.find({ isActive: true }).select('name qualification boardPost isActive').sort({ name: 1 }),
      TechnicalOfficial.find({ showOnRefereeBoard: { $ne: false } })
        .select('candidateName work playerLevel boardPost photoUrl showOnRefereeBoard status')
        .sort({ candidateName: 1 }),
    ]);

    const merged = [
      ...legacyReferees.map(toLegacyRefereePayload),
      ...technicalOfficials.map(toTechnicalRefereePayload),
    ].sort(byNameAsc);

    return res.status(200).json(merged);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching referees', error: error.message });
  }
};

// Admin: list all referee-board entries (legacy + technical)
exports.getAdminReferees = async (_req, res) => {
  try {
    const [legacyReferees, technicalOfficials] = await Promise.all([
      Referee.find({}).select('name qualification boardPost isActive createdAt').sort({ createdAt: -1 }),
      TechnicalOfficial.find({})
        .select('candidateName work playerLevel boardPost photoUrl showOnRefereeBoard status createdAt')
        .sort({ createdAt: -1 }),
    ]);

    const merged = [
      ...legacyReferees.map(toLegacyRefereePayload),
      ...technicalOfficials.map(toTechnicalRefereePayload),
    ].sort(byNameAsc);

    return res.status(200).json(merged);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching referee board entries', error: error.message });
  }
};

// Superadmin: hide/show a referee board member from either source
exports.updateRefereeVisibility = async (req, res) => {
  try {
    const { showOnRefereeBoard, source } = req.body;

    if (typeof showOnRefereeBoard !== 'boolean') {
      return res.status(400).json({ message: 'showOnRefereeBoard must be boolean' });
    }

    if (source === 'legacy') {
      const legacy = await Referee.findByIdAndUpdate(
        req.params.id,
        { isActive: showOnRefereeBoard },
        { new: true, runValidators: true }
      ).select('name qualification boardPost isActive');

      if (!legacy) return res.status(404).json({ message: 'Legacy referee not found' });

      return res.status(200).json({ message: 'Referee board visibility updated', data: toLegacyRefereePayload(legacy) });
    }

    if (source === 'technical') {
      const official = await TechnicalOfficial.findByIdAndUpdate(
        req.params.id,
        { showOnRefereeBoard },
        { new: true, runValidators: true }
      ).select('candidateName work playerLevel boardPost photoUrl showOnRefereeBoard status');

      if (!official) return res.status(404).json({ message: 'Technical official not found' });

      return res.status(200).json({ message: 'Referee board visibility updated', data: toTechnicalRefereePayload(official) });
    }

    // Backward-compatible fallback when source is not provided.
    const official = await TechnicalOfficial.findByIdAndUpdate(
      req.params.id,
      { showOnRefereeBoard },
      { new: true, runValidators: true }
    ).select('candidateName work playerLevel boardPost photoUrl showOnRefereeBoard status');

    if (official) {
      return res.status(200).json({ message: 'Referee board visibility updated', data: toTechnicalRefereePayload(official) });
    }

    const legacy = await Referee.findByIdAndUpdate(
      req.params.id,
      { isActive: showOnRefereeBoard },
      { new: true, runValidators: true }
    ).select('name qualification boardPost isActive');

    if (legacy) {
      return res.status(200).json({ message: 'Referee board visibility updated', data: toLegacyRefereePayload(legacy) });
    }

    return res.status(404).json({ message: 'Referee entry not found' });
  } catch (error) {
    return res.status(400).json({ message: 'Error updating referee visibility', error: error.message });
  }
};

// Admin: update referee board post/title (Chairman, Secretary, etc.)
exports.updateRefereePost = async (req, res) => {
  try {
    const { source, boardPost } = req.body;

    if (typeof boardPost !== 'string') {
      return res.status(400).json({ message: 'boardPost must be a string' });
    }

    const normalizedPost = boardPost.trim();

    if (source === 'legacy') {
      const legacy = await Referee.findByIdAndUpdate(
        req.params.id,
        { boardPost: normalizedPost },
        { new: true, runValidators: true }
      ).select('name qualification boardPost isActive');

      if (!legacy) return res.status(404).json({ message: 'Legacy referee not found' });
      return res.status(200).json({ message: 'Referee post updated', data: toLegacyRefereePayload(legacy) });
    }

    if (source === 'technical') {
      const official = await TechnicalOfficial.findByIdAndUpdate(
        req.params.id,
        { boardPost: normalizedPost },
        { new: true, runValidators: true }
      ).select('candidateName work playerLevel boardPost photoUrl showOnRefereeBoard status');

      if (!official) return res.status(404).json({ message: 'Technical official not found' });
      return res.status(200).json({ message: 'Referee post updated', data: toTechnicalRefereePayload(official) });
    }

    return res.status(400).json({ message: 'source is required (legacy or technical)' });
  } catch (error) {
    return res.status(400).json({ message: 'Error updating referee post', error: error.message });
  }
};

// Admin: delete only legacy referee entries (non-technical source)
exports.deleteLegacyReferee = async (req, res) => {
  try {
    const { source } = req.body || {};

    if (source !== 'legacy') {
      return res.status(400).json({ message: 'Only legacy referee entries can be deleted' });
    }

    const deleted = await Referee.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Legacy referee not found' });
    }

    return res.status(200).json({ message: 'Legacy referee deleted successfully' });
  } catch (error) {
    return res.status(400).json({ message: 'Error deleting legacy referee', error: error.message });
  }
};

// Admin: edit only legacy referee entry details
exports.updateLegacyRefereeEntry = async (req, res) => {
  try {
    const { source, name, qualification } = req.body || {};

    if (source !== 'legacy') {
      return res.status(400).json({ message: 'Only legacy referee entries can be edited' });
    }

    const update = {};
    if (typeof name === 'string') update.name = name.trim();
    if (typeof qualification === 'string') update.qualification = qualification.trim();

    if (!update.name || !update.qualification) {
      return res.status(400).json({ message: 'name and qualification are required' });
    }

    const updated = await Referee.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true, runValidators: true }
    ).select('name qualification boardPost isActive');

    if (!updated) {
      return res.status(404).json({ message: 'Legacy referee not found' });
    }

    return res.status(200).json({ message: 'Legacy referee updated successfully', data: toLegacyRefereePayload(updated) });
  } catch (error) {
    return res.status(400).json({ message: 'Error updating legacy referee', error: error.message });
  }
};

// Admin: create additional legacy referee entries
exports.createLegacyRefereeEntry = async (req, res) => {
  try {
    const { name, qualification, boardPost } = req.body || {};

    if (typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ message: 'name is required' });
    }

    if (typeof qualification !== 'string' || !qualification.trim()) {
      return res.status(400).json({ message: 'qualification is required' });
    }

    const created = await Referee.create({
      name: name.trim(),
      qualification: qualification.trim(),
      boardPost: typeof boardPost === 'string' ? boardPost.trim() : '',
      isActive: true,
    });

    return res.status(201).json({ message: 'Legacy referee created successfully', data: toLegacyRefereePayload(created) });
  } catch (error) {
    return res.status(400).json({ message: 'Error creating legacy referee', error: error.message });
  }
};
