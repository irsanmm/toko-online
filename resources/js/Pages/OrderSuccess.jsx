import { Head, Link } from "@inertiajs/react";
import { useEffect, useState } from "react";
import Layout from "./Layout";

export default function OrderSuccess({ nomorPesanan }) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        // Animasi masuk
        setTimeout(() => setShow(true), 100);
        // Pastikan keranjang bersih
        localStorage.removeItem("amengCart");
        window.dispatchEvent(new Event("cartUpdated"));
    }, []);

    const noOrder = nomorPesanan || "#AS-000000";

    const steps = [
        { icon: "✅", label: "Pesanan Diterima", done: true },
        { icon: "💰", label: "Menunggu Pembayaran", done: false },
        { icon: "📦", label: "Dikemas", done: false },
        { icon: "🚚", label: "Dikirim", done: false },
        { icon: "🏠", label: "Diterima", done: false },
    ];

    return (
        <Layout>
            <Head title="Pesanan Berhasil | AMENG STORE" />

            <div
                style={{
                    maxWidth: 560,
                    margin: "0 auto",
                    padding: "4rem 1.5rem",
                    textAlign: "center",
                }}
            >
                {/* Animasi centang */}
                <div
                    style={{
                        width: 90,
                        height: 90,
                        borderRadius: "50%",
                        background: "#dcfce7",
                        margin: "0 auto 1.5rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "2.5rem",
                        transform: show ? "scale(1)" : "scale(0)",
                        transition:
                            "transform .5s cubic-bezier(.34,1.56,.64,1)",
                    }}
                >
                    ✅
                </div>

                <h1
                    style={{
                        fontSize: "1.75rem",
                        fontWeight: 800,
                        marginBottom: ".5rem",
                        opacity: show ? 1 : 0,
                        transform: show ? "none" : "translateY(10px)",
                        transition: "all .5s .2s",
                    }}
                >
                    Pesanan Berhasil! 🎉
                </h1>
                <p
                    style={{
                        color: "#888",
                        marginBottom: "2rem",
                        fontSize: ".95rem",
                        opacity: show ? 1 : 0,
                        transition: "opacity .5s .3s",
                    }}
                >
                    Terima kasih sudah belanja di Ameng Store.
                    <br />
                    Kami segera memproses pesananmu.
                </p>

                {/* Nomor Pesanan */}
                <div
                    style={{
                        background: "#f9fafb",
                        border: "1px solid #f0f0f0",
                        borderRadius: 12,
                        padding: "1.1rem 1.5rem",
                        marginBottom: "2rem",
                        display: "inline-block",
                        opacity: show ? 1 : 0,
                        transition: "opacity .5s .4s",
                    }}
                >
                    <div
                        style={{
                            fontSize: ".75rem",
                            color: "#888",
                            marginBottom: ".3rem",
                        }}
                    >
                        Nomor Pesanan
                    </div>
                    <div
                        style={{
                            fontSize: "1.4rem",
                            fontWeight: 800,
                            color: "#111",
                            letterSpacing: ".05em",
                        }}
                    >
                        {noOrder}
                    </div>
                    <div
                        style={{
                            fontSize: ".72rem",
                            color: "#aaa",
                            marginTop: ".3rem",
                        }}
                    >
                        Simpan nomor ini untuk melacak pesananmu
                    </div>
                </div>

                {/* Tracking Steps */}
                <div
                    style={{
                        background: "#fff",
                        border: "1px solid #f0f0f0",
                        borderRadius: 14,
                        padding: "1.5rem",
                        marginBottom: "2rem",
                        textAlign: "left",
                        opacity: show ? 1 : 0,
                        transition: "opacity .5s .5s",
                    }}
                >
                    <div
                        style={{
                            fontWeight: 700,
                            fontSize: ".9rem",
                            marginBottom: "1.1rem",
                        }}
                    >
                        Status Pesanan
                    </div>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "flex-start", // Diubah ke flex-start agar teks panjang tidak menarik posisi ikon ke bawah
                            justifyContent: "space-between",
                            width: "100%",
                        }}
                    >
                        {steps.map((s, i) => (
                            <div
                                key={i}
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: ".5rem",
                                    flex: 1,
                                    position: "relative",
                                }}
                            >
                                {/* Bagian Ikon dan Garis Penghubung */}
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        width: "100%",
                                        position: "relative",
                                    }}
                                >
                                    {/* Garis Kiri */}
                                    <div
                                        style={{
                                            flex: 1,
                                            height: 2,
                                            background:
                                                i === 0
                                                    ? "transparent" // Hilangkan garis paling kiri di step pertama
                                                    : steps[i - 1].done
                                                      ? "#22c55e"
                                                      : "#f0f0f0",
                                        }}
                                    />

                                    {/* Lingkaran Status / Ikon */}
                                    <div
                                        style={{
                                            width: 36,
                                            height: 36,
                                            borderRadius: "50%",
                                            flexShrink: 0,
                                            background: s.done
                                                ? "#dcfce7"
                                                : "#f9fafb",
                                            border: `2px solid ${s.done ? "#22c55e" : "#e5e7eb"}`,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: "1rem",
                                            zIndex: 1, // Memastikan ikon berada di atas garis pembungkus
                                        }}
                                    >
                                        {s.done ? "✓" : s.icon}
                                    </div>

                                    {/* Garis Kanan */}
                                    <div
                                        style={{
                                            flex: 1,
                                            height: 2,
                                            background:
                                                i === steps.length - 1
                                                    ? "transparent" // Hilangkan garis paling kanan di step terakhir
                                                    : s.done
                                                      ? "#22c55e"
                                                      : "#f0f0f0",
                                        }}
                                    />
                                </div>

                                {/* Label Teks di Bawah Ikon */}
                                <div
                                    style={{
                                        fontSize: ".62rem",
                                        fontWeight: s.done ? 700 : 400,
                                        color: s.done ? "#166534" : "#aaa",
                                        textAlign: "center",
                                        maxWidth: "80px", // Membatasi lebar teks agar rapi saat ganti baris
                                        lineHeight: "1.2",
                                    }}
                                >
                                    {s.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Info WA */}
                <div
                    style={{
                        background: "#eff6ff",
                        border: "1px solid #dbeafe",
                        borderRadius: 10,
                        padding: ".85rem 1rem",
                        marginBottom: "2rem",
                        fontSize: ".82rem",
                        color: "#1d4ed8",
                        textAlign: "left",
                        opacity: show ? 1 : 0,
                        transition: "opacity .5s .6s",
                    }}
                >
                    📱 Tim kami akan menghubungi kamu via{" "}
                    <strong>WhatsApp</strong> untuk konfirmasi pesanan dalam
                    1×24 jam.
                </div>

                {/* Tombol aksi */}
                <div
                    style={{
                        display: "flex",
                        gap: ".75rem",
                        justifyContent: "center",
                        flexWrap: "wrap",
                        opacity: show ? 1 : 0,
                        transition: "opacity .5s .7s",
                    }}
                >
                    <Link
                        href="/pembeli/pesanan"
                        style={{
                            display: "inline-block",
                            background: "#111",
                            color: "#fff",
                            padding: ".75rem 1.75rem",
                            borderRadius: 999,
                            fontWeight: 700,
                            fontSize: ".9rem",
                        }}
                    >
                        📦 Lihat Pesanan
                    </Link>
                    <Link
                        href="/"
                        style={{
                            display: "inline-block",
                            background: "#fff",
                            color: "#111",
                            padding: ".75rem 1.75rem",
                            borderRadius: 999,
                            fontWeight: 700,
                            fontSize: ".9rem",
                            border: "2px solid #e5e7eb",
                        }}
                    >
                        🏠 Kembali ke Toko
                    </Link>
                </div>
            </div>
        </Layout>
    );
}
