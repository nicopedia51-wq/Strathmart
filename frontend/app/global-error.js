'use client';

export default function GlobalError({
  error,
  reset,
}) {
  return (
    <html>
      <body>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: '#f8f9fa',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <div style={{ textAlign: 'center', maxWidth: '500px' }}>
            <h1 style={{ color: '#003366', marginBottom: '10px' }}>⚠️ Something went wrong</h1>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              An unexpected error occurred. Please try again.
            </p>
            {error?.message && (
              <pre style={{
                backgroundColor: '#fff',
                padding: '15px',
                borderRadius: '8px',
                borderLeft: '4px solid #B5121B',
                textAlign: 'left',
                color: '#333',
                fontSize: '12px',
                overflow: 'auto',
                maxHeight: '200px'
              }}>
                {error.message}
              </pre>
            )}
            <button
              onClick={() => reset()}
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                backgroundColor: '#E4B43A',
                color: '#003366',
                border: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#D4A126'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#E4B43A'}
            >
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
