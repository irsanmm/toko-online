import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import AdminLayout from "./AdminLayout";

export default function PembeliAdmin({ admin, pembeli }) {
    const [search, setSearch] = useState("");
    const [detail, setDetail] = useState(null);
    const [hapusUser, setHapusUser] = useState(null);

    const fmtHarga = (n) => "Rp " + Number(n).toLocaleString("id-ID");

    const filtered = (pembeli || []).filter(
        (p) =>
            p.nama.toLowerCase().includes(search.toLowerCase()) ||
            p.email.toLowerCase().includes(search.toLowerCase()),
    );

    const handleDelete = () => {
        if (!hapusUser) return;
        router.delete(`/admin/pembeli/${hapusUser.id}`, {
            onSuccess: () => {
                setHapusUser(null);
                setDetail(null);
            },
            preserveScroll: true,
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
                        {(pembeli || []).length} pembeli terdaftar
                    </p>
                </div>
            </div>

            {/* Stat mini */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
                    gap: ".75rem",
                    marginBottom: "1.1rem",
                }}
            >
                {[
                    { label: "Total Pembeli", value: (pembeli || []).length },
                    {
                        label: "Pernah Belanja",
                        value: (pembeli || []).filter((p) => p.totalPesanan > 0)
                            .length,
                    },
                    {
                        label: "Total Transaksi",
                        value: (pembeli || []).reduce(
                            (s, p) => s + p.totalPesanan,
                            0,
                        ),
                    },
                    {
                        label: "Total Pendapatan",
                        value: fmtHarga(
                            (pembeli || []).reduce(
                                (s, p) => s + p.totalBelanja,
                                0,
                            ),
                        ),
                    },
                ].map((s, i) => (
                    <div
                        key={i}
                        style={{
                            background: "#fff",
                            borderRadius: 9,
                            border: "1px solid #e5e7eb",
                            padding: ".9rem 1rem",
                        }}
                    >
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
                ))}
            </div>

            <div className="card">
                <div className="card-header">
                    <input
                        className="form-input"
                        style={{ maxWidth: 260, padding: ".45rem .85rem" }}
                        placeholder="🔍 Cari nama / email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="tbl-wrap">
                    <table>
                        <thead>
                            <tr>
                                {[
                                    "#",
                                    "Nama",
                                    "Email",
                                    "Telepon",
                                    "Total Pesanan",
                                    "Total Belanja",
                                    "Bergabung",
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
                                    <td style={{ fontWeight: 600 }}>
                                        {p.nama}
                                    </td>
                                    <td
                                        style={{
                                            fontSize: ".78rem",
                                            color: "#555",
                                        }}
                                    >
                                        {p.email}
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
                                                className="btn btn-danger btn-sm"
                                                onClick={() => setHapusUser(p)}
                                            >
                                                🗑
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
                    Menampilkan {filtered.length} dari {(pembeli || []).length}{" "}
                    pembeli
                </div>
            </div>

            {/* Modal Detail */}
            {detail && (
                <div style={modalStyle} onClick={() => setDetail(null)}>
                    <div
                        style={{
                            background: "#fff",
                            borderRadius: 12,
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
                        <div
                            style={{
                                display: "grid",
                                gap: ".5rem",
                                marginBottom: "1.25rem",
                            }}
                        >
                            {[
                                ["Nama", detail.nama],
                                ["Email", detail.email],
                                ["Telepon", detail.telepon],
                                ["Alamat", detail.alamat],
                                [
                                    "Total Pesanan",
                                    detail.totalPesanan + " pesanan",
                                ],
                                [
                                    "Total Belanja",
                                    fmtHarga(detail.totalBelanja),
                                ],
                                ["Bergabung", detail.bergabung],
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
                        <div style={{ display: "flex", gap: ".6rem" }}>
                            <button
                                className="btn btn-danger"
                                style={{ flex: 1 }}
                                onClick={() => setHapusUser(detail)}
                            >
                                🗑 Hapus Pembeli
                            </button>
                            <button
                                className="btn btn-outline"
                                style={{ flex: 1 }}
                                onClick={() => setDetail(null)}
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Konfirmasi Hapus */}
            {hapusUser && (
                <div style={modalStyle} onClick={() => setHapusUser(null)}>
                    <div
                        style={{
                            background: "#fff",
                            borderRadius: 12,
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
                            Hapus Pembeli?
                        </h2>
                        <p
                            style={{
                                fontSize: ".85rem",
                                color: "#888",
                                marginBottom: "1.5rem",
                            }}
                        >
                            Akun <strong>{hapusUser.nama}</strong> beserta
                            seluruh riwayat pesanannya akan dihapus permanen.
                        </p>
                        <div
                            style={{
                                display: "flex",
                                gap: ".6rem",
                                justifyContent: "center",
                            }}
                        >
                            <button
                                className="btn btn-outline"
                                onClick={() => setHapusUser(null)}
                            >
                                Batal
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={handleDelete}
                            >
                                Ya, Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
