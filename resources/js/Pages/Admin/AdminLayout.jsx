import { Link, router, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function AdminLayout({ children, active, admin }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [notifOpen, setNotifOpen] = useState(false);
    const [userOpen, setUserOpen] = useState(false);

    // Badge angka REAL dari database, dikirim lewat HandleInertiaRequests middleware
    const { adminBadges } = usePage().props;
    const badges = adminBadges || {
        produk: 0,
        pesanan: 0,
        pembeli: 0,
        ulasan: 0,
    };

    const menus = [
        {
            label: "MAIN",
            items: [
                { href: "/admin/dashboard", icon: "🏠", label: "Dashboard" },
            ],
        },
        {
            label: "TOKO",
            items: [
                {
                    href: "/admin/produk",
                    icon: "👟",
                    label: "Produk",
                    badge: String(badges.produk),
                },
                {
                    href: "/admin/pesanan",
                    icon: "📦",
                    label: "Pesanan",
                    badge: badges.pesanan > 0 ? String(badges.pesanan) : null,
                    badgeColor: "#ef4444",
                },
                {
                    href: "/admin/pembeli",
                    icon: "👥",
                    label: "Pembeli",
                    badge: String(badges.pembeli),
                },
                {
                    href: "/admin/ulasan",
                    icon: "⭐",
                    label: "Ulasan",
                    badge: badges.ulasan > 0 ? String(badges.ulasan) : null,
                    badgeColor: "#f59e0b",
                },
            ],
        },
        {
            label: "LAPORAN",
            items: [{ href: "/admin/laporan", icon: "📈", label: "Laporan" }],
        },
        {
            label: "LAINNYA",
            items: [{ href: "/", icon: "🏪", label: "Lihat Toko" }],
        },
    ];

    const notifikasi = [
        {
            icon: "📦",
            text: "Pesanan baru dari Budi Santoso",
            time: "2 mnt lalu",
            color: "#3b82f6",
        },
        {
            icon: "⚠️",
            text: "Stok Adidas Ultraboost menipis",
            time: "1 jam lalu",
            color: "#f59e0b",
        },
        {
            icon: "👥",
            text: "Pembeli baru mendaftar",
            time: "3 jam lalu",
            color: "#22c55e",
        },
        {
            icon: "💰",
            text: "Pembayaran #AS005 dikonfirmasi",
            time: "5 jam lalu",
            color: "#8b5cf6",
        },
    ];

    return (
        <>
            <style>{`
                *{box-sizing:border-box;margin:0;padding:0;}
                body{font-family:'Plus Jakarta Sans',sans-serif;background:#f4f6f9;color:#333;}
                a{text-decoration:none;color:inherit;}
                .sidebar{width:${sidebarOpen ? "240px" : "58px"};background:#1e2a3a;min-height:100vh;position:fixed;top:0;left:0;z-index:100;transition:width .25s;overflow:hidden;display:flex;flex-direction:column;}
                .sidebar-brand{height:54px;display:flex;align-items:center;padding:0 ${sidebarOpen ? "1.25rem" : "0"};justify-content:${sidebarOpen ? "flex-start" : "center"};border-bottom:1px solid #2d3f54;background:#17202e;flex-shrink:0;cursor:pointer;}
                .brand-text{font-size:1.05rem;font-weight:800;color:#fff;white-space:nowrap;}
                .brand-text span{color:#f59e0b;}
                .sidebar-scroll{flex:1;overflow-y:auto;overflow-x:hidden;padding:0.5rem 0;}
                .sidebar-scroll::-webkit-scrollbar{width:3px;}
                .sidebar-scroll::-webkit-scrollbar-thumb{background:#2d3f54;}
                .sec-label{font-size:0.58rem;font-weight:700;color:#3a5068;letter-spacing:.12em;padding:.6rem 1.2rem .25rem;white-space:nowrap;display:${sidebarOpen ? "block" : "none"};}
                .mitem{display:flex;align-items:center;gap:.6rem;padding:.6rem ${sidebarOpen ? "1.2rem" : "0"};justify-content:${sidebarOpen ? "flex-start" : "center"};font-size:.82rem;font-weight:500;color:#7a96b0;transition:all .15s;cursor:pointer;border-left:3px solid transparent;white-space:nowrap;}
                .mitem:hover{background:#253447;color:#fff;}
                .mitem.active{background:#253447;color:#fff;border-left-color:#3b82f6;font-weight:700;}
                .mitem .mi{font-size:.95rem;width:18px;text-align:center;flex-shrink:0;}
                .mbadge{margin-left:auto;font-size:.62rem;font-weight:700;padding:1px 6px;border-radius:999px;background:#3b82f6;color:#fff;display:${sidebarOpen ? "flex" : "none"};}
                .sfooter{padding:.7rem ${sidebarOpen ? "1.2rem" : "0"};border-top:1px solid #2d3f54;display:flex;align-items:center;gap:.6rem;justify-content:${sidebarOpen ? "flex-start" : "center"};flex-shrink:0;}
                .savatar{width:30px;height:30px;border-radius:50%;background:#3b82f6;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:.75rem;flex-shrink:0;}
                .topbar{height:54px;background:#fff;border-bottom:1px solid #e5e7eb;position:sticky;top:0;z-index:90;display:flex;align-items:center;justify-content:space-between;padding:0 1.25rem;box-shadow:0 1px 4px rgba(0,0,0,.05);}
                .tbr{display:flex;align-items:center;gap:.4rem;}
                .ibtn{width:34px;height:34px;border-radius:7px;border:1px solid #e5e7eb;background:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .15s;position:relative;font-size:.9rem;}
                .ibtn:hover{background:#f4f6f9;}
                .ndot{position:absolute;top:5px;right:5px;width:7px;height:7px;border-radius:50%;background:#ef4444;border:1.5px solid #fff;}
                .ddwrap{position:relative;}
                .ddmenu{position:absolute;right:0;top:calc(100%+6px);background:#fff;border:1px solid #e5e7eb;border-radius:10px;min-width:230px;box-shadow:0 8px 24px rgba(0,0,0,.1);overflow:hidden;z-index:200;}
                .dditem{display:flex;align-items:center;gap:8px;padding:.6rem 1rem;font-size:.82rem;color:#374151;transition:background .15s;cursor:pointer;}
                .dditem:hover{background:#f9fafb;}
                .dditem.danger{color:#dc2626;}
                .dditem.danger:hover{background:#fff5f5;}
                .main-wrap{margin-left:${sidebarOpen ? "240px" : "58px"};transition:margin-left .25s;min-height:100vh;}
                .mcontent{padding:1.25rem;}
                .breadcrumb{display:flex;align-items:center;gap:.4rem;font-size:.75rem;color:#888;margin-bottom:1.1rem;}
                .breadcrumb .cur{color:#333;font-weight:600;}
                .card{background:#fff;border-radius:10px;border:1px solid #e5e7eb;box-shadow:0 1px 3px rgba(0,0,0,.04);}
                .card-header{padding:.9rem 1.25rem;border-bottom:1px solid #f0f0f0;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:.5rem;}
                .card-body{padding:1.25rem;}
                table{width:100%;border-collapse:collapse;font-size:.8rem;}
                th{padding:.6rem 1rem;text-align:left;font-weight:700;color:#555;background:#f9fafb;border-bottom:1px solid #f0f0f0;white-space:nowrap;}
                td{padding:.6rem 1rem;border-bottom:1px solid #f9fafb;color:#374151;vertical-align:middle;}
                tr:last-child td{border-bottom:none;}
                tr:hover td{background:#fafbfc;}
                .badge{display:inline-flex;align-items:center;padding:2px 9px;border-radius:999px;font-size:.68rem;font-weight:700;white-space:nowrap;}
                .btn{padding:.45rem .9rem;border-radius:7px;font-size:.78rem;font-weight:700;cursor:pointer;border:none;transition:all .15s;}
                .btn-primary{background:#3b82f6;color:#fff;}
                .btn-primary:hover{background:#2563eb;}
                .btn-success{background:#22c55e;color:#fff;}
                .btn-success:hover{background:#16a34a;}
                .btn-danger{background:#ef4444;color:#fff;}
                .btn-danger:hover{background:#dc2626;}
                .btn-warning{background:#f59e0b;color:#111;}
                .btn-warning:hover{background:#d97706;}
                .btn-outline{background:#fff;color:#374151;border:1px solid #e5e7eb;}
                .btn-outline:hover{background:#f4f6f9;}
                .btn-sm{padding:.25rem .7rem;font-size:.72rem;}
                input,select,textarea{font-family:inherit;}
                .form-input{width:100%;padding:.6rem .9rem;border:1.5px solid #e5e7eb;border-radius:7px;font-size:.85rem;outline:none;background:#fff;transition:border .2s;}
                .form-input:focus{border-color:#3b82f6;}
                .form-label{display:block;font-size:.8rem;font-weight:600;color:#374151;margin-bottom:.35rem;}
                .form-group{margin-bottom:1rem;}
                .tbl-wrap{overflow-x:auto;}
            `}</style>
            <link
                href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
                rel="stylesheet"
            />

            {/* SIDEBAR */}
            <div className="sidebar">
                <div
                    className="sidebar-brand"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                    {sidebarOpen ? (
                        <div className="brand-text">
                            AMENG<span>STORE</span>
                        </div>
                    ) : (
                        <span>🏪</span>
                    )}
                </div>
                <div className="sidebar-scroll">
                    {menus.map((sec, si) => (
                        <div key={si}>
                            <div className="sec-label">{sec.label}</div>
                            {sec.items.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`mitem ${active === item.label ? "active" : ""}`}
                                >
                                    <span className="mi">{item.icon}</span>
                                    {sidebarOpen && <span>{item.label}</span>}
                                    {sidebarOpen && item.badge && (
                                        <span
                                            className="mbadge"
                                            style={{
                                                background:
                                                    item.badgeColor ||
                                                    "#3b82f6",
                                            }}
                                        >
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            ))}
                        </div>
                    ))}
                </div>
                <div className="sfooter">
                    <div className="savatar">
                        {(admin?.name || "A").charAt(0)}
                    </div>
                    {sidebarOpen && (
                        <div style={{ overflow: "hidden" }}>
                            <div
                                style={{
                                    fontSize: ".78rem",
                                    fontWeight: 700,
                                    color: "#fff",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                }}
                            >
                                {admin?.name || "Admin"}
                            </div>
                            <div
                                style={{ fontSize: ".62rem", color: "#3a5068" }}
                            >
                                Administrator
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* MAIN */}
            <div className="main-wrap">
                {/* TOPBAR */}
                <div className="topbar">
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: ".6rem",
                        }}
                    >
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                fontSize: "1rem",
                                color: "#555",
                                padding: "4px",
                            }}
                        >
                            ☰
                        </button>
                        <span
                            style={{
                                fontSize: ".85rem",
                                fontWeight: 600,
                                color: "#333",
                            }}
                        >
                            {active}
                        </span>
                    </div>
                    <div className="tbr">
                        {/* Notif */}
                        <div className="ddwrap">
                            <div
                                className="ibtn"
                                onClick={() => {
                                    setNotifOpen(!notifOpen);
                                    setUserOpen(false);
                                }}
                            >
                                🔔
                                <div className="ndot" />
                            </div>
                            {notifOpen && (
                                <div
                                    className="ddmenu"
                                    style={{ minWidth: 280 }}
                                >
                                    <div
                                        style={{
                                            padding: ".65rem 1rem",
                                            fontWeight: 700,
                                            fontSize: ".82rem",
                                            borderBottom: "1px solid #f0f0f0",
                                        }}
                                    >
                                        Notifikasi
                                    </div>
                                    {notifikasi.map((n, i) => (
                                        <div key={i} className="dditem">
                                            <div
                                                style={{
                                                    width: 30,
                                                    height: 30,
                                                    borderRadius: 7,
                                                    background: n.color + "22",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    fontSize: ".9rem",
                                                    flexShrink: 0,
                                                }}
                                            >
                                                {n.icon}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div
                                                    style={{
                                                        fontSize: ".75rem",
                                                        fontWeight: 500,
                                                    }}
                                                >
                                                    {n.text}
                                                </div>
                                                <div
                                                    style={{
                                                        fontSize: ".65rem",
                                                        color: "#aaa",
                                                        marginTop: "2px",
                                                    }}
                                                >
                                                    {n.time}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        {/* User */}
                        <div className="ddwrap">
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: ".4rem",
                                    padding: ".3rem .7rem",
                                    borderRadius: 7,
                                    border: "1px solid #e5e7eb",
                                    cursor: "pointer",
                                    background: "#fff",
                                }}
                                onClick={() => {
                                    setUserOpen(!userOpen);
                                    setNotifOpen(false);
                                }}
                            >
                                <div
                                    className="savatar"
                                    style={{
                                        width: 24,
                                        height: 24,
                                        fontSize: ".65rem",
                                    }}
                                >
                                    {(admin?.name || "A").charAt(0)}
                                </div>
                                <span
                                    style={{
                                        fontSize: ".78rem",
                                        fontWeight: 600,
                                    }}
                                >
                                    {admin?.name || "Admin"}
                                </span>
                                <span
                                    style={{
                                        fontSize: ".55rem",
                                        color: "#888",
                                    }}
                                >
                                    ▾
                                </span>
                            </div>
                            {userOpen && (
                                <div className="ddmenu">
                                    <div
                                        style={{
                                            padding: ".75rem 1rem",
                                            background: "#f9fafb",
                                            borderBottom: "1px solid #f0f0f0",
                                        }}
                                    >
                                        <div
                                            style={{
                                                fontWeight: 700,
                                                fontSize: ".82rem",
                                            }}
                                        >
                                            {admin?.name}
                                        </div>
                                        <div
                                            style={{
                                                fontSize: ".68rem",
                                                color: "#888",
                                                marginTop: "2px",
                                            }}
                                        >
                                            {admin?.email}
                                        </div>
                                    </div>
                                    <Link href="/" className="dditem">
                                        <span>🏪</span>Lihat Toko
                                    </Link>
                                    <div
                                        style={{
                                            borderTop: "1px solid #f0f0f0",
                                            margin: "3px 0",
                                        }}
                                    />
                                    <div
                                        className="dditem danger"
                                        onClick={() =>
                                            router.get("/admin/logout")
                                        }
                                    >
                                        <span>🚪</span>Keluar
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* CONTENT */}
                <div className="mcontent">
                    <div className="breadcrumb">
                        <Link href="/admin/dashboard">🏠 Dashboard</Link>
                        <span style={{ color: "#d1d5db" }}>/</span>
                        <span className="cur">{active}</span>
                    </div>
                    {children}
                </div>
            </div>
        </>
    );
}
