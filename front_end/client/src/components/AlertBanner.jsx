function AlertBanner({ prodotti }) {
  if (prodotti.length === 0) return null;

  return (
    <div style={{
      backgroundColor: 'var(--amber-light)',
      border: '1.5px solid var(--amber)',
      borderRadius: 'var(--radius-md)',
      padding: '16px 20px',
      marginBottom: 24,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 10,
      }}>
        <span style={{ fontSize: 18 }}>⚠️</span>
        <h3 style={{
          fontSize: 15,
          fontWeight: 600,
          color: 'var(--amber)',
          fontFamily: 'DM Sans, sans-serif',
        }}>
          {prodotti.length} {prodotti.length === 1 ? 'item running low' : 'items running low'}
        </h3>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {prodotti.map(p => (
          <div key={p.id} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 14,
            color: 'var(--text-primary)',
          }}>
            <span>• {p.nome}</span>
            <span style={{
              backgroundColor: 'var(--amber)',
              color: 'white',
              borderRadius: 'var(--radius-full)',
              padding: '2px 10px',
              fontSize: 12,
              fontWeight: 600,
            }}>
              {p.quantita} {p.unita}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AlertBanner;