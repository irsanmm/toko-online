import { Head, useForm, router } from "@inertiajs/react";
import { useState, useRef, useEffect } from "react";
import AdminLayout from "./AdminLayout";

const BRANDS = ["Semua", "VANS", "NIKE", "ADIDAS", "CONVERSE"];
const fmtHarga = (n) => "Rp " + Number(n).toLocaleString("id-ID");

const emptyForm = {
    nama: "",
    brand: "VANS",
    harga: "",
    stok: "",
    status: "aktif",
    ukuran: "",
    deskripsi: "",
    is_featured: false,
    gambar: null, // Add gambar to emptyForm for file handling
};

/* ── Komponen thumbnail tabel ── */
function ThumbnailProduk({ gambar, nama }) {
    const [imgError, setImgError] = useState(false);

    return (
        <div
            style={{
                width: 38,
                height: 38,
                borderRadius: 7,
                background: "#f9fafb",
                border: "1px solid #f0f0f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.25rem",
                flexShrink: 0,
                overflow: "hidden",
            }}
        >
            {gambar && !imgError ? (
                <img
                    src={gambar}
                    alt={nama}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                    }}
                    onError={() => setImgError(true)}
                />
            ) : (
                "👟"
            )}
        </div>
    );
}

export default function ProdukAdmin({ admin, products: produk }) {
    const [search, setSearch] = useState("");
    const [filterBrand, setFilterBrand] = useState("Semua");
    const [showModal, setShowModal] = useState(false);
    const [editData, setEditData] = useState(null);
    const [showDelete, setShowDelete] = useState(null);
    const [fotoPreview, setFotoPreview] = useState("");
    const fileInputRef = useRef(null);

    const {
        data: form,
        setData: setForm,
        post,
        put,
        processing,
        errors,
        reset,
    } = useForm(emptyForm);

    // Effect to update fotoPreview when form.gambar changes (for existing images)
    useEffect(() => {
        if (form.gambar && typeof form.gambar === "string") {
            setFotoPreview(form.gambar);
        } else if (form.gambar instanceof File) {
            const reader = new FileReader();
            reader.onload = (ev) => setFotoPreview(ev.target.result);
            reader.readAsDataURL(form.gambar);
        } else {
            setFotoPreview("");
        }
    }, [form.gambar]);

    const filtered = produk.filter((p) => {
        const matchSearch = p.nama.toLowerCase().includes(search.toLowerCase());
        const matchBrand = filterBrand === "Semua" || p.brand === filterBrand;
        return matchSearch && matchBrand;
    });

    const openAdd = () => {
        setEditData(null);
        reset(emptyForm); // Use reset from useForm
        setFotoPreview("");
        setShowModal(true);
    };

    const openEdit = (p) => {
        setEditData(p);
        setForm({
            nama: p.nama,
            brand: p.brand,
            harga: p.harga,
            stok: p.stok,
            status: p.status,
            ukuran: Array.isArray(p.ukuran)
                ? p.ukuran.join(",")
                : p.ukuran || "",
            deskripsi: p.deskripsi || "",
            is_featured: !!p.is_featured,
            gambar: p.gambar, // Set existing image path
        });
        setShowModal(true);
    };

    const handleFotoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setForm("gambar", file); // Set the File object directly to form.gambar
    };

    const handleSave = () => {
        if (form.nama.trim() === "" || form.harga === "" || form.stok === "") {
            alert("Isi semua field yang wajib diisi!");
            return;
        }

        if (editData) {
            // Untuk edit: gunakan router.post dengan _method spoofing
            // JANGAN pakai transform, langsung bangun FormData manual
            const fd = new FormData();
            fd.append("_method", "PUT");
            fd.append("nama", form.nama);
            fd.append("brand", form.brand);
            fd.append("harga", form.harga);
            fd.append("stok", form.stok);
            fd.append("status", form.status);
            fd.append("ukuran", form.ukuran);
            fd.append("deskripsi", form.deskripsi);
            fd.append("is_featured", form.is_featured ? "1" : "0");
            if (form.gambar instanceof File) {
                fd.append("gambar", form.gambar);
            }

            router.post(`/admin/produk/${editData.id}`, fd, {
                onSuccess: () => {
                    setShowModal(false);
                    reset(emptyForm);
                    setFotoPreview("");
                },
                onError: (err) => console.error("Update Error:", err),
            });
        } else {
            post("/admin/produk", {
                forceFormData: true,
                onSuccess: () => {
                    setShowModal(false);
                    reset(emptyForm);
                    setFotoPreview("");
                },
                onError: (err) => console.error("Error adding product:", err),
            });
        }
    };

    const handleDelete = (id) => {
        router.delete(`/admin/produk/${id}`, {
            onSuccess: () => setShowDelete(null),
        });
    };

    const modalOverlay = {
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999,
        padding: "1rem",
    };

    const inputStyle = {
        width: "100%",
        border: "1.5px solid #e5e7eb",
        borderRadius: 8,
        padding: ".55rem .85rem",
        fontSize: ".85rem",
        outline: "none",
        fontFamily: "inherit",
        transition: "border-color .2s",
        background: "#fafafa",
    };

    const labelStyle = {
        display: "block",
        fontSize: ".76rem",
        fontWeight: 700,
        color: "#444",
        marginBottom: ".3rem",
    };

    return (
        <AdminLayout active="Produk" admin={admin}>
            <Head title="Produk | Admin AMENG STORE" />

            {/* ── Header ── */}
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
                            marginTop: 2,
                        }}
                    >
                        {produk.length} produk terdaftar
                    </p>
                </div>
                <button className="btn btn-primary" onClick={openAdd}>
                    + Tambah Produk
                </button>
            </div>

            {/* ── Stat Cards ── */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
                    gap: ".75rem",
                    marginBottom: "1.1rem",
                }}
            >
                {[
                    { label: "Total Produk", value: produk.length },
                    {
                        label: "Produk Aktif",
                        value: produk.filter((p) => p.status === "aktif")
                            .length,
                    },
                    {
                        label: "Stok Menipis",
                        value: produk.filter((p) => p.stok > 0 && p.stok < 8)
                            .length,
                    },
                    {
                        label: "Stok Habis",
                        value: produk.filter((p) => p.stok === 0).length,
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

            {/* ── Table ── */}
            <div className="card">
                <div className="card-header">
                    <input
                        className="form-input"
                        style={{ maxWidth: 220, padding: ".45rem .85rem" }}
                        placeholder="🔍 Cari produk..."
                        value={search}
                        onChange={(e) => setForm("nama", e.target.value)}
                    />
                    <div
                        style={{
                            display: "flex",
                            gap: ".35rem",
                            flexWrap: "wrap",
                        }}
                    >
                        {BRANDS.map((b) => (
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
                                    "Terjual",
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
                                            {/* ── FIX: pakai komponen ThumbnailProduk ── */}
                                            <ThumbnailProduk
                                                gambar={p.gambar}
                                                nama={p.nama}
                                            />
                                            <div
                                                style={{
                                                    fontWeight: 600,
                                                    fontSize: ".8rem",
                                                }}
                                            >
                                                {p.nama}
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
                                    <td>{p.terjual} pcs</td>
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
                                        {p.is_featured && (
                                            <div
                                                style={{
                                                    fontSize: "10px",
                                                    color: "#f59e0b",
                                                    fontWeight: 800,
                                                }}
                                            >
                                                ⭐ Featured
                                            </div>
                                        )}
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
                    Menampilkan {filtered.length} dari {produk.length} produk
                </div>
            </div>

            {/* ══════════════════════════════════════════
                  MODAL TAMBAH / EDIT PRODUK
            ══════════════════════════════════════════ */}
            {showModal && (
                <div style={modalOverlay} onClick={() => setShowModal(false)}>
                    <div
                        style={{
                            background: "#fff",
                            borderRadius: 14,
                            padding: "2rem",
                            width: "100%",
                            maxWidth: 500,
                            boxShadow: "0 25px 70px rgba(0,0,0,.25)",
                            maxHeight: "90vh",
                            overflowY: "auto",
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2
                            style={{
                                fontWeight: 800,
                                fontSize: "1.2rem",
                                textAlign: "center",
                                marginBottom: ".2rem",
                            }}
                        >
                            {editData ? "Edit Produk" : "Tambah Produk Baru"}
                        </h2>
                        <p
                            style={{
                                fontSize: ".78rem",
                                color: "#888",
                                textAlign: "center",
                                marginBottom: "1.5rem",
                            }}
                        >
                            Lengkapi Detail Produk Untuk Mulai Berjualan
                        </p>

                        {/* Nama Produk */}
                        <div style={{ marginBottom: "1rem" }}>
                            <label style={labelStyle}>Nama Produk</label>
                            <input
                                style={inputStyle}
                                value={form.nama}
                                onChange={(e) =>
                                    setForm({ ...form, nama: e.target.value })
                                }
                                placeholder="Contoh : Adidas Spezial Black White"
                            />
                            {errors.nama && (
                                <div
                                    style={{
                                        color: "red",
                                        fontSize: ".7rem",
                                        marginTop: 4,
                                    }}
                                >
                                    {errors.nama}
                                </div>
                            )}
                        </div>

                        {/* Brand Produk */}
                        <div style={{ marginBottom: "1rem" }}>
                            <label style={labelStyle}>Brand Produk</label>
                            <select
                                style={inputStyle}
                                value={form.brand}
                                onChange={(e) =>
                                    setForm({ ...form, brand: e.target.value })
                                }
                            >
                                {BRANDS.filter((b) => b !== "Semua").map(
                                    (b) => (
                                        <option key={b} value={b}>
                                            {b}
                                        </option>
                                    ),
                                )}
                            </select>
                        </div>

                        {/* Harga & Stok */}
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                gap: ".75rem",
                                marginBottom: "1rem",
                            }}
                        >
                            <div>
                                <label style={labelStyle}>Harga</label>
                                <input
                                    style={inputStyle}
                                    type="number"
                                    value={form.harga}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            harga: e.target.value,
                                        })
                                    }
                                    placeholder="1000000"
                                />
                                {errors.harga && (
                                    <div
                                        style={{
                                            color: "red",
                                            fontSize: ".7rem",
                                            marginTop: 4,
                                        }}
                                    >
                                        {errors.harga}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label style={labelStyle}>Stok</label>
                                <input
                                    style={inputStyle}
                                    type="number"
                                    value={form.stok}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            stok: e.target.value,
                                        })
                                    }
                                    placeholder="10"
                                />
                                {errors.stok && (
                                    <div
                                        style={{
                                            color: "red",
                                            fontSize: ".7rem",
                                            marginTop: 4,
                                        }}
                                    >
                                        {errors.stok}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Pilihan Ukuran */}
                        <div style={{ marginBottom: "1rem" }}>
                            <label style={labelStyle}>Pilihan Ukuran</label>
                            <input
                                style={inputStyle}
                                value={form.ukuran}
                                onChange={(e) =>
                                    setForm({ ...form, ukuran: e.target.value })
                                }
                                placeholder="Contoh : 38,39,40,41,42"
                            />
                        </div>

                        {/* Deskripsi */}
                        <div style={{ marginBottom: "1rem" }}>
                            <label style={labelStyle}>Deskripsi Produk</label>
                            <textarea
                                style={{
                                    ...inputStyle,
                                    resize: "vertical",
                                    minHeight: 90,
                                    fontFamily: "inherit",
                                }}
                                value={form.deskripsi}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        deskripsi: e.target.value,
                                    })
                                }
                                placeholder="Jelaskan Keunggulan Produk ini..."
                            />
                        </div>

                        {/* Checkbox Featured */}
                        <div
                            style={{
                                marginBottom: "1rem",
                                display: "flex",
                                alignItems: "center",
                                gap: ".5rem",
                            }}
                        >
                            <input
                                type="checkbox"
                                id="is_featured"
                                checked={form.is_featured}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        is_featured: e.target.checked,
                                    })
                                }
                                style={{
                                    width: "18px",
                                    height: "18px",
                                    cursor: "pointer",
                                }}
                            />
                            <label
                                htmlFor="is_featured"
                                style={{
                                    ...labelStyle,
                                    marginBottom: 0,
                                    cursor: "pointer",
                                }}
                            >
                                Tampilkan di Halaman Utama (Featured)
                            </label>
                        </div>

                        {/* Foto Produk */}
                        <div style={{ marginBottom: "1.25rem" }}>
                            <label style={labelStyle}>Foto Produk</label>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: ".6rem",
                                    border: "1.5px solid #e5e7eb",
                                    borderRadius: 8,
                                    padding: ".45rem .85rem",
                                    background: "#fafafa",
                                }}
                            >
                                <button
                                    type="button"
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                    style={{
                                        background: "#f3f4f6",
                                        border: "1px solid #d1d5db",
                                        borderRadius: 6,
                                        padding: ".3rem .85rem",
                                        fontSize: ".78rem",
                                        fontWeight: 600,
                                        cursor: "pointer",
                                        whiteSpace: "nowrap",
                                        color: "#333",
                                    }}
                                >
                                    Pilih file
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    style={{ display: "none" }}
                                    onChange={handleFotoChange}
                                />
                                <span
                                    style={{
                                        fontSize: ".78rem",
                                        color: "#aaa",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {form.gambar instanceof File
                                        ? form.gambar.name
                                        : "Tidak Ada File yang dipilih"}
                                </span>
                            </div>
                            {errors.gambar && (
                                <div
                                    style={{
                                        color: "red",
                                        fontSize: ".7rem",
                                        marginTop: 4,
                                    }}
                                >
                                    {errors.gambar}
                                </div>
                            )}

                            {/* Preview gambar — muncul untuk foto baru (base64) maupun lama (path) */}
                            {fotoPreview && (
                                <div
                                    style={{
                                        marginTop: ".6rem",
                                        position: "relative",
                                    }}
                                >
                                    <img
                                        src={fotoPreview}
                                        alt="Preview"
                                        style={{
                                            width: "100%",
                                            borderRadius: 8,
                                            objectFit: "cover",
                                            maxHeight: 180,
                                            border: "1px solid #e5e7eb",
                                            display: "block",
                                        }}
                                        onError={(e) => {
                                            e.target.style.display = "none";
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setForm("gambar", null); // Clear the file from form data
                                            if (fileInputRef.current)
                                                fileInputRef.current.value = "";
                                        }}
                                        style={{
                                            position: "absolute",
                                            top: 6,
                                            right: 6,
                                            background: "rgba(0,0,0,.55)",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: "50%",
                                            width: 24,
                                            height: 24,
                                            cursor: "pointer",
                                            fontSize: ".75rem",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        ✕
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Tombol Simpan */}
                        <button
                            type="button"
                            disabled={processing}
                            onClick={handleSave}
                            style={{
                                width: "100%",
                                background: "#f97316",
                                color: "#fff",
                                border: "none",
                                borderRadius: 9,
                                padding: ".78rem",
                                fontSize: ".95rem",
                                fontWeight: 700,
                                cursor: "pointer",
                                letterSpacing: ".02em",
                            }}
                        >
                            {processing
                                ? "Menyimpan..."
                                : editData
                                  ? "Simpan Perubahan"
                                  : "Publikasikan Produk"}
                        </button>

                        {/* Kembali */}
                        <button
                            type="button"
                            onClick={() => setShowModal(false)}
                            style={{
                                display: "block",
                                width: "100%",
                                background: "none",
                                border: "none",
                                marginTop: ".75rem",
                                fontSize: ".78rem",
                                color: "#888",
                                cursor: "pointer",
                                textAlign: "center",
                            }}
                        >
                            ← Kembali Ke Dashboard
                        </button>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════
                  MODAL HAPUS
            ══════════════════════════════════════════ */}
            {showDelete && (
                <div style={modalOverlay} onClick={() => setShowDelete(null)}>
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
                                onClick={() => setShowDelete(null)}
                            >
                                Batal
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={() => handleDelete(showDelete.id)}
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
