const tips = [
  {
    title: 'Foto terang dari berbagai sudut',
    desc: 'Tambahkan minimal 6 foto: depan, samping, belakang, interior, dan detail mesin.',
  },
  {
    title: 'Judul jelas dan spesifik',
    desc: 'Cantumkan merek, tipe, tahun, dan varian agar mudah dicari.',
  },
  {
    title: 'Harga sesuai pasar',
    desc: 'Gunakan harga kompetitif agar listing cepat dibuka calon pembeli.',
  },
  {
    title: 'Deskripsi jujur',
    desc: 'Tuliskan riwayat servis, kondisi ban, dan kekurangan kecil bila ada.',
  },
  {
    title: 'Respon chat cepat',
    desc: 'Balas dalam 5-10 menit pertama untuk meningkatkan peluang closing.',
  },
  {
    title: 'Update status',
    desc: 'Ganti status menjadi “Terjual” jika sudah laku agar listing rapi.',
  },
]

export const TipsPage = () => {
  return (
    <section className="tips-page">
      <div className="tips-header">
        <span className="pill">Pelajari Tips Jual</span>
        <h1>Strategi jual motor & mobil agar cepat laku.</h1>
        <p className="muted">
          Ikuti tips berikut untuk meningkatkan view, chat, dan peluang closing.
        </p>
      </div>
      <div className="tips-grid">
        {tips.map((tip) => (
          <article className="tips-card" key={tip.title}>
            <h3>{tip.title}</h3>
            <p>{tip.desc}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
