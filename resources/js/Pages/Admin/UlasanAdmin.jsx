import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import AdminLayout from "./AdminLayout";

const imgSrc = (g) => {
    if (!g) return null;
    return g.startsWith("/") ? g : `/storage/${g}`;
};

export default function UlasanAdmin({
    admin,
    ulasan,
    totalUlasan,
    ratingRata,
    distribusi,
}) {
    const [search, setSearch] = useState("");
    const [filterBintang, setFilterBintang] = useState("Semua");
    const [hapusUlasan, setHapusUlasan] = useState(null);

    const filtered = (ulasan || []).filter((u) => {
        const matchSearch =
            u.nama.toLowerCase().includes(search.toLowerCase()) ||
            u.produk.toLowerCase().includes(search.toLowerCase());
        const matchBintang =
            filterBintang === "Semua" || u.rating === Number(filterBintang);
        return matchSearch && matchBintang;
    });

    const handleDelete = () => {
        if (!hapusUlasan) return;
        router.delete(`/admin/ulasan/${hapusUlasan.id}`, {
            onSuccess: () => setHapusUlasan(null),
            preserveScroll: true,
        });
    };

    const renderBintang = (rating) => (
        <span style={{ color: "#f59e0b", letterSpacing: "1px" }}>
            {"★".repeat(rating)}
            {"☆".repeat(5 - rating)}
        </span>
    );

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
        <AdminLayout active="Ulasan" admin={admin}>
            <Head title="Ulasan | Admin AMENG STORE" />

            <div style={{ marginBottom: "1.1rem" }}>
                <h1 style={{ fontSize: "1.1rem", fontWeight: 800 }}>
                    Ulasan Pembeli
                </h1>
                <p
                    style={{
                        fontSize: ".75rem",
                        color: "#888",
                        marginTop: "2px",
                    }}
                >
                    {totalUlasan} ulasan dari pembeli yang sudah berbelanja
                </p>
            </div>

            {/* Stat ringkasan */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "220px 1fr",
                    gap: "1rem",
                    marginBottom: "1.25rem",
                }}
            >
                {/* Rating rata-rata */}
                <div
                    style={{
                        background: "#fff",
                        borderRadius: 12,
                        border: "1px solid #e5e7eb",
                        padding: "1.5rem",
                        textAlign: "center",
                    }}
                >
                    <div
                        style={{
                            fontSize: "2.5rem",
                            fontWeight: 800,
                            color: "#111",
                        }}
                    >
                        {ratingRata}
                    </div>
                    <div
                        style={{
                            color: "#f59e0b",
                            fontSize: "1.1rem",
                            marginBottom: ".4rem",
                        }}
                    >
                        {renderBintang(Math.round(ratingRata))}
                    </div>
                    <div style={{ fontSize: ".75rem", color: "#888" }}>
                        dari {totalUlasan} ulasan
                    </div>
                </div>

                {/* Distribusi bintang */}
                <div
                    style={{
                        background: "#fff",
                        borderRadius: 12,
                        border: "1px solid #e5e7eb",
                        padding: "1.25rem",
                    }}
                >
                    <div
                        style={{
                            fontWeight: 700,
                            fontSize: ".85rem",
                            marginBottom: ".85rem",
                        }}
                    >
                        Distribusi Rating
                    </div>
                    {Object.entries(distribusi || {}).map(
                        ([bintang, jumlah]) => {
                            const persen =
                                totalUlasan > 0
                                    ? (jumlah / totalUlasan) * 100
                                    : 0;
                            return (
                                <div
                                    key={bintang}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: ".6rem",
                                        marginBottom: ".5rem",
                                    }}
                                >
                                    <span
                                        style={{
                                            fontSize: ".75rem",
                                            fontWeight: 600,
                                            width: 36,
                                            flexShrink: 0,
                                        }}
                                    >
                                        {bintang} ★
                                    </span>
                                    <div
                                        style={{
                                            flex: 1,
                                            height: 8,
                                            background: "#f0f0f0",
                                            borderRadius: 999,
                                            overflow: "hidden",
                                        }}
                                    >
                                        <div
                                            style={{
                                                height: "100%",
                                                width: `${persen}%`,
                                                background: "#f59e0b",
                                                borderRadius: 999,
                                            }}
                                        />
                                    </div>
                                    <span
                                        style={{
                                            fontSize: ".72rem",
                                            color: "#888",
                                            width: 30,
                                            textAlign: "right",
                                            flexShrink: 0,
                                        }}
                                    >
                                        {jumlah}
                                    </span>
                                </div>
                            );
                        },
                    )}
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <input
                        className="form-input"
                        style={{ maxWidth: 240, padding: ".45rem .85rem" }}
                        placeholder="🔍 Cari nama / produk..."
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
                        {["Semua", "5", "4", "3", "2", "1"].map((b) => (
                            <button
                                key={b}
                                onClick={() => setFilterBintang(b)}
                                style={{
                                    padding: "3px 10px",
                                    borderRadius: 999,
                                    fontSize: ".7rem",
                                    fontWeight: 700,
                                    cursor: "pointer",
                                    border: "1.5px solid",
                                    borderColor:
                                        filterBintang === b
                                            ? "#f59e0b"
                                            : "#e5e7eb",
                                    background:
                                        filterBintang === b
                                            ? "#f59e0b"
                                            : "#fff",
                                    color:
                                        filterBintang === b ? "#111" : "#555",
                                }}
                            >
                                {b === "Semua" ? "Semua" : `${b} ★`}
                            </button>
                        ))}
                    </div>
                </div>

                {filtered.length === 0 ? (
                    <div
                        style={{
                            textAlign: "center",
                            padding: "3rem 0",
                            color: "#aaa",
                        }}
                    >
                        Belum ada ulasan yang sesuai
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        {filtered.map((u, i) => (
                            <div
                                key={u.id}
                                style={{
                                    display: "flex",
                                    gap: "1rem",
                                    padding: "1.1rem 1.25rem",
                                    borderBottom:
                                        i < filtered.length - 1
                                            ? "1px solid #f9fafb"
                                            : "none",
                                }}
                            >
                                {imgSrc(u.gambar) ? (
                                    <img
                                        src={imgSrc(u.gambar)}
                                        alt={u.produk}
                                        style={{
                                            width: 52,
                                            height: 52,
                                            borderRadius: 9,
                                            objectFit: "cover",
                                            flexShrink: 0,
                                            background: "#f9fafb",
                                            border: "1px solid #f0f0f0",
                                        }}
                                        onError={(e) => {
                                            e.target.style.display = "none";
                                        }}
                                    />
                                ) : (
                                    <div
                                        style={{
                                            width: 52,
                                            height: 52,
                                            borderRadius: 9,
                                            background: "#f9fafb",
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

                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "flex-start",
                                            gap: ".5rem",
                                            flexWrap: "wrap",
                                        }}
                                    >
                                        <div>
                                            <span
                                                style={{
                                                    fontWeight: 700,
                                                    fontSize: ".85rem",
                                                }}
                                            >
                                                {u.nama}
                                            </span>
                                            <span
                                                style={{
                                                    fontSize: ".72rem",
                                                    color: "#aaa",
                                                    marginLeft: ".5rem",
                                                }}
                                            >
                                                · {u.email}
                                            </span>
                                        </div>
                                        <span
                                            style={{
                                                fontSize: ".72rem",
                                                color: "#888",
                                                flexShrink: 0,
                                            }}
                                        >
                                            {u.tanggal}
                                        </span>
                                    </div>

                                    <div style={{ margin: ".3rem 0" }}>
                                        {renderBintang(u.rating)}
                                    </div>

                                    <div
                                        style={{
                                            fontSize: ".78rem",
                                            color: "#555",
                                            fontWeight: 600,
                                            marginBottom: ".2rem",
                                        }}
                                    >
                                        {u.produk}{" "}
                                        <span
                                            style={{
                                                color: "#aaa",
                                                fontWeight: 400,
                                            }}
                                        >
                                            · {u.nomor_pesanan}
                                        </span>
                                    </div>

                                    {u.komentar ? (
                                        <p
                                            style={{
                                                fontSize: ".82rem",
                                                color: "#374151",
                                                lineHeight: 1.6,
                                                marginTop: ".4rem",
                                            }}
                                        >
                                            "{u.komentar}"
                                        </p>
                                    ) : (
                                        <p
                                            style={{
                                                fontSize: ".78rem",
                                                color: "#bbb",
                                                fontStyle: "italic",
                                                marginTop: ".4rem",
                                            }}
                                        >
                                            Tidak ada komentar tertulis
                                        </p>
                                    )}
                                </div>

                                <button
                                    onClick={() => setHapusUlasan(u)}
                                    style={{
                                        background: "#fee2e2",
                                        color: "#991b1b",
                                        border: "none",
                                        borderRadius: 6,
                                        padding: "4px 9px",
                                        fontSize: ".75rem",
                                        cursor: "pointer",
                                        fontWeight: 700,
                                        alignSelf: "flex-start",
                                        flexShrink: 0,
                                    }}
                                    title="Hapus ulasan"
                                >
                                    🗑
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div
                    style={{
                        padding: ".65rem 1.25rem",
                        borderTop: "1px solid #f0f0f0",
                        fontSize: ".72rem",
                        color: "#888",
                    }}
                >
                    Menampilkan {filtered.length} dari {totalUlasan} ulasan
                </div>
            </div>

            {/* Modal Hapus */}
            {hapusUlasan && (
                <div style={modalStyle} onClick={() => setHapusUlasan(null)}>
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
                            Hapus Ulasan?
                        </h2>
                        <p
                            style={{
                                fontSize: ".85rem",
                                color: "#888",
                                marginBottom: "1.5rem",
                            }}
                        >
                            Ulasan dari <strong>{hapusUlasan.nama}</strong>{" "}
                            untuk <strong>{hapusUlasan.produk}</strong> akan
                            dihapus permanen.
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
                                onClick={() => setHapusUlasan(null)}
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
