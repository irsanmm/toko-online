import { Head } from "@inertiajs/react";
import { useState } from "react";
import AdminLayout from "./AdminLayout";

const pembeliData = [
    {
        id: 1,
        nama: "Budi Santoso",
        email: "budi@gmail.com",
        telepon: "0812-3456-7890",
        alamat: "Jl. Merdeka No.10, Tasikmalaya",
        totalPesanan: 5,
        totalBelanja: 4500000,
        bergabung: "10 Jan 2025",
        status: "Aktif",
    },
    {
        id: 2,
        nama: "Siti Rahayu",
        email: "siti@gmail.com",
        telepon: "0898-7654-3210",
        alamat: "Jl. Sudirman No.5, Bandung",
        totalPesanan: 3,
        totalBelanja: 2850000,
        bergabung: "15 Feb 2025",
        status: "Aktif",
    },
    {
        id: 3,
        nama: "Ahmad Fauzi",
        email: "ahmad@gmail.com",
        telepon: "0856-1234-5678",
        alamat: "Jl. Gatot Subroto No.3, Jakarta",
        totalPesanan: 7,
        totalBelanja: 8750000,
        bergabung: "3 Mar 2025",
        status: "Aktif",
    },
    {
        id: 4,
        nama: "Dewi Lestari",
        email: "dewi@gmail.com",
        telepon: "0877-8765-4321",
        alamat: "Jl. Pahlawan No.8, Surabaya",
        totalPesanan: 2,
        totalBelanja: 1500000,
        bergabung: "20 Mar 2025",
        status: "Aktif",
    },
    {
        id: 5,
        nama: "Rizki Pratama",
        email: "rizki@gmail.com",
        telepon: "0821-9876-5432",
        alamat: "Jl. Diponegoro No.2, Yogyakarta",
        totalPesanan: 4,
        totalBelanja: 3600000,
        bergabung: "1 Apr 2025",
        status: "Aktif",
    },
    {
        id: 6,
        nama: "Maya Sari",
        email: "maya@gmail.com",
        telepon: "0895-5432-1098",
        alamat: "Jl. Ahmad Yani No.15, Semarang",
        totalPesanan: 1,
        totalBelanja: 1450000,
        bergabung: "5 Apr 2025",
        status: "Nonaktif",
    },
];

