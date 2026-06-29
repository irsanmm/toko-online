<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'nomor_pesanan',
        'user_id',
        'alamat_pengiriman',
        'kota',
        'provinsi',
        'nama_penerima',
        'telepon_penerima',
        'metode_bayar',
        'bukti_transfer',
        'total_harga',
        'status',
        'kurir',
        'nomor_resi',
        'tracking_data',
        'resi_updated_at',
    ];

    protected $casts = [
        'tracking_data'   => 'array',
        'resi_updated_at' => 'datetime',
    ];

    // Relasi ke User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relasi ke OrderItem
    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    // Generate nomor pesanan unik
    public static function generateNomor(): string
    {
        $prefix = 'AS-';
        $nomor  = $prefix . strtoupper(substr(uniqid(), -6));
        while (self::where('nomor_pesanan', $nomor)->exists()) {
            $nomor = $prefix . strtoupper(substr(uniqid(), -6));
        }
        return $nomor;
    }

    // Cek apakah pesanan punya resi
    public function hasResi(): bool
    {
        return !empty($this->nomor_resi) && !empty($this->kurir);
    }
}