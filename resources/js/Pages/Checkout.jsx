import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import Layout from "./Layout";

export default function Checkout({ alamatPembeli }) {
    const { auth } = usePage().props;
    const pembeli = auth?.pembeli;
    const [cart, setCart] = useState([]);
    const [step, setStep] = useState(1);

    const { data, setData, post, processing, errors } = useForm({
        nama: pembeli?.name || "",
        telepon: pembeli?.telepon || "",
        alamat: alamatPembeli?.alamat || pembeli?.alamat || "",
        kota: alamatPembeli?.kota || "",
        provinsi: alamatPembeli?.provinsi || "",
        metode_bayar: "",
        items: [],
        total: 0,
    });

    useEffect(() => {
        const c = JSON.parse(localStorage.getItem("amengCart") || "[]");
        setCart(c);
        setData((prev) => ({
            ...prev,
            items: c,
            total: c.reduce((s, i) => s + i.harga * i.qty, 0),
        }));
    }, []);

    const formatHarga = (n) => "Rp " + Number(n).toLocaleString("id-ID");
    const total = cart.reduce((s, i) => s + i.harga * i.qty, 0);

    const metodePembayaran = [
        { id: "transfer_bca", label: "Transfer BCA", icon: "🏦" },
        { id: "transfer_mandiri", label: "Transfer Mandiri", icon: "🏦" },
        { id: "gopay", label: "GoPay", icon: "💚" },
        { id: "ovo", label: "OVO", icon: "💜" },
        { id: "dana", label: "DANA", icon: "💙" },
        { id: "cod", label: "Bayar di Tempat (COD)", icon: "💵" },
    ];

    const handleOrder = (e) => {
        e.preventDefault();
        post("/checkout/process", {
            onSuccess: () => {
                localStorage.removeItem("amengCart");
                window.dispatchEvent(new Event("cartUpdated"));
            },
        });
    };

    const inputStyle = (err) => ({
        width: "100%",
        padding: ".65rem 1rem",
        border: `1.5px solid ${err ? "#dc2626" : "#e5e7eb"}`,
        borderRadius: 8,
        fontSize: ".9rem",
        outline: "none",
        background: "#fafafa",
        transition: "border .2s",
        fontFamily: "inherit",
    });

    if (cart.length === 0) {
        return (
            <Layout>
                <div style={{ textAlign: "center", padding: "5rem 1.5rem" }}>
                    <p style={{ fontSize: "3rem" }}>🛒</p>
                    <p style={{ fontWeight: 700, marginTop: "1rem" }}>
                        Keranjang kamu kosong
                    </p>
                    <Link
                        href="/katalog"
                        style={{
                            display: "inline-block",
                            marginTop: "1.5rem",
                            background: "#111",
                            color: "#fff",
                            padding: ".65rem 1.5rem",
                            borderRadius: 999,
                            fontWeight: 700,
                        }}
                    >
                        Belanja Dulu
                    </Link>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <Head title="Checkout | AMENG STORE" />
            <div
                style={{
                    maxWidth: 900,
                    margin: "0 auto",
                    padding: "3rem 1.5rem",
                }}
            >
                <h1
                    style={{
                        fontSize: "1.75rem",
                        fontWeight: 800,
                        marginBottom: "2rem",
                    }}
                >
                    Checkout
                </h1>

                {/* Step Indicator */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "2.5rem",
                    }}
                >
                    {[
                        ["1", "Alamat"],
                        ["2", "Pembayaran"],
                    ].map(([num, label], i) => (
                        <div
                            key={i}
                            style={{ display: "flex", alignItems: "center" }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: ".5rem",
                                }}
                            >
                                <div
                                    style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: "50%",
                                        background:
                                            step >= Number(num)
                                                ? "#111"
                                                : "#e5e7eb",
                                        color:
                                            step >= Number(num)
                                                ? "#fff"
                                                : "#888",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontWeight: 700,
                                        fontSize: ".875rem",
                                    }}
                                >
                                    {step > Number(num) ? "✓" : num}
                                </div>
                                <span
                                    style={{
                                        fontSize: ".85rem",
                                        fontWeight:
                                            step === Number(num) ? 700 : 400,
                                        color:
                                            step >= Number(num)
                                                ? "#111"
                                                : "#aaa",
                                    }}
                                >
                                    {label}
                                </span>
                            </div>
                            {i < 1 && (
                                <div
                                    style={{
                                        width: 40,
                                        height: 2,
                                        background:
                                            step > Number(num)
                                                ? "#111"
                                                : "#e5e7eb",
                                        margin: "0 .75rem",
                                    }}
                                />
                            )}
                        </div>
                    ))}
                </div>

                <form onSubmit={handleOrder}>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 300px",
                            gap: "1.5rem",
                            alignItems: "start",
                        }}
                    >
                        {/* FORM KIRI */}
                        <div>
                            {/* STEP 1: Alamat */}
                            {step === 1 && (
                                <div
                                    style={{
                                        background: "#fff",
                                        border: "1px solid #f0f0f0",
                                        borderRadius: 14,
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
                                        📍 Alamat Pengiriman
                                    </h2>

                                    {/* Banner auto-fill */}
                                    {(pembeli?.alamat ||
                                        alamatPembeli?.alamat) && (
                                        <div
                                            style={{
                                                background: "#eff6ff",
                                                border: "1px solid #bfdbfe",
                                                borderRadius: 9,
                                                padding: ".75rem 1rem",
                                                marginBottom: "1.25rem",
                                                fontSize: ".8rem",
                                                color: "#1d4ed8",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: ".5rem",
                                            }}
                                        >
                                            ✅ Alamat diisi otomatis dari profil
                                            kamu.
                                            <Link
                                                href="/pembeli/profil"
                                                style={{
                                                    color: "#1d4ed8",
                                                    fontWeight: 700,
                                                    marginLeft: "auto",
                                                    textDecoration: "underline",
                                                }}
                                            >
                                                Ubah?
                                            </Link>
                                        </div>
                                    )}

                                    {[
                                        {
                                            key: "nama",
                                            label: "Nama Penerima",
                                            placeholder: "Nama lengkap",
                                            type: "text",
                                        },
                                        {
                                            key: "telepon",
                                            label: "No. Telepon",
                                            placeholder: "08xxxxxxxxxx",
                                            type: "text",
                                        },
                                    ].map((f) => (
                                        <div
                                            key={f.key}
                                            style={{ marginBottom: "1rem" }}
                                        >
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
                                                type={f.type}
                                                value={data[f.key]}
                                                onChange={(e) =>
                                                    setData(
                                                        f.key,
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder={f.placeholder}
                                                style={inputStyle(
                                                    errors[f.key],
                                                )}
                                                onFocus={(e) =>
                                                    (e.target.style.borderColor =
                                                        "#f59e0b")
                                                }
                                                onBlur={(e) =>
                                                    (e.target.style.borderColor =
                                                        errors[f.key]
                                                            ? "#dc2626"
                                                            : "#e5e7eb")
                                                }
                                            />
                                            {errors[f.key] && (
                                                <p
                                                    style={{
                                                        color: "#dc2626",
                                                        fontSize: ".75rem",
                                                        marginTop: ".25rem",
                                                    }}
                                                >
                                                    {errors[f.key]}
                                                </p>
                                            )}
                                        </div>
                                    ))}

                                    <div style={{ marginBottom: "1rem" }}>
                                        <label
                                            style={{
                                                display: "block",
                                                fontWeight: 600,
                                                fontSize: ".85rem",
                                                marginBottom: ".35rem",
                                            }}
                                        >
                                            Alamat Lengkap
                                        </label>
                                        <textarea
                                            value={data.alamat}
                                            onChange={(e) =>
                                                setData(
                                                    "alamat",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Jl. Nama Jalan No. X, RT/RW, Kelurahan"
                                            rows={3}
                                            style={{
                                                ...inputStyle(errors.alamat),
                                                resize: "vertical",
                                            }}
                                            onFocus={(e) =>
                                                (e.target.style.borderColor =
                                                    "#f59e0b")
                                            }
                                            onBlur={(e) =>
                                                (e.target.style.borderColor =
                                                    "#e5e7eb")
                                            }
                                        />
                                        {errors.alamat && (
                                            <p
                                                style={{
                                                    color: "#dc2626",
                                                    fontSize: ".75rem",
                                                    marginTop: ".25rem",
                                                }}
                                            >
                                                {errors.alamat}
                                            </p>
                                        )}
                                    </div>

                                    <div
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns: "1fr 1fr",
                                            gap: ".75rem",
                                            marginBottom: "1.5rem",
                                        }}
                                    >
                                        {[
                                            {
                                                key: "kota",
                                                label: "Kota",
                                                placeholder: "Nama kota",
                                            },
                                            {
                                                key: "provinsi",
                                                label: "Provinsi",
                                                placeholder: "Nama provinsi",
                                            },
                                        ].map((f) => (
                                            <div key={f.key}>
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
                                                    type="text"
                                                    value={data[f.key]}
                                                    onChange={(e) =>
                                                        setData(
                                                            f.key,
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder={f.placeholder}
                                                    style={inputStyle(false)}
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
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => setStep(2)}
                                        style={{
                                            width: "100%",
                                            padding: ".8rem",
                                            background: "#111",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: 10,
                                            fontWeight: 700,
                                            cursor: "pointer",
                                            fontSize: ".95rem",
                                        }}
                                    >
                                        Lanjut ke Pembayaran →
                                    </button>
                                </div>
                            )}

                            {/* STEP 2: Metode Bayar */}
                            {step === 2 && (
                                <div
                                    style={{
                                        background: "#fff",
                                        border: "1px solid #f0f0f0",
                                        borderRadius: 14,
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
                                        💳 Metode Pembayaran
                                    </h2>

                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: ".65rem",
                                            marginBottom: "1.5rem",
                                        }}
                                    >
                                        {metodePembayaran.map((m) => (
                                            <label
                                                key={m.id}
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: ".75rem",
                                                    padding: ".9rem 1rem",
                                                    borderRadius: 10,
                                                    cursor: "pointer",
                                                    border: `2px solid ${data.metode_bayar === m.id ? "#111" : "#e5e7eb"}`,
                                                    background:
                                                        data.metode_bayar ===
                                                        m.id
                                                            ? "#f9f9f9"
                                                            : "#fff",
                                                    transition: "all .15s",
                                                }}
                                            >
                                                <input
                                                    type="radio"
                                                    name="metode_bayar"
                                                    value={m.id}
                                                    checked={
                                                        data.metode_bayar ===
                                                        m.id
                                                    }
                                                    onChange={() =>
                                                        setData(
                                                            "metode_bayar",
                                                            m.id,
                                                        )
                                                    }
                                                    style={{ display: "none" }}
                                                />
                                                <span
                                                    style={{
                                                        fontSize: "1.25rem",
                                                    }}
                                                >
                                                    {m.icon}
                                                </span>
                                                <span
                                                    style={{
                                                        fontWeight: 600,
                                                        fontSize: ".9rem",
                                                    }}
                                                >
                                                    {m.label}
                                                </span>
                                                {data.metode_bayar === m.id && (
                                                    <span
                                                        style={{
                                                            marginLeft: "auto",
                                                            color: "#22c55e",
                                                            fontWeight: 700,
                                                        }}
                                                    >
                                                        ✓
                                                    </span>
                                                )}
                                            </label>
                                        ))}
                                    </div>

                                    <div
                                        style={{
                                            display: "flex",
                                            gap: ".75rem",
                                        }}
                                    >
                                        <button
                                            type="button"
                                            onClick={() => setStep(1)}
                                            style={{
                                                flex: 1,
                                                padding: ".8rem",
                                                background: "#f9fafb",
                                                color: "#111",
                                                border: "1.5px solid #e5e7eb",
                                                borderRadius: 10,
                                                fontWeight: 700,
                                                cursor: "pointer",
                                            }}
                                        >
                                            Kembali
                                        </button>

                                        <button
                                            type="submit"
                                            disabled={
                                                !data.metode_bayar || processing
                                            }
                                            style={{
                                                flex: 2,
                                                padding: ".8rem",
                                                background: !data.metode_bayar
                                                    ? "#d1d5db"
                                                    : "#f59e0b",
                                                color: "#111",
                                                border: "none",
                                                borderRadius: 10,
                                                fontWeight: 700,
                                                cursor:
                                                    !data.metode_bayar ||
                                                    processing
                                                        ? "not-allowed"
                                                        : "pointer",
                                                fontSize: ".95rem",
                                            }}
                                        >
                                            {processing
                                                ? "⏳ Memproses..."
                                                : "Buat Pesanan"}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* RINGKASAN KANAN */}
                        <div
                            style={{
                                background: "#fff",
                                border: "1px solid #f0f0f0",
                                borderRadius: 14,
                                padding: "1.25rem",
                                position: "sticky",
                                top: 80,
                            }}
                        >
                            <h3
                                style={{
                                    fontWeight: 700,
                                    marginBottom: "1rem",
                                    fontSize: ".9rem",
                                }}
                            >
                                🛒 Ringkasan ({cart.length} produk)
                            </h3>
                            {cart.map((item, i) => (
                                <div
                                    key={i}
                                    style={{
                                        display: "flex",
                                        gap: ".75rem",
                                        alignItems: "center",
                                        marginBottom: ".75rem",
                                    }}
                                >
                                    <img
                                        src={item.gambar}
                                        alt={item.nama}
                                        style={{
                                            width: 48,
                                            height: 48,
                                            objectFit: "contain",
                                            background: "#f9fafb",
                                            borderRadius: 8,
                                            flexShrink: 0,
                                        }}
                                        onError={(e) =>
                                            (e.target.src =
                                                "https://placehold.co/48x48?text=Img")
                                        }
                                    />
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div
                                            style={{
                                                fontSize: ".8rem",
                                                fontWeight: 600,
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            {item.nama}
                                        </div>
                                        <div
                                            style={{
                                                fontSize: ".7rem",
                                                color: "#888",
                                            }}
                                        >
                                            EU {item.ukuran} · x{item.qty}
                                        </div>
                                    </div>
                                    <div
                                        style={{
                                            fontSize: ".82rem",
                                            fontWeight: 700,
                                            flexShrink: 0,
                                        }}
                                    >
                                        {formatHarga(item.harga * item.qty)}
                                    </div>
                                </div>
                            ))}
                            <div
                                style={{
                                    borderTop: "1px solid #f0f0f0",
                                    paddingTop: ".75rem",
                                    marginTop: ".5rem",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        fontSize: ".82rem",
                                        marginBottom: ".4rem",
                                    }}
                                >
                                    <span style={{ color: "#888" }}>
                                        Subtotal
                                    </span>
                                    <span>{formatHarga(total)}</span>
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        fontSize: ".82rem",
                                        marginBottom: ".75rem",
                                    }}
                                >
                                    <span style={{ color: "#888" }}>
                                        Ongkir
                                    </span>
                                    <span
                                        style={{
                                            color: "#22c55e",
                                            fontWeight: 600,
                                        }}
                                    >
                                        Gratis
                                    </span>
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        fontWeight: 800,
                                        fontSize: "1rem",
                                    }}
                                >
                                    <span>Total</span>
                                    <span>{formatHarga(total)}</span>
                                </div>
                            </div>

                            {/* Info alamat pengiriman di step 2 */}
                            {step === 2 && data.alamat && (
                                <div
                                    style={{
                                        marginTop: ".75rem",
                                        padding: ".75rem",
                                        background: "#f9fafb",
                                        borderRadius: 9,
                                        fontSize: ".75rem",
                                    }}
                                >
                                    <div
                                        style={{
                                            fontWeight: 700,
                                            marginBottom: ".3rem",
                                        }}
                                    >
                                        📍 Dikirim ke:
                                    </div>
                                    <div style={{ color: "#555" }}>
                                        {data.nama}
                                    </div>
                                    <div style={{ color: "#555" }}>
                                        {data.telepon}
                                    </div>
                                    <div
                                        style={{
                                            color: "#888",
                                            marginTop: ".2rem",
                                        }}
                                    >
                                        {data.alamat}
                                        {data.kota ? ", " + data.kota : ""}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </Layout>
    );
}
