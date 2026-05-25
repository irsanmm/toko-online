<?php
// ============================================================
// SIMPAN DI: database/migrations/
// NAMA FILE : 2024_01_05_create_order_items_table.php
// ============================================================

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('order_items')) {
            Schema::create('order_items', function (Blueprint $table) {
                $table->id();
                $table->foreignId('order_id')->constrained()->onDelete('cascade');
                $table->foreignId('product_id')->constrained()->onDelete('cascade');
                $table->string('nama_produk');
                $table->string('brand');
                $table->string('ukuran');
                $table->unsignedBigInteger('harga');
                $table->integer('qty');
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};