import { Head } from "@inertiajs/react";
import { useState, useRef } from "react";
import AdminLayout from "./AdminLayout";

const produkData = [
    {
        id: 1,
        nama: "Vans Authentic Navy White",
        brand: "VANS",
        harga: 899000,
        stok: 12,
        terjual: 42,
        status: "Aktif",
        gambar: "/assets/img/vans3.webp",
        ukuran: "38,39,40,41,42",
        deskripsi: "Sepatu canvas klasik dengan sol karet vulkanisasi.",
    },
    {
        id: 2,
        nama: "Nike Air Max 270",
        brand: "NIKE",
        harga: 1450000,
        stok: 8,
        terjual: 38,
        status: "Aktif",
        gambar: "/assets/img/nike1.webp",
        ukuran: "39,40,41,42,43",
        deskripsi: "Unit Air terbesar di tumit untuk kenyamanan sepanjang hari.",
    },
    {
        id: 3,
        nama: "Adidas Ultraboost 22",
        brand: "ADIDAS",
        harga: 1750000,
        stok: 3,
        terjual: 31,
        status: "Aktif",
        gambar: "/assets/img/adidas1.webp",
        ukuran: "40,41,42,43",
        deskripsi: "Teknologi Boost untuk energi pengembalian maksimal.",
    },
    {
        id: 4,
        nama: "Converse Chuck Taylor",
        brand: "CONVERSE",
        harga: 750000,
        stok: 20,
        terjual: 27,
        status: "Aktif",
        gambar: "/assets/img/converse1.webp",
        ukuran: "37,38,39,40,41,42",
        deskripsi: "Ikon abadi yang cocok untuk semua gaya kasual.",
    },
    {
        id: 5,
        nama: "Vans Old Skool Black",
        brand: "VANS",
        harga: 950000,
        stok: 0,
        terjual: 18,
        status: "Nonaktif",
        gambar: "/assets/img/vans3.webp",
        ukuran: "38,39,40,41",
        deskripsi: "Desain skate klasik dengan stripe ikonik di samping.",
    },
];

const BRANDS = ["Semua", "VANS", "NIKE", "ADIDAS", "CONVERSE"];
const fmtHarga = (n) => "Rp " + Number(n).toLocaleString("id-ID");

const emptyForm = {
    nama: "",
    brand: "VANS",
    harga: "",
    stok: "",
    status: "Aktif",
    ukuran: "",
    deskripsi: "",
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
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={() => setImgError(true)}
                />
            ) : (
                "👟"
            )}
        </div>
    );
}

