import { Head, router, useForm } from "@inertiajs/react";
import { useState } from "react";
import AdminLayout from "./AdminLayout";

// Helper untuk path gambar — support gambar upload baru (/storage/...) dan path lama (/assets/...)
const imgSrc = (g) => {
    if (!g) return null;
    return g.startsWith("/") ? g : `/storage/${g}`;
};

export default function ProdukAdmin({ admin, products }) {
    const [search, setSearch] = useState("");
    const [filterBrand, setFilterBrand] = useState("Semua");
    const [showModal, setShowModal] = useState(false);
    const [editData, setEditData] = useState(null);
    const [showDelete, setShowDelete] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const { data, setData, processing, errors, reset } = useForm({
        nama: "",
        brand: "VANS",
        deskripsi: "",
        harga: "",
        stok: "",
        ukuran: [],
        status: "aktif",
        gambar: null,
    });

    const brands = ["Semua", "VANS", "NIKE", "ADIDAS", "CONVERSE"];
    const fmtHarga = (n) => "Rp " + Number(n).toLocaleString("id-ID");

    const filtered = (products || []).filter((p) => {
        const matchSearch = p.nama.toLowerCase().includes(search.toLowerCase());
        const matchBrand = filterBrand === "Semua" || p.brand === filterBrand;
        return matchSearch && matchBrand;
    });

    const openAdd = () => {
        setEditData(null);
        setPreviewUrl(null);
        reset();
        setShowModal(true);
    };

    const openEdit = (p) => {
        setEditData(p);
        setPreviewUrl(null); // tampilkan gambar lama dari produk, bukan preview baru
        setData({
            nama: p.nama,
            brand: p.brand,
            deskripsi: p.deskripsi || "",
            harga: p.harga,
            stok: p.stok,
            ukuran: Array.isArray(p.ukuran) ? p.ukuran : [],
            status: p.status,
            gambar: null, // gambar dikosongkan, hanya diisi kalau upload baru
        });
        setShowModal(true);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("gambar", file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSave = (e) => {
        e.preventDefault();
        if (editData) {
            router.put(`/admin/produk/${editData.id}`, data, {
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                    setPreviewUrl(null);
                },
                preserveScroll: true,
            });
        } else {
            router.post("/admin/produk", data, {
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                    setPreviewUrl(null);
                },
                preserveScroll: true,
            });
        }
    };

    const handleDelete = () => {
        router.delete(`/admin/produk/${showDelete.id}`, {
            onSuccess: () => setShowDelete(null),
            preserveScroll: true,
        });
    };

    const toggleUkuran = (uk) => {
        const arr = Array.isArray(data.ukuran) ? data.ukuran : [];
        setData(
            "ukuran",
            arr.includes(uk)
                ? arr.filter((u) => u !== uk)
                : [...arr, uk].sort((a, b) => Number(a) - Number(b)),
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

    // Gambar yang ditampilkan di preview modal: baru dipilih > gambar lama produk > kosong
    const displayPreview =
        previewUrl || (editData ? imgSrc(editData.gambar) : null);

    return (
        <AdminLayout active="Produk" admin={admin}>
            <Head title="Produk | Admin AMENG STORE" />

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
                        Manajemen Produk
                    </h1>
                    <p
                        style={{
                            fontSize: ".75rem",
                            color: "#888",
                            marginTop: "2px",
                        }}
                    >
                        {(products || []).length} produk terdaftar
                    </p>
                </div>
                <button className="btn btn-primary" onClick={openAdd}>
                    + Tambah Produk
                </button>
            </div>

            {/* Stat mini */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
                    gap: ".75rem",
                    marginBottom: "1.1rem",
                }}
            >
                {[
                    {
                        label: "Total Produk",
                        value: (products || []).length,
                        color: "#dbeafe",
                        text: "#1d4ed8",
                    },
                    {
                        label: "Produk Aktif",
                        value: (products || []).filter(
                            (p) => p.status === "aktif",
                        ).length,
                        color: "#dcfce7",
                        text: "#166534",
                    },
                    {
                        label: "Stok Menipis",
                        value: (products || []).filter(
                            (p) => p.stok > 0 && p.stok < 8,
                        ).length,
                        color: "#fef9c3",
                        text: "#854d0e",
                    },
                    {
                        label: "Stok Habis",
                        value: (products || []).filter((p) => p.stok === 0)
                            .length,
                        color: "#fee2e2",
                        text: "#991b1b",
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
                                fontSize: "1.4rem",
                                fontWeight: 800,
                                color: "#111",
                            }}
                        >
                            {s.value}
                        </div>
                    </div>
                ))}
            </div>

            {/* Tabel */}
            <div className="card">
                <div className="card-header">
                    <input
                        className="form-input"
                        style={{ maxWidth: 220, padding: ".45rem .85rem" }}
                        placeholder="🔍 Cari produk..."
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
                        {brands.map((b) => (
                            <button
                                key={b}
                                onClick={() => setFilterBrand(b)}
                                style={{
                                    padding: "3px 10px",
                                    borderRadius: 999,
                                    fontSize: ".7rem",
                                    fontWeight: 700,
                                    cursor: "pointer",
                                    border: "1.5px solid",
                                    borderColor:
                                        filterBrand === b
                                            ? "#3b82f6"
                                            : "#e5e7eb",
                                    background:
                                        filterBrand === b ? "#3b82f6" : "#fff",
                                    color: filterBrand === b ? "#fff" : "#555",
                                }}
                            >
                                {b}
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
                                    "Produk",
                                    "Brand",
                                    "Harga",
                                    "Stok",
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
                                                gap: ".65rem",
                                            }}
                                        >
                                            {imgSrc(p.gambar) ? (
                                                <img
                                                    src={imgSrc(p.gambar)}
                                                    alt={p.nama}
                                                    style={{
                                                        width: 38,
                                                        height: 38,
                                                        objectFit: "cover",
                                                        borderRadius: 7,
                                                        background: "#f9fafb",
                                                        border: "1px solid #f0f0f0",
                                                        flexShrink: 0,
                                                    }}
                                                    onError={(e) => {
                                                        e.target.style.display =
                                                            "none";
                                                    }}
                                                />
                                            ) : (
                                                <div
                                                    style={{
                                                        width: 38,
                                                        height: 38,
                                                        borderRadius: 7,
                                                        background: "#f9fafb",
                                                        border: "1px solid #f0f0f0",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent:
                                                            "center",
                                                        fontSize: "1.25rem",
                                                        flexShrink: 0,
                                                    }}
                                                >
                                                    👟
                                                </div>
                                            )}
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
                                                    Ukuran:{" "}
                                                    {Array.isArray(p.ukuran)
                                                        ? p.ukuran.join(", ")
                                                        : "-"}
                                                </div>
                                            </div>
                                        </div>
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
                                        {fmtHarga(p.harga)}
                                    </td>
                                    <td>
                                        <span
                                            style={{
                                                fontWeight: 700,
                                                color:
                                                    p.stok === 0
                                                        ? "#ef4444"
                                                        : p.stok < 8
                                                          ? "#f59e0b"
                                                          : "#22c55e",
                                            }}
                                        >
                                            {p.stok} pcs
                                        </span>
                                    </td>
                                    <td>
                                        <span
                                            className="badge"
                                            style={{
                                                background:
                                                    p.status === "aktif"
                                                        ? "#dcfce7"
                                                        : "#f3f4f6",
                                                color:
                                                    p.status === "aktif"
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
                                                className="btn btn-warning btn-sm"
                                                onClick={() => openEdit(p)}
                                            >
                                                ✏️ Edit
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => setShowDelete(p)}
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
                    Menampilkan {filtered.length} dari {(products || []).length}{" "}
                    produk
                </div>
            </div>

            {/* Modal Tambah/Edit */}
            {showModal && (
                <div style={modalStyle} onClick={() => setShowModal(false)}>
                    <div
                        style={{
                            background: "#fff",
                            borderRadius: 12,
                            padding: "1.75rem",
                            width: "100%",
                            maxWidth: 520,
                            boxShadow: "0 20px 60px rgba(0,0,0,.15)",
                            maxHeight: "90vh",
                            overflowY: "auto",
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
                                {editData
                                    ? "Edit Produk"
                                    : "Tambah Produk Baru"}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
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
                        <form onSubmit={handleSave}>
                            {/* ===== UPLOAD GAMBAR ===== */}
                            <div className="form-group">
                                <label className="form-label">
                                    Foto Produk
                                </label>
                                <div
                                    style={{
                                        display: "flex",
                                        gap: "1rem",
                                        alignItems: "center",
                                    }}
                                >
                                    {/* Preview */}
                                    <div
                                        style={{
                                            width: 90,
                                            height: 90,
                                            borderRadius: 10,
                                            background: "#f9fafb",
                                            border: "1.5px dashed #e5e7eb",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            overflow: "hidden",
                                            flexShrink: 0,
                                        }}
                                    >
                                        {displayPreview ? (
                                            <img
                                                src={displayPreview}
                                                alt="Preview"
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    objectFit: "cover",
                                                }}
                                            />
                                        ) : (
                                            <span
                                                style={{
                                                    fontSize: "1.75rem",
                                                    color: "#ccc",
                                                }}
                                            >
                                                👟
                                            </span>
                                        )}
                                    </div>
                                    {/* Tombol pilih file */}
                                    <div style={{ flex: 1 }}>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            style={{
                                                width: "100%",
                                                padding: ".5rem",
                                                border: "1.5px solid #e5e7eb",
                                                borderRadius: 8,
                                                fontSize: ".8rem",
                                                background: "#fff",
                                            }}
                                        />
                                        <p
                                            style={{
                                                fontSize: ".7rem",
                                                color: "#aaa",
                                                marginTop: ".4rem",
                                            }}
                                        >
                                            Format JPG/PNG, maksimal 2MB.{" "}
                                            {editData &&
                                                "Biarkan kosong jika tidak ingin mengubah foto."}
                                        </p>
                                        {errors.gambar && (
                                            <p
                                                style={{
                                                    color: "#dc2626",
                                                    fontSize: ".75rem",
                                                    marginTop: ".25rem",
                                                }}
                                            >
                                                {errors.gambar}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Nama Produk *
                                </label>
                                <input
                                    className="form-input"
                                    value={data.nama}
                                    onChange={(e) =>
                                        setData("nama", e.target.value)
                                    }
                                    placeholder="Nama produk"
                                    required
                                />
                                {errors.nama && (
                                    <p
                                        style={{
                                            color: "#dc2626",
                                            fontSize: ".75rem",
                                            marginTop: ".25rem",
                                        }}
                                    >
                                        {errors.nama}
                                    </p>
                                )}
                            </div>
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 1fr",
                                    gap: ".75rem",
                                }}
                            >
                                <div className="form-group">
                                    <label className="form-label">
                                        Brand *
                                    </label>
                                    <select
                                        className="form-input"
                                        value={data.brand}
                                        onChange={(e) =>
                                            setData("brand", e.target.value)
                                        }
                                    >
                                        {[
                                            "VANS",
                                            "NIKE",
                                            "ADIDAS",
                                            "CONVERSE",
                                        ].map((b) => (
                                            <option key={b}>{b}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Status</label>
                                    <select
                                        className="form-input"
                                        value={data.status}
                                        onChange={(e) =>
                                            setData("status", e.target.value)
                                        }
                                    >
                                        <option value="aktif">Aktif</option>
                                        <option value="nonaktif">
                                            Nonaktif
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 1fr",
                                    gap: ".75rem",
                                }}
                            >
                                <div className="form-group">
                                    <label className="form-label">
                                        Harga (Rp) *
                                    </label>
                                    <input
                                        className="form-input"
                                        type="number"
                                        value={data.harga}
                                        onChange={(e) =>
                                            setData("harga", e.target.value)
                                        }
                                        placeholder="899000"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Stok *</label>
                                    <input
                                        className="form-input"
                                        type="number"
                                        value={data.stok}
                                        onChange={(e) =>
                                            setData("stok", e.target.value)
                                        }
                                        placeholder="10"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Deskripsi</label>
                                <textarea
                                    className="form-input"
                                    rows={2}
                                    value={data.deskripsi}
                                    onChange={(e) =>
                                        setData("deskripsi", e.target.value)
                                    }
                                    placeholder="Deskripsi produk"
                                    style={{ resize: "vertical" }}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">
                                    Ukuran (EU)
                                </label>
                                <div
                                    style={{
                                        display: "flex",
                                        gap: ".35rem",
                                        flexWrap: "wrap",
                                        marginTop: ".25rem",
                                    }}
                                >
                                    {[
                                        "37",
                                        "38",
                                        "39",
                                        "40",
                                        "41",
                                        "42",
                                        "43",
                                        "44",
                                        "45",
                                    ].map((uk) => (
                                        <button
                                            key={uk}
                                            type="button"
                                            onClick={() => toggleUkuran(uk)}
                                            style={{
                                                width: 36,
                                                height: 36,
                                                borderRadius: 7,
                                                border: `1.5px solid ${(data.ukuran || []).includes(uk) ? "#3b82f6" : "#e5e7eb"}`,
                                                background: (
                                                    data.ukuran || []
                                                ).includes(uk)
                                                    ? "#3b82f6"
                                                    : "#fff",
                                                color: (
                                                    data.ukuran || []
                                                ).includes(uk)
                                                    ? "#fff"
                                                    : "#374151",
                                                fontSize: ".75rem",
                                                fontWeight: 700,
                                                cursor: "pointer",
                                            }}
                                        >
                                            {uk}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    gap: ".6rem",
                                    justifyContent: "flex-end",
                                    marginTop: ".5rem",
                                }}
                            >
                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    onClick={() => setShowModal(false)}
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={processing}
                                >
                                    {processing
                                        ? "Menyimpan..."
                                        : editData
                                          ? "Simpan Perubahan"
                                          : "Tambah Produk"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Hapus */}
            {showDelete && (
                <div style={modalStyle} onClick={() => setShowDelete(null)}>
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
                            Hapus Produk?
                        </h2>
                        <p
                            style={{
                                fontSize: ".85rem",
                                color: "#888",
                                marginBottom: "1.5rem",
                            }}
                        >
                            Produk <strong>{showDelete.nama}</strong> akan
                            dihapus permanen beserta fotonya.
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
                                onClick={() => setShowDelete(null)}
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
