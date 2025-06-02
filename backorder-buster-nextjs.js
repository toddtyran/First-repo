// package.json
{
  "name": "backorder-buster",
  "version": "1.0.0",
  "description": "Semi truck parts marketplace for hard-to-find and back-ordered parts",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.263.1",
    "@next/font": "14.0.0"
  },
  "devDependencies": {
    "eslint": "^8.45.0",
    "eslint-config-next": "14.0.0",
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.14",
    "postcss": "^8.4.24"
  },
  "engines": {
    "node": ">=18"
  }
}

// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
  },
}

module.exports = nextConfig

// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        }
      }
    },
  },
  plugins: [],
}

// postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}

// app/globals.css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
  }
  body {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
}

@layer components {
  .btn-primary {
    @apply bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium;
  }
  .btn-secondary {
    @apply bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium;
  }
  .card {
    @apply bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200;
  }
}

// app/layout.js
import './globals.css'

export const metadata = {
  title: 'Back Order Buster - Semi Truck Parts Marketplace',
  description: 'Find hard-to-find and back-ordered semi truck parts. B2B, B2C, and P2P marketplace for truckers and businesses.',
  keywords: 'semi truck parts, truck parts marketplace, back order parts, hard to find truck parts, B2B truck parts',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        {children}
      </body>
    </html>
  )
}

