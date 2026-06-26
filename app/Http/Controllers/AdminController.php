<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

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
        $request->validate(['email'=>'required|email','password'=>'required']);
        if (Auth::attempt(['email'=>$request->email,'password'=>$request->password,'role'=>'admin'])) {
            $request->session()->regenerate();
            return redirect()->route('admin.dashboard');
        }
        return back()->withErrors(['email'=>'Email atau password admin salah.']);
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
            ['label'=>'Total Pesanan','value'=>Order::count(),
             'icon'=>'📦','color'=>'#dbeafe','accent'=>'#3b82f6',
             'sub'=>Order::whereDate('created_at',today())->count().' hari ini','trend'=>'up'],
            ['label'=>'Pendapatan','value'=>'Rp '.number_format(Order::where('status','selesai')->sum('total_harga'),0,',','.'),
             'icon'=>'💰','color'=>'#dcfce7','accent'=>'#22c55e',
             'sub'=>'Total terkonfirmasi','trend'=>'up'],
            ['label'=>'Produk Aktif','value'=>Product::where('status','aktif')->count(),
             'icon'=>'👟','color'=>'#fef9c3','accent'=>'#f59e0b',
             'sub'=>Product::where('stok','<',8)->count().' stok menipis','trend'=>''],
            ['label'=>'Total Pembeli','value'=>User::where('role','pembeli')->count(),
             'icon'=>'👥','color'=>'#fce7f3','accent'=>'#ec4899',
             'sub'=>User::where('role','pembeli')->whereMonth('created_at',now()->month)->count().' bulan ini','trend'=>'up'],
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
                'kurirList'      => [
                'jne'=>'JNE','jnt'=>'J&T Express','sicepat'=>'SiCepat',
                'anteraja'=>'AnterAja','pos'=>'Pos Indonesia','tiki'=>'TIKI',
                'ninja'=>'Ninja Express','lion'=>'Lion Parcel',
                'idexpress'=>'ID Express','sap'=>'SAP Express',
            ],
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
            'nama'   => 'required|string',
            'brand'  => 'required|string',
            'harga'  => 'required|numeric|min:0',
            'stok'   => 'required|integer|min:0',
            'gambar' => 'nullable|image|max:2048', // max 2MB
        ]);
    
        $data = [
            'nama'      => $request->nama,
            'brand'     => strtoupper($request->brand),
            'deskripsi' => $request->deskripsi,
            'harga'     => $request->harga,
            'stok'      => $request->stok,
            'ukuran'    => $request->ukuran ?? [],
            'status'    => $request->status ?? 'aktif',
            'is_featured' => $request->boolean('is_featured'),
        ];
    
        // Upload gambar kalau ada file yang dikirim
        if ($request->hasFile('gambar')) {
            $data['gambar'] = $request->file('gambar')->store('produk', 'public');
        }
    
        Product::create($data);
    
        return back()->with('success', 'Produk berhasil ditambahkan.');
    }

    public function updateProduk(Request $request, $id)
    {
        if ($r = $this->checkAdmin()) return $r;
    
        $request->validate([
            'nama'   => 'required|string',
            'brand'  => 'required|string',
            'harga'  => 'required|numeric|min:0',
            'stok'   => 'required|integer|min:0',
            'gambar' => 'nullable|image|max:2048',
        ]);
    
        $product = Product::findOrFail($id);
    
        $data = [
            'nama'      => $request->nama,
            'brand'     => strtoupper($request->brand),
            'deskripsi' => $request->deskripsi,
            'harga'     => $request->harga,
            'stok'      => $request->stok,
            'ukuran'    => $request->ukuran ?? [],
            'status'    => $request->status ?? 'aktif',
            'is_featured' => $request->boolean('is_featured'),
        ];
    
        // Hanya update gambar kalau admin upload file baru
        if ($request->hasFile('gambar')) {
            // Hapus gambar lama dari storage (kalau itu file upload, bukan path /assets/ lama)
            if ($product->gambar && !str_starts_with($product->gambar, '/') &&
                Storage::disk('public')->exists($product->gambar)) {
                Storage::disk('public')->delete($product->gambar);
            }
            $data['gambar'] = $request->file('gambar')->store('produk', 'public');
        }
    
        $product->update($data);
    
        return back()->with('success', 'Produk berhasil diperbarui.');
    }
    
    public function deleteProduk($id)
    {
        if ($r = $this->checkAdmin()) return $r;
    
        $product = Product::findOrFail($id);
    
        // Hapus file gambar dari storage juga
        if ($product->gambar && !str_starts_with($product->gambar, '/') &&
            Storage::disk('public')->exists($product->gambar)) {
            Storage::disk('public')->delete($product->gambar);
        }
    
        $product->delete();
    
        return back()->with('success', 'Produk berhasil dihapus.');
    }

    public function deletePesanan($nomorPesanan)
    {
        if ($r = $this->checkAdmin()) return $r;
    
        $order = Order::where('nomor_pesanan', $nomorPesanan)->firstOrFail();
        $order->delete(); // order_items ikut terhapus otomatis (FK cascade)
    
        return back()->with('success', "Pesanan {$nomorPesanan} berhasil dihapus.");
    }

    public function deletePembeli($id)
    {
        if ($r = $this->checkAdmin()) return $r;
    
        $user = User::where('role', 'pembeli')->findOrFail($id);
        $user->delete(); // pesanan milik pembeli ini ikut terhapus otomatis (FK cascade)
    
        return back()->with('success', 'Pembeli berhasil dihapus.');
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
                'jne'=>'JNE','jnt'=>'J&T Express','sicepat'=>'SiCepat',
                'anteraja'=>'AnterAja','pos'=>'Pos Indonesia','tiki'=>'TIKI',
                'ninja'=>'Ninja Express','lion'=>'Lion Parcel',
                'idexpress'=>'ID Express','sap'=>'SAP Express',
            ],
        ]);
    }

    public function updatePesanan(Request $request, $nomorPesanan)
    {
        if ($r = $this->checkAdmin()) return $r;
        $request->validate(['status'=>'required|string']);
        Order::where('nomor_pesanan',$nomorPesanan)->firstOrFail()
            ->update(['status'=>strtolower($request->status)]);
        return back()->with('success', 'Status pesanan diperbarui.');
    }

    public function inputResi(Request $request, $nomorPesanan)
    {
        if ($r = $this->checkAdmin()) return $r;
        $request->validate([
            'kurir'      => 'required|string',
            'nomor_resi' => 'required|string|min:5',
        ]);
        $order = Order::where('nomor_pesanan',$nomorPesanan)->firstOrFail();
        $order->update([
            'kurir'         => strtolower($request->kurir),
            'nomor_resi'    => $request->nomor_resi,
            'status'        => 'dikirim',
            'tracking_data' => null,
        ]);
        return back()->with('success', "Resi {$request->nomor_resi} berhasil disimpan. Status → Dikirim.");
    }

    public function previewResi(Request $request, $nomorPesanan)
    {
        if ($r = $this->checkAdmin()) return $r;
        $order = Order::where('nomor_pesanan',$nomorPesanan)->firstOrFail();
        if (!$order->hasResi()) {
            return response()->json(['success'=>false,'message'=>'Resi belum diinput.']);
        }
        if ($order->tracking_data && $order->resi_updated_at &&
            $order->resi_updated_at->diffInMinutes(now()) < 30) {
            return response()->json(['success'=>true,'data'=>$order->tracking_data]);
        }
        try {
            $apiKey   = config('services.binderbyte.key');
            $response = \Illuminate\Support\Facades\Http::timeout(15)
                ->get('https://api.binderbyte.com/v1/track', [
                    'api_key' => $apiKey,
                    'courier' => $order->kurir,
                    'awb'     => $order->nomor_resi,
                ]);
            if ($response->successful()) {
                $json = $response->json();
                if (isset($json['status']) && $json['status'] == 200) {
                    $order->update(['tracking_data'=>$json['data'],'resi_updated_at'=>now()]);
                    return response()->json(['success'=>true,'data'=>$json['data']]);
                }
                return response()->json(['success'=>false,'message'=>$json['message']??'Tidak ditemukan.']);
            }
        } catch (\Exception $e) {
            return response()->json(['success'=>false,'message'=>$e->getMessage()]);
        }
        return response()->json(['success'=>false,'message'=>'Tracking gagal.']);
    }

    // ===== PEMBELI =====
    public function pembeli()
    {
        if ($r = $this->checkAdmin()) return $r;
    
        $pembeli = User::where('role', 'pembeli')
            ->withCount('orders')
            ->latest()->get()
            ->map(fn($u) => [
                'id'           => $u->id,
                'nama'         => $u->name,
                'email'        => $u->email,
                'telepon'      => $u->telepon ?? '-',
                'alamat'       => $u->alamat ?? '-',
                'totalPesanan' => $u->orders_count,
                'totalBelanja' => Order::where('user_id', $u->id)->where('status', 'selesai')->sum('total_harga'),
                'bergabung'    => $u->created_at->format('d M Y'),
                'status'       => 'Aktif',
            ]);
    
        return Inertia::render('Admin/PembeliAdmin', [
            'admin'   => Auth::user(),
            'pembeli' => $pembeli,
        ]);
    }

    // ===== LAPORAN =====
    public function laporan()
    {
        if ($r = $this->checkAdmin()) return $r;
    
        $totalPendapatan = Order::where('status', 'selesai')->sum('total_harga');
        $totalPesanan    = Order::count();
        $pesananSelesai  = Order::where('status', 'selesai')->count();
        $totalPembeli    = User::where('role', 'pembeli')->count();
    
        // Penjualan per brand (berdasarkan qty terjual)
        $penjualanBrandRaw = \App\Models\OrderItem::join('products', 'products.id', '=', 'order_items.product_id')
            ->selectRaw('products.brand, SUM(order_items.qty) as total_terjual')
            ->groupBy('products.brand')
            ->orderByDesc('total_terjual')
            ->get();
    
        $totalTerjualSemua = $penjualanBrandRaw->sum('total_terjual') ?: 1;
        $penjualanBrand = $penjualanBrandRaw->map(fn($b) => [
            'brand'   => $b->brand,
            'terjual' => $b->total_terjual,
            'persen'  => round(($b->total_terjual / $totalTerjualSemua) * 100),
        ]);
    
        // Daftar transaksi terbaru — lengkap dengan nama pembeli asli
        $transaksi = Order::with(['user', 'items'])
            ->latest()->take(15)->get()
            ->map(fn($o) => [
                'id'      => $o->nomor_pesanan,
                'pembeli' => $o->user->name ?? '-',
                'produk'  => $o->items->pluck('nama_produk')->implode(', '),
                'qty'     => $o->items->sum('qty'),
                'total'   => $o->total_harga,
                'status'  => ucfirst($o->status),
                'tanggal' => $o->created_at->format('d M Y'),
            ]);
    
        // Top 5 pembeli berdasarkan total belanja (pesanan selesai)
        $topPembeli = User::where('role', 'pembeli')
            ->withSum(['orders' => fn($q) => $q->where('status', 'selesai')], 'total_harga')
            ->withCount(['orders' => fn($q) => $q->where('status', 'selesai')])
            ->orderByDesc('orders_sum_total_harga')
            ->take(5)->get()
            ->filter(fn($u) => $u->orders_sum_total_harga > 0)
            ->values()
            ->map(fn($u) => [
                'nama'         => $u->name,
                'totalBelanja' => $u->orders_sum_total_harga ?? 0,
                'totalPesanan' => $u->orders_count ?? 0,
            ]);
    
        return Inertia::render('Admin/LaporanAdmin', [
            'admin'           => Auth::user(),
            'totalPendapatan' => $totalPendapatan,
            'totalPesanan'    => $totalPesanan,
            'pesananSelesai'  => $pesananSelesai,
            'totalPembeli'    => $totalPembeli,
            'penjualanBrand'  => $penjualanBrand,
            'transaksi'       => $transaksi,
            'topPembeli'      => $topPembeli,
        ]);
    }
}