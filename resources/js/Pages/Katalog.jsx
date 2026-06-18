import { Head, Link, router } from "@inertiajs/react";
import Layout from "./Layout";
import ProductCard from "./ProductCard";

export default function Katalog({ products }) {
    const brands = ["Semua", "VANS", "NIKE", "ADIDAS", "CONVERSE"];

    // Ambil brand aktif dari URL
    const params = new URLSearchParams(window.location.search);
    const activeBrand = params.get("brand") || "";

    const filterBrand = (brand) => {
        if (brand === "Semua" || brand === "") {
            router.get("/katalog");
        } else {
            router.get("/katalog", { brand });
        }
    };

    return (
        <Layout>
            <Head title="Katalog | AMENG STORE" />

            <div
                style={{
                    maxWidth: 1200,
                    margin: "0 auto",
                    padding: "3rem 1.5rem",
                }}
            >
                {/* Header */}
                <div style={{ marginBottom: "2rem" }}>
                    <h1 style={{ fontSize: "2rem", fontWeight: 800 }}>
                        Katalog Produk
                    </h1>
                    <p style={{ color: "#888", marginTop: "0.4rem" }}>
                        Temukan sepatu yang kamu impikan!
                    </p>
                </div>

                {/* Filter Brand */}
                <div
                    style={{
                        display: "flex",
                        gap: "0.6rem",
                        flexWrap: "wrap",
                        marginBottom: "2rem",
                    }}
                >
                    {brands.map((brand) => {
                        const isActive =
                            brand === "Semua"
                                ? activeBrand === ""
                                : activeBrand === brand;
                        return (
                            <button
                                key={brand}
                                onClick={() => filterBrand(brand)}
                                style={{
                                    padding: "0.4rem 1.25rem",
                                    borderRadius: 999,
                                    fontSize: "0.85rem",
                                    fontWeight: 700,
                                    cursor: "pointer",
                                    border: "2px solid",
                                    borderColor: isActive ? "#111" : "#d1d5db",
                                    background: isActive ? "#111" : "#fff",
                                    color: isActive ? "#fff" : "#374151",
                                    transition: "all .2s",
                                }}
                            >
                                {brand}
                            </button>
                        );
                    })}
                </div>

                {/* Grid Produk */}
                {products.length === 0 ? (
                    <div
                        style={{
                            textAlign: "center",
                            padding: "5rem 0",
                            color: "#888",
                        }}
                    >
                        <p style={{ fontSize: "3rem" }}>😕</p>
                        <p style={{ marginTop: "1rem" }}>
                            Tidak ada produk untuk brand ini.
                        </p>
                        <button
                            onClick={() => filterBrand("Semua")}
                            style={{
                                marginTop: "1rem",
                                padding: "0.5rem 1.5rem",
                                background: "#111",
                                color: "#fff",
                                border: "none",
                                borderRadius: 8,
                                cursor: "pointer",
                                fontWeight: 700,
                            }}
                        >
                            Lihat Semua
                        </button>
                    </div>
                ) : (
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fill, minmax(240px, 1fr))",
                            gap: "1.25rem",
                        }}
                    >
                        {products.map((produk) => (
                            <ProductCard key={produk.id} produk={produk} />
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
}
