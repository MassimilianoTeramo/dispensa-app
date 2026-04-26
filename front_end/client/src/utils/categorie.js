export const CATEGORIE_CONFIG = {
  'Pasta e riso':               { colore: '#e8792a', sfondo: '#fef3ea' },
  'Conserve e sughi':           { colore: '#c0392b', sfondo: '#fdecea' },
  'Olio, aceti e condimenti':   { colore: '#d4820a', sfondo: '#fef3dc' },
  'Farine e zuccheri':          { colore: '#b07d3a', sfondo: '#fdf3e3' },
  'Legumi':                     { colore: '#7a9e3b', sfondo: '#f0f5e8' },
  'Frutta secca e semi':        { colore: '#8b6914', sfondo: '#faf0d7' },
  'Bevande':                    { colore: '#2980b9', sfondo: '#eaf4fb' },
  'Latticini':                  { colore: '#8e44ad', sfondo: '#f5eefb' },
  'Carne e pesce':              { colore: '#c0392b', sfondo: '#fdecea' },
  'Frutta e verdura':           { colore: '#27ae60', sfondo: '#e8f8f0' },
  'Snack e dolci':              { colore: '#e91e8c', sfondo: '#fde8f3' },
  'Pulizia e igiene':           { colore: '#0097a7', sfondo: '#e0f7fa' },
  'Altro':                      { colore: '#78909c', sfondo: '#f0f4f5' },
};

export const getCategoriaConfig = (categoria) => {
  return CATEGORIE_CONFIG[categoria] || CATEGORIE_CONFIG['Altro'];
};