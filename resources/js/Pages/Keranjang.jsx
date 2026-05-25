import { Head, Link, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import Layout from "./Layout";

export default function Keranjang() {
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("amengCart") || "[]");
        setCart(data);
    }, []);

    const updateQty = (index, delta) => {
        const newCart = [...cart];
        newCart[index].qty = Math.max(1, newCart[index].qty + delta);
        setCart(newCart);
        localStorage.setItem("amengCart", JSON.stringify(newCart));
        window.dispatchEvent(new Event("cartUpdated"));
    };

    const hapusItem = (index) => {
        const newCart = cart.filter((_, i) => i !== index);
        setCart(newCart);
        localStorage.setItem("amengCart", JSON.stringify(newCart));
        window.dispatchEvent(new Event("cartUpdated"));
    };

    const total = cart.reduce((sum, item) => sum + item.harga * item.qty, 0);
    const formatHarga = (n) => "Rp " + n.toLocaleString("id-ID");

    return (
        <Layout>
            <Head title="Keranjang | AMENG STORE" />

            <div
                style={{
                    maxWidth: 900,
                    margin: "0 auto",
                    padding: "3rem 1.5rem",
                }}
            >
                <h1
                    style={{
                        fontSize: "1.75rem",
                        fontWeight: 800,
                        marginBottom: "0.5rem",
                    }}
                >
                    🛒 Keranjang Belanja
                </h1>
                <p style={{ color: "#888", marginBottom: "2rem" }}>
                    {cart.length} produk di keranjang kamu
                </p>

                {cart.length === 0 ? (
                    /* Keranjang kosong */
                    <div style={{ textAlign: "center", padding: "5rem 0" }}>
                        <p style={{ fontSize: "4rem" }}>🛒</p>
                        <p
                            style={{
                                fontSize: "1.1rem",
                                fontWeight: 600,
                                marginTop: "1rem",
                            }}
                        >
                            Keranjang kamu masih kosong
                        </p>
                        <p
                            style={{
                                color: "#888",
                                marginTop: "0.4rem",
                                marginBottom: "2rem",
                            }}
                        >
                            Yuk, belanja dulu!
                        </p>
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
                            Lihat Produk
                        </Link>
                    </div>
                ) : (
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 320px",
                            gap: "1.5rem",
                            alignItems: "start",
                        }}
                    >
                        {/* Daftar Item */}
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "1rem",
                            }}
                        >
                            {cart.map((item, i) => (
                                <div
                                    key={i}
                                    style={{
                                        background: "#fff",
                                        borderRadius: 14,
                                        border: "1px solid #f0f0f0",
                                        padding: "1rem",
                                        display: "flex",
                                        gap: "1rem",
                                        alignItems: "center",
                                    }}
                                >
                                    {/* Gambar */}
                                    <img
                                        src={item.gambar}
                                        alt={item.nama}
                                        style={{
                                            width: 80,
                                            height: 80,
                                            objectFit: "contain",
                                            borderRadius: 8,
                                            background: "#f9fafb",
                                            flexShrink: 0,
                                        }}
                                        onError={(e) =>
                                            (e.target.src =
                                                "https://placehold.co/80x80?text=No+Img")
                                        }
                                    />

                                    {/* Info */}
                                    <div style={{ flex: 1 }}>
                                        <div
                                            style={{
                                                fontSize: "0.72rem",
                                                fontWeight: 700,
                                                color: "#f59e0b",
                                                letterSpacing: "0.08em",
                                            }}
                                        >
                                            {item.brand}
                                        </div>
                                        <div
                                            style={{
                                                fontWeight: 700,
                                                fontSize: "0.95rem",
                                                marginBottom: "0.2rem",
                                            }}
                                        >
                                            {item.nama}
                                        </div>
                                        <div
                                            style={{
                                                fontSize: "0.8rem",
                                                color: "#888",
                                            }}
                                        >
                                            Ukuran: EU {item.ukuran}
                                        </div>
                                        <div
                                            style={{
                                                fontWeight: 800,
                                                color: "#111",
                                                marginTop: "0.3rem",
                                            }}
                                        >
                                            {formatHarga(item.harga)}
                                        </div>
                                    </div>

                                    {/* Qty + Hapus */}
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "flex-end",
                                            gap: "0.5rem",
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 6,
                                            }}
                                        >
                                            <button
                                                onClick={() => updateQty(i, -1)}
                                                style={{
                                                    width: 28,
                                                    height: 28,
                                                    borderRadius: 6,
                                                    border: "1.5px solid #e5e7eb",
                                                    background: "#fafafa",
                                                    cursor: "pointer",
                                                    fontWeight: 700,
                                                    fontSize: "1rem",
                                                }}
                                            >
                                                −
                                            </button>
                                            <span
                                                style={{
                                                    width: 24,
                                                    textAlign: "center",
                                                    fontWeight: 700,
                                                }}
                                            >
                                                {item.qty}
                                            </span>
                                            <button
                                                onClick={() => updateQty(i, 1)}
                                                style={{
                                                    width: 28,
                                                    height: 28,
                                                    borderRadius: 6,
                                                    border: "1.5px solid #e5e7eb",
                                                    background: "#fafafa",
                                                    cursor: "pointer",
                                                    fontWeight: 700,
                                                    fontSize: "1rem",
                                                }}
                                            >
                                                +
                                            </button>
                                        </div>
                                        <div
                                            style={{
                                                fontWeight: 800,
                                                fontSize: "0.9rem",
                                            }}
                                        >
                                            {formatHarga(item.harga * item.qty)}
                                        </div>
                                        <button
                                            onClick={() => hapusItem(i)}
                                            style={{
                                                background: "none",
                                                border: "none",
                                                color: "#dc2626",
                                                cursor: "pointer",
                                                fontSize: "0.78rem",
                                                fontWeight: 600,
                                            }}
                                        >
                                            🗑 Hapus
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Ringkasan Order */}
                        <div
                            style={{
                                background: "#fff",
                                borderRadius: 14,
                                border: "1px solid #f0f0f0",
                                padding: "1.5rem",
                                position: "sticky",
                                top: 80,
                            }}
                        >
                            <h2
                                style={{
                                    fontWeight: 800,
                                    marginBottom: "1.25rem",
                                }}
                            >
                                Ringkasan
                            </h2>

                            {cart.map((item, i) => (
                                <div
                                    key={i}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        fontSize: "0.82rem",
                                        marginBottom: "0.5rem",
                                        color: "#555",
                                    }}
                                >
                                    <span>
                                        {item.nama} x{item.qty}
                                    </span>
                                    <span>
                                        {formatHarga(item.harga * item.qty)}
                                    </span>
                                </div>
                            ))}

                            <div
                                style={{
                                    borderTop: "1px solid #f0f0f0",
                                    margin: "1rem 0",
                                    paddingTop: "1rem",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        fontSize: "0.85rem",
                                        marginBottom: "0.5rem",
                                    }}
                                >
                                    <span>Ongkir</span>
                                    <span
                                        style={{
                                            color: "#16a34a",
                                            fontWeight: 600,
                                        }}
                                    >
                                        Gratis
                                    </span>
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        fontWeight: 800,
                                        fontSize: "1.05rem",
                                        marginTop: "0.75rem",
                                    }}
                                >
                                    <span>Total</span>
                                    <span>{formatHarga(total)}</span>
                                </div>
                            </div>

                            <Link
                                href="/checkout"
                                style={{
                                    display: "block",
                                    width: "100%",
                                    background: "#111",
                                    color: "#fff",
                                    padding: "0.85rem",
                                    borderRadius: 10,
                                    fontWeight: 700,
                                    fontSize: "0.95rem",
                                    textAlign: "center",
                                    marginTop: "1rem",
                                    transition: "background .2s",
                                }}
                                onMouseOver={(e) =>
                                    (e.target.style.background = "#f59e0b")
                                }
                                onMouseOut={(e) =>
                                    (e.target.style.background = "#111")
                                }
                            >
                                Lanjut ke Checkout →
                            </Link>
                            <Link
                                href="/katalog"
                                style={{
                                    display: "block",
                                    textAlign: "center",
                                    marginTop: "0.75rem",
                                    fontSize: "0.82rem",
                                    color: "#888",
                                }}
                            >
                                ← Lanjut Belanja
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}
