function AlertBanner({ prodotti }) {
  if (prodotti.length === 0) return null;

  return (
    <div style={{
      backgroundColor: '#fff3cd',
      border: '1px solid #ffc107',
      borderRadius: 8,
      padding: 16,
      marginBottom: 24
    }}>
      <h3 style={{ margin: '0 0 8px 0' }}>⚠️ Prodotti in esaurimento</h3>
      <ul style={{ margin: 0, paddingLeft: 20 }}>
        {prodotti.map(p => (
          <li key={p.id}>
            <strong>{p.nome}</strong> — rimasti {p.quantita} {p.unita} (soglia minima: {p.soglia_minima})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AlertBanner;