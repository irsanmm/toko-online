<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'telepon',
        'alamat',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password'          => 'hashed',
    ];

    // Relasi ke orders
    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    // Scope pembeli
    public function scopePembeli($query)
    {
        return $query->where('role', 'pembeli');
    }

    // Cek apakah admin
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }
}