import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import AdminLayout from "./AdminLayout";
import ModalResi from "./ModalResi";

const statusStyle = {
    Pending: { bg: "#fef9c3", color: "#854d0e" },
    Diproses: { bg: "#dbeafe", color: "#1e40af" },
    Dikirim: { bg: "#e0f2fe", color: "#0369a1" },
    Selesai: { bg: "#dcfce7", color: "#166534" },
    Batal: { bg: "#fee2e2", color: "#991b1b" },
};

const imgSrc = (g) => {
    if (!g) return null;
    return g.startsWith("/") ? g : `/storage/${g}`;
};

export default function PesananAdmin({ admin, pesanan, kurirList }) {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("Semua");
    const [detail, setDetail] = useState(null);
    const [modalResi, setModalResi] = useState(null);
    const [loadingId, setLoadingId] = useState(null);
    const [hapusPesanan, setHapusPesanan] = useState(null);
    const [lihatBukti, setLihatBukti] = useState(null);

    const fmtHarga = (n) => "Rp " + Number(n).toLocaleString("id-ID");
    const statusList = [
        "Semua",
        "Pending",
        "Diproses",
        "Dikirim",
        "Selesai",
        "Batal",
    ];

    const filtered = pesanan.filter((p) => {
        const matchSearch =
            p.pembeli.toLowerCase().includes(search.toLowerCase()) ||
            p.id.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === "Semua" || p.status === filter;
        return matchSearch && matchFilter;
    });

    const handleUpdateStatus = (nomorPesanan, newStatus) => {
        setLoadingId(nomorPesanan);
        router.put(
            `/admin/pesanan/${nomorPesanan}`,
            { status: newStatus },
            {
                onFinish: () => setLoadingId(null),
                preserveScroll: true,
            },
        );
    };

    const handleDeletePesanan = () => {
        if (!hapusPesanan) return;
        router.delete(`/admin/pesanan/${hapusPesanan.id}`, {
            onSuccess: () => {
                setHapusPesanan(null);
                setDetail(null);
            },
            preserveScroll: true,
        });
    };

    const renderAksiUtama = (p) => {
        if (p.status === "Pending") {
            return (
                <button
                    onClick={() => handleUpdateStatus(p.id, "Diproses")}
                    disabled={loadingId === p.id}
                    className="btn btn-sm"
                    style={{
                        background: "#3b82f6",
                        color: "#fff",
                        border: "none",
                    }}
                >
                    {loadingId === p.id ? "⏳..." : "✅ Proses Sekarang"}
                </button>
            );
        }
        if (p.status === "Diproses") {
            return (
                <button
                    onClick={() => setModalResi(p)}
                    className="btn btn-sm"
                    style={{
                        background: "#0369a1",
                        color: "#fff",
                        border: "none",
                    }}
                >
                    🚚 Kirim Resi
                </button>
            );
        }
        if (p.status === "Dikirim") {
            return (
                <button
                    onClick={() => setModalResi(p)}
                    className="btn btn-sm"
                    style={{
                        background: "#fff",
                        color: "#0369a1",
                        border: "1.5px solid #0369a1",
                    }}
                >
                    ✏️ Edit Resi
                </button>
            );
        }
        return null;
    };

    const modalStyle = {
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 998,
        padding: "1rem",
    };

    return (
        <AdminLayout active="Pesanan" admin={admin}>
            <Head title="Pesanan | Admin AMENG STORE" />

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
                        Manajemen Pesanan
                    </h1>
                    <p
                        style={{
                            fontSize: ".75rem",
                            color: "#888",
                            marginTop: "2px",
                        }}
                    >
                        {pesanan.length} total pesanan
                    </p>
                </div>
                <button className="btn btn-success">📥 Export Excel</button>
            </div>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))",
                    gap: ".75rem",
                    marginBottom: "1.1rem",
                }}
            >
                {statusList
                    .filter((s) => s !== "Semua")
                    .map((s) => (
                        <div
                            key={s}
                            style={{
                                background: "#fff",
                                borderRadius: 9,
                                border: "1px solid #e5e7eb",
                                padding: ".85rem 1rem",
                                cursor: "pointer",
                                borderTop: `3px solid ${statusStyle[s]?.color || "#888"}`,
                                transition: "transform .15s",
                            }}
                            onClick={() => setFilter(s)}
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
                                    fontSize: ".68rem",
                                    color: "#888",
                                    marginBottom: ".2rem",
                                }}
                            >
                                {s}
                            </div>
                            <div
                                style={{
                                    fontSize: "1.4rem",
                                    fontWeight: 800,
                                    color: "#111",
                                }}
                            >
                                {pesanan.filter((p) => p.status === s).length}
                            </div>
                        </div>
                    ))}
            </div>

            <div className="card">
                <div className="card-header">
                    <input
                        className="form-input"
                        style={{ maxWidth: 230, padding: ".45rem .85rem" }}
                        placeholder="🔍 Cari pembeli / ID..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <div
                        style={{
                            display: "flex",
                            gap: ".35rem",
                            flexWrap: "wrap",
                        }}
                    >
                        {statusList.map((s) => (
                            <button
                                key={s}
                                onClick={() => setFilter(s)}
                                style={{
                                    padding: "3px 10px",
                                    borderRadius: 999,
                                    fontSize: ".68rem",
                                    fontWeight: 700,
                                    cursor: "pointer",
                                    border: "1.5px solid",
                                    borderColor:
                                        filter === s ? "#3b82f6" : "#e5e7eb",
                                    background:
                                        filter === s ? "#3b82f6" : "#fff",
                                    color: filter === s ? "#fff" : "#555",
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
                                    "Metode",
                                    "Bukti",
                                    "Tanggal",
                                    "Status",
                                    "Aksi",
                                ].map((h) => (
                                    <th key={h}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((p, i) => (
                                <tr
                                    key={i}
                                    style={{
                                        opacity: loadingId === p.id ? 0.6 : 1,
                                    }}
                                >
                                    <td
                                        style={{
                                            fontWeight: 700,
                                            color: "#3b82f6",
                                            cursor: "pointer",
                                        }}
                                        onClick={() => setDetail(p)}
                                    >
                                        {p.id}
                                    </td>
                                    <td>
                                        <div
                                            style={{
                                                fontWeight: 600,
                                                fontSize: ".8rem",
                                            }}
                                        >
                                            {p.pembeli}
                                        </div>
                                        <div
                                            style={{
                                                fontSize: ".68rem",
                                                color: "#aaa",
                                            }}
                                        >
                                            {p.email}
                                        </div>
                                    </td>
                                    <td
                                        style={{
                                            maxWidth: 140,
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {p.produk}
                                    </td>
                                    <td style={{ fontWeight: 700 }}>
                                        {fmtHarga(p.total)}
                                    </td>
                                    <td style={{ fontSize: ".75rem" }}>
                                        {p.metode}
                                    </td>
                                    <td>
                                        {p.metode === "cod" ? (
                                            <span
                                                style={{
                                                    fontSize: ".68rem",
                                                    color: "#aaa",
                                                }}
                                            >
                                                —
                                            </span>
                                        ) : p.bukti_transfer ? (
                                            <button
                                                onClick={() => setLihatBukti(p)}
                                                style={{
                                                    background: "#eff6ff",
                                                    color: "#1d4ed8",
                                                    border: "1px solid #bfdbfe",
                                                    borderRadius: 6,
                                                    padding: "3px 8px",
                                                    fontSize: ".68rem",
                                                    fontWeight: 700,
                                                    cursor: "pointer",
                                                }}
                                            >
                                                🖼 Lihat
                                            </button>
                                        ) : (
                                            <span
                                                style={{
                                                    fontSize: ".68rem",
                                                    color: "#dc2626",
                                                    fontWeight: 600,
                                                }}
                                            >
                                                Belum ada
                                            </span>
                                        )}
                                    </td>
                                    <td
                                        style={{
                                            fontSize: ".72rem",
                                            color: "#888",
                                        }}
                                    >
                                        {p.tanggal}
                                    </td>
                                    <td>
                                        <span
                                            className="badge"
                                            style={{
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
                                        {p.has_resi && (
                                            <div
                                                style={{
                                                    fontSize: ".62rem",
                                                    color: "#888",
                                                    marginTop: "2px",
                                                }}
                                            >
                                                {p.kurir?.toUpperCase()} ·{" "}
                                                {p.nomor_resi}
                                            </div>
                                        )}
                                    </td>
                                    <td>
                                        <div
                                            style={{
                                                display: "flex",
                                                gap: ".3rem",
                                                flexWrap: "wrap",
                                                alignItems: "center",
                                            }}
                                        >
                                            {renderAksiUtama(p)}
                                            <button
                                                className="btn btn-outline btn-sm"
                                                onClick={() => setDetail(p)}
                                            >
                                                Detail
                                            </button>
                                            <select
                                                value={p.status}
                                                onChange={(e) =>
                                                    handleUpdateStatus(
                                                        p.id,
                                                        e.target.value,
                                                    )
                                                }
                                                disabled={loadingId === p.id}
                                                title="Ubah status manual"
                                                style={{
                                                    padding: "3px 5px",
                                                    border: "1px solid #e5e7eb",
                                                    borderRadius: 6,
                                                    fontSize: ".68rem",
                                                    cursor: "pointer",
                                                    background: "#fff",
                                                    color: "#aaa",
                                                }}
                                            >
                                                {[
                                                    "Pending",
                                                    "Diproses",
                                                    "Dikirim",
                                                    "Selesai",
                                                    "Batal",
                                                ].map((s) => (
                                                    <option key={s} value={s}>
                                                        {s}
                                                    </option>
                                                ))}
                                            </select>
                                            <button
                                                className="btn btn-sm"
                                                style={{
                                                    background: "#fee2e2",
                                                    color: "#991b1b",
                                                    border: "none",
                                                }}
                                                onClick={() =>
                                                    setHapusPesanan(p)
                                                }
                                                title="Hapus pesanan"
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
                    Menampilkan {filtered.length} dari {pesanan.length} pesanan
                </div>
            </div>

            {/* Modal Detail Pesanan */}
            {detail && (
                <div style={modalStyle} onClick={() => setDetail(null)}>
                    <div
                        style={{
                            background: "#fff",
                            borderRadius: 12,
                            padding: "1.75rem",
                            width: "100%",
                            maxWidth: 500,
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
                                ["Pembeli", detail.pembeli],
                                ["Email", detail.email],
                                ["Produk", detail.produk],
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
                                            minWidth: 70,
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

                        {/* Bukti transfer di dalam detail */}
                        {detail.metode !== "cod" && (
                            <div style={{ marginBottom: "1.25rem" }}>
                                <div
                                    style={{
                                        fontSize: ".75rem",
                                        color: "#888",
                                        fontWeight: 600,
                                        marginBottom: ".5rem",
                                    }}
                                >
                                    Bukti Pembayaran
                                </div>
                                {detail.bukti_transfer ? (
                                    <img
                                        src={imgSrc(detail.bukti_transfer)}
                                        alt="Bukti Transfer"
                                        onClick={() => setLihatBukti(detail)}
                                        style={{
                                            width: "100%",
                                            maxHeight: 220,
                                            objectFit: "contain",
                                            borderRadius: 9,
                                            border: "1px solid #f0f0f0",
                                            background: "#f9fafb",
                                            cursor: "pointer",
                                        }}
                                    />
                                ) : (
                                    <div
                                        style={{
                                            padding: ".75rem",
                                            background: "#fee2e2",
                                            borderRadius: 9,
                                            fontSize: ".8rem",
                                            color: "#991b1b",
                                            textAlign: "center",
                                        }}
                                    >
                                        ⚠️ Bukti transfer belum diupload pembeli
                                    </div>
                                )}
                            </div>
                        )}

                        <div style={{ display: "flex", gap: ".6rem" }}>
                            {(detail.status === "Diproses" ||
                                detail.status === "Dikirim") && (
                                <button
                                    className="btn btn-primary"
                                    style={{ flex: 1 }}
                                    onClick={() => {
                                        setDetail(null);
                                        setModalResi(detail);
                                    }}
                                >
                                    🚚{" "}
                                    {detail.has_resi
                                        ? "Edit Resi"
                                        : "Kirim Resi"}
                                </button>
                            )}
                            <button
                                className="btn btn-danger"
                                style={{ flex: 1 }}
                                onClick={() => setHapusPesanan(detail)}
                            >
                                🗑 Hapus
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

            {/* Modal Lihat Bukti Transfer (fullscreen) */}
            {lihatBukti && (
                <div
                    style={{ ...modalStyle, zIndex: 1000 }}
                    onClick={() => setLihatBukti(null)}
                >
                    <div
                        style={{
                            background: "#fff",
                            borderRadius: 12,
                            padding: "1.25rem",
                            maxWidth: 520,
                            width: "100%",
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
                            <div>
                                <h3
                                    style={{
                                        fontWeight: 800,
                                        fontSize: ".95rem",
                                    }}
                                >
                                    Bukti Pembayaran
                                </h3>
                                <p
                                    style={{
                                        fontSize: ".72rem",
                                        color: "#888",
                                    }}
                                >
                                    {lihatBukti.id} · {lihatBukti.pembeli} ·{" "}
                                    {lihatBukti.metode}
                                </p>
                            </div>
                            <button
                                onClick={() => setLihatBukti(null)}
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
                        {lihatBukti.bukti_transfer ? (
                            <img
                                src={imgSrc(lihatBukti.bukti_transfer)}
                                alt="Bukti Transfer"
                                style={{
                                    width: "100%",
                                    borderRadius: 9,
                                    border: "1px solid #f0f0f0",
                                }}
                            />
                        ) : (
                            <p
                                style={{
                                    textAlign: "center",
                                    color: "#aaa",
                                    padding: "2rem",
                                }}
                            >
                                Tidak ada bukti
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Modal Konfirmasi Hapus */}
            {hapusPesanan && (
                <div style={modalStyle} onClick={() => setHapusPesanan(null)}>
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
                            Hapus Pesanan?
                        </h2>
                        <p
                            style={{
                                fontSize: ".85rem",
                                color: "#888",
                                marginBottom: "1.5rem",
                            }}
                        >
                            Pesanan <strong>{hapusPesanan.id}</strong> milik{" "}
                            <strong>{hapusPesanan.pembeli}</strong> akan dihapus
                            permanen.
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
                                onClick={() => setHapusPesanan(null)}
                            >
                                Batal
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={handleDeletePesanan}
                            >
                                Ya, Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Input/Edit Resi */}
            {modalResi && (
                <ModalResi
                    pesanan={modalResi}
                    kurirList={kurirList}
                    onClose={() => setModalResi(null)}
                />
            )}
        </AdminLayout>
    );
}
