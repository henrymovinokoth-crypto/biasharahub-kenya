const fs = require('fs');
const path = require('path');

// Auto-load .env file if it exists
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split(/\r?\n/).forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const idx = trimmed.indexOf('=');
      const key = trimmed.substring(0, idx).trim();
      const val = trimmed.substring(idx + 1).trim();
      if (!process.env[key]) process.env[key] = val;
    }
  });
}

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Setup upload folder
const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer storage for images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname) || '.jpg';
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'listing-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ==========================================
// API ROUTES
// ==========================================

// 1. Get Public Settings (M-Pesa details & Pricing)
app.get('/api/settings', (req, res) => {
  const settings = db.getSettings();
  // Don't expose admin password
  res.json({
    mpesaNumber: settings.mpesaNumber,
    mpesaName: settings.mpesaName,
    pricing: settings.pricing
  });
});

// 2. Get Listings (with search, category, location, and type filters)
app.get('/api/listings', (req, res) => {
  try {
    const filters = {
      type: req.query.type,
      category: req.query.category,
      location: req.query.location,
      q: req.query.q,
      includeAllStatus: false
    };
    const listings = db.getAllListings(filters);
    res.json({ success: true, count: listings.length, listings });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error retrieving listings' });
  }
});

// 3. Get Single Listing Details
app.get('/api/listings/:id', (req, res) => {
  try {
    const listing = db.getListingById(req.params.id, true);
    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }
    res.json({ success: true, listing });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// 4. Create New Listing (with M-Pesa payment information)
app.post('/api/listings', upload.single('image'), (req, res) => {
  try {
    const body = req.body;

    // Validation
    if (!body.title || !body.type || !body.contact_name || !body.phone || !body.mpesa_code) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields including the M-Pesa transaction code.'
      });
    }

    let imageUrl = body.image_url || '';
    if (req.file) {
      imageUrl = '/uploads/' + req.file.filename;
    } else if (!imageUrl) {
      // Default placeholder based on category
      if (body.type === 'job') {
        imageUrl = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&auto=format&fit=crop&q=80';
      } else if (body.type === 'institution') {
        imageUrl = 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80';
      } else if (body.type === 'business') {
        imageUrl = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80';
      } else {
        imageUrl = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80';
      }
    }

    const listingData = {
      ...body,
      image_url: imageUrl
    };

    const created = db.createListing(listingData);

    res.status(201).json({
      success: true,
      message: 'Listing submitted successfully! Once Henry Okoth verifies your M-Pesa payment, your ad will go live.',
      listing: created
    });
  } catch (err) {
    console.error('Error creating listing:', err);
    res.status(500).json({ success: false, message: 'Failed to create listing: ' + err.message });
  }
});

// ==========================================
// ADMIN API ROUTES (Secured with Henry's Passkey)
// ==========================================

const checkAdminAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const settings = db.getSettings();
  const token = authHeader && authHeader.split(' ')[1];

  if (!token || token !== settings.adminPassword) {
    return res.status(401).json({ success: false, message: 'Unauthorized. Invalid Admin Passkey.' });
  }
  next();
};

// Admin Login Check
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  const settings = db.getSettings();
  if (password === settings.adminPassword) {
    res.json({ success: true, token: settings.adminPassword, mpesaName: settings.mpesaName });
  } else {
    res.status(401).json({ success: false, message: 'Invalid admin password' });
  }
});

// Admin: Get all listings including pending and rejected
app.get('/api/admin/listings', checkAdminAuth, (req, res) => {
  const listings = db.getAllListings({ includeAllStatus: true });
  res.json({ success: true, listings });
});

// Admin: Get overview analytics and revenue
app.get('/api/admin/stats', checkAdminAuth, (req, res) => {
  const stats = db.getAdminStats();
  res.json({ success: true, stats });
});

// Admin: Approve / Reject Payment & Listing Status
app.patch('/api/admin/listings/:id/status', checkAdminAuth, (req, res) => {
  const { payment_status, status } = req.body;
  const updated = db.updateListingStatus(req.params.id, payment_status, status);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Listing not found' });
  }
  res.json({ success: true, listing: updated });
});

// Admin: Toggle Featured Ad
app.post('/api/admin/listings/:id/toggle-featured', checkAdminAuth, (req, res) => {
  const updated = db.toggleFeatured(req.params.id);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Listing not found' });
  }
  res.json({ success: true, listing: updated });
});

// Admin: Delete Listing
app.delete('/api/admin/listings/:id', checkAdminAuth, (req, res) => {
  const success = db.deleteListing(req.params.id);
  if (!success) {
    return res.status(404).json({ success: false, message: 'Listing not found or already deleted' });
  }
  res.json({ success: true, message: 'Listing deleted successfully' });
});

// Admin: Update Payment Settings (Rates, Phone Number)
app.put('/api/admin/settings', checkAdminAuth, (req, res) => {
  const updated = db.updateSettings(req.body);
  res.json({ success: true, settings: updated });
});

// Fallback HTML page routes
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 BiasharaHub Kenya is running on http://localhost:${PORT}`);
  console.log(`💼 M-Pesa Recipient: Henry Okoth (0181288331)`);
  console.log(`🔑 Admin Dashboard: http://localhost:${PORT}/admin.html`);
  console.log(`=======================================================`);
});
