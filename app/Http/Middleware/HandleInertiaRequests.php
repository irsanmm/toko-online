<?php
// ============================================================
// SIMPAN DI  : app/Http/Middleware/HandleInertiaRequests.php
// TIMPA FILE : yang lama
// ============================================================

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'auth' => [
                'isLogin' => auth()->check() && auth()->user()->role === 'pembeli',
                'pembeli' => auth()->check() ? auth()->user() : null,
            ],
            'flash' => [
                'success' => session('success'),
                'error'   => session('error'),
            ],
        ]);
    }
}