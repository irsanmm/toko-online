import { useState } from "react";

export default function TrackingResi({
    nomorPesanan,
    kurir,
    nomorResi,
    onClose,
}) {
    const [tracking, setTracking] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const kurirLabel = {
        jne: "JNE",
        jnt: "J&T Express",
        sicepat: "SiCepat",
        anteraja: "AnterAja",
        pos: "Pos Indonesia",
        tiki: "TIKI",
        ninja: "Ninja Express",
        lion: "Lion Parcel",
        idexpress: "ID Express",
        sap: "SAP Express",
    };

    const handleTrack = async () => {
        setLoading(true);
        setError("");
        setTracking(null);
        try {
            const csrfToken =
                document
                    .querySelector('meta[name="csrf-token"]')
                    ?.getAttribute("content") || "";
            const res = await fetch("/pembeli/track-resi", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-CSRF-TOKEN": csrfToken,
                    "X-Requested-With": "XMLHttpRequest",
                },
                body: JSON.stringify({ nomor_pesanan: nomorPesanan }),
            });
            if (!res.ok) {
                setError(`Server error: ${res.status}. Coba refresh halaman.`);
                setLoading(false);
                return;
            }
            const data = await res.json();
            if (data.success) {
                setTracking(data.data);
            } else {
                setError(data.message || "Tracking gagal.");
            }
        } catch (err) {
            setError("Tidak dapat terhubung ke server.");
        }
        setLoading(false);
    };

    const statusColor = (status) => {
        const s = (status || "").toLowerCase();
        if (
            s.includes("delivered") ||
            s.includes("selesai") ||
            s.includes("terima")
        )
            return "#22c55e";
        if (s.includes("transit") || s.includes("kirim") || s.includes("antar"))
            return "#3b82f6";
        return "#f59e0b";
    };

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,.5)",
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
                    maxWidth: 520,
                    boxShadow: "0 20px 60px rgba(0,0,0,.15)",
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
                            🚚 Lacak Pengiriman
                        </h2>
                        <p
                            style={{
                                fontSize: ".75rem",
                                color: "#888",
                                marginTop: "2px",
                            }}
                        >
                            Pesanan {nomorPesanan}
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

                {/* Info resi */}
                <div
                    style={{
                        background: "#f9fafb",
                        borderRadius: 10,
                        padding: "1rem",
                        marginBottom: "1rem",
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: ".5rem",
                    }}
                >
                    <div>
                        <div style={{ fontSize: ".68rem", color: "#888" }}>
                            Kurir
                        </div>
                        <div style={{ fontWeight: 700, fontSize: ".95rem" }}>
                            {kurirLabel[kurir?.toLowerCase()] ||
                                kurir?.toUpperCase()}
                        </div>
                    </div>
                    <div>
                        <div style={{ fontSize: ".68rem", color: "#888" }}>
                            Nomor Resi
                        </div>
                        <div
                            style={{
                                fontWeight: 700,
                                fontSize: ".95rem",
                                letterSpacing: ".02em",
                            }}
                        >
                            {nomorResi}
                        </div>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div
                        style={{
                            background: "#fee2e2",
                            border: "1px solid #fca5a5",
                            color: "#991b1b",
                            padding: ".75rem 1rem",
                            borderRadius: 9,
                            fontSize: ".82rem",
                            marginBottom: "1rem",
                        }}
                    >
                        ⚠️ {error}
                    </div>
                )}

                {/* Tombol cek */}
                {!tracking && (
                    <button
                        onClick={handleTrack}
                        disabled={loading}
                        style={{
                            width: "100%",
                            padding: ".75rem",
                            background: loading ? "#93c5fd" : "#3b82f6",
                            color: "#fff",
                            border: "none",
                            borderRadius: 10,
                            fontWeight: 700,
                            cursor: loading ? "not-allowed" : "pointer",
                            fontSize: ".9rem",
                            marginBottom: "1rem",
                        }}
                    >
                        {loading
                            ? "⏳ Mengecek resi..."
                            : "🔍 Cek Status Pengiriman"}
                    </button>
                )}

                {/* Hasil tracking */}
                {tracking && (
                    <>
                        {/* Header status */}
                        <div
                            style={{
                                background: "#1e2a3a",
                                borderRadius: 10,
                                padding: "1rem",
                                color: "#fff",
                                marginBottom: "1rem",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginBottom: ".5rem",
                                }}
                            >
                                <div
                                    style={{
                                        fontWeight: 800,
                                        fontSize: "1rem",
                                    }}
                                >
                                    {tracking.kurir}
                                </div>
                                <span
                                    style={{
                                        padding: "3px 10px",
                                        borderRadius: 999,
                                        background:
                                            statusColor(tracking.status) + "33",
                                        color: statusColor(tracking.status),
                                        fontWeight: 700,
                                        fontSize: ".72rem",
                                        border: `1px solid ${statusColor(tracking.status)}`,
                                    }}
                                >
                                    {tracking.status}
                                </span>
                            </div>

                            {/* Detail info */}
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 1fr",
                                    gap: ".4rem",
                                    marginTop: ".5rem",
                                }}
                            >
                                {[
                                    ["📦 Pengirim", tracking.pengirim],
                                    ["👤 Penerima", tracking.penerima],
                                    ["📍 Asal", tracking.asal],
                                    ["🏠 Tujuan", tracking.tujuan],
                                    ["🚛 Layanan", tracking.layanan],
                                    ["⚖️ Berat", tracking.berat],
                                ]
                                    .filter(([, v]) => v && v !== "-")
                                    .map(([label, val]) => (
                                        <div
                                            key={label}
                                            style={{ fontSize: ".72rem" }}
                                        >
                                            <span style={{ color: "#888" }}>
                                                {label}:{" "}
                                            </span>
                                            <span
                                                style={{
                                                    color: "#fff",
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {val}
                                            </span>
                                        </div>
                                    ))}
                            </div>

                            {/* Status terakhir */}
                            {tracking.terakhir_di &&
                                tracking.terakhir_di !== "-" && (
                                    <div
                                        style={{
                                            marginTop: ".6rem",
                                            padding: ".5rem .75rem",
                                            background: "rgba(255,255,255,.1)",
                                            borderRadius: 7,
                                            fontSize: ".75rem",
                                            color: "#ddd",
                                        }}
                                    >
                                        📌{" "}
                                        <strong style={{ color: "#fff" }}>
                                            Status terkini:
                                        </strong>{" "}
                                        {tracking.terakhir_di}
                                    </div>
                                )}
                        </div>

                        {/* Riwayat Pengiriman */}
                        <div
                            style={{
                                fontWeight: 700,
                                fontSize: ".875rem",
                                marginBottom: ".75rem",
                            }}
                        >
                            Riwayat Pengiriman ({tracking.riwayat?.length || 0}{" "}
                            update)
                        </div>
                        <div>
                            {(tracking.riwayat || []).map((r, i) => (
                                <div
                                    key={i}
                                    style={{
                                        display: "flex",
                                        gap: ".75rem",
                                        marginBottom: ".5rem",
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
                                                marginTop: 4,
                                                flexShrink: 0,
                                            }}
                                        />
                                        {i <
                                            (tracking.riwayat?.length || 0) -
                                                1 && (
                                            <div
                                                style={{
                                                    width: 1,
                                                    flex: 1,
                                                    background: "#f0f0f0",
                                                    marginTop: 4,
                                                    minHeight: 20,
                                                }}
                                            />
                                        )}
                                    </div>

                                    {/* Konten */}
                                    <div
                                        style={{
                                            flex: 1,
                                            paddingBottom: ".6rem",
                                            borderBottom:
                                                i <
                                                (tracking.riwayat?.length ||
                                                    0) -
                                                    1
                                                    ? "1px solid #f9fafb"
                                                    : "none",
                                        }}
                                    >
                                        {/* Deskripsi */}
                                        {r.deskripsi && r.deskripsi.trim() ? (
                                            <div
                                                style={{
                                                    fontSize: ".82rem",
                                                    fontWeight:
                                                        i === 0 ? 700 : 500,
                                                    color:
                                                        i === 0
                                                            ? "#111"
                                                            : "#374151",
                                                    lineHeight: 1.5,
                                                }}
                                            >
                                                {r.deskripsi}
                                            </div>
                                        ) : (
                                            <div
                                                style={{
                                                    fontSize: ".82rem",
                                                    color: "#888",
                                                    fontStyle: "italic",
                                                }}
                                            >
                                                (Tidak ada keterangan)
                                            </div>
                                        )}

                                        {/* Lokasi */}
                                        {r.lokasi && r.lokasi.trim() && (
                                            <div
                                                style={{
                                                    fontSize: ".72rem",
                                                    color: "#3b82f6",
                                                    marginTop: "2px",
                                                    fontWeight: 500,
                                                }}
                                            >
                                                📍 {r.lokasi}
                                            </div>
                                        )}

                                        {/* Tanggal */}
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

                        {/* Tombol refresh */}
                        <button
                            onClick={() => {
                                setTracking(null);
                                setError("");
                            }}
                            style={{
                                width: "100%",
                                padding: ".6rem",
                                background: "#f9fafb",
                                border: "1px solid #e5e7eb",
                                borderRadius: 9,
                                fontWeight: 600,
                                cursor: "pointer",
                                fontSize: ".82rem",
                                marginTop: ".75rem",
                            }}
                        >
                            🔄 Refresh Tracking
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
