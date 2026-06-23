import { useState } from "react";
import { Link, router } from "@inertiajs/react";

const imgSrc = (g) => {
    if (!g) return "https://placehold.co/300x220?text=No+Image";
    return g.startsWith("/") ? g : `/storage/${g}`;
};

export default function ProductCard({ produk }) {
    const [ukuran, setUkuran] = useState("");
    const [qty, setQty] = useState(1);
    const [added, setAdded] = useState(false);

    const formatHarga = (harga) => "Rp " + harga.toLocaleString("id-ID");

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
            cart.push({
                ...produk,
                gambar: imgSrc(produk.gambar),
                ukuran,
                qty,
            });
        }
        localStorage.setItem("amengCart", JSON.stringify(cart));
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
        window.dispatchEvent(new Event("cartUpdated"));
    };

    const handleBeliSekarang = () => {
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
            cart.push({
                ...produk,
                gambar: imgSrc(produk.gambar),
                ukuran,
                qty,
            });
        }
        localStorage.setItem("amengCart", JSON.stringify(cart));
        window.dispatchEvent(new Event("cartUpdated"));
        router.visit("/keranjang");
    };

    return (
        <div
            style={{
                background: "#fff",
                borderRadius: 16,
                border: "1px solid #f0f0f0",
                overflow: "hidden",
                transition: "transform .2s, box-shadow .2s",
                display: "flex",
                flexDirection: "column",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,.08)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "none";
            }}
        >
            {/* Gambar — sekarang full bleed, tidak ada padding kosong */}
            <div style={{ position: "relative" }}>
                {/* Badge stok mengambang di atas gambar */}
                <span
                    style={{
                        position: "absolute",
                        top: 10,
                        left: 10,
                        zIndex: 2,
                        fontSize: 11,
                        fontWeight: 700,
                        padding: "3px 10px",
                        borderRadius: 999,
                        background: produk.stok > 0 ? "#dcfce7" : "#fee2e2",
                        color: produk.stok > 0 ? "#16a34a" : "#dc2626",
                    }}
                >
                    {produk.stok > 0 ? `Stok: ${produk.stok}` : "Habis"}
                </span>

                <Link href={`/produk/${produk.id}`}>
                    <div style={{ overflow: "hidden", cursor: "pointer" }}>
                        <img
                            src={imgSrc(produk.gambar)}
                            alt={produk.nama}
                            style={{
                                width: "100%",
                                height: 220,
                                objectFit: "cover",
                                display: "block",
                                transition: "transform .3s",
                            }}
                            onMouseEnter={(e) =>
                                (e.target.style.transform = "scale(1.05)")
                            }
                            onMouseLeave={(e) =>
                                (e.target.style.transform = "scale(1)")
                            }
                            onError={(e) => {
                                e.target.src =
                                    "https://placehold.co/300x220?text=No+Image";
                            }}
                        />
                    </div>
                </Link>
            </div>

            {/* Info */}
            <div
                style={{
                    padding: "1rem",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <div
                    style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#f59e0b",
                        letterSpacing: "0.08em",
                        marginBottom: 2,
                    }}
                >
                    {produk.brand}
                </div>

                <Link href={`/produk/${produk.id}`} style={{ color: "#111" }}>
                    <div
                        style={{
                            fontWeight: 700,
                            fontSize: "0.95rem",
                            marginBottom: 4,
                            lineHeight: 1.4,
                        }}
                    >
                        {produk.nama}
                    </div>
                </Link>

                <div
                    style={{
                        fontSize: "1.1rem",
                        fontWeight: 800,
                        color: "#111",
                        marginBottom: 10,
                    }}
                >
                    {formatHarga(produk.harga)}
                </div>

                <select
                    value={ukuran}
                    onChange={(e) => setUkuran(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "0.5rem 0.75rem",
                        border: "1.5px solid #e5e7eb",
                        borderRadius: 8,
                        fontSize: "0.85rem",
                        marginBottom: 8,
                        background: "#fafafa",
                        cursor: "pointer",
                    }}
                >
                    <option value="">Pilih Ukuran</option>
                    {(Array.isArray(produk.ukuran) ? produk.ukuran : []).map(
                        (uk) => (
                            <option key={uk} value={uk}>
                                EU {uk}
                            </option>
                        ),
                    )}
                </select>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 10,
                    }}
                >
                    <button
                        onClick={() => setQty((q) => Math.max(1, q - 1))}
                        style={{
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            border: "1.5px solid #e5e7eb",
                            background: "#fafafa",
                            fontSize: "1rem",
                            cursor: "pointer",
                            fontWeight: 700,
                        }}
                    >
                        −
                    </button>
                    <span
                        style={{
                            flex: 1,
                            textAlign: "center",
                            fontWeight: 700,
                        }}
                    >
                        {qty}
                    </span>
                    <button
                        onClick={() => setQty((q) => Math.min(99, q + 1))}
                        style={{
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            border: "1.5px solid #e5e7eb",
                            background: "#fafafa",
                            fontSize: "1rem",
                            cursor: "pointer",
                            fontWeight: 700,
                        }}
                    >
                        +
                    </button>
                </div>

                <button
                    onClick={handleAddToCart}
                    style={{
                        width: "100%",
                        padding: "0.6rem",
                        background: added ? "#16a34a" : "#111",
                        color: "#fff",
                        border: "none",
                        borderRadius: 10,
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        transition: "background .2s",
                        marginBottom: 6,
                    }}
                >
                    {added ? "✅ Ditambahkan!" : "🛒 Tambah ke Keranjang"}
                </button>

                <button
                    onClick={handleBeliSekarang}
                    style={{
                        width: "100%",
                        padding: "0.6rem",
                        background: "#f59e0b",
                        color: "#111",
                        border: "none",
                        borderRadius: 10,
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        transition: "background .2s",
                    }}
                >
                    ⚡ Beli Sekarang
                </button>
            </div>
        </div>
    );
}
