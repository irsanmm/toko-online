import { Head, Link } from "@inertiajs/react";
import { useState } from "react";
import Layout from "./Layout";

export default function DetailProduk({ produk }) {
    const [ukuran, setUkuran] = useState("");
    const [qty, setQty] = useState(1);
    const [added, setAdded] = useState(false);
    const [activeImg, setActiveImg] = useState(0);

    // Simulasi beberapa gambar (nanti bisa dari database)
    const images = [produk.gambar, produk.gambar, produk.gambar];

    const formatHarga = (n) => "Rp " + n.toLocaleString("id-ID");

    const handleAddToCart = () => {
        if (!ukuran) {
            alert("Pilih ukuran terlebih dahulu!");
            return;
        }
        const cart = JSON.parse(localStorage.getItem("amengCart") || "[]");
        const existing = cart.find(
            (i) => i.id === produk.id && i.ukuran === ukuran,
        );
        if (existing) {
            existing.qty += qty;
        } else {
            cart.push({ ...produk, ukuran, qty });
        }
        localStorage.setItem("amengCart", JSON.stringify(cart));
        window.dispatchEvent(new Event("cartUpdated"));
        setAdded(true);
        setTimeout(() => setAdded(false), 2500);
    };

    const ukuranGuide = [
        { eu: 38, us: 6, cm: 24 },
        { eu: 39, us: 6.5, cm: 24.5 },
        { eu: 40, us: 7, cm: 25 },
        { eu: 41, us: 7.5, cm: 25.5 },
        { eu: 42, us: 8, cm: 26 },
        { eu: 43, us: 8.5, cm: 26.5 },
        { eu: 44, us: 9, cm: 27 },
    ];

    return (
        <Layout>
            <Head title={`${produk.nama} | AMENG STORE`} />

            <div
                style={{
                    maxWidth: 1100,
                    margin: "0 auto",
                    padding: "2rem 1.5rem",
                }}
            >
                {/* Breadcrumb */}
                <div
                    style={{
                        fontSize: "0.8rem",
                        color: "#888",
                        marginBottom: "1.5rem",
                    }}
                >
                    <Link href="/" style={{ color: "#888" }}>
                        Home
                    </Link>{" "}
                    /{" "}
                    <Link href="/katalog" style={{ color: "#888" }}>
                        Katalog
                    </Link>{" "}
                    /{" "}
                    <span style={{ color: "#111", fontWeight: 600 }}>
                        {produk.nama}
                    </span>
                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "3rem",
                        alignItems: "start",
                    }}
                >
                    {/* Gambar */}
                    <div>
                        <div
                            style={{
                                background: "#f9fafb",
                                borderRadius: 16,
                                padding: "2rem",
                                marginBottom: "1rem",
                                border: "1px solid #f0f0f0",
                            }}
                        >
                            <img
                                src={images[activeImg]}
                                alt={produk.nama}
                                style={{
                                    width: "100%",
                                    height: 360,
                                    objectFit: "contain",
                                }}
                                onError={(e) =>
                                    (e.target.src =
                                        "https://placehold.co/400x360?text=No+Image")
                                }
                            />
                        </div>
                        {/* Thumbnail */}
                        <div style={{ display: "flex", gap: "0.75rem" }}>
                            {images.map((img, i) => (
                                <div
                                    key={i}
                                    onClick={() => setActiveImg(i)}
                                    style={{
                                        width: 72,
                                        height: 72,
                                        borderRadius: 10,
                                        overflow: "hidden",
                                        border: `2px solid ${activeImg === i ? "#f59e0b" : "#f0f0f0"}`,
                                        background: "#f9fafb",
                                        cursor: "pointer",
                                        padding: "0.25rem",
                                    }}
                                >
                                    <img
                                        src={img}
                                        alt=""
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "contain",
                                        }}
                                        onError={(e) =>
                                            (e.target.src =
                                                "https://placehold.co/70x70?text=Img")
                                        }
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Info Produk */}
                    <div>
                        <div
                            style={{
                                fontSize: "0.75rem",
                                fontWeight: 700,
                                color: "#f59e0b",
                                letterSpacing: "0.1em",
                                marginBottom: "0.5rem",
                            }}
                        >
                            {produk.brand}
                        </div>
                        <h1
                            style={{
                                fontSize: "1.75rem",
                                fontWeight: 800,
                                lineHeight: 1.2,
                                marginBottom: "0.75rem",
                            }}
                        >
                            {produk.nama}
                        </h1>

                        {/* Stok */}
                        <span
                            style={{
                                fontSize: "0.78rem",
                                fontWeight: 700,
                                padding: "3px 12px",
                                borderRadius: 999,
                                background:
                                    produk.stok > 0 ? "#dcfce7" : "#fee2e2",
                                color: produk.stok > 0 ? "#16a34a" : "#dc2626",
                            }}
                        >
                            {produk.stok > 0
                                ? `Stok tersedia: ${produk.stok}`
                                : "Stok habis"}
                        </span>

                        <div
                            style={{
                                fontSize: "2rem",
                                fontWeight: 800,
                                margin: "1rem 0",
                            }}
                        >
                            {formatHarga(produk.harga)}
                        </div>

                        <p
                            style={{
                                color: "#555",
                                lineHeight: 1.8,
                                marginBottom: "1.5rem",
                                fontSize: "0.95rem",
                            }}
                        >
                            {produk.deskripsi}
                        </p>

                        {/* Pilih Ukuran */}
                        <div style={{ marginBottom: "1.25rem" }}>
                            <div
                                style={{
                                    fontWeight: 700,
                                    marginBottom: "0.6rem",
                                    fontSize: "0.9rem",
                                }}
                            >
                                Pilih Ukuran
                                <span
                                    style={{
                                        fontWeight: 400,
                                        color: "#888",
                                        fontSize: "0.78rem",
                                        marginLeft: "0.5rem",
                                    }}
                                >
                                    (EU)
                                </span>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    gap: "0.5rem",
                                    flexWrap: "wrap",
                                }}
                            >
                                {produk.ukuran.map((uk) => (
                                    <button
                                        key={uk}
                                        onClick={() => setUkuran(String(uk))}
                                        style={{
                                            width: 48,
                                            height: 48,
                                            borderRadius: 10,
                                            border: `2px solid ${String(uk) === ukuran ? "#111" : "#e5e7eb"}`,
                                            background:
                                                String(uk) === ukuran
                                                    ? "#111"
                                                    : "#fff",
                                            color:
                                                String(uk) === ukuran
                                                    ? "#fff"
                                                    : "#374151",
                                            fontWeight: 700,
                                            fontSize: "0.85rem",
                                            cursor: "pointer",
                                            transition: "all .15s",
                                        }}
                                    >
                                        {uk}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Qty */}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.75rem",
                                marginBottom: "1.5rem",
                            }}
                        >
                            <span
                                style={{ fontWeight: 700, fontSize: "0.9rem" }}
                            >
                                Jumlah:
                            </span>
                            <button
                                onClick={() =>
                                    setQty((q) => Math.max(1, q - 1))
                                }
                                style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: 8,
                                    border: "1.5px solid #e5e7eb",
                                    background: "#fafafa",
                                    cursor: "pointer",
                                    fontWeight: 800,
                                    fontSize: "1.1rem",
                                }}
                            >
                                −
                            </button>
                            <span
                                style={{
                                    width: 32,
                                    textAlign: "center",
                                    fontWeight: 800,
                                    fontSize: "1.1rem",
                                }}
                            >
                                {qty}
                            </span>
                            <button
                                onClick={() =>
                                    setQty((q) => Math.min(produk.stok, q + 1))
                                }
                                style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: 8,
                                    border: "1.5px solid #e5e7eb",
                                    background: "#fafafa",
                                    cursor: "pointer",
                                    fontWeight: 800,
                                    fontSize: "1.1rem",
                                }}
                            >
                                +
                            </button>
                        </div>

                        {/* Tombol */}
                        <div style={{ display: "flex", gap: "0.75rem" }}>
                            <button
                                onClick={handleAddToCart}
                                style={{
                                    flex: 1,
                                    padding: "0.85rem",
                                    background: added ? "#16a34a" : "#111",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: 12,
                                    fontWeight: 700,
                                    fontSize: "0.95rem",
                                    cursor: "pointer",
                                    transition: "background .2s",
                                }}
                            >
                                {added
                                    ? "✅ Ditambahkan!"
                                    : "🛒 Tambah ke Keranjang"}
                            </button>
                            <Link
                                href="/checkout"
                                style={{
                                    flex: 1,
                                    padding: "0.85rem",
                                    background: "#f59e0b",
                                    color: "#111",
                                    border: "none",
                                    borderRadius: 12,
                                    fontWeight: 700,
                                    fontSize: "0.95rem",
                                    textAlign: "center",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                Beli Sekarang
                            </Link>
                        </div>

                        {/* Info Layanan */}
                        <div
                            style={{
                                display: "flex",
                                gap: "1rem",
                                marginTop: "1.5rem",
                                flexWrap: "wrap",
                            }}
                        >
                            {[
                                ["🚚", "Gratis Ongkir"],
                                ["✅", "Original 100%"],
                                ["🔄", "Return 7 Hari"],
                            ].map(([icon, label]) => (
                                <div
                                    key={label}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.4rem",
                                        fontSize: "0.8rem",
                                        color: "#555",
                                    }}
                                >
                                    <span>{icon}</span> <span>{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Tabel Ukuran */}
                <div
                    style={{
                        marginTop: "3rem",
                        background: "#fff",
                        border: "1px solid #f0f0f0",
                        borderRadius: 14,
                        padding: "1.5rem",
                    }}
                >
                    <h2 style={{ fontWeight: 800, marginBottom: "1rem" }}>
                        Panduan Ukuran
                    </h2>
                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            fontSize: "0.875rem",
                        }}
                    >
                        <thead>
                            <tr style={{ background: "#f9fafb" }}>
                                {["EU", "US", "CM"].map((h) => (
                                    <th
                                        key={h}
                                        style={{
                                            padding: "0.6rem 1rem",
                                            textAlign: "center",
                                            fontWeight: 700,
                                            borderBottom: "1px solid #f0f0f0",
                                        }}
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {ukuranGuide.map((u, i) => (
                                <tr
                                    key={i}
                                    style={{
                                        background:
                                            String(u.eu) === ukuran
                                                ? "#fff9e6"
                                                : "transparent",
                                    }}
                                >
                                    <td
                                        style={{
                                            padding: "0.55rem 1rem",
                                            textAlign: "center",
                                            borderBottom: "1px solid #f9fafb",
                                            fontWeight:
                                                String(u.eu) === ukuran
                                                    ? 700
                                                    : 400,
                                        }}
                                    >
                                        {u.eu}
                                    </td>
                                    <td
                                        style={{
                                            padding: "0.55rem 1rem",
                                            textAlign: "center",
                                            borderBottom: "1px solid #f9fafb",
                                        }}
                                    >
                                        {u.us}
                                    </td>
                                    <td
                                        style={{
                                            padding: "0.55rem 1rem",
                                            textAlign: "center",
                                            borderBottom: "1px solid #f9fafb",
                                        }}
                                    >
                                        {u.cm} cm
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
}
