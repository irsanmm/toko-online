import { useState } from "react";
import { Link, router } from "@inertiajs/react";

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
            cart.push({ ...produk, ukuran, qty });
        }
        localStorage.setItem("amengCart", JSON.stringify(cart));
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
        window.dispatchEvent(new Event("cartUpdated"));
    };

    // Tambah ke keranjang lalu langsung pindah ke halaman keranjang
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
            cart.push({ ...produk, ukuran, qty });
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
            {/* Badge stok */}
            <div style={{ padding: "0.6rem 0.9rem 0" }}>
                <span
                    style={{
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
            </div>

            {/* Gambar — klik pindah ke halaman detail */}
            <Link href={`/produk/${produk.id}`}>
                <div
                    style={{
                        padding: "0.75rem",
                        background: "#fafafa",
                        margin: "0.6rem",
                        borderRadius: 12,
                        cursor: "pointer",
                    }}
                >
                    <img
                        src={produk.gambar}
                        alt={produk.nama}
                        style={{
                            width: "100%",
                            height: 180,
                            objectFit: "contain",
                            display: "block",
                        }}
                        onError={(e) => {
                            e.target.src =
                                "https://placehold.co/300x180?text=No+Image";
                        }}
                    />
                </div>
            </Link>

            {/* Info */}
            <div
                style={{
                    padding: "0 1rem 1rem",
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

                {/* Nama produk — klik juga pindah ke detail */}
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

                {/* Pilih Ukuran */}
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
                    {produk.ukuran.map((uk) => (
                        <option key={uk} value={uk}>
                            EU {uk}
                        </option>
                    ))}
                </select>

                {/* Qty Control */}
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

                {/* Tombol Tambah ke Keranjang */}
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

                {/* Tombol Beli Sekarang — langsung ke keranjang */}
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
