<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            if (!Schema::hasColumn('orders', 'notif_dikirim_dibaca')) {
                $table->boolean('notif_dikirim_dibaca')->default(false)->after('resi_updated_at');
            }
            if (!Schema::hasColumn('orders', 'notif_selesai_dibaca')) {
                $table->boolean('notif_selesai_dibaca')->default(false)->after('notif_dikirim_dibaca');
            }
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['notif_dikirim_dibaca', 'notif_selesai_dibaca']);
        });
    }
};