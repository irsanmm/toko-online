import { Link, usePage, router } from "@inertiajs/react";
import { useState, useEffect } from "react";

export default function Layout({ children }) {
    const { url, props } = usePage();
    const { auth } = props;
    const isLogin = auth?.isLogin;
    const pembeli = auth?.pembeli;

    const [cartCount, setCartCount] = useState(0);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        const updateCart = () => {
            const cart = JSON.parse(localStorage.getItem("amengCart") || "[]");
            setCartCount(cart.reduce((s, i) => s + i.qty, 0));
        };
        updateCart();
        window.addEventListener("cartUpdated", updateCart);
        return () => window.removeEventListener("cartUpdated", updateCart);
    }, []);

    // Tutup dropdown saat klik di luar
    useEffect(() => {
        const close = (e) => {
            if (!e.target.closest(".dd-wrap")) setDropdownOpen(false);
        };
        document.addEventListener("click", close);
        return () => document.removeEventListener("click", close);
    }, []);

    const handleLogout = () => {
        setDropdownOpen(false);
        router.post("/pembeli/logout");
    };

    const navLinks = [
        { href: "/katalog", label: "Katalog" },
        { href: "/tentang", label: "Tentang" },
        { href: "/kontak", label: "Kontak" },
    ];

    return (
        <>
            <style>{`
                * { box-sizing:border-box; margin:0; padding:0; }
                body { font-family:'Plus Jakarta Sans',sans-serif; background:#fafafa; color:#111; }
                a { text-decoration:none; color:inherit; }

                nav {
                    position:sticky; top:0; z-index:100;
                    background:#fff; border-bottom:1px solid #f0f0f0;
                    display:flex; align-items:center; justify-content:space-between;
                    padding:0 2rem; height:64px;
                    box-shadow:0 1px 8px rgba(0,0,0,.04);
                }
                .logo { font-size:1.3rem; font-weight:800; letter-spacing:-0.5px; color:#111; }
                .logo span { color:#f59e0b; }
                .nav-links { display:flex; gap:2rem; list-style:none; margin-left:2rem; }
                .nav-links a { font-size:.875rem; font-weight:500; color:#666; transition:color .2s; }
                .nav-links a:hover, .nav-links a.active { color:#111; font-weight:700; }
                .nav-right { display:flex; align-items:center; gap:.6rem; }

                /* Keranjang */
                .cart-link {
                    display:flex; align-items:center; gap:6px;
                    background:#f9fafb; border:1px solid #e5e7eb;
                    border-radius:8px; padding:.45rem 1rem;
                    font-size:.85rem; font-weight:600; color:#111;
                    transition:all .2s; position:relative;
                }
                .cart-link:hover { background:#fff9e6; border-color:#f59e0b; }
                .cart-badge {
                    position:absolute; top:-6px; right:-6px;
                    width:18px; height:18px; border-radius:50%;
                    background:#ef4444; color:#fff;
                    font-size:.6rem; font-weight:800;
                    display:flex; align-items:center; justify-content:center;
                    border:2px solid #fff;
                }

                /* Tombol belum login */
                .btn-masuk {
                    padding:.5rem 1.3rem; background:#f59e0b; color:#fff;
                    border:none; border-radius:8px; font-size:.875rem;
                    font-weight:700; cursor:pointer; transition:all .2s;
                }
                .btn-masuk:hover { background:#d97706; }
                .btn-admin {
                    padding:.5rem 1.3rem; background:#fbbf24; color:#111;
                    border:none; border-radius:8px; font-size:.875rem;
                    font-weight:700; cursor:pointer; transition:all .2s;
                }
                .btn-admin:hover { background:#f59e0b; color:#fff; }

                /* Dropdown user sudah login */
                .dd-wrap { position:relative; }
                .user-btn {
                    display:flex; align-items:center; gap:8px;
                    background:#f59e0b; border:none; border-radius:8px;
                    padding:.45rem 1rem; cursor:pointer; transition:all .2s;
                    font-size:.85rem; font-weight:700; color:#fff;
                }
                .user-btn:hover { background:#d97706; }
                .uavatar {
                    width:26px; height:26px; border-radius:50%;
                    background:#fff; color:#f59e0b;
                    display:flex; align-items:center; justify-content:center;
                    font-weight:800; font-size:.75rem; flex-shrink:0;
                }
                .dd-menu {
                    position:absolute; right:0; top:calc(100%+8px);
                    background:#fff; border:1px solid #f0f0f0;
                    border-radius:14px; min-width:230px;
                    box-shadow:0 12px 32px rgba(0,0,0,.1);
                    overflow:hidden; z-index:200;
                }
                .dd-header {
                    padding:1rem; background:#fffbeb;
                    border-bottom:1px solid #f0f0f0;
                }
                .dd-item {
                    display:flex; align-items:center; gap:10px;
                    padding:.7rem 1rem; font-size:.875rem;
                    color:#374151; transition:background .15s; cursor:pointer;
                    text-decoration:none;
                }
                .dd-item:hover { background:#f9fafb; }
                .dd-divider { height:1px; background:#f0f0f0; margin:4px 0; }
                .dd-item.danger { color:#dc2626; }
                .dd-item.danger:hover { background:#fff5f5; }

                footer {
                    background:#111; color:#888;
                    text-align:center; padding:2.5rem 1rem;
                    margin-top:5rem; font-size:.85rem;
                }
            `}</style>

            <link
                href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
                rel="stylesheet"
            />

            {/* ===== NAVBAR ===== */}
            <nav>
                {/* Kiri */}
                <div style={{ display: "flex", alignItems: "center" }}>
                    <Link href="/" className="logo">
                        AMENG<span>STORE</span>
                    </Link>
                    <ul className="nav-links">
                        {navLinks.map((link) => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className={
                                        url.startsWith(link.href)
                                            ? "active"
                                            : ""
                                    }
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Kanan */}
                <div className="nav-right">
                    {isLogin && pembeli ? (
                        /* ===== SUDAH LOGIN ===== */
                        <>
                            {/* Keranjang dengan badge */}
                            <Link href="/keranjang" className="cart-link">
                                🛒 Keranjang
                                {cartCount > 0 && (
                                    <span className="cart-badge">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>

                            {/* Dropdown HAI NAMA */}
                            <div className="dd-wrap">
                                <button
                                    className="user-btn"
                                    onClick={() =>
                                        setDropdownOpen(!dropdownOpen)
                                    }
                                >
                                    <div className="uavatar">
                                        {pembeli.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span>
                                        HAI,{" "}
                                        {pembeli.name
                                            .split(" ")[0]
                                            .toUpperCase()}
                                    </span>
                                    <span style={{ fontSize: ".65rem" }}>
                                        ▾
                                    </span>
                                </button>

                                {dropdownOpen && (
                                    <div className="dd-menu">
                                        {/* Info user */}
                                        <div className="dd-header">
                                            <div
                                                style={{
                                                    fontWeight: 700,
                                                    fontSize: ".9rem",
                                                }}
                                            >
                                                {pembeli.name}
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: ".72rem",
                                                    color: "#888",
                                                    marginTop: "2px",
                                                }}
                                            >
                                                {pembeli.email}
                                            </div>
                                        </div>

                                        {/* Pesanan Saya */}
                                        <Link
                                            href="/pembeli/pesanan"
                                            className="dd-item"
                                            onClick={() =>
                                                setDropdownOpen(false)
                                            }
                                        >
                                            <span style={{ fontSize: "1rem" }}>
                                                📦
                                            </span>
                                            <div>
                                                <div
                                                    style={{ fontWeight: 600 }}
                                                >
                                                    Pesanan Saya
                                                </div>
                                                <div
                                                    style={{
                                                        fontSize: ".72rem",
                                                        color: "#aaa",
                                                    }}
                                                >
                                                    Cek status pesananmu
                                                </div>
                                            </div>
                                        </Link>

                                        {/* Profil */}
                                        <Link
                                            href="/pembeli/profil"
                                            className="dd-item"
                                            onClick={() =>
                                                setDropdownOpen(false)
                                            }
                                        >
                                            <span style={{ fontSize: "1rem" }}>
                                                👤
                                            </span>
                                            <div>
                                                <div
                                                    style={{ fontWeight: 600 }}
                                                >
                                                    Profil Saya
                                                </div>
                                                <div
                                                    style={{
                                                        fontSize: ".72rem",
                                                        color: "#aaa",
                                                    }}
                                                >
                                                    Edit data akun
                                                </div>
                                            </div>
                                        </Link>

                                        <div className="dd-divider" />

                                        {/* Logout */}
                                        <div
                                            className="dd-item danger"
                                            onClick={handleLogout}
                                        >
                                            <span style={{ fontSize: "1rem" }}>
                                                🚪
                                            </span>
                                            <div style={{ fontWeight: 600 }}>
                                                Keluar
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        /* ===== BELUM LOGIN ===== */
                        <>
                            {/* Keranjang tanpa badge */}
                            <Link href="/keranjang" className="cart-link">
                                🛒 ({cartCount})
                            </Link>
                            <Link href="/pembeli/login">
                                <button className="btn-masuk">Masuk</button>
                            </Link>
                            <Link href="/admin/login">
                                <button className="btn-admin">
                                    Admin Login
                                </button>
                            </Link>
                        </>
                    )}
                </div>
            </nav>

            {/* ===== KONTEN ===== */}
            <main>{children}</main>

            {/* ===== FOOTER ===== */}
            <footer>
                <p
                    style={{
                        color: "#fff",
                        fontWeight: 800,
                        fontSize: "1.1rem",
                        marginBottom: ".4rem",
                    }}
                >
                    AMENG<span style={{ color: "#f59e0b" }}>STORE</span>
                </p>
                <p>
                    © {new Date().getFullYear()} Ameng Store. Premium Footwear
                    Indonesia.
                </p>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "1.5rem",
                        marginTop: "1rem",
                    }}
                >
                    <Link
                        href="/katalog"
                        style={{ color: "#666", fontSize: ".8rem" }}
                    >
                        Katalog
                    </Link>
                    <Link
                        href="/tentang"
                        style={{ color: "#666", fontSize: ".8rem" }}
                    >
                        Tentang
                    </Link>
                    <Link
                        href="/kontak"
                        style={{ color: "#666", fontSize: ".8rem" }}
                    >
                        Kontak
                    </Link>
                </div>
            </footer>
        </>
    );
}
