<?php
// ============================================================
// SIMPAN DI: database/migrations/
// NAMA FILE : 2024_01_04_create_orders_table.php
// ============================================================

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('orders')) {
            Schema::create('orders', function (Blueprint $table) {
                $table->id();
                $table->string('nomor_pesanan')->unique();
                $table->foreignId('user_id')->constrained()->onDelete('cascade');
                $table->text('alamat_pengiriman');
                $table->string('kota');
                $table->string('provinsi')->nullable();
                $table->string('nama_penerima');
                $table->string('telepon_penerima');
                $table->string('metode_bayar');
                $table->unsignedBigInteger('total_harga')->default(0);
                $table->enum('status', ['pending','diproses','dikirim','selesai','batal'])->default('pending');
                $table->string('kurir')->nullable();
                $table->string('nomor_resi')->nullable();
                $table->json('tracking_data')->nullable();
                $table->timestamp('resi_updated_at')->nullable();
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};