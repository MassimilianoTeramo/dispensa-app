import { useEffect } from 'react';

function Toast({ messaggio, tipo = 'successo', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colori = {
    successo: { bg: 'var(--green-dark)', icon: '✓' },
    errore:   { bg: 'var(--red)',        icon: '✕' },
    info:     { bg: 'var(--amber)',      icon: 'ℹ' },
  };

  const { bg, icon } = colori[tipo] || colori.successo;

  return (
    <div style={{
      position: 'fixed',
      bottom: 32,
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: bg,
      color: 'white',
      padding: '12px 20px',
      borderRadius: 'var(--radius-full)',
      boxShadow: 'var(--shadow-lg)',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      fontSize: 14,
      fontWeight: 500,
      zIndex: 1000,
      animation: 'fadeInUp 0.2s ease',
      whiteSpace: 'nowrap',
    }}>
      <span style={{
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: '50%',
        width: 22,
        height: 22,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 12,
        fontWeight: 700,
      }}>
        {icon}
      </span>
      {messaggio}
    </div>
  );
}

export default Toast;