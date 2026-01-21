import React, { useState, useEffect, useRef } from 'react'
import JSZip from 'jszip'
import { supabase, BUCKET_NAME, getPublicUrl } from './lib/supabase'

const defaultInstalls = [
  // V1 Installs
  { id: 1, name: 'Active Campaign', version: 'v1', category: 'Email/CRM', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 2, name: 'Acuity', version: 'v1', category: 'Scheduling', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 3, name: 'AdRoll', version: 'v1', category: 'Ads', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 4, name: 'API', version: 'v1', category: 'Core', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 5, name: 'AppointmentCore', version: 'v1', category: 'Scheduling', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 6, name: 'Authorize.net', version: 'v1', category: 'Payment', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 7, name: 'BigCommerce', version: 'v1', category: 'Ecommerce', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 8, name: 'Bing Ads', version: 'v1', category: 'Ads', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 9, name: 'Braintree', version: 'v1', category: 'Payment', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 10, name: 'Braze', version: 'v1', category: 'Email/CRM', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 11, name: 'Calendly', version: 'v1', category: 'Scheduling', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 12, name: 'CallRail', version: 'v1', category: 'Tracking', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 13, name: 'Chargebee', version: 'v1', category: 'Payment', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 14, name: 'ClickFunnels', version: 'v1', category: 'Funnel', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 15, name: 'ClickFunnels 2', version: 'v1', category: 'Funnel', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 16, name: 'Close CRM', version: 'v1', category: 'Email/CRM', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 17, name: 'CopeCart', version: 'v1', category: 'Payment', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 18, name: 'Custom Ad Source', version: 'v1', category: 'Ads', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 19, name: 'Demio', version: 'v1', category: 'Webinar', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 20, name: 'Drip', version: 'v1', category: 'Email/CRM', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 21, name: 'Easy Pay Direct', version: 'v1', category: 'Payment', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 22, name: 'EverWebinar', version: 'v1', category: 'Webinar', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 23, name: 'EverWebinar ClickFunnels', version: 'v1', category: 'Webinar', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 24, name: 'EverWebinar Default', version: 'v1', category: 'Webinar', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 25, name: 'EverWebinar Embedded', version: 'v1', category: 'Webinar', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 26, name: 'eWebinar', version: 'v1', category: 'Webinar', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 27, name: 'Facebook Ads', version: 'v1', category: 'Ads', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 28, name: 'Funnelish', version: 'v1', category: 'Funnel', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 29, name: 'GoCardless', version: 'v1', category: 'Payment', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 30, name: 'GoHighLevel', version: 'v1', category: 'Funnel', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 31, name: 'GoHighLevel Scheduler', version: 'v1', category: 'Scheduling', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 32, name: 'Google Ads', version: 'v1', category: 'Ads', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 33, name: 'GTM', version: 'v1', category: 'Tracking', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 34, name: 'Hotmart', version: 'v1', category: 'Ecommerce', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 35, name: 'HubSpot', version: 'v1', category: 'Email/CRM', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 36, name: 'HubSpot Forms', version: 'v1', category: 'Email/CRM', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 37, name: 'HubSpot Meetings', version: 'v1', category: 'Scheduling', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 38, name: 'iClosed', version: 'v1', category: 'Sales', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 39, name: 'Infusionsoft/Keap', version: 'v1', category: 'Email/CRM', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 40, name: 'Instapage', version: 'v1', category: 'Landing Page', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 41, name: 'Invoiced', version: 'v1', category: 'Payment', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 42, name: 'JotForm Integration', version: 'v1', category: 'Forms', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 43, name: 'Kajabi', version: 'v1', category: 'Course', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 44, name: 'Kartra', version: 'v1', category: 'Funnel', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 45, name: 'Klaviyo', version: 'v1', category: 'Email/CRM', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 46, name: 'Leadpages', version: 'v1', category: 'Landing Page', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 47, name: 'LinkedIn Ads', version: 'v1', category: 'Ads', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 48, name: 'Magento', version: 'v1', category: 'Ecommerce', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 49, name: 'MGID', version: 'v1', category: 'Ads', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 50, name: 'NMI', version: 'v1', category: 'Payment', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 51, name: 'Omnisend', version: 'v1', category: 'Email/CRM', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 52, name: 'OnceHub', version: 'v1', category: 'Scheduling', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 53, name: 'Ontraport', version: 'v1', category: 'Email/CRM', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 54, name: 'Pabbly', version: 'v1', category: 'Automation', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 55, name: 'PayKickstart', version: 'v1', category: 'Payment', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 56, name: 'PayPal', version: 'v1', category: 'Payment', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 57, name: 'Pinterest Ads', version: 'v1', category: 'Ads', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 58, name: 'Pipedrive', version: 'v1', category: 'Email/CRM', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 59, name: 'Recurly', version: 'v1', category: 'Payment', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 60, name: 'Reddit Ads', version: 'v1', category: 'Ads', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 61, name: 'Requirements', version: 'v1', category: 'Core', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 62, name: 'Ringba', version: 'v1', category: 'Tracking', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 63, name: 'Salesforce', version: 'v1', category: 'Email/CRM', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 64, name: 'SamCart', version: 'v1', category: 'Payment', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 65, name: 'SavvyCal', version: 'v1', category: 'Scheduling', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 66, name: 'Shopify', version: 'v1', category: 'Ecommerce', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 67, name: 'Shopify BetterCart', version: 'v1', category: 'Ecommerce', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 68, name: 'Shopify PageFly', version: 'v1', category: 'Ecommerce', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 69, name: 'Shopify ReCharge', version: 'v1', category: 'Ecommerce', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 70, name: 'Skool', version: 'v1', category: 'Course', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 71, name: 'Snapchat Ads', version: 'v1', category: 'Ads', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 72, name: 'Square', version: 'v1', category: 'Payment', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 73, name: 'Squarespace', version: 'v1', category: 'Website', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 74, name: 'Standard Script', version: 'v1', category: 'Core', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 75, name: 'Stealth Seminar', version: 'v1', category: 'Webinar', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 76, name: 'Stripe', version: 'v1', category: 'Payment', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 77, name: 'Taboola', version: 'v1', category: 'Ads', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 78, name: 'Teachable', version: 'v1', category: 'Course', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 79, name: 'ThriveCart', version: 'v1', category: 'Payment', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 80, name: 'TikTok Ads', version: 'v1', category: 'Ads', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 81, name: 'TikTok Shops', version: 'v1', category: 'Ecommerce', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 82, name: 'Twitter/X Ads', version: 'v1', category: 'Ads', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 83, name: 'Typeform', version: 'v1', category: 'Forms', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 84, name: 'Unbounce', version: 'v1', category: 'Landing Page', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 85, name: 'Uscreen', version: 'v1', category: 'Course', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 86, name: 'Wave Apps', version: 'v1', category: 'Payment', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 87, name: 'Webflow', version: 'v1', category: 'Website', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 88, name: 'WebinarFuel', version: 'v1', category: 'Webinar', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 89, name: 'WebinarGeek', version: 'v1', category: 'Webinar', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 90, name: 'WebinarJam', version: 'v1', category: 'Webinar', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 91, name: 'Wix', version: 'v1', category: 'Website', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 92, name: 'WooCommerce', version: 'v1', category: 'Ecommerce', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 93, name: 'WordPress', version: 'v1', category: 'Website', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 94, name: 'YouCanBook.me', version: 'v1', category: 'Scheduling', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 95, name: 'Zapier', version: 'v1', category: 'Automation', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 96, name: 'Zaxaa', version: 'v1', category: 'Payment', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  // V2 Installs
  { id: 97, name: 'ClickFunnels', version: 'v2', category: 'Funnel', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 98, name: 'Facebook Ads', version: 'v2', category: 'Ads', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 99, name: 'Google Ads', version: 'v2', category: 'Ads', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 100, name: 'Google Ads Automatic', version: 'v2', category: 'Ads', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 101, name: 'iClosed', version: 'v2', category: 'Sales', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 102, name: 'Reddit Ads', version: 'v2', category: 'Ads', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 103, name: 'Stripe', version: 'v2', category: 'Payment', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
  { id: 104, name: 'TikTok Ads', version: 'v2', category: 'Ads', status: null, lastChecked: null, checkedBy: '', critical: false, file: null },
]

// Skull icons
const SkullOutline = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500 hover:text-gray-300 transition-colors">
    <circle cx="9" cy="10" r="1.5"/>
    <circle cx="15" cy="10" r="1.5"/>
    <path d="M12 2C6.477 2 2 6.477 2 12c0 3.5 1.8 6.5 4.5 8.3V22h3v-2h5v2h3v-1.7c2.7-1.8 4.5-4.8 4.5-8.3 0-5.523-4.477-10-10-10z"/>
    <path d="M9 16h6"/>
    <path d="M10 16v2"/>
    <path d="M14 16v2"/>
  </svg>
)

const SkullFilled = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="1" className="text-white">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 3.5 1.8 6.5 4.5 8.3V22h3v-2h5v2h3v-1.7c2.7-1.8 4.5-4.8 4.5-8.3 0-5.523-4.477-10-10-10z"/>
    <circle cx="9" cy="10" r="1.5" fill="#1f2937"/>
    <circle cx="15" cy="10" r="1.5" fill="#1f2937"/>
    <rect x="9" y="15" width="6" height="1.5" fill="#1f2937"/>
    <rect x="10" y="15" width="1" height="3" fill="#1f2937"/>
    <rect x="13" y="15" width="1" height="3" fill="#1f2937"/>
  </svg>
)