export default function PembeliAdmin({ admin }) {
    const [pembeli, setPembeli] = useState(pembeliData);
    const [search, setSearch] = useState("");
    const [detail, setDetail] = useState(null);
    const [filter, setFilter] = useState("Semua");

    const fmtHarga = (n) => "Rp " + Number(n).toLocaleString("id-ID");

    const filtered = pembeli.filter((p) => {
        const matchSearch =
            p.nama.toLowerCase().includes(search.toLowerCase()) ||
            p.email.includes(search);
        const matchFilter = filter === "Semua" || p.status === filter;
        return matchSearch && matchFilter;
    });

    const toggleStatus = (id) => {
        setPembeli((prev) =>
            prev.map((p) =>
                p.id === id
                    ? {
                          ...p,
                          status: p.status === "Aktif" ? "Nonaktif" : "Aktif",
                      }
                    : p,
            ),
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

    // Avatar warna acak berdasarkan nama
    const avatarColor = (nama) => {
        const colors = [
            "#3b82f6",
            "#22c55e",
            "#f59e0b",
            "#8b5cf6",
            "#ec4899",
            "#ef4444",
        ];
        return colors[nama.charCodeAt(0) % colors.length];
    };

    return (
        <AdminLayout active="Pembeli" admin={admin}>
            <Head title="Pembeli | Admin AMENG STORE" />

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
                        Data Pembeli
                    </h1>
                    <p
                        style={{
                            fontSize: ".75rem",
                            color: "#888",
                            marginTop: "2px",
                        }}
                    >
                        {pembeli.length} pembeli terdaftar
                    </p>
                </div>
                <button className="btn btn-success">📥 Export</button>
            </div>

            {/* Stat mini */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))",
                    gap: ".75rem",
                    marginBottom: "1.1rem",
                }}
            >
                {[
                    { label: "Total Pembeli", value: pembeli.length },
                    {
                        label: "Aktif",
                        value: pembeli.filter((p) => p.status === "Aktif")
                            .length,
                    },
                    {
                        label: "Nonaktif",
                        value: pembeli.filter((p) => p.status === "Nonaktif")
                            .length,
                    },
                    {
                        label: "Total Transaksi",
                        value: fmtHarga(
                            pembeli.reduce((s, p) => s + p.totalBelanja, 0),
                        ),
                    },
                ].map((s, i) => (
                    <div
                        key={i}
                        style={{
                            background: "#fff",
                            borderRadius: 9,
                            border: "1px solid #e5e7eb",
                            padding: ".85rem 1rem",
                        }}
                    >
                        <div
                            style={{
                                fontSize: ".68rem",
                                color: "#888",
                                marginBottom: ".2rem",
                            }}
                        >
                            {s.label}
                        </div>
                        <div
                            style={{
                                fontSize: i === 3 ? "1rem" : "1.4rem",
                                fontWeight: 800,
                                color: "#111",
                            }}
                        >
                            {s.value}
                        </div>
                    </div>
                ))}
            </div>

            <div className="card">
                <div className="card-header">
                    <input
                        className="form-input"
                        style={{ maxWidth: 220, padding: ".45rem .85rem" }}
                        placeholder="🔍 Cari nama / email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <div style={{ display: "flex", gap: ".35rem" }}>
                        {["Semua", "Aktif", "Nonaktif"].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                style={{
                                    padding: "3px 10px",
                                    borderRadius: 999,
                                    fontSize: ".68rem",
                                    fontWeight: 700,
                                    cursor: "pointer",
                                    border: "1.5px solid",
                                    borderColor:
                                        filter === f ? "#3b82f6" : "#e5e7eb",
                                    background:
                                        filter === f ? "#3b82f6" : "#fff",
                                    color: filter === f ? "#fff" : "#555",
                                }}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="tbl-wrap">
                    <table>
                        <thead>
                            <tr>
                                {[
                                    "#",
                                    "Pembeli",
                                    "Telepon",
                                    "Pesanan",
                                    "Total Belanja",
                                    "Bergabung",
                                    "Status",
                                    "Aksi",
                                ].map((h) => (
                                    <th key={h}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((p, i) => (
                                <tr key={p.id}>
                                    <td
                                        style={{
                                            color: "#aaa",
                                            fontSize: ".7rem",
                                        }}
                                    >
                                        {i + 1}
                                    </td>
                                    <td>
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: ".6rem",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: 32,
                                                    height: 32,
                                                    borderRadius: "50%",
                                                    background: avatarColor(
                                                        p.nama,
                                                    ),
                                                    color: "#fff",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    fontWeight: 800,
                                                    fontSize: ".78rem",
                                                    flexShrink: 0,
                                                }}
                                            >
                                                {p.nama.charAt(0)}
                                            </div>
                                            <div>
                                                <div
                                                    style={{
                                                        fontWeight: 600,
                                                        fontSize: ".8rem",
                                                    }}
                                                >
                                                    {p.nama}
                                                </div>
                                                <div
                                                    style={{
                                                        fontSize: ".68rem",
                                                        color: "#aaa",
                                                    }}
                                                >
                                                    {p.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ fontSize: ".78rem" }}>
                                        {p.telepon}
                                    </td>
                                    <td
                                        style={{
                                            fontWeight: 700,
                                            textAlign: "center",
                                        }}
                                    >
                                        {p.totalPesanan}
                                    </td>
                                    <td style={{ fontWeight: 700 }}>
                                        {fmtHarga(p.totalBelanja)}
                                    </td>
                                    <td
                                        style={{
                                            fontSize: ".72rem",
                                            color: "#888",
                                        }}
                                    >
                                        {p.bergabung}
                                    </td>
                                    <td>
                                        <span
                                            className="badge"
                                            style={{
                                                background:
                                                    p.status === "Aktif"
                                                        ? "#dcfce7"
                                                        : "#f3f4f6",
                                                color:
                                                    p.status === "Aktif"
                                                        ? "#166534"
                                                        : "#888",
                                            }}
                                        >
                                            {p.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div
                                            style={{
                                                display: "flex",
                                                gap: ".3rem",
                                            }}
                                        >
                                            <button
                                                className="btn btn-outline btn-sm"
                                                onClick={() => setDetail(p)}
                                            >
                                                Detail
                                            </button>
                                            <button
                                                className="btn btn-sm"
                                                style={{
                                                    background:
                                                        p.status === "Aktif"
                                                            ? "#fee2e2"
                                                            : "#dcfce7",
                                                    color:
                                                        p.status === "Aktif"
                                                            ? "#991b1b"
                                                            : "#166534",
                                                    border: "none",
                                                }}
                                                onClick={() =>
                                                    toggleStatus(p.id)
                                                }
                                            >
                                                {p.status === "Aktif"
                                                    ? "Nonaktifkan"
                                                    : "Aktifkan"}
                                            </button>
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
                        fontSize: ".72rem",
                        color: "#888",
                    }}
                >
                    Menampilkan {filtered.length} dari {pembeli.length} pembeli
                </div>
            </div>

            {/* Modal Detail Pembeli */}
            {detail && (
                <div style={modalStyle} onClick={() => setDetail(null)}>
                    <div
                        style={{
                            background: "#fff",
                            borderRadius: 12,
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
                                Detail Pembeli
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
                        {/* Avatar */}
                        <div
                            style={{
                                textAlign: "center",
                                marginBottom: "1.25rem",
                            }}
                        >
                            <div
                                style={{
                                    width: 60,
                                    height: 60,
                                    borderRadius: "50%",
                                    background: avatarColor(detail.nama),
                                    color: "#fff",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: 800,
                                    fontSize: "1.4rem",
                                    margin: "0 auto .5rem",
                                }}
                            >
                                {detail.nama.charAt(0)}
                            </div>
                            <div style={{ fontWeight: 800, fontSize: "1rem" }}>
                                {detail.nama}
                            </div>
                            <div style={{ fontSize: ".78rem", color: "#888" }}>
                                {detail.email}
                            </div>
                        </div>
                        <div
                            style={{
                                display: "grid",
                                gap: ".5rem",
                                marginBottom: "1.25rem",
                            }}
                        >
                            {[
                                ["Telepon", detail.telepon],
                                ["Alamat", detail.alamat],
                                ["Bergabung", detail.bergabung],
                                [
                                    "Total Pesanan",
                                    detail.totalPesanan + " pesanan",
                                ],
                                [
                                    "Total Belanja",
                                    fmtHarga(detail.totalBelanja),
                                ],
                                ["Status", detail.status],
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
                                            minWidth: 90,
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
                            className="btn btn-primary"
                            style={{ width: "100%" }}
                            onClick={() => setDetail(null)}
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
