import { useNavigate } from 'react-router-dom';
import { getCategoriaConfig } from '../utils/categorie';

function ProdottoCard({ prodotto, onElimina }) {
  const navigate = useNavigate();
  const isAlert = prodotto.quantita <= prodotto.soglia_minima;
  const { colore, sfondo } = getCategoriaConfig(prodotto.categoria);

  const prezzoMigliore = prodotto.prezzi && prodotto.prezzi.length > 0
    ? prodotto.prezzi[0]
    : null;

  return (
    <div
      onClick={() => navigate(`/prodotto/${prodotto.id}`)}
      style={{
        backgroundColor: isAlert ? 'var(--amber-light)' : sfondo,
        borderRadius: 'var(--radius-md)',
        padding: '18px 20px',
        boxShadow: 'var(--shadow-sm)',
        border: `1.5px solid ${isAlert ? 'var(--amber)' : colore}`,
        cursor: 'pointer',
        transition: 'transform 0.15s, box-shadow 0.15s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            {isAlert && <span style={{ fontSize: 14 }}>⚠️</span>}
            <h3 style={{ fontSize: 17, fontWeight: 600, color: 'var(--green-dark)' }}>
              {prodotto.nome}
            </h3>
          </div>
          {prodotto.categoria && (
            <span style={{
              display: 'inline-block',
              backgroundColor: colore,
              color: 'white',
              fontSize: 11,
              fontWeight: 600,
              padding: '2px 10px',
              borderRadius: 'var(--radius-full)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              {prodotto.categoria}
            </span>
          )}
        </div>
        <div style={{
          backgroundColor: isAlert ? 'var(--amber)' : colore,
          color: 'white',
          borderRadius: 'var(--radius-sm)',
          padding: '6px 12px',
          textAlign: 'center',
          minWidth: 60,
        }}>
          <div style={{ fontSize: 18, fontWeight: 700, fontFamily: 'Fraunces, serif' }}>
            {prodotto.quantita}
          </div>
          <div style={{ fontSize: 10, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
            {prodotto.unita}
          </div>
        </div>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 10,
        borderTop: `1px solid ${colore}33`,
      }}>
        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          {prezzoMigliore ? (
            <span>
              🏷️ Best price: <strong style={{ color: 'var(--green-mid)' }}>
                £{Number(prezzoMigliore.prezzo).toFixed(2)}
              </strong> @ {prezzoMigliore.supermercato}
            </span>
          ) : (
            <span>No price recorded</span>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onElimina(prodotto.id);
          }}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            fontSize: 16,
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-muted)',
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => e.target.style.color = 'var(--red)'}
          onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
        >
          🗑️
        </button>
      </div>
    </div>
  );
}

export default ProdottoCard;