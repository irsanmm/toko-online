import { Head, Link, useForm } from "@inertiajs/react";

export default function LoginPembeli() {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
        password: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/pembeli/login");
    };

    return (
        <div
            style={{
                background: "#fff",
                minHeight: "100vh",
                padding: "40px 20px",
            }}
        >
            <Head title="Login Pembeli | AMENG STORE" />

            {/* Judul di Pojok Kiri Atas */}
            <div
                style={{
                    color: "#888",
                    fontSize: "14px",
                    marginBottom: "20px",
                    fontFamily: "sans-serif",
                }}
            ></div>

            <style>{`
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body { font-family: 'Plus Jakarta Sans', sans-serif; }
                
                .card {
                    background: #fff;
                    width: 100%;
                    max-width: 450px;
                    margin: 0 auto;
                    border-radius: 15px;
                    padding: 40px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
                    text-align: center;
                }

                .input-group {
                    text-align: left;
                    margin-bottom: 20px;
                }

                .input-group label {
                    display: block;
                    font-weight: 700;
                    font-size: 14px;
                    margin-bottom: 8px;
                    color: #333;
                }

                .input-wrapper {
                    position: relative;
                    display: flex;
                    align-items: center;
                }

                .input-icon {
                    position: absolute;
                    left: 15px;
                    color: #aaa;
                    width: 18px;
                }

                .input-field {
                    width: 100%;
                    padding: 12px 15px 12px 45px;
                    border: 1px solid #ddd;
                    border-radius: 10px;
                    font-size: 14px;
                    outline: none;
                    transition: border 0.3s;
                }

                .input-field:focus {
                    border-color: #f08519;
                }

                .btn-login {
                    width: 100%;
                    background: #f08519; /* Warna Oranye di Gambar */
                    color: white;
                    border: none;
                    padding: 14px;
                    border-radius: 10px;
                    font-weight: 800;
                    font-size: 16px;
                    cursor: pointer;
                    text-transform: uppercase;
                    margin-top: 10px;
                    transition: opacity 0.3s;
                }

                .btn-login:hover {
                    opacity: 0.9;
                }

                .divider {
                    display: flex;
                    align-items: center;
                    margin: 25px 0;
                    color: #aaa;
                    font-size: 13px;
                }

                .divider::before, .divider::after {
                    content: "";
                    flex: 1;
                    height: 1px;
                    background: #eee;
                    margin: 0 10px;
                }

                .footer-text {
                    font-size: 13px;
                    color: #666;
                }

                .link-orange {
                    color: #f08519;
                    text-decoration: none;
                    font-weight: 700;
                }

                .back-link {
                    display: inline-block;
                    margin-top: 25px;
                    color: #aaa;
                    text-decoration: none;
                    font-size: 13px;
                }
            `}</style>

            <div className="card">
                {/* Logo */}
                <h1
                    style={{
                        fontSize: "24px",
                        fontWeight: "900",
                        marginBottom: "10px",
                    }}
                >
                    AMENG<span style={{ color: "#f08519" }}>STORE</span>
                </h1>

                <p
                    style={{
                        color: "#888",
                        fontSize: "13px",
                        marginBottom: "30px",
                    }}
                >
                    Silahkan Login Untuk Memulai Belanja.
                </p>

                <form onSubmit={handleSubmit}>
                    {/* Email */}
                    <div className="input-group">
                        <label>Email</label>
                        <div className="input-wrapper">
                            <svg
                                className="input-icon"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                            </svg>
                            <input
                                type="email"
                                className="input-field"
                                placeholder="Masukan Email Anda"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                            />
                        </div>
                        {errors.email && (
                            <small style={{ color: "red" }}>
                                {errors.email}
                            </small>
                        )}
                    </div>

                    {/* Password */}
                    <div className="input-group">
                        <label>Password</label>
                        <div className="input-wrapper">
                            <svg
                                className="input-icon"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                />
                            </svg>
                            <input
                                type="password"
                                className="input-field"
                                placeholder="........."
                                value={data.password}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                            />
                        </div>
                        {errors.password && (
                            <small style={{ color: "red" }}>
                                {errors.password}
                            </small>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="btn-login"
                        disabled={processing}
                    >
                        {processing ? "Memproses..." : "Masuk Sekarang"}
                    </button>
                </form>

                <div className="divider">atau</div>

                <p className="footer-text">
                    Belum Punya akun?{" "}
                    <Link href="/pembeli/register" className="link-orange">
                        DAFTAR SEKARANG
                    </Link>
                </p>

                <Link href="/" className="back-link">
                    ← Kembali Keberanda
                </Link>
            </div>
        </div>
    );
}
