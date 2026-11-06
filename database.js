const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'listings.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Default settings with Henry Okoth's M-Pesa details
const DEFAULT_SETTINGS = {
  mpesaNumber: '0181288331',
  mpesaName: 'Henry Okoth',
  pricing: {
    product: 100,      // KSh 100 to post a product/good
    business: 200,     // KSh 200 to list a business or professional service
    job: 300,          // KSh 300 to post a job vacancy
    institution: 500   // KSh 500 to advertise an institution/college/school
  },
  adminPassword: process.env.ADMIN_PASSWORD || '0987@henry'
};

// Seed sample listings to demonstrate how each category looks
const SEED_LISTINGS = [
  {
    id: 'demo-prod-1',
    type: 'product',
    title: 'Brand New HP Pavilion 15 (Core i7, 16GB RAM, 512GB SSD)',
    category: 'Electronics & Computers',
    price: '65000',
    description: 'High performance laptop perfect for office work, graphic design, and students. Comes sealed in box with 1-year warranty. Free delivery within Nairobi CBD.',
    location: 'Nairobi',
    address: 'Luthuli Avenue, Pioneer House',
    contact_name: 'David Mwangi',
    phone: '0712345678',
    whatsapp: '254712345678',
    email: 'david@sampletech.co.ke',
    website: '',
    image_url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80',
    listing_fee: 100,
    mpesa_code: 'SLG9283741',
    mpesa_number: '0712345678',
    mpesa_recipient_number: '0181288331',
    mpesa_recipient_name: 'Henry Okoth',
    payment_status: 'approved',
    status: 'active',
    is_featured: true,
    views: 142,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'demo-biz-1',
    type: 'business',
    title: 'Apex Electricals & Solar Installation Experts',
    category: 'Professional Services',
    price: 'Free Quote',
    description: 'EPRA-licensed certified electrical engineers and solar technicians. We handle residential wiring, commercial installations, solar backup systems, and CCTV security installations across Kenya.',
    location: 'Kisumu',
    address: 'Oginga Odinga Street, Alpha Plaza 2nd Floor',
    contact_name: 'Eng. Kennedy Ouma',
    phone: '0722998877',
    whatsapp: '254722998877',
    email: 'contact@apexelectricals.co.ke',
    website: 'https://apexelectricals.co.ke',
    image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
    listing_fee: 200,
    mpesa_code: 'SLK7712389',
    mpesa_number: '0722998877',
    mpesa_recipient_number: '0181288331',
    mpesa_recipient_name: 'Henry Okoth',
    payment_status: 'approved',
    status: 'active',
    is_featured: true,
    views: 290,
    created_at: new Date(Date.now() - 86400000 * 4).toISOString()
  },
  {
    id: 'demo-inst-1',
    type: 'institution',
    title: 'Nairobi Institute of Digital Technology (NIDT) - January Intake Ongoing',
    category: 'Colleges & Universities',
    price: 'Tuition from KSh 25,000/term',
    description: 'TVETA-accredited national institution offering Diploma and Certificate courses in Software Engineering, Cybersecurity, AI & Data Science, Accounting (CPA), and Graphic Design. Hostels available.',
    location: 'Nairobi',
    address: 'Ngong Road, Next to Prestige Plaza',
    contact_name: 'Admissions Office',
    phone: '0700112233',
    whatsapp: '254700112233',
    email: 'admissions@nidt.ac.ke',
    website: 'https://nidt.ac.ke',
    image_url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80',
    listing_fee: 500,
    mpesa_code: 'SLA4892011',
    mpesa_number: '0700112233',
    mpesa_recipient_number: '0181288331',
    mpesa_recipient_name: 'Henry Okoth',
    payment_status: 'approved',
    status: 'active',
    is_featured: true,
    views: 512,
    created_at: new Date(Date.now() - 86400000 * 6).toISOString()
  },
  {
    id: 'demo-job-1',
    type: 'job',
    title: 'Urgent: Branch Sales & Marketing Executive (2 Vacancies)',
    category: 'Marketing & Sales',
    price: 'KSh 35,000 - 55,000 + Comm.',
    description: 'Fast-growing FMCG distributor seeking self-motivated sales reps. Qualifications: Diploma in Sales/Marketing or related field, good communication skills, 1+ year experience in retail FMCG. Apply with CV before deadline.',
    location: 'Mombasa',
    address: 'Nyali Road, Commercial Center',
    contact_name: 'HR Department',
    phone: '0733556677',
    whatsapp: '254733556677',
    email: 'careers@coastaldistributors.co.ke',
    website: '',
    image_url: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&auto=format&fit=crop&q=80',
    listing_fee: 300,
    mpesa_code: 'SLM1230987',
    mpesa_number: '0733556677',
    mpesa_recipient_number: '0181288331',
    mpesa_recipient_name: 'Henry Okoth',
    payment_status: 'approved',
    status: 'active',
    is_featured: false,
    views: 310,
    created_at: new Date(Date.now() - 86400000 * 1).toISOString()
  }
];

class Database {
  constructor() {
    this.init();
  }