export default function ProdukAdmin({ admin }) {
    const [produk, setProduk] = useState(produkData);
    const [search, setSearch] = useState("");
    const [filterBrand, setFilterBrand] = useState("Semua");
    const [showModal, setShowModal] = useState(false);
    const [editData, setEditData] = useState(null);
    const [showDelete, setShowDelete] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [fotoFile, setFotoFile] = useState(null);
    const [fotoPreview, setFotoPreview] = useState("");
    const fileInputRef = useRef(null);

    const filtered = produk.filter((p) => {
        const matchSearch = p.nama.toLowerCase().includes(search.toLowerCase());
        const matchBrand = filterBrand === "Semua" || p.brand === filterBrand;
        return matchSearch && matchBrand;
    });

    const openAdd = () => {
        setEditData(null);
        setForm(emptyForm);
        setFotoFile(null);
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
            ukuran: p.ukuran || "",
            deskripsi: p.deskripsi || "",
        });
        setFotoFile(null);
        // Selalu isi fotoPreview dari gambar yang sudah ada
        setFotoPreview(p.gambar || "");
        setShowModal(true);
    };

    const handleFotoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setFotoFile(file);
        const reader = new FileReader();
        reader.onload = (ev) => setFotoPreview(ev.target.result);
        reader.readAsDataURL(file);
    };

    const handleSave = () => {
        if (!form.nama || !form.harga || !form.stok) {
            alert("Isi semua field yang wajib diisi!");
            return;
        }

        // Gunakan fotoPreview (bisa base64 baru atau path lama)
        // Kalau edit dan tidak ganti foto, fotoPreview sudah berisi p.gambar dari openEdit
        const gambarFinal = fotoPreview || (editData ? editData.gambar : "");

        const data = {
            ...form,
            harga: Number(form.harga),
            stok: Number(form.stok),
            gambar: gambarFinal,
        };

        if (editData) {
            setProduk((prev) =>
                prev.map((p) =>
                    p.id === editData.id ? { ...p, ...data } : p
                )
            );
        } else {
            const newId = Math.max(...produk.map((p) => p.id)) + 1;
            setProduk((prev) => [
                ...prev,
                { id: newId, ...data, terjual: 0 },
            ]);
        }
        setShowModal(false);
    };

    const handleDelete = (id) => {
        setProduk((prev) => prev.filter((p) => p.id !== id));
        setShowDelete(null);
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
                    <p style={{ fontSize: ".75rem", color: "#888", marginTop: 2 }}>
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
                    { label: "Produk Aktif", value: produk.filter((p) => p.status === "Aktif").length },
                    { label: "Stok Menipis", value: produk.filter((p) => p.stok > 0 && p.stok < 8).length },
                    { label: "Stok Habis", value: produk.filter((p) => p.stok === 0).length },
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
                        <div style={{ fontSize: ".7rem", color: "#888", marginBottom: ".2rem" }}>
                            {s.label}
                        </div>
                        <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#111" }}>
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
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <div style={{ display: "flex", gap: ".35rem", flexWrap: "wrap" }}>
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
                                    borderColor: filterBrand === b ? "#3b82f6" : "#e5e7eb",
                                    background: filterBrand === b ? "#3b82f6" : "#fff",
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
                                {["#", "Produk", "Brand", "Harga", "Stok", "Terjual", "Status", "Aksi"].map((h) => (
                                    <th key={h}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((p, i) => (
                                <tr key={p.id}>
                                    <td style={{ color: "#aaa", fontSize: ".7rem" }}>{i + 1}</td>
                                    <td>
                                        <div style={{ display: "flex", alignItems: "center", gap: ".65rem" }}>
                                            {/* ── FIX: pakai komponen ThumbnailProduk ── */}
                                            <ThumbnailProduk gambar={p.gambar} nama={p.nama} />
                                            <div style={{ fontWeight: 600, fontSize: ".8rem" }}>{p.nama}</div>
                                        </div>
                                    </td>
                                    <td>
                                        <span style={{ fontSize: ".68rem", fontWeight: 700, color: "#f59e0b" }}>
                                            {p.brand}
                                        </span>
                                    </td>
                                    <td style={{ fontWeight: 700 }}>{fmtHarga(p.harga)}</td>
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
                                                background: p.status === "Aktif" ? "#dcfce7" : "#f3f4f6",
                                                color: p.status === "Aktif" ? "#166534" : "#888",
                                            }}
                                        >
                                            {p.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: "flex", gap: ".3rem" }}>
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
                                onChange={(e) => setForm({ ...form, nama: e.target.value })}
                                placeholder="Contoh : Adidas Spezial Black White"
                            />
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
                                    onChange={(e) => setForm({ ...form, harga: e.target.value })}
                                    placeholder="1000000"
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>Stok</label>
                                <input
                                    style={inputStyle}
                                    type="number"
                                    value={form.stok}
                                    onChange={(e) => setForm({ ...form, stok: e.target.value })}
                                    placeholder="10"
                                />
                            </div>
                        </div>

                        {/* Pilihan Ukuran */}
                        <div style={{ marginBottom: "1rem" }}>
                            <label style={labelStyle}>Pilihan Ukuran</label>
                            <input
                                style={inputStyle}
                                value={form.ukuran}
                                onChange={(e) => setForm({ ...form, ukuran: e.target.value })}
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
                                onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                                placeholder="Jelaskan Keunggulan Produk ini..."
                            />
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
                                    onClick={() => fileInputRef.current?.click()}
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
                                    {fotoFile ? fotoFile.name : "Tidak Ada File yang dipilih"}
                                </span>
                            </div>

                            {/* Preview gambar — muncul untuk foto baru (base64) maupun lama (path) */}
                            {fotoPreview && (
                                <div style={{ marginTop: ".6rem", position: "relative" }}>
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
                                        onError={(e) => { e.target.style.display = "none"; }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setFotoFile(null);
                                            setFotoPreview("");
                                            if (fileInputRef.current) fileInputRef.current.value = "";
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
                            {editData ? "Simpan Perubahan" : "Publikasikan Produk"}
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
                        <div style={{ fontSize: "2.5rem", marginBottom: ".75rem" }}>🗑️</div>
                        <h2 style={{ fontWeight: 800, marginBottom: ".5rem" }}>Hapus Produk?</h2>
                        <p style={{ fontSize: ".85rem", color: "#888", marginBottom: "1.5rem" }}>
                            Produk <strong>{showDelete.nama}</strong> akan dihapus permanen.
                        </p>
                        <div style={{ display: "flex", gap: ".6rem", justifyContent: "center" }}>
                            <button className="btn btn-outline" onClick={() => setShowDelete(null)}>
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