// Helper functions
const formatDateForInput = (dateStr) => {
  if (!dateStr) return ''
  const [month, day, year] = dateStr.split('/')
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
}

const formatDateForDisplay = (dateStr) => {
  if (!dateStr) return null
  const date = new Date(dateStr + 'T00:00:00')
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
}

const STORAGE_KEY = 'hyros-install-tracker-data'

export default function App() {
  const [installs, setInstalls] = useState(defaultInstalls)
  const [filter, setFilter] = useState('all')
  const [versionFilter, setVersionFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [defaultChecker, setDefaultChecker] = useState('')
  const [editingDateId, setEditingDateId] = useState(null)
  const [activeTab, setActiveTab] = useState('critical')
  const [isLoading, setIsLoading] = useState(true)
  const [uploading, setUploading] = useState(null) // install id currently uploading
  const [downloading, setDownloading] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newInstallName, setNewInstallName] = useState('')
  const [newInstallVersion, setNewInstallVersion] = useState('v1')
  const [newInstallCategory, setNewInstallCategory] = useState('Core')
  const fileInputRefs = useRef({})

  const categories = [...new Set(installs.map(i => i.category))].sort()

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const savedData = JSON.parse(saved)
        // Merge default installs with saved state
        const mergedInstalls = defaultInstalls.map(defaultInstall => {
          const savedInstall = savedData.installs?.find(s => s.id === defaultInstall.id)
          return savedInstall ? { ...defaultInstall, ...savedInstall } : defaultInstall
        })
        // Add any custom installs (id > 104)
        const customInstalls = savedData.installs?.filter(s => s.id > 104) || []
        setInstalls([...mergedInstalls, ...customInstalls])
        if (savedData.defaultChecker) {
          setDefaultChecker(savedData.defaultChecker)
        }
      }
    } catch (error) {
      console.log('No saved data found, using defaults')
    }
    setIsLoading(false)
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (isLoading) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        installs,
        defaultChecker
      }))
    } catch (error) {
      console.error('Failed to save data:', error)
    }
  }, [installs, defaultChecker, isLoading])

  const toggleCritical = (id) => {
    setInstalls(installs.map(install =>
      install.id === id ? { ...install, critical: !install.critical } : install
    ))
  }

  const addInstall = () => {
    if (!newInstallName.trim()) return

    const maxId = Math.max(...installs.map(i => i.id))
    const newInstall = {
      id: maxId + 1,
      name: newInstallName.trim(),
      version: newInstallVersion,
      category: newInstallCategory,
      status: null,
      lastChecked: null,
      checkedBy: '',
      critical: false,
      file: null
    }

    setInstalls([...installs, newInstall])
    setNewInstallName('')
    setNewInstallVersion('v1')
    setNewInstallCategory('Core')
    setShowAddForm(false)
  }

  const deleteInstall = (id) => {
    // Only allow deleting custom installs (id > 104)
    if (id <= 104) return
    setInstalls(installs.filter(i => i.id !== id))
  }

  const toggleStatus = (id) => {
    setInstalls(installs.map(install => {
      if (install.id === id) {
        const newStatus = install.status === null ? true : install.status === true ? false : null
        return {
          ...install,
          status: newStatus,
          checkedBy: newStatus !== null ? (install.checkedBy || defaultChecker) : install.checkedBy
        }
      }
      return install
    }))
  }

  const handleDateClick = (id, currentDate) => {
    if (editingDateId === id) return
    
    if (!currentDate) {
      const today = new Date()
      const dateStr = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`
      setInstalls(installs.map(install => 
        install.id === id ? { ...install, lastChecked: dateStr } : install
      ))
    } else {
      setEditingDateId(id)
    }
  }

  const handleDateChange = (id, value) => {
    const displayDate = formatDateForDisplay(value)
    setInstalls(installs.map(install => 
      install.id === id ? { ...install, lastChecked: displayDate } : install
    ))
  }

  const handleDateBlur = () => {
    setEditingDateId(null)
  }

  const clearDate = (id, e) => {
    e.stopPropagation()
    setInstalls(installs.map(install => 
      install.id === id ? { ...install, lastChecked: null } : install
    ))
    setEditingDateId(null)
  }

  const updateCheckedBy = (id, value) => {
    setInstalls(installs.map(install => 
      install.id === id ? { ...install, checkedBy: value } : install
    ))
  }

  // Generate index.txt and upload to Supabase
  const regenerateIndex = async (currentInstalls) => {
    const filesWithDocs = currentInstalls.filter(i => i.file)

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const header = `HYROS Installation Documentation Index
=======================================
Last Updated: ${new Date().toLocaleDateString()}
Total Files: ${filesWithDocs.length}

Instructions for Claude:
- Find the platform the user needs from the list below
- Fetch the file at the URL shown
- Use the documentation to guide the installation
- Base URL: ${supabaseUrl}/storage/v1/object/public/${BUCKET_NAME}/

Available Documentation:
------------------------`

    const lines = filesWithDocs.map(i =>
      `${i.name} | ${i.file.name} | ${i.category} | ${i.version}`
    ).join('\n')

    const indexContent = `${header}\n${lines}\n`

    try {
      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload('index.txt', indexContent, {
          contentType: 'text/plain',
          upsert: true
        })

      if (error) {
        console.error('Failed to update index:', error)
      } else {
        console.log('Index.txt updated successfully')
      }
    } catch (err) {
      console.error('Error updating index:', err)
    }
  }

  // File handling
  const handleFileUpload = async (id, event) => {
    const file = event.target.files[0]
    if (!file) return

    setUploading(id)

    try {
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(file.name, file, { upsert: true })

      if (error) throw error

      const url = getPublicUrl(file.name)
      const uploadDate = new Date().toLocaleDateString()

      const updatedInstalls = installs.map(install =>
        install.id === id ? {
          ...install,
          file: { name: file.name, url, uploadDate }
        } : install
      )

      setInstalls(updatedInstalls)

      // Regenerate index.txt
      await regenerateIndex(updatedInstalls)

    } catch (err) {
      console.error('Upload failed:', err)
      alert('Upload failed: ' + err.message)
    } finally {
      setUploading(null)
    }

    event.target.value = ''
  }

  const handleFileDownload = (install) => {
    if (!install.file?.url) return
    window.open(install.file.url, '_blank')
  }

  const handleFileDelete = async (id) => {
    const install = installs.find(i => i.id === id)
    if (!install?.file) return

    try {
      // Delete from Supabase
      await supabase.storage
        .from(BUCKET_NAME)
        .remove([install.file.name])

      const updatedInstalls = installs.map(i =>
        i.id === id ? { ...i, file: null } : i
      )

      setInstalls(updatedInstalls)

      // Regenerate index.txt
      await regenerateIndex(updatedInstalls)

    } catch (err) {
      console.error('Delete failed:', err)
      alert('Delete failed: ' + err.message)
    }
  }

  const triggerFileInput = (id) => {
    if (fileInputRefs.current[id]) {
      fileInputRefs.current[id].click()
    }
  }

  const handleDownloadAll = async () => {
    const installsWithFiles = installs.filter(i => i.file)
    if (installsWithFiles.length === 0) {
      alert('No files to download')
      return
    }

    setDownloading(true)

    try {
      const zip = new JSZip()

      // Fetch all files in parallel from Supabase URLs
      await Promise.all(installsWithFiles.map(async (install) => {
        const response = await fetch(install.file.url)
        const content = await response.text()
        zip.file(install.file.name, content)
      }))

      const content = await zip.generateAsync({ type: 'blob' })
      const url = URL.createObjectURL(content)
      const a = document.createElement('a')
      a.href = url
      a.download = 'hyros-install-docs.zip'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

    } catch (err) {
      console.error('Download failed:', err)
      alert('Download failed: ' + err.message)
    } finally {
      setDownloading(false)
    }
  }

  // Filter installs
  const filteredInstalls = installs.filter(install => {
    const matchesStatus = filter === 'all' || 
      (filter === 'good' && install.status === true) ||
      (filter === 'bad' && install.status === false) ||
      (filter === 'unchecked' && install.status === null)
    const matchesVersion = versionFilter === 'all' || install.version === versionFilter
    const matchesCategory = categoryFilter === 'all' || install.category === categoryFilter
    const matchesSearch = install.name.toLowerCase().includes(search.toLowerCase())
    return matchesStatus && matchesVersion && matchesCategory && matchesSearch
  })

  const criticalInstalls = filteredInstalls.filter(i => i.critical)
  const secondaryInstalls = filteredInstalls.filter(i => !i.critical)
  const displayedInstalls = activeTab === 'critical' ? criticalInstalls : secondaryInstalls

  const stats = {
    total: installs.length,
    good: installs.filter(i => i.status === true).length,
    bad: installs.filter(i => i.status === false).length,
    unchecked: installs.filter(i => i.status === null).length,
    critical: installs.filter(i => i.critical).length,
    filesUploaded: installs.filter(i => i.file).length
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6 flex items-center justify-center">
        <div className="text-xl text-gray-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-full mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">HYROS Install Tracker</h1>
            <p className="text-gray-400">Track the status of all integration install documentation</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors bg-green-600 hover:bg-green-500 text-white"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add Install
            </button>
            <button
              onClick={handleDownloadAll}
              disabled={stats.filesUploaded === 0 || downloading}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                stats.filesUploaded > 0 && !downloading
                  ? 'bg-blue-600 hover:bg-blue-500 text-white'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              {downloading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Downloading...
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Download All ({stats.filesUploaded} files)
                </>
              )}
            </button>
          </div>
        </div>

        {/* Add Install Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-96 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-4">Add New Install</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Install Name</label>
                  <input
                    type="text"
                    value={newInstallName}
                    onChange={(e) => setNewInstallName(e.target.value)}
                    placeholder="e.g., Custom Platform"
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-400"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Version</label>
                  <select
                    value={newInstallVersion}
                    onChange={(e) => setNewInstallVersion(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  >
                    <option value="v1">V1</option>
                    <option value="v2">V2</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Category</label>
                  <select
                    value={newInstallCategory}
                    onChange={(e) => setNewInstallCategory(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowAddForm(false)
                    setNewInstallName('')
                  }}
                  className="px-4 py-2 rounded-lg font-medium bg-gray-700 hover:bg-gray-600 text-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={addInstall}
                  disabled={!newInstallName.trim()}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    newInstallName.trim()
                      ? 'bg-green-600 hover:bg-green-500 text-white'
                      : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Add Install
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-6 gap-4 mb-6">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="text-3xl font-bold text-white">{stats.total}</div>
            <div className="text-gray-400 text-sm">Total Installs</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-green-600">
            <div className="text-3xl font-bold text-green-400">{stats.good}</div>
            <div className="text-gray-400 text-sm">Good</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-red-600">
            <div className="text-3xl font-bold text-red-400">{stats.bad}</div>
            <div className="text-gray-400 text-sm">Needs Work</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
            <div className="text-3xl font-bold text-gray-400">{stats.unchecked}</div>
            <div className="text-gray-400 text-sm">Unchecked</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-white">
            <div className="text-3xl font-bold text-white">{stats.critical}</div>
            <div className="text-gray-400 text-sm">Critical</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-blue-600">
            <div className="text-3xl font-bold text-blue-400">{stats.filesUploaded}</div>
            <div className="text-gray-400 text-sm">Files Uploaded</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab('critical')}
            className={`px-6 py-3 rounded-t-lg font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'critical'
                ? 'bg-gray-800 text-white border-t border-l border-r border-gray-700'
                : 'bg-gray-900 text-gray-400 hover:text-gray-300'
            }`}
          >
            <SkullFilled />
            Critical ({criticalInstalls.length})
          </button>
          <button
            onClick={() => setActiveTab('secondary')}
            className={`px-6 py-3 rounded-t-lg font-medium transition-colors ${
              activeTab === 'secondary'
                ? 'bg-gray-800 text-white border-t border-l border-r border-gray-700'
                : 'bg-gray-900 text-gray-400 hover:text-gray-300'
            }`}
          >
            Secondary ({secondaryInstalls.length})
          </button>
        </div>

        {/* Filters */}
        <div className="bg-gray-800 rounded-lg rounded-tl-none p-4 mb-6 border border-gray-700">
          <div className="flex flex-wrap gap-4 items-center">
            <input
              type="text"
              placeholder="Search installs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-400 w-48"
            />
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
            >
              <option value="all">All Status</option>
              <option value="good">Good Only</option>
              <option value="bad">Needs Work</option>
              <option value="unchecked">Unchecked</option>
            </select>
            <select 
              value={versionFilter} 
              onChange={(e) => setVersionFilter(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
            >
              <option value="all">All Versions</option>
              <option value="v1">V1 Only</option>
              <option value="v2">V2 Only</option>
            </select>
            <select 
              value={categoryFilter} 
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-gray-400 text-sm">Default Checker:</span>
              <input
                type="text"
                placeholder="Name..."
                value={defaultChecker}
                onChange={(e) => setDefaultChecker(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-400 w-32"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          {displayedInstalls.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              {activeTab === 'critical' 
                ? 'No critical installs yet. Click the skull icon next to an install to mark it as critical.'
                : 'No secondary installs match your filters.'}
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-750 border-b border-gray-700">
                  <th className="text-left p-4 text-gray-300 font-medium">Install Name</th>
                  <th className="text-center p-4 text-gray-300 font-medium w-20">Version</th>
                  <th className="text-center p-4 text-gray-300 font-medium w-28">Category</th>
                  <th className="text-center p-4 text-gray-300 font-medium w-28">Status</th>
                  <th className="text-center p-4 text-gray-300 font-medium w-32">Last Checked</th>
                  <th className="text-center p-4 text-gray-300 font-medium w-32">Checked By</th>
                  <th className="text-center p-4 text-gray-300 font-medium w-64">Documentation</th>
                </tr>
              </thead>
              <tbody>
                {displayedInstalls.map((install, index) => (
                  <tr 
                    key={install.id} 
                    className={`border-b border-gray-700 hover:bg-gray-750 ${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-850'}`}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleCritical(install.id)}
                          className="flex-shrink-0 p-1 rounded hover:bg-gray-700 transition-colors"
                          title={install.critical ? "Remove from Critical" : "Mark as Critical"}
                        >
                          {install.critical ? <SkullFilled /> : <SkullOutline />}
                        </button>
                        <span className="text-white font-medium">{install.name}</span>
                        {install.id > 104 && (
                          <button
                            onClick={() => deleteInstall(install.id)}
                            className="text-red-400 hover:text-red-300 text-xs ml-2"
                            title="Delete custom install"
                          >
                            (delete)
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        install.version === 'v2' ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-200'
                      }`}>
                        {install.version.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="text-gray-400 text-sm">{install.category}</span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => toggleStatus(install.id)}
                        className={`w-20 h-8 rounded-full transition-all duration-200 font-medium text-sm ${
                          install.status === null 
                            ? 'bg-gray-600 text-gray-300 hover:bg-gray-500' 
                            : install.status 
                              ? 'bg-green-600 text-white hover:bg-green-500' 
                              : 'bg-red-600 text-white hover:bg-red-500'
                        }`}
                      >
                        {install.status === null ? '—' : install.status ? 'GOOD' : 'BAD'}
                      </button>
                    </td>
                    <td className="p-4 text-center">
                      {editingDateId === install.id ? (
                        <div className="flex items-center gap-1 justify-center">
                          <input
                            type="date"
                            value={formatDateForInput(install.lastChecked)}
                            onChange={(e) => handleDateChange(install.id, e.target.value)}
                            onBlur={handleDateBlur}
                            autoFocus
                            className="bg-gray-700 border border-blue-500 rounded px-2 py-1 text-white text-sm w-32"
                          />
                          <button
                            onMouseDown={(e) => clearDate(install.id, e)}
                            className="text-red-400 hover:text-red-300 text-xs px-1"
                            title="Clear date"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => handleDateClick(install.id, install.lastChecked)}
                          className={`cursor-pointer px-2 py-1 rounded transition-colors ${
                            install.lastChecked 
                              ? 'text-gray-300 hover:bg-gray-700' 
                              : 'text-gray-500 hover:bg-gray-700 hover:text-gray-300'
                          }`}
                          title={install.lastChecked ? "Click to edit date" : "Click to set today's date"}
                        >
                          {install.lastChecked || 'Click to set'}
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <input
                        type="text"
                        value={install.checkedBy}
                        onChange={(e) => updateCheckedBy(install.id, e.target.value)}
                        placeholder="—"
                        className="bg-transparent border-b border-gray-600 text-gray-300 text-sm text-center w-full focus:outline-none focus:border-blue-500"
                      />
                    </td>
                    <td className="p-4">
                      <input
                        type="file"
                        accept=".txt"
                        ref={el => fileInputRefs.current[install.id] = el}
                        onChange={(e) => handleFileUpload(install.id, e)}
                        className="hidden"
                      />
                      {uploading === install.id ? (
                        <div className="flex items-center gap-2 justify-center text-gray-400">
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                          </svg>
                          <span className="text-sm">Uploading...</span>
                        </div>
                      ) : install.file ? (
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-300 truncate max-w-28" title={install.file.name}>
                              {install.file.name}
                            </span>
                            <span className="text-gray-500 text-xs whitespace-nowrap">
                              {install.file.uploadDate}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleFileDownload(install)}
                              className="px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded transition-colors"
                              title="Download"
                            >
                              ↓
                            </button>
                            <button
                              onClick={() => triggerFileInput(install.id)}
                              className="px-2 py-1 bg-gray-600 hover:bg-gray-500 text-white text-xs rounded transition-colors"
                              title="Replace"
                            >
                              ↻
                            </button>
                            <button
                              onClick={() => handleFileDelete(install.id)}
                              className="px-2 py-1 bg-red-600 hover:bg-red-500 text-white text-xs rounded transition-colors"
                              title="Delete"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => triggerFileInput(install.id)}
                          className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm rounded transition-colors flex items-center gap-2 mx-auto"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="17 8 12 3 7 8"/>
                            <line x1="12" y1="3" x2="12" y2="15"/>
                          </svg>
                          Upload
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="mt-4 text-gray-500 text-sm">
          Showing {displayedInstalls.length} {activeTab} installs • Click skull to toggle critical • Data saves automatically
        </div>
      </div>
    </div>
  )
}
