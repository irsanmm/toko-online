<?php
// ============================================================
// SIMPAN DI  : app/Http/Controllers/ShopController.php
// TIMPA FILE : yang lama
// ============================================================

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ShopController extends Controller
{
    public function home()
    {
        $featured = Product::aktif()->latest()->take(4)->get();
        return Inertia::render('Home', ['featured' => $featured]);
    }

    public function katalog(Request $request)
    {
        $query = Product::aktif();
        if ($request->brand) {
            $query->where('brand', strtoupper($request->brand));
        }
        return Inertia::render('Katalog', ['products' => $query->get()]);
    }

    public function detail($id)
    {
        $produk = Product::findOrFail($id);
        return Inertia::render('DetailProduk', ['produk' => $produk]);
    }

    public function tentang()   { return Inertia::render('Tentang'); }
    public function kontak()    { return Inertia::render('Kontak'); }
    public function keranjang() { return Inertia::render('Keranjang'); }

    public function submitKontak(Request $request)
    {
        $request->validate([
            'nama'  => 'required|string|max:100',
            'email' => 'required|email',
            'pesan' => 'required|string|max:1000',
        ]);
        return back()->with('success', 'Pesan berhasil dikirim!');
    }

    public function checkout()
    {
        if (!Auth::check()) return redirect()->route('pembeli.login');

        $user = Auth::user();

        // Kirim data alamat pembeli untuk auto-fill
        $alamatPembeli = [
            'nama'     => $user->name,
            'telepon'  => $user->telepon ?? '',
            'alamat'   => $user->alamat  ?? '',
            'kota'     => '',
            'provinsi' => '',
        ];

        return Inertia::render('Checkout', [
            'alamatPembeli' => $alamatPembeli,
        ]);
    }

    public function prosesCheckout(Request $request)
    {
        if (!Auth::check()) return redirect()->route('pembeli.login');

        $request->validate([
            'nama'         => 'required|string',
            'telepon'      => 'required|string',
            'alamat'       => 'required|string',
            'kota'         => 'required|string',
            'metode_bayar' => 'required|string',
            'items'        => 'required|array|min:1',
            'total'        => 'required|numeric',
        ]);

        // Buat nomor pesanan unik
        $nomorPesanan = Order::generateNomor();

        // Buat pesanan
        $order = Order::create([
            'nomor_pesanan'     => $nomorPesanan,
            'user_id'           => Auth::id(),
            'nama_penerima'     => $request->nama,
            'telepon_penerima'  => $request->telepon,
            'alamat_pengiriman' => $request->alamat,
            'kota'              => $request->kota,
            'provinsi'          => $request->provinsi ?? '',
            'metode_bayar'      => $request->metode_bayar,
            'total_harga'       => $request->total,
            'status'            => 'pending',
        ]);

        // Simpan item & kurangi stok
        foreach ($request->items as $item) {
            $product = Product::find($item['id']);
            if ($product) {
                OrderItem::create([
                    'order_id'    => $order->id,
                    'product_id'  => $product->id,
                    'nama_produk' => $product->nama,
                    'brand'       => $product->brand,
                    'ukuran'      => $item['ukuran'],
                    'harga'       => $product->harga,
                    'qty'         => $item['qty'],
                ]);
                // Kurangi stok
                $product->decrement('stok', $item['qty']);
            }
        }

        // Redirect ke halaman Order Success dengan nomor pesanan
        return Inertia::render('OrderSuccess', [
            'nomorPesanan' => $order->nomor_pesanan,
        ]);
    }

    public function orderSuccess()
    {
        return Inertia::render('OrderSuccess');
    }
}