// app/page.js
'use client'
import { useState, useEffect } from 'react'
import { 
  Search, Plus, Truck, Star, MapPin, Clock, DollarSign, 
  Filter, Menu, X, User, Package, MessageCircle, Bell,
  Heart, Eye, Phone, Mail, Shield, Zap
} from 'lucide-react'

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('browse')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [listings, setListings] = useState([])
  const [savedItems, setSavedItems] = useState([])
  const [sortBy, setSortBy] = useState('newest')

  // Sample data with more realistic truck parts
  const sampleListings = [
    {
      id: 1,
      title: "Freightliner Cascadia LED Headlight Assembly - Driver Side",
      price: 485,
      originalPrice: 650,
      condition: "Used - Excellent",
      location: "Dallas, TX",
      seller: "Big Rig Parts Co.",
      sellerType: "business",
      rating: 4.8,
      reviewCount: 127,
      inStock: true,
      category: "lighting",
      description: "OEM LED headlight assembly for 2018-2022 Freightliner Cascadia. Tested and working. 90-day warranty included.",
      image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400",
      postedDate: "2024-05-28",
      partNumber: "A06-95669-000",
      compatibility: "Freightliner Cascadia 2018-2022",
      warranty: "90 days",
      shipping: "Free"
    },
    {
      id: 2,
      title: "Peterbilt 389 Chrome Front Bumper - RARE Original",
      price: 1850,
      originalPrice: 2200,
      condition: "Used - Good",
      location: "Oklahoma City, OK",
      seller: "Chrome King Truck Parts",
      sellerType: "business",
      rating: 4.9,
      reviewCount: 89,
      inStock: true,
      category: "exterior",
      description: "Extremely rare original chrome bumper for Peterbilt 389. Minor wear, professionally polished. Hard to find part!",
      image: "https://images.unsplash.com/photo-1601584115197-04d7c7d5e1d7?w=400",
      postedDate: "2024-05-27",
      partNumber: "16-04145",
      compatibility: "Peterbilt 389 2007-2016",
      warranty: "30 days",
      shipping: "Freight"
    },
    {
      id: 3,
      title: "Caterpillar C15 Turbocharger - Remanufactured",
      price: 3200,
      originalPrice: 4500,
      condition: "Remanufactured", 
      location: "Phoenix, AZ",
      seller: "Desert Diesel Solutions",
      sellerType: "business",
      rating: 4.7,
      reviewCount: 203,
      inStock: false,
      backorderDate: "2024-06-15",
      category: "engine",
      description: "Professional remanufactured C15 turbocharger with 2-year warranty. Core exchange available.",
      image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400",
      postedDate: "2024-05-26",
      partNumber: "178-0199",
      compatibility: "CAT C15 2002-2010",
      warranty: "2 years",
      shipping: "Free"
    },
    {
      id: 4,
      title: "Kenworth W900 Leather Steering Wheel - Custom",
      price: 520,
      condition: "New",
      location: "Nashville, TN", 
      seller: "Highway Heroes Parts",
      sellerType: "business",
      rating: 4.6,
      reviewCount: 156,
      inStock: true,
      category: "interior",
      description: "Premium leather-wrapped steering wheel for Kenworth W900. Custom stitching available.",
      image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400",
      postedDate: "2024-05-25",
      partNumber: "K200-1234",
      compatibility: "Kenworth W900 2005+",
      warranty: "1 year",
      shipping: "$25"
    },
    {
      id: 5,
      title: "Volvo VNL 780 DEF Tank Assembly - Complete",
      price: 890,
      condition: "Used - Good",
      location: "Atlanta, GA",
      seller: "Mike's Truck Salvage",
      sellerType: "individual",
      rating: 4.3,
      reviewCount: 45,
      inStock: true,
      category: "exhaust",
      description: "Complete DEF tank assembly removed from 2015 Volvo VNL 780. Tank, pump, and lines included.",
      image: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=400",
      postedDate: "2024-05-24",
      partNumber: "21006968",
      compatibility: "Volvo VNL 2011-2017",
      warranty: "15 days",
      shipping: "Freight"
    },
    {
      id: 6,
      title: "Mack Granite Air Brake Chamber - Rear",
      price: 145,
      condition: "Remanufactured",
      location: "Chicago, IL",
      seller: "Windy City Truck Parts",
      sellerType: "business", 
      rating: 4.5,
      reviewCount: 78,
      inStock: false,
      backorderDate: "2024-06-10",
      category: "brakes",
      description: "Type 30 air brake chamber for Mack Granite. Professional remanufacturing with warranty.",
      image: "https://images.unsplash.com/photo-1581092335878-1d7fd52b2d12?w=400",
      postedDate: "2024-05-23",
      partNumber: "R955320",
      compatibility: "Mack Granite 2002+",
      warranty: "1 year", 
      shipping: "$35"
    }
  ]

  const categories = [
    { id: 'all', name: 'All Categories', icon: Package },
    { id: 'engine', name: 'Engine Parts', icon: Package },
    { id: 'transmission', name: 'Transmission', icon: Package },
    { id: 'brakes', name: 'Brakes & Air', icon: Package },
    { id: 'lighting', name: 'Lighting', icon: Package },
    { id: 'exterior', name: 'Body & Exterior', icon: Package },
    { id: 'interior', name: 'Interior', icon: Package },
    { id: 'electrical', name: 'Electrical', icon: Package },
    { id: 'exhaust', name: 'Exhaust & DEF', icon: Package },
    { id: 'suspension', name: 'Suspension', icon: Package }
  ]

  useEffect(() => {
    setListings(sampleListings)
  }, [])

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         listing.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         listing.partNumber?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || listing.category === selectedCategory
    return matchesSearch && matchesCategory
  }).sort((a, b) => {
    switch(sortBy) {
      case 'price-low': return a.price - b.price
      case 'price-high': return b.price - a.price
      case 'rating': return b.rating - a.rating
      default: return new Date(b.postedDate) - new Date(a.postedDate)
    }
  })

  const toggleSaved = (listingId) => {
    setSavedItems(prev => 
      prev.includes(listingId) 
        ? prev.filter(id => id !== listingId)
        : [...prev, listingId]
    )
  }

  const ListingCard = ({ listing }) => (
    <div className="card overflow-hidden">
      <div className="relative">
        <img 
          src={listing.image} 
          alt={listing.title}
          className="w-full h-48 object-cover"
        />
        <button
          onClick={() => toggleSaved(listing.id)}
          className={`absolute top-3 right-3 p-2 rounded-full shadow-lg ${
            savedItems.includes(listing.id) 
              ? 'bg-red-500 text-white' 
              : 'bg-white text-gray-600 hover:bg-red-500 hover:text-white'
          } transition-colors`}
        >
          <Heart size={16} fill={savedItems.includes(listing.id) ? 'currentColor' : 'none'} />
        </button>
        
        {!listing.inStock && (
          <div className="absolute top-3 left-3 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            BACK ORDER
          </div>
        )}
        
        {listing.originalPrice && (
          <div className="absolute bottom-3 left-3 bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">
            SAVE ${listing.originalPrice - listing.price}
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 line-clamp-2 text-gray-900">{listing.title}</h3>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-green-600">${listing.price}</span>
            {listing.originalPrice && (
              <span className="text-sm text-gray-500 line-through">${listing.originalPrice}</span>
            )}
          </div>
          <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
            {listing.condition}
          </span>
        </div>

        <div className="space-y-2 mb-4 text-sm text-gray-600">
          <div className="flex items-center">
            <MapPin size={14} className="mr-2 text-gray-400" />
            {listing.location}
          </div>
          
          {listing.partNumber && (
            <div className="flex items-center">
              <Package size={14} className="mr-2 text-gray-400" />
              Part# {listing.partNumber}
            </div>
          )}
          
          {listing.warranty && (
            <div className="flex items-center">
              <Shield size={14} className="mr-2 text-gray-400" />
              {listing.warranty} warranty
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-sm">
            <div className={`w-7 h-7 rounded-full mr-2 flex items-center justify-center text-xs font-bold text-white ${
              listing.sellerType === 'business' ? 'bg-blue-500' : 'bg-green-500'
            }`}>
              {listing.sellerType === 'business' ? 'B' : 'P'}
            </div>
            <div>
              <div className="font-medium text-gray-900">{listing.seller}</div>
              <div className="flex items-center text-yellow-500">
                <Star size={12} fill="currentColor" className="mr-1" />
                <span className="text-xs text-gray-600">{listing.rating} ({listing.reviewCount})</span>
              </div>
            </div>
          </div>
        </div>

        {!listing.inStock && listing.backorderDate && (
          <div className="flex items-center text-orange-600 text-sm mb-4 bg-orange-50 p-2 rounded">
            <Clock size={14} className="mr-2" />
            Available: {new Date(listing.backorderDate).toLocaleDateString()}
          </div>
        )}

        <div className="flex gap-2">
          <button className="flex-1 btn-primary text-sm">
            {listing.inStock ? 'Buy Now' : 'Pre-Order'}
          </button>
          <button className="p-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <MessageCircle size={16} />
          </button>
          <button className="p-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <Eye size={16} />
          </button>
        </div>
      </div>
    </div>
  )

  const SellForm = () => {
    const [formData, setFormData] = useState({
      title: '', price: '', condition: '', category: '', description: '', 
      location: '', partNumber: '', compatibility: '', warranty: '', shipping: ''
    })

    const handleSubmit = () => {
      if (!formData.title || !formData.price || !formData.condition || !formData.category) {
        alert('Please fill in all required fields')
        return
      }
      alert('Listing submitted for review! You will be notified when it goes live.')
      setActiveTab('browse')
    }

    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">List Your Semi Truck Part</h2>
            <p className="text-gray-600 mt-2">Help other truckers find the parts they need</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Part Title *</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Freightliner Cascadia Headlight Assembly"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price ($) *</label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Condition *</label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.condition}
                    onChange={(e) => setFormData({...formData, condition: e.target.value})}
                  >
                    <option value="">Select condition</option>
                    <option value="New">New</option>
                    <option value="Used - Excellent">Used - Excellent</option>
                    <option value="Used - Good">Used - Good</option>
                    <option value="Used - Fair">Used - Fair</option>
                    <option value="Remanufactured">Remanufactured</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="">Select category</option>
                  {categories.slice(1).map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="City, State"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Part Number</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="OEM or aftermarket part number"
                  value={formData.partNumber}
                  onChange={(e) => setFormData({...formData, partNumber: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Compatibility</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Freightliner Cascadia 2018-2022"
                  value={formData.compatibility}
                  onChange={(e) => setFormData({...formData, compatibility: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Warranty</label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.warranty}
                    onChange={(e) => setFormData({...formData, warranty: e.target.value})}
                  >
                    <option value="">Select warranty</option>
                    <option value="No warranty">No warranty</option>
                    <option value="15 days">15 days</option>
                    <option value="30 days">30 days</option>
                    <option value="90 days">90 days</option>
                    <option value="1 year">1 year</option>
                    <option value="2 years">2 years</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Shipping</label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.shipping}
                    onChange={(e) => setFormData({...formData, shipping: e.target.value})}
                  >
                    <option value="">Select shipping</option>
                    <option value="Free">Free shipping</option>
                    <option value="$25">$25</option>
                    <option value="$50">$50</option>
                    <option value="$75">$75</option>
                    <option value="Freight">Freight required</option>
                    <option value="Pickup only">Pickup only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe the part condition, history, installation notes, etc."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors font-bold text-lg"
            >
              List Part for Sale
            </button>
            <p className="text-sm text-gray-600 mt-2">
              * Your listing will be reviewed before going live
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Truck className="h-10 w-10 text-blue-600 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Back Order Buster</h1>
                <p className="text-xs text-gray-600">Semi Truck Parts Marketplace</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <button className="flex items-center text-gray-700 hover:text-blue-600 transition-colors">
                <Bell size={20} className="mr-1" />
                Alerts
              </button>
              <button className="flex items-center text-gray-700 hover:text-blue-600 transition-colors">
                <MessageCircle size={20} className="mr-1" />
                Messages
              </button>
              <button className="flex items-center text-gray-700 hover:text-blue-600 transition-colors">
                <User size={20} className="mr-1" />
                Account
              </button>
            </div>

            <button
              className="md:hidden p-2"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-white border-b shadow-lg">
          <div className="px-4 py-4 space-y-3">
            <button className="flex items-center w-full text-left text-gray-700 hover:text-blue-600 py-2">
              <Bell size={20} className="mr-3" />
              Alerts
            </button>
            <button className="flex items-center w-full text-left text-gray-700 hover:text-blue-600 py-2">
              <MessageCircle size={20} className="mr-3" />
              Messages
            </button>
            <button className="flex items-center w-full text-left text-gray-700 hover:text-blue-600 py-2">
              <User size={20} className="mr-3" />
              Account
            </button>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'browse'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('browse')}
            >
              Browse Parts
            </button>
            <button
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'sell'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('sell')}
            >
              Sell Parts
            </button>
            <button
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'saved'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('saved')}
            >
              Saved Items ({savedItems.length})
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab ===