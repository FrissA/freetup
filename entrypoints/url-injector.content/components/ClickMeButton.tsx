export function ClickMeButton() {
  return (
    <button
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 999999,
        background: 'red',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
      }}
      onClick={() => console.log('hello')}
    >
      click me
    </button>
  );
}
