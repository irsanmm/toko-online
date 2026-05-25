<?php
// ============================================================
// SIMPAN DI: database/migrations/
// NAMA FILE : 2024_01_02_add_role_to_users_table.php
// ============================================================

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Cek dulu apakah kolom sudah ada, kalau belum baru tambahkan
            if (!Schema::hasColumn('users', 'telepon')) {
                $table->string('telepon')->nullable()->after('email');
            }
            if (!Schema::hasColumn('users', 'alamat')) {
                $table->text('alamat')->nullable()->after('telepon');
            }
            if (!Schema::hasColumn('users', 'role')) {
                $table->enum('role', ['pembeli', 'admin'])->default('pembeli')->after('alamat');
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['telepon', 'alamat', 'role']);
        });
    }
};