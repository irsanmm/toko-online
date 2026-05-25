import { Head } from "@inertiajs/react";
import { useState } from "react";
import AdminLayout from "./AdminLayout";

export default function LaporanAdmin({ admin }) {
    const [periode, setPeriode] = useState("bulan");

    const fmtHarga = (n) => "Rp " + Number(n).toLocaleString("id-ID");

    const dataHarian = [
        { hari: "Sen", pesanan: 8, pendapatan: 7200000 },
        { hari: "Sel", pesanan: 12, pendapatan: 11500000 },
        { hari: "Rab", pesanan: 6, pendapatan: 5400000 },
        { hari: "Kam", pesanan: 15, pendapatan: 14200000 },
        { hari: "Jum", pesanan: 20, pendapatan: 18900000 },
        { hari: "Sab", pesanan: 25, pendapatan: 23500000 },
        { hari: "Min", pesanan: 18, pendapatan: 16800000 },
    ];

    const dataBulanan = [
        { bln: "Jan", pesanan: 85, pendapatan: 76500000 },
        { bln: "Feb", pesanan: 92, pendapatan: 83200000 },
        { bln: "Mar", pesanan: 78, pendapatan: 70100000 },
        { bln: "Apr", pesanan: 105, pendapatan: 94500000 },
        { bln: "Mei", pesanan: 128, pendapatan: 115200000 },
    ];

    const data = periode === "minggu" ? dataHarian : dataBulanan;
    const maxPendapatan = Math.max(...data.map((d) => d.pendapatan));
    const maxPesanan = Math.max(...data.map((d) => d.pesanan));

    const penjualanBrand = [
        { brand: "VANS", persen: 42, terjual: 54, color: "#3b82f6" },
        { brand: "NIKE", persen: 28, terjual: 36, color: "#22c55e" },
        { brand: "ADIDAS", persen: 20, terjual: 26, color: "#f59e0b" },
        { brand: "CONVERSE", persen: 10, terjual: 13, color: "#8b5cf6" },
    ];

    const transaksiTerbaru = [
        {
            id: "#AS001",
            pembeli: "Budi Santoso",
            produk: "Vans Authentic",
            total: 899000,
            status: "Selesai",
            tanggal: "14 Mei 2025",
        },
        {
            id: "#AS002",
            pembeli: "Siti Rahayu",
            produk: "Nike Air Max 270",
            total: 1450000,
            status: "Selesai",
            tanggal: "13 Mei 2025",
        },
        {
            id: "#AS003",
            pembeli: "Ahmad Fauzi",
            produk: "Adidas Ultraboost",
            total: 1750000,
            status: "Dikirim",
            tanggal: "13 Mei 2025",
        },
        {
            id: "#AS004",
            pembeli: "Dewi Lestari",
            produk: "Converse Chuck",
            total: 1500000,
            status: "Selesai",
            tanggal: "12 Mei 2025",
        },
        {
            id: "#AS005",
            pembeli: "Rizki Pratama",
            produk: "Vans Authentic",
            total: 899000,
            status: "Selesai",
            tanggal: "12 Mei 2025",
        },
    ];

    return (
        <AdminLayout active="Laporan" admin={admin}>
            <Head title="Laporan | Admin AMENG STORE" />

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1.1rem",
                    flexWrap: "wrap",
                    gap: ".6rem",
                }}
            >
                <div>
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
                        Ringkasan performa toko Ameng Store
                    </p>
                </div>
                <div
                    style={{
                        display: "flex",
                        gap: ".5rem",
                        alignItems: "center",
                    }}
                >
                    <select
                        className="form-input"
                        style={{
                            padding: ".4rem .75rem",
                            fontSize: ".8rem",
                            width: "auto",
                        }}
                        value={periode}
                        onChange={(e) => setPeriode(e.target.value)}
                    >
                        <option value="minggu">7 Hari Terakhir</option>
                        <option value="bulan">5 Bulan Terakhir</option>
                    </select>
                    <button className="btn btn-success">📥 Export PDF</button>
                </div>
            </div>

            {/* KPI Cards */}
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
                        value: "Rp 115.2jt",
                        icon: "💰",
                        color: "#dcfce7",
                        accent: "#22c55e",
                        sub: "↑ 12% vs bulan lalu",
                    },
                    {
                        label: "Total Pesanan",
                        value: "128",
                        icon: "📦",
                        color: "#dbeafe",
                        accent: "#3b82f6",
                        sub: "↑ 8 pesanan baru",
                    },
                    {
                        label: "Rata-rata Pesanan",
                        value: "Rp 899rb",
                        icon: "📊",
                        color: "#fef9c3",
                        accent: "#f59e0b",
                        sub: "Per transaksi",
                    },
                    {
                        label: "Pembeli Aktif",
                        value: "87",
                        icon: "👥",
                        color: "#fce7f3",
                        accent: "#ec4899",
                        sub: "Bulan ini",
                    },
                ].map((s, i) => (
                    <div
                        key={i}
                        style={{
                            background: "#fff",
                            borderRadius: 10,
                            border: `1px solid #e5e7eb`,
                            borderLeft: `4px solid ${s.accent}`,
                            padding: "1rem 1.1rem",
                            boxShadow: "0 1px 3px rgba(0,0,0,.04)",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                            }}
                        >
                            <div>
                                <div
                                    style={{
                                        fontSize: ".68rem",
                                        color: "#888",
                                        marginBottom: ".25rem",
                                        fontWeight: 500,
                                    }}
                                >
                                    {s.label}
                                </div>
                                <div
                                    style={{
                                        fontSize: "1.4rem",
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
                                        color: s.accent,
                                        marginTop: ".3rem",
                                        fontWeight: 600,
                                    }}
                                >
                                    {s.sub}
                                </div>
                            </div>
                            <div
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 8,
                                    background: s.color,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "1.1rem",
                                }}
                            >
                                {s.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Chart Batang Pendapatan */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 320px",
                    gap: "1rem",
                    marginBottom: "1rem",
                }}
            >
                <div className="card" style={{ padding: "1.25rem" }}>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "1.25rem",
                        }}
                    >
                        <span style={{ fontWeight: 700, fontSize: ".9rem" }}>
                            📈 Grafik Pendapatan
                        </span>
                        <div style={{ display: "flex", gap: ".35rem" }}>
                            {["minggu", "bulan"].map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPeriode(p)}
                                    style={{
                                        padding: "2px 10px",
                                        borderRadius: 999,
                                        fontSize: ".68rem",
                                        fontWeight: 700,
                                        cursor: "pointer",
                                        border: "1.5px solid",
                                        borderColor:
                                            periode === p
                                                ? "#3b82f6"
                                                : "#e5e7eb",
                                        background:
                                            periode === p ? "#3b82f6" : "#fff",
                                        color: periode === p ? "#fff" : "#555",
                                    }}
                                >
                                    {p === "minggu" ? "Mingguan" : "Bulanan"}
                                </button>
                            ))}
                        </div>
                    </div>
                    {/* Bar chart manual */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "flex-end",
                            gap: ".5rem",
                            height: 160,
                            padding: "0 .5rem",
                        }}
                    >
                        {data.map((d, i) => {
                            const persen = (d.pendapatan / maxPendapatan) * 100;
                            return (
                                <div
                                    key={i}
                                    style={{
                                        flex: 1,
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        gap: ".3rem",
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: ".58rem",
                                            color: "#888",
                                            fontWeight: 600,
                                            textAlign: "center",
                                        }}
                                    >
                                        {fmtHarga(d.pendapatan)
                                            .replace("Rp ", "")
                                            .replace(".000.000", "jt")
                                            .replace(".000", "rb")}
                                    </div>
                                    <div
                                        style={{
                                            width: "100%",
                                            background: "#3b82f6",
                                            borderRadius: "5px 5px 0 0",
                                            height: `${persen}%`,
                                            minHeight: 8,
                                            transition: "height .5s",
                                            cursor: "pointer",
                                            position: "relative",
                                        }}
                                        title={fmtHarga(d.pendapatan)}
                                    ></div>
                                    <div
                                        style={{
                                            fontSize: ".68rem",
                                            color: "#888",
                                            fontWeight: 600,
                                        }}
                                    >
                                        {d.hari || d.bln}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Penjualan per Brand */}
                <div className="card" style={{ padding: "1.25rem" }}>
                    <div
                        style={{
                            fontWeight: 700,
                            fontSize: ".9rem",
                            marginBottom: "1.25rem",
                        }}
                    >
                        🏷️ Penjualan per Brand
                    </div>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: ".85rem",
                        }}
                    >
                        {penjualanBrand.map((b, i) => (
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
                                            gap: ".5rem",
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: 8,
                                                height: 8,
                                                borderRadius: "50%",
                                                background: b.color,
                                            }}
                                        />
                                        <span
                                            style={{
                                                fontSize: ".8rem",
                                                fontWeight: 600,
                                            }}
                                        >
                                            {b.brand}
                                        </span>
                                    </div>
                                    <div
                                        style={{
                                            fontSize: ".75rem",
                                            color: "#888",
                                        }}
                                    >
                                        <strong>{b.terjual}</strong> pcs ·{" "}
                                        {b.persen}%
                                    </div>
                                </div>
                                <div
                                    style={{
                                        height: 8,
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
                                            transition: "width 1s",
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Donut simulasi */}
                    <div
                        style={{
                            marginTop: "1.25rem",
                            padding: "1rem",
                            background: "#f9fafb",
                            borderRadius: 8,
                            textAlign: "center",
                        }}
                    >
                        <div
                            style={{
                                fontSize: ".68rem",
                                color: "#888",
                                marginBottom: ".5rem",
                                fontWeight: 600,
                            }}
                        >
                            TOTAL TERJUAL
                        </div>
                        <div
                            style={{
                                fontSize: "2rem",
                                fontWeight: 800,
                                color: "#111",
                            }}
                        >
                            129{" "}
                            <span
                                style={{
                                    fontSize: ".9rem",
                                    color: "#888",
                                    fontWeight: 400,
                                }}
                            >
                                pcs
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabel Transaksi */}
            <div className="card">
                <div className="card-header">
                    <span style={{ fontWeight: 700, fontSize: ".9rem" }}>
                        📋 Riwayat Transaksi
                    </span>
                    <button className="btn btn-outline btn-sm">
                        Lihat Semua
                    </button>
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
                                    "Tanggal",
                                ].map((h) => (
                                    <th key={h}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {transaksiTerbaru.map((t, i) => (
                                <tr key={i}>
                                    <td
                                        style={{
                                            fontWeight: 700,
                                            color: "#3b82f6",
                                        }}
                                    >
                                        {t.id}
                                    </td>
                                    <td>{t.pembeli}</td>
                                    <td style={{ color: "#555" }}>
                                        {t.produk}
                                    </td>
                                    <td style={{ fontWeight: 700 }}>
                                        {fmtHarga(t.total)}
                                    </td>
                                    <td>
                                        <span
                                            className="badge"
                                            style={{
                                                background:
                                                    t.status === "Selesai"
                                                        ? "#dcfce7"
                                                        : t.status === "Dikirim"
                                                          ? "#e0f2fe"
                                                          : "#fef9c3",
                                                color:
                                                    t.status === "Selesai"
                                                        ? "#166534"
                                                        : t.status === "Dikirim"
                                                          ? "#0369a1"
                                                          : "#854d0e",
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
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
