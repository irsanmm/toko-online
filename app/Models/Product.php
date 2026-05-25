<?php
// ============================================================
// SIMPAN DI  : app/Models/Product.php
// TIMPA FILE : yang lama
// ============================================================

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama',
        'brand',
        'deskripsi',
        'harga',
        'stok',
        'gambar',
        'ukuran',
        'status',
        'is_featured',
    ];

    protected $casts = [
        'ukuran' => 'array',
    ];

    // Relasi ke order items
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    // Scope produk aktif
    public function scopeAktif($query)
    {
        return $query->where('status', 'aktif');
    }
}