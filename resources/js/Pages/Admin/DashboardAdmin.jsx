import { Head, Link } from "@inertiajs/react";
import { useState } from "react";
import AdminLayout from "./AdminLayout";

export default function DashboardAdmin({
    admin,
    stats,
    pesananTerbaru,
    produkTerlaris,
}) {
    const [filterStatus, setFilterStatus] = useState("Semua");

    const formatHarga = (n) => "Rp " + Number(n).toLocaleString("id-ID");

    const statusStyle = {
        Pending: { bg: "#fef9c3", color: "#854d0e" },
        Diproses: { bg: "#dbeafe", color: "#1e40af" },
        Dikirim: { bg: "#e0f2fe", color: "#0369a1" },
        Selesai: { bg: "#dcfce7", color: "#166534" },
        Batal: { bg: "#fee2e2", color: "#991b1b" },
    };

    const statusList = ["Semua", "Pending", "Diproses", "Dikirim", "Selesai"];

    const filteredPesanan =
        filterStatus === "Semua"
            ? pesananTerbaru
            : pesananTerbaru.filter((p) => p.status === filterStatus);

    const aktivitas = [
        {
            icon: "📦",
            text: "Pesanan #AS001 selesai",
            time: "2 mnt",
            color: "#22c55e",
        },
        {
            icon: "👥",
            text: "Pembeli baru: Siti Rahayu",
            time: "15 mnt",
            color: "#3b82f6",
        },
        {
            icon: "💰",
            text: "Pembayaran #AS003 dikonfirmasi",
            time: "1 jam",
            color: "#8b5cf6",
        },
        {
            icon: "⚠️",
            text: "Stok Adidas menipis (5 pcs)",
            time: "2 jam",
            color: "#f59e0b",
        },
        {
            icon: "📦",
            text: "Pesanan baru masuk #AS006",
            time: "3 jam",
            color: "#3b82f6",
        },
        {
            icon: "⭐",
            text: "Ulasan baru dari Ahmad (5★)",
            time: "5 jam",
            color: "#f59e0b",
        },
    ];

    const penjualanBrand = [
        { brand: "VANS", persen: 42, color: "#3b82f6" },
        { brand: "NIKE", persen: 28, color: "#22c55e" },
        { brand: "ADIDAS", persen: 20, color: "#f59e0b" },
        { brand: "CONVERSE", persen: 10, color: "#8b5cf6" },
    ];

    return (
        <AdminLayout active="Dashboard" admin={admin}>
            <Head title="Dashboard | Admin AMENG STORE" />

            {/* ===== STAT CARDS ===== */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
                    gap: ".75rem",
                    marginBottom: "1.25rem",
                }}
            >
                {stats.map((s, i) => (
                    <div
                        key={i}
                        style={{
                            background: "#fff",
                            borderRadius: 10,
                            border: "1px solid #e5e7eb",
                            borderLeft: `4px solid ${s.accent || "#3b82f6"}`,
                            padding: "1.1rem 1.25rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "1rem",
                            boxShadow: "0 1px 3px rgba(0,0,0,.04)",
                            transition: "transform .2s",
                        }}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.transform =
                                "translateY(-2px)")
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.transform = "none")
                        }
                    >
                        <div
                            style={{
                                width: 46,
                                height: 46,
                                borderRadius: 10,
                                background: s.color,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "1.3rem",
                                flexShrink: 0,
                            }}
                        >
                            {s.icon}
                        </div>
                        <div style={{ flex: 1 }}>
                            <div
                                style={{
                                    fontSize: ".7rem",
                                    color: "#888",
                                    fontWeight: 500,
                                    marginBottom: ".2rem",
                                }}
                            >
                                {s.label}
                            </div>
                            <div
                                style={{
                                    fontSize: "1.5rem",
                                    fontWeight: 800,
                                    color: "#111",
                                    lineHeight: 1,
                                }}
                            >
                                {s.value}
                            </div>
                            <div
                                style={{
                                    fontSize: ".65rem",
                                    color:
                                        s.trend === "up" ? "#22c55e" : "#aaa",
                                    marginTop: ".3rem",
                                    fontWeight: 600,
                                }}
                            >
                                {s.trend === "up" ? "↑ " : ""}
                                {s.sub}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ===== ROW 1: Pesanan + Aktivitas ===== */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 300px",
                    gap: "1rem",
                    marginBottom: "1rem",
                }}
            >
                {/* Tabel Pesanan */}
                <div className="card">
                    <div className="card-header">
                        <span style={{ fontWeight: 700, fontSize: ".9rem" }}>
                            📦 Pesanan Terbaru
                        </span>
                        <div
                            style={{
                                display: "flex",
                                gap: ".3rem",
                                flexWrap: "wrap",
                            }}
                        >
                            {statusList.map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setFilterStatus(s)}
                                    style={{
                                        padding: "2px 9px",
                                        borderRadius: 999,
                                        fontSize: ".68rem",
                                        fontWeight: 700,
                                        cursor: "pointer",
                                        border: "1.5px solid",
                                        borderColor:
                                            filterStatus === s
                                                ? "#3b82f6"
                                                : "#e5e7eb",
                                        background:
                                            filterStatus === s
                                                ? "#3b82f6"
                                                : "#fff",
                                        color:
                                            filterStatus === s
                                                ? "#fff"
                                                : "#666",
                                    }}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="tbl-wrap">
                        <table>
                            <thead>
                                <tr>
                                    {[
                                        "ID",
                                        "Pembeli",
                                        "Produk",
                                        "Total",
                                        "Status",
                                        "Aksi",
                                    ].map((h) => (
                                        <th key={h}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPesanan.map((p, i) => (
                                    <tr key={i}>
                                        <td
                                            style={{
                                                fontWeight: 700,
                                                color: "#3b82f6",
                                            }}
                                        >
                                            {p.id}
                                        </td>
                                        <td>{p.pembeli}</td>
                                        <td
                                            style={{
                                                color: "#555",
                                                maxWidth: 120,
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            {p.produk}
                                        </td>
                                        <td style={{ fontWeight: 700 }}>
                                            {formatHarga(p.total)}
                                        </td>
                                        <td>
                                            <span
                                                className="badge"
                                                style={{
                                                    background:
                                                        statusStyle[p.status]
                                                            ?.bg || "#f0f0f0",
                                                    color:
                                                        statusStyle[p.status]
                                                            ?.color || "#555",
                                                }}
                                            >
                                                {p.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    gap: "4px",
                                                }}
                                            >
                                                <button className="btn btn-primary btn-sm">
                                                    Detail
                                                </button>
                                                <select
                                                    style={{
                                                        padding: "2px 4px",
                                                        border: "1px solid #e5e7eb",
                                                        borderRadius: 5,
                                                        fontSize: ".68rem",
                                                        cursor: "pointer",
                                                        background: "#fff",
                                                    }}
                                                >
                                                    <option>Status</option>
                                                    {[
                                                        "Diproses",
                                                        "Dikirim",
                                                        "Selesai",
                                                        "Batal",
                                                    ].map((s) => (
                                                        <option key={s}>
                                                            {s}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div
                        style={{
                            padding: ".65rem 1.25rem",
                            borderTop: "1px solid #f0f0f0",
                            textAlign: "right",
                        }}
                    >
                        <Link
                            href="/admin/pesanan"
                            style={{
                                fontSize: ".75rem",
                                color: "#3b82f6",
                                fontWeight: 600,
                            }}
                        >
                            Lihat semua pesanan →
                        </Link>
                    </div>
                </div>

                {/* Aktivitas */}
                <div className="card" style={{ overflow: "hidden" }}>
                    <div className="card-header">
                        <span style={{ fontWeight: 700, fontSize: ".9rem" }}>
                            🕐 Aktivitas
                        </span>
                    </div>
                    <div style={{ padding: ".25rem 0" }}>
                        {aktivitas.map((a, i) => (
                            <div
                                key={i}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: ".65rem",
                                    padding: ".6rem 1.1rem",
                                    borderBottom:
                                        i < aktivitas.length - 1
                                            ? "1px solid #f9fafb"
                                            : "none",
                                }}
                            >
                                <div
                                    style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: 7,
                                        background: a.color + "22",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: ".9rem",
                                        flexShrink: 0,
                                    }}
                                >
                                    {a.icon}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div
                                        style={{
                                            fontSize: ".75rem",
                                            fontWeight: 500,
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {a.text}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: ".65rem",
                                            color: "#aaa",
                                            marginTop: "2px",
                                        }}
                                    >
                                        {a.time} lalu
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ===== ROW 2: Produk Terlaris + Ringkasan ===== */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 300px",
                    gap: "1rem",
                }}
            >
                {/* Produk Terlaris */}
                <div className="card">
                    <div className="card-header">
                        <span style={{ fontWeight: 700, fontSize: ".9rem" }}>
                            👟 Produk Terlaris
                        </span>
                        <Link
                            href="/admin/produk"
                            style={{
                                fontSize: ".75rem",
                                color: "#3b82f6",
                                fontWeight: 600,
                            }}
                        >
                            Kelola →
                        </Link>
                    </div>
                    <div className="tbl-wrap">
                        <table>
                            <thead>
                                <tr>
                                    {[
                                        "Produk",
                                        "Brand",
                                        "Terjual",
                                        "Stok",
                                        "Harga",
                                        "Status",
                                    ].map((h) => (
                                        <th key={h}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {produkTerlaris.map((p, i) => (
                                    <tr key={i}>
                                        <td style={{ fontWeight: 600 }}>
                                            {p.nama}
                                        </td>
                                        <td>
                                            <span
                                                style={{
                                                    fontSize: ".68rem",
                                                    fontWeight: 700,
                                                    color: "#f59e0b",
                                                }}
                                            >
                                                {p.brand}
                                            </span>
                                        </td>
                                        <td style={{ fontWeight: 700 }}>
                                            {p.terjual} pcs
                                        </td>
                                        <td>{p.stok} pcs</td>
                                        <td style={{ fontWeight: 700 }}>
                                            {formatHarga(p.harga)}
                                        </td>
                                        <td>
                                            <span
                                                className="badge"
                                                style={{
                                                    background:
                                                        p.stok < 8
                                                            ? "#fee2e2"
                                                            : "#dcfce7",
                                                    color:
                                                        p.stok < 8
                                                            ? "#991b1b"
                                                            : "#166534",
                                                }}
                                            >
                                                {p.stok < 8
                                                    ? "⚠ Menipis"
                                                    : "✓ Aman"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Ringkasan */}
                <div className="card" style={{ padding: "1.25rem" }}>
                    <div
                        style={{
                            fontWeight: 700,
                            fontSize: ".9rem",
                            marginBottom: "1rem",
                        }}
                    >
                        📊 Penjualan Brand
                    </div>

                    {/* Progress brand */}
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: ".75rem",
                            marginBottom: "1.25rem",
                        }}
                    >
                        {penjualanBrand.map((b, i) => (
                            <div key={i}>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        marginBottom: ".25rem",
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
                                                width: 7,
                                                height: 7,
                                                borderRadius: "50%",
                                                background: b.color,
                                            }}
                                        />
                                        <span
                                            style={{
                                                fontSize: ".75rem",
                                                fontWeight: 600,
                                            }}
                                        >
                                            {b.brand}
                                        </span>
                                    </div>
                                    <span
                                        style={{
                                            fontSize: ".72rem",
                                            color: "#888",
                                        }}
                                    >
                                        {b.persen}%
                                    </span>
                                </div>
                                <div
                                    style={{
                                        height: 6,
                                        background: "#f0f0f0",
                                        borderRadius: 999,
                                        overflow: "hidden",
                                    }}
                                >
                                    <div
                                        style={{
                                            height: "100%",
                                            width: `${b.persen}%`,
                                            background: b.color,
                                            borderRadius: 999,
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Aksi cepat */}
                    <div
                        style={{
                            fontWeight: 700,
                            fontSize: ".8rem",
                            marginBottom: ".65rem",
                            color: "#888",
                        }}
                    >
                        AKSI CEPAT
                    </div>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: ".5rem",
                        }}
                    >
                        {[
                            {
                                icon: "➕",
                                label: "Tambah Produk",
                                href: "/admin/produk",
                                color: "#3b82f6",
                            },
                            {
                                icon: "📦",
                                label: "Pesanan",
                                href: "/admin/pesanan",
                                color: "#f59e0b",
                            },
                            {
                                icon: "👥",
                                label: "Pembeli",
                                href: "/admin/pembeli",
                                color: "#22c55e",
                            },
                            {
                                icon: "📈",
                                label: "Laporan",
                                href: "/admin/laporan",
                                color: "#8b5cf6",
                            },
                        ].map((a, i) => (
                            <Link
                                key={i}
                                href={a.href}
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: ".35rem",
                                    padding: ".75rem .5rem",
                                    background: "#f9fafb",
                                    borderRadius: 8,
                                    border: "1px solid #f0f0f0",
                                    fontSize: ".72rem",
                                    fontWeight: 600,
                                    color: "#333",
                                    textAlign: "center",
                                    transition: "all .15s",
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.background =
                                        a.color + "18";
                                    e.currentTarget.style.borderColor = a.color;
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.background =
                                        "#f9fafb";
                                    e.currentTarget.style.borderColor =
                                        "#f0f0f0";
                                }}
                            >
                                <span style={{ fontSize: "1.1rem" }}>
                                    {a.icon}
                                </span>
                                {a.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
