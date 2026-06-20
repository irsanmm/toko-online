<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;

// ===== TOKO (publik) =====
Route::get('/',            [ShopController::class, 'home'])->name('home');
Route::get('/katalog',     [ShopController::class, 'katalog'])->name('katalog');
Route::get('/tentang',     [ShopController::class, 'tentang'])->name('tentang');
Route::get('/kontak',      [ShopController::class, 'kontak'])->name('kontak');
Route::post('/kontak',     [ShopController::class, 'submitKontak'])->name('kontak.submit');
Route::get('/produk/{id}', [ShopController::class, 'detail'])->name('produk.detail');
Route::get('/keranjang',   [ShopController::class, 'keranjang'])->name('keranjang');

// ===== AUTH PEMBELI =====
Route::get('/pembeli/login',     [AuthController::class, 'loginForm'])->name('pembeli.login');
Route::post('/pembeli/login',    [AuthController::class, 'login'])->name('pembeli.login.post');
Route::get('/pembeli/register',  [AuthController::class, 'registerForm'])->name('pembeli.register');
Route::post('/pembeli/register', [AuthController::class, 'register'])->name('pembeli.register.post');
Route::post('/pembeli/logout',   [AuthController::class, 'logout'])->name('pembeli.logout');

// ===== PEMBELI (butuh login) =====
Route::middleware('auth')->group(function () {
    Route::get('/checkout',              [ShopController::class, 'checkout'])->name('checkout');
    Route::post('/checkout/process',     [ShopController::class, 'prosesCheckout'])->name('checkout.process');
    Route::get('/order-success',         [ShopController::class, 'orderSuccess'])->name('order.success');
    Route::get('/pembeli/pesanan',       [AuthController::class, 'pesanan'])->name('pembeli.pesanan');
    Route::post('/pembeli/track-resi',   [AuthController::class, 'trackResi'])->name('pembeli.track.resi');
    Route::post('/pembeli/pesanan-diterima', [AuthController::class, 'pesananDiterima'])->name('pembeli.pesanan.diterima');
    Route::get('/pembeli/profil',        [AuthController::class, 'profil'])->name('pembeli.profil');
    Route::post('/pembeli/profil',       [AuthController::class, 'updateProfil'])->name('pembeli.profil.update');
});

// ===== ADMIN AUTH =====
Route::get('/admin/login',  [AdminController::class, 'loginForm'])->name('admin.login');
Route::post('/admin/login', [AdminController::class, 'login'])->name('admin.login.post');
Route::get('/admin/logout', [AdminController::class, 'logout'])->name('admin.logout');
Route::post('/admin/logout',[AdminController::class, 'logout']);

// ===== ADMIN (butuh login admin) =====
Route::prefix('admin')->name('admin.')->middleware('auth')->group(function () {
    Route::get('/dashboard',              [AdminController::class, 'dashboard'])->name('dashboard');

    // Produk CRUD
    Route::get('/produk',                 [AdminController::class, 'produk'])->name('produk');
    Route::post('/produk',                [AdminController::class, 'storeProduk'])->name('produk.store');
    Route::put('/produk/{id}',            [AdminController::class, 'updateProduk'])->name('produk.update');
    Route::delete('/produk/{id}',         [AdminController::class, 'deleteProduk'])->name('produk.delete');
    Route::delete('/pembeli/{id}',        [AdminController::class, 'deletePembeli'])->name('pembeli.delete');

    // Pesanan
    Route::get('/pesanan',                [AdminController::class, 'pesanan'])->name('pesanan');
    Route::put('/pesanan/{nomor}',        [AdminController::class, 'updatePesanan'])->name('pesanan.update');
    Route::post('/pesanan/{nomor}/resi',  [AdminController::class, 'inputResi'])->name('pesanan.resi');
    Route::get('/pesanan/{nomor}/preview',[AdminController::class, 'previewResi'])->name('pesanan.resi.preview');
    Route::delete('/pesanan/{nomor}', [AdminController::class, 'deletePesanan'])->name('pesanan.delete');

    // Pembeli & Laporan
    Route::get('/pembeli',                [AdminController::class, 'pembeli'])->name('pembeli');
    Route::get('/laporan',                [AdminController::class, 'laporan'])->name('laporan');
});