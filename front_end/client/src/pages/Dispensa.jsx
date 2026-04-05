import { useState, useEffect } from 'react';
import api from '../api/axios';
import AlertBanner from '../components/AlertBanner';
import ProdottoCard from '../components/ProdottoCard';

const formVuoto = {
  nome: '',
  quantita: 0,
  unita: 'pezzi',
  soglia_minima: 1,
  scadenza: ''
};

function Dispensa() {
  const [prodotti, setProdotti] = useState([]);
  const [alert, setAlert] = useState([]);
  const [form, setForm] = useState(formVuoto);
  const [modificaId, setModificaId] = useState(null);
  const [mostraForm, setMostraForm] = useState(false);

  const caricaProdotti = async () => {
    const [resProdotti, resAlert] = await Promise.all([
      api.get('/prodotti'),
      api.get('/prodotti/alert')
    ]);
    setProdotti(resProdotti.data);
    setAlert(resAlert.data);
  };

  useEffect(() => {
    caricaProdotti();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (modificaId) {
      await api.put(`/prodotti/${modificaId}`, form);
    } else {
      await api.post('/prodotti', form);
    }
    setForm(formVuoto);
    setModificaId(null);
    setMostraForm(false);
    caricaProdotti();
  };

  const handleElimina = async (id) => {
    if (window.confirm('Sei sicuro di voler eliminare questo prodotto?')) {
      await api.delete(`/prodotti/${id}`);
      caricaProdotti();
    }
  };

  const handleAggiorna = (prodotto) => {
    setForm({
      nome: prodotto.nome,
      quantita: prodotto.quantita,
      unita: prodotto.unita,
      soglia_minima: prodotto.soglia_minima,
      scadenza: prodotto.scadenza ? prodotto.scadenza.split('T')[0] : ''
    });
    setModificaId(prodotto.id);
    setMostraForm(true);
  };

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', padding: 24 }}>
      <AlertBanner prodotti={alert} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>La mia Dispensa ({prodotti.length} prodotti)</h2>
        <button onClick={() => { setMostraForm(!mostraForm); setForm(formVuoto); setModificaId(null); }}
          style={{
            padding: '10px 20px',
            backgroundColor: '#2ecc71',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            fontSize: 16
          }}>
          {mostraForm ? '✕ Chiudi' : '+ Aggiungi prodotto'}
        </button>
      </div>

      {mostraForm && (
        <form onSubmit={handleSubmit} style={{
          backgroundColor: '#f8f9fa',
          padding: 20,
          borderRadius: 8,
          marginBottom: 24,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12
        }}>
          <div>
            <label>Nome *</label>
            <input
              type="text"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              required
              style={{ width: '100%', padding: 8, marginTop: 4 }}
            />
          </div>
          <div>
            <label>Quantità</label>
            <input
              type="number"
              value={form.quantita}
              onChange={(e) => setForm({ ...form, quantita: parseInt(e.target.value) })}
              style={{ width: '100%', padding: 8, marginTop: 4 }}
            />
          </div>
          <div>
            <label>Unità</label>
            <select
              value={form.unita}
              onChange={(e) => setForm({ ...form, unita: e.target.value })}
              style={{ width: '100%', padding: 8, marginTop: 4 }}
            >
              <option>pezzi</option>
              <option>kg</option>
              <option>g</option>
              <option>litri</option>
              <option>ml</option>
            </select>
          </div>
          <div>
            <label>Soglia minima</label>
            <input
              type="number"
              value={form.soglia_minima}
              onChange={(e) => setForm({ ...form, soglia_minima: parseInt(e.target.value) })}
              style={{ width: '100%', padding: 8, marginTop: 4 }}
            />
          </div>
          <div>
            <label>Scadenza</label>
            <input
              type="date"
              value={form.scadenza}
              onChange={(e) => setForm({ ...form, scadenza: e.target.value })}
              style={{ width: '100%', padding: 8, marginTop: 4 }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button type="submit" style={{
              width: '100%',
              padding: 10,
              backgroundColor: '#2c3e50',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
              fontSize: 16
            }}>
              {modificaId ? '✏️ Salva modifiche' : '+ Aggiungi'}
            </button>
          </div>
        </form>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {prodotti.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#999' }}>
            Nessun prodotto in dispensa. Aggiungine uno!
          </p>
        ) : (
          prodotti.map(p => (
            <ProdottoCard
              key={p.id}
              prodotto={p}
              onElimina={handleElimina}
              onAggiorna={handleAggiorna}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Dispensa;