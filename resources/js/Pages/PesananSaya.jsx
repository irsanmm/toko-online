import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import Layout from "./Layout";
import TrackingResi from "./TrackingResi";

const imgSrc = (g) => {
    if (!g) return null;
    return g.startsWith("/") ? g : `/storage/${g}`;
};

export default function PesananSaya({
    pesanan,
    notifikasi: initialNotifikasi,
}) {
    const [activeTab, setActiveTab] = useState("Semua");
    const [detail, setDetail] = useState(null);
    const [trackingPesanan, setTracking] = useState(null);
    const [notifikasi, setNotifikasi] = useState(initialNotifikasi || []);
    const [konfirmModal, setKonfirmModal] = useState(null);
    const [ulasanModal, setUlasanModal] = useState(null);
    const [ratingValue, setRatingValue] = useState(0);
    const [komentarValue, setKomentarValue] = useState("");
    const [loadingId, setLoadingId] = useState(null);
    const [submittingUlasan, setSubmittingUlasan] = useState(false);

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

    const csrfToken = () =>
        document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute("content") || "";

    // ===== Hapus notifikasi (permanen, tersimpan di database) =====
    const hapusNotif = async (nomorPesanan, index) => {
        setNotifikasi((prev) => prev.filter((_, i) => i !== index)); // optimistic UI
        try {
            await fetch(`/pembeli/notifikasi/${nomorPesanan}/hapus`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrfToken(),
                    "X-Requested-With": "XMLHttpRequest",
                },
            });
        } catch (e) {
            /* gagal silent, sudah hilang dari UI */
        }
    };

    const hapusSemuaNotif = async () => {
        setNotifikasi([]);
        try {
            await fetch("/pembeli/notifikasi/hapus-semua", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrfToken(),
                    "X-Requested-With": "XMLHttpRequest",
                },
            });
        } catch (e) {
            /* gagal silent */
        }
    };

    // ===== Konfirmasi pesanan diterima =====
    const handlePesananDiterima = () => {
        if (!konfirmModal) return;
        setLoadingId(konfirmModal.id);
        router.post(
            "/pembeli/pesanan-diterima",
            { nomor_pesanan: konfirmModal.id },
            {
                onSuccess: () => {
                    setKonfirmModal(null);
                    setLoadingId(null);
                },
                onError: () => setLoadingId(null),
                preserveScroll: true,
            },
        );
    };

    // ===== Buka modal ulasan =====
    const openUlasan = (p) => {
        setUlasanModal(p);
        setRatingValue(0);
        setKomentarValue("");
    };

    // ===== Submit ulasan =====
    const handleSubmitUlasan = () => {
        if (ratingValue === 0) {
            alert("Pilih rating bintang dulu ya!");
            return;
        }
        setSubmittingUlasan(true);
        router.post(
            `/pembeli/pesanan/${ulasanModal.id}/ulasan`,
            {
                rating: ratingValue,
                komentar: komentarValue,
            },
            {
                onSuccess: () => {
                    setUlasanModal(null);
                    setSubmittingUlasan(false);
                },
                onError: () => setSubmittingUlasan(false),
                preserveScroll: true,
            },
        );
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

                {/* NOTIFIKASI */}
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
                                        }}
                                    >
                                        {n.type === "dikirim" ? "🚚" : "✅"}
                                    </span>
                                    <div style={{ flex: 1 }}>
                                        <div
                                            style={{
                                                fontWeight: 700,
                                                fontSize: ".875rem",
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
                                                    borderRadius: 6,
                                                    padding: "2px 8px",
                                                    fontSize: ".72rem",
                                                    fontWeight: 700,
                                                    color:
                                                        n.type === "dikirim"
                                                            ? "#1d4ed8"
                                                            : "#166534",
                                                    border: `1px solid ${n.type === "dikirim" ? "#bfdbfe" : "#bbf7d0"}`,
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
                                        onClick={() =>
                                            hapusNotif(n.nomor_pesanan, i)
                                        }
                                        style={{
                                            background: "none",
                                            border: "none",
                                            cursor: "pointer",
                                            color: "#aaa",
                                            fontSize: "1rem",
                                        }}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* TAB FILTER */}
                <div
                    style={{
                        display: "flex",
                        borderBottom: "2px solid #f0f0f0",
                        marginBottom: "1.5rem",
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

                {/* LIST PESANAN */}
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
                                    opacity: loadingId === p.id ? 0.7 : 1,
                                    transition: "opacity .2s",
                                }}
                            >
                                {/* Header */}
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
                                                statusStyle[p.status]?.color ||
                                                "#555",
                                        }}
                                    >
                                        {p.status}
                                    </span>
                                </div>

                                {/* Body */}
                                <div
                                    style={{
                                        padding: "1rem 1.25rem",
                                        display: "flex",
                                        gap: "1rem",
                                        alignItems: "center",
                                        flexWrap: "wrap",
                                    }}
                                >
                                    {/* Foto produk asli, fallback emoji kalau tidak ada */}
                                    {imgSrc(p.gambar) ? (
                                        <img
                                            src={imgSrc(p.gambar)}
                                            alt={p.produk}
                                            style={{
                                                width: 64,
                                                height: 64,
                                                borderRadius: 10,
                                                objectFit: "cover",
                                                background: "#f9fafb",
                                                border: "1px solid #f0f0f0",
                                                flexShrink: 0,
                                            }}
                                            onError={(e) => {
                                                e.target.style.display = "none";
                                            }}
                                        />
                                    ) : (
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
                                            }}
                                        >
                                            👟
                                        </div>
                                    )}

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

                                    {/* TOMBOL AKSI */}
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

                                        {p.status === "Dikirim" && (
                                            <button
                                                onClick={() =>
                                                    setKonfirmModal(p)
                                                }
                                                disabled={loadingId === p.id}
                                                style={{
                                                    padding: ".45rem 1rem",
                                                    borderRadius: 8,
                                                    border: "none",
                                                    background: "#22c55e",
                                                    color: "#fff",
                                                    fontSize: ".78rem",
                                                    fontWeight: 700,
                                                    cursor:
                                                        loadingId === p.id
                                                            ? "not-allowed"
                                                            : "pointer",
                                                    opacity:
                                                        loadingId === p.id
                                                            ? 0.7
                                                            : 1,
                                                }}
                                            >
                                                {loadingId === p.id
                                                    ? "⏳ Memproses..."
                                                    : "✅ Pesanan Diterima"}
                                            </button>
                                        )}

                                        {p.status === "Selesai" &&
                                            !p.has_ulasan && (
                                                <button
                                                    onClick={() =>
                                                        openUlasan(p)
                                                    }
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

                                        {p.status === "Selesai" &&
                                            p.has_ulasan && (
                                                <span
                                                    style={{
                                                        padding: ".45rem 1rem",
                                                        borderRadius: 8,
                                                        border: "1.5px solid #dcfce7",
                                                        background: "#f0fdf4",
                                                        color: "#166534",
                                                        fontSize: ".75rem",
                                                        fontWeight: 700,
                                                    }}
                                                >
                                                    ✓ Sudah Diulas
                                                </span>
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

            {/* MODAL DETAIL */}
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
                            onClick={() => setDetail(null)}
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            )}

            {/* MODAL KONFIRMASI PESANAN DITERIMA */}
            {konfirmModal && (
                <div style={modalStyle} onClick={() => setKonfirmModal(null)}>
                    <div
                        style={{
                            background: "#fff",
                            borderRadius: 14,
                            padding: "1.75rem",
                            width: "100%",
                            maxWidth: 400,
                            boxShadow: "0 20px 60px rgba(0,0,0,.15)",
                            textAlign: "center",
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>
                            📦
                        </div>
                        <h2
                            style={{
                                fontWeight: 800,
                                fontSize: "1.1rem",
                                marginBottom: ".5rem",
                            }}
                        >
                            Konfirmasi Pesanan Diterima
                        </h2>
                        <p
                            style={{
                                fontSize: ".875rem",
                                color: "#555",
                                marginBottom: ".5rem",
                            }}
                        >
                            Pesanan <strong>{konfirmModal.id}</strong>
                        </p>
                        <p
                            style={{
                                fontSize: ".82rem",
                                color: "#888",
                                marginBottom: "1.75rem",
                                lineHeight: 1.6,
                            }}
                        >
                            Apakah kamu sudah menerima paket ini dengan kondisi
                            baik? Status pesanan akan berubah menjadi{" "}
                            <strong>Selesai</strong>.
                        </p>
                        <div style={{ display: "flex", gap: ".6rem" }}>
                            <button
                                onClick={() => setKonfirmModal(null)}
                                style={{
                                    flex: 1,
                                    padding: ".75rem",
                                    background: "#f9fafb",
                                    color: "#111",
                                    border: "1.5px solid #e5e7eb",
                                    borderRadius: 10,
                                    fontWeight: 700,
                                    cursor: "pointer",
                                }}
                            >
                                Belum
                            </button>
                            <button
                                onClick={handlePesananDiterima}
                                style={{
                                    flex: 1,
                                    padding: ".75rem",
                                    background: "#22c55e",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: 10,
                                    fontWeight: 700,
                                    cursor: "pointer",
                                }}
                            >
                                Ya, Sudah Diterima ✅
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL BERI ULASAN */}
            {ulasanModal && (
                <div style={modalStyle} onClick={() => setUlasanModal(null)}>
                    <div
                        style={{
                            background: "#fff",
                            borderRadius: 14,
                            padding: "1.75rem",
                            width: "100%",
                            maxWidth: 440,
                            boxShadow: "0 20px 60px rgba(0,0,0,.15)",
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "1rem",
                            }}
                        >
                            <h2 style={{ fontWeight: 800, fontSize: "1rem" }}>
                                ⭐ Beri Ulasan
                            </h2>
                            <button
                                onClick={() => setUlasanModal(null)}
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

                        {/* Info produk */}
                        <div
                            style={{
                                display: "flex",
                                gap: ".75rem",
                                alignItems: "center",
                                marginBottom: "1.5rem",
                                padding: ".75rem",
                                background: "#f9fafb",
                                borderRadius: 10,
                            }}
                        >
                            {imgSrc(ulasanModal.gambar) ? (
                                <img
                                    src={imgSrc(ulasanModal.gambar)}
                                    alt={ulasanModal.produk}
                                    style={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 8,
                                        objectFit: "cover",
                                        flexShrink: 0,
                                    }}
                                    onError={(e) => {
                                        e.target.style.display = "none";
                                    }}
                                />
                            ) : (
                                <div
                                    style={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 8,
                                        background: "#fff",
                                        border: "1px solid #f0f0f0",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "1.4rem",
                                        flexShrink: 0,
                                    }}
                                >
                                    👟
                                </div>
                            )}
                            <div>
                                <div
                                    style={{
                                        fontWeight: 700,
                                        fontSize: ".85rem",
                                    }}
                                >
                                    {ulasanModal.produk}
                                </div>
                                <div
                                    style={{
                                        fontSize: ".72rem",
                                        color: "#888",
                                    }}
                                >
                                    Pesanan {ulasanModal.id}
                                </div>
                            </div>
                        </div>

                        {/* Bintang rating */}
                        <div
                            style={{
                                textAlign: "center",
                                marginBottom: "1.25rem",
                            }}
                        >
                            <p
                                style={{
                                    fontSize: ".85rem",
                                    fontWeight: 600,
                                    marginBottom: ".6rem",
                                }}
                            >
                                Bagaimana penilaianmu?
                            </p>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    gap: ".4rem",
                                }}
                            >
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => setRatingValue(star)}
                                        style={{
                                            background: "none",
                                            border: "none",
                                            cursor: "pointer",
                                            fontSize: "2rem",
                                            lineHeight: 1,
                                            color:
                                                star <= ratingValue
                                                    ? "#f59e0b"
                                                    : "#e5e7eb",
                                            transition: "color .15s",
                                        }}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>
                            {ratingValue > 0 && (
                                <p
                                    style={{
                                        fontSize: ".78rem",
                                        color: "#888",
                                        marginTop: ".4rem",
                                    }}
                                >
                                    {
                                        [
                                            "",
                                            "Sangat Kurang",
                                            "Kurang",
                                            "Cukup",
                                            "Bagus",
                                            "Sangat Bagus!",
                                        ][ratingValue]
                                    }
                                </p>
                            )}
                        </div>

                        {/* Komentar */}
                        <div style={{ marginBottom: "1.25rem" }}>
                            <label
                                style={{
                                    display: "block",
                                    fontWeight: 600,
                                    fontSize: ".85rem",
                                    marginBottom: ".4rem",
                                }}
                            >
                                Komentar (opsional)
                            </label>
                            <textarea
                                value={komentarValue}
                                onChange={(e) =>
                                    setKomentarValue(e.target.value)
                                }
                                placeholder="Bagaimana kualitas produk dan pengalaman belanjamu?"
                                rows={3}
                                maxLength={500}
                                style={{
                                    width: "100%",
                                    padding: ".65rem .9rem",
                                    border: "1.5px solid #e5e7eb",
                                    borderRadius: 9,
                                    fontSize: ".85rem",
                                    resize: "vertical",
                                    fontFamily: "inherit",
                                }}
                            />
                        </div>

                        <button
                            onClick={handleSubmitUlasan}
                            disabled={submittingUlasan}
                            style={{
                                width: "100%",
                                padding: ".75rem",
                                background: submittingUlasan
                                    ? "#fde68a"
                                    : "#f59e0b",
                                color: "#111",
                                border: "none",
                                borderRadius: 10,
                                fontWeight: 700,
                                cursor: submittingUlasan
                                    ? "not-allowed"
                                    : "pointer",
                                fontSize: ".9rem",
                            }}
                        >
                            {submittingUlasan
                                ? "⏳ Mengirim..."
                                : "Kirim Ulasan"}
                        </button>
                    </div>
                </div>
            )}

            {/* MODAL TRACKING */}
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
