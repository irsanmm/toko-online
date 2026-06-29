import { Head, Link, usePage } from "@inertiajs/react";
import Layout from "./Layout";
import ProductCard from "./ProductCard";

export default function Home({ featured }) {
    const { auth } = usePage().props;
    const isLogin = auth?.isLogin;
    const pembeli = auth?.pembeli;

    const keunggulan = [
        {
            icon: "🚚",
            judul: "Gratis Ongkir",
            sub: "Pembelian di atas Rp 800.000",
        },
        {
            icon: "✅",
            judul: "Produk Original",
            sub: "100% resmi & bergaransi",
        },
        { icon: "🔄", judul: "Mudah Return", sub: "Pengembalian dalam 7 hari" },
        { icon: "💳", judul: "Bayar Aman", sub: "Berbagai metode pembayaran" },
    ];

    return (
        <Layout>
            <Head title="AMENG STORE | Premium Footwear" />

            {/* ===== HERO ===== */}
            <section
                style={{
                    background:
                        "linear-gradient(135deg, #111 0%, #1e1e1e 60%, #f59e0b22 100%)",
                    color: "#fff",
                    padding: "6rem 2rem",
                    textAlign: "center",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        top: -80,
                        right: -80,
                        width: 400,
                        height: 400,
                        borderRadius: "50%",
                        background: "#f59e0b",
                        opacity: 0.06,
                    }}
                />
                <p
                    style={{
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        letterSpacing: "0.2em",
                        color: "#f59e0b",
                        marginBottom: "1rem",
                    }}
                >
                    NEW ARRIVALS 2026
                </p>
                <h1
                    style={{
                        fontSize: "clamp(2.5rem, 6vw, 4rem)",
                        fontWeight: 800,
                        lineHeight: 1.1,
                        marginBottom: "1.25rem",
                    }}
                >
                    {isLogin ? (
                        <>
                            Selamat Datang,
                            <br />
                            <span style={{ color: "#f59e0b" }}>
                                {pembeli.name.split(" ")[0]}! 👋
                            </span>
                        </>
                    ) : (
                        <>
                            Step Up
                            <br />
                            <span style={{ color: "#f59e0b" }}>Your Game.</span>
                        </>
                    )}
                </h1>
                <p
                    style={{
                        fontSize: "1.05rem",
                        color: "#aaa",
                        maxWidth: 420,
                        margin: "0 auto 2.5rem",
                    }}
                >
                    {isLogin
                        ? "Ada koleksi baru yang menunggumu hari ini. Yuk, cek sekarang"
                        : "Koleksi premium footwear terbaru hadir untuk melengkapi setiap langkah kamu."}
                </p>

                <div
                    style={{
                        display: "flex",
                        gap: "1rem",
                        justifyContent: "center",
                        flexWrap: "wrap",
                    }}
                >
                    <Link
                        href="/katalog"
                        style={{
                            display: "inline-block",
                            background: "#f59e0b",
                            color: "#111",
                            padding: "0.85rem 2.5rem",
                            borderRadius: 999,
                            fontWeight: 800,
                            fontSize: "0.95rem",
                        }}
                    >
                        Lihat Koleksi →
                    </Link>
                </div>
            </section>

            {/* ===== PRODUK PILIHAN ===== */}
            <section
                style={{
                    maxWidth: 1200,
                    margin: "0 auto",
                    padding: "4rem 1.5rem",
                }}
            >
                <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                    <h2 style={{ fontSize: "1.75rem", fontWeight: 800 }}>
                        Produk Pilihan
                    </h2>
                    <p style={{ color: "#888", marginTop: "0.5rem" }}>
                        Koleksi terpopuler pilihan pelanggan kami
                    </p>
                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fill, minmax(240px, 1fr))",
                        gap: "1.25rem",
                    }}
                >
                    {featured.map((produk) => (
                        <ProductCard key={produk.id} produk={produk} />
                    ))}
                </div>
            </section>

            {/* ===== BANNER: beda konten sesuai status login ===== */}
            {isLogin ? (
                /* Sudah login: banner lanjutkan belanja */
                <section
                    style={{
                        background: "#111",
                        margin: "0 1.5rem",
                        borderRadius: 20,
                        padding: "2.5rem 2rem",
                        textAlign: "center",
                        maxWidth: 1160,
                        marginLeft: "auto",
                        marginRight: "auto",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: "1rem",
                    }}
                >
                    <div style={{ textAlign: "left" }}>
                        <p
                            style={{
                                color: "#f59e0b",
                                fontWeight: 700,
                                fontSize: "0.8rem",
                                letterSpacing: "0.1em",
                                marginBottom: "0.4rem",
                            }}
                        >
                            KHUSUS UNTUKMU
                        </p>
                        <h2
                            style={{
                                color: "#fff",
                                fontSize: "1.3rem",
                                fontWeight: 800,
                            }}
                        >
                            Belanja lebih hemat dengan poin kamu! 🎁
                        </h2>
                        <p
                            style={{
                                color: "#888",
                                fontSize: "0.85rem",
                                marginTop: "0.4rem",
                            }}
                        >
                            Kamu punya{" "}
                            <strong style={{ color: "#f59e0b" }}>
                                250 poin
                            </strong>{" "}
                            yang bisa ditukar diskon.
                        </p>
                    </div>
                    <Link
                        href="/katalog"
                        style={{
                            display: "inline-block",
                            background: "#f59e0b",
                            color: "#111",
                            padding: "0.75rem 2rem",
                            borderRadius: 999,
                            fontWeight: 700,
                            fontSize: "0.9rem",
                            flexShrink: 0,
                        }}
                    >
                        Belanja Sekarang
                    </Link>
                </section>
            ) : (
                /* Belum login: banner daftar / promo */
                <section
                    style={{
                        background: "#f59e0b",
                        margin: "0 1.5rem",
                        borderRadius: 20,
                        padding: "3rem 2rem",
                        textAlign: "center",
                        maxWidth: 1160,
                        marginLeft: "auto",
                        marginRight: "auto",
                    }}
                >
                    <h2
                        style={{
                            fontSize: "1.5rem",
                            fontWeight: 800,
                            marginBottom: "0.5rem",
                            color: "#111",
                        }}
                    >
                        🔥 Flash Sale Hari Ini!
                    </h2>
                    <p style={{ color: "#4a3800", marginBottom: "1.5rem" }}>
                        Diskon hingga 30% untuk produk pilihan. Stok terbatas!
                    </p>
                    <div
                        style={{
                            display: "flex",
                            gap: "0.75rem",
                            justifyContent: "center",
                            flexWrap: "wrap",
                        }}
                    >
                        <Link
                            href="/katalog"
                            style={{
                                display: "inline-block",
                                background: "#111",
                                color: "#fff",
                                padding: "0.75rem 2rem",
                                borderRadius: 999,
                                fontWeight: 700,
                                fontSize: "0.9rem",
                            }}
                        >
                            Belanja Sekarang
                        </Link>
                        <Link
                            href="/pembeli/register"
                            style={{
                                display: "inline-block",
                                background: "#fff",
                                color: "#111",
                                padding: "0.75rem 2rem",
                                borderRadius: 999,
                                fontWeight: 700,
                                fontSize: "0.9rem",
                                border: "2px solid #111",
                            }}
                        >
                            Daftar Sekarang
                        </Link>
                    </div>
                </section>
            )}

            {/* ===== KEUNGGULAN ===== */}
            <section
                style={{
                    background: "#f9fafb",
                    padding: "4rem 1.5rem",
                    marginTop: "4rem",
                }}
            >
                <div style={{ maxWidth: 1000, margin: "0 auto" }}>
                    <h2
                        style={{
                            textAlign: "center",
                            fontSize: "1.5rem",
                            fontWeight: 800,
                            marginBottom: "2.5rem",
                        }}
                    >
                        Kenapa Ameng Store?
                    </h2>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit, minmax(200px, 1fr))",
                            gap: "1rem",
                        }}
                    >
                        {keunggulan.map((k, i) => (
                            <div
                                key={i}
                                style={{
                                    background: "#fff",
                                    borderRadius: 14,
                                    border: "1px solid #f0f0f0",
                                    padding: "1.5rem",
                                    textAlign: "center",
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: "2rem",
                                        marginBottom: "0.75rem",
                                    }}
                                >
                                    {k.icon}
                                </div>
                                <div
                                    style={{
                                        fontWeight: 700,
                                        fontSize: "1rem",
                                        marginBottom: "0.3rem",
                                    }}
                                >
                                    {k.judul}
                                </div>
                                <div
                                    style={{
                                        fontSize: "0.82rem",
                                        color: "#888",
                                    }}
                                >
                                    {k.sub}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </Layout>
    );
}
