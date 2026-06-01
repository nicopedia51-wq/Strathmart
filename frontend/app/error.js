'use client';

import Link from 'next/link';
import { STRATHMORE_COLORS } from '@/lib/strathmore-colors';

export default function Error({
  error,
  reset,
}) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      backgroundColor: STRATHMORE_COLORS.bgGrey,
      padding: '40px 20px'
    }}>
      <div style={{ textAlign: 'center', maxWidth: '500px' }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>😕</div>
        <h1 style={{
          color: STRATHMORE_COLORS.primary,
          marginBottom: '10px',
          fontSize: '32px'
        }}>
          Oops! Something went wrong
        </h1>
        <p style={{
          color: '#666',
          marginBottom: '30px',
          lineHeight: '1.6'
        }}>
          We encountered an unexpected error. Our team has been notified.
        </p>
        
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => reset()}
            style={{
              padding: '12px 24px',
              backgroundColor: STRATHMORE_COLORS.action,
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
          <Link
            href="/"
            style={{
              padding: '12px 24px',
              backgroundColor: STRATHMORE_COLORS.primary,
              color: 'white',
              textDecoration: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: 'bold',
              display: 'inline-block'
            }}
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
