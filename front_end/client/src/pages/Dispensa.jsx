import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import AlertBanner from '../components/AlertBanner';
import ProdottoCard from '../components/ProdottoCard';
import Toast from '../components/Toast';

const CATEGORIE = [
  'Pasta e riso',
  'Conserve e sughi',
  'Olio, aceti e condimenti',
  'Farine e zuccheri',
  'Legumi',
  'Frutta secca e semi',
  'Bevande',
  'Latticini',
  'Carne e pesce',
  'Frutta e verdura',
  'Snack e dolci',
  'Pulizia e igiene',
  'Altro',
];

const formVuoto = {
  nome: '',
  categoria: 'Altro',
  quantita: 0,
  unita: 'pezzi',
  soglia_minima: 1,
  scadenza: '',
};

function Dispensa() {
  const [prodotti, setProdotti] = useState([]);
  const [alert, setAlert] = useState([]);
  const [form, setForm] = useState(formVuoto);
  const [mostraForm, setMostraForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [filtroCategoria, setFiltroCategoria] = useState('Tutti');
  const navigate = useNavigate();

  const showToast = (messaggio, tipo = 'successo') => {
  setToast({ messaggio, tipo });
};

  const caricaProdotti = async () => {
    try {
      const [resProdotti, resAlert] = await Promise.all([
        api.get('/prodotti'),
        api.get('/prodotti/alert'),
      ]);
      setProdotti(resProdotti.data);
      setAlert(resAlert.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    caricaProdotti();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/prodotti', form);
      setForm(formVuoto);
      setMostraForm(false);
      caricaProdotti();
      showToast('Prodotto aggiunto con successo!');
    } catch (err) {
      console.error(err);
      showToast('Errore nell\'aggiunta del prodotto!', 'errore');
    }
  };

const handleElimina = async (id) => {
  if (window.confirm('Eliminare questo prodotto?')) {
    try {
      await api.delete(`/prodotti/${id}`);
      caricaProdotti();
      showToast('Prodotto eliminato');
    } catch {
      showToast('Errore durante eliminazione', 'errore');
    }
  }
};

  const categoriePresenti = ['Tutti', ...new Set(prodotti.map(p => p.categoria || 'Altro'))];
  const prodottiFiltrati = filtroCategoria === 'Tutti'
    ? prodotti
    : prodotti.filter(p => (p.categoria || 'Altro') === filtroCategoria);

  return (
    <div style={{
      maxWidth: 680,
      margin: '0 auto',
      padding: '24px 16px 100px',
    }}>
      <AlertBanner prodotti={alert} />

      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
      }}>
        <div>
          <h2 style={{ fontSize: 26, fontWeight: 600, color: 'var(--green-dark)' }}>
            Dispensa
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
            {prodotti.length} {prodotti.length === 1 ? 'prodotto' : 'prodotti'}
          </p>
        </div>
        <button
          onClick={() => { setMostraForm(!mostraForm); setForm(formVuoto); }}
          style={{
            backgroundColor: mostraForm ? 'var(--cream-dark)' : 'var(--green-dark)',
            color: mostraForm ? 'var(--text-primary)' : 'var(--cream)',
            border: 'none',
            borderRadius: 'var(--radius-full)',
            padding: '10px 20px',
            fontSize: 14,
            fontWeight: 600,
            transition: 'all 0.2s',
          }}
        >
          {mostraForm ? '✕ Chiudi' : '+ Aggiungi'}
        </button>
      </div>

      {/* Form aggiunta */}
      {mostraForm && (
        <div style={{
          backgroundColor: 'var(--white)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px 20px',
          marginBottom: 24,
          boxShadow: 'var(--shadow-md)',
        }}>
          <h3 style={{ fontSize: 18, marginBottom: 20, color: 'var(--green-dark)' }}>
            Nuovo prodotto
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

              {/* Nome */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Nome *</label>
                <input
                  type="text"
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  required
                  placeholder="es. Pasta"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--green-light)'}
                  onBlur={e => e.target.style.borderColor = 'var(--cream-dark)'}
                />
              </div>

              {/* Categoria */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Categoria</label>
                <select
                  value={form.categoria}
                  onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                  style={inputStyle}
                >
                  {CATEGORIE.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              {/* Quantità */}
              <div>
                <label style={labelStyle}>Quantità</label>
                <input
                  type="number"
                  value={form.quantita}
                  onChange={(e) => setForm({ ...form, quantita: parseInt(e.target.value) })}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--green-light)'}
                  onBlur={e => e.target.style.borderColor = 'var(--cream-dark)'}
                />
              </div>

              {/* Unità */}
              <div>
                <label style={labelStyle}>Unità</label>
                <select
                  value={form.unita}
                  onChange={(e) => setForm({ ...form, unita: e.target.value })}
                  style={inputStyle}
                >
                  <option>pezzi</option>
                  <option>kg</option>
                  <option>g</option>
                  <option>litri</option>
                  <option>ml</option>
                </select>
              </div>

              {/* Soglia minima */}
              <div>
                <label style={labelStyle}>Soglia minima</label>
                <input
                  type="number"
                  value={form.soglia_minima}
                  onChange={(e) => setForm({ ...form, soglia_minima: parseInt(e.target.value) })}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--green-light)'}
                  onBlur={e => e.target.style.borderColor = 'var(--cream-dark)'}
                />
              </div>

              {/* Scadenza */}
              <div>
                <label style={labelStyle}>Scadenza</label>
                <input
                  type="date"
                  value={form.scadenza}
                  onChange={(e) => setForm({ ...form, scadenza: e.target.value })}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--green-light)'}
                  onBlur={e => e.target.style.borderColor = 'var(--cream-dark)'}
                />
              </div>

            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                marginTop: 20,
                padding: '13px',
                backgroundColor: 'var(--green-dark)',
                color: 'var(--cream)',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                fontSize: 15,
                fontWeight: 600,
              }}
            >
              + Aggiungi prodotto
            </button>
          </form>
        </div>
      )}

      {/* Filtro categorie */}
      {prodotti.length > 0 && (
        <div style={{
          display: 'flex',
          gap: 8,
          overflowX: 'auto',
          paddingBottom: 8,
          marginBottom: 16,
          scrollbarWidth: 'none',
        }}>
          {categoriePresenti.map(cat => (
            <button
              key={cat}
              onClick={() => setFiltroCategoria(cat)}
              style={{
                whiteSpace: 'nowrap',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                border: '1.5px solid',
                borderColor: filtroCategoria === cat ? 'var(--green-dark)' : 'var(--cream-dark)',
                backgroundColor: filtroCategoria === cat ? 'var(--green-dark)' : 'transparent',
                color: filtroCategoria === cat ? 'var(--cream)' : 'var(--text-secondary)',
                fontSize: 13,
                fontWeight: 500,
                transition: 'all 0.2s',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Lista prodotti */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>
          Caricamento...
        </div>
      ) : prodottiFiltrati.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: 60,
          color: 'var(--text-muted)',
        }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🥫</div>
          <p style={{ fontSize: 16 }}>Nessun prodotto in dispensa</p>
          <p style={{ fontSize: 13, marginTop: 4 }}>Aggiungi il tuo primo prodotto!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {prodottiFiltrati.map(p => (
            <ProdottoCard
              key={p.id}
              prodotto={p}
              onElimina={handleElimina}
            />
          ))}
        </div>
      )}

      {toast && (
        <Toast
          messaggio={toast.messaggio}
          tipo={toast.tipo}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

const labelStyle = {
  display: 'block',
  fontSize: 12,
  fontWeight: 500,
  color: 'var(--text-secondary)',
  marginBottom: 6,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

const inputStyle = {
  width: '100%',
  padding: '11px 14px',
  borderRadius: 'var(--radius-sm)',
  border: '1.5px solid var(--cream-dark)',
  fontSize: 14,
  backgroundColor: 'var(--cream)',
  color: 'var(--text-primary)',
  outline: 'none',
  transition: 'border-color 0.2s',
};

export default Dispensa;