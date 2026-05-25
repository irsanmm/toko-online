<?php
// ============================================================
// SIMPAN DI: database/migrations/
// NAMA FILE : 2024_01_03_create_products_table.php
// ============================================================

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('products')) {
            Schema::create('products', function (Blueprint $table) {
                $table->id();
                $table->string('nama');
                $table->string('brand');
                $table->text('deskripsi')->nullable();
                $table->unsignedBigInteger('harga');
                $table->integer('stok')->default(0);
                $table->string('gambar')->nullable();
                $table->json('ukuran')->nullable();
                $table->enum('status', ['aktif', 'nonaktif'])->default('aktif');
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};