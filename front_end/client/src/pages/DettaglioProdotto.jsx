import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Toast from '../components/Toast';

const CATEGORIE = [
  'Pasta & Rice', 'Canned Goods & Sauces', 'Oils, Vinegars & Condiments',
  'Flours & Sugars', 'Legumes', 'Nuts & Seeds', 'Beverages',
  'Dairy', 'Meat & Fish', 'Fruits & Vegetables', 'Snacks & Sweets',
  'Cleaning & Hygiene', 'Other',
];

function DettaglioProdotto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [prodotto, setProdotto] = useState(null);
  const [prezzi, setPrezzi] = useState([]);
  const [modifica, setModifica] = useState(false);
  const [form, setForm] = useState({});
  const [nuovoPrezzo, setNuovoPrezzo] = useState({ supermercato: '', prezzo: '' });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (messaggio, tipo = 'successo') => setToast({ messaggio, tipo });

  const carica = async () => {
    try {
      const [resProdotti, resPrezzi] = await Promise.all([
        api.get('/prodotti'),
        api.get(`/prodotti/${id}/prezzi`),
      ]);
      const prod = resProdotti.data.find(p => p.id === parseInt(id));
      setProdotto(prod);
      setForm({
        nome: prod.nome,
        categoria: prod.categoria || 'Other',
        quantita: prod.quantita,
        unita: prod.unita,
        soglia_minima: prod.soglia_minima,
        scadenza: prod.scadenza ? prod.scadenza.split('T')[0] : '',
      });
      setPrezzi(resPrezzi.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { carica(); }, [id]);

  const handleSalva = async () => {
    try {
      await api.put(`/prodotti/${id}`, form);
      setModifica(false);
      carica();
      showToast('Changes saved!');
    } catch {
      showToast('Error saving changes', 'errore');
    }
  };

  const handleAggiungiPrezzo = async (e) => {
    e.preventDefault();
    if (!nuovoPrezzo.supermercato || !nuovoPrezzo.prezzo) return;
    try {
      await api.post(`/prodotti/${id}/prezzi`, nuovoPrezzo);
      setNuovoPrezzo({ supermercato: '', prezzo: '' });
      carica();
      showToast('Price added!');
    } catch {
      showToast('Error saving price', 'errore');
    }
  };

  const handleEliminaPrezzo = async (prezzoId) => {
    try {
      await api.delete(`/prodotti/${id}/prezzi/${prezzoId}`);
      carica();
      showToast('Price deleted');
    } catch {
      showToast('Error deleting price', 'errore');
    }
  };

  if (loading) return (
    <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>
      Loading...
    </div>
  );

  if (!prodotto) return (
    <div style={{ textAlign: 'center', padding: 60 }}>
      <p>Item not found</p>
      <button onClick={() => navigate('/')} style={btnSecondaryStyle}>← Back to pantry</button>
    </div>
  );

  const isAlert = prodotto.quantita <= prodotto.soglia_minima;

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '24px 16px 100px' }}>

      <button onClick={() => navigate('/')} style={{
        backgroundColor: 'transparent', border: 'none',
        color: 'var(--text-secondary)', fontSize: 14, fontWeight: 500,
        marginBottom: 20, padding: 0, display: 'flex',
        alignItems: 'center', gap: 4, cursor: 'pointer',
      }}>
        ← Back to pantry
      </button>

      {/* Item card */}
      <div style={{
        backgroundColor: 'var(--white)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px 20px',
        boxShadow: 'var(--shadow-md)',
        marginBottom: 20,
        border: `1.5px solid ${isAlert ? 'var(--amber)' : 'transparent'}`,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            {isAlert && (
              <div style={{
                display: 'inline-block',
                backgroundColor: 'var(--amber)', color: 'white',
                fontSize: 11, fontWeight: 600, padding: '3px 10px',
                borderRadius: 'var(--radius-full)', marginBottom: 8,
                textTransform: 'uppercase', letterSpacing: '0.5px',
              }}>
                ⚠️ Running low
              </div>
            )}
            <h2 style={{ fontSize: 26, fontWeight: 600, color: 'var(--green-dark)' }}>
              {prodotto.nome}
            </h2>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
              {prodotto.categoria}
            </p>
          </div>
          <button onClick={() => setModifica(!modifica)} style={{
            backgroundColor: modifica ? 'var(--cream-dark)' : 'var(--green-pale)',
            color: modifica ? 'var(--text-primary)' : 'var(--green-dark)',
            border: 'none', borderRadius: 'var(--radius-full)',
            padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}>
            {modifica ? '✕ Cancel' : '✏️ Edit'}
          </button>
        </div>

        {modifica ? (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Name</label>
                <input type="text" value={form.nome}
                  onChange={e => setForm({ ...form, nome: e.target.value })}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--green-light)'}
                  onBlur={e => e.target.style.borderColor = 'var(--cream-dark)'}
                />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Category</label>
                <select value={form.categoria}
                  onChange={e => setForm({ ...form, categoria: e.target.value })}
                  style={inputStyle}>
                  {CATEGORIE.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Quantity</label>
                <input type="number" value={form.quantita}
                  onChange={e => setForm({ ...form, quantita: parseInt(e.target.value) })}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--green-light)'}
                  onBlur={e => e.target.style.borderColor = 'var(--cream-dark)'}
                />
              </div>
              <div>
                <label style={labelStyle}>Unit</label>
                <select value={form.unita}
                  onChange={e => setForm({ ...form, unita: e.target.value })}
                  style={inputStyle}>
                  <option>pieces</option>
                  <option>kg</option>
                  <option>g</option>
                  <option>liters</option>
                  <option>ml</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Min threshold</label>
                <input type="number" value={form.soglia_minima}
                  onChange={e => setForm({ ...form, soglia_minima: parseInt(e.target.value) })}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--green-light)'}
                  onBlur={e => e.target.style.borderColor = 'var(--cream-dark)'}
                />
              </div>
              <div>
                <label style={labelStyle}>Expiry date</label>
                <input type="date" value={form.scadenza}
                  onChange={e => setForm({ ...form, scadenza: e.target.value })}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--green-light)'}
                  onBlur={e => e.target.style.borderColor = 'var(--cream-dark)'}
                />
              </div>
            </div>
            <button onClick={handleSalva} style={{
              width: '100%', marginTop: 16, padding: '13px',
              backgroundColor: 'var(--green-dark)', color: 'var(--cream)',
              border: 'none', borderRadius: 'var(--radius-sm)',
              fontSize: 15, fontWeight: 600, cursor: 'pointer',
            }}>
              Save changes
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { label: 'Quantity', value: `${prodotto.quantita} ${prodotto.unita}` },
              { label: 'Min threshold', value: `${prodotto.soglia_minima} ${prodotto.unita}` },
              { label: 'Expiry date', value: prodotto.scadenza ? new Date(prodotto.scadenza).toLocaleDateString('en-GB') : '—' },
              { label: 'Category', value: prodotto.categoria || '—' },
            ].map(({ label, value }) => (
              <div key={label} style={{
                backgroundColor: 'var(--cream)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px 16px',
              }}>
                <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>
                  {label}
                </div>
                <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--green-dark)' }}>
                  {value}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Prices section */}
      <div style={{
        backgroundColor: 'var(--white)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px 20px',
        boxShadow: 'var(--shadow-md)',
      }}>
        <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--green-dark)', marginBottom: 16 }}>
          🏷️ Prices by store
        </h3>

        {prezzi.length > 0 ? (
          <div style={{ marginBottom: 20 }}>
            {prezzi.map((p, index) => {
              const isBest = index === 0;
              return (
                <div key={p.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '12px 16px', borderRadius: 'var(--radius-sm)', marginBottom: 8,
                  backgroundColor: isBest ? 'var(--green-pale)' : 'var(--cream)',
                  border: `1.5px solid ${isBest ? 'var(--green-light)' : 'transparent'}`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {isBest && (
                      <span style={{
                        backgroundColor: 'var(--green-mid)', color: 'white',
                        fontSize: 10, fontWeight: 700, padding: '2px 8px',
                        borderRadius: 'var(--radius-full)', textTransform: 'uppercase', letterSpacing: '0.5px',
                      }}>
                        Best price
                      </span>
                    )}
                    <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--text-primary)' }}>
                      {p.supermercato}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{
                      fontSize: 18, fontWeight: 700, fontFamily: 'Fraunces, serif',
                      color: isBest ? 'var(--green-mid)' : 'var(--text-primary)',
                    }}>
                      £{Number(p.prezzo).toFixed(2)}
                    </span>
                    <button onClick={() => handleEliminaPrezzo(p.id)} style={{
                      backgroundColor: 'transparent', border: 'none',
                      color: 'var(--text-muted)', cursor: 'pointer', fontSize: 14, padding: '2px 6px',
                    }}
                      onMouseEnter={e => e.target.style.color = 'var(--red)'}
                      onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', fontSize: 14, marginBottom: 16 }}>
            No prices recorded yet
          </div>
        )}

        <form onSubmit={handleAggiungiPrezzo} style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr auto',
          gap: 10, alignItems: 'flex-end',
          paddingTop: 16, borderTop: '1px solid var(--cream-dark)',
        }}>
          <div>
            <label style={labelStyle}>Store</label>
            <input type="text" value={nuovoPrezzo.supermercato}
              onChange={e => setNuovoPrezzo({ ...nuovoPrezzo, supermercato: e.target.value })}
              placeholder="e.g. Whole Foods" style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'var(--green-light)'}
              onBlur={e => e.target.style.borderColor = 'var(--cream-dark)'}
            />
          </div>
          <div>
            <label style={labelStyle}>Price (£)</label>
            <input type="number" step="0.01" value={nuovoPrezzo.prezzo}
              onChange={e => setNuovoPrezzo({ ...nuovoPrezzo, prezzo: e.target.value })}
              placeholder="0.00" style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'var(--green-light)'}
              onBlur={e => e.target.style.borderColor = 'var(--cream-dark)'}
            />
          </div>
          <button type="submit" style={{
            backgroundColor: 'var(--green-dark)', color: 'var(--cream)',
            border: 'none', borderRadius: 'var(--radius-sm)',
            padding: '11px 16px', fontSize: 14, fontWeight: 600,
            cursor: 'pointer', whiteSpace: 'nowrap',
          }}>
            + Add
          </button>
        </form>
      </div>

      {toast && (
        <Toast messaggio={toast.messaggio} tipo={toast.tipo} onClose={() => setToast(null)} />
      )}
    </div>
  );
}

const labelStyle = {
  display: 'block', fontSize: 12, fontWeight: 500,
  color: 'var(--text-secondary)', marginBottom: 6,
  textTransform: 'uppercase', letterSpacing: '0.5px',
};

const inputStyle = {
  width: '100%', padding: '11px 14px',
  borderRadius: 'var(--radius-sm)',
  border: '1.5px solid var(--cream-dark)',
  fontSize: 14, backgroundColor: 'var(--cream)',
  color: 'var(--text-primary)', outline: 'none',
  transition: 'border-color 0.2s',
};

const btnSecondaryStyle = {
  backgroundColor: 'transparent',
  border: '1.5px solid var(--cream-dark)',
  borderRadius: 'var(--radius-sm)',
  padding: '10px 20px', fontSize: 14,
  cursor: 'pointer', marginTop: 12,
};

export default DettaglioProdotto;