const faqs = [
  {
    question: 'Bagaimana cara menaikkan listing?',
    answer: 'Klik tombol “Naikkan Listing” di detail listing untuk meningkatkan visibilitas.',
  },
  {
    question: 'Bisa simpan draft tanpa publish?',
    answer: 'Ya. Gunakan tombol “Simpan Draft” di form listing.',
  },
  {
    question: 'Apa saja foto yang harus diunggah?',
    answer: 'Minimal 5 foto: depan, samping, belakang, interior, dan mesin.',
  },
  {
    question: 'Bagaimana jika pembeli tidak merespons?',
    answer: 'Kirim follow-up ringan 1x, lalu fokus ke chat lain.',
  },
]

export const HelpPage = () => {
  return (
    <section className="help-page">
      <div className="help-header">
        <span className="pill">Pusat Bantuan</span>
        <h1>Kami siap membantu proses jualmu.</h1>
        <p className="muted">Cek pertanyaan populer atau hubungi support.</p>
      </div>
      <div className="help-grid">
        {faqs.map((faq) => (
          <article className="help-card" key={faq.question}>
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
