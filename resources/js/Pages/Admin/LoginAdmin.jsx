import { Head, Link, useForm, usePage } from "@inertiajs/react";

export default function LoginAdmin() {
    const { errors } = usePage().props;
    const { data, setData, post, processing } = useForm({
        email: "",
        password: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/admin/login");
    };

    return (
        <>
            <Head title="Login Admin | AMENG STORE" />
            <style>{`
                * { box-sizing:border-box; margin:0; padding:0; }
                body {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    background: #f8f9fa; 
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem;
                }

                .card {
                    background: #fff;
                    border-radius: 24px; /* Sudut lebih melengkung halus */
                    box-shadow: 0 10px 40px rgba(0,0,0,0.04);
                    padding: 3.5rem 3rem; /* Padding lebih lega */
                    width: 100%;
                    max-width: 480px; /* Diperlebar sesuai permintaan */
                    text-align: center;
                }

                .logo-text {
                    font-size: 2rem;
                    font-weight: 800;
                    color: #000;
                    margin-bottom: 0.5rem;
                    letter-spacing: -1px;
                }

                .logo-text span { color: #f38d31; }

                .subtitle {
                    color: #94a3b8;
                    font-size: 1rem;
                    margin-bottom: 2.5rem;
                }

                .form-group {
                    text-align: justify; /* Label di tengah sesuai gambar */
                    margin-bottom: 1.8rem;
                }

                .label {
                    display: block;
                    font-size: 0.95rem;
                    font-weight: 700;
                    color: #1e293b;
                    margin-bottom: 0.8rem;
                }

                .input-container {
                    position: relative;
                    display: flex;
                    align-items: center;
                }

                .input-container i {
                    position: absolute;
                    left: 18px;
                    color: #cbd5e1;
                    font-size: 1.1rem;
                }

                .input-field {
                    width: 100%;
                    padding: 0.9rem 1rem 0.9rem 3.2rem;
                    border: 1.5px solid #e2e8f0;
                    border-radius: 12px;
                    font-size: 1rem;
                    color: #334155;
                    outline: none;
                    transition: all 0.3s;
                }

                .input-field:focus {
                    border-color: #f38d31;
                    box-shadow: 0 0 0 4px rgba(243, 141, 49, 0.1);
                }

                .input-field::placeholder {
                    color: #cbd5e1;
                }

                .btn-login {
                    width: 100%;
                    padding: 1rem;
                    background: #f38d31;
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-size: 1.1rem;
                    font-weight: 800;
                    cursor: pointer;
                    margin-top: 0.5rem;
                    transition: background 0.3s;
                }

                .btn-login:hover {
                    background: #e67e22;
                }

                .btn-login:disabled {
                    background: #fcd34d;
                    cursor: not-allowed;
                }

                .back-link {
                    display: inline-block;
                    margin-top: 2rem;
                    color: #94a3b8;
                    text-decoration: none;
                    font-size: 0.95rem;
                    transition: color 0.2s;
                }

                .back-link:hover {
                    color: #64748b;
                }

                .error-msg {
                    color: #ef4444;
                    font-size: 0.8rem;
                    margin-top: 0.5rem;
                    text-align: left;
                }
            `}</style>

            {/* Font Awesome untuk Ikon */}
            <link
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
                rel="stylesheet"
            />

            <div className="card">
                <div className="logo-text">
                    AMENG<span>STORE</span>
                </div>
                <p className="subtitle">Hallo Admin!</p>

                <form onSubmit={handleSubmit}>
                    {/* Username Field */}
                    <div className="form-group">
                        <label className="label">Username</label>
                        <div className="input-container">
                            <i className="fa-solid fa-user"></i>
                            <input
                                type="text"
                                className="input-field"
                                placeholder="Username"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                required
                            />
                        </div>
                        {errors?.email && (
                            <p className="error-msg">{errors.email}</p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className="form-group">
                        <label className="label">Password</label>
                        <div className="input-container">
                            <i className="fa-solid fa-lock"></i>
                            <input
                                type="password"
                                className="input-field"
                                placeholder="••••••••"
                                value={data.password}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                required
                            />
                        </div>
                        {errors?.password && (
                            <p className="error-msg">{errors.password}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="btn-login"
                        disabled={processing}
                    >
                        {processing ? "MEMPROSES..." : "LOGIN"}
                    </button>
                </form>

                <Link href="/" className="back-link">
                    <i
                        className="fa-solid fa-arrow-left"
                        style={{ marginRight: "8px" }}
                    ></i>
                    Kembali
                </Link>
            </div>
        </>
    );
}
