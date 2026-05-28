<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AdminController extends Controller
{
    private function checkAdmin()
    {
        if (!Auth::check() || Auth::user()->role !== 'admin') {
            return redirect()->route('admin.login');
        }
        return null;
    }

    public function loginForm()
    {
        if (Auth::check() && Auth::user()->role === 'admin') {
            return redirect()->route('admin.dashboard');
        }
        return Inertia::render('Admin/LoginAdmin');
    }

    public function login(Request $request)
    {
        $request->validate(['email' => 'required|email', 'password' => 'required']);
        if (Auth::attempt(['email' => $request->email, 'password' => $request->password, 'role' => 'admin'])) {
            $request->session()->regenerate();
            return redirect()->route('admin.dashboard');
        }
        return back()->withErrors(['email' => 'Email atau password admin salah.']);
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect()->route('admin.login');
    }

    public function dashboard()
    {
        if ($r = $this->checkAdmin()) return $r;

        $stats = [
            ['label'=>'Total Pesanan', 'value'=>Order::count(),           'icon'=>'📦','color'=>'#dbeafe','accent'=>'#3b82f6','sub'=>Order::whereDate('created_at',today())->count().' hari ini','trend'=>'up'],
            ['label'=>'Pendapatan',    'value'=>'Rp '.number_format(Order::where('status','selesai')->sum('total_harga'),0,',','.'), 'icon'=>'💰','color'=>'#dcfce7','accent'=>'#22c55e','sub'=>'Terkonfirmasi','trend'=>'up'],
            ['label'=>'Produk Aktif',  'value'=>Product::where('status','aktif')->count(),     'icon'=>'👟','color'=>'#fef9c3','accent'=>'#f59e0b','sub'=>Product::where('stok','<',8)->count().' menipis','trend'=>''],
            ['label'=>'Total Pembeli', 'value'=>User::where('role','pembeli')->count(),         'icon'=>'👥','color'=>'#fce7f3','accent'=>'#ec4899','sub'=>'Terdaftar','trend'=>'up'],
        ];

        $pesananTerbaru = Order::with(['user','items'])->latest()->take(10)->get()
            ->map(fn($o) => [
                'id'         => $o->nomor_pesanan,
                'pembeli'    => $o->user->name ?? '-',
                'produk'     => $o->items->first()?->nama_produk ?? '-',
                'total'      => $o->total_harga,
                'status'     => ucfirst($o->status),
                'tanggal'    => $o->created_at->format('d M Y'),
                'kurir'      => $o->kurir,
                'nomor_resi' => $o->nomor_resi,
                'has_resi'   => $o->hasResi(),
            ]);

        $produkTerlaris = Product::withCount('orderItems')
            ->orderBy('order_items_count','desc')->take(5)->get()
            ->map(fn($p) => [
                'nama'    => $p->nama,
                'brand'   => $p->brand,
                'terjual' => $p->order_items_count,
                'stok'    => $p->stok,
                'harga'   => $p->harga,
            ]);

        return Inertia::render('Admin/DashboardAdmin', [
            'admin'          => Auth::user(),
            'stats'          => $stats,
            'pesananTerbaru' => $pesananTerbaru,
            'produkTerlaris' => $produkTerlaris,
        ]);
    }

    // ===== PRODUK =====
    public function produk()
    {
        if ($r = $this->checkAdmin()) return $r;
        return Inertia::render('Admin/ProdukAdmin', [
            'admin'    => Auth::user(),
            'products' => Product::latest()->get(),
        ]);
    }

    public function storeProduk(Request $request)
    {
        if ($r = $this->checkAdmin()) return $r;
        $request->validate([
            'nama'=>'required',
            'brand'=>'required',
            'harga'=>'required|numeric',
            'stok'=>'required|integer',
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048', // Add validation for image
        ]);

        $gambarPath = null;
        if ($request->hasFile('gambar')) {
            $gambarPath = $request->file('gambar')->store('products', 'public'); // Store in public/assets/img/products
        }

        Product::create([
            'nama'      => $request->nama,
            'brand'     => strtoupper($request->brand),
            'deskripsi' => $request->deskripsi,
            'harga'     => $request->harga,
            'stok'      => $request->stok,
            'gambar'    => $gambarPath ? '/storage/' . $gambarPath : null,
            'ukuran'    => $request->ukuran ? explode(',', $request->ukuran) : [], // Ensure ukuran is handled
            'status'    => $request->status ?? 'aktif',
            'is_featured' => $request->boolean('is_featured'),
        ]);
        return back()->with('success', 'Produk berhasil ditambahkan.');
    }

    public function updateProduk(Request $request, $id)
    {
        if ($r = $this->checkAdmin()) return $r;
        $request->validate([
            'nama'   => 'required',
            'brand'  => 'required',
            'harga'  => 'required|numeric',
            'stok'   => 'required|integer',
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $product = Product::findOrFail($id);
        $data = $request->only(['nama','brand','deskripsi','harga','stok']);
        $data['status'] = $request->input('status', 'aktif'); // fallback default

        if ($request->has('ukuran')) {
            $data['ukuran'] = is_array($request->ukuran) ? $request->ukuran : explode(',', $request->ukuran);
        }
        $data['is_featured'] = $request->boolean('is_featured');

        // Handle image upload
        if ($request->hasFile('gambar')) {
            // Delete old image if exists
            if ($product->gambar) {
                $oldPath = str_replace('/storage/', '', $product->gambar);
                if (\Storage::disk('public')->exists($oldPath)) {
                    \Storage::disk('public')->delete($oldPath);
                }
            }
            $gambarPath = $request->file('gambar')->store('products', 'public');
            $data['gambar'] = '/storage/' . $gambarPath;
        } elseif ($request->input('gambar') === null && $product->gambar) {
            // If gambar is explicitly set to null (e.g., user removed it) and an old image exists
            $oldPath = str_replace('/storage/', '', $product->gambar);
            if (\Storage::disk('public')->exists($oldPath)) {
                \Storage::disk('public')->delete($oldPath);
            }
            $data['gambar'] = null;
        }

        $product->update($data);
        return back()->with('success', 'Produk berhasil diperbarui.');
    }

    public function deleteProduk($id)
    {
        if ($r = $this->checkAdmin()) return $r;
        Product::findOrFail($id)->delete();
        return back()->with('success', 'Produk berhasil dihapus.');
    }

    // ===== PESANAN =====
    public function pesanan()
    {
        if ($r = $this->checkAdmin()) return $r;
        $pesanan = Order::with(['user','items'])->latest()->get()
            ->map(fn($o) => [
                'id'         => $o->nomor_pesanan,
                'pembeli'    => $o->user->name ?? '-',
                'email'      => $o->user->email ?? '-',
                'produk'     => $o->items->first()?->nama_produk ?? '-',
                'total'      => $o->total_harga,
                'metode'     => $o->metode_bayar,
                'status'     => ucfirst($o->status),
                'tanggal'    => $o->created_at->format('d M Y'),
                'alamat'     => $o->alamat_pengiriman,
                'kurir'      => $o->kurir,
                'nomor_resi' => $o->nomor_resi,
                'has_resi'   => $o->hasResi(),
            ]);

        return Inertia::render('Admin/PesananAdmin', [
            'admin'     => Auth::user(),
            'pesanan'   => $pesanan,
            'kurirList' => [
                'jne'       => 'JNE',
                'jnt'       => 'J&T Express',
                'sicepat'   => 'SiCepat',
                'anteraja'  => 'AnterAja',
                'pos'       => 'Pos Indonesia',
                'tiki'      => 'TIKI',
                'ninja'     => 'Ninja Express',
                'lion'      => 'Lion Parcel',
                'idexpress' => 'ID Express',
                'sap'       => 'SAP Express',
            ],
        ]);
    }

    public function updatePesanan(Request $request, $nomorPesanan)
    {
        if ($r = $this->checkAdmin()) return $r;
        $request->validate(['status' => 'required|string']);
        Order::where('nomor_pesanan', $nomorPesanan)->firstOrFail()
            ->update(['status' => strtolower($request->status)]);
        return back()->with('success', 'Status pesanan diperbarui.');
    }

    /**
     * Admin input resi — otomatis ubah status ke dikirim
     * Pembeli akan melihat notifikasi di halaman Pesanan Saya
     */
    public function inputResi(Request $request, $nomorPesanan)
    {
        if ($r = $this->checkAdmin()) return $r;
        $request->validate([
            'kurir'      => 'required|string',
            'nomor_resi' => 'required|string|min:5',
        ]);

        $order = Order::where('nomor_pesanan', $nomorPesanan)->firstOrFail();
        $order->update([
            'kurir'         => strtolower($request->kurir),
            'nomor_resi'    => $request->nomor_resi,
            'status'        => 'dikirim',   // otomatis ubah ke dikirim
            'tracking_data' => null,        // reset cache tracking
        ]);

        // Notifikasi tersimpan di database (via kolom status & nomor_resi)
        // Pembeli akan melihatnya saat buka halaman Pesanan Saya

        return back()->with('success',
            "✅ Resi {$request->nomor_resi} ({$request->kurir}) berhasil disimpan. Status otomatis berubah ke Dikirim. Pembeli akan melihat notifikasi."
        );
    }

    public function previewResi(Request $request, $nomorPesanan)
    {
        if ($r = $this->checkAdmin()) return $r;

        $order = Order::where('nomor_pesanan', $nomorPesanan)->firstOrFail();
        if (!$order->hasResi()) {
            return response()->json(['success' => false, 'message' => 'Resi belum diinput.']);
        }

        // Cache 30 menit
        if ($order->tracking_data && $order->resi_updated_at &&
            $order->resi_updated_at->diffInMinutes(now()) < 30) {
            return response()->json(['success' => true, 'data' => $order->tracking_data]);
        }

        try {
            $apiKey   = config('services.binderbyte.key');
            $response = \Illuminate\Support\Facades\Http::timeout(15)->get(
                'https://api.binderbyte.com/v1/track',
                ['api_key' => $apiKey, 'courier' => $order->kurir, 'awb' => $order->nomor_resi]
            );
            if ($response->successful()) {
                $data = $response->json();
                if (isset($data['status']) && $data['status'] == 200) {
                    $order->update(['tracking_data' => $data['data'], 'resi_updated_at' => now()]);
                    return response()->json(['success' => true, 'data' => $data['data']]);
                }
                return response()->json(['success' => false, 'message' => $data['message'] ?? 'Tidak ditemukan.']);
            }
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Gagal menghubungi API.']);
        }
        return response()->json(['success' => false, 'message' => 'Tracking gagal.']);
    }

    // ===== PEMBELI =====
    public function pembeli()
    {
        if ($r = $this->checkAdmin()) return $r;
        $pembeli = User::where('role','pembeli')->withCount('orders')->latest()->get()
            ->map(fn($u) => [
                'id'           => $u->id,
                'nama'         => $u->name,
                'email'        => $u->email,
                'telepon'      => $u->telepon ?? '-',
                'alamat'       => $u->alamat ?? '-',
                'totalPesanan' => $u->orders_count,
                'totalBelanja' => Order::where('user_id',$u->id)->sum('total_harga'),
                'bergabung'    => $u->created_at->format('d M Y'),
                'status'       => 'Aktif',
            ]);
        return Inertia::render('Admin/PembeliAdmin', ['admin'=>Auth::user(),'pembeli'=>$pembeli]);
    }

    // ===== LAPORAN =====
    public function laporan()
    {
        if ($r = $this->checkAdmin()) return $r;
        return Inertia::render('Admin/LaporanAdmin', ['admin' => Auth::user()]);
    }
}