function ProdottoCard({ prodotto, onElimina, onAggiorna }) {
  const isAlert = prodotto.quantita <= prodotto.soglia_minima;

  return (
    <div style={{
      border: `2px solid ${isAlert ? '#ffc107' : '#ddd'}`,
      borderRadius: 8,
      padding: 16,
      backgroundColor: isAlert ? '#fffdf0' : 'white',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div>
        <h3 style={{ margin: '0 0 4px 0' }}>
          {isAlert ? '⚠️ ' : ''}{prodotto.nome}
        </h3>
        <p style={{ margin: 0, color: '#666' }}>
          Quantità: <strong>{prodotto.quantita} {prodotto.unita}</strong> — Soglia: {prodotto.soglia_minima}
        </p>
        {prodotto.scadenza && (
          <p style={{ margin: '4px 0 0 0', color: '#999', fontSize: 13 }}>
            Scadenza: {new Date(prodotto.scadenza).toLocaleDateString('it-IT')}
          </p>
        )}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => onAggiorna(prodotto)} style={{
          padding: '6px 12px',
          backgroundColor: '#3498db',
          color: 'white',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer'
        }}>
          ✏️ Modifica
        </button>
        <button onClick={() => onElimina(prodotto.id)} style={{
          padding: '6px 12px',
          backgroundColor: '#e74c3c',
          color: 'white',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer'
        }}>
          🗑️ Elimina
        </button>
      </div>
    </div>
  );
}

export default ProdottoCard;