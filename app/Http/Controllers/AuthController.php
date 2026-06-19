<?php
// ============================================================
// SIMPAN DI  : app/Http/Controllers/AuthController.php
// TIMPA FILE : yang lama — versi final lengkap
// ============================================================

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function loginForm()
    {
        if (Auth::check()) return redirect()->route('home');
        return Inertia::render('LoginPembeli');
    }

    public function login(Request $request)
    {
        $request->validate(['email'=>'required|email','password'=>'required']);
        if (Auth::attempt(['email'=>$request->email,'password'=>$request->password,'role'=>'pembeli'])) {
            $request->session()->regenerate();
            return redirect()->route('home');
        }
        return back()->withErrors(['email'=>'Email atau password salah.']);
    }

    public function registerForm()
    {
        return Inertia::render('RegisterPembeli');
    }

    public function register(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:100',
            'email'    => 'required|email|unique:users',
            'password' => 'required|min:6',
            'telepon'  => 'nullable|string',
            'alamat'   => 'nullable|string',
        ]);
        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'telepon'  => $request->telepon,
            'alamat'   => $request->alamat,
            'role'     => 'pembeli',
        ]);
        Auth::login($user);
        return redirect()->route('home');
    }

    public function pesanan()
    {
        if (!Auth::check()) return redirect()->route('pembeli.login');

        $pesanan = Order::where('user_id', Auth::id())
            ->with('items')->latest()->get()
            ->map(fn($o) => [
                'id'         => $o->nomor_pesanan,
                'tanggal'    => $o->created_at->format('d M Y'),
                'produk'     => $o->items->first()?->nama_produk ?? '-',
                'ukuran'     => $o->items->first()?->ukuran ?? '-',
                'qty'        => $o->items->sum('qty'),
                'total'      => $o->total_harga,
                'metode'     => $o->metode_bayar,
                'status'     => ucfirst($o->status),
                'alamat'     => $o->alamat_pengiriman,
                'kurir'      => $o->kurir,
                'nomor_resi' => $o->nomor_resi,
                'has_resi'   => $o->hasResi(),
            ]);

        // Notifikasi pesanan dikirim/selesai (3 hari terakhir)
        $notifikasi = Order::where('user_id', Auth::id())
            ->whereIn('status', ['dikirim','selesai'])
            ->whereNotNull('nomor_resi')
            ->where('updated_at', '>=', now()->subDays(3))
            ->latest('updated_at')->take(5)->get()
            ->map(fn($o) => [
                'type'       => $o->status,
                'judul'      => $o->status === 'dikirim'
                    ? "Pesanan {$o->nomor_pesanan} sedang dikirim! 🚚"
                    : "Pesanan {$o->nomor_pesanan} telah selesai ✅",
                'pesan'      => $o->status === 'dikirim'
                    ? "Pesananmu sudah dalam perjalanan. Cek resi untuk melacak posisi paket."
                    : "Pesananmu sudah diterima. Jangan lupa berikan ulasan ya!",
                'nomor_resi' => $o->nomor_resi,
                'kurir'      => $o->kurir,
                'waktu'      => $o->updated_at->diffForHumans(),
            ]);

        return Inertia::render('PesananSaya', [
            'pesanan'    => $pesanan,
            'notifikasi' => $notifikasi,
        ]);
    }

    // Pembeli konfirmasi pesanan diterima
    public function pesananDiterima(Request $request)
    {
        if (!Auth::check()) return redirect()->route('pembeli.login');

        $request->validate(['nomor_pesanan' => 'required|string']);

        $order = Order::where('nomor_pesanan', $request->nomor_pesanan)
            ->where('user_id', Auth::id())
            ->where('status', 'dikirim')
            ->firstOrFail();

        $order->update(['status' => 'selesai']);

        return back()->with('success', 'Pesanan dikonfirmasi diterima. Terima kasih!');
    }

    public function trackResi(Request $request)
    {
        if (!Auth::check()) {
            return response()->json(['success'=>false,'message'=>'Silakan login.'], 401);
        }

        $request->validate(['nomor_pesanan'=>'required|string']);

        $order = Order::where('nomor_pesanan', $request->nomor_pesanan)
            ->where('user_id', Auth::id())->first();

        if (!$order) return response()->json(['success'=>false,'message'=>'Pesanan tidak ditemukan.']);
        if (!$order->hasResi()) return response()->json(['success'=>false,'message'=>'Resi belum tersedia.']);

        // Pakai cache 30 menit
        if ($order->tracking_data && $order->resi_updated_at &&
            $order->resi_updated_at->diffInMinutes(now()) < 30) {
            return response()->json(['success'=>true,'data'=>$order->tracking_data]);
        }

        $apiKey = config('services.binderbyte.key');
        if (empty($apiKey)) {
            return response()->json(['success'=>false,'message'=>'API key belum dikonfigurasi.']);
        }

        try {
            $response = \Illuminate\Support\Facades\Http::timeout(15)
                ->withHeaders(['Accept'=>'application/json'])
                ->get('https://api.binderbyte.com/v1/track', [
                    'api_key' => $apiKey,
                    'courier' => strtolower($order->kurir),
                    'awb'     => $order->nomor_resi,
                ]);

            if ($response->successful()) {
                $json = $response->json();
                if (isset($json['status']) && $json['status'] == 200) {
                    $tracking = $this->formatTracking($json['data'], $order->kurir);
                    $order->update(['tracking_data'=>$tracking,'resi_updated_at'=>now()]);
                    return response()->json(['success'=>true,'data'=>$tracking]);
                }
                return response()->json(['success'=>false,'message'=>$json['message']??'Resi tidak ditemukan.']);
            }
            return response()->json(['success'=>false,'message'=>'Gagal koneksi ke Binderbyte.']);
        } catch (\Exception $e) {
            return response()->json(['success'=>false,'message'=>$e->getMessage()]);
        }
    }

    private function formatTracking(array $data, string $kurir): array
    {
        $kurirLabel = [
            'jne'=>'JNE','jnt'=>'J&T Express','sicepat'=>'SiCepat',
            'anteraja'=>'AnterAja','pos'=>'Pos Indonesia','tiki'=>'TIKI',
            'ninja'=>'Ninja Express','lion'=>'Lion Parcel',
        ];

        $summary = $data['summary'] ?? [];
        $history = $data['history'] ?? $data['manifest'] ?? [];

        $riwayat = array_map(function ($h) {
            $deskripsi = $h['desc'] ?? $h['description'] ?? $h['note'] ?? $h['status'] ?? $h['keterangan'] ?? '';
            $lokasi    = $h['location'] ?? $h['city'] ?? $h['cabang'] ?? '';
            $tanggal   = $h['date'] ?? $h['datetime'] ?? $h['timestamp'] ?? '';
            return ['tanggal'=>$tanggal,'deskripsi'=>$deskripsi,'lokasi'=>$lokasi];
        }, $history);

        $statusTerakhir = $summary['desc'] ?? $summary['description'] ?? ($riwayat[0]['deskripsi'] ?? '');

        return [
            'kurir'       => $kurirLabel[$kurir] ?? strtoupper($kurir),
            'kode_kurir'  => $kurir,
            'nomor_resi'  => $summary['awb']        ?? '',
            'status'      => $summary['status']      ?? '',
            'pengirim'    => $summary['shipper']     ?? $summary['sender']    ?? '-',
            'penerima'    => $summary['receiver']    ?? $summary['consignee'] ?? '-',
            'asal'        => $summary['origin']      ?? '-',
            'tujuan'      => $summary['destination'] ?? '-',
            'berat'       => $summary['weight']      ?? '-',
            'layanan'     => $summary['service']     ?? '-',
            'terakhir_di' => $statusTerakhir,
            'riwayat'     => $riwayat,
        ];
    }

    public function profil()
    {
        if (!Auth::check()) return redirect()->route('pembeli.login');
        return Inertia::render('ProfilPembeli', ['pembeli'=>Auth::user()]);
    }

    public function updateProfil(Request $request)
    {
        if (!Auth::check()) return redirect()->route('pembeli.login');
        $request->validate([
            'name'    => 'required|string|max:100',
            'telepon' => 'nullable|string',
            'alamat'  => 'nullable|string',
        ]);
        Auth::user()->update([
            'name'    => $request->name,
            'telepon' => $request->telepon,
            'alamat'  => $request->alamat,
        ]);
        return back()->with('success', 'Profil berhasil diperbarui!');
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect()->route('home');
    }
}