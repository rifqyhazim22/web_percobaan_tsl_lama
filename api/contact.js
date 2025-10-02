const path = require('path');
const {
  handleContactSubmission,
  ensureContactsFile
} = require('../server');

module.exports = (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'error', message: 'Method Not Allowed' }));
    return;
  }

  // Store contact submissions in a writable temp directory on Vercel.
  if (!process.env.CONTACTS_FILE_PATH) {
    process.env.CONTACTS_FILE_PATH = path.join('/tmp', 'contacts.json');
  }

  try {
    ensureContactsFile();
  } catch (err) {
    console.error('Failed to initialise contacts store', err);
  }

  handleContactSubmission(req, res);
};
