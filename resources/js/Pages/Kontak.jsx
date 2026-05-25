import { Head, useForm, usePage } from "@inertiajs/react";
import Layout from "./Layout";

export default function Kontak() {
    const { flash } = usePage().props;

    // useForm dari Inertia — handles state, validasi, dan submit otomatis
    const { data, setData, post, processing, errors, reset } = useForm({
        nama: "",
        email: "",
        pesan: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/kontak", {
            onSuccess: () => reset(),
        });
    };

    const inputStyle = {
        width: "100%",
        padding: "0.65rem 1rem",
        border: "1.5px solid #e5e7eb",
        borderRadius: 8,
        fontSize: "0.95rem",
        outline: "none",
        transition: "border-color .2s",
        background: "#fafafa",
    };

    const labelStyle = {
        display: "block",
        fontWeight: 600,
        fontSize: "0.875rem",
        marginBottom: "0.4rem",
    };

    const infoKontak = [
        {
            icon: "📍",
            label: "Alamat",
            val: "Jl. Sepatu Indah No. 1, Tasikmalaya",
        },
        { icon: "📱", label: "WhatsApp", val: "0812-3456-7890" },
        { icon: "📧", label: "Email", val: "hello@amengstore.id" },
    ];

    return (
        <Layout>
            <Head title="Kontak | AMENG STORE" />

            <div
                style={{
                    maxWidth: 700,
                    margin: "0 auto",
                    padding: "4rem 1.5rem",
                }}
            >
                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                    <h1 style={{ fontSize: "2rem", fontWeight: 800 }}>
                        Hubungi Kami
                    </h1>
                    <p style={{ color: "#888", marginTop: "0.4rem" }}>
                        Ada pertanyaan? Kami siap membantu!
                    </p>
                </div>

                {/* Flash sukses */}
                {flash?.success && (
                    <div
                        style={{
                            background: "#dcfce7",
                            border: "1px solid #16a34a",
                            color: "#15803d",
                            padding: "1rem 1.25rem",
                            borderRadius: 10,
                            marginBottom: "1.5rem",
                            fontWeight: 600,
                        }}
                    >
                        ✅ {flash.success}
                    </div>
                )}

                {/* Form */}
                <div
                    style={{
                        background: "#fff",
                        border: "1px solid #f0f0f0",
                        borderRadius: 16,
                        padding: "2rem",
                    }}
                >
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: "1.25rem" }}>
                            <label style={labelStyle}>Nama Lengkap</label>
                            <input
                                type="text"
                                value={data.nama}
                                onChange={(e) =>
                                    setData("nama", e.target.value)
                                }
                                placeholder="Masukkan nama kamu"
                                style={{
                                    ...inputStyle,
                                    borderColor: errors.nama
                                        ? "#dc2626"
                                        : "#e5e7eb",
                                }}
                                onFocus={(e) =>
                                    (e.target.style.borderColor = "#f59e0b")
                                }
                                onBlur={(e) =>
                                    (e.target.style.borderColor = errors.nama
                                        ? "#dc2626"
                                        : "#e5e7eb")
                                }
                            />
                            {errors.nama && (
                                <p
                                    style={{
                                        color: "#dc2626",
                                        fontSize: "0.8rem",
                                        marginTop: "0.3rem",
                                    }}
                                >
                                    {errors.nama}
                                </p>
                            )}
                        </div>

                        <div style={{ marginBottom: "1.25rem" }}>
                            <label style={labelStyle}>Email</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                placeholder="email@kamu.com"
                                style={{
                                    ...inputStyle,
                                    borderColor: errors.email
                                        ? "#dc2626"
                                        : "#e5e7eb",
                                }}
                                onFocus={(e) =>
                                    (e.target.style.borderColor = "#f59e0b")
                                }
                                onBlur={(e) =>
                                    (e.target.style.borderColor = errors.email
                                        ? "#dc2626"
                                        : "#e5e7eb")
                                }
                            />
                            {errors.email && (
                                <p
                                    style={{
                                        color: "#dc2626",
                                        fontSize: "0.8rem",
                                        marginTop: "0.3rem",
                                    }}
                                >
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div style={{ marginBottom: "1.5rem" }}>
                            <label style={labelStyle}>Pesan</label>
                            <textarea
                                value={data.pesan}
                                onChange={(e) =>
                                    setData("pesan", e.target.value)
                                }
                                placeholder="Tulis pesanmu di sini..."
                                rows={5}
                                style={{
                                    ...inputStyle,
                                    resize: "vertical",
                                    borderColor: errors.pesan
                                        ? "#dc2626"
                                        : "#e5e7eb",
                                }}
                                onFocus={(e) =>
                                    (e.target.style.borderColor = "#f59e0b")
                                }
                                onBlur={(e) =>
                                    (e.target.style.borderColor = errors.pesan
                                        ? "#dc2626"
                                        : "#e5e7eb")
                                }
                            />
                            {errors.pesan && (
                                <p
                                    style={{
                                        color: "#dc2626",
                                        fontSize: "0.8rem",
                                        marginTop: "0.3rem",
                                    }}
                                >
                                    {errors.pesan}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            style={{
                                width: "100%",
                                padding: "0.85rem",
                                background: processing ? "#888" : "#111",
                                color: "#fff",
                                border: "none",
                                borderRadius: 10,
                                fontSize: "1rem",
                                fontWeight: 700,
                                cursor: processing ? "not-allowed" : "pointer",
                                transition: "background .2s",
                            }}
                        >
                            {processing ? "Mengirim..." : "Kirim Pesan →"}
                        </button>
                    </form>
                </div>

                {/* Info Kontak */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(180px, 1fr))",
                        gap: "1rem",
                        marginTop: "1.5rem",
                    }}
                >
                    {infoKontak.map((info, i) => (
                        <div
                            key={i}
                            style={{
                                background: "#f9fafb",
                                border: "1px solid #f0f0f0",
                                borderRadius: 12,
                                padding: "1.25rem",
                                textAlign: "center",
                            }}
                        >
                            <div
                                style={{
                                    fontSize: "1.5rem",
                                    marginBottom: "0.4rem",
                                }}
                            >
                                {info.icon}
                            </div>
                            <div
                                style={{
                                    fontWeight: 700,
                                    fontSize: "0.85rem",
                                    marginBottom: "0.25rem",
                                }}
                            >
                                {info.label}
                            </div>
                            <div style={{ fontSize: "0.8rem", color: "#888" }}>
                                {info.val}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
}