  init() {
    if (!fs.existsSync(SETTINGS_FILE)) {
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(DEFAULT_SETTINGS, null, 2), 'utf8');
    }
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(SEED_LISTINGS, null, 2), 'utf8');
    }
  }

  readListings() {
    try {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      return JSON.parse(data || '[]');
    } catch (err) {
      console.error('Error reading listings:', err);
      return [];
    }
  }

  writeListings(listings) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(listings, null, 2), 'utf8');
      return true;
    } catch (err) {
      console.error('Error writing listings:', err);
      return false;
    }
  }

  getSettings() {
    try {
      let settings = DEFAULT_SETTINGS;
      if (fs.existsSync(SETTINGS_FILE)) {
        const data = fs.readFileSync(SETTINGS_FILE, 'utf8');
        settings = { ...DEFAULT_SETTINGS, ...JSON.parse(data || '{}') };
      }
      if (process.env.ADMIN_PASSWORD) {
        settings.adminPassword = process.env.ADMIN_PASSWORD;
      }
      return settings;
    } catch (err) {
      return DEFAULT_SETTINGS;
    }
  }

  updateSettings(newSettings) {
    try {
      const current = this.getSettings();
      const updated = { ...current, ...newSettings };
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(updated, null, 2), 'utf8');
      return updated;
    } catch (err) {
      console.error('Error updating settings:', err);
      return null;
    }
  }

  getAllListings(filters = {}) {
    let listings = this.readListings();

    // Filter by type (product, business, institution, job)
    if (filters.type && filters.type !== 'all') {
      listings = listings.filter(item => item.type === filters.type);
    }

    // Filter by category
    if (filters.category && filters.category !== 'all') {
      listings = listings.filter(item => item.category.toLowerCase() === filters.category.toLowerCase());
    }

    // Filter by location / county
    if (filters.location && filters.location !== 'all') {
      listings = listings.filter(item => 
        item.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Keyword search (title, description, contact)
    if (filters.q) {
      const q = filters.q.toLowerCase().trim();
      listings = listings.filter(item => 
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q)
      );
    }

    // Only active listings for public views unless admin
    if (!filters.includeAllStatus) {
      listings = listings.filter(item => item.status === 'active' && item.payment_status === 'approved');
    }

    // Sort: Featured first, then newest
    listings.sort((a, b) => {
      if (a.is_featured && !b.is_featured) return -1;
      if (!a.is_featured && b.is_featured) return 1;
      return new Date(b.created_at) - new Date(a.created_at);
    });

    return listings;
  }

  getListingById(id, incrementView = false) {
    const listings = this.readListings();
    const listing = listings.find(item => item.id === id);
    if (listing && incrementView) {
      listing.views = (listing.views || 0) + 1;
      this.writeListings(listings);
    }
    return listing || null;
  }

  createListing(data) {
    const listings = this.readListings();
    const settings = this.getSettings();

    const id = 'ad-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6);
    
    // Calculate fee based on type
    const fee = settings.pricing[data.type] || 200;

    const newListing = {
      id,
      type: data.type || 'product',
      title: data.title || '',
      category: data.category || 'General',
      price: data.price || 'Contact for Price',
      description: data.description || '',
      location: data.location || 'Kenya',
      address: data.address || '',
      contact_name: data.contact_name || '',
      phone: data.phone || '',
      whatsapp: data.whatsapp || data.phone || '',
      email: data.email || '',
      website: data.website || '',
      image_url: data.image_url || '/images/default-ad.png',
      
      // Payment details
      listing_fee: fee,
      mpesa_code: (data.mpesa_code || '').toUpperCase().trim(),
      mpesa_number: data.mpesa_number || '',
      mpesa_recipient_number: settings.mpesaNumber,
      mpesa_recipient_name: settings.mpesaName,
      payment_status: 'pending_approval', // Pending Henry Okoth's review/approval
      status: 'pending',                 // Becomes 'active' when approved
      is_featured: false,
      views: 0,
      created_at: new Date().toISOString()
    };

    listings.unshift(newListing);
    this.writeListings(listings);
    return newListing;
  }

  updateListingStatus(id, payment_status, status) {
    const listings = this.readListings();
    const index = listings.findIndex(item => item.id === id);
    if (index === -1) return null;

    if (payment_status) listings[index].payment_status = payment_status;
    if (status) listings[index].status = status;
    listings[index].updated_at = new Date().toISOString();

    this.writeListings(listings);
    return listings[index];
  }

  toggleFeatured(id) {
    const listings = this.readListings();
    const index = listings.findIndex(item => item.id === id);
    if (index === -1) return null;

    listings[index].is_featured = !listings[index].is_featured;
    this.writeListings(listings);
    return listings[index];
  }

  deleteListing(id) {
    let listings = this.readListings();
    const initialLen = listings.length;
    listings = listings.filter(item => item.id !== id);
    if (listings.length === initialLen) return false;

    this.writeListings(listings);
    return true;
  }

  getAdminStats() {
    const listings = this.readListings();
    const settings = this.getSettings();

    const total = listings.length;
    const active = listings.filter(l => l.status === 'active' && l.payment_status === 'approved').length;
    const pending = listings.filter(l => l.payment_status === 'pending_approval').length;
    const rejected = listings.filter(l => l.payment_status === 'rejected').length;

    // Total revenue collected via M-Pesa (approved listings)
    const approvedRevenue = listings
      .filter(l => l.payment_status === 'approved')
      .reduce((sum, l) => sum + (Number(l.listing_fee) || 0), 0);

    const pendingRevenue = listings
      .filter(l => l.payment_status === 'pending_approval')
      .reduce((sum, l) => sum + (Number(l.listing_fee) || 0), 0);

    return {
      total,
      active,
      pending,
      rejected,
      approvedRevenue,
      pendingRevenue,
      mpesaNumber: settings.mpesaNumber,
      mpesaName: settings.mpesaName,
      pricing: settings.pricing
    };
  }
}

module.exports = new Database();
