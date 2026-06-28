<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Illuminate\Support\Facades\Auth;
use App\Models\Product;
use App\Models\Order;
use App\Models\User;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $isAdmin = Auth::check() && Auth::user()->role === 'admin';

        return array_merge(parent::share($request), [
            'auth' => [
                'isLogin' => Auth::check() && Auth::user()->role === 'pembeli',
                'pembeli' => Auth::check() ? Auth::user() : null,
            ],
            'flash' => [
                'success' => session('success'),
                'error'   => session('error'),
            ],
            // Badge angka sidebar admin — dihitung real dari database
            'adminBadges' => $isAdmin ? [
                'produk'  => Product::count(),
                'pesanan' => Order::whereIn('status', ['pending', 'diproses'])->count(),
                'pembeli' => User::where('role', 'pembeli')->count(),
                'ulasan'  => \App\Models\Review::count(),
            ] : null,
        ]);
    }
}