const threads = [
  {
    name: 'Dina Pratama',
    listing: 'Honda PCX 160 CBS 2023',
    message: 'Bisa nego sedikit untuk pembayaran cash?',
    time: '10:24',
  },
  {
    name: 'Rizky Halim',
    listing: 'Toyota Avanza G 2019 Manual',
    message: 'Kapan bisa lihat unit? Saya di Bekasi.',
    time: '09:02',
  },
  {
    name: 'Salsa K.',
    listing: 'Yamaha NMAX 155 Connected 2022',
    message: 'Ready weekend ini untuk test ride?',
    time: 'Kemarin',
  },
]

export const MessagesPage = () => {
  return (
    <section className="messages-page">
      <div className="messages-header">
        <span className="pill">Pesan Masuk</span>
        <h1>Kelola percakapan dengan calon pembeli.</h1>
        <p className="muted">Balas cepat agar peluang closing lebih tinggi.</p>
      </div>
      <div className="messages-grid">
        {threads.map((thread) => (
          <article className="message-card" key={`${thread.name}-${thread.time}`}>
            <div>
              <strong>{thread.name}</strong>
              <p className="muted">{thread.listing}</p>
            </div>
            <p>{thread.message}</p>
            <span className="message-time">{thread.time}</span>
          </article>
        ))}
      </div>
    </section>
  )
}
