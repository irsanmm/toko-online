import { Head } from "@inertiajs/react";
import AdminLayout from "./AdminLayout";

export default function LaporanAdmin({
    admin,
    totalPendapatan,
    totalPesanan,
    pesananSelesai,
    totalPembeli,
    penjualanBrand,
    transaksi,
    topPembeli,
}) {
    const fmtHarga = (n) => "Rp " + Number(n).toLocaleString("id-ID");

    const statusStyle = {
        Pending: { bg: "#fef9c3", color: "#854d0e" },
        Diproses: { bg: "#dbeafe", color: "#1e40af" },
        Dikirim: { bg: "#e0f2fe", color: "#0369a1" },
        Selesai: { bg: "#dcfce7", color: "#166534" },
        Batal: { bg: "#fee2e2", color: "#991b1b" },
    };

    const brandColor = {
        VANS: "#3b82f6",
        NIKE: "#22c55e",
        ADIDAS: "#f59e0b",
        CONVERSE: "#8b5cf6",
    };

    return (
        <AdminLayout active="Laporan" admin={admin}>
            <Head title="Laporan | Admin AMENG STORE" />

            <div style={{ marginBottom: "1.1rem" }}>
                <h1 style={{ fontSize: "1.1rem", fontWeight: 800 }}>
                    Laporan Penjualan
                </h1>
                <p
                    style={{
                        fontSize: ".75rem",
                        color: "#888",
                        marginTop: "2px",
                    }}
                >
                    Data real berdasarkan transaksi yang tercatat di sistem
                </p>
            </div>

            {/* Stat Cards */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
                    gap: ".75rem",
                    marginBottom: "1.25rem",
                }}
            >
                {[
                    {
                        label: "Total Pendapatan",
                        value: fmtHarga(totalPendapatan),
                        icon: "💰",
                        color: "#dcfce7",
                        accent: "#22c55e",
                    },
                    {
                        label: "Total Pesanan",
                        value: totalPesanan,
                        icon: "📦",
                        color: "#dbeafe",
                        accent: "#3b82f6",
                    },
                    {
                        label: "Pesanan Selesai",
                        value: pesananSelesai,
                        icon: "✅",
                        color: "#fef9c3",
                        accent: "#f59e0b",
                    },
                    {
                        label: "Total Pembeli",
                        value: totalPembeli,
                        icon: "👥",
                        color: "#fce7f3",
                        accent: "#ec4899",
                    },
                ].map((s, i) => (
                    <div
                        key={i}
                        style={{
                            background: "#fff",
                            borderRadius: 10,
                            border: "1px solid #e5e7eb",
                            borderLeft: `4px solid ${s.accent}`,
                            padding: "1.1rem 1.25rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "1rem",
                        }}
                    >
                        <div
                            style={{
                                width: 44,
                                height: 44,
                                borderRadius: 10,
                                background: s.color,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "1.25rem",
                            }}
                        >
                            {s.icon}
                        </div>
                        <div>
                            <div
                                style={{
                                    fontSize: ".7rem",
                                    color: "#888",
                                    marginBottom: ".2rem",
                                }}
                            >
                                {s.label}
                            </div>
                            <div
                                style={{
                                    fontSize: "1.25rem",
                                    fontWeight: 800,
                                    color: "#111",
                                }}
                            >
                                {s.value}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 300px",
                    gap: "1rem",
                    marginBottom: "1rem",
                }}
            >
                {/* Transaksi Terbaru */}
                <div className="card">
                    <div className="card-header">
                        <span style={{ fontWeight: 700, fontSize: ".9rem" }}>
                            🧾 Transaksi Terbaru
                        </span>
                    </div>
                    <div className="tbl-wrap">
                        <table>
                            <thead>
                                <tr>
                                    {[
                                        "ID",
                                        "Pembeli",
                                        "Produk",
                                        "Qty",
                                        "Total",
                                        "Status",
                                        "Tanggal",
                                    ].map((h) => (
                                        <th key={h}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {(transaksi || []).length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            style={{
                                                textAlign: "center",
                                                color: "#aaa",
                                                padding: "1.5rem",
                                            }}
                                        >
                                            Belum ada transaksi
                                        </td>
                                    </tr>
                                ) : (
                                    (transaksi || []).map((t, i) => (
                                        <tr key={i}>
                                            <td
                                                style={{
                                                    fontWeight: 700,
                                                    color: "#3b82f6",
                                                }}
                                            >
                                                {t.id}
                                            </td>
                                            <td style={{ fontWeight: 600 }}>
                                                {t.pembeli}
                                            </td>
                                            <td
                                                style={{
                                                    fontSize: ".78rem",
                                                    maxWidth: 140,
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    whiteSpace: "nowrap",
                                                }}
                                            >
                                                {t.produk}
                                            </td>
                                            <td style={{ textAlign: "center" }}>
                                                {t.qty}
                                            </td>
                                            <td style={{ fontWeight: 700 }}>
                                                {fmtHarga(t.total)}
                                            </td>
                                            <td>
                                                <span
                                                    className="badge"
                                                    style={{
                                                        background:
                                                            statusStyle[
                                                                t.status
                                                            ]?.bg || "#f0f0f0",
                                                        color:
                                                            statusStyle[
                                                                t.status
                                                            ]?.color || "#555",
                                                    }}
                                                >
                                                    {t.status}
                                                </span>
                                            </td>
                                            <td
                                                style={{
                                                    fontSize: ".72rem",
                                                    color: "#888",
                                                }}
                                            >
                                                {t.tanggal}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Penjualan per Brand */}
                <div className="card" style={{ padding: "1.25rem" }}>
                    <div
                        style={{
                            fontWeight: 700,
                            fontSize: ".9rem",
                            marginBottom: "1rem",
                        }}
                    >
                        📊 Penjualan per Brand
                    </div>
                    {(penjualanBrand || []).length === 0 ? (
                        <p
                            style={{
                                fontSize: ".8rem",
                                color: "#aaa",
                                textAlign: "center",
                                padding: "1rem 0",
                            }}
                        >
                            Belum ada data penjualan
                        </p>
                    ) : (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: ".85rem",
                            }}
                        >
                            {(penjualanBrand || []).map((b, i) => (
                                <div key={i}>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            marginBottom: ".3rem",
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: ".4rem",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: 8,
                                                    height: 8,
                                                    borderRadius: "50%",
                                                    background:
                                                        brandColor[b.brand] ||
                                                        "#888",
                                                }}
                                            />
                                            <span
                                                style={{
                                                    fontSize: ".78rem",
                                                    fontWeight: 700,
                                                }}
                                            >
                                                {b.brand}
                                            </span>
                                        </div>
                                        <span
                                            style={{
                                                fontSize: ".75rem",
                                                color: "#888",
                                            }}
                                        >
                                            {b.terjual} pcs · {b.persen}%
                                        </span>
                                    </div>
                                    <div
                                        style={{
                                            height: 7,
                                            background: "#f0f0f0",
                                            borderRadius: 999,
                                            overflow: "hidden",
                                        }}
                                    >
                                        <div
                                            style={{
                                                height: "100%",
                                                width: `${b.persen}%`,
                                                background:
                                                    brandColor[b.brand] ||
                                                    "#888",
                                                borderRadius: 999,
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Top Pembeli */}
            <div className="card">
                <div className="card-header">
                    <span style={{ fontWeight: 700, fontSize: ".9rem" }}>
                        ⭐ Pembeli Terbaik
                    </span>
                    <span style={{ fontSize: ".72rem", color: "#888" }}>
                        Berdasarkan total belanja pesanan selesai
                    </span>
                </div>
                {(topPembeli || []).length === 0 ? (
                    <p
                        style={{
                            fontSize: ".8rem",
                            color: "#aaa",
                            textAlign: "center",
                            padding: "1.5rem",
                        }}
                    >
                        Belum ada pembeli dengan transaksi selesai
                    </p>
                ) : (
                    <div className="tbl-wrap">
                        <table>
                            <thead>
                                <tr>
                                    {[
                                        "#",
                                        "Nama Pembeli",
                                        "Total Pesanan Selesai",
                                        "Total Belanja",
                                    ].map((h) => (
                                        <th key={h}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {(topPembeli || []).map((p, i) => (
                                    <tr key={i}>
                                        <td
                                            style={{
                                                fontWeight: 700,
                                                color: "#f59e0b",
                                            }}
                                        >
                                            {i === 0
                                                ? "🥇"
                                                : i === 1
                                                  ? "🥈"
                                                  : i === 2
                                                    ? "🥉"
                                                    : `#${i + 1}`}
                                        </td>
                                        <td style={{ fontWeight: 600 }}>
                                            {p.nama}
                                        </td>
                                        <td style={{ textAlign: "center" }}>
                                            {p.totalPesanan} pesanan
                                        </td>
                                        <td style={{ fontWeight: 700 }}>
                                            {fmtHarga(p.totalBelanja)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
