import { Head, Link, useForm } from "@inertiajs/react";

export default function RegisterPembeli() {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        telepon: "",
        alamat: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/pembeli/register");
    };

    const inputStyle = (hasError) => ({
        width: "100%",
        padding: "0.65rem 1rem",
        border: `1.5px solid ${hasError ? "#dc2626" : "#e5e7eb"}`,
        borderRadius: 8,
        fontSize: "0.9rem",
        outline: "none",
        background: "#fafafa",
    });

    const labelStyle = {
        display: "block",
        fontWeight: 600,
        fontSize: "0.875rem",
        marginBottom: "0.4rem",
    };

    return (
        <>
            <Head title="Daftar | AMENG STORE" />
            <style>{`* { box-sizing:border-box; margin:0; padding:0; } body { font-family:'Plus Jakarta Sans',sans-serif; background:#f9fafb; } a { text-decoration:none; }`}</style>
            <link
                href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap"
                rel="stylesheet"
            />

            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "2rem",
                }}
            >
                <div style={{ width: "100%", maxWidth: 480 }}>
                    {/* Logo */}
                    <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                        <Link
                            href="/"
                            style={{
                                fontSize: "1.8rem",
                                fontWeight: 800,
                                color: "#111",
                            }}
                        >
                            AMENG<span style={{ color: "#f59e0b" }}>STORE</span>
                        </Link>
                        <p
                            style={{
                                color: "#888",
                                marginTop: "0.5rem",
                                fontSize: "0.9rem",
                            }}
                        >
                            Buat akun baru
                        </p>
                    </div>

                    <div
                        style={{
                            background: "#fff",
                            borderRadius: 16,
                            border: "1px solid #f0f0f0",
                            padding: "2rem",
                        }}
                    >
                        <form onSubmit={handleSubmit}>
                            {/* Nama */}
                            <div style={{ marginBottom: "1rem" }}>
                                <label style={labelStyle}>Nama Lengkap</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    placeholder="Nama lengkap kamu"
                                    style={inputStyle(errors.name)}
                                    onFocus={(e) =>
                                        (e.target.style.borderColor = "#f59e0b")
                                    }
                                    onBlur={(e) =>
                                        (e.target.style.borderColor =
                                            errors.name ? "#dc2626" : "#e5e7eb")
                                    }
                                />
                                {errors.name && (
                                    <p
                                        style={{
                                            color: "#dc2626",
                                            fontSize: "0.78rem",
                                            marginTop: "0.25rem",
                                        }}
                                    >
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            {/* Email */}
                            <div style={{ marginBottom: "1rem" }}>
                                <label style={labelStyle}>Email</label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    placeholder="email@kamu.com"
                                    style={inputStyle(errors.email)}
                                    onFocus={(e) =>
                                        (e.target.style.borderColor = "#f59e0b")
                                    }
                                    onBlur={(e) =>
                                        (e.target.style.borderColor =
                                            errors.email
                                                ? "#dc2626"
                                                : "#e5e7eb")
                                    }
                                />
                                {errors.email && (
                                    <p
                                        style={{
                                            color: "#dc2626",
                                            fontSize: "0.78rem",
                                            marginTop: "0.25rem",
                                        }}
                                    >
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Telepon */}
                            <div style={{ marginBottom: "1rem" }}>
                                <label style={labelStyle}>
                                    No. Telepon / WhatsApp
                                </label>
                                <input
                                    type="text"
                                    value={data.telepon}
                                    onChange={(e) =>
                                        setData("telepon", e.target.value)
                                    }
                                    placeholder="08xxxxxxxxxx"
                                    style={inputStyle(errors.telepon)}
                                    onFocus={(e) =>
                                        (e.target.style.borderColor = "#f59e0b")
                                    }
                                    onBlur={(e) =>
                                        (e.target.style.borderColor =
                                            errors.telepon
                                                ? "#dc2626"
                                                : "#e5e7eb")
                                    }
                                />
                                {errors.telepon && (
                                    <p
                                        style={{
                                            color: "#dc2626",
                                            fontSize: "0.78rem",
                                            marginTop: "0.25rem",
                                        }}
                                    >
                                        {errors.telepon}
                                    </p>
                                )}
                            </div>

                            {/* Alamat */}
                            <div style={{ marginBottom: "1rem" }}>
                                <label style={labelStyle}>
                                    Alamat Pengiriman
                                </label>
                                <textarea
                                    value={data.alamat}
                                    onChange={(e) =>
                                        setData("alamat", e.target.value)
                                    }
                                    placeholder="Jl. Contoh No. 1, Kota, Provinsi"
                                    rows={2}
                                    style={{
                                        ...inputStyle(errors.alamat),
                                        resize: "vertical",
                                    }}
                                    onFocus={(e) =>
                                        (e.target.style.borderColor = "#f59e0b")
                                    }
                                    onBlur={(e) =>
                                        (e.target.style.borderColor =
                                            errors.alamat
                                                ? "#dc2626"
                                                : "#e5e7eb")
                                    }
                                />
                                {errors.alamat && (
                                    <p
                                        style={{
                                            color: "#dc2626",
                                            fontSize: "0.78rem",
                                            marginTop: "0.25rem",
                                        }}
                                    >
                                        {errors.alamat}
                                    </p>
                                )}
                            </div>

                            {/* Password */}
                            <div style={{ marginBottom: "1rem" }}>
                                <label style={labelStyle}>Password</label>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    placeholder="Minimal 8 karakter"
                                    style={inputStyle(errors.password)}
                                    onFocus={(e) =>
                                        (e.target.style.borderColor = "#f59e0b")
                                    }
                                    onBlur={(e) =>
                                        (e.target.style.borderColor =
                                            errors.password
                                                ? "#dc2626"
                                                : "#e5e7eb")
                                    }
                                />
                                {errors.password && (
                                    <p
                                        style={{
                                            color: "#dc2626",
                                            fontSize: "0.78rem",
                                            marginTop: "0.25rem",
                                        }}
                                    >
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Konfirmasi Password */}
                            <div style={{ marginBottom: "1.5rem" }}>
                                <label style={labelStyle}>
                                    Konfirmasi Password
                                </label>
                                <input
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) =>
                                        setData(
                                            "password_confirmation",
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Ulangi password"
                                    style={inputStyle(false)}
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
                                disabled={processing}
                                style={{
                                    width: "100%",
                                    padding: "0.8rem",
                                    background: processing ? "#888" : "#111",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: 10,
                                    fontSize: "1rem",
                                    fontWeight: 700,
                                    cursor: processing
                                        ? "not-allowed"
                                        : "pointer",
                                }}
                            >
                                {processing
                                    ? "Mendaftarkan..."
                                    : "Daftar Sekarang →"}
                            </button>
                        </form>

                        <p
                            style={{
                                textAlign: "center",
                                fontSize: "0.875rem",
                                color: "#666",
                                marginTop: "1.25rem",
                            }}
                        >
                            Sudah punya akun?{" "}
                            <Link
                                href="/pembeli/login"
                                style={{ color: "#f59e0b", fontWeight: 700 }}
                            >
                                Masuk
                            </Link>
                        </p>
                    </div>

                    <p
                        style={{
                            textAlign: "center",
                            marginTop: "1.5rem",
                            fontSize: "0.8rem",
                        }}
                    >
                        <Link href="/" style={{ color: "#888" }}>
                            ← Kembali ke Toko
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}
