<?php
// ============================================================
// SIMPAN DI  : database/seeders/ProductSeeder.php
// NAMA FILE  : ProductSeeder.php  (huruf P kapital!)
// TIMPA FILE : DatabaseSeeder.php yang ada — BUKAN timpa, tapi buat file BARU
// ============================================================

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('products')->insert([
            [
                'nama'       => 'Vans Authentic Navy White',
                'brand'      => 'VANS',
                'deskripsi'  => 'Sepatu klasik yang wajib dimiliki. Cocok untuk semua gaya kasual dengan bahan kanvas premium.',
                'harga'      => 899000,
                'stok'       => 12,
                'gambar'     => '/assets/img/vans3.webp',
                'ukuran'     => json_encode(['39','40','41','42','43']),
                'status'     => 'aktif',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama'       => 'Nike Air Max 270',
                'brand'      => 'NIKE',
                'deskripsi'  => 'Kenyamanan maksimal dengan bantalan Air Max terbesar untuk aktivitas harian.',
                'harga'      => 1450000,
                'stok'       => 8,
                'gambar'     => '/assets/img/nike1.webp',
                'ukuran'     => json_encode(['40','41','42','43','44']),
                'status'     => 'aktif',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama'       => 'Adidas Ultraboost 22',
                'brand'      => 'ADIDAS',
                'deskripsi'  => 'Teknologi Boost terbaru memberikan energi balik luar biasa di setiap langkah.',
                'harga'      => 1750000,
                'stok'       => 5,
                'gambar'     => '/assets/img/adidas1.webp',
                'ukuran'     => json_encode(['39','40','41','42','43','44']),
                'status'     => 'aktif',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama'       => 'Converse Chuck Taylor All Star',
                'brand'      => 'CONVERSE',
                'deskripsi'  => 'Ikon abadi yang tidak lekang oleh waktu. Padukan dengan outfit apapun.',
                'harga'      => 750000,
                'stok'       => 20,
                'gambar'     => '/assets/img/converse1.webp',
                'ukuran'     => json_encode(['38','39','40','41','42','43']),
                'status'     => 'aktif',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        $this->command->info('✅ 4 produk berhasil ditambahkan!');
    }
}