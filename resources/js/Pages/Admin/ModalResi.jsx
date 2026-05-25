import { useState } from "react";
import { router } from "@inertiajs/react";

export default function ModalResi({ pesanan, kurirList, onClose }) {
    const [kurir, setKurir] = useState(pesanan.kurir || "");
    const [noResi, setNoResi] = useState(pesanan.nomor_resi || "");
    const [loading, setLoading] = useState(false);
    const [tracking, setTracking] = useState(null);
    const [error, setError] = useState("");
    const [saved, setSaved] = useState(false);

    const handleSimpan = () => {
        if (!kurir || !noResi) {
            setError("Kurir dan nomor resi wajib diisi!");
            return;
        }
        setLoading(true);
        setError("");
        router.post(
            `/admin/pesanan/${pesanan.id}/resi`,
            { kurir, nomor_resi: noResi },
            {
                onSuccess: () => {
                    setSaved(true);
                    setLoading(false);
                },
                onError: () => {
                    setError("Gagal menyimpan resi.");
                    setLoading(false);
                },
            },
        );
    };

    const handleTrack = async () => {
        if (!pesanan.has_resi && (!kurir || !noResi)) {
            setError("Simpan resi dulu sebelum tracking!");
            return;
        }
        setLoading(true);
        setError("");
        setTracking(null);
        try {
            const res = await fetch(`/admin/pesanan/${pesanan.id}/preview`);
            const data = await res.json();
            if (data.success) {
                setTracking(data.data);
            } else {
                setError(data.message || "Tracking gagal.");
            }
        } catch {
            setError("Gagal menghubungi server tracking.");
        }
        setLoading(false);
    };

    const statusColor = (status) => {
        const s = (status || "").toLowerCase();
        if (s.includes("delivered") || s.includes("selesai")) return "#22c55e";
        if (s.includes("transit") || s.includes("kirim")) return "#3b82f6";
        if (s.includes("pickup") || s.includes("proses")) return "#f59e0b";
        return "#888";
    };

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,.55)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 999,
                padding: "1rem",
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: "#fff",
                    borderRadius: 14,
                    padding: "1.75rem",
                    width: "100%",
                    maxWidth: 560,
                    boxShadow: "0 20px 60px rgba(0,0,0,.2)",
                    maxHeight: "90vh",
                    overflowY: "auto",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "1.25rem",
                    }}
                >
                    <div>
                        <h2 style={{ fontWeight: 800, fontSize: "1rem" }}>
                            🚚 Input Resi Pengiriman
                        </h2>
                        <p
                            style={{
                                fontSize: ".75rem",
                                color: "#888",
                                marginTop: "2px",
                            }}
                        >
                            Pesanan {pesanan.id} · {pesanan.pembeli}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
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

                {/* Status sukses simpan */}
                {saved && (
                    <div
                        style={{
                            background: "#dcfce7",
                            border: "1px solid #16a34a",
                            color: "#166534",
                            padding: ".75rem 1rem",
                            borderRadius: 9,
                            marginBottom: "1rem",
                            fontSize: ".82rem",
                            fontWeight: 600,
                        }}
                    >
                        ✅ Resi berhasil disimpan! Status pesanan diubah ke
                        Dikirim.
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div
                        style={{
                            background: "#fee2e2",
                            border: "1px solid #dc2626",
                            color: "#991b1b",
                            padding: ".75rem 1rem",
                            borderRadius: 9,
                            marginBottom: "1rem",
                            fontSize: ".82rem",
                        }}
                    >
                        ⚠️ {error}
                    </div>
                )}

                {/* Form Input Resi */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: ".75rem",
                        marginBottom: "1rem",
                    }}
                >
                    <div>
                        <label
                            style={{
                                display: "block",
                                fontWeight: 600,
                                fontSize: ".82rem",
                                marginBottom: ".3rem",
                            }}
                        >
                            Pilih Kurir
                        </label>
                        <select
                            value={kurir}
                            onChange={(e) => setKurir(e.target.value)}
                            style={{
                                width: "100%",
                                padding: ".55rem .8rem",
                                border: "1.5px solid #e5e7eb",
                                borderRadius: 8,
                                fontSize: ".85rem",
                                outline: "none",
                                background: "#fff",
                            }}
                        >
                            <option value="">-- Pilih Kurir --</option>
                            {Object.entries(kurirList).map(([k, v]) => (
                                <option key={k} value={k}>
                                    {v}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label
                            style={{
                                display: "block",
                                fontWeight: 600,
                                fontSize: ".82rem",
                                marginBottom: ".3rem",
                            }}
                        >
                            Nomor Resi
                        </label>
                        <input
                            value={noResi}
                            onChange={(e) => setNoResi(e.target.value)}
                            placeholder="Contoh: JNE123456789"
                            style={{
                                width: "100%",
                                padding: ".55rem .8rem",
                                border: "1.5px solid #e5e7eb",
                                borderRadius: 8,
                                fontSize: ".85rem",
                                outline: "none",
                            }}
                            onFocus={(e) =>
                                (e.target.style.borderColor = "#3b82f6")
                            }
                            onBlur={(e) =>
                                (e.target.style.borderColor = "#e5e7eb")
                            }
                        />
                    </div>
                </div>

                {/* Tombol aksi */}
                <div
                    style={{
                        display: "flex",
                        gap: ".6rem",
                        marginBottom: "1.25rem",
                    }}
                >
                    <button
                        onClick={handleSimpan}
                        disabled={loading}
                        style={{
                            flex: 1,
                            padding: ".65rem",
                            background: loading ? "#93c5fd" : "#3b82f6",
                            color: "#fff",
                            border: "none",
                            borderRadius: 9,
                            fontWeight: 700,
                            cursor: loading ? "not-allowed" : "pointer",
                            fontSize: ".875rem",
                        }}
                    >
                        {loading ? "⏳ Menyimpan..." : "💾 Simpan Resi"}
                    </button>
                    <button
                        onClick={handleTrack}
                        disabled={loading}
                        style={{
                            flex: 1,
                            padding: ".65rem",
                            background: loading ? "#d1fae5" : "#22c55e",
                            color: "#fff",
                            border: "none",
                            borderRadius: 9,
                            fontWeight: 700,
                            cursor: loading ? "not-allowed" : "pointer",
                            fontSize: ".875rem",
                        }}
                    >
                        {loading ? "⏳ Loading..." : "🔍 Cek Tracking"}
                    </button>
                </div>

                {/* Hasil Tracking */}
                {tracking && (
                    <div
                        style={{
                            border: "1px solid #f0f0f0",
                            borderRadius: 12,
                            overflow: "hidden",
                        }}
                    >
                        {/* Header tracking */}
                        <div
                            style={{
                                background: "#1e2a3a",
                                padding: "1rem 1.25rem",
                                color: "#fff",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    flexWrap: "wrap",
                                    gap: ".5rem",
                                }}
                            >
                                <div>
                                    <div
                                        style={{
                                            fontWeight: 800,
                                            fontSize: "1rem",
                                        }}
                                    >
                                        {tracking.kurir}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: ".75rem",
                                            color: "#aaa",
                                            marginTop: "2px",
                                        }}
                                    >
                                        Resi: {tracking.nomor_resi}
                                    </div>
                                </div>
                                <span
                                    style={{
                                        padding: "4px 12px",
                                        borderRadius: 999,
                                        background:
                                            statusColor(tracking.status) + "33",
                                        color: statusColor(tracking.status),
                                        fontWeight: 700,
                                        fontSize: ".75rem",
                                        border: `1px solid ${statusColor(tracking.status)}`,
                                    }}
                                >
                                    {tracking.status}
                                </span>
                            </div>
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 1fr",
                                    gap: ".5rem",
                                    marginTop: ".75rem",
                                    fontSize: ".75rem",
                                    color: "#ccc",
                                }}
                            >
                                <div>
                                    📦 Layanan:{" "}
                                    <strong style={{ color: "#fff" }}>
                                        {tracking.layanan}
                                    </strong>
                                </div>
                                <div>
                                    ⚖️ Berat:{" "}
                                    <strong style={{ color: "#fff" }}>
                                        {tracking.berat}
                                    </strong>
                                </div>
                                <div>
                                    📍 Dari:{" "}
                                    <strong style={{ color: "#fff" }}>
                                        {tracking.asal}
                                    </strong>
                                </div>
                                <div>
                                    🏠 Ke:{" "}
                                    <strong style={{ color: "#fff" }}>
                                        {tracking.tujuan}
                                    </strong>
                                </div>
                            </div>
                        </div>

                        {/* Riwayat */}
                        <div style={{ padding: "1rem 1.25rem" }}>
                            <div
                                style={{
                                    fontWeight: 700,
                                    fontSize: ".82rem",
                                    marginBottom: ".75rem",
                                }}
                            >
                                Riwayat Pengiriman
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 0,
                                }}
                            >
                                {tracking.riwayat.map((r, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            display: "flex",
                                            gap: ".75rem",
                                            paddingBottom: ".75rem",
                                            position: "relative",
                                        }}
                                    >
                                        {/* Timeline dot */}
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                flexShrink: 0,
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: 10,
                                                    height: 10,
                                                    borderRadius: "50%",
                                                    background:
                                                        i === 0
                                                            ? "#22c55e"
                                                            : "#d1d5db",
                                                    flexShrink: 0,
                                                    marginTop: 4,
                                                }}
                                            />
                                            {i <
                                                tracking.riwayat.length - 1 && (
                                                <div
                                                    style={{
                                                        width: 1,
                                                        flex: 1,
                                                        background: "#f0f0f0",
                                                        marginTop: 4,
                                                    }}
                                                />
                                            )}
                                        </div>
                                        <div
                                            style={{
                                                flex: 1,
                                                paddingBottom: ".5rem",
                                                borderBottom:
                                                    i <
                                                    tracking.riwayat.length - 1
                                                        ? "1px solid #f9fafb"
                                                        : "none",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    fontSize: ".8rem",
                                                    fontWeight: 600,
                                                    color:
                                                        i === 0
                                                            ? "#111"
                                                            : "#374151",
                                                }}
                                            >
                                                {r.deskripsi}
                                            </div>
                                            {r.lokasi && (
                                                <div
                                                    style={{
                                                        fontSize: ".7rem",
                                                        color: "#888",
                                                        marginTop: "2px",
                                                    }}
                                                >
                                                    📍 {r.lokasi}
                                                </div>
                                            )}
                                            <div
                                                style={{
                                                    fontSize: ".68rem",
                                                    color: "#aaa",
                                                    marginTop: "2px",
                                                }}
                                            >
                                                🕐 {r.tanggal}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
