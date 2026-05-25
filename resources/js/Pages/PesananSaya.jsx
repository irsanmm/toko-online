import { Head, Link, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import Layout from "./Layout";
import TrackingResi from "./TrackingResi";
import Swal from "sweetalert2";

export default function PesananSaya({
    pesanan: initialPesanan,
    notifikasi: initialNotifikasi,
}) {
    const [activeTab, setActiveTab] = useState("Semua");
    const [detail, setDetail] = useState(null);
    const [trackingPesanan, setTracking] = useState(null);

    // ── Notifikasi: pakai localStorage ──────────────────────────────
    const NOTIF_KEY = "amengstore_notifikasi";

    const [notifikasi, setNotifikasi] = useState([]);

    // ── Pesanan: pakai localStorage ──────────────────────────────────
    const PESANAN_KEY = "amengstore_pesanan_deleted";

    const [pesanan, setPesanan] = useState([]);
    const [showDeletePesanan, setShowDeletePesanan] = useState(null);

    // Sinkronisasi data saat pertama kali load dan saat props berubah
    useEffect(() => {
        if (typeof window !== "undefined") {
            // Load Pesanan
            const deleted = JSON.parse(
                localStorage.getItem(PESANAN_KEY) || "[]",
            );
            setPesanan(
                (initialPesanan || []).filter((p) => !deleted.includes(p.id)),
            );

            // Load Notif
            const cleared = localStorage.getItem(NOTIF_KEY + "_cleared");
            if (cleared === "true") {
                setNotifikasi([]);
            } else {
                const dismissed = JSON.parse(
                    localStorage.getItem(NOTIF_KEY + "_dismissed") || "[]",
                );
                setNotifikasi(
                    (initialNotifikasi || []).filter(
                        (_, i) => !dismissed.includes(i),
                    ),
                );
            }
        }
    }, [initialPesanan, initialNotifikasi]);

    const tabs = ["Semua", "Diproses", "Dikirim", "Selesai", "Batal"];
    const fmtHarga = (n) => "Rp " + Number(n).toLocaleString("id-ID");

    const statusStyle = {
        Pending: { bg: "#fef9c3", color: "#854d0e" },
        Diproses: { bg: "#dbeafe", color: "#1e40af" },
        Dikirim: { bg: "#e0f2fe", color: "#0369a1" },
        Selesai: { bg: "#dcfce7", color: "#166534" },
        Batal: { bg: "#fee2e2", color: "#991b1b" },
    };

    const filtered =
        activeTab === "Semua"
            ? pesanan
            : pesanan.filter((p) => p.status === activeTab);

    // ── Hapus satu notifikasi ────────────────────────────────────────
    const hapusNotif = (index) => {
        // index adalah index dari array initialNotifikasi
        const realIndex = (initialNotifikasi || []).findIndex(
            (n) => n === notifikasi[index],
        );
        const dismissed = JSON.parse(
            localStorage.getItem(NOTIF_KEY + "_dismissed") || "[]",
        );
        if (realIndex !== -1 && !dismissed.includes(realIndex)) {
            dismissed.push(realIndex);
            localStorage.setItem(
                NOTIF_KEY + "_dismissed",
                JSON.stringify(dismissed),
            );
        }
        setNotifikasi((prev) => prev.filter((_, i) => i !== index));
    };

    // ── Hapus semua notifikasi ───────────────────────────────────────
    const hapusSemuaNotif = () => {
        localStorage.setItem(NOTIF_KEY + "_cleared", "true");
        localStorage.removeItem(NOTIF_KEY + "_dismissed");
        setNotifikasi([]);
    };

    // ── Hapus satu pesanan ───────────────────────────────────────────
    const hapusPesanan = (id) => {
        const deleted = JSON.parse(localStorage.getItem(PESANAN_KEY) || "[]");
        if (!deleted.includes(id)) {
            deleted.push(id);
            localStorage.setItem(PESANAN_KEY, JSON.stringify(deleted));
        }
        setPesanan((prev) => prev.filter((p) => p.id !== id));
        setShowDeletePesanan(null);
    };

    // ── Selesaikan Pesanan (Kirim ke Laravel via Inertia) ──────────────────
    const handlePesananSelesai = (id) => {
        Swal.fire({
            title: "Konfirmasi Pesanan",
            text: "Apakah Anda yakin telah menerima pesanan ini? Status akan berubah menjadi Selesai.",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#22c55e",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ya, Diterima!",
            cancelButtonText: "Batal",
            borderRadius: 14,
        }).then((result) => {
            if (result.isConfirmed) {
                // 1. Update state di frontend secara instan (Optimistic Update)
                setPesanan((prev) =>
                    prev.map((p) =>
                        p.id === id ? { ...p, status: "Selesai" } : p,
                    ),
                );

                // 2. Kirim data ke backend Laravel
                router.post(
                    `/pesanan/selesai/${encodeURIComponent(id)}`,
                    {},
                    {
                        preserveScroll: true,
                    },
                );
            }
        });
    };

    const modalStyle = {
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999,
        padding: "1rem",
    };

    return (
        <Layout>
            <Head title="Pesanan Saya | AMENG STORE" />

            <div
                style={{
                    maxWidth: 800,
                    margin: "0 auto",
                    padding: "3rem 1.5rem",
                }}
            >
                <div style={{ marginBottom: "2rem" }}>
                    <h1 style={{ fontSize: "1.5rem", fontWeight: 800 }}>
                        📦 Pesanan Saya
                    </h1>
                    <p
                        style={{
                            color: "#888",
                            marginTop: ".3rem",
                            fontSize: ".875rem",
                        }}
                    >
                        Pantau status semua pesananmu di sini
                    </p>
                </div>

                {/* ===== NOTIFIKASI ===== */}
                {notifikasi.length > 0 && (
                    <div style={{ marginBottom: "1.5rem" }}>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: ".6rem",
                            }}
                        >
                            <span
                                style={{
                                    fontSize: ".8rem",
                                    fontWeight: 700,
                                    color: "#555",
                                }}
                            >
                                🔔 Notifikasi ({notifikasi.length})
                            </span>
                            <button
                                onClick={hapusSemuaNotif}
                                style={{
                                    background: "none",
                                    border: "none",
                                    fontSize: ".75rem",
                                    color: "#888",
                                    cursor: "pointer",
                                    fontWeight: 600,
                                    padding: "2px 6px",
                                    borderRadius: 6,
                                }}
                            >
                                Hapus semua
                            </button>
                        </div>

                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: ".5rem",
                            }}
                        >
                            {notifikasi.map((n, i) => (
                                <div
                                    key={i}
                                    style={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        gap: ".75rem",
                                        padding: ".85rem 1rem",
                                        background:
                                            n.type === "dikirim"
                                                ? "#eff6ff"
                                                : "#f0fdf4",
                                        border: `1px solid ${n.type === "dikirim" ? "#bfdbfe" : "#bbf7d0"}`,
                                        borderRadius: 12,
                                    }}
                                >
                                    <span
                                        style={{
                                            fontSize: "1.3rem",
                                            flexShrink: 0,
                                            marginTop: "1px",
                                        }}
                                    >
                                        {n.type === "dikirim" ? "🚚" : "✅"}
                                    </span>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div
                                            style={{
                                                fontWeight: 700,
                                                fontSize: ".875rem",
                                                color: "#111",
                                            }}
                                        >
                                            {n.judul}
                                        </div>
                                        <div
                                            style={{
                                                fontSize: ".78rem",
                                                color: "#555",
                                                marginTop: "2px",
                                            }}
                                        >
                                            {n.pesan}
                                        </div>
                                        {n.nomor_resi && (
                                            <div
                                                style={{
                                                    display: "inline-block",
                                                    marginTop: ".4rem",
                                                    background: "#fff",
                                                    border: `1px solid ${n.type === "dikirim" ? "#bfdbfe" : "#bbf7d0"}`,
                                                    borderRadius: 6,
                                                    padding: "2px 8px",
                                                    fontSize: ".72rem",
                                                    fontWeight: 700,
                                                    color:
                                                        n.type === "dikirim"
                                                            ? "#1d4ed8"
                                                            : "#166534",
                                                }}
                                            >
                                                {n.kurir?.toUpperCase()} ·{" "}
                                                {n.nomor_resi}
                                            </div>
                                        )}
                                        <div
                                            style={{
                                                fontSize: ".68rem",
                                                color: "#aaa",
                                                marginTop: ".3rem",
                                            }}
                                        >
                                            {n.waktu}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => hapusNotif(i)}
                                        style={{
                                            background: "none",
                                            border: "none",
                                            cursor: "pointer",
                                            color: "#aaa",
                                            fontSize: "1rem",
                                            padding: "2px 4px",
                                            flexShrink: 0,
                                            lineHeight: 1,
                                        }}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ===== TAB FILTER ===== */}
                <div
                    style={{
                        display: "flex",
                        borderBottom: "2px solid #f0f0f0",
                        marginBottom: "1.5rem",
                        flexWrap: "wrap",
                    }}
                >
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                padding: ".6rem 1.1rem",
                                background: "none",
                                border: "none",
                                borderBottom: `2.5px solid ${activeTab === tab ? "#f59e0b" : "transparent"}`,
                                fontWeight: activeTab === tab ? 700 : 500,
                                color: activeTab === tab ? "#111" : "#888",
                                cursor: "pointer",
                                fontSize: ".85rem",
                                marginBottom: "-2px",
                                transition: "all .2s",
                            }}
                        >
                            {tab}
                            <span
                                style={{
                                    marginLeft: ".35rem",
                                    fontSize: ".65rem",
                                    fontWeight: 700,
                                    background:
                                        activeTab === tab
                                            ? "#f59e0b"
                                            : "#f0f0f0",
                                    color: activeTab === tab ? "#fff" : "#888",
                                    padding: "1px 6px",
                                    borderRadius: 999,
                                }}
                            >
                                {tab === "Semua"
                                    ? pesanan.length
                                    : pesanan.filter((p) => p.status === tab)
                                          .length}
                            </span>
                        </button>
                    ))}
                </div>

                {/* ===== LIST PESANAN ===== */}
                {filtered.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "4rem 0" }}>
                        <p style={{ fontSize: "3rem" }}>📦</p>
                        <p style={{ fontWeight: 600, marginTop: "1rem" }}>
                            Belum ada pesanan{" "}
                            {activeTab !== "Semua"
                                ? activeTab.toLowerCase()
                                : ""}
                        </p>
                        <Link
                            href="/katalog"
                            style={{
                                display: "inline-block",
                                marginTop: "1.25rem",
                                background: "#111",
                                color: "#fff",
                                padding: ".65rem 1.5rem",
                                borderRadius: 999,
                                fontWeight: 700,
                                fontSize: ".875rem",
                            }}
                        >
                            Mulai Belanja
                        </Link>
                    </div>
                ) : (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "1rem",
                        }}
                    >
                        {filtered.map((p, i) => (
                            <div
                                key={i}
                                style={{
                                    background: "#fff",
                                    borderRadius: 14,
                                    border: "1px solid #f0f0f0",
                                    overflow: "hidden",
                                }}
                            >
                                {/* Header card */}
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        padding: ".75rem 1.25rem",
                                        background: "#f9fafb",
                                        borderBottom: "1px solid #f0f0f0",
                                        flexWrap: "wrap",
                                        gap: ".5rem",
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "1rem",
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontWeight: 700,
                                                fontSize: ".85rem",
                                                color: "#3b82f6",
                                            }}
                                        >
                                            {p.id}
                                        </span>
                                        <span
                                            style={{
                                                fontSize: ".78rem",
                                                color: "#888",
                                            }}
                                        >
                                            {p.tanggal}
                                        </span>
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: ".5rem",
                                        }}
                                    >
                                        <span
                                            style={{
                                                padding: "3px 12px",
                                                borderRadius: 999,
                                                fontSize: ".72rem",
                                                fontWeight: 700,
                                                background:
                                                    statusStyle[p.status]?.bg ||
                                                    "#f0f0f0",
                                                color:
                                                    statusStyle[p.status]
                                                        ?.color || "#555",
                                            }}
                                        >
                                            {p.status}
                                        </span>
                                        {/* Tombol hapus pesanan */}
                                        <button
                                            onClick={() =>
                                                setShowDeletePesanan(p)
                                            }
                                            title="Hapus pesanan"
                                            style={{
                                                background: "none",
                                                border: "1.5px solid #fca5a5",
                                                borderRadius: 7,
                                                color: "#ef4444",
                                                fontSize: ".75rem",
                                                fontWeight: 700,
                                                padding: "2px 8px",
                                                cursor: "pointer",
                                                lineHeight: 1.5,
                                            }}
                                        >
                                            🗑 Hapus
                                        </button>
                                    </div>
                                </div>

                                {/* Body card */}
                                <div
                                    style={{
                                        padding: "1rem 1.25rem",
                                        display: "flex",
                                        gap: "1rem",
                                        alignItems: "center",
                                        flexWrap: "wrap",
                                    }}
                                >
                                    <div
                                        style={{
                                            width: 64,
                                            height: 64,
                                            borderRadius: 10,
                                            background: "#f9fafb",
                                            border: "1px solid #f0f0f0",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: "1.75rem",
                                            flexShrink: 0,
                                            overflow: "hidden",
                                        }}
                                    >
                                        {p.gambar ? (
                                            <img
                                                src={p.gambar}
                                                alt={p.produk}
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    objectFit: "cover",
                                                }}
                                                onError={(e) => {
                                                    e.target.style.display =
                                                        "none";
                                                }}
                                            />
                                        ) : (
                                            "👟"
                                        )}
                                    </div>

                                    <div style={{ flex: 1 }}>
                                        <div
                                            style={{
                                                fontWeight: 700,
                                                fontSize: ".95rem",
                                            }}
                                        >
                                            {p.produk}
                                        </div>
                                        <div
                                            style={{
                                                fontSize: ".78rem",
                                                color: "#888",
                                                marginTop: ".2rem",
                                            }}
                                        >
                                            Ukuran: {p.ukuran} · Qty: {p.qty}{" "}
                                            pcs
                                        </div>
                                        <div
                                            style={{
                                                fontWeight: 800,
                                                fontSize: "1rem",
                                                color: "#111",
                                                marginTop: ".3rem",
                                            }}
                                        >
                                            {fmtHarga(p.total)}
                                        </div>
                                    </div>

                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: ".4rem",
                                            alignItems: "flex-end",
                                        }}
                                    >
                                        <button
                                            onClick={() => setDetail(p)}
                                            style={{
                                                padding: ".45rem 1rem",
                                                borderRadius: 8,
                                                border: "1.5px solid #e5e7eb",
                                                background: "#fff",
                                                fontSize: ".78rem",
                                                fontWeight: 700,
                                                cursor: "pointer",
                                            }}
                                        >
                                            Lihat Detail
                                        </button>
                                        {p.status === "Selesai" && (
                                            <button
                                                style={{
                                                    padding: ".45rem 1rem",
                                                    borderRadius: 8,
                                                    border: "none",
                                                    background: "#f59e0b",
                                                    color: "#111",
                                                    fontSize: ".78rem",
                                                    fontWeight: 700,
                                                    cursor: "pointer",
                                                }}
                                            >
                                                ⭐ Beri Ulasan
                                            </button>
                                        )}
                                        {p.status === "Dikirim" && (
                                            <button
                                                onClick={() =>
                                                    handlePesananSelesai(p.id)
                                                }
                                                style={{
                                                    padding: ".45rem 1rem",
                                                    borderRadius: 8,
                                                    border: "none",
                                                    background: "#22c55e",
                                                    color: "#fff",
                                                    fontSize: ".78rem",
                                                    fontWeight: 700,
                                                    cursor: "pointer",
                                                }}
                                            >
                                                ✅ Pesanan Diterima
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Banner resi */}
                                {p.status === "Dikirim" && p.has_resi && (
                                    <div
                                        style={{
                                            padding: ".75rem 1.25rem",
                                            background: "#eff6ff",
                                            borderTop: "1px solid #dbeafe",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            flexWrap: "wrap",
                                            gap: ".5rem",
                                        }}
                                    >
                                        <div
                                            style={{
                                                fontSize: ".8rem",
                                                color: "#1d4ed8",
                                                fontWeight: 600,
                                            }}
                                        >
                                            🚚 {p.kurir?.toUpperCase()} · Resi:{" "}
                                            <strong>{p.nomor_resi}</strong>
                                        </div>
                                        <button
                                            onClick={() => setTracking(p)}
                                            style={{
                                                padding: "4px 14px",
                                                borderRadius: 7,
                                                background: "#3b82f6",
                                                color: "#fff",
                                                border: "none",
                                                fontSize: ".75rem",
                                                fontWeight: 700,
                                                cursor: "pointer",
                                            }}
                                        >
                                            🔍 Lacak Paket
                                        </button>
                                    </div>
                                )}

                                {/* Banner pending */}
                                {p.status === "Pending" && (
                                    <div
                                        style={{
                                            padding: ".65rem 1.25rem",
                                            background: "#fefce8",
                                            borderTop: "1px solid #fef08a",
                                            fontSize: ".78rem",
                                            color: "#854d0e",
                                        }}
                                    >
                                        ⏳ Menunggu konfirmasi admin. Kami akan
                                        segera memproses pesananmu.
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ══ Modal Detail Pesanan ══ */}
            {detail && (
                <div style={modalStyle} onClick={() => setDetail(null)}>
                    <div
                        style={{
                            background: "#fff",
                            borderRadius: 14,
                            padding: "1.75rem",
                            width: "100%",
                            maxWidth: 460,
                            boxShadow: "0 20px 60px rgba(0,0,0,.15)",
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "1.25rem",
                            }}
                        >
                            <h2 style={{ fontWeight: 800, fontSize: "1rem" }}>
                                Detail Pesanan {detail.id}
                            </h2>
                            <button
                                onClick={() => setDetail(null)}
                                style={{
                                    background: "none",
                                    border: "none",
                                    fontSize: "1.2rem",
                                    cursor: "pointer",
                                    color: "#888",
                                }}
                            >
                                ✕
                            </button>
                        </div>
                        <div
                            style={{
                                display: "grid",
                                gap: ".5rem",
                                marginBottom: "1.25rem",
                            }}
                        >
                            {[
                                ["Produk", detail.produk],
                                ["Ukuran", detail.ukuran],
                                ["Jumlah", detail.qty + " pcs"],
                                ["Total", fmtHarga(detail.total)],
                                ["Metode", detail.metode],
                                ["Tanggal", detail.tanggal],
                                ["Alamat", detail.alamat],
                                ["Status", detail.status],
                                ...(detail.has_resi
                                    ? [
                                          [
                                              "Kurir",
                                              detail.kurir?.toUpperCase(),
                                          ],
                                          ["Resi", detail.nomor_resi],
                                      ]
                                    : []),
                            ].map(([k, v]) => (
                                <div
                                    key={k}
                                    style={{
                                        display: "flex",
                                        gap: ".75rem",
                                        padding: ".5rem .75rem",
                                        background: "#f9fafb",
                                        borderRadius: 7,
                                    }}
                                >
                                    <span
                                        style={{
                                            fontSize: ".75rem",
                                            color: "#888",
                                            fontWeight: 500,
                                            minWidth: 65,
                                            flexShrink: 0,
                                        }}
                                    >
                                        {k}
                                    </span>
                                    <span
                                        style={{
                                            fontSize: ".82rem",
                                            fontWeight: 600,
                                        }}
                                    >
                                        {v}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => setDetail(null)}
                            style={{
                                width: "100%",
                                padding: ".75rem",
                                background: "#111",
                                color: "#fff",
                                border: "none",
                                borderRadius: 10,
                                fontWeight: 700,
                                cursor: "pointer",
                            }}
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            )}

            {/* ══ Modal Konfirmasi Hapus Pesanan ══ */}
            {showDeletePesanan && (
                <div
                    style={modalStyle}
                    onClick={() => setShowDeletePesanan(null)}
                >
                    <div
                        style={{
                            background: "#fff",
                            borderRadius: 14,
                            padding: "1.75rem",
                            width: "100%",
                            maxWidth: 380,
                            boxShadow: "0 20px 60px rgba(0,0,0,.15)",
                            textAlign: "center",
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div
                            style={{
                                fontSize: "2.5rem",
                                marginBottom: ".75rem",
                            }}
                        >
                            🗑️
                        </div>
                        <h2 style={{ fontWeight: 800, marginBottom: ".5rem" }}>
                            Hapus Pesanan?
                        </h2>
                        <p
                            style={{
                                fontSize: ".85rem",
                                color: "#888",
                                marginBottom: "1.5rem",
                            }}
                        >
                            Pesanan <strong>{showDeletePesanan.id}</strong> akan
                            dihapus dari daftarmu.
                        </p>
                        <div
                            style={{
                                display: "flex",
                                gap: ".6rem",
                                justifyContent: "center",
                            }}
                        >
                            <button
                                onClick={() => setShowDeletePesanan(null)}
                                style={{
                                    padding: ".55rem 1.25rem",
                                    borderRadius: 8,
                                    border: "1.5px solid #e5e7eb",
                                    background: "#fff",
                                    fontWeight: 700,
                                    fontSize: ".85rem",
                                    cursor: "pointer",
                                }}
                            >
                                Batal
                            </button>
                            <button
                                onClick={() =>
                                    hapusPesanan(showDeletePesanan.id)
                                }
                                style={{
                                    padding: ".55rem 1.25rem",
                                    borderRadius: 8,
                                    border: "none",
                                    background: "#ef4444",
                                    color: "#fff",
                                    fontWeight: 700,
                                    fontSize: ".85rem",
                                    cursor: "pointer",
                                }}
                            >
                                Ya, Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ══ Modal Tracking ══ */}
            {trackingPesanan && (
                <TrackingResi
                    nomorPesanan={trackingPesanan.id}
                    kurir={trackingPesanan.kurir}
                    nomorResi={trackingPesanan.nomor_resi}
                    onClose={() => setTracking(null)}
                />
            )}
        </Layout>
    );
}
