#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { parse } from 'date-fns'

interface ContactSubmission {
  name: string
  email: string
  role: string
  message: string
  timestamp: string
  ip?: string
}

interface NewsletterSubmission {
  name: string
  email: string
  role: string
  challenge?: string
  consent: boolean
  timestamp: string
  ip?: string
}

// This would be replaced with actual database queries in production
function getContactSubmissions(): ContactSubmission[] {
  // Mock data for demonstration
  return [
    {
      name: 'John Doe',
      email: 'john@example.com',
      role: 'caregiver',
      message: 'I would love to learn more about your resources.',
      timestamp: '2024-01-15T10:30:00Z',
      ip: '192.168.1.1',
    },
    // More submissions would be loaded from database
  ]
}

function getNewsletterSubmissions(): NewsletterSubmission[] {
  // Mock data for demonstration
  return [
    {
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'caregiver',
      challenge: 'Finding time for self-care while caring for my elderly mother.',
      consent: true,
      timestamp: '2024-01-14T15:45:00Z',
      ip: '192.168.1.2',
    },
    // More submissions would be loaded from database
  ]
}

function arrayToCsv(data: any[]): string {
  if (data.length === 0) return ''

  const headers = Object.keys(data[0])
  const csvHeaders = headers.join(',')
  
  const csvRows = data.map(row => 
    headers.map(header => {
      const value = row[header]
      // Escape quotes and wrap in quotes if contains comma or quote
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`
      }
      return value
    }).join(',')
  )

  return [csvHeaders, ...csvRows].join('\n')
}

function exportSubmissions() {
  const outputDir = path.join(process.cwd(), 'exports')
  
  // Create exports directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  const timestamp = new Date().toISOString().split('T')[0] // YYYY-MM-DD format

  try {
    // Export contact submissions
    const contactSubmissions = getContactSubmissions()
    if (contactSubmissions.length > 0) {
      const contactCsv = arrayToCsv(contactSubmissions)
      const contactFilename = `contact-submissions-${timestamp}.csv`
      fs.writeFileSync(path.join(outputDir, contactFilename), contactCsv)
      console.log(`✅ Exported ${contactSubmissions.length} contact submissions to ${contactFilename}`)
    } else {
      console.log('ℹ️  No contact submissions to export')
    }

    // Export newsletter submissions
    const newsletterSubmissions = getNewsletterSubmissions()
    if (newsletterSubmissions.length > 0) {
      const newsletterCsv = arrayToCsv(newsletterSubmissions)
      const newsletterFilename = `newsletter-submissions-${timestamp}.csv`
      fs.writeFileSync(path.join(outputDir, newsletterFilename), newsletterCsv)
      console.log(`✅ Exported ${newsletterSubmissions.length} newsletter submissions to ${newsletterFilename}`)
    } else {
      console.log('ℹ️  No newsletter submissions to export')
    }

    console.log(`\n📁 All exports saved to: ${outputDir}`)
    
  } catch (error) {
    console.error('❌ Error exporting submissions:', error)
    process.exit(1)
  }
}

// Run the export if this file is executed directly
if (require.main === module) {
  console.log('🚀 Starting submission export...\n')
  exportSubmissions()
}

export { exportSubmissions }