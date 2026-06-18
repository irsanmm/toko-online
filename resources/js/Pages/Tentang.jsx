// =============================================
// FILE: resources/js/Pages/Tentang.jsx
// =============================================
import { Head } from "@inertiajs/react";
import Layout from "./Layout";

export default function Tentang() {
    const stats = [
        { angka: "500+", label: "Produk Tersedia" },
        { angka: "10rb+", label: "Pelanggan Puas" },
        { angka: "4.8★", label: "Rating Toko" },
        { angka: "5 Tahun", label: "Pengalaman" },
    ];

    return (
        <Layout>
            <Head title="Tentang | AMENG STORE" />

            <div
                style={{
                    maxWidth: 800,
                    margin: "0 auto",
                    padding: "4rem 1.5rem",
                }}
            >
                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                    <h1 style={{ fontSize: "2rem", fontWeight: 800 }}>
                        Tentang Ameng Store
                    </h1>
                    <p
                        style={{
                            color: "#888",
                            marginTop: "0.5rem",
                            fontSize: "1.05rem",
                        }}
                    >
                        Kami hadir untuk kamu yang mencintai gaya dan
                        kenyamanan.
                    </p>
                </div>

                {/* Konten */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1.25rem",
                    }}
                >
                    {[
                        {
                            icon: "👟",
                            judul: "Siapa Kami?",
                            isi: "Ameng Store adalah toko sepatu premium yang didirikan pada tahun 2020. Kami menyediakan berbagai koleksi sepatu dari brand-brand ternama dunia dengan jaminan keaslian produk. Misi kami adalah memberikan pengalaman belanja sepatu terbaik untuk pelanggan Indonesia.",
                        },
                        {
                            icon: "🎯",
                            judul: "Visi & Misi",
                            isi: "Visi kami adalah menjadi toko sepatu online terpercaya nomor 1 di Indonesia. Misi kami adalah menghadirkan produk original berkualitas tinggi dengan harga kompetitif dan layanan pelanggan yang ramah dan profesional.",
                        },
                    ].map((item, i) => (
                        <div
                            key={i}
                            style={{
                                background: "#fff",
                                border: "1px solid #f0f0f0",
                                borderRadius: 14,
                                padding: "1.75rem",
                            }}
                        >
                            <h2
                                style={{
                                    fontSize: "1.1rem",
                                    fontWeight: 700,
                                    marginBottom: "0.75rem",
                                }}
                            >
                                {item.icon} {item.judul}
                            </h2>
                            <p style={{ color: "#374151", lineHeight: 1.8 }}>
                                {item.isi}
                            </p>
                        </div>
                    ))}

                    {/* Stats */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit, minmax(140px, 1fr))",
                            gap: "1rem",
                        }}
                    >
                        {stats.map((s, i) => (
                            <div
                                key={i}
                                style={{
                                    background: "#f9fafb",
                                    border: "1px solid #f0f0f0",
                                    borderRadius: 12,
                                    padding: "1.5rem",
                                    textAlign: "center",
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: "1.6rem",
                                        fontWeight: 800,
                                        color: "#f59e0b",
                                    }}
                                >
                                    {s.angka}
                                </div>
                                <div
                                    style={{
                                        fontSize: "0.8rem",
                                        color: "#888",
                                        marginTop: "0.25rem",
                                    }}
                                >
                                    {s.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
