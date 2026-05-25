import { Head, usePage, useForm } from "@inertiajs/react";
import { useState } from "react";
import Layout from "./Layout";

export default function ProfilPembeli({ pembeli }) {
    const [activeTab, setActiveTab] = useState("profil");
    const [saved, setSaved] = useState(false);

    const { data, setData } = useForm({
        name: pembeli?.name || "",
        email: pembeli?.email || "",
        telepon: pembeli?.telepon || "",
        alamat: pembeli?.alamat || "",
    });

    const handleSave = (e) => {
        e.preventDefault();
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    const inputStyle = {
        width: "100%",
        padding: ".6rem .9rem",
        border: "1.5px solid #e5e7eb",
        borderRadius: 8,
        fontSize: ".9rem",
        outline: "none",
        background: "#fff",
        transition: "border .2s",
    };

    const tabs = [
        { id: "profil", label: "👤 Profil" },
        { id: "alamat", label: "📍 Alamat" },
        { id: "keamanan", label: "🔒 Keamanan" },
    ];

    const avatarColor = "#f59e0b";

    return (
        <Layout>
            <Head title="Profil Saya | AMENG STORE" />

            <div
                style={{
                    maxWidth: 700,
                    margin: "0 auto",
                    padding: "3rem 1.5rem",
                }}
            >
                {/* Header Profil */}
                <div
                    style={{
                        background:
                            "linear-gradient(135deg,#111 0%,#1e1e1e 100%)",
                        borderRadius: 16,
                        padding: "1.75rem 2rem",
                        marginBottom: "1.75rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "1.25rem",
                        flexWrap: "wrap",
                    }}
                >
                    <div
                        style={{
                            width: 64,
                            height: 64,
                            borderRadius: "50%",
                            background: avatarColor,
                            color: "#111",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 800,
                            fontSize: "1.6rem",
                            flexShrink: 0,
                        }}
                    >
                        {pembeli?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <div
                            style={{
                                fontWeight: 800,
                                fontSize: "1.2rem",
                                color: "#fff",
                            }}
                        >
                            {pembeli?.name}
                        </div>
                        <div
                            style={{
                                fontSize: ".82rem",
                                color: "#aaa",
                                marginTop: ".2rem",
                            }}
                        >
                            {pembeli?.email}
                        </div>
                        <div
                            style={{
                                display: "inline-block",
                                marginTop: ".5rem",
                                background: "#f59e0b",
                                color: "#111",
                                fontSize: ".68rem",
                                fontWeight: 700,
                                padding: "2px 10px",
                                borderRadius: 999,
                            }}
                        >
                            Member
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div
                    style={{
                        display: "flex",
                        gap: 0,
                        borderBottom: "2px solid #f0f0f0",
                        marginBottom: "1.5rem",
                    }}
                >
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                padding: ".6rem 1.25rem",
                                background: "none",
                                border: "none",
                                borderBottom: `2.5px solid ${activeTab === tab.id ? "#f59e0b" : "transparent"}`,
                                fontWeight: activeTab === tab.id ? 700 : 500,
                                color: activeTab === tab.id ? "#111" : "#888",
                                cursor: "pointer",
                                fontSize: ".85rem",
                                marginBottom: "-2px",
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab: Profil */}
                {activeTab === "profil" && (
                    <div
                        style={{
                            background: "#fff",
                            borderRadius: 14,
                            border: "1px solid #f0f0f0",
                            padding: "1.75rem",
                        }}
                    >
                        {saved && (
                            <div
                                style={{
                                    background: "#dcfce7",
                                    border: "1px solid #16a34a",
                                    color: "#15803d",
                                    padding: ".75rem 1rem",
                                    borderRadius: 9,
                                    marginBottom: "1.25rem",
                                    fontWeight: 600,
                                    fontSize: ".85rem",
                                }}
                            >
                                ✅ Profil berhasil disimpan!
                            </div>
                        )}
                        <form onSubmit={handleSave}>
                            <div style={{ marginBottom: "1rem" }}>
                                <label
                                    style={{
                                        display: "block",
                                        fontWeight: 600,
                                        fontSize: ".85rem",
                                        marginBottom: ".35rem",
                                    }}
                                >
                                    Nama Lengkap
                                </label>
                                <input
                                    style={inputStyle}
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    onFocus={(e) =>
                                        (e.target.style.borderColor = "#f59e0b")
                                    }
                                    onBlur={(e) =>
                                        (e.target.style.borderColor = "#e5e7eb")
                                    }
                                />
                            </div>
                            <div style={{ marginBottom: "1rem" }}>
                                <label
                                    style={{
                                        display: "block",
                                        fontWeight: 600,
                                        fontSize: ".85rem",
                                        marginBottom: ".35rem",
                                    }}
                                >
                                    Email
                                </label>
                                <input
                                    style={{
                                        ...inputStyle,
                                        background: "#f9fafb",
                                        color: "#888",
                                    }}
                                    value={data.email}
                                    readOnly
                                />
                                <p
                                    style={{
                                        fontSize: ".72rem",
                                        color: "#aaa",
                                        marginTop: ".3rem",
                                    }}
                                >
                                    Email tidak dapat diubah
                                </p>
                            </div>
                            <div style={{ marginBottom: "1.5rem" }}>
                                <label
                                    style={{
                                        display: "block",
                                        fontWeight: 600,
                                        fontSize: ".85rem",
                                        marginBottom: ".35rem",
                                    }}
                                >
                                    No. Telepon / WhatsApp
                                </label>
                                <input
                                    style={inputStyle}
                                    value={data.telepon}
                                    onChange={(e) =>
                                        setData("telepon", e.target.value)
                                    }
                                    placeholder="08xxxxxxxxxx"
                                    onFocus={(e) =>
                                        (e.target.style.borderColor = "#f59e0b")
                                    }
                                    onBlur={(e) =>
                                        (e.target.style.borderColor = "#e5e7eb")
                                    }
                                />
                            </div>
                            <button
                                type="submit"
                                style={{
                                    padding: ".7rem 1.75rem",
                                    background: "#FFC81E",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: 10,
                                    fontWeight: 700,
                                    cursor: "pointer",
                                    fontSize: ".9rem",
                                }}
                            >
                                Simpan Perubahan
                            </button>
                        </form>
                    </div>
                )}

                {/* Tab: Alamat */}
                {activeTab === "alamat" && (
                    <div
                        style={{
                            background: "#fff",
                            borderRadius: 14,
                            border: "1px solid #f0f0f0",
                            padding: "1.75rem",
                        }}
                    >
                        <h2
                            style={{
                                fontWeight: 700,
                                marginBottom: "1.25rem",
                                fontSize: "1rem",
                            }}
                        >
                            Alamat Pengiriman
                        </h2>

                        {/* Alamat utama */}
                        <div
                            style={{
                                padding: "1.1rem",
                                background: "#fffbeb",
                                borderRadius: 12,
                                border: "2px solid #f59e0b",
                                marginBottom: "1rem",
                                position: "relative",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginBottom: ".4rem",
                                }}
                            >
                                <span
                                    style={{
                                        fontWeight: 700,
                                        fontSize: ".9rem",
                                    }}
                                >
                                    {pembeli?.name}
                                </span>
                                <span
                                    style={{
                                        fontSize: ".65rem",
                                        fontWeight: 700,
                                        background: "#f59e0b",
                                        color: "#111",
                                        padding: "2px 8px",
                                        borderRadius: 999,
                                    }}
                                >
                                    Utama
                                </span>
                            </div>
                            <p
                                style={{
                                    fontSize: ".85rem",
                                    color: "#555",
                                    lineHeight: 1.6,
                                }}
                            >
                                {pembeli?.alamat}
                            </p>
                            <p
                                style={{
                                    fontSize: ".78rem",
                                    color: "#888",
                                    marginTop: ".3rem",
                                }}
                            >
                                {pembeli?.telepon}
                            </p>
                            <button
                                style={{
                                    marginTop: ".75rem",
                                    padding: ".4rem .85rem",
                                    border: "1.5px solid #e5e7eb",
                                    borderRadius: 7,
                                    background: "#fff",
                                    fontSize: ".75rem",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                }}
                            >
                                ✏️ Edit
                            </button>
                        </div>

                        {/* Tambah alamat baru */}
                        <button
                            style={{
                                width: "100%",
                                padding: ".85rem",
                                background: "#fff",
                                border: "2px dashed #e5e7eb",
                                borderRadius: 12,
                                color: "#888",
                                fontWeight: 600,
                                cursor: "pointer",
                                fontSize: ".85rem",
                                transition: "all .2s",
                            }}
                            onMouseOver={(e) => {
                                e.target.style.borderColor = "#f59e0b";
                                e.target.style.color = "#f59e0b";
                            }}
                            onMouseOut={(e) => {
                                e.target.style.borderColor = "#e5e7eb";
                                e.target.style.color = "#888";
                            }}
                        >
                            + Tambah Alamat Baru
                        </button>
                    </div>
                )}

                {/* Tab: Keamanan */}
                {activeTab === "keamanan" && (
                    <div
                        style={{
                            background: "#fff",
                            borderRadius: 14,
                            border: "1px solid #f0f0f0",
                            padding: "1.75rem",
                        }}
                    >
                        <h2
                            style={{
                                fontWeight: 700,
                                marginBottom: "1.25rem",
                                fontSize: "1rem",
                            }}
                        >
                            Ganti Password
                        </h2>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                setSaved(true);
                                setTimeout(() => setSaved(false), 2500);
                            }}
                        >
                            {saved && (
                                <div
                                    style={{
                                        background: "#dcfce7",
                                        border: "1px solid #16a34a",
                                        color: "#15803d",
                                        padding: ".75rem 1rem",
                                        borderRadius: 9,
                                        marginBottom: "1.25rem",
                                        fontWeight: 600,
                                        fontSize: ".85rem",
                                    }}
                                >
                                    ✅ Password berhasil diubah!
                                </div>
                            )}
                            {[
                                {
                                    label: "Password Lama",
                                    placeholder: "Masukkan password lama",
                                },
                                {
                                    label: "Password Baru",
                                    placeholder: "Minimal 8 karakter",
                                },
                                {
                                    label: "Konfirmasi Password",
                                    placeholder: "Ulangi password baru",
                                },
                            ].map((f, i) => (
                                <div key={i} style={{ marginBottom: "1rem" }}>
                                    <label
                                        style={{
                                            display: "block",
                                            fontWeight: 600,
                                            fontSize: ".85rem",
                                            marginBottom: ".35rem",
                                        }}
                                    >
                                        {f.label}
                                    </label>
                                    <input
                                        type="password"
                                        placeholder={f.placeholder}
                                        style={inputStyle}
                                        onFocus={(e) =>
                                            (e.target.style.borderColor =
                                                "#f59e0b")
                                        }
                                        onBlur={(e) =>
                                            (e.target.style.borderColor =
                                                "#e5e7eb")
                                        }
                                    />
                                </div>
                            ))}
                            <button
                                type="submit"
                                style={{
                                    padding: ".7rem 1.75rem",
                                    background: "#111",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: 10,
                                    fontWeight: 700,
                                    cursor: "pointer",
                                    fontSize: ".9rem",
                                }}
                            >
                                Ubah Password
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </Layout>
    );
